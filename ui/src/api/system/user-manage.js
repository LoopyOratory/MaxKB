import { get, put, post, del } from '@/request/index';
const prefix = '/user_manage';
/**
 * UserPaginationList
 * @query Parameters
 email_or_username: string
 */
const getUserManage = (page, params, loading) => {
    return get(`${prefix}/${page.current_page}/${page.page_size}`, params ? params : undefined, loading);
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
 * GetSystemDefaultPassword
 */
const getSystemDefaultPassword = (loading) => {
    return get('/user_manage/password', undefined, loading);
};
/**
 * GetValidate
 * @param valid_type ValidateType: application|knowledge|user
 * @param valid_count ValidateCount: 5 | 50 | 2
 */
const getValid = (valid_type, valid_count, loading) => {
    return get(`/valid/${valid_type}/${valid_count}`, undefined, loading);
};
const batchDelete = (ids, loading) => {
    return post(`/user_manage/batch_delete`, ids, {}, loading);
};
const batchSetRolePE = (data, loading) => {
    return post(`/user_manage/batch/add_role`, data, undefined, loading);
};
const batchSetRoleEE = (data, loading) => {
    return post(`/user_manage/batch/add_role_ee`, data, undefined, loading);
};
export default {
    getUserManage,
    putUserManage,
    delUserManage,
    postUserManage,
    putUserManagePassword,
    getSystemDefaultPassword,
    getValid,
    batchDelete,
    batchSetRolePE,
    batchSetRoleEE
};
