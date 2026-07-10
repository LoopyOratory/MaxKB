import { get, post } from '@/request/index';
const prefix = '/system/shared';
const getSharedAuthorizationKnowledge = (knowledge_id, loading) => {
    return get(`${prefix}/knowledge/${knowledge_id}/authorization`, {}, loading);
};
const postSharedAuthorizationKnowledge = (knowledge_id, param, loading) => {
    return post(`${prefix}/knowledge/${knowledge_id}/authorization`, param, loading);
};
const getSharedAuthorizationTool = (knowledge_id, loading) => {
    return get(`${prefix}/tool/${knowledge_id}/authorization`, {}, loading);
};
const postSharedAuthorizationTool = (knowledge_id, param, loading) => {
    return post(`${prefix}/tool/${knowledge_id}/authorization`, param, loading);
};
const getSharedAuthorizationModel = (knowledge_id, loading) => {
    return get(`${prefix}/model/${knowledge_id}/authorization`, {}, loading);
};
const postSharedAuthorizationModel = (knowledge_id, param, loading) => {
    return post(`${prefix}/model/${knowledge_id}/authorization`, param, loading);
};
export default {
    getSharedAuthorizationKnowledge,
    postSharedAuthorizationKnowledge,
    getSharedAuthorizationTool,
    postSharedAuthorizationTool,
    getSharedAuthorizationModel,
    postSharedAuthorizationModel,
};
