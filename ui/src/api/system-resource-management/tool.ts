import { Result } from '@/request/Result'
import { get, post, del, put, exportFile, postStream, download } from '@/request/index'
import { type Ref } from 'vue'
import type { pageRequest } from '@/api/type/common'
import type { toolData } from '@/api/type/tool'

const prefix = '/system/resource/tool'

/**
 * Tool list with pagination (no pagination)
 * @params Parameters
 *  param  {
        "name": "string",
        "tool_type": "string",
    }
 */
const getToolList: (data?: any, loading?: Ref<boolean>) => Promise<Result<Array<any>>> = (
  data,
  loading,
) => {
  return get(`${prefix}`, data, loading)
}

/**
 * Tool list with pagination (no pagination)
 * @params Parameters
 *  param  {
        "name": "string",
        "tool_type": "string",
    }
 */
const getAllToolList: (data?: any, loading?: Ref<boolean>) => Promise<Result<Array<any>>> = (
  data,
  loading,
) => {
  return get(`${prefix}/tool_list`, data, loading)
}

/**
 * Tool list with pagination
 * @param Parameters
 * param  {
 "name": "string",
 "tool_type": "string",
 }
 */
const getToolListPage: (
  page: pageRequest,
  param?: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, param, loading) => {
  return get(`${prefix}/${page.current_page}/${page.page_size}`, param, loading)
}

/**
 * GetToolDetails
 * @param tool_id Toolid
 * @param loading Loader
 * @returns ToolDetails
 */
const getToolById: (tool_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  tool_id,
  loading,
) => {
  return get(`${prefix}/${tool_id}`, undefined, loading)
}

/**
 * ModificationTool
 * @param Parameters

 */
const putTool: (tool_id: string, data: toolData, loading?: Ref<boolean>) => Promise<Result<any>> = (
  tool_id,
  data,
  loading,
) => {
  return put(`${prefix}/${tool_id}`, data, undefined, loading)
}

const postToolTestConnection: (data: toolData, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix}/test_connection`, data, undefined, loading)
}

/**
 * DeletionTool
 * @param Parameters tool_id
 */
const delTool: (tool_id: string, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  tool_id,
  loading,
) => {
  return del(`${prefix}/${tool_id}`, undefined, {}, loading)
}

const putToolIcon: (id: string, data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  id,
  data,
  loading,
) => {
  return put(`${prefix}/${id}/edit_icon`, data, undefined, loading)
}

const exportTool = (id: string, name: string, loading?: Ref<boolean>) => {
  return exportFile(name + '.tool', `${prefix}/${id}/export`, undefined, loading)
}

/**
 * DebugTool
 * @param Parameters

 */
const postToolDebug: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data: any,
  loading,
) => {
  return post(`${prefix}/debug`, data, undefined, loading)
}

const postPylint: (code: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  code,
  loading,
) => {
  return post(`${prefix}/pylint`, { code }, {}, loading)
}

const pageToolRecord = (tool_id: string, page: pageRequest, param: any, loading?: Ref<boolean>) => {
  return get(
    `${prefix}/${tool_id}/tool_record/${page.current_page}/${page.page_size}`,
    param,
    loading,
  )
}

const getToolRecordDetail = (tool_id: string, record_id: string) => {
  return get(`${prefix}/${tool_id}/tool_record/${record_id}`)
}

const uploadSkillFile: (data: toolData, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return put(`${prefix}/upload_skill_file`, data, undefined, loading)
}

const downloadSkillFile: (tool_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  tool_id,
  loading,
) => {
  return download(`${prefix}/${tool_id}/download_skill_file`, 'GET', undefined, undefined, loading)
}

const generateCode: (data: any) => Promise<Result<any>> = (data: any) => {
  const p = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api'
  return postStream(`${p}${prefix}/generate_code`, data)
}

/**
 * GetToolWorkflowVersionList
 * @param tool_id
 * @param loading
 * @returns
 */
const listToolWorkflowVersion: (tool_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  tool_id: string,
  loading,
) => {
  return get(`${prefix}/${tool_id}/tool_version`, {}, loading)
}
/**
 *
 * @param tool_id Toolid
 * @param tool_version_id ToolVersionid
 * @param data Data
 * @param loading
 * @returns
 */
const updateToolWorkflowVersion: (
  tool_id: string,
  tool_version_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (tool_id: string, tool_version_id, data, loading) => {
  return put(`${prefix}/${tool_id}/tool_version/${tool_version_id}`, data, {}, loading)
}
const publish: (tool_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  tool_id: string,
  loading,
) => {
  return put(`${prefix}/${tool_id}/publish`, {}, {}, loading)
}

/**
 * DebugWorkflow
 * @param Parameters
 * chat_id: string
 * data
 */
const debugToolWorkflow: (tool_id: string, data: any) => Promise<any> = (tool_id, data) => {
  const p = (window.MaxKB?.prefix ? window.MaxKB?.prefix : '/admin') + '/api'
  return postStream(`${p}${prefix}/${tool_id}/debug`, data)
}

/**
 * SaveToolWorkflow
 * @param tool_id
 * @param data
 * @param loading
 * @returns
 */
const putToolWorkflow: (
  tool_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (tool_id, data, loading) => {
  return put(`${prefix}/${tool_id}/workflow`, data, undefined, loading)
}

export default {
  getToolListPage,
  getToolList,
  getAllToolList,
  putTool,
  getToolById,
  postToolDebug,
  postPylint,
  exportTool,
  putToolIcon,
  delTool,
  postToolTestConnection,
  pageToolRecord,
  getToolRecordDetail,
  uploadSkillFile,
  downloadSkillFile,
  generateCode,
  listToolWorkflowVersion,
  updateToolWorkflowVersion,
  debugToolWorkflow,
  publish,
  putToolWorkflow,
}
