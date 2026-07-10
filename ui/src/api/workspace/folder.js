import { get, post, del, put } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId();
    },
});
/**
 * GetFolderList
 * @params Parameters
 *  source : APPLICATION, KNOWLEDGE, TOOL
 *  data : {name: string}
 */
const getFolder = (source, data, loading) => {
    return get(`${prefix.value}/${source}/folder`, data, loading);
};
/**
 * AddFolder
 * @params Parameters
 *  source : APPLICATION, KNOWLEDGE, TOOL
 {
 "name": "string",
 "desc": "string",
 "parent_id": "default"
 }
 */
const postFolder = (source, data, loading) => {
    return post(`${prefix.value}/${source}/folder`, data, null, loading);
};
/**
 * GetFolderDetails
 * @params Parameters
 *  folder_id
 *  source : APPLICATION, KNOWLEDGE, TOOL
 */
const getFolderDetail = (folder_id, source, loading) => {
    return get(`${prefix.value}/${source}/folder/${folder_id}`, null, loading);
};
/**
 * ModificationFolder
 * @params Parameters
 *  folder_id: string,
 *  source : APPLICATION, KNOWLEDGE, TOOL
 {
 "name": "string",
 "desc": "string",
 "parent_id": "default"
 }
 */
const putFolder = (folder_id, source, data, loading) => {
    return put(`${prefix.value}/${source}/folder/${folder_id}`, data, {}, loading);
};
/**
 * DeletionFolder
 * @params Parameters
 *  folder_id
 *  source : APPLICATION, KNOWLEDGE, TOOL
 */
const delFolder = (folder_id, source, loading) => {
    return del(`${prefix.value}/${source}/folder/${folder_id}`, undefined, {}, loading);
};
export default {
    getFolder,
    postFolder,
    getFolderDetail,
    putFolder,
    delFolder,
};
