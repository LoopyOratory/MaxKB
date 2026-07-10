import { get, post, del, put } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId();
    },
});
/**
 * GetModelList
 * @params Parameters name, model_type, model_name
 */
const getModelList = (data, loading) => {
    return get(`${prefix.value}/model`, data, loading);
};
/**
 * Get dropdown model list
 * @params Parameters name, model_type, model_name
 */
const getSelectModelList = (data, loading) => {
    return get(`${prefix.value}/model_list`, data, loading).then((ok) => {
        return {
            ...ok,
            data: [
                ...ok.data.shared_model.map((m) => {
                    return { ...m, type: 'share' };
                }),
                ...ok.data.model.map((m) => {
                    return { ...m, type: 'workspace' };
                }),
            ],
        };
    });
};
/**
 * GetModelParametersForm
 * @param model_id Modelid
 * @param loading
 * @returns
 */
const getModelParamsForm = (model_id, loading) => {
    return get(`${prefix.value}/model/${model_id}/model_params_form`, {}, loading);
};
/**
 * CreationModel
 * @param request RequestObject
 * @param loading Loader
 * @returns
 */
const createModel = (request, loading) => {
    return post(`${prefix.value}/model`, request, {}, loading);
};
/**
 * ModificationModel
 * @param request Request object
 * @param loading Loader
 * @returns
 */
const updateModel = (model_id, request, loading) => {
    return put(`${prefix.value}/model/${model_id}`, request, {}, loading);
};
/**
 * ModificationModelParametersConfiguration
 * @param request Request object
 * @param loading Loader
 * @returns
 */
const updateModelParamsForm = (model_id, request, loading) => {
    return put(`${prefix.value}/model/${model_id}/model_params_form`, request, {}, loading);
};
/**
 * GetModelDetailsBased onModelid IncludeAuthenticationInfo
 * @param model_id Modelid
 * @param loading  Loader
 * @returns
 */
const getModelById = (model_id, loading) => {
    return get(`${prefix.value}/model/${model_id}`, {}, loading);
};
/**
 * GetModelInfoExcludeAuthenticationInfoBased onModelid
 * @param model_id Modelid
 * @param loading  Loader
 * @returns
 */
const getModelMetaById = (model_id, loading) => {
    return get(`${prefix.value}/model/${model_id}/meta`, {}, loading);
};
/**
 * PauseDownload
 * @param model_id Modelid
 * @param loading Loader
 * @returns
 */
const pauseDownload = (model_id, loading) => {
    return put(`${prefix.value}/model/${model_id}/pause_download`, undefined, {}, loading);
};
const deleteModel = (model_id, loading) => {
    return del(`${prefix.value}/model/${model_id}`, undefined, {}, loading);
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
