import { get, post, del, put, exportExcel, exportFile, exportExcelPost, exportFilePost } from '@/request/index';
const prefix = '/system/shared/knowledge';
/**
 * DocumentList(NonePagination）
 * @param Parameters  knowledge_id,
 * param {
 "   name": "string",
  }
 */
const getDocumentList = (knowledge_id, loading) => {
    return get(`${prefix}/${knowledge_id}/document`, undefined, loading);
};
/**
 * DocumentPaginationList
 * @param Parameters  knowledge_id,
 * param {
 "   name": "string",
  }
 */
const getDocumentPage = (knowledge_id, page, param, loading) => {
    return get(`${prefix}/${knowledge_id}/document/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * DocumentDetails
 * @param Parameters knowledge_id
 */
const getDocumentDetail = (knowledge_id, document_id, loading) => {
    return get(`${prefix}/${knowledge_id}/document/${document_id}`, {}, loading);
};
/**
 * ModificationDocument
 * @param Parameters
 * knowledge_id, document_id,
 * {
    "name": "string",
    "is_active": true,
    "meta": {}
 }
 */
const putDocument = (knowledge_id, document_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/${document_id}`, data, undefined, loading);
};
/**
 * DeletionDocument
 * @param Parameters knowledge_id, document_id,
 */
const delDocument = (knowledge_id, document_id, loading) => {
    return del(`${prefix}/${knowledge_id}/document/${document_id}`, loading);
};
/**
 * BatchCancelDocumentTask
 * @param Parameters knowledge_id,
 *{
  "id_list": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ],
  "type": 0
}
 */
const putBatchCancelTask = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_cancel_task`, data, undefined, loading);
};
/**
 * CancelDocumentTask
 * @param Parameters knowledge_id, document_id,
 */
const putCancelTask = (knowledge_id, document_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/${document_id}/cancel_task`, data, undefined, loading);
};
/**
 * DownloadOriginal Document
 * @param Parameters knowledge_id
 */
const getDownloadSourceFile = (knowledge_id, document_id, document_name) => {
    return exportFile(document_name, `${prefix}/${knowledge_id}/document/${document_id}/download_source_file`, {}, undefined);
};
const postReplaceSourceFile = (knowledge_id, document_id, data) => {
    return post(`${prefix}/${knowledge_id}/document/${document_id}/replace_source_file`, data, {}, undefined);
};
/**
 * ExportDocument
 * @param document_name DocumentName
 * @param knowledge_id    Datasetid
 * @param document_id   Documentid
 * @param loading       Loader
 * @returns
 */
const exportDocument = (document_name, knowledge_id, document_id, loading) => {
    return exportExcel(document_name.trim() + '.xlsx', `${prefix}/${knowledge_id}/document/${document_id}/export`, {}, loading);
};
const exportMulDocument = (document_name, knowledge_id, document_ids, loading) => {
    return exportExcelPost(document_name.trim() + '.xlsx', `${prefix}/${knowledge_id}/document/batch_export`, {}, document_ids, loading);
};
/**
 * ExportDocument
 * @param document_name DocumentName
 * @param knowledge_id    Datasetid
 * @param document_id   Documentid
 * @param loading       Loader
 * @returns
 */
const exportDocumentZip = (document_name, knowledge_id, document_id, loading) => {
    return exportFile(document_name.trim() + '.zip', `${prefix}/${knowledge_id}/document/${document_id}/export_zip`, {}, loading);
};
const exportMulDocumentZip = (document_name, knowledge_id, document_ids, loading) => {
    return exportFilePost(document_name.trim() + '.zip', `${prefix}/${knowledge_id}/document/batch_export_zip`, {}, document_ids, loading);
};
/**
 * Refresh document vector store
 * @param Parameters
 * knowledge_id, document_id,
 * {
  "state_list": [
    "string"
  ]
}
 */
const putDocumentRefresh = (knowledge_id, document_id, state_list, loading) => {
    return put(`${prefix}/${knowledge_id}/document/${document_id}/refresh`, { state_list }, undefined, loading);
};
const putDocumentTokenize = (knowledge_id, document_id, state_list, loading) => {
    return put(`${prefix}/${knowledge_id}/document/${document_id}/tokenize`, { state_list }, undefined, loading);
};
/**
 * SyncwebSiteType
 * @param Parameters
 * knowledge_id, document_id,
 */
const putDocumentSync = (knowledge_id, document_id, loading) => {
    return put(`${prefix}/${knowledge_id}/document/${document_id}/sync`, undefined, undefined, loading);
};
/**
 * CreationBatchDocument
 * @param Parameters
{
  "name": "string",
  "paragraphs": [
    {
      "content": "string",
      "title": "string",
      "problem_list": [
        {
          "id": "string",
          "content": "string"
        }
      ],
      "is_active": true
    }
  ],
  "source_file_id": string
}
 */
const putMulDocument = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_create`, data, {}, loading, 1000 * 60 * 5);
};
/**
 * BatchDeletionDocument
 * @param Parameters knowledge_id,
 * {
  "id_list": [String]
}
 */
const delMulDocument = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_delete`, { id_list: data }, undefined, loading);
};
/**
 * BatchAssociation
 * @param Parameters knowledge_id,
{
  "document_id_list": [
    "string"
  ],
  "model_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "prompt": "string",
  "state_list": [
    "string"
  ]
}
 */
const putBatchGenerateRelated = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_generate_related`, data, undefined, loading);
};
/**
 * BatchModificationHitMethod
 * @param knowledge_id Knowledge baseid
 * @param data
 * {id_list:[],hit_handling_method:'directly_return|optimization',directly_return_similarity}
 * @param loading
 * @returns
 */
const putBatchEditHitHandling = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_hit_handling`, data, undefined, loading);
};
/**
 * BatchRefresh document vector store
 * @param knowledge_id Knowledge baseid
 * @param data
{
  "id_list": [
    "string"
  ],
  "state_list": [
    "string"
  ]
}
 * @param loading
 * @returns
 */
const putBatchRefresh = (knowledge_id, data, stateList, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_refresh`, { id_list: data, state_list: stateList }, undefined, loading);
};
const putBatchTokenize = (knowledge_id, data, stateList, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_tokenize`, { id_list: data, state_list: stateList }, undefined, loading);
};
/**
 * BatchSyncDocument
 * @param Parameters knowledge_id,
 */
const putMulSyncDocument = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/batch_sync`, { id_list: data }, undefined, loading);
};
/**
 * BatchMigrationDocument
 * @param Parameters knowledge_id,target_knowledge_id,

 */
const putMigrateMulDocument = (knowledge_id, target_knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/document/migrate/${target_knowledge_id}`, data, undefined, loading);
};
/**
 * ImportQADocument
 * @param Parameters
 * file
 }
 */
const postQADocument = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/document/qa`, data, undefined, loading);
};
/**
 * SegmentPreview (UploadDocument）
 * @param Parameters  file:file,limit:number,patterns:array,with_filter:boolean
 */
const postSplitDocument = (knowledge_id, data) => {
    return post(`${prefix}/${knowledge_id}/document/split`, data, undefined, undefined, 1000 * 60 * 60);
};
/**
 * Segment identifierList
 * @param loading Loader
 * @returns Segment identifierList
 */
const listSplitPattern = (knowledge_id, loading) => {
    return get(`${prefix}/${knowledge_id}/document/split_pattern`, {}, loading);
};
/**
 * ImportTable
 * @param Parameters
 * file
 */
const postTableDocument = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/document/table`, data, undefined, loading);
};
/**
 * GetQATemplate
 * @param Parameters fileName,type,
 */
const exportQATemplate = (fileName, type, loading) => {
    return exportExcel(fileName, `${prefix}/document/template/export`, { type }, loading);
};
/**
 * GettableTemplate
 * @param Parameters fileName,type,
 */
const exportTableTemplate = (fileName, type, loading) => {
    return exportExcel(fileName, `${prefix}/document/table_template/export`, { type }, loading);
};
/**
 * CreationWebSiteDocument
 * @param Parameters
 * {
 "source_url_list": [
 "string"
 ],
 "selector": "string"
 }
 }
 */
const postWebDocument = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/document/web`, data, undefined, loading);
};
/**
 * FeishuImportGetRelatedDocument
 * @param Parameters
 * {
 "source_url_list": [
 "string"
 ],
 "selector": "string"
 }
 }
 */
const getLarkDocumentList = (knowledge_id, folder_token, data, loading) => {
    return post(`${prefix}/lark/${knowledge_id}/${folder_token}/doc_list`, data, undefined, loading);
};
/**
 * SyncFeishuDocument
 */
const putLarkDocumentSync = (knowledge_id, document_id, loading) => {
    return put(`${prefix}/lark/${knowledge_id}/document/${document_id}/sync`, undefined, undefined, loading);
};
/**
 * BatchSyncFeishuDocument
 */
const putMulLarkSyncDocument = (knowledge_id, data, loading) => {
    return put(`${prefix}/lark/${knowledge_id}/_batch`, { id_list: data }, undefined, loading);
};
/**
 * ImportFeishuDocument
 */
const importLarkDocument = (knowledge_id, data, loading) => {
    return post(`${prefix}/lark/${knowledge_id}/import`, data, null, loading);
};
const getDocumentTags = (knowledge_id, document_id, params, loading) => {
    return get(`${prefix}/${knowledge_id}/document/${document_id}/tags`, params, loading);
};
const postDocumentTags = (knowledge_id, document_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/document/${document_id}/tags`, data, null, loading);
};
const postMulDocumentTags = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/document/batch_add_tag`, data, null, loading);
};
const delMulDocumentTag = (knowledge_id, document_id, tags, loading) => {
    return put(`${prefix}/${knowledge_id}/document/${document_id}/tags/batch_delete`, tags, null, loading);
};
const delDocsTag = (knowledge_id, tag_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/tag/${tag_id}/docs_delete`, { id_list: data }, null, loading);
};
export default {
    getDocumentList,
    getDocumentPage,
    getDocumentDetail,
    putDocument,
    delDocument,
    putBatchCancelTask,
    putCancelTask,
    getDownloadSourceFile,
    postReplaceSourceFile,
    exportDocument,
    exportDocumentZip,
    exportMulDocument,
    exportMulDocumentZip,
    putDocumentRefresh,
    putDocumentTokenize,
    putDocumentSync,
    putMulDocument,
    delMulDocument,
    putBatchGenerateRelated,
    putBatchEditHitHandling,
    putBatchRefresh,
    putBatchTokenize,
    putMulSyncDocument,
    putMigrateMulDocument,
    postQADocument,
    postSplitDocument,
    listSplitPattern,
    postTableDocument,
    postWebDocument,
    exportQATemplate,
    exportTableTemplate,
    getLarkDocumentList,
    putLarkDocumentSync,
    putMulLarkSyncDocument,
    importLarkDocument,
    getDocumentTags,
    postDocumentTags,
    postMulDocumentTags,
    delMulDocumentTag,
    delDocsTag
};
