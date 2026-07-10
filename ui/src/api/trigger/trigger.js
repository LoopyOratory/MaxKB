import { get, post, del, put } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId() + '/trigger';
    },
});
const prefixWorkspace = { _value: '/workspace/' };
Object.defineProperty(prefixWorkspace, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId();
    },
});
/**
 * TriggerList
 * @param data
 * @param loading
 * @returns
 */
const getTriggerList = (data, loading) => {
    return get(`${prefix.value}`, data, loading);
};
/**
 * TriggerDetails
 * @param trigger_id
 * @param loading
 * @returns
 */
const getTriggerDetail = (trigger_id, loading) => {
    return get(`${prefix.value}/${trigger_id}`, {}, loading);
};
/**
 * CreationTrigger
 * @param data
 * @param loading
 * @returns
 */
const postTrigger = (data, loading) => {
    return post(`${prefix.value}`, data, undefined, loading);
};
/**
 * ModificationTrigger
 * @param trigger_id
 * @param data
 * @param loading
 * @returns
 */
const putTrigger = (trigger_id, data, loading) => {
    return put(`${prefix.value}/${trigger_id}`, data, undefined, loading);
};
/**
 * DeletionTrigger
 * @param trigger_id
 * @param loading
 * @returns
 */
const deleteTrigger = (trigger_id, loading) => {
    return del(`${prefix.value}/${trigger_id}`, undefined, {}, loading);
};
/**
 * BatchDeletionTrigger
 * @param data
 * @param loading
 * @returns
 */
const delMulTrigger = (data, loading) => {
    return put(`${prefix.value}/batch_delete`, { id_list: data }, undefined, loading);
};
/**
 * BatchActivate/DisableTrigger
 * @param data
 * @param loading
 * @returns
 */
const activateMulTrigger = (data, loading) => {
    return put(`${prefix.value}/batch_activate`, { id_list: data.id_list, is_active: data.is_active }, undefined, loading);
};
/**
 * PaginationQueryTrigger
 * @param page    PaginationParameters
 * @param param   QueryParameters
 * @param loading Loader
 * @returns
 */
const pageTrigger = (page, param, loading) => {
    return get(`${prefix.value}/${page.current_page}/${page.page_size}`, param, loading);
};
/**
 * PaginationQueryTriggerExecuteTask
 * @param trigger_id Triggerid
 * @param page       PaginationParameters
 * @param param      QueryParameters
 * @param loading    Recorder
 * @returns
 */
const pageTriggerTaskRecord = (trigger_id, page, param, loading) => {
    return get(`${prefix.value}/${trigger_id}/task_record/${page.current_page}/${page.page_size}`, param, loading);
};
const getTriggerTaskRecordDetails = (trigger_id, trigger_task_id, trigger_task_record_id, loading) => {
    return get(`${prefix.value}/${trigger_id}/trigger_task/${trigger_task_id}/trigger_task_record/${trigger_task_record_id}`, {}, loading);
};
/**
 * Resource endpoint - create trigger
 * @param source_type  Resource type
 * @param source_id    Resourceid
 * @param data         Data
 * @param loading      Loader
 * @returns
 */
const postResourceTrigger = (source_type, source_id, data, loading) => {
    return post(`${prefixWorkspace.value}/${source_type}/${source_id}/trigger`, data, undefined, loading);
};
/**
 * Resource endpoint - trigger list
 * @param source_type
 * @param source_id
 * @param loading
 * @returns
 */
const getResourceTriggerList = (source_type, source_id, loading) => {
    return get(`${prefixWorkspace.value}/${source_type}/${source_id}/trigger`, undefined, loading);
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
    return get(`${prefixWorkspace.value}/${source_type}/${source_id}/trigger/${trigger_id}`, undefined, loading);
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
    return del(`${prefixWorkspace.value}/${source_type}/${source_id}/trigger/${trigger_id}`, undefined, {}, loading);
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
    return put(`${prefixWorkspace.value}/${source_type}/${source_id}/trigger/${trigger_id}`, data, undefined, loading);
};
export default {
    pageTrigger,
    getTriggerList,
    postTrigger,
    getTriggerDetail,
    putTrigger,
    deleteTrigger,
    delMulTrigger,
    activateMulTrigger,
    pageTriggerTaskRecord,
    getTriggerTaskRecordDetails,
    postResourceTrigger,
    putResourceTrigger,
    getResourceTriggerList,
    getResourceTriggerDetail,
    deleteResourceTrigger
};
