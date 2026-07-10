import { get, post, del, put } from '@/request/index';
const prefix = '/system/shared/model';
/**
 * GetModelList
 * @params Parameters name, model_type, model_name
 */
const getModelList = (data, loading) => {
    return get(`${prefix}`, data, loading);
};
/**
 * Get dropdown model list
 * @params Parameters name, model_type, model_name
 */
const getSelectModelList = (data, loading) => {
    return get(`${prefix}`, data, loading);
};
/**
 * GetModelParametersForm
 * @param model_id Modelid
 * @param loading
 * @returns
 */
const getModelParamsForm = (model_id, loading) => {
    return get(`${prefix}/${model_id}/model_params_form`, {}, loading);
};
/**
 * CreationModel
 * @param request RequestObject
 * @param loading Loader
 * @returns
 */
const createModel = (request, loading) => {
    return post(`${prefix}`, request, {}, loading);
};
/**
 * ModificationModel
 * @param request Request object
 * @param loading Loader
 * @returns
 */
const updateModel = (model_id, request, loading) => {
    return put(`${prefix}/${model_id}`, request, {}, loading);
};
/**
 * ModificationModelParametersConfiguration
 * @param request Request object
 * @param loading Loader
 * @returns
 */
const updateModelParamsForm = (model_id, request, loading) => {
    return put(`${prefix}/${model_id}/model_params_form`, request, {}, loading);
};
/**
 * GetModelDetailsBased onModelid IncludeAuthenticationInfo
 * @param model_id Modelid
 * @param loading  Loader
 * @returns
 */
const getModelById = (model_id, loading) => {
    return get(`${prefix}/${model_id}`, {}, loading);
};
/**
 * GetModelInfoExcludeAuthenticationInfoBased onModelid
 * @param model_id Modelid
 * @param loading  Loader
 * @returns
 */
const getModelMetaById = (model_id, loading) => {
    return get(`${prefix}/${model_id}/meta`, {}, loading);
};
/**
 * PauseDownload
 * @param model_id Modelid
 * @param loading Loader
 * @returns
 */
const pauseDownload = (model_id, loading) => {
    return put(`${prefix}/${model_id}/pause_download`, undefined, {}, loading);
};
const deleteModel = (model_id, loading) => {
    return del(`${prefix}/${model_id}`, undefined, {}, loading);
};
export default {
    getModelList,
    createModel,
    updateModel,
    deleteModel,
    getModelById,
    getModelMetaById,
    pauseDownload,
    getModelParamsForm,
    updateModelParamsForm,
    getSelectModelList,
};
