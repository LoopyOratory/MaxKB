import { get, post, del, put } from '@/request/index';
const prefix = 'system/resource';
/**
 * Resource endpoint - create trigger
 * @param source_type  Resource type
 * @param source_id    Resourceid
 * @param data         Data
 * @param loading      Loader
 * @returns
 */
const postResourceTrigger = (source_type, source_id, data, loading) => {
    return post(`${prefix}/${source_type}/${source_id}/trigger`, data, undefined, loading);
};
/**
 * Resource endpoint - trigger list
 * @param source_type
 * @param source_id
 * @param loading
 * @returns
 */
const getResourceTriggerList = (source_type, source_id, loading) => {
    return get(`${prefix}/${source_type}/${source_id}/trigger`, undefined, loading);
};
/**
 * Resource endpoint - trigger details
 * @param source_type
 * @param source_id
 * @param trigger_id
 * @param loading
 * @returns
 */
const getResourceTriggerDetail = (source_type, source_id, trigger_id, loading) => {
    return get(`${prefix}/${source_type}/${source_id}/trigger/${trigger_id}`, undefined, loading);
};
/**
 * Resource endpoint - delete trigger
 * @param source_type
 * @param source_id
 * @param trigger_id
 * @param loading
 * @returns
 */
const deleteResourceTrigger = (source_type, source_id, trigger_id, loading) => {
    return del(`${prefix}/${source_type}/${source_id}/trigger/${trigger_id}`, undefined, {}, loading);
};
/**
 * Resource endpoint - modify trigger
 * @param source_type Resource type
 * @param source_id   Resourceid
 * @param trigger_id  Triggerid
 * @param data        TriggerData
 * @param loading     Loader
 * @returns
 */
const putResourceTrigger = (source_type, source_id, trigger_id, data, loading) => {
    return put(`${prefix}/${source_type}/${source_id}/trigger/${trigger_id}`, data, undefined, loading);
};
export default {
    postResourceTrigger,
    getResourceTriggerList,
    getResourceTriggerDetail,
    deleteResourceTrigger,
    putResourceTrigger
};
