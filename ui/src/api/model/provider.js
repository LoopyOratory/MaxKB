import { get } from '@/request/index';
const prefix_provider = '/provider';
/**
 * GetProviderList
 */
const getProvider = (loading) => {
    return get(`${prefix_provider}`, {}, loading);
};
/**
 * GetProviderList
 */
const getProviderByModelType = (model_type, loading) => {
    return get(`${prefix_provider}`, { model_type }, loading);
};
/**
 * GetModelCreationForm
 * @param provider
 * @param model_type
 * @param model_name
 * @param loading
 * @returns
 */
const getModelCreateForm = (provider, model_type, model_name, loading) => {
    return get(`${prefix_provider}/model_form`, { provider, model_type, model_name }, loading);
};
/**
 * GetModel typeList
 * @param provider Provider
 * @param loading  Loader
 * @returns Model typeList
 */
const listModelType = (provider, loading) => {
    return get(`${prefix_provider}/model_type_list`, { provider }, loading);
};
/**
 * GetBasicModelList
 * @param provider
 * @param model_type
 * @param loading
 * @returns
 */
const listBaseModel = (provider, model_type, loading) => {
    return get(`${prefix_provider}/model_list`, { provider, model_type }, loading);
};
const listBaseModelParamsForm = (provider, model_type, model_name, loading) => {
    return get(`${prefix_provider}/model_params_form`, { provider, model_type, model_name }, loading);
};
export default {
    getProvider,
    getModelCreateForm,
    getProviderByModelType,
    listModelType,
    listBaseModel,
    listBaseModelParamsForm,
};
