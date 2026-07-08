import { Result } from '@/request/Result'
import { get, post, del, put } from '@/request/index'
import { type Ref } from 'vue'

import useStore from '@/stores'
const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId()
  },
})

/**
 * GetFolderList
 * @params Parameters
 *  source : APPLICATION, KNOWLEDGE, TOOL
 *  data : {name: string}
 */
const getFolder: (
  source: string,
  data?: any,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (source, data, loading) => {
  return get(`${prefix.value}/${source}/folder`, data, loading)
}

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
const postFolder: (
  source: string,
  data?: any,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (source, data, loading) => {
  return post(`${prefix.value}/${source}/folder`, data, null, loading)
}

/**
 * GetFolderDetails
 * @params Parameters
 *  folder_id
 *  source : APPLICATION, KNOWLEDGE, TOOL
 */
const getFolderDetail: (
  folder_id: string,
  source: string,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (folder_id, source, loading) => {
  return get(`${prefix.value}/${source}/folder/${folder_id}`, null, loading)
}
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
const putFolder: (
  folder_id: string,
  source: string,
  data?: any,
  loading?: Ref<boolean>,
) => Promise<Result<Array<any>>> = (folder_id, source, data, loading) => {
  return put(`${prefix.value}/${source}/folder/${folder_id}`, data, {}, loading)
}

/**
 * DeletionFolder
 * @params Parameters
 *  folder_id
 *  source : APPLICATION, KNOWLEDGE, TOOL
 */
const delFolder: (
  folder_id: string,
  source: string,
  loading?: Ref<boolean>,
) => Promise<Result<boolean>> = (folder_id, source, loading) => {
  return del(`${prefix.value}/${source}/folder/${folder_id}`, undefined, {}, loading)
}

export default {
  getFolder,
  postFolder,
  getFolderDetail,
  putFolder,
  delFolder,
}
