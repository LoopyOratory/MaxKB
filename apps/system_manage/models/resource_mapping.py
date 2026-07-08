# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: resource_mapping.py
    @date：2025/12/19 15:41
    @desc:
"""
from django.db import models
import uuid_utils.compat as uuid

from common.constants.permission_constants import Group
from common.mixins.app_model_mixin import AppModelMixin


class ResourceType(models.TextChoices):
    KNOWLEDGE = Group.KNOWLEDGE.value, 'Knowledge base'
    APPLICATION = Group.APPLICATION.value, 'Application'
    TOOL = Group.TOOL.value, 'Tool'
    MODEL = Group.MODEL.value, 'Model'


class ResourceMapping(AppModelMixin):
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")
    source_type = models.CharField(verbose_name="AssociationResource type", choices=ResourceType.choices, db_index=True)
    target_type = models.CharField(verbose_name="被AssociationResource type", choices=ResourceType.choices, db_index=True)
    source_id = models.CharField(max_length=128, verbose_name="AssociationResourceid", db_index=True)
    target_id = models.CharField(max_length=128, verbose_name="被AssociationResourceid", db_index=True)

    class Meta:
        db_table = "resource_mapping"
