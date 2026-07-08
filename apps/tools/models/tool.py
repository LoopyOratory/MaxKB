import uuid_utils.compat as uuid
from django.db import models
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from common.encoder.encoder import SystemEncoder
from common.mixins.app_model_mixin import AppModelMixin
from knowledge.models.knowledge_action import State
from users.models import User


class ToolFolder(MPTTModel, AppModelMixin):
    id = models.CharField(primary_key=True, max_length=64, editable=False, verbose_name="Primary keyid")
    name = models.CharField(max_length=64, verbose_name="FolderName", db_index=True)
    desc = models.CharField(max_length=200, null=True, blank=True, verbose_name="Description")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    parent = TreeForeignKey('self', on_delete=models.DO_NOTHING, null=True, blank=True, related_name='children')

    class Meta:
        db_table = "tool_folder"

    class MPTTMeta:
        order_insertion_by = ['name']


class ToolScope(models.TextChoices):
    SHARED = "SHARED", 'Shared'
    WORKSPACE = "WORKSPACE", "WorkspaceAvailable"
    INTERNAL = "INTERNAL", 'Built-in'


class ToolType(models.TextChoices):
    INTERNAL = "INTERNAL", 'Built-in'
    CUSTOM = "CUSTOM", "Custom"
    SKILL = "SKILL", "Skills"
    MCP = "MCP", "MCPTool"
    DATA_SOURCE = "DATA_SOURCE", "Data source"
    WORKFLOW = "WORKFLOW", "Workflow"


class ToolTaskTypeChoices(models.TextChoices):
    APPLICATION = 'APPLICATION'
    KNOWLEDGE = 'KNOWLEDGE'
    TOOL = 'TOOL'
    TRIGGER = 'TRIGGER'


class Tool(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)
    name = models.CharField(max_length=64, verbose_name="ToolName", db_index=True)
    desc = models.CharField(max_length=128, verbose_name="Description")
    code = models.CharField(max_length=102400, verbose_name="pythonCode")
    input_field_list = models.JSONField(verbose_name="InputFieldList", default=list)
    init_field_list = models.JSONField(verbose_name="StartFieldList", default=list)
    icon = models.CharField(max_length=256, verbose_name="Tool库icon", default="")
    is_active = models.BooleanField(default=True, db_index=True)
    scope = models.CharField(max_length=20, verbose_name='AvailableRange', choices=ToolScope.choices,
                             default=ToolScope.WORKSPACE, db_index=True)
    tool_type = models.CharField(max_length=20, verbose_name='ToolType', choices=ToolType.choices,
                                 default=ToolType.CUSTOM, db_index=True)
    template_id = models.CharField(max_length=128, verbose_name="模版id", null=True, default=None, db_index=True)
    folder = models.ForeignKey(ToolFolder, on_delete=models.DO_NOTHING, verbose_name="Folderid", default='default')
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    init_params = models.CharField(max_length=102400, verbose_name="InitializeParameters", null=True)
    label = models.CharField(max_length=128, verbose_name="Tag", null=True, db_index=True)
    version = models.CharField(max_length=64, verbose_name="Version号", null=True, default=None)

    class Meta:
        db_table = "tool"


class ToolRecord(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    tool = models.ForeignKey(Tool, on_delete=models.SET_NULL, null=True)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    source_type = models.CharField(verbose_name="TriggerTaskType", choices=ToolTaskTypeChoices.choices,
                                   default=ToolTaskTypeChoices.APPLICATION, max_length=256)
    source_id = models.UUIDField(verbose_name="Resourceid")
    meta = models.JSONField(default=dict, encoder=SystemEncoder)
    state = models.CharField(verbose_name='Status', max_length=20, choices=State.choices, default=State.STARTED)
    run_time = models.FloatField(verbose_name="Runtime duration", default=0)

    class Meta:
        db_table = "tool_record"
