# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: tool_workflow.py
    @date：2026/3/3 13:59
    @desc:
"""
from django.db import models

from common.mixins.app_model_mixin import AppModelMixin
import uuid_utils.compat as uuid

from tools.models import Tool


class ToolWorkflow(AppModelMixin):
    """
    Knowledge base workflow表
    """
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    tool = models.OneToOneField(Tool, on_delete=models.CASCADE, verbose_name="Tool",
                                db_constraint=False, related_name='workflow')
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    work_flow = models.JSONField(verbose_name="WorkflowData", default=dict)
    is_publish = models.BooleanField(verbose_name="WhetherPublish", default=False, db_index=True)
    publish_time = models.DateTimeField(verbose_name="PublishTime", null=True, blank=True)

    class Meta:
        db_table = "tool_workflow"


class ToolWorkflowVersion(AppModelMixin):
    """
    Knowledge base workflowVersion表 - RecordWorkflowHistoryVersion
    """
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    tool = models.ForeignKey(Tool, on_delete=models.CASCADE, verbose_name="Tool", db_constraint=False)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)
    name = models.CharField(verbose_name="VersionName", max_length=128, default="")
    work_flow = models.JSONField(verbose_name="WorkflowData", default=dict)
    publish_user_id = models.UUIDField(verbose_name="Publish者id", max_length=128, default=None, null=True)
    publish_user_name = models.CharField(verbose_name="Publish者Name", max_length=128, default="")

    class Meta:
        db_table = "tool_workflow_version"
