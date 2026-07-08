import {Result} from '@/request/Result'
import {get, post, put} from '@/request/index'
import {type Ref} from 'vue'

const prefix = '/chat_user/auth'
/**
 * GetAuthenticationSettings
 */
const getAuthSetting: (auth_type: string, loading?: Ref<boolean>) => Promise<Result<any>> = (auth_type, loading) => {
  return get(`${prefix}/${auth_type}/detail`, undefined, loading)
}

/**
 * ldapConnection test
 */
const postAuthSetting: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading
) => {
  return post(`${prefix}/connection`, data, undefined, loading)
}

/**
 * ModificationEmailSettings
 */
const putAuthSetting: (auth_type: string, data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  auth_type,
  data,
  loading
) => {
  return put(`${prefix}/${auth_type}/info`, data, undefined, loading)
}

const platformPrefix = '/chat_user/auth/platform'
const getPlatformInfo: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get(`${platformPrefix}/source`, undefined, loading)
}

const updateConfig: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading
) => {
  return post(`${platformPrefix}/source`, data, undefined, loading)
}

const validateConnection: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading
) => {
  return put(`${platformPrefix}/source`, data, undefined, loading)
}

export default {
  getAuthSetting,
  postAuthSetting,
  putAuthSetting,
  getPlatformInfo,
  updateConfig,
  validateConnection
}
