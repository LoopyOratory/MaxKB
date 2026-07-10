import { get, post, del } from '@/request/index';
const prefix = '/workspace/group';
/**
 * GetUser group list
 */
const getUserGroup = () => {
    return get(`${prefix}`);
};
/**
 * Create user group
 * @param Parameters
 * {
 "id": "string",
 "name": "string"
 }
 */
const postUserGroup = (data, loading) => {
    return post(`${prefix}`, data, undefined, loading);
};
/**
 * Delete user group
 * @param Parameters user_group_id
 */
const delUserGroup = (user_group_id, loading) => {
    return del(`${prefix}/${user_group_id}`, undefined, {}, loading);
};
/**
 * Add user to user group
 */
const postAddMember = (user_group_id, body, loading) => {
    return post(`${prefix}/${user_group_id}/add_member`, body, {}, loading);
};
/**
 * Remove user from user group
 */
const postRemoveMember = (user_group_id, body, loading) => {
    return post(`${prefix}/${user_group_id}/remove_member`, body, {}, loading);
};
/**
 * GetUserGroupMemberList
 */
const getUserListByGroup = (user_group_id, page, params, loading) => {
    return get(`${prefix}/${user_group_id}/user_list/${page.current_page}/${page.page_size}`, params ? params : undefined, loading);
};
export default {
    getUserGroup,
    postUserGroup,
    delUserGroup,
    postAddMember,
    postRemoveMember,
    getUserListByGroup
};
