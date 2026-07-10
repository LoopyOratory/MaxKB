import { get, post } from '@/request/index';
/**
 * GetUserBasicInfo
 * @param loading InterfaceLoader
 * @returns UserBasicInfo
 */
const getUserProfile = (loading) => {
    return get('/user/profile', undefined, loading);
};
/**
 * Getprofile
 */
const getProfile = (loading) => {
    return get('/profile', undefined, loading);
};
/**
 * GetAllUser
 */
const getUserList = (arg, loading) => {
    return get('/user/list', arg, loading);
};
/**
 * GetAllUser
 */
const getAllMemberList = (arg, loading) => {
    return get('/user/list', arg, loading);
};
/**
 * ValidateVerifyCode
 * @param request RequestObject
 * @param loading InterfaceLoader
 * @returns
 */
const checkCode = (request, loading) => {
    return post('/user/check_code', request, undefined, loading);
};
/**
 * SendEmail
 * @param email  EmailAddress
 * @param loading InterfaceLoader
 * @returns
 */
const sendEmit = (email, type, loading) => {
    return post('/user/send_email', { email, type }, undefined, loading);
};
/**
 * ResetPassword
 * @param request ResetPasswordRequestParameters
 * @param loading InterfaceLoader
 * @returns
 */
const postResetPassword = (request, loading) => {
    return post('/user/re_password', request, undefined, loading);
};
/**
 * ResetPassword
 * @param data ResetPasswordRequestParameters
 * @param loading InterfaceLoader
 * @returns
 */
const resetCurrentPassword = (data, loading) => {
    return post('/user/current/reset_password', data, undefined, loading);
};
export default {
    getUserProfile,
    getProfile,
    getUserList,
    getAllMemberList,
    postResetPassword,
    checkCode,
    sendEmit,
    resetCurrentPassword,
};
