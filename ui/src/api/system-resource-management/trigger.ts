import { Result } from '@/request/Result'
import { get, post, del, put, exportFile } from '@/request/index'
import { type Ref } from 'vue'
import type { TriggerData } from '../type/trigger'



const prefix = 'system/resource'


/**
 * Resource endpoint - create trigger
 * @param source_type  Resource type
 * @param source_id    Resourceid
 * @param data         Data
 * @param loading      Loader
 * @returns
 */
const postResourceTrigger: (
  source_type: string,
  source_id: string,
  data: TriggerData,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (source_type, source_id, data, loading) => {
  return post(
    `${prefix}/${source_type}/${source_id}/trigger`,
    data,
    undefined,
    loading,
  )
}

/**
 * Resource endpoint - trigger list
 * @param source_type
 * @param source_id
 * @param loading
 * @returns
 */
const getResourceTriggerList: (
  source_type: string,
  source_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (source_type, source_id, loading) => {
  return get(
    `${prefix}/${source_type}/${source_id}/trigger`,
    undefined,
    loading
  )
}

/**
 * Resource endpoint - trigger details
 * @param source_type
 * @param source_id
 * @param trigger_id
 * @param loading
 * @returns
 */
const getResourceTriggerDetail: (
    source_type: string,
  source_id: string,
  trigger_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (source_type, source_id, trigger_id, loading) => {
  return get(
    `${prefix}/${source_type}/${source_id}/trigger/${trigger_id}`,
    undefined,
    loading
  )
}

/**
 * Resource endpoint - delete trigger
 * @param source_type
 * @param source_id
 * @param trigger_id
 * @param loading
 * @returns
 */
const deleteResourceTrigger: (
    source_type: string,
  source_id: string,
  trigger_id: string,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (source_type, source_id, trigger_id, loading) => {
  return del(
    `${prefix}/${source_type}/${source_id}/trigger/${trigger_id}`,
    undefined,
    {},
    loading
  )
}

/**
 * Resource endpoint - modify trigger
 * @param source_type Resource type
 * @param source_id   Resourceid
 * @param trigger_id  Triggerid
 * @param data        TriggerData
 * @param loading     Loader
 * @returns
 */
const putResourceTrigger: (
  source_type: string,
  source_id: string,
  trigger_id: string,
  data: TriggerData,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (source_type, source_id, trigger_id, data, loading) => {
  return put(
    `${prefix}/${source_type}/${source_id}/trigger/${trigger_id}`,
    data,
    undefined,
    loading,
  )
}

export default {
  postResourceTrigger,
  getResourceTriggerList,
  getResourceTriggerDetail,
  deleteResourceTrigger,
  putResourceTrigger
}
