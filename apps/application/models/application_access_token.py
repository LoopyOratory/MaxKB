# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: application_access_token.py
    @date：2025/5/27 9:55
    @desc:
"""
from django.contrib.postgres.fields import ArrayField
from django.db import models

from application.models.application import Application
from common.mixins.app_model_mixin import AppModelMixin


class ApplicationAccessToken(AppModelMixin):
    """
    ApplicationAuthenticationtoken
    """
    application = models.OneToOneField(Application, primary_key=True, on_delete=models.CASCADE, verbose_name="Applicationid")
    access_token = models.CharField(max_length=128, verbose_name="User公开Access Authenticationtoken", unique=True)
    is_active = models.BooleanField(default=True, verbose_name="WhetherEnable公开Access")
    access_num = models.IntegerField(default=100, verbose_name="AccessCount")
    white_active = models.BooleanField(default=False, verbose_name="WhetherEnable白名单")
    white_list = ArrayField(verbose_name="白名单List",
                            base_field=models.CharField(max_length=128, blank=True)
                            , default=list)
    show_source = models.BooleanField(default=False, verbose_name="WhetherShowKnowledgeSource")
    show_exec = models.BooleanField(default=False, verbose_name="WhetherShowExecuteDetails")
    authentication = models.BooleanField(default=False, verbose_name="WhetherNeedsAuthentication")
    authentication_value = models.JSONField(verbose_name="Authentication的值", default=dict)

    language = models.CharField(max_length=10, verbose_name="Language", default=None, null=True)

    class Meta:
        db_table = "application_access_token"
