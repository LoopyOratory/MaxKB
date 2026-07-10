import { get } from '@/request/index';
const prefix = '/system/resource';
/**
 * GetFolderList
 * @params Parameters
 *  source : APPLICATION, KNOWLEDGE, TOOL
 *  data : {name: string}
 */
const getFolder = (source, data, loading) => {
    return get(`${prefix}/${source}/folder`, data, loading);
};
export default {
    getFolder,
};
