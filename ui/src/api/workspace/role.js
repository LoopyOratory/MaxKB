import { get, post, del } from '@/request/index';
const prefix = '/workspace/role';
/**
 * GetRoleList
 */
const getRoleList = (loading) => {
    return get(`${prefix}`, undefined, loading);
};
/**
 * CreateRoleMember
 */
const CreateMember = (role_id, data, loading) => {
    return post(`${prefix}/${role_id}/add_member`, data, undefined, loading);
};
/**
 * GetRoleMemberList
 */
const getRoleMemberList = (role_id, page, param, loading) => {
    return get(`${prefix}/${role_id}/user_list/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * DeletionRoleMember
 */
const deleteRoleMember = (role_id, user_relation_id, loading) => {
    return del(`${prefix}/${role_id}/remove_member/${user_relation_id}`, undefined, {}, loading);
};
export default {
    getRoleList,
    CreateMember,
    getRoleMemberList,
    deleteRoleMember,
};
