import { Result } from '@/request/Result'
import { get, post, del, put } from '@/request/index'
import { type Ref } from 'vue'
import type {
  ListModelRequest,
  Model,
  CreateModelRequest,
  EditModelRequest,
} from '@/api/type/model'
import type { FormField } from '@/components/dynamics-form/type'

const prefix = '/system/shared/model'

/**
 * GetModelList
 * @params Parameters name, model_type, model_name
 */
const getModelList: (
  request?: ListModelRequest,
  loading?: Ref<boolean>,
) => Promise<Result<Array<Model>>> = (data, loading) => {
  return get(`${prefix}`, data, loading)
}

/**
 * Get dropdown model list
 * @params Parameters name, model_type, model_name
 */
const getSelectModelList: (
  data?: ListModelRequest,
  loading?: Ref<boolean>,
) => Promise<Result<Array<Model>>> = (data, loading) => {
  return get(`${prefix}`, data, loading)
}

/**
 * GetModelParametersForm
 * @param model_id Modelid
 * @param loading
 * @returns
 */
const getModelParamsForm: (
  model_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<Array<FormField>>> = (model_id, loading) => {
  return get(`${prefix}/${model_id}/model_params_form`, {}, loading)
}

/**
 * CreationModel
 * @param request RequestObject
 * @param loading Loader
 * @returns
 */
const createModel: (
  request: CreateModelRequest,
  loading?: Ref<boolean>,
) => Promise<Result<Model>> = (request, loading) => {
  return post(`${prefix}`, request, {}, loading)
}

/**
 * ModificationModel
 * @param request Request object
 * @param loading Loader
 * @returns
 */
const updateModel: (
  model_id: string,
  request: EditModelRequest,
  loading?: Ref<boolean>,
) => Promise<Result<Model>> = (model_id, request, loading) => {
  return put(`${prefix}/${model_id}`, request, {}, loading)
}

/**
 * ModificationModelParametersConfiguration
 * @param request Request object
 * @param loading Loader
 * @returns
 */
const updateModelParamsForm: (
  model_id: string,
  request: any[],
  loading?: Ref<boolean>,
) => Promise<Result<Model>> = (model_id, request, loading) => {
  return put(`${prefix}/${model_id}/model_params_form`, request, {}, loading)
}

/**
 * GetModelDetailsBased onModelid IncludeAuthenticationInfo
 * @param model_id Modelid
 * @param loading  Loader
 * @returns
 */
const getModelById: (model_id: string, loading?: Ref<boolean>) => Promise<Result<Model>> = (
  model_id,
  loading,
) => {
  return get(`${prefix}/${model_id}`, {}, loading)
}
/**
 * GetModelInfoExcludeAuthenticationInfoBased onModelid
 * @param model_id Modelid
 * @param loading  Loader
 * @returns
 */
const getModelMetaById: (model_id: string, loading?: Ref<boolean>) => Promise<Result<Model>> = (
  model_id,
  loading,
) => {
  return get(`${prefix}/${model_id}/meta`, {}, loading)
}
/**
 * PauseDownload
 * @param model_id Modelid
 * @param loading Loader
 * @returns
 */
const pauseDownload: (model_id: string, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  model_id,
  loading,
) => {
  return put(`${prefix}/${model_id}/pause_download`, undefined, {}, loading)
}
const deleteModel: (model_id: string, loading?: Ref<boolean>) => Promise<Result<boolean>> = (
  model_id,
  loading,
) => {
  return del(`${prefix}/${model_id}`, undefined, {}, loading)
}

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
}
