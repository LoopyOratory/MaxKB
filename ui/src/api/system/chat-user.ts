import {Result} from '@/request/Result'
import {get, put, post, del} from '@/request/index'
import type {pageRequest, PageList} from '@/api/type/common'
import type {ChatUserItem} from '@/api/type/systemChatUser'
import type {Ref} from 'vue'

const prefix = '/system/chat_user'


/**
 * UserList
 */
const getChatUserList: (loading?: Ref<boolean>) => Promise<Result<ChatUserItem[]>> = (loading) => {
  return get(`${prefix}/list`, undefined, loading)
}

/**
 * UserPaginationList
 * @query Parameters
 username_or_nickname: string
 */
const getUserManage: (
  page: pageRequest,
  params?: any,
  loading?: Ref<boolean>,
) => Promise<Result<PageList<ChatUserItem[]>>> = (page, params, loading) => {
  return get(
    `${prefix}/user_manage/${page.current_page}/${page.page_size}`,
    params ? params : undefined,
    loading,
  )
}

/**
 * DeletionUser
 * @param Parameters user_id,
 */
const delUserManage: (user_id: string, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  user_id,
  loading,
) => {
  return del(`${prefix}/${user_id}`, undefined, {}, loading)
}

/**
 * CreationUser
 */
const postUserManage: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix}`, data, undefined, loading)
}

/**
 * EditUser
 */
const putUserManage: (
  user_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (user_id, data, loading) => {
  return put(`${prefix}/${user_id}`, data, undefined, loading)
}

/**
 * ModificationUserPassword
 */
const putUserManagePassword: (
  user_id: string,
  data: any,
  loading?: Ref<boolean>
) => Promise<Result<any>> = (user_id, data, loading) => {
  return put(`${prefix}/${user_id}/re_password`, data, undefined, loading)
}

/**
 * Configure user group
 */
const batchAddGroup: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix}/batch_add_group`, data, undefined, loading)
}

/**
 * BatchDeletion
 */
const batchDelete: (data: string[], loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix}/batch_delete`, data, undefined, loading)
}

/**
 * SyncUser
 */
const batchSync: (sync_type: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  sync_type,
  loading,
) => {
  return post(`${prefix}/sync/${sync_type}`, undefined, undefined, loading)
}

/**
 * GetSyncType
 */
const getSyncType: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${prefix}/sync_types`, undefined, loading)
}

export default {
  getUserManage,
  putUserManage,
  delUserManage,
  postUserManage,
  putUserManagePassword,
  getChatUserList,
  batchAddGroup,
  batchDelete,
  batchSync,
  getSyncType
}
