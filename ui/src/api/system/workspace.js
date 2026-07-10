import { get, post, del } from '@/request/index';
const prefix = '/system/workspace';
/**
 * GetHomepageWorkspaceDropdownList
 */
const getWorkspaceListByUser = (loading) => {
    return get('/workspace/by_user', undefined, loading);
};
/**
 * GetAddMember at WorkspaceDropdownList
 */
const getWorkspaceList = (loading) => {
    return get('/workspace/current_user', undefined, loading);
};
/**
 * GetWorkspaceList
 */
const getSystemWorkspaceList = (loading) => {
    return get(`${prefix}`, undefined, loading);
};
/**
 * CreateorUpdateWorkspace
 */
const CreateOrUpdateWorkspace = (data, loading) => {
    return post(`${prefix}`, data, undefined, loading);
};
/**
 * DeletionWorkspaceBeforeValidate
 */
const deleteWorkspaceCheck = (workspace_id, loading) => {
    return get(`${prefix}/${workspace_id}/check`, undefined, loading);
};
/**
 * DeletionWorkspace
 */
const deleteWorkspace = (workspace_id, loading) => {
    return del(`${prefix}/${workspace_id}`, undefined, {}, loading);
};
/**
 * GetWorkspaceMemberList
 */
const getWorkspaceMemberList = (workspace_id, page, param, loading) => {
    return get(`${prefix}/${workspace_id}/user_list/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * CreateWorkspaceMember
 */
const CreateWorkspaceMember = (workspace_id, data, loading) => {
    return post(`${prefix}/${workspace_id}/add_member`, data, undefined, loading);
};
/**
 * DeletionWorkspaceMember
 */
const deleteWorkspaceMember = (workspace_id, user_relation_id, loading) => {
    return post(`${prefix}/${workspace_id}/remove_member/${user_relation_id}`, undefined, {}, loading);
};
/**
 * GetAddMember at RoleDropdownList
 */
const getWorkspaceRoleList = (loading) => {
    return get('/role_list/current_user', undefined, loading);
};
export default {
    getWorkspaceList,
    getSystemWorkspaceList,
    CreateOrUpdateWorkspace,
    deleteWorkspace,
    getWorkspaceMemberList,
    CreateWorkspaceMember,
    deleteWorkspaceMember,
    getWorkspaceRoleList,
    getWorkspaceListByUser,
    deleteWorkspaceCheck
};
