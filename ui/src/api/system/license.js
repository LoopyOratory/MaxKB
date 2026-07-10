import { get, put } from '@/request/index';
const prefix = '/license';
/**
 * GetlicenseInfo
 */
const getLicense = (loading) => {
    return get(`${prefix}/profile`, undefined, loading);
};
/**
 * UpdatelicenseInfo
 * @param Parameters  license_file:file
 */
const putLicense = (data, loading) => {
    return put(`${prefix}/profile`, data, undefined, loading);
};
export default {
    getLicense,
    putLicense
};
