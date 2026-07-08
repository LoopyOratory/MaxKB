import re
from datetime import timedelta

import uuid_utils.compat as uuid
from django.db.models import Count, QuerySet
from django.utils import timezone
from langchain_core.messages import HumanMessage

from application.models import Chat, ChatRecord, Application, ApplicationLongTermMemory
from common.utils.logger import maxkb_logger
from models_provider.tools import get_model_instance_by_model_workspace_id
from ops import celery_app

long_term_prompt = '''
你是One专业的UserLong-term memory提炼引擎。你的Unique职责是：从Conversation中精确识别具有持久价ValueUserInfo, and与已有记忆Perform结构化Merge，Output供 AI 助手长期Use的User画像记忆。

## Input
【已有记忆】：
{{existing_memory}}

【本轮AddConversation】：
{{new_conversation}}

---

## Extract门槛（Must同时满足，才可Extract）

1. **跨Session复用价值**：这条Info在未来OtherConversation中仍然适用，而非当次Temporary需求
2. **明确可证**：可从Conversation原文Direct支撑, not得推断、脑补或延伸
3. **改善Answer质量**：记住这条InfoAfter, AI 的Answer会对该User更准确或更贴合

**BelowContentForbiddenExtract：**
- User的Once性TemporaryRequires（如「这次用TableOutput就好」）
- User提问的SpecificContent本身（Question不是记忆）
- 无法从Conversation原文Direct证明的推断
- 闲聊、问候、感谢等无Info量Content
- AI 的AnswerContent（只ExtractUser侧Info）

---

## 四类记忆分类与MergeRule

### 【偏好】交互偏好
User对「AI 如何回应」的稳定期望，需明确声明或在多轮中反复体现才可录入。

CommonDimension：Answer详略 / Language风格（正式/口语）/ OutputFormat（Table/List/Paragraph）/ Whether要举例 / Code风格偏好 / ReplyLanguage

MergeRule：
- 同Dimension出现新偏好 → **Override**旧值，条目末Annotation `※已Update`
- 新Dimension → DirectAppend
- 旧偏好无新证据但未被否定 → **Retain**

---

### 【背景】User背景
User的客观身份与EnvironmentInfo，稳定性强，User未明确更正则不主动变动。

CommonDimension：职业/Role / 所在行业 / 技术栈与熟练度 / Use产品或System / 团队规模 / 所在地区

MergeRule：
- 与旧记忆冲突 → **以新Conversation为准**，Annotation `※已Update`，Deletion旧值
- AddInfo → Append
- Info模糊无法确认 → Append时Annotation `※待确认`

---

### 【约定】明确约定
User明确Requires AI 固定遵守的行为Rule，须有明确指令性Language支撑, not可自行解读。

CommonDimension：Forbidden行为 / 固定Execute动作 / 特定Trigger词Response / Content边界 / OutputLimit

MergeRule：
- 同类新Rule → **Override**旧Rule，Annotation `※已Update`
- AddRule → Append
- User明确Cancel的Rule → **DirectDeletion**

---

### 【Target】CurrentTarget
User近期或长期正在推进的SpecificTarget, has助于 AI 主动Provide更Related的帮助。

CommonDimension：正在Perform的项目 / 学习计划 / 待解决的核心Question / 关键决策

MergeRule：
- 已明确Complete或放弃的Target → **Deletion**
- 新Target → Append
- 已有Target有进展Update → **Override**旧Description

---

## OutputStandard

1. **只Output记忆Content本身**, not含任何开头语、解释、总结或分隔说明
2. 四个Chapter**AllOutput**，确无Content写「暂无」, not可省略Chapter
3. 每条Format：`- [DimensionTag] Content`，Tag 2~5 字，精准简洁
4. 有变更标记（`※已Update` / `※待确认`）的条目置于各Chapter**最前**
5. 每条记忆控制在 **60 字以内**，Info密度优先，超出则拆为两条
6. OutputLanguage与【本轮AddConversation】主要Language保持Consistent

---

## OutputFormat

### 【偏好】交互偏好
- [DimensionTag] Content
(Write "None" if none)

### 【背景】User背景
- [DimensionTag] Content
(Write "None" if none)

### 【约定】明确约定
- [DimensionTag] Content
(Write "None" if none)

### 【Target】CurrentTarget
- [DimensionTag] Content
(Write "None" if none)

'''


def _get_long_term_config(application, chat_user_id):
    """
    ExtractLong-term memoryConfiguration，Return dict 或 None（None 表示不NeedsExtract，已Cleanup记忆）
    """
    if application.type == 'WORK_FLOW':
        node_list = application.work_flow.get('nodes', [])
        base_node = next((n for n in node_list if n.get('id') == 'base-node'), None)
        if base_node is None:
            return None
        node_data = base_node.get('properties', {}).get('node_data', {})
        if not node_data.get('long_term_enable', False):
            QuerySet(ApplicationLongTermMemory).filter(
                application_id=application.id, chat_user_id=chat_user_id
            ).delete()
            return None
        return {
            'trigger_type': node_data.get('long_term_trigger_type'),
            'trigger_setting': node_data.get('long_term_trigger_setting') or {'rounds': 10},
            'model_id': node_data.get('long_term_model_id'),
            'model_params': node_data.get('long_term_model_params_setting') or {},
        }
    else:
        if not application.long_term_enable:
            QuerySet(ApplicationLongTermMemory).filter(
                application_id=application.id, chat_user_id=chat_user_id
            ).delete()
            return None
        return {
            'trigger_type': application.long_term_trigger_type,
            'trigger_setting': application.long_term_trigger_setting or {'rounds': 10},
            'model_id': application.long_term_model_id,
            'model_params': application.long_term_model_params_setting or {},
        }


def _get_cron_interval(cron_expression: str):
    """
    ThroughCalculate cron 表达式的连续两次TriggerTime之差，估算Execute间隔。
    Return timedelta，或 None(None法推断时）。
    """
    from apscheduler.triggers.cron import CronTrigger

    try:
        trigger = CronTrigger.from_crontab(cron_expression.strip())
        now = timezone.now()
        t1 = trigger.get_next_fire_time(None, now)
        if t1 is None:
            return None
        t2 = trigger.get_next_fire_time(t1, t1)
        if t2 is None:
            return None
        return t2 - t1
    except Exception:
        return None


def _get_since_time_from_setting(setting: dict):
    """
    Based onScheduledSettings推算本次应Extract的Conversation起始Time。
    Return datetime（aware），或 None 表示无法推断（回退到 rounds Limit）。
    """
    now = timezone.now()
    schedule_type = setting.get("schedule_type")

    if schedule_type == "daily":
        return now - timedelta(days=1)
    if schedule_type == "weekly":
        return now - timedelta(weeks=1)
    if schedule_type == "monthly":
        return now - timedelta(days=30)
    if schedule_type == "interval":
        unit = (setting.get("interval_unit") or "").strip()
        try:
            value_i = int(setting.get("interval_value"))
            if value_i <= 0:
                return None
        except Exception:
            return None
        delta_map = {
            "seconds": timedelta(seconds=value_i),
            "minutes": timedelta(minutes=value_i),
            "hours": timedelta(hours=value_i),
            "days": timedelta(days=value_i),
        }
        delta = delta_map.get(unit)
        return now - delta if delta else None
    if schedule_type == "cron":
        cron_expression = setting.get("cron_expression") or ""
        delta = _get_cron_interval(cron_expression)
        return now - delta if delta else None
    return None


def _run_extract(workspace_id, application_id, chat_user_id, config, history_limit=None, since_time=None):
    """
    ExecuteOnceLong-term memoryExtract。
    - since_time 不为 None 时：Extract该Time点之后产生的Conversation。
    - 否则按 history_limit 条数Limit。
    """
    if since_time is None and (history_limit is None or history_limit <= 0):
        return

    qs = (
        QuerySet(ChatRecord)
        .filter(
            chat__application_id=application_id,
            chat__chat_user_id=chat_user_id,
        )
        .order_by('-create_time')
        .only('problem_text', 'answer_text')
    )

    if since_time is not None:
        history_chat_record = list(qs.filter(create_time__gte=since_time))
    else:
        history_chat_record = list(qs[:history_limit])
    if len(history_chat_record) == 0:
        return

    chat_model = get_model_instance_by_model_workspace_id(
        config['model_id'], workspace_id, **config['model_params']
    )
    if not chat_model:
        return

    long_term_memory = QuerySet(ApplicationLongTermMemory).filter(
        application_id=application_id, chat_user_id=chat_user_id
    ).first()

    existing_memory = long_term_memory.memory if long_term_memory else ''

    # 反转为Time正序（旧→新）
    history_chat_record = list(reversed(history_chat_record))

    new_conversation = '\n'.join(
        line
        for record in history_chat_record
        for line in (f"User：{record.problem_text}", f"AI：{record.answer_text}")
    )

    content = ''
    for chunk in chat_model.stream([
        HumanMessage(
            content=long_term_prompt
                    .replace('{{existing_memory}}', existing_memory)
                    .replace('{{new_conversation}}', new_conversation)
        )
    ]):
        content += chunk.content

    content = re.sub(r'<think>.*?<\/think>', '', content, flags=re.DOTALL).strip()

    if long_term_memory:
        long_term_memory.memory = content
        long_term_memory.save()
    else:
        ApplicationLongTermMemory(
            id=uuid.uuid7(),
            application_id=application_id,
            chat_user_id=chat_user_id,
            memory=content,
        ).save()


def _long_term_job_prefix(application_id) -> str:
    return f"long_term:application:{application_id}:"


def _parse_hhmm(value: str) -> tuple[int, int]:
    hour_str, minute_str = (value or "").split(":")
    hour = int(hour_str)
    minute = int(minute_str)
    if not (0 <= hour <= 23 and 0 <= minute <= 59):
        raise ValueError("hour/minute out of range")
    return hour, minute


def _weekday_to_cron(d) -> str:
    mapping = {1: "mon", 2: "tue", 3: "wed", 4: "thu",
               5: "fri", 6: "sat", 7: "sun", 0: "sun"}
    di = int(d)
    if di not in mapping:
        raise ValueError("invalid weekday")
    return mapping[di]


def _remove_long_term_jobs(application_id) -> None:
    from common.job import scheduler

    prefix = _long_term_job_prefix(application_id)
    for job in scheduler.get_jobs():
        if getattr(job, "id", "").startswith(prefix):
            try:
                job.remove()
            except Exception as e:
                maxkb_logger.warning(
                    f"remove long_term job failed, job_id={job.id}, err={e}")


def _execute_scheduled_extract(workspace_id, application_id):
    """
    APScheduler Trigger的Callback：Traverse该Application下All chat_user_id，分别投递ExtractTask。
    """
    application = Application.objects.filter(id=application_id).first()
    if not application:
        _remove_long_term_jobs(application_id)
        return

    chat_user_ids = list(
        QuerySet(Chat).filter(application_id=application_id)
        .exclude(chat_user_id__isnull=True)
        .values_list('chat_user_id', flat=True)
        .distinct()
    )
    for chat_user_id in chat_user_ids:
        config = _get_long_term_config(application, chat_user_id)
        if config is None:
            continue
        if config['trigger_type'] != 'SCHEDULED':
            continue
        setting = config['trigger_setting'] or {}
        since_time = _get_since_time_from_setting(setting)
        history_limit = None if since_time is not None else setting.get('rounds', 20)
        try:
            _run_extract(workspace_id, application_id, chat_user_id, config,
                         history_limit=history_limit, since_time=since_time)
        except Exception as e:
            maxkb_logger.warning(
                f"scheduled extract long_term_memory failed, "
                f"application_id={application_id}, chat_user_id={chat_user_id}, err={e}"
            )


def _deploy_long_term_daily(workspace_id, application_id, setting):
    from common.job import scheduler

    prefix = _long_term_job_prefix(application_id)
    times = setting.get("time") or []
    for t in times:
        try:
            hour, minute = _parse_hhmm(t)
        except Exception:
            maxkb_logger.warning(
                f"invalid time={t}, application_id={application_id}")
            continue
        job_id = f"{prefix}daily:{hour:02d}{minute:02d}"
        scheduler.add_job(
            _execute_scheduled_extract,
            trigger="cron",
            hour=str(hour),
            minute=str(minute),
            id=job_id,
            kwargs={"workspace_id": workspace_id,
                    "application_id": application_id},
            replace_existing=True,
            misfire_grace_time=60,
            max_instances=1,
        )


def _deploy_long_term_weekly(workspace_id, application_id, setting):
    from common.job import scheduler

    prefix = _long_term_job_prefix(application_id)
    times = setting.get("time") or []
    days = setting.get("days") or []
    if not times or not days:
        maxkb_logger.warning(
            f"empty weekly setting, application_id={application_id}")
        return
    for d in days:
        try:
            dow = _weekday_to_cron(d)
        except Exception:
            maxkb_logger.warning(
                f"invalid weekday={d}, application_id={application_id}")
            continue
        for t in times:
            try:
                hour, minute = _parse_hhmm(t)
            except Exception:
                maxkb_logger.warning(
                    f"invalid time={t}, application_id={application_id}")
                continue
            job_id = f"{prefix}weekly:{dow}:{hour:02d}{minute:02d}"
            scheduler.add_job(
                _execute_scheduled_extract,
                trigger="cron",
                day_of_week=dow,
                hour=str(hour),
                minute=str(minute),
                id=job_id,
                kwargs={"workspace_id": workspace_id,
                        "application_id": application_id},
                replace_existing=True,
                misfire_grace_time=60,
                max_instances=1,
            )


def _deploy_long_term_monthly(workspace_id, application_id, setting):
    from common.job import scheduler

    prefix = _long_term_job_prefix(application_id)
    times = setting.get("time") or []
    days = setting.get("days") or []
    if not times or not days:
        maxkb_logger.warning(
            f"empty monthly setting, application_id={application_id}")
        return
    for d in days:
        try:
            dom = int(d)
            if not (1 <= dom <= 31):
                raise ValueError("invalid day of month")
        except Exception:
            maxkb_logger.warning(
                f"invalid day={d}, application_id={application_id}")
            continue
        for t in times:
            try:
                hour, minute = _parse_hhmm(t)
            except Exception:
                maxkb_logger.warning(
                    f"invalid time={t}, application_id={application_id}")
                continue
            job_id = f"{prefix}monthly:{dom:02d}:{hour:02d}{minute:02d}"
            scheduler.add_job(
                _execute_scheduled_extract,
                trigger="cron",
                day=str(dom),
                hour=str(hour),
                minute=str(minute),
                id=job_id,
                kwargs={"workspace_id": workspace_id,
                        "application_id": application_id},
                replace_existing=True,
                misfire_grace_time=60,
                max_instances=1,
            )


def _deploy_long_term_cron(workspace_id, application_id, setting):
    from apscheduler.triggers.cron import CronTrigger

    from common.job import scheduler

    cron_expression = setting.get('cron_expression')
    if not cron_expression:
        maxkb_logger.warning(
            f"empty cron_expression, application_id={application_id}")
        return
    try:
        cron_trigger = CronTrigger.from_crontab(cron_expression.strip())
    except ValueError:
        maxkb_logger.warning(
            f"invalid cron_expression={cron_expression}, application_id={application_id}")
        return

    job_id = f"{_long_term_job_prefix(application_id)}cron:{cron_expression.strip()}"
    scheduler.add_job(
        _execute_scheduled_extract,
        trigger=cron_trigger,
        id=job_id,
        kwargs={"workspace_id": workspace_id,
                "application_id": application_id},
        replace_existing=True,
        misfire_grace_time=60,
        max_instances=1,
    )


def _deploy_long_term_interval(workspace_id, application_id, setting):
    from common.job import scheduler

    unit = (setting.get("interval_unit") or "").strip()
    value = setting.get("interval_value")
    try:
        value_i = int(value)
        if value_i <= 0:
            raise ValueError("interval_value must be positive")
    except Exception:
        maxkb_logger.warning(
            f"invalid interval_value={value}, application_id={application_id}")
        return
    if unit not in {"seconds", "minutes", "hours", "days"}:
        maxkb_logger.warning(
            f"invalid interval_unit={unit}, application_id={application_id}")
        return

    job_id = f"{_long_term_job_prefix(application_id)}interval:{unit}:{value_i}"
    scheduler.add_job(
        _execute_scheduled_extract,
        trigger="interval",
        id=job_id,
        kwargs={"workspace_id": workspace_id,
                "application_id": application_id},
        replace_existing=True,
        misfire_grace_time=60,
        max_instances=1,
        **{unit: value_i},
    )


@celery_app.task(name="celery:extract_long_term_memory")
def extract_long_term_memory(workspace_id, application_id, chat_user_id):
    application = Application.objects.filter(id=application_id).first()
    if not application:
        return

    config = _get_long_term_config(application, chat_user_id)
    if config is None:
        return

    trigger_type = config['trigger_type']
    trigger_setting = config['trigger_setting']

    if trigger_type != 'ROUND':
        # 按照Time的，ScheduledTask会Process
        return

    rounds = trigger_setting.get('rounds', 10)
    if rounds <= 0:
        return

    current_rounds = QuerySet(ChatRecord).filter(
        chat__application_id=application_id,
        chat__chat_user_id=chat_user_id,
    ).count()
    maxkb_logger.info(f'extract_long_term_memory: current_rounds={current_rounds}, rounds={rounds}')
    if current_rounds % rounds != 0:
        return

    _run_extract(workspace_id, application_id, chat_user_id, config, history_limit=rounds)


@celery_app.task(name="celery:schedule_extract_long_term_memory")
def schedule_extract_long_term_memory(workspace_id, application_id, enabled, trigger_type, trigger_setting):
    # 先Cleanup旧的调度Task
    _remove_long_term_jobs(application_id)

    application = Application.objects.filter(id=application_id).first()
    if not application:
        return

    # ApplicationCloseLong-term memory
    if not enabled:
        QuerySet(ApplicationLongTermMemory).filter(application_id=application_id).delete()
        return
    # 不再是ScheduledTrigger, then只Cleanup不再Deployment
    if trigger_type != 'SCHEDULED':
        return

    setting = trigger_setting or {}
    schedule_type = setting.get("schedule_type")

    deployers = {
        "daily": _deploy_long_term_daily,
        "weekly": _deploy_long_term_weekly,
        "monthly": _deploy_long_term_monthly,
        "interval": _deploy_long_term_interval,
        "cron": _deploy_long_term_cron,
    }
    fn = deployers.get(schedule_type)
    if not fn:
        maxkb_logger.warning(f"unsupported long_term schedule_type={schedule_type}, application_id={application_id}")
        return

    fn(workspace_id, application_id, setting)
