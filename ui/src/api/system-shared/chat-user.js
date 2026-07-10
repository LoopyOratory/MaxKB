import { get, put } from '@/request/index';
const prefix = '/system/shared/knowledge';
/**
 * GetSharedKnowledge baseUser group list
 */
const getUserGroupList = (resource, loading) => {
    return get(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group`, undefined, loading);
};
/*
 * ModificationSharedKnowledge baseUser group listAuthorization
 */
const editUserGroupList = (resource, data, loading) => {
    return put(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group`, data, undefined, loading);
};
/**
 * Get shared knowledge base user group user list
 */
const getUserGroupUserList = (resource, user_group_id, page, params, loading) => {
    return get(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group_id/${user_group_id}/${page.current_page}/${page.page_size}`, params, loading);
};
/**
 * UpdateSharedKnowledge baseUserGroupUserList
 */
const putUserGroupUser = (resource, user_group_id, data, loading) => {
    return put(`${prefix}/${resource.resource_type}/${resource.resource_id}/user_group_id/${user_group_id}`, data, undefined, loading);
};
export default {
    getUserGroupList,
    editUserGroupList,
    getUserGroupUserList,
    putUserGroupUser
};
