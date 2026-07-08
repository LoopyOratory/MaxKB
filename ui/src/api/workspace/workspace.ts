import {Result} from '@/request/Result'
import type {Ref} from 'vue'
import {get, post, del} from '@/request/index'
import type {
  WorkspaceItem,
  CreateWorkspaceMemberParamsItem,
  WorkspaceMemberItem,
} from '@/api/type/workspace'
import type {pageRequest, PageList} from '@/api/type/common'

const prefix = '/workspace'

/**
 * GetHomepageWorkspaceDropdownList
 */
const getWorkspaceListByUser: (loading?: Ref<boolean>) => Promise<Result<WorkspaceItem[]>> = (
  loading,
) => {
  return get('/workspace/by_user', undefined, loading)
}

/**
 * GetAddMember at WorkspaceDropdownList
 */
const getWorkspaceList: (loading?: Ref<boolean>) => Promise<Result<Record<string, any>[]>> = (
  loading,
) => {
  return get('/workspace/current_user', undefined, loading)
}

/**
 * GetWorkspaceList
 */
const getSystemWorkspaceList: (loading?: Ref<boolean>) => Promise<Result<WorkspaceItem[]>> = (
  loading,
) => {
  return get(`${prefix}`, undefined, loading)
}

/**
 * GetWorkspaceMemberList
 */
const getWorkspaceMemberList: (
  workspace_id: string,
  page: pageRequest,
  param: any,
  loading?: Ref<boolean>,
) => Promise<Result<PageList<WorkspaceMemberItem[]>>> = (workspace_id, page, param, loading) => {
  return get(
    `${prefix}/${workspace_id}/user_list/${page.current_page}/${page.page_size}`,
    param,
    loading,
  )
}

/**
 * GetWorkspaceAllMemberList
 */
const getAllMemberList: (
  workspace_id: string | null,
  param: any,
  loading?: Ref<boolean>,
) => Promise<Result<any[]>> = (workspace_id, param, loading) => {
  return get(`${prefix}/${workspace_id}/user_list`, param, loading)
}

/**
 * CreateWorkspaceMember
 */
const CreateWorkspaceMember: (
  workspace_id: string,
  data: CreateWorkspaceMemberParamsItem[],
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (workspace_id, data, loading) => {
  return post(`${prefix}/${workspace_id}/add_member`, data, undefined, loading)
}

/**
 * DeletionWorkspaceMember
 */
const deleteWorkspaceMember: (
  workspace_id: string,
  user_relation_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (workspace_id, user_relation_id, loading) => {
  return post(`${prefix}/${workspace_id}/remove_member/${user_relation_id}`, undefined, {}, loading)
}

/**
 * GetAddMember at RoleDropdownList
 */
const getWorkspaceRoleList: (loading?: Ref<boolean>) => Promise<Result<Record<string, any>[]>> = (
  loading,
) => {
  return get('/role_list/current_user', undefined, loading)
}

export default {
  getWorkspaceList,
  getSystemWorkspaceList,
  getWorkspaceMemberList,
  getAllMemberList,
  CreateWorkspaceMember,
  deleteWorkspaceMember,
  getWorkspaceRoleList,
  getWorkspaceListByUser,
}
