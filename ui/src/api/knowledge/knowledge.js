import { get, post, del, put, exportFile, exportExcel } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId() + '/knowledge';
    },
});
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
const getKnowledgeList = (param, loading) => {
    return get(`${prefix.value}`, param, loading);
};
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
const getKnowledgeListPage = (page, param, loading) => {
    return get(`${prefix.value}/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * Knowledge baseDetails
 * @param Parameters knowledge_id
 */
const getKnowledgeDetail = (knowledge_id, loading) => {
    return get(`${prefix.value}/${knowledge_id}`, undefined, loading);
};
/**
 * ModificationKnowledge baseInfo
 * @param Parameters
 * knowledge_id
 * {
 "name": "string",
 "desc": true
 }
 */
const putKnowledge = (knowledge_id, data, loading) => {
    return put(`${prefix.value}/${knowledge_id}`, data, undefined, loading);
};
/**
 * DeletionKnowledge base
 * @param Parameters knowledge_id
 */
const delKnowledge = (knowledge_id, loading) => {
    return del(`${prefix.value}/${knowledge_id}`, undefined, {}, loading);
};
/**
 * VectorizationKnowledge base
 * @param Parameters knowledge_id
 */
const putReEmbeddingKnowledge = (knowledge_id, loading) => {
    return put(`${prefix.value}/${knowledge_id}/embedding`, undefined, undefined, loading);
};
/**
 * ExportKnowledge base
 * @param knowledge_name Knowledge baseName
 * @param knowledge_id   Knowledge baseid
 * @returns
 */
const exportKnowledge = (knowledge_name, knowledge_id, loading) => {
    return exportExcel(knowledge_name + '.xlsx', `${prefix.value}/${knowledge_id}/export`, undefined, loading);
};
/**
 *ExportZipKnowledge base
 * @param knowledge_name Knowledge baseName
 * @param knowledge_id   Knowledge baseid
 * @param loading      Loader
 * @returns
 */
const exportZipKnowledge = (knowledge_name, knowledge_id, loading) => {
    return exportFile(knowledge_name + '.zip', `${prefix.value}/${knowledge_id}/export_zip`, undefined, loading);
};
/**
 * GenerateAssociationQuestion
 * @param knowledge_id Knowledge baseid
 * @param data
 * @param loading
 * @returns
 */
const putGenerateRelated = (knowledge_id, data, loading) => {
    return put(`${prefix.value}/${knowledge_id}/generate_related`, data, null, loading);
};
/**
 * HitTestList
 * @param knowledge_id
 * @param loading
 * @query  { query_text: string, top_number: number, similarity: number }
 * @returns
 */
const putKnowledgeHitTest = (knowledge_id, data, loading) => {
    return post(`${prefix.value}/${knowledge_id}/hit_test`, data, undefined, loading);
};
/**
 * SyncKnowledge base
 * @param Parameters knowledge_id
 * @query Parameters sync_type // SyncType->replace:ReplaceSync,complete:CompleteSync
 */
const putSyncWebKnowledge = (knowledge_id, sync_type, loading) => {
    return put(`${prefix.value}/${knowledge_id}/sync`, undefined, { sync_type }, loading);
};
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
const postKnowledge = (data, loading) => {
    return post(`${prefix.value}/base`, data, undefined, loading, 1000 * 60 * 5);
};
/**
 * CreationWorkflowKnowledge base
 * @param data
 * @param loading
 * @returns
 */
const createWorkflowKnowledge = (data, loading) => {
    return post(`${prefix.value}/workflow`, data, undefined, loading);
};
/**
 * Get vectorization model list available to current user (Unused)
 * @param application_id
 * @param loading
 * @query  { query_text: string, top_number: number, similarity: number }
 * @returns
 */
const getKnowledgeEmdeddingModel = (knowledge_id, loading) => {
    return get(`${prefix.value}/${knowledge_id}/emdedding_model`, loading);
};
/**
 * Get model list available to current user
 * @param
 * @param loading
 * @returns
 */
const getKnowledgeModel = (loading) => {
    return get(`${prefix.value}/model`, loading);
};
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
const postWebKnowledge = (data, loading) => {
    return post(`${prefix.value}/web`, data, undefined, loading);
};
// CreationFeishuKnowledge base
const postLarkKnowledge = (data, loading) => {
    return post(`${prefix.value}/lark/save`, data, null, loading);
};
const putLarkKnowledge = (knowledge_id, data, loading) => {
    return put(`${prefix.value}/lark/${knowledge_id}`, data, undefined, loading);
};
const getAllTags = (params, loading) => {
    return get(`${prefix.value}/tags`, params, loading);
};
const getTags = (knowledge_id, params, loading) => {
    return get(`${prefix.value}/${knowledge_id}/tags`, params, loading);
};
const postTags = (knowledge_id, tags, loading) => {
    return post(`${prefix.value}/${knowledge_id}/tags`, tags, null, loading);
};
const putTag = (knowledge_id, tag_id, tag, loading) => {
    return put(`${prefix.value}/${knowledge_id}/tags/${tag_id}`, tag, null, loading);
};
const delTag = (knowledge_id, tag_id, type, loading) => {
    return del(`${prefix.value}/${knowledge_id}/tags/${tag_id}/${type}`, null, loading);
};
const delMulTag = (knowledge_id, tags, loading) => {
    return put(`${prefix.value}/${knowledge_id}/tags/batch_delete`, tags, null, loading);
};
const getKnowledgeWorkflowFormList = (knowledge_id, type, id, node, loading) => {
    return post(`${prefix.value}/${knowledge_id}/datasource/${type}/${id}/form_list`, { node }, {}, loading);
};
const getKnowledgeWorkflowDatasourceDetails = (knowledge_id, type, id, params, function_name, loading) => {
    return post(`${prefix.value}/${knowledge_id}/datasource/${type}/${id}/${function_name}`, params, {}, loading);
};
const workflowAction = (knowledge_id, instance, loading) => {
    return post(`${prefix.value}/${knowledge_id}/debug`, instance, {}, loading);
};
const workflowUpload = (knowledge_id, instance, loading) => {
    return post(`${prefix.value}/${knowledge_id}/upload_document`, instance, {}, loading);
};
const publish = (knowledge_id, loading) => {
    return put(`${prefix.value}/${knowledge_id}/publish`, {}, {}, loading);
};
/**
 * SaveKnowledge base workflow
 * @param knowledge_id
 * @param data
 * @param loading
 * @returns
 */
const putKnowledgeWorkflow = (knowledge_id, data, loading) => {
    return put(`${prefix.value}/${knowledge_id}/workflow`, data, undefined, loading);
};
/**
 * ExportKnowledge base workflow
 * @param knowledge_id
 * @param knowledge_name
 * @param loading
 * @returns
 */
const exportKnowledgeWorkflow = (knowledge_id, knowledge_name, loading) => {
    return exportFile(knowledge_name + '.kbwf', `${prefix.value}/${knowledge_id}/workflow/export`, undefined, loading);
};
/**
 * ImportKnowledge base workflow
 */
const importKnowledgeWorkflow = (knowledge_id, data, loading) => {
    return post(`${prefix.value}/${knowledge_id}/workflow/import`, data, undefined, loading);
};
const listKnowledgeVersion = (knowledge_id, loading) => {
    return get(`${prefix.value}/${knowledge_id}/knowledge_version`, {}, loading);
};
const updateKnowledgeVersion = (knowledge_id, knowledge_version_id, data, loading) => {
    return put(`${prefix.value}/${knowledge_id}/knowledge_version/${knowledge_version_id}`, data, {}, loading);
};
const getWorkflowActionPage = (knowledge_id, page, query, loading) => {
    return get(`${prefix.value}/${knowledge_id}/action/${page.current_page}/${page.page_size}`, query, loading);
};
const getWorkflowAction = (knowledge_id, knowledge_action_id, loading) => {
    return get(`${prefix.value}/${knowledge_id}/action/${knowledge_action_id}`, {}, loading);
};
const cancelWorkflowAction = (knowledge_id, knowledge_action_id, loading) => {
    return post(`${prefix.value}/${knowledge_id}/action/${knowledge_action_id}/cancel`, {}, undefined, loading);
};
/**
 * mcp Node
 */
const getMcpTools = (knowledge_id, mcp_servers, loading) => {
    return post(`${prefix.value}/${knowledge_id}/mcp_tools`, { mcp_servers }, {}, loading);
};
const postTransformWorkflow = (knowledge_id, data, loading) => {
    return post(`${prefix.value}/${knowledge_id}/transform_workflow`, data, undefined, loading);
};
/**
 * ExportKnowledge base
 * @param knowledge_name
 * @param knowledge_id
 * @param loading
 * @returns
 */
const exportKnowledgeBundle = (knowledge_name, knowledge_id, with_source_file, loading) => {
    return exportFile(knowledge_name + '.zip', `${prefix.value}/${knowledge_id}/export_knowledge`, { with_source_file: with_source_file }, loading);
};
/**
 * ImportKnowledge base
 * @param data
 * @param loading
 * @returns
 */
const importKnowledgeBundle = (data, loading) => {
    return post(`${prefix.value}/import_knowledge`, data, undefined, loading);
};
/**
 * BatchDeletionKnowledge base
 * @param Parameters
 * {
  "id_list": [String]
}
 */
const delMulKnowledge = (data, loading) => {
    return put(`${prefix.value}/batch_delete`, { id_list: data }, undefined, loading);
};
/**
 * BatchTransferKnowledge base
 * @param Parameters
 * {
  "id_list": [String]
  "folder_id": string
}
 */
const putMulMoveKnowledge = (data, loading) => {
    return put(`${prefix.value}/batch_move`, data, undefined, loading);
};
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
};
