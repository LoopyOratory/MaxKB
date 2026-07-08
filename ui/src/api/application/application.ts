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
} from '@/request/index'
import type { pageRequest } from '@/api/type/common'
import type { ApplicationFormType } from '@/api/type/application'
import { type Ref } from 'vue'
import useStore from '@/stores'

const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId() + '/application'
  },
})
/**
 * GetAllApplication
 * @param param
 * @param loading
 */
const getAllApplication: (param?: any, loading?: Ref<boolean>) => Promise<Result<any[]>> = (
  param,
  loading,
) => {
  return get(`${prefix.value}`, param, loading)
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
  return get(`${prefix.value}/${page.current_page}/${page.page_size}`, param, loading)
}

/**
 * CreationApplication
 * @param data
 * @param loading
 */
const postApplication: (
  data: ApplicationFormType,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (data, loading) => {
  return post(`${prefix.value}`, data, undefined, loading)
}

/**
 * ModificationApplication
 * @param application_id
 * @param data
 * @param loading
 */
const putApplication: (
  application_id: string,
  data: ApplicationFormType,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix.value}/${application_id}`, data, undefined, loading)
}
/**
 * MoveApplication
 * @param application_id
 * @param folder_id
 * @param loading
 * @returns
 */
const moveApplication: (
  application_id: string,
  folder_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, folder_id, loading) => {
  return put(`${prefix.value}/${application_id}/move/${folder_id}`, {}, undefined, loading)
}

/**
 * DeletionApplication
 * @param application_id
 * @param loading
 */
const delApplication: (
  application_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (application_id, loading) => {
  return del(`${prefix.value}/${application_id}`, undefined, {}, loading)
}

/**
 * ApplicationDetails
 * @param application_id
 * @param loading
 */
const getApplicationDetail: (
  application_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, loading) => {
  return get(`${prefix.value}/${application_id}`, undefined, loading)
}

/**
 * GetAccessToken
 * @param application_id
 * @param loading
 */
const getAccessToken: (application_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  application_id,
  loading,
) => {
  return get(`${prefix.value}/${application_id}/access_token`, undefined, loading)
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
  return get(`${prefix.value}/${application_id}/setting`, undefined, loading)
}

/**
 * ModificationAccessToken
 * data {
 *  "is_active": true
 * }
 * @param application_id
 * @param data
 * @param loading
 */
const putAccessToken: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix.value}/${application_id}/access_token`, data, undefined, loading)
}

/**
 * ReplaceCommunity edition-ModificationAccessToken
 * data {
 *  "show_source": boolean,
 *  "show_history": boolean,
 *  "draggable": boolean,
 *  "show_guide": boolean,
 *  "avatar": file,
 *  "float_icon": file,
 * }
 * @param application_id
 * @param data
 * @param loading
 */
const putXpackAccessToken: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix.value}/${application_id}/setting`, data, undefined, loading)
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
    `${prefix.value}/${application_id}/export`,
    undefined,
    loading,
  )
}

/**
 * ImportApplication
 */
const importApplication: (
  folder_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (folder_id, data, loading) => {
  return post(`${prefix.value}/folder/${folder_id}/import`, data, undefined, loading)
}

/**
 * Statistics
 * @param application_id
 * @param data
 * @param loading
 */
const getStatistics: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return get(`${prefix.value}/${application_id}/application_stats`, data, loading)
}
/**
 * StatisticstokenConsumption
 */
const getTokenUsage: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return get(`${prefix.value}/${application_id}/application_token_usage`, data, loading)
}
/**
 * StatisticsAskCount
 */
const topQuestions: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return get(`${prefix.value}/${application_id}/top_questions`, data, loading)
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
  return get(`${prefix.value}/${application_id}/open`, {}, loading)
}

/**
 * Generate prompt
 * @param workspace_id
 * @param model_id
 * @param application_id
 * @param data
 * @returns
 */
const generate_prompt: (
  workspace_id: string,
  model_id: string,
  application_id: string,
  data: any,
) => Promise<any> = (workspace_id, model_id, application_id, data) => {
  const prefix = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api'
  return postStream(
    `${prefix}/workspace/${workspace_id}/application/${application_id}/model/${model_id}/prompt_generate`,
    data,
  )
}

/**
 * Conversation
 * chat_id: string
 * data
 * @param chat_id
 * @param data
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
  return get(`${prefix.value}/${application_id}/platform/status`)
}
/**
 * UpdatePlatformStatus
 */
const updatePlatformStatus: (application_id: string, data: any) => Promise<Result<any>> = (
  application_id,
  data,
) => {
  return post(`${prefix.value}/${application_id}/platform/status`, data)
}
/**
 * GetPlatformConfiguration
 */
const getPlatformConfig: (application_id: string, type: string) => Promise<Result<any>> = (
  application_id,
  type,
) => {
  return get(`${prefix.value}/${application_id}/platform/${type}`)
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
  return post(`${prefix.value}/${application_id}/platform/${type}`, data, undefined, loading)
}
/**
 * ApplicationPublish
 * @param application_id
 * @param data
 * @param loading
 * @returns
 */
const publish: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return put(`${prefix.value}/${application_id}/publish`, data, {}, loading)
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
  return download(
    `${prefix.value}/${application_id}/play_demo_text`,
    'post',
    data,
    undefined,
    loading,
  )
}

/**
 * TextTo speech
 */
const postTextToSpeech: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return download(
    `${prefix.value}/${application_id}/text_to_speech`,
    'post',
    data,
    undefined,
    loading,
  )
}
/**
 * Speech toText
 */
const speechToText: (
  application_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, data, loading) => {
  return post(`${prefix.value}/${application_id}/speech_to_text`, data, undefined, loading)
}

/**
 * mcp Node
 */
const getMcpTools: (
  application_id: string,
  mcp_servers: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (application_id, mcp_servers, loading) => {
  return post(`${prefix.value}/${application_id}/mcp_tools`, { mcp_servers }, {}, loading)
}

/**
 * UploadFile
 * @param file
 * @param sourceId
 * @param resourceType
 * @param loading
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
) => Promise<Result<any>> = (file, sourceId, resourceType, loading) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('source_id', sourceId)
  fd.append('source_type', resourceType)
  return post(`/oss/file`, fd, undefined, loading)
}

/**
 * Upload file (supports upload progress callback and interrupt)
 * @param file
 * @param sourceId
 * @param resourceType
 * @param onProgress UploadProgressCallback，ParametersAs percentage(0-100)
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
  resourceType,
  onProgress,
  loading,
) => {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('source_id', sourceId)
  fd.append('source_type', resourceType)
  return postUpload(`/oss/file`, fd, onProgress, undefined, loading)
}

const deleteFile: (file_id: string) => Promise<Result<any>> = (file_id) => {
  return del(`/oss/file/${file_id}`)
}

const getFile: (application_id: string, params: any) => Promise<Result<any>> = (
  application_id,
  params,
) => {
  return get(`/oss/get_url/${application_id}`, params)
}

/**
 * BatchDeletionAgent
 * @param Parameters
 * {
  "id_list": [String]
}
 */
const delMulApplication: (data: any, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  data,
  loading,
) => {
  return put(`${prefix.value}/batch_delete`, { id_list: data }, undefined, loading)
}
/**
 * BatchDeletionAgent
 * @param Parameters
 * {
  "id_list": [String]
  "folder_id": string
}
 */
const putMulMoveApplication: (data: any, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  data,
  loading,
) => {
  return put(`${prefix.value}/batch_move`, data, undefined, loading)
}

/**
 * BatchUpdateAgentConversationLogClearStrategy
 * @param Parameters
 * {
  "id_list": [String],
  "clean_time": number,
  "file_clean_time": number
}
 */
const putMulCleanTime: (data: any, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  data,
  loading,
) => {
  return put(`${prefix.value}/batch_clean_time`, data, undefined, loading)
}

export default {
  getAllApplication,
  getApplication,
  postApplication,
  putApplication,
  delApplication,
  getApplicationDetail,
  getAccessToken,
  putAccessToken,
  putXpackAccessToken,
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
  postUploadFile,
  postUploadFileProgress,
  generate_prompt,
  getTokenUsage,
  topQuestions,
  getFile,
  moveApplication,
  delMulApplication,
  putMulMoveApplication,
  putMulCleanTime,
  deleteFile,
}
