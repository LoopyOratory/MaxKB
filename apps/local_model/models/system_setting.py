# coding=utf-8
"""
    @project: maxkb
    @Author: Tiger
    @file: system_management.py
    @date：2024/3/19 13:47
    @desc: EmailManage
"""

from django.db import models

from common.mixins.app_model_mixin import AppModelMixin


class SettingType(models.IntegerChoices):
    """SystemSettingsType"""
    EMAIL = 0, 'Email'

    RSA = 1, "Private keySecret key"

    LOG = 2, "LogCleanupTime"


class SystemSetting(AppModelMixin):
    """
     SystemSettings
    """
    type = models.IntegerField(primary_key=True, verbose_name='SettingsType', choices=SettingType.choices,
                               default=SettingType.EMAIL)

    meta = models.JSONField(verbose_name="ConfigurationData", default=dict)

    class Meta:
        db_table = "system_setting"
