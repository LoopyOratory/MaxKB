# coding=utf-8
"""
    @project: MaxKB
    @Author: Tiger
    @file: log.py
    @date：2025/6/4 14:13
    @desc:
"""
from qianfan.utils.utils import get_ip_address

from system_manage.models.log_management import Log


def _get_ip_address(request):
    """
    GetipAddress
    @param request:
    @return:
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def _get_user(request):
    """
    GetUser
    @param request:
    @return:
    """
    user = request.user
    if user is None:
        return {

        }
    user_info = {
        "id": str(user.id),
        "email": user.email,
        "phone": user.phone,
        "nick_name": user.nick_name,
        "username": user.username,
    }
    # If User Model且有 role 属性
    if hasattr(user, 'role'):
        user_info['role'] = user.role
    return user_info


def _get_details(request):
    path = request.path
    body = request.data

    sensitive_fields = {'password', 're_password'}

    body_copy = dict(body) if hasattr(body, 'items') else body

    if isinstance(body_copy, dict):
        for field in sensitive_fields:
            body_copy.pop(field, None)

    query = request.query_params
    return {
        'path': path,
        'body': body_copy,
        'query': query
    }


def _get_workspace_id(request, kwargs):
    return kwargs.get('workspace_id', 'None')


def log(menu: str, operate, get_user=_get_user, get_ip_address=_get_ip_address, get_details=_get_details,
        get_operation_object=None, get_workspace_id=_get_workspace_id):
    """
    RecordAuditLog
    @param menu: ActionsMenu str
    @param operate: Actions str|func IfOneFunction 入参将是Onerequest Response为str def operate(request): return "ActionsMenu"
    @param get_user: GetUser
    @param get_ip_address:GetIPAddress
    @param get_details: GetExecuteDetails
    @param get_operation_object: GetActionsObject
    @param get_workspace_id: GetWorkspace id
    @return:
    """

    def inner(func):
        def run(view, request, **kwargs):
            status = 200
            operation_object = {}
            try:
                if get_operation_object is not None:
                    operation_object = get_operation_object(request, kwargs)
            except Exception as e:
                pass
            try:
                return func(view, request, **kwargs)
            except Exception as e:
                status = 500
                raise e
            finally:
                ip = get_ip_address(request)
                user = get_user(request)
                details = get_details(request)
                workspace_id = get_workspace_id(request, kwargs)
                _operate = operate
                if callable(operate):
                    _operate = operate(request)
                # InsertAuditLog
                Log(menu=menu, operate=_operate, user=user, status=status, ip_address=ip, details=details,
                    operation_object=operation_object, workspace_id=workspace_id).save()

        return run

    return inner


def record_log(menu: str, operate: str, request, user: dict = None, status: int = 200,
               get_details=_get_details, get_operation_object=None, workspace_id: str = 'default',
               operation_object: dict = None):
    """
    ManualRecordAuditLog（适Used for无法Use装饰器的场景, such as第三方LoginCallback）

    @param menu: ActionsMenu, such as 'Chat User/login'
    @param operate: ActionsDescription, such as 'Log in'
    @param request: Django Request Object
    @param user: UserInfoDict，Contains id, username, email 等Field
    @param status: Status码，Default 200
    @param get_details: GetRequestDetails的Function
    @param get_operation_object: GetActionsObject的Function，IfProvide则优先Use
    @param get_workspace_id: GetWorkspace ID 的Function
    @param operation_object: ActionsObjectDict, such as {'name': 'username'}
    @param workspace_id: Workspace ID，Default 'default'
    @return: None
    """
    try:
        ip = _get_ip_address(request)
        details = get_details(request)

        # IfProvide了 get_operation_object Function，优先Use它GetActionsObject
        if operation_object is None and get_operation_object is not None:
            try:
                operation_object = get_operation_object(request, {})
            except Exception:
                operation_object = {}
        Log(
            menu=menu,
            operate=operate,
            user=user or {},
            status=status,
            ip_address=ip,
            details=details,
            operation_object=operation_object or {},
            workspace_id=workspace_id
        ).save()
    except Exception as e:
        # LogRecordFailure不应影响主业务Flow
        pass
