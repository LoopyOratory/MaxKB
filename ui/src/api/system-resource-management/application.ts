import { Result } from '@/request/Result'
import { get, post, postStream, del, put, request, download, exportFile } from '@/request/index'
import type { pageRequest } from '@/api/type/common'
import type { ApplicationFormType } from '@/api/type/application'
import { type Ref } from 'vue'

const prefix = '/system/resource/application'

/**
 * GetAllApplication
 * @param param
 * @param loading
 */
const getAllApplication: (param?: any, loading?: Ref<boolean>) => Promise<Result<any[]>> = (
  param,
  loading,
) => {
  return get(`${prefix}`, param, loading)
}
/**
 * GetPaginationApplication
 * param {
 "name": "string",
 }
 */
const getApplication: (
  page: pageRequest,
  param: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, param, loading) => {
  return get(`${prefix}/${page.current_page}/${page.page_size}`, param, loading)
}

/**
 * ModificationApplication
 * @param Parameters
 */
const putApplication: (
  application_id: string,
  data: ApplicationFormType,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix}/${application_id}`, data, undefined, loading)
}

/**
 * DeletionApplication
 * @param Parameters application_id
 */
const delApplication: (
  application_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (application_id, loading) => {
  return del(`${prefix}/${application_id}`, undefined, {}, loading)
}

/**
 * ApplicationDetails
 * @param Parameters application_id
 */
const getApplicationDetail: (
  application_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, loading) => {
  return get(`${prefix}/${application_id}`, undefined, loading)
}

/**
 * GetAccessToken
 * @param Parameters application_id
 */
const getAccessToken: (application_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  application_id,
  loading,
) => {
  return get(`${prefix}/${application_id}/access_token`, undefined, loading)
}
/**
 * ModificationAccessToken
 * @param Parameters application_id
 * data {
 *  "is_active": true
 * }
 */
const putAccessToken: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix}/${application_id}/access_token`, data, undefined, loading)
}

/**
 * ReplaceCommunity edition-ModificationAccessToken
 * @param Parameters application_id
 * data {
 *  "show_source": boolean,
 *  "show_history": boolean,
 *  "draggable": boolean,
 *  "show_guide": boolean,
 *  "avatar": file,
 *  "float_icon": file,
 * }
 */
const putXpackAccessToken: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix}/${application_id}/setting`, data, undefined, loading)
}

/**
 * Statistics
 * @param Parameters application_id, data
 */
const getStatistics: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return get(`${prefix}/${application_id}/application_stats`, data, loading)
}
/**
 * StatisticstokenConsumption
 */
const getTokenUsage: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return get(`${prefix}/${application_id}/application_token_usage`, data, loading)
}
const topQuestions: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return get(`${prefix}/${application_id}/top_questions`, data, loading)
}
/**
 * OpenDebugConversationid
 * @param application_id Applicationid
 * @param loading Loader
 * @returns
 */
const open: (application_id: string, loading?: Ref<boolean>) => Promise<Result<string>> = (
  application_id,
  loading,
) => {
  return get(`${prefix}/${application_id}/open`, {}, loading)
}

/**
 * Generate prompt
 * @param application_id
 * @param model_id
 * @param data
 * @returns
 */
const generate_prompt: (application_id:string, model_id:string, data: any) => Promise<any> = (
  application_id,
  model_id,
  data
) => {
  const prefix = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api'
  return postStream(`${prefix}/system/resource/application/${application_id}/model/${model_id}/prompt_generate`, data)
}


/**
 * ApplicationPublish
 * @param application_id
 * @param loading
 * @returns
 */
const publish: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix}/${application_id}/publish`, data, {}, loading)
}

/**
 *
 * @param application_id
 * @param data
 * @param loading
 * @returns
 */
const playDemoText: (application_id: string, data: any, loading?: Ref<boolean>) => Promise<any> = (
  application_id,
  data,
  loading,
) => {
  return download(`${prefix}/${application_id}/play_demo_text`, 'post', data, undefined, loading)
}

/**
 * TextTo speech
 */
const postTextToSpeech: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return download(`${prefix}/${application_id}/text_to_speech`, 'post', data, undefined, loading)
}
/**
 * Speech toText
 */
const speechToText: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return post(`${prefix}/${application_id}/speech_to_text`, data, undefined, loading)
}

/**
 * GetApplicationSettings
 * @param application_id Applicationid
 * @param loading Loader
 * @returns
 */
const getApplicationSetting: (
  application_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, loading) => {
  return get(`${prefix}/${application_id}/setting`, undefined, loading)
}

/**
 * ExportApplication
 */

const exportApplication = (
  application_id: string,
  application_name: string,
  loading?: Ref<boolean>,
) => {
  return exportFile(
    application_name + '.mk',
    `${prefix}/${application_id}/export`,
    undefined,
    loading,
  )
}

/**
 * ImportApplication
 */
const importApplication: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix}/import`, data, undefined, loading)
}

/**
 * Conversation
 * @param Parameters
 * chat_id: string
 * data
 */
const chat: (chat_id: string, data: any) => Promise<any> = (chat_id, data) => {
  const prefix = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api'
  return postStream(`${prefix}/chat_message/${chat_id}`, data)
}
/**
 * GetConversationUserAuthenticationType
 * @param loading Loader
 * @returns
 */
const getChatUserAuthType: (loading?: Ref<boolean>) => Promise<any> = (loading) => {
  return get(`/chat_user/auth/types`, {}, loading)
}

/**
 * GetPlatformStatus
 */
const getPlatformStatus: (application_id: string) => Promise<Result<any>> = (application_id) => {
  return get(`${prefix}/${application_id}/platform/status`)
}
/**
 * UpdatePlatformStatus
 */
const updatePlatformStatus: (application_id: string, data: any) => Promise<Result<any>> = (
  application_id,
  data,
) => {
  return post(`${prefix}/${application_id}/platform/status`, data)
}
/**
 * GetPlatformConfiguration
 */
const getPlatformConfig: (application_id: string, type: string) => Promise<Result<any>> = (
  application_id,
  type,
) => {
  return get(`${prefix}/${application_id}/platform/${type}`)
}
/**
 * UpdatePlatformConfiguration
 */
const updatePlatformConfig: (
  application_id: string,
  type: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, type, data, loading) => {
  return post(`${prefix}/${application_id}/platform/${type}`, data, undefined, loading)
}

/**
 * mcp Node
 */
const getMcpTools: (application_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  application_id,
  loading,
) => {
  return get(`${prefix}/${application_id}/mcp_tools`, undefined, loading)
}

export default {
  getAllApplication,
  getApplication,
  putApplication,
  delApplication,
  getApplicationDetail,
  getAccessToken,
  putAccessToken,
  exportApplication,
  importApplication,
  getStatistics,
  open,
  chat,
  getChatUserAuthType,
  getApplicationSetting,
  getPlatformStatus,
  updatePlatformStatus,
  getPlatformConfig,
  publish,
  updatePlatformConfig,
  playDemoText,
  postTextToSpeech,
  speechToText,
  getMcpTools,
  putXpackAccessToken,
  generate_prompt,
  getTokenUsage,
  topQuestions
}
