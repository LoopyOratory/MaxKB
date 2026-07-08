# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: log_management.py
    @date：2025/6/4 14:15
    @desc:
"""
import uuid_utils.compat as uuid

from django.db import models

from common.encoder.encoder import SystemEncoder
from common.mixins.app_model_mixin import AppModelMixin


class Log(AppModelMixin):
    """
    AuditLog
    """
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")

    menu = models.CharField(max_length=128, verbose_name="ActionsMenu")

    operate = models.CharField(max_length=128, verbose_name="Actions", db_index=True)

    operation_object = models.JSONField(verbose_name="ActionsObject", default=dict, encoder=SystemEncoder)

    user = models.JSONField(verbose_name="UserInfo", default=dict)

    status = models.IntegerField(verbose_name="Status", db_index=True)

    ip_address = models.CharField(max_length=128, verbose_name="ipAddress")

    details = models.JSONField(verbose_name="Details", default=dict, encoder=SystemEncoder)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)

    class Meta:
        db_table = "log"
