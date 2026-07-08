import { Result } from '@/request/Result'
import {
  get,
  post,
  postUpload,
  postStream,
  del,
  put,
  request,
  download,
  exportFile,
} from '@/request/chat/index'
import { type ChatProfile } from '@/api/type/chat'
import { type Ref } from 'vue'
import type { ResetPasswordRequest } from '@/api/type/user.ts'

import useStore from '@/stores'
import type { LoginRequest } from '@/api/type/user'

const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId() + '/application'
  },
})

/**
 * OpenDebugConversationid
 * @param application_id Applicationid
 * @param loading Loader
 * @returns
 */
const open: (loading?: Ref<boolean>) => Promise<Result<string>> = (loading) => {
  return get('/open', {}, loading)
}
/**
 * Conversation
 * @param Parameters
 * chat_id: string
 * data
 */
const chat: (chat_id: string, data: any) => Promise<any> = (chat_id, data) => {
  const prefix = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/chat') + '/api'
  return postStream(`${prefix}/chat_message/${chat_id}`, data)
}

/**
 * ApplicationAuthenticationInfo
 */
const chatProfile: (assessToken: string, loading?: Ref<boolean>) => Promise<Result<ChatProfile>> = (
  assessToken,
  loading,
) => {
  return get('/profile', { access_token: assessToken }, loading)
}
/**
 * AnonymousAuthentication
 * @param assessToken
 * @param loading
 * @returns
 */
const anonymousAuthentication: (
  assessToken: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (assessToken, loading) => {
  return post('/auth/anonymous', { access_token: assessToken }, {}, loading)
}
/**
 * PasswordAuthentication
 * @param assessToken
 * @param password
 * @param loading
 * @returns
 */
const passwordAuthentication: (
  assessToken: string,
  password: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (assessToken, password, loading) => {
  return post('auth/password', { access_token: assessToken, password: password }, {}, loading)
}
/**
 * GetApplicationRelatedInfo
 * @param loading
 * @returns
 */
const applicationProfile: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get('/application/profile', {}, loading)
}

/**
 * Login
 * @param request LoginInterfaceRequestForm
 * @param loading InterfaceLoader
 * @returns AuthenticationData
 */
const login: (
  accessToken: string,
  request: LoginRequest,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (accessToken: string, request, loading) => {
  return post('/auth/login/' + accessToken, request, undefined, loading)
}

const ldapLogin: (
  accessToken: string,
  request: LoginRequest,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (accessToken: string, request, loading) => {
  return post('/auth/ldap/login/' + accessToken, request, undefined, loading)
}

/**
 * GetVerifyCode
 * @param username
 * @param loading InterfaceLoader
 */
const getCaptcha: (
  username?: string,
  accessToken?: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (username, accessToken, loading) => {
  return get('/captcha', { username: username, accessToken: accessToken }, loading)
}

/**
 * GetQR codeType
 */
const getQrType: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get('auth/qr_type', undefined, loading)
}

const getQrSource: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get('auth/qr_type/source', undefined, loading)
}

const getDingCallback: (
  code: string,
  accessToken: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (code, accessToken, loading) => {
  return get('auth/dingtalk', { code, accessToken: accessToken }, loading)
}

const getDingOauth2Callback: (
  code: string,
  accessToken: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (code, accessToken, loading) => {
  return get('auth/dingtalk/oauth2', { code, accessToken: accessToken }, loading)
}

const getWecomCallback: (
  code: string,
  accessToken: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (code, accessToken, loading) => {
  return get('auth/wecom', { code, accessToken: accessToken }, loading)
}
const getLarkCallback: (
  code: string,
  accessToken: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (code, accessToken, loading) => {
  return get('auth/lark/oauth2', { code, accessToken: accessToken }, loading)
}

/**
 * GetAuthenticationSettings
 */
const getAuthSetting: (auth_type: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  auth_type,
  loading,
) => {
  return get(`/chat_user/${auth_type}/detail`, undefined, loading)
}
/**
 * LikeDislike
 * @param chat_id         Conversationid
 * @param chat_record_id  ConversationRecordid
 * @param vote_status     LikeStatus
 * @param loading         Loader
 * @returns
 */
const vote: (
  chat_id: string,
  chat_record_id: string,
  vote_status: string,
  vote_reason?: string,
  vote_other_content?: string,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (
  chat_id,
  chat_record_id,
  vote_status,
  vote_reason,
  vote_other_content,
  loading,
) => {
  const data = {
    vote_status,
    ...(vote_reason !== undefined && { vote_reason }),
    ...(vote_other_content !== undefined && { vote_other_content }),
  }
  return put(`/vote/chat/${chat_id}/chat_record/${chat_record_id}`, data, undefined, loading)
}
const pageChat: (
  current_page: number,
  page_size: number,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (current_page, page_size, loading) => {
  return get(`/historical_conversation/${current_page}/${page_size}`, undefined, loading)
}
const pageChatRecord: (
  chat_id: string,
  current_page: number,
  page_size: number,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (chat_id, current_page, page_size, loading) => {
  return get(
    `/historical_conversation_record/${chat_id}/${current_page}/${page_size}`,
    undefined,
    loading,
  )
}

/**
 * Logout
 */
const logout: (loading?: Ref<boolean>) => Promise<Result<boolean>> = (loading) => {
  return post('/auth/logout', undefined, undefined, loading)
}

/**
 * ResetPassword
 */
const resetCurrentPassword: (
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (data, loading) => {
  return post('/chat_user/current/reset_password', data, undefined, loading)
}

/**
 * GetCurrentUserInfo
 */
const getChatUserProfile: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return get('/chat_user/profile', {}, loading)
}
/**
 * GetConversationDetails
 * @param chat_id         Conversationid
 * @param chat_record_id  ConversationRecordid
 * @param loading         Loader
 * @returns
 */
const getChatRecord: (
  chat_id: string,
  chat_record_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (chat_id, chat_record_id, loading) => {
  return get(`historical_conversation/${chat_id}/record/${chat_record_id}`, {}, loading)
}
/**
 * TextTo speech
 */
const textToSpeech: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return download(`text_to_speech`, 'post', data, undefined, loading)
}

/**
 * Speech toText
 */
const speechToText: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`speech_to_text`, data, undefined, loading)
}
/**
 *
 * @param chat_id  ConversationID
 * @param loading
 * @returns
 */
const deleteChat: (chat_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  chat_id,
  loading,
) => {
  return del(`historical_conversation/${chat_id}`, undefined, undefined, loading)
}
/**
 *
 * @param loading
 * @returns
 */
const clearChat: (loading?: Ref<boolean>) => Promise<Result<any>> = (loading) => {
  return del(`historical_conversation/clear`, undefined, undefined, loading)
}
/**
 *
 * @param chat_id Conversationid
 * @param data    ConversationIntroduction
 * @param loading
 * @returns
 */
const modifyChat: (chat_id: string, data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  chat_id,
  data,
  loading,
) => {
  return put(`historical_conversation/${chat_id}`, data, undefined, loading)
}
/**
 * UploadFile
 * @param file      File
 * @param sourceId  Resourceid
 * @param resourceType  Resource type
 * @returns
 */
const postUploadFile: (
  file: any,
  sourceId: string,
  resourceType:
    | 'KNOWLEDGE'
    | 'APPLICATION'
    | 'TOOL'
    | 'DOCUMENT'
    | 'CHAT'
    | 'TEMPORARY_30_MINUTE'
    | 'TEMPORARY_120_MINUTE'
    | 'TEMPORARY_1_DAY',
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (file, sourceId, sourceType, loading) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('source_id', sourceId)
  fd.append('source_type', sourceType)
  return post(`/oss/file`, fd, undefined, loading)
}

/**
 * Upload file (supports upload progress callback and interrupt)
 * @param file
 * @param sourceId  Resourceid
 * @param resourceType  Resource type
 * @param onProgress  UploadProgressCallback，ParametersAs percentage(0-100)
 * @param loading
 * @returns Returns { request, abort }, request is an async promise object, abort is used to interrupt upload
 */
const postUploadFileProgress: (
  file: any,
  sourceId: string,
  resourceType:
    | 'KNOWLEDGE'
    | 'APPLICATION'
    | 'TOOL'
    | 'DOCUMENT'
    | 'CHAT'
    | 'TEMPORARY_30_MINUTE'
    | 'TEMPORARY_120_MINUTE'
    | 'TEMPORARY_1_DAY',
  onProgress?: (percent: number, event: any) => void,
  loading?: Ref<boolean>,
) => { request: Promise<Result<any>>; abort: () => void } = (
  file,
  sourceId,
  sourceType,
  onProgress,
  loading,
) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('source_id', sourceId)
  fd.append('source_type', sourceType)
  return postUpload(`/oss/file`, fd, onProgress, undefined, loading)
}

const getFile: (application_id: string, params: any) => Promise<Result<any>> = (
  application_id,
  params,
) => {
  return get(`/oss/get_url/${application_id}`, params)
}

/**
 * GenerateShareLink
 * @param Parameters
 * chat_id: string
 * data
 */
const postShareChat: (
  application_id: string,
  chat_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<any> = (application_id, chat_id, data, loading) => {
  return post(`/${application_id}/chat/${chat_id}/share_chat`, data, undefined, loading)
}

const getShareLink: (link: string) => Promise<Result<any>> = (link) => {
  return get(`/share/${link}`, undefined)
}

export default {
  open,
  chat,
  chatProfile,
  anonymousAuthentication,
  applicationProfile,
  login,
  getCaptcha,
  getDingCallback,
  getQrType,
  getWecomCallback,
  getDingOauth2Callback,
  getLarkCallback,
  getQrSource,
  ldapLogin,
  getAuthSetting,
  passwordAuthentication,
  vote,
  pageChat,
  pageChatRecord,
  logout,
  resetCurrentPassword,
  getChatUserProfile,
  getChatRecord,
  textToSpeech,
  speechToText,
  deleteChat,
  clearChat,
  modifyChat,
  postUploadFile,
  postUploadFileProgress,
  getFile,
  postShareChat,
  getShareLink,
}
