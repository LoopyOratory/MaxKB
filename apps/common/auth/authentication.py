# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: authentication.py
    @date：2025/4/15 20:12
    @desc:
"""
from typing import List

from django.utils.translation import gettext_lazy as _
from rest_framework.request import Request

from common.constants.permission_constants import PermissionConstants, RoleConstants, ViewPermission, CompareConstants, \
    Permission, Role
from common.exception.app_exception import AppUnauthorizedFailed


def exist_permissions_by_permission_constants(user_permission: List[PermissionConstants],
                                              permission_list: List[PermissionConstants]):
    """
    UserWhetherHas permission_list的Permission
    :param user_permission:  UserPermission
    :param permission_list:  Needs的Permission
    :return: WhetherHas
    """
    return any(list(map(lambda up: permission_list.__contains__(up), user_permission)))


def exist_role_by_role_constants(user_role: List[RoleConstants],
                                 role_list: List[RoleConstants]):
    """
    UserWhetherHas这个Role
    :param user_role: UserRole
    :param role_list: NeedsHas的Role
    :return:  WhetherHas
    """
    return any([True for role in role_list if user_role.__contains__(role.value.__str__())])


def exist_permissions_by_view_permission(user_role: List[RoleConstants],
                                         user_permission: List[PermissionConstants | object],
                                         permission: ViewPermission, request, **kwargs):
    """
    UserWhetherExists这些Permission
    :param request:
    :param user_role:        UserRole
    :param user_permission:  UserPermission
    :param permission:       所属Permission
    :return:                 WhetherExists True False
    """

    role_list = [user_r(request, kwargs) if callable(user_r) else user_r for user_r in
                 permission.roleList]
    role_ok = any(list(map(lambda up: role_list.__contains__(up),
                           user_role)))
    permission_list = [user_p(request, kwargs) if callable(user_p) else user_p for user_p in
                       permission.permissionList
                       ]
    permission_ok = any(list(map(lambda up: permission_list.__contains__(up),
                                 user_permission)))
    return role_ok | permission_ok if permission.compare == CompareConstants.OR else role_ok & permission_ok


def exist_permissions(user_role: List[RoleConstants], user_permission: List[PermissionConstants], permission, request,
                      **kwargs):
    if isinstance(permission, ViewPermission):
        return exist_permissions_by_view_permission(user_role, user_permission, permission, request, **kwargs)
    if isinstance(permission, RoleConstants):
        return exist_role_by_role_constants(user_role, [permission])
    if isinstance(permission, PermissionConstants):
        return exist_permissions_by_permission_constants(user_permission, [permission])
    if isinstance(permission, Permission):
        return user_permission.__contains__(permission)
    if isinstance(permission, Role):
        return user_role.__contains__(permission.__str__())
    return False


def exist(user_role: List[RoleConstants], user_permission: List[PermissionConstants], permission, request, **kwargs):
    if callable(permission):
        p = permission(request, kwargs)
        return exist_permissions(user_role, user_permission, p, request, **kwargs)
    return exist_permissions(user_role, user_permission, permission, request, **kwargs)


def get_is_permissions(request, **kwargs):
    def is_permissions(*permission, compare=CompareConstants.OR):
        exit_list = list(
            map(lambda p: exist(request.auth.role_list, request.auth.permission_list, p, request, **kwargs),
                permission))
        return any(exit_list) if compare == CompareConstants.OR else all(exit_list)

    return is_permissions

def check_batch_permissions(request: Request, id_list: List[str], id_key: str, permissions: tuple,
                            compare=CompareConstants.OR, **kwargs) -> List[str]:

    if not id_list:
        return []

    # workspace manager Direct放行
    # 预检
    kwargs[id_key] = '__workspace_level_pre_check__'
    pre_check = list(
            map(lambda p: exist(request.auth.role_list, request.auth.permission_list, p, request, **kwargs),
                permissions)
        )
    if any(pre_check) if compare == CompareConstants.OR else all(pre_check):
        return list(id_list)
    # 逐个ResourceValidate
    result_list = []
    for resource_id in id_list:
        kwargs[id_key] = resource_id
        exit_list = list(
            map(lambda p: exist(request.auth.role_list, request.auth.permission_list, p, request, **kwargs),
                permissions)
        )
        if any(exit_list) if compare == CompareConstants.OR else all(exit_list):
            result_list.append(resource_id)
    return result_list

def has_permissions(*permission, compare=CompareConstants.OR):
    """
    Permission role or permission
    :param compare:    比较Symbol
    :param permission: IfRole role:roleId
    :return: Permission装饰器Function,Used forDetermineUserWhether有PermissionAccessCurrentInterface
    """

    def inner(func):
        def run(view, request, **kwargs):
            exit_list = list(
                map(lambda p: exist(request.auth.role_list, request.auth.permission_list, p, request, **kwargs),
                    permission))
            # DetermineWhether有Permission
            if any(exit_list) if compare == CompareConstants.OR else all(exit_list):
                return func(view, request, **kwargs)
            raise AppUnauthorizedFailed(403, _('No permission to access'))

        return run

    return inner
