import { get, exportExcelPost, post } from '@/request/index';
const prefix = '/operate_log';
/**
 * LogPaginationList
 * @param Parameters
 * page  {
 "current_page": "string",
 "page_size": "string",
 }
 * @query Parameters
 param: any
 */
const getOperateLog = (page, param, loading) => {
    return get(`${prefix}/${page.current_page}/${page.page_size}`, param, loading);
};
const getMenuList = () => {
    return get(`${prefix}/menu_operation_option/`, undefined, undefined);
};
const exportOperateLog = (param, loading) => {
    exportExcelPost('log.xlsx', `${prefix}/export/`, param, undefined, loading);
};
const saveCleanTime = (data, loading) => {
    return post(`${prefix}/save`, data, undefined, loading);
};
const getCleanTime = () => {
    return get(`${prefix}/get_clean_time`, undefined, undefined);
};
export default {
    getOperateLog,
    getMenuList,
    exportOperateLog,
    saveCleanTime,
    getCleanTime
};
