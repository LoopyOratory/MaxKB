# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: workspace_permission.py
    @date：2025/4/16 18:25
    @desc:
"""

import uuid_utils.compat as uuid
from django.contrib.postgres.fields import ArrayField
from django.db import models

from common.constants.permission_constants import Group, ResourcePermissionGroup, ResourceAuthType, \
    ResourcePermissionRole, ResourcePermission
from users.models import User


class AuthTargetType(models.TextChoices):
    """AuthorizationTarget"""
    KNOWLEDGE = Group.KNOWLEDGE.value, 'Knowledge base'
    APPLICATION = Group.APPLICATION.value, 'Application'
    TOOL = Group.TOOL.value, 'Tool'
    MODEL = Group.MODEL.value, 'Model'


class WorkspaceUserResourcePermission(models.Model):
    """
    WorkspaceUserResourcePermission表
    Used forManageCurrentWorkspaceWhether有PermissionActions 某OneApplicationOrKnowledge base
    """
    id = models.UUIDField(primary_key=True, max_length=128, default=uuid.uuid7, editable=False, verbose_name="Primary keyid")

    workspace_id = models.CharField(max_length=128, verbose_name="Workspace id", default="default", db_index=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="Workspace underUser")

    auth_target_type = models.CharField(verbose_name='AuthorizationTarget', max_length=128, choices=AuthTargetType.choices,
                                        default=AuthTargetType.KNOWLEDGE, db_index=True)
    # Authorization的Knowledge baseOrApplication的id
    target = models.CharField(max_length=128, verbose_name="Knowledge base/Applicationid", db_index=True)

    # AuthorizationType IfRole那么就是Role的Permission  IfPERMISSION
    auth_type = models.CharField(default=False, verbose_name="AuthorizationType", choices=ResourceAuthType.choices,
                                 db_default=ResourceAuthType.ROLE, db_index=True)
    # ResourcePermissionList
    permission_list = ArrayField(verbose_name="PermissionList",
                                 default=list,
                                 base_field=models.CharField(max_length=256,
                                                             blank=True,
                                                             choices=ResourcePermission.choices + ResourcePermissionRole.choices,
                                                             default=ResourcePermission.VIEW))

    create_time = models.DateTimeField(verbose_name="Creation time", auto_now_add=True, db_index=True)

    update_time = models.DateTimeField(verbose_name="ModificationTime", auto_now=True, db_index=True)

    class Meta:
        db_table = "workspace_user_resource_permission"
        unique_together = ('workspace_id', 'user', 'auth_target_type', 'target')
