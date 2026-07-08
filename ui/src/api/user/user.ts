import {Result} from '@/request/Result'
import {get, post} from '@/request/index'
import type {User, ResetPasswordRequest, CheckCodeRequest} from '@/api/type/user'
import type {Ref} from 'vue'

/**
 * GetUserBasicInfo
 * @param loading InterfaceLoader
 * @returns UserBasicInfo
 */
const getUserProfile: (loading?: Ref<boolean>) => Promise<Result<User>> = (loading) => {
  return get('/user/profile', undefined, loading)
}

/**
 * Getprofile
 */
const getProfile: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get('/profile', undefined, loading)
}
/**
 * GetAllUser
 */
const getUserList: (arg?: any, loading?: Ref<boolean>) => Promise<Result<Record<string, any>[]>> = (
  arg,
  loading,
) => {
  return get('/user/list', arg, loading)
}

/**
 * GetAllUser
 */
const getAllMemberList: (arg: any, loading?: Ref<boolean>) => Promise<Result<Record<string, any>[]>> = (
  arg,
  loading,
) => {
  return get('/user/list', arg, loading)
}

/**
 * ValidateVerifyCode
 * @param request RequestObject
 * @param loading InterfaceLoader
 * @returns
 */
const checkCode: (request: CheckCodeRequest, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  request,
  loading,
) => {
  return post('/user/check_code', request, undefined, loading)
}

/**
 * SendEmail
 * @param email  EmailAddress
 * @param loading InterfaceLoader
 * @returns
 */
const sendEmit: (
  email: string,
  type: 'register' | 'reset_password',
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (email, type, loading) => {
  return post('/user/send_email', {email, type}, undefined, loading)
}

/**
 * ResetPassword
 * @param request ResetPasswordRequestParameters
 * @param loading InterfaceLoader
 * @returns
 */
const postResetPassword: (
  request: ResetPasswordRequest,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (request, loading) => {
  return post('/user/re_password', request, undefined, loading)
}

/**
 * ResetPassword
 * @param data ResetPasswordRequestParameters
 * @param loading InterfaceLoader
 * @returns
 */
const resetCurrentPassword: (
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (data, loading) => {
  return post('/user/current/reset_password', data, undefined, loading)
}

export default {
  getUserProfile,
  getProfile,
  getUserList,
  getAllMemberList,
  postResetPassword,
  checkCode,
  sendEmit,
  resetCurrentPassword,
}
