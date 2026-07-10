import { get, post } from '@/request/index';
const prefix = '/workspace';
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
 * GetWorkspaceMemberList
 */
const getWorkspaceMemberList = (workspace_id, page, param, loading) => {
    return get(`${prefix}/${workspace_id}/user_list/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * GetWorkspaceAllMemberList
 */
const getAllMemberList = (workspace_id, param, loading) => {
    return get(`${prefix}/${workspace_id}/user_list`, param, loading);
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
    getWorkspaceMemberList,
    getAllMemberList,
    CreateWorkspaceMember,
    deleteWorkspaceMember,
    getWorkspaceRoleList,
    getWorkspaceListByUser,
};
