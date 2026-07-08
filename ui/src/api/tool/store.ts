import { Result } from '@/request/Result'
import { get, post, del, put, exportFile } from '@/request/index'
import { type Ref } from 'vue'
import type { AddInternalToolParam } from '@/api/type/tool'

import useStore from '@/stores'
const prefix: any = { _value: '/workspace/' }
Object.defineProperty(prefix, 'value', {
  get: function () {
    const { user } = useStore()
    return this._value + user.getWorkspaceId() + '/tool'
  },
})

/**
 * ToolStore-SystemBuilt-inList
 */
const getInternalToolList: (param?: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  param,
  loading,
) => {
  return get('/workspace/internal/tool', param, loading)
}

/**
 * ToolStoreList
 */
const getStoreToolList: (param?: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  param,
  loading,
) => {
  return get('/workspace/store/tool', param, loading)
}

const getStoreKBList: (param?: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  param,
  loading,
) => {
  return get('/workspace/store/knowledge_template', param, loading)
}
const getStoreToolWorkflowList: (param?: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  param,
  loading,
) => {
  return get('/workspace/store/tool_workflow_template', param, loading)
}

const getStoreAppList: (param?: any, loading?: Ref<boolean>) => Promise<Result<any>> = (
  param,
  loading,
) => {
  return get('/workspace/store/application_template', param, loading)
}

/**
 * ToolStore-AddSystemBuilt-in
 */
const addInternalTool: (
  tool_id: string,
  param: AddInternalToolParam,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (tool_id, param, loading) => {
  return post(`${prefix.value}/${tool_id}/add_internal_tool`, param, undefined, loading)
}

/**
 * ToolStore-Add
 */
const addStoreTool: (
  tool_id: string,
  param: AddInternalToolParam,
  loading?: Ref<boolean>,
) => Promise<Result<any>> = (tool_id, param, loading) => {
  return post(`${prefix.value}/${tool_id}/add_store_tool`, param, undefined, loading)
}

export default {
  getInternalToolList,
  getStoreToolList,
  getStoreKBList,
  getStoreAppList,
  getStoreToolWorkflowList,
  addInternalTool,
  addStoreTool,
}
