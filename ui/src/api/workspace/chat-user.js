import { get, put, post, del } from '@/request/index';
const prefix = '/workspace/chat_user';
/**
 * UserList
 */
const getChatUserList = (loading) => {
    return get(`${prefix}/list`, undefined, loading);
};
/**
 * UserPaginationList
 * @query Parameters
 username_or_nickname: string
 */
const getUserManage = (page, params, loading) => {
    return get(`${prefix}/user_manage/${page.current_page}/${page.page_size}`, params ? params : undefined, loading);
};
/**
 * DeletionUser
 * @param Parameters user_id,
 */
const delUserManage = (user_id, loading) => {
    return del(`${prefix}/${user_id}`, undefined, {}, loading);
};
/**
 * CreationUser
 */
const postUserManage = (data, loading) => {
    return post(`${prefix}`, data, undefined, loading);
};
/**
 * EditUser
 */
const putUserManage = (user_id, data, loading) => {
    return put(`${prefix}/${user_id}`, data, undefined, loading);
};
/**
 * ModificationUserPassword
 */
const putUserManagePassword = (user_id, data, loading) => {
    return put(`${prefix}/${user_id}/re_password`, data, undefined, loading);
};
/**
 * Configure user group
 */
const batchAddGroup = (data, loading) => {
    return post(`${prefix}/batch_add_group`, data, undefined, loading);
};
/**
 * BatchDeletion
 */
const batchDelete = (data, loading) => {
    return post(`${prefix}/batch_delete`, data, undefined, loading);
};
export default {
    getUserManage,
    putUserManage,
    delUserManage,
    postUserManage,
    putUserManagePassword,
    getChatUserList,
    batchAddGroup,
    batchDelete,
};
