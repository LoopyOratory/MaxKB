import { get, post, del, put } from '@/request/index';
const prefix = '/system/resource/application';
/**
 * API_KEYList
 * @param Parameters application_id
 */
const getAPIKey = (application_id, current_page, page_size, params, loading) => {
    return get(`${prefix}/${application_id}/application_key/${current_page}/${page_size}`, params, loading);
};
/**
 * AddAPI_KEY
 * @param Parameters application_id
 */
const postAPIKey = (application_id, loading) => {
    return post(`${prefix}/${application_id}/application_key`, {}, undefined, loading);
};
/**
 * DeletionAPI_KEY
 * @param Parameters application_id api_key_id
 */
const delAPIKey = (application_id, api_key_id, loading) => {
    return del(`${prefix}/${application_id}/application_key/${api_key_id}`, undefined, undefined, loading);
};
/**
 * ModificationAPI_KEY
 * @param Parameters application_id,api_key_id
 * data {
 *   is_active: boolean
 * }
 */
const putAPIKey = (application_id, api_key_id, data, loading) => {
    return put(`${prefix}/${application_id}/application_key/${api_key_id}`, data, undefined, loading);
};
export default {
    getAPIKey,
    postAPIKey,
    delAPIKey,
    putAPIKey,
};
