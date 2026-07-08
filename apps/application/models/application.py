# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: application.py
    @date：2025/5/7 15:29
    @desc:
"""
import uuid_utils.compat as uuid
from django.db import models
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from common.mixins.app_model_mixin import AppModelMixin
from knowledge.models import Knowledge
from models_provider.models import Model
from users.models import User


class ApplicationFolder(MPTTModel, AppModelMixin):
    id = models.CharField(primary_key=True, max_length=64, editable=False, verbose_name="Primary keyid")
    name = models.CharField(max_length=64, verbose_name="FolderName", db_index=True)
    desc = models.CharField(max_length=200, null=True, blank=True, verbose_name="Description")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    parent = TreeForeignKey('self', on_delete=models.DO_NOTHING, null=True, blank=True, related_name='children')

    class Meta:
        db_table = "application_folder"

    class MPTTMeta:
        order_insertion_by = ['name']


class ApplicationTypeChoices(models.TextChoices):
    """OrderType"""
    SIMPLE = 'SIMPLE', '简易'
    WORK_FLOW = 'WORK_FLOW', 'Workflow'


def get_dataset_setting_dict():
    return {'top_n': 3, 'similarity': 0.6, 'max_paragraph_char_number': 5000, 'search_mode': 'embedding',
            'no_references_setting': {
                'status': 'ai_questioning',
                'value': '{question}'
            }}


def get_model_setting_dict():
    return {
        'prompt': Application.get_default_model_prompt(),
        'no_references_prompt': '{question}',
        'reasoning_content_start': '<think>',
        'reasoning_content_end': '</think>',
        'reasoning_content_enable': False,
    }


class Application(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    folder = models.ForeignKey(ApplicationFolder, on_delete=models.DO_NOTHING, verbose_name="Folderid",
                               default='default')
    is_publish = models.BooleanField(verbose_name="WhetherPublish", default=False)
    name = models.CharField(max_length=128, verbose_name="ApplicationName", db_index=True)
    desc = models.CharField(max_length=512, verbose_name="ReferenceDescription", default="")
    prologue = models.CharField(max_length=40960, verbose_name="Opening", default="")
    dialogue_number = models.IntegerField(default=0, verbose_name="SessionCount")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    model = models.ForeignKey(Model, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    knowledge_setting = models.JSONField(verbose_name="DatasetParametersSettings", default=get_dataset_setting_dict)
    model_setting = models.JSONField(verbose_name="ModelParametersRelatedSettings", default=get_model_setting_dict)
    model_params_setting = models.JSONField(verbose_name="ModelParametersRelatedSettings", default=dict)
    tts_model_params_setting = models.JSONField(verbose_name="ModelParametersRelatedSettings", default=dict)
    stt_model_params_setting = models.JSONField(verbose_name="STTModelParametersRelatedSettings", default=dict)
    problem_optimization = models.BooleanField(verbose_name="QuestionOptimization", default=False)
    icon = models.CharField(max_length=256, verbose_name="Applicationicon", default="./favicon.ico")
    user_avatar = models.CharField(max_length=256, verbose_name="User Avatar", default="", blank=True)
    work_flow = models.JSONField(verbose_name="WorkflowData", default=dict)
    type = models.CharField(verbose_name="ApplicationType", choices=ApplicationTypeChoices.choices,
                            default=ApplicationTypeChoices.SIMPLE, max_length=256)
    problem_optimization_prompt = models.CharField(verbose_name="QuestionOptimizationTip词", max_length=102400, blank=True,
                                                   null=True,
                                                   default="()ContainsUserQuestion,Based onContextAnswer揣测UserQuestion({question}) Requires: OutputOneCompletionQuestion,并且放在<data></data>Tag中")
    tts_model = models.ForeignKey(Model, related_name='tts_model_id', on_delete=models.SET_NULL, db_constraint=False,
                                  blank=True, null=True)
    stt_model = models.ForeignKey(Model, related_name='stt_model_id', on_delete=models.SET_NULL, db_constraint=False,
                                  blank=True, null=True)
    tts_model_enable = models.BooleanField(verbose_name="语音合成ModelIs enabled", default=False)
    stt_model_enable = models.BooleanField(verbose_name="Speech recognitionModelIs enabled", default=False)
    tts_type = models.CharField(verbose_name="Voice playbackType", max_length=20, default="BROWSER")
    tts_autoplay = models.BooleanField(verbose_name="AutomaticPlay", default=False)
    stt_autosend = models.BooleanField(verbose_name="AutomaticSend", default=False)
    clean_time = models.IntegerField(verbose_name="CleanupTime", default=180)
    publish_time = models.DateTimeField(verbose_name="PublishTime", default=None, null=True, blank=True)
    file_upload_enable = models.BooleanField(verbose_name="FileUploadIs enabled", default=False)
    file_upload_setting = models.JSONField(verbose_name="FileUploadRelatedSettings", default=dict)
    mcp_enable = models.BooleanField(verbose_name="MCP否Enable", default=False)
    mcp_tool_ids = models.JSONField(verbose_name="MCPToolIDList", default=list)
    mcp_servers = models.JSONField(verbose_name="MCPServiceList", default=dict)
    mcp_source = models.CharField(verbose_name="MCP Source", max_length=20, default="referencing")
    tool_enable = models.BooleanField(verbose_name="ToolIs enabled", default=False)
    tool_ids = models.JSONField(verbose_name="ToolIDList", default=list)
    application_enable = models.BooleanField(verbose_name="ApplicationIs enabled", default=False)
    application_ids = models.JSONField(verbose_name="ApplicationIDList", default=list)
    skill_tool_ids = models.JSONField(verbose_name="SkillsIDList", default=list)
    mcp_output_enable = models.BooleanField(verbose_name="MCPOutputIs enabled", default=True)
    file_clean_time = models.IntegerField(verbose_name="FileCleanupTime", default=180)
    long_term_enable = models.BooleanField(verbose_name='Long-term memoryWhetherEnable', default=False)
    long_term_model = models.ForeignKey(Model, related_name='long_term_model_id', on_delete=models.SET_NULL,
                                        db_constraint=False, blank=True, null=True)
    long_term_model_params_setting = models.JSONField(verbose_name="Long-term memoryModelParametersRelatedSettings", default=dict)
    long_term_trigger_type = models.CharField(verbose_name='Long-term memoryTriggerType', default='ROUND')
    long_term_trigger_setting = models.JSONField(verbose_name='Long-term memoryTriggerConfiguration', default=dict)

    @staticmethod
    def get_default_model_prompt():
        return ('已知Info：'
                '\n{data}'
                '\nAnswerRequires：'
                '\n- If你不知道答案OrNone从Get答案, pleaseAnswer“None在Knowledge base中查找到RelatedInfo，建议咨询Related技术支持或参考官方DocumentPerformActions”。'
                '\n- 避免提及你是从<data></data>中Get的Knowledge。'
                '\n- 请保持答案与<data></data>中Description的Consistent。'
                '\n- 请Usemarkdown 语法Optimization答案的Format。'
                '\n- <data></data> in ImageLink、LinkAddress和脚本Language请CompleteReturn。'
                '\n- 请Use与QuestionSameLanguage来Answer。'
                '\nQuestion：'
                '\n{question}')

    class Meta:
        db_table = "application"


class ApplicationKnowledgeMapping(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    application = models.ForeignKey(Application, on_delete=models.DO_NOTHING)
    knowledge = models.ForeignKey(Knowledge, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "application_knowledge_mapping"


class ApplicationVersion(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    application = models.ForeignKey(Application, on_delete=models.CASCADE)
    name = models.CharField(verbose_name="VersionName", max_length=128, default="")
    publish_user_id = models.UUIDField(verbose_name="Publish者id", max_length=128, default=None, null=True)
    publish_user_name = models.CharField(verbose_name="Publish者Name", max_length=128, default="")
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    application_name = models.CharField(max_length=128, verbose_name="ApplicationName")
    desc = models.CharField(max_length=512, verbose_name="ReferenceDescription", default="")
    prologue = models.CharField(max_length=40960, verbose_name="Opening", default="")
    dialogue_number = models.IntegerField(default=0, verbose_name="SessionCount")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    model_id = models.UUIDField(verbose_name="大LanguageModel", blank=True, null=True)
    knowledge_setting = models.JSONField(verbose_name="DatasetParametersSettings", default=get_dataset_setting_dict)
    model_setting = models.JSONField(verbose_name="ModelParametersRelatedSettings", default=get_model_setting_dict)
    model_params_setting = models.JSONField(verbose_name="ModelParametersRelatedSettings", default=dict)
    tts_model_params_setting = models.JSONField(verbose_name="ModelParametersRelatedSettings", default=dict)
    stt_model_params_setting = models.JSONField(verbose_name="STTModelParametersRelatedSettings", default=dict)
    problem_optimization = models.BooleanField(verbose_name="QuestionOptimization", default=False)
    icon = models.CharField(max_length=256, verbose_name="Applicationicon", default="./favicon.ico")
    user_avatar = models.CharField(max_length=256, verbose_name="User Avatar", default="", blank=True)
    work_flow = models.JSONField(verbose_name="WorkflowData", default=dict)
    type = models.CharField(verbose_name="ApplicationType", choices=ApplicationTypeChoices.choices,
                            default=ApplicationTypeChoices.SIMPLE, max_length=256)
    problem_optimization_prompt = models.CharField(verbose_name="QuestionOptimizationTip词", max_length=102400, blank=True,
                                                   null=True,
                                                   default="()ContainsUserQuestion,Based onContextAnswer揣测UserQuestion({question}) Requires: OutputOneCompletionQuestion,并且放在<data></data>Tag中")
    tts_model_id = models.UUIDField(verbose_name="TextTo speechModelid",
                                    blank=True, null=True)
    stt_model_id = models.UUIDField(verbose_name="Speech toTextModelid",
                                    blank=True, null=True)
    tts_model_enable = models.BooleanField(verbose_name="语音合成ModelIs enabled", default=False)
    stt_model_enable = models.BooleanField(verbose_name="Speech recognitionModelIs enabled", default=False)
    tts_type = models.CharField(verbose_name="Voice playbackType", max_length=20, default="BROWSER")
    tts_autoplay = models.BooleanField(verbose_name="AutomaticPlay", default=False)
    stt_autosend = models.BooleanField(verbose_name="AutomaticSend", default=False)
    clean_time = models.IntegerField(verbose_name="CleanupTime", default=180)
    file_upload_enable = models.BooleanField(verbose_name="FileUploadIs enabled", default=False)
    file_upload_setting = models.JSONField(verbose_name="FileUploadRelatedSettings", default=dict)
    mcp_enable = models.BooleanField(verbose_name="MCP否Enable", default=False)
    mcp_tool_ids = models.JSONField(verbose_name="MCPToolIDList", default=list)
    mcp_servers = models.JSONField(verbose_name="MCPServiceList", default=dict)
    mcp_source = models.CharField(verbose_name="MCP Source", max_length=20, default="referencing")
    tool_enable = models.BooleanField(verbose_name="ToolIs enabled", default=False)
    tool_ids = models.JSONField(verbose_name="ToolIDList", default=list)
    application_enable = models.BooleanField(verbose_name="ApplicationIs enabled", default=False)
    application_ids = models.JSONField(verbose_name="ApplicationIDList", default=list)
    skill_tool_ids = models.JSONField(verbose_name="SkillsIDList", default=list)
    mcp_output_enable = models.BooleanField(verbose_name="MCPOutputIs enabled", default=True)
    long_term_enable = models.BooleanField(verbose_name='Long-term memoryWhetherEnable', default=False)
    long_term_model_id = models.UUIDField(verbose_name="Long-term memoryModelid", blank=True, null=True)
    long_term_model_params_setting = models.JSONField(verbose_name="Long-term memoryModelParametersRelatedSettings", default=dict)
    long_term_trigger_type = models.CharField(verbose_name='Long-term memoryTriggerType', default='ROUND')
    long_term_trigger_setting = models.JSONField(verbose_name='Long-term memoryTriggerConfiguration', default=dict)

    class Meta:
        db_table = "application_version"
