import { get, post, put } from '@/request/index';
const prefix = '/email_setting';
/**
 * GetEmailSettings
 */
const getEmailSetting = (loading) => {
    return get(`${prefix}`, undefined, loading);
};
/**
 * EmailTest
 */
const postTestEmail = (data, loading) => {
    return post(`${prefix}`, data, undefined, loading);
};
/**
 * ModificationEmailSettings
 */
const putEmailSetting = (data, loading) => {
    return put(`${prefix}`, data, undefined, loading);
};
export default {
    getEmailSetting,
    postTestEmail,
    putEmailSetting
};
