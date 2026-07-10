import { get } from '@/request/index';
import useStore from '@/stores';
const prefix = '/system/shared';
const prefix_workspace = { _value: 'workspace/' };
Object.defineProperty(prefix_workspace, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId();
    },
});
const getKnowledgeList = (loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge`, {}, loading);
};
const getKnowledgeListPage = (page, param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * Knowledge baseDetails
 * @param Parameters knowledge_id
 */
const getKnowledgeDetail = (knowledge_id, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${knowledge_id}`, undefined, loading);
};
/**
 * DocumentPaginationList
 * @param Parameters  knowledge_id,
 * param {
 "name": "string",
 folder_id: "string",
 }
 */
const getDocumentPage = (knowledge_id, page, param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${knowledge_id}/document/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * DocumentDetails
 * @param Parameters knowledge_id
 */
const getDocumentDetail = (knowledge_id, document_id, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${knowledge_id}/document/${document_id}`, {}, loading);
};
/**
 * QuestionPaginationList
 * @param Parameters  knowledge_id,
 * query {
 "content": "string",
 }
 */
const getProblemsPage = (knowledge_id, page, param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${knowledge_id}/problem/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * GetWorkspace under SharedKnowledge baseUserGroupUserList
 */
const getUserGroupUserList = (resource, user_group_id, page, params, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/KNOWLEDGE/${resource.resource_id}/user_group_id/${user_group_id}/${page.current_page}/${page.page_size}`, params, loading);
};
/**
 * Get user groups under shared knowledge base workspace
 */
const getUserGroupList = (resource, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/KNOWLEDGE/${resource.resource_id}/user_group`, undefined, loading);
};
/**
 * ParagraphPaginationList
 * @param Parameters knowledge_id document_id
 * param {
 "title": "string",
 "content": "string",
 }
 */
const getParagraphPage = (knowledge_id, document_id, page, param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${knowledge_id}/document/${document_id}/paragraph/${page.current_page}/${page.page_size}`, param, loading);
};
const getModelList = (param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/model`, param, loading);
};
const getToolList = (param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/tool`, param, loading);
};
const getToolListPage = (page, param, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/tool/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * GetAllUser
 */
const getAllMemberList = (arg, loading) => {
    return get('/user/list', undefined, loading);
};
const getTags = (knowledge_id, params, loading) => {
    return get(`${prefix}/${prefix_workspace.value}/knowledge/${knowledge_id}/tags`, params, loading);
};
export default {
    getKnowledgeList,
    getKnowledgeListPage,
    getKnowledgeDetail,
    getProblemsPage,
    getDocumentPage,
    getDocumentDetail,
    getParagraphPage,
    getModelList,
    getToolList,
    getToolListPage,
    getUserGroupList,
    getUserGroupUserList,
    getAllMemberList,
    getTags
};
