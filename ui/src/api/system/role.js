import { get, post, del } from '@/request/index';
const prefix = '/system/role';
/**
 * GetRoleList
 */
const getRoleList = (loading) => {
    return get(`${prefix}`, undefined, loading);
};
/**
 * Based onTypeGetRolePermissionTemplateList
 */
const getRoleTemplate = (role_type, loading) => {
    return get(`${prefix}/template/${role_type}`, undefined, loading);
};
/**
 * GetRolePermissionSelect
 */
const getRolePermissionList = (role_id, loading) => {
    return get(`${prefix}/${role_id}/permission`, undefined, loading);
};
/**
 * Create or update role
 */
const CreateOrUpdateRole = (data, loading) => {
    return post(`${prefix}`, data, undefined, loading);
};
/**
 * DeletionRole
 */
const deleteRole = (role_id, loading) => {
    return del(`${prefix}/${role_id}`, undefined, {}, loading);
};
/**
 * SaveRolePermission
 */
const saveRolePermission = (role_id, data, loading) => {
    return post(`${prefix}/${role_id}/permission`, data, undefined, loading);
};
/**
 * GetRoleMemberList
 */
const getRoleMemberList = (role_id, page, param, loading) => {
    return get(`${prefix}/${role_id}/user_list/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * CreateRoleMember
 */
const CreateMember = (role_id, data, loading) => {
    return post(`${prefix}/${role_id}/add_member`, data, undefined, loading);
};
/**
 * DeletionRoleMember
 */
const deleteRoleMember = (role_id, user_relation_id, loading) => {
    return del(`${prefix}/${role_id}/remove_member/${user_relation_id}`, undefined, {}, loading);
};
export default {
    getRoleList,
    getRolePermissionList,
    getRoleTemplate,
    CreateOrUpdateRole,
    deleteRole,
    saveRolePermission,
    getRoleMemberList,
    CreateMember,
    deleteRoleMember
};
