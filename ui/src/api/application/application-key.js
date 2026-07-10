import { get, post, del, put } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId() + '/application';
    },
});
/**
 * API_KEYList
 * @param Parameters application_id
 */
const getAPIKey = (application_id, current_page, page_size, params, loading) => {
    return get(`${prefix.value}/${application_id}/application_key/${current_page}/${page_size}`, params, loading);
};
/**
 * AddAPI_KEY
 * @param Parameters application_id
 */
const postAPIKey = (application_id, loading) => {
    return post(`${prefix.value}/${application_id}/application_key`, {}, undefined, loading);
};
/**
 * DeletionAPI_KEY
 * @param Parameters application_id api_key_id
 */
const delAPIKey = (application_id, api_key_id, loading) => {
    return del(`${prefix.value}/${application_id}/application_key/${api_key_id}`, undefined, undefined, loading);
};
/**
 * ModificationAPI_KEY
 * @param Parameters application_id,api_key_id
 * data {
 *   is_active: boolean
 * }
 */
const putAPIKey = (application_id, api_key_id, data, loading) => {
    return put(`${prefix.value}/${application_id}/application_key/${api_key_id}`, data, undefined, loading);
};
export default {
    getAPIKey,
    postAPIKey,
    delAPIKey,
    putAPIKey,
};
