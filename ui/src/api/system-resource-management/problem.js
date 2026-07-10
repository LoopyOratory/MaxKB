import { get, post, del, put } from '@/request/index';
const prefix = '/system/resource/knowledge';
/**
 * CreationQuestion
 * @param Parameters knowledge_id
 * data: array[string]
 */
const postProblems = (knowledge_id, data, loading) => {
    return post(`${prefix}/${knowledge_id}/problem`, data, undefined, loading);
};
/**
 * QuestionPaginationList
 * @param Parameters  knowledge_id,
 * query {
     "content": "string",
   }
 */
const getProblemsPage = (knowledge_id, page, param, loading) => {
    return get(`${prefix}/${knowledge_id}/problem/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * ModificationQuestion
 * @param Parameters
 * knowledge_id, problem_id,
 * {
 "content": "string",
 }
 */
const putProblems = (knowledge_id, problem_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/problem/${problem_id}`, data, undefined, loading);
};
/**
 * DeletionQuestion
 * @param Parameters knowledge_id, problem_id,
 */
const delProblems = (knowledge_id, problem_id, loading) => {
    return del(`${prefix}/${knowledge_id}/problem/${problem_id}`, loading);
};
/**
 * QuestionDetails
 * @param Parameters
 * knowledge_id, problem_id,
 */
const getDetailProblems = (knowledge_id, problem_id, loading) => {
    return get(`${prefix}/${knowledge_id}/problem/${problem_id}/paragraph`, undefined, loading);
};
/**
 * BatchAssociationParagraph
 * @param Parameters knowledge_id,
 * {
      "problem_id_list": "Array",
      "paragraph_list": "Array",
    }
 */
const putMulAssociationProblem = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/problem/batch_association`, data, undefined, loading);
};
/**
 * BatchDeletionQuestion
 * @param Parameters knowledge_id,
 * data: array[string]
 */
const putMulProblem = (knowledge_id, data, loading) => {
    return put(`${prefix}/${knowledge_id}/problem/batch_delete`, data, undefined, loading);
};
export default {
    postProblems,
    getProblemsPage,
    putProblems,
    delProblems,
    getDetailProblems,
    putMulAssociationProblem,
    putMulProblem,
};
