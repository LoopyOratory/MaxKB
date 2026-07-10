import { get, post, put } from '@/request/index';
const prefix = '/platform';
const getPlatformInfo = (loading) => {
    return get(`${prefix}/source`, undefined, loading);
};
const updateConfig = (data, loading) => {
    return post(`${prefix}/source`, data, undefined, loading);
};
const validateConnection = (data, loading) => {
    return put(`${prefix}/source`, data, undefined, loading);
};
export default {
    getPlatformInfo,
    updateConfig,
    validateConnection
};
