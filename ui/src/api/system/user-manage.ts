import {Result} from '@/request/Result'
import {get, put, post, del} from '@/request/index'
import type {pageRequest} from '@/api/type/common'
import type {Ref} from 'vue'


const prefix = '/user_manage'
/**
 * UserPaginationList
 * @query Parameters
 email_or_username: string
 */
const getUserManage: (
  page: pageRequest,
  params?: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, params, loading) => {
  return get(
    `${prefix}/${page.current_page}/${page.page_size}`,
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
 * GetSystemDefaultPassword
 */
const getSystemDefaultPassword: (
  loading?: Ref<boolean>
) => Promise<Result<string>> = (loading) => {
  return get('/user_manage/password', undefined, loading)
}


/**
 * GetValidate
 * @param valid_type ValidateType: application|knowledge|user
 * @param valid_count ValidateCount: 5 | 50 | 2
 */
const getValid: (
  valid_type: string,
  valid_count: number,
  loading?: Ref<boolean>
) => Promise<Result<any>> = (valid_type, valid_count, loading) => {
  return get(`/valid/${valid_type}/${valid_count}`, undefined, loading)
}

const batchDelete: (
  ids: string[],
  loading?: Ref<boolean>
) => Promise<Result<any>> = (ids, loading) => {
  return post(`/user_manage/batch_delete`, ids, {}, loading)
}

const batchSetRolePE: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`/user_manage/batch/add_role`, data, undefined, loading)
}
const batchSetRoleEE: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`/user_manage/batch/add_role_ee`, data, undefined, loading)
}

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
}
