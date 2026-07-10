import { get, post } from '@/request/index';
import useStore from '@/stores';
const prefix = { _value: '/workspace/' };
Object.defineProperty(prefix, 'value', {
    get: function () {
        const { user } = useStore();
        return this._value + user.getWorkspaceId() + '/tool';
    },
});
/**
 * ToolStore-SystemBuilt-inList
 */
const getInternalToolList = (param, loading) => {
    return get('/workspace/internal/tool', param, loading);
};
/**
 * ToolStoreList
 */
const getStoreToolList = (param, loading) => {
    return get('/workspace/store/tool', param, loading);
};
const getStoreKBList = (param, loading) => {
    return get('/workspace/store/knowledge_template', param, loading);
};
const getStoreToolWorkflowList = (param, loading) => {
    return get('/workspace/store/tool_workflow_template', param, loading);
};
const getStoreAppList = (param, loading) => {
    return get('/workspace/store/application_template', param, loading);
};
/**
 * ToolStore-AddSystemBuilt-in
 */
const addInternalTool = (tool_id, param, loading) => {
    return post(`${prefix.value}/${tool_id}/add_internal_tool`, param, undefined, loading);
};
/**
 * ToolStore-Add
 */
const addStoreTool = (tool_id, param, loading) => {
    return post(`${prefix.value}/${tool_id}/add_store_tool`, param, undefined, loading);
};
export default {
    getInternalToolList,
    getStoreToolList,
    getStoreKBList,
    getStoreAppList,
    getStoreToolWorkflowList,
    addInternalTool,
    addStoreTool,
};
