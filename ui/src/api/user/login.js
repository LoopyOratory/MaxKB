import { get, post } from '@/request/index';
/**
 * Login
 * @param request LoginInterfaceRequestForm
 * @param loading InterfaceLoader
 * @returns AuthenticationData
 */
const login = (request, loading) => {
    return post('/user/login', request, undefined, loading);
};
const ldapLogin = (request, loading) => {
    return post('/ldap/login', request, undefined, loading);
};
/**
 * Logout
 * @param loading InterfaceLoader
 * @returns
 */
const logout = (loading) => {
    return post('/user/logout', undefined, undefined, loading);
};
/**
 * GetVerifyCode
 * @param loading InterfaceLoader
 */
const getCaptcha = (username, loading) => {
    return get('/user/captcha', { username }, loading);
};
/**
 * GetLoginMethod
 */
const getAuthType = (loading) => {
    return get('auth/types', undefined, loading);
};
/**
 * GetQR codeType
 */
const getQrType = (loading) => {
    return get('qr_type', undefined, loading);
};
const getQrSource = (loading) => {
    return get('qr_type/source', undefined, loading);
};
const getDingCallback = (code, loading) => {
    return get('dingtalk', { code }, loading);
};
const getDingOauth2Callback = (code, loading) => {
    return get('dingtalk/oauth2', { code }, loading);
};
const getWecomCallback = (code, loading) => {
    return get('wecom', { code }, loading);
};
const getLarkCallback = (code, loading) => {
    return get('lark/oauth2', { code }, loading);
};
/**
 * SettingsLanguage
 * data: {
 * "language": "string"
 * }
 */
const postLanguage = (data, loading) => {
    return post('/user/language', data, undefined, loading);
};
const samlLogin = (loading) => {
    return get('/saml2', '', loading);
};
export default {
    login,
    logout,
    getCaptcha,
    getAuthType,
    getDingCallback,
    getQrType,
    getWecomCallback,
    postLanguage,
    getDingOauth2Callback,
    getLarkCallback,
    getQrSource,
    ldapLogin,
    samlLogin
};
