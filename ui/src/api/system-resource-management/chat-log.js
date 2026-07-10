import { get, post, exportExcelPost, del, put } from '@/request/index';
const prefix = '/system/resource/application';
/**
 * ConversationRecordSubmit to Knowledge base
 * @param data
 * @param loading
 * @param application_id
 * @param knowledge_id
 */
const postChatLogAddKnowledge = (application_id, data, loading) => {
    return post(`${prefix}/${application_id}/add_knowledge`, data, undefined, loading);
};
/**
 * ConversationLog
 * @param Parameters
 * application_id
 * param  {
 "start_time": "string",
 "end_time": "string",
 }
 */
const getChatLog = (application_id, page, param, loading) => {
    return get(`${prefix}/${application_id}/chat/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * GetConversationLogRecord
 * @param Parameters
 * application_id, chart_id,order_asc
 */
const getChatRecordLog = (application_id, chart_id, page, loading, order_asc) => {
    return get(`${prefix}/${application_id}/chat/${chart_id}/chat_record/${page.current_page}/${page.page_size}`, { order_asc: order_asc !== undefined ? order_asc : true }, loading);
};
/**
 * GetAnnotationParagraphListInfo
 * @param Parameters
 * application_id, chart_id,  chart_record_id
 */
const getMarkChatRecord = (application_id, chart_id, chart_record_id, loading) => {
    return get(`${prefix}/${application_id}/chat/${chart_id}/chat_record/${chart_record_id}/improve`, undefined, loading);
};
/**
 * ModificationLogRecordContent
 * @param Parameters
 * application_id, chart_id,  chart_record_id, knowledge_id, document_id
 * data {
 "title": "string",
 "content": "string",
 "problem_text": "string"
 }
 */
const putChatRecordLog = (application_id, chart_id, chart_record_id, knowledge_id, document_id, data, loading) => {
    return put(`${prefix}/${application_id}/chat/${chart_id}/chat_record/${chart_record_id}/knowledge/${knowledge_id}/document/${document_id}/improve`, data, undefined, loading);
};
/**
 * DeletionAnnotation
 * @param Parameters
 * application_id, chart_id,  chart_record_id, knowledge_id, document_id,paragraph_id
 */
const delMarkChatRecord = (application_id, chart_id, chart_record_id, knowledge_id, document_id, paragraph_id, loading) => {
    return del(`${prefix}/${application_id}/chat/${chart_id}/chat_record/${chart_record_id}/knowledge/${knowledge_id}/document/${document_id}/paragraph/${paragraph_id}/improve`, undefined, {}, loading);
};
/**
 * ExportConversationLog
 * @param Parameters
 * application_id
 * param  {
 "start_time": "string",
 "end_time": "string",
 }
 */
const postExportChatLog = (application_id, application_name, param, data, loading) => {
    exportExcelPost(application_name + '.xlsx', `${prefix}/${application_id}/chat/export`, param, data, loading);
};
const getChatRecordDetails = (application_id, chat_id, chat_record_id, loading) => {
    return get(`${prefix}/${application_id}/chat/${chat_id}/chat_record/${chat_record_id}`, {}, loading);
};
export default {
    postChatLogAddKnowledge,
    getChatLog,
    getChatRecordLog,
    getMarkChatRecord,
    putChatRecordLog,
    delMarkChatRecord,
    postExportChatLog,
    getChatRecordDetails,
};
