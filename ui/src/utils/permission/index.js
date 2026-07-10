import useStore from '@/stores';
import { Role, Permission, ComplexPermission, Edition, } from '@/utils/permission/type';
import { isFunction } from '@/utils/common';
/**
 * WhetherContainsCurrentPermission
 * @param permission CurrentPermission
 * @returns  True Contains false NotContains
 */
const hasPermissionChild = (permission) => {
    const { user } = useStore();
    const permissions = user.getPermissions();
    const role = user.getRole();
    const edition = user.getEdition();
    if (!permission) {
        return true;
    }
    if (isFunction(permission)) {
        permission = permission();
    }
    if (permission instanceof Role) {
        return role.includes(permission.role);
    }
    if (permission instanceof Permission) {
        return permissions.includes(permission.permission);
    }
    if (permission instanceof Edition) {
        return permission.edition === edition;
    }
    if (permission instanceof ComplexPermission) {
        const permissionOk = permission.permissionList.some((p) => permissions.includes(isFunction(p) ? p().toString() : p.toString()));
        const roleList = permission.roleList;
        const roleOk = roleList.some((r) => role.includes(isFunction(r) ? r().toString() : r.toString()));
        const editionList = permission.editionList;
        const editionOK = permission.editionList.length > 0
            ? editionList.some((e) => edition.toString() == e.toString())
            : true;
        return permission.compare === 'AND'
            ? permissionOk && roleOk && editionOK
            : (permissionOk || roleOk) && editionOK;
    }
    if (typeof permission === 'string') {
        return permissions.includes(permission);
    }
    return false;
};
/**
 * Determine whether user has role and permission
 * @param role         Role
 * @param permissions  Permission
 * @param requiredPermissions  Permission
 * @returns
 */
export const hasPermission = (permission, compare) => {
    if (permission instanceof Array) {
        return compare === 'OR'
            ? permission.some((p) => hasPermissionChild(p))
            : permission.every((p) => hasPermissionChild(p));
    }
    else {
        return hasPermissionChild(permission);
    }
};
const R = {
    to: null,
};
export const get_next_route = () => {
    return R.to;
};
export const set_next_route = (to) => {
    R.to = to;
};
