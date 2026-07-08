# coding=utf-8
import uuid_utils.compat as uuid

from django.db import models

from common.mixins.app_model_mixin import AppModelMixin
from users.models import User


class Status(models.TextChoices):
    """SystemSettingsType"""
    SUCCESS = "SUCCESS", 'Success'

    ERROR = "ERROR", "Failure"

    DOWNLOAD = "DOWNLOAD", 'Download中'

    PAUSE_DOWNLOAD = "PAUSE_DOWNLOAD", 'PauseDownload'


class Model(AppModelMixin):
    """
    ModelData
    """
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")

    name = models.CharField(max_length=128, verbose_name="Name", db_index=True)

    status = models.CharField(max_length=20, verbose_name='SettingsType', choices=Status.choices,
                              default=Status.SUCCESS, db_index=True)

    model_type = models.CharField(max_length=128, verbose_name="Model type", db_index=True)

    model_name = models.CharField(max_length=128, verbose_name="ModelName", db_index=True)

    user = models.ForeignKey(User, on_delete=models.SET_NULL, db_constraint=False, blank=True, null=True)

    provider = models.CharField(max_length=128, verbose_name='Provider', db_index=True)

    credential = models.CharField(max_length=102400, verbose_name="ModelAuthenticationInfo")

    meta = models.JSONField(verbose_name="Model元Data,Used forStorageDownload,OrErrorInfo", default=dict)

    model_params_form = models.JSONField(verbose_name="ModelParametersConfiguration", default=list)
    workspace_id = models.CharField(max_length=64, verbose_name="Workspace id", default="default", db_index=True)

    class Meta:
        db_table = "model"
        unique_together = ['name', 'workspace_id']
