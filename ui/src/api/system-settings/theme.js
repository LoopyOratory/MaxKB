import { get, put } from '@/request/index';
const prefix = '/display';
/**
 * View appearanceSettings
 */
const getThemeInfo = (loading) => {
    return get(`${prefix}/info`, undefined, loading);
};
/**
 * UpdateAppearanceSettings
 * @param Parameters
 * * formData {
 *   theme
 *   icon
 *   loginLogo
 *   loginImage
 *   title
 *   slogan
 * }
 */
const postThemeInfo = (data, loading) => {
    return put(`${prefix}/update`, data, undefined, loading);
};
export default {
    getThemeInfo,
    postThemeInfo
};
