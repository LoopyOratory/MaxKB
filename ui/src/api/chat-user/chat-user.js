import { get, put } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId();
    },
});
/**
 * GetUser group list
 */
const getUserGroupList = (resource, loading) => {
    return get(`${prefix.value}/${resource.resource_type}/${resource.resource_id}/user_group`, undefined, loading);
};
/**
 * ModificationUser group listAuthorization
 */
const editUserGroupList = (resource, data, loading) => {
    return put(`${prefix.value}/${resource.resource_type}/${resource.resource_id}/user_group`, data, undefined, loading);
};
/**
 * GetUserGroupUserList
 */
const getUserGroupUserList = (resource, user_group_id, page, params, loading) => {
    return get(`${prefix.value}/${resource.resource_type}/${resource.resource_id}/user_group_id/${user_group_id}/${page.current_page}/${page.page_size}`, params, loading);
};
/**
 * UpdateUserGroupUserList
 */
const putUserGroupUser = (resource, user_group_id, data, loading) => {
    return put(`${prefix.value}/${resource.resource_type}/${resource.resource_id}/user_group_id/${user_group_id}`, data, undefined, loading);
};
export default {
    getUserGroupList,
    editUserGroupList,
    getUserGroupUserList,
    putUserGroupUser
};
