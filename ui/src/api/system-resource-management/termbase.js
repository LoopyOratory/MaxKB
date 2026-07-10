import { get, post, del, put } from '@/request/index';
const prefix = '/system/resource/knowledge';
/**
 * CreationQuestion
 * @param Parameters knowledge_id
 * data: array[string]
 */
const postTermbase = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/termbase`, data, undefined, loading);
};
/**
 * QuestionPaginationList
 * @param Parameters  knowledge_id,
 * query {
 "content": "string",
 }
 */
const getTermbasePage = (knowledge_id, page, param, loading) => {
    return get(`${prefix}/${knowledge_id}/termbase/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * ModificationQuestion
 * @param Parameters
 * knowledge_id, termbase_id,
 * {
 "content": "string",
 }
 */
const putTermbase = (knowledge_id, termbase_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/termbase/${termbase_id}`, data, undefined, loading);
};
/**
 * DeletionQuestion
 * @param Parameters knowledge_id, termbase_id,
 */
const delTermbase = (knowledge_id, termbase_id, loading) => {
    return del(`${prefix}/${knowledge_id}/termbase/${termbase_id}`, loading);
};
const putMulTermbase = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/termbase/batch_delete`, data, undefined, loading);
};
const exportMulTermbase = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/termbase/batch_export`, data, undefined, loading);
};
export default {
    postTermbase,
    getTermbasePage,
    putTermbase,
    delTermbase,
    putMulTermbase,
    exportMulTermbase,
};
