import { get, post, put } from '@/request/index';
const prefix = '/system/auth';
/**
 * GetAuthenticationSettings
 */
const getAuthSetting = (auth_type, loading) => {
    return get(`${prefix}/${auth_type}/detail`, undefined, loading);
};
/**
 * ldapConnection test
 */
const postAuthSetting = (data, loading) => {
    return post(`${prefix}/connection`, data, undefined, loading);
};
/**
 * ModificationEmailSettings
 */
const putAuthSetting = (auth_type, data, loading) => {
    return put(`${prefix}/${auth_type}/info`, data, undefined, loading);
};
export default {
    getAuthSetting,
    postAuthSetting,
    putAuthSetting
};
