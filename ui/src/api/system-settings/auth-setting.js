import { get, post, put } from '@/request/index';
const prefix = '/auth';
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
/**
 * LoginSettings
 */
const putLoginSetting = (data, loading) => {
    return put(`${prefix}/setting`, data, undefined, loading);
};
/**
 * GetLoginSettings
 */
const getLoginSetting = (loading) => {
    return get(`${prefix}/setting`, undefined, loading);
};
const getLoginAuthSetting = (loading) => {
    return get(`login/auth/setting`, undefined, loading);
};
/**
 * GetAuthenticationSettings
 */
const getLoginViewAuthSetting = (auth_type, loading) => {
    return get(`login${prefix}/${auth_type}/detail`, undefined, loading);
};
export default {
    getAuthSetting,
    postAuthSetting,
    putAuthSetting,
    putLoginSetting,
    getLoginSetting,
    getLoginAuthSetting,
    getLoginViewAuthSetting
};
