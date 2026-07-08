import { Result } from '@/request/Result'
import { get, post, del, put, exportFile, exportExcel } from '@/request/index'
import { type Ref } from 'vue'
import type { Dict, pageRequest } from '@/api/type/common'
import type { knowledgeData } from '@/api/type/knowledge'

import useStore from '@/stores'
const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId() + '/knowledge'
  },
})

/**
 * Knowledge baseList(NonePagination）
 * @param Parameters
 * param  {
    folder_id: "string",
    name: "string",
    tool_type: "string",
    desc: string,
  }
 */
const getKnowledgeList: (param?: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  param,
  loading,
) => {
  return get(`${prefix.value}`, param, loading)
}

/**
 * Knowledge basePaginationList
 * @param Parameters
 * param  {
 "folder_id": "string",
 "name": "string",
 "tool_type": "string",
 desc: string,
 }
 */
const getKnowledgeListPage: (
  page: pageRequest,
  param?: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (page, param, loading) => {
  return get(`${prefix.value}/${page.current_page}/${page.page_size}`, param, loading)
}

/**
 * Knowledge baseDetails
 * @param Parameters knowledge_id
 */
const getKnowledgeDetail: (knowledge_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  knowledge_id,
  loading,
) => {
  return get(`${prefix.value}/${knowledge_id}`, undefined, loading)
}

/**
 * ModificationKnowledge baseInfo
 * @param Parameters
 * knowledge_id
 * {
 "name": "string",
 "desc": true
 }
 */
const putKnowledge: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, data, loading) => {
  return put(`${prefix.value}/${knowledge_id}`, data, undefined, loading)
}

/**
 * DeletionKnowledge base
 * @param Parameters knowledge_id
 */
const delKnowledge: (knowledge_id: string, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  knowledge_id,
  loading,
) => {
  return del(`${prefix.value}/${knowledge_id}`, undefined, {}, loading)
}

/**
 * VectorizationKnowledge base
 * @param Parameters knowledge_id
 */
const putReEmbeddingKnowledge: (
  knowledge_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, loading) => {
  return put(`${prefix.value}/${knowledge_id}/embedding`, undefined, undefined, loading)
}

/**
 * ExportKnowledge base
 * @param knowledge_name Knowledge baseName
 * @param knowledge_id   Knowledge baseid
 * @returns
 */
const exportKnowledge: (
  knowledge_name: string,
  knowledge_id: string,
  loading?: Ref<boolean>,
) => Promise<any> = (knowledge_name, knowledge_id, loading) => {
  return exportExcel(
    knowledge_name + '.xlsx',
    `${prefix.value}/${knowledge_id}/export`,
    undefined,
    loading,
  )
}
/**
 *ExportZipKnowledge base
 * @param knowledge_name Knowledge baseName
 * @param knowledge_id   Knowledge baseid
 * @param loading      Loader
 * @returns
 */
const exportZipKnowledge: (
  knowledge_name: string,
  knowledge_id: string,
  loading?: Ref<boolean>,
) => Promise<any> = (knowledge_name, knowledge_id, loading) => {
  return exportFile(
    knowledge_name + '.zip',
    `${prefix.value}/${knowledge_id}/export_zip`,
    undefined,
    loading,
  )
}

/**
 * GenerateAssociationQuestion
 * @param knowledge_id Knowledge baseid
 * @param data
 * @param loading
 * @returns
 */
const putGenerateRelated: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (knowledge_id, data, loading) => {
  return put(`${prefix.value}/${knowledge_id}/generate_related`, data, null, loading)
}

/**
 * HitTestList
 * @param knowledge_id
 * @param loading
 * @query  { query_text: string, top_number: number, similarity: number }
 * @returns
 */
const putKnowledgeHitTest: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (knowledge_id, data, loading) => {
  return post(`${prefix.value}/${knowledge_id}/hit_test`, data, undefined, loading)
}

/**
 * SyncKnowledge base
 * @param Parameters knowledge_id
 * @query Parameters sync_type // SyncType->replace:ReplaceSync,complete:CompleteSync
 */
const putSyncWebKnowledge: (
  knowledge_id: string,
  sync_type: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, sync_type, loading) => {
  return put(`${prefix.value}/${knowledge_id}/sync`, undefined, { sync_type }, loading)
}

/**
 * CreationKnowledge base
 * @param Parameters
 * {
 "name": "string",
 "folder_id": "string",
 "desc": "string",
 "embedding": "string"
 }
 */
const postKnowledge: (data: knowledgeData, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix.value}/base`, data, undefined, loading, 1000 * 60 * 5)
}

/**
 * CreationWorkflowKnowledge base
 * @param data
 * @param loading
 * @returns
 */
const createWorkflowKnowledge: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix.value}/workflow`, data, undefined, loading)
}
/**
 * Get vectorization model list available to current user (Unused)
 * @param application_id
 * @param loading
 * @query  { query_text: string, top_number: number, similarity: number }
 * @returns
 */
const getKnowledgeEmdeddingModel: (
  knowledge_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (knowledge_id, loading) => {
  return get(`${prefix.value}/${knowledge_id}/emdedding_model`, loading)
}

/**
 * Get model list available to current user
 * @param
 * @param loading
 * @returns
 */
const getKnowledgeModel: (loading?: Ref<boolean>) => Promise<Result<Array<any>>> = (loading) => {
  return get(`${prefix.value}/model`, loading)
}

/**
 * CreationWebKnowledge base
 * @param Parameters
 * {
 "name": "string",
 "folder_id": "string",
 "desc": "string",
 "embedding": "string",
 "source_url": "string",
 "selector": "string"
 }
 */
const postWebKnowledge: (data: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  data,
  loading,
) => {
  return post(`${prefix.value}/web`, data, undefined, loading)
}

// CreationFeishuKnowledge base
const postLarkKnowledge: (data: any, loading?: Ref<boolean>) => Promise<Result<Array<any>>> = (
  data,
  loading,
) => {
  return post(`${prefix.value}/lark/save`, data, null, loading)
}

const putLarkKnowledge: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, data, loading) => {
  return put(`${prefix.value}/lark/${knowledge_id}`, data, undefined, loading)
}

const getAllTags: (params: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  params,
  loading,
) => {
  return get(`${prefix.value}/tags`, params, loading)
}

const getTags: (
  knowledge_id: string,
  params: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, params, loading) => {
  return get(`${prefix.value}/${knowledge_id}/tags`, params, loading)
}

const postTags: (
  knowledge_id: string,
  tags: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, tags, loading) => {
  return post(`${prefix.value}/${knowledge_id}/tags`, tags, null, loading)
}

const putTag: (
  knowledge_id: string,
  tag_id: string,
  tag: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, tag_id, tag, loading) => {
  return put(`${prefix.value}/${knowledge_id}/tags/${tag_id}`, tag, null, loading)
}

const delTag: (
  knowledge_id: string,
  tag_id: string,
  type: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, tag_id, type, loading) => {
  return del(`${prefix.value}/${knowledge_id}/tags/${tag_id}/${type}`, null, loading)
}

const delMulTag: (
  knowledge_id: string,
  tags: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, tags, loading) => {
  return put(`${prefix.value}/${knowledge_id}/tags/batch_delete`, tags, null, loading)
}
const getKnowledgeWorkflowFormList: (
  knowledge_id: string,
  type: 'local' | 'tool',
  id: string,
  node: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (
  knowledge_id: string,
  type: 'local' | 'tool',
  id: string,
  node,
  loading,
) => {
  return post(
    `${prefix.value}/${knowledge_id}/datasource/${type}/${id}/form_list`,
    { node },
    {},
    loading,
  )
}
const getKnowledgeWorkflowDatasourceDetails: (
  knowledge_id: string,
  type: 'local' | 'tool',
  id: string,
  params: any,
  function_name: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (
  knowledge_id: string,
  type: 'local' | 'tool',
  id: string,
  params,
  function_name,
  loading,
) => {
  return post(
    `${prefix.value}/${knowledge_id}/datasource/${type}/${id}/${function_name}`,
    params,
    {},
    loading,
  )
}
const workflowAction: (
  knowledge_id: string,
  instance: Dict<any>,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, instance, loading) => {
  return post(`${prefix.value}/${knowledge_id}/debug`, instance, {}, loading)
}

const workflowUpload: (
  knowledge_id: string,
  instance: Dict<any>,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, instance, loading) => {
  return post(`${prefix.value}/${knowledge_id}/upload_document`, instance, {}, loading)
}

const publish: (knowledge_id: string, loading?: Ref<boolean>) => Promise<Result<any>> = (
  knowledge_id: string,
  loading,
) => {
  return put(`${prefix.value}/${knowledge_id}/publish`, {}, {}, loading)
}

/**
 * SaveKnowledge base workflow
 * @param knowledge_id
 * @param data
 * @param loading
 * @returns
 */
const putKnowledgeWorkflow: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, data, loading) => {
  return put(`${prefix.value}/${knowledge_id}/workflow`, data, undefined, loading)
}

/**
 * ExportKnowledge base workflow
 * @param knowledge_id
 * @param knowledge_name
 * @param loading
 * @returns
 */
const exportKnowledgeWorkflow = (
  knowledge_id: string,
  knowledge_name: string,
  loading?: Ref<boolean>,
) => {
  return exportFile(
    knowledge_name + '.kbwf',
    `${prefix.value}/${knowledge_id}/workflow/export`,
    undefined,
    loading,
  )
}
/**
 * ImportKnowledge base workflow
 */
const importKnowledgeWorkflow: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, data, loading) => {
  return post(`${prefix.value}/${knowledge_id}/workflow/import`, data, undefined, loading)
}

const listKnowledgeVersion: (
  knowledge_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, loading) => {
  return get(`${prefix.value}/${knowledge_id}/knowledge_version`, {}, loading)
}
const updateKnowledgeVersion: (
  knowledge_id: string,
  knowledge_version_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, knowledge_version_id, data, loading) => {
  return put(
    `${prefix.value}/${knowledge_id}/knowledge_version/${knowledge_version_id}`,
    data,
    {},
    loading,
  )
}
const getWorkflowActionPage: (
  knowledge_id: string,
  page: pageRequest,
  query: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, page, query, loading) => {
  return get(
    `${prefix.value}/${knowledge_id}/action/${page.current_page}/${page.page_size}`,
    query,
    loading,
  )
}
const getWorkflowAction: (
  knowledge_id: string,
  knowledge_action_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, knowledge_action_id, loading) => {
  return get(`${prefix.value}/${knowledge_id}/action/${knowledge_action_id}`, {}, loading)
}
const cancelWorkflowAction: (
  knowledge_id: string,
  knowledge_action_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id: string, knowledge_action_id, loading) => {
  return post(
    `${prefix.value}/${knowledge_id}/action/${knowledge_action_id}/cancel`,
    {},
    undefined,
    loading,
  )
}
/**
 * mcp Node
 */
const getMcpTools: (
  knowledge_id: string,
  mcp_servers: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, mcp_servers, loading) => {
  return post(`${prefix.value}/${knowledge_id}/mcp_tools`, { mcp_servers }, {}, loading)
}

const postTransformWorkflow: (
  knowledge_id: string,
  data: any,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (knowledge_id, data, loading) => {
  return post(`${prefix.value}/${knowledge_id}/transform_workflow`, data, undefined, loading)
}

/**
 * ExportKnowledge base
 * @param knowledge_name
 * @param knowledge_id
 * @param loading
 * @returns
 */
const exportKnowledgeBundle: (
  knowledge_name: string,
  knowledge_id: string,
  with_source_file: boolean,
  loading?: Ref<boolean>
) => Promise<any> = (knowledge_name, knowledge_id, with_source_file, loading) => {
  return exportFile(
    knowledge_name + '.zip',
    `${prefix.value}/${knowledge_id}/export_knowledge`, {with_source_file: with_source_file}, loading
  )
}

/**
 * ImportKnowledge base
 * @param data
 * @param loading
 * @returns
 */
const importKnowledgeBundle: (
  data: any,
  loading: Ref<boolean>
) => Promise<Result<any>> = (data, loading) => {
  return post(`${prefix.value}/import_knowledge`, data, undefined, loading)
}

/**
 * BatchDeletionKnowledge base
 * @param Parameters
 * {
  "id_list": [String]
}
 */
const delMulKnowledge: (data: any, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  data,
  loading,
) => {
  return put(`${prefix.value}/batch_delete`, { id_list: data }, undefined, loading)
}
/**
 * BatchTransferKnowledge base
 * @param Parameters
 * {
  "id_list": [String]
  "folder_id": string
}
 */
const putMulMoveKnowledge: (data: any, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  data,
  loading,
) => {
  return put(`${prefix.value}/batch_move`, data, undefined, loading)
}


export default {
  getKnowledgeList,
  getKnowledgeListPage,
  getKnowledgeDetail,
  putKnowledge,
  delKnowledge,
  putReEmbeddingKnowledge,
  exportKnowledge,
  exportZipKnowledge,
  putGenerateRelated,
  putKnowledgeHitTest,
  putSyncWebKnowledge,
  postKnowledge,
  getKnowledgeModel,
  postWebKnowledge,
  postLarkKnowledge,
  putLarkKnowledge,
  getAllTags,
  getTags,
  postTags,
  putTag,
  delTag,
  delMulTag,
  createWorkflowKnowledge,
  getKnowledgeWorkflowFormList,
  workflowAction,
  getWorkflowAction,
  getKnowledgeWorkflowDatasourceDetails,
  getMcpTools,
  listKnowledgeVersion,
  updateKnowledgeVersion,
  publish,
  putKnowledgeWorkflow,
  workflowUpload,
  getWorkflowActionPage,
  cancelWorkflowAction,
  exportKnowledgeWorkflow,
  importKnowledgeWorkflow,
  postTransformWorkflow,
  exportKnowledgeBundle,
  importKnowledgeBundle,
  delMulKnowledge,
  putMulMoveKnowledge,
}
