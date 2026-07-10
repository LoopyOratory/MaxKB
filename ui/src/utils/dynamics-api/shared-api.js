import knowledgeWorkspaceApi from '@/api/knowledge/knowledge';
import documentWorkspaceApi from '@/api/knowledge/document';
import paragraphWorkspaceApi from '@/api/knowledge/paragraph';
import problemWorkspaceApi from '@/api/knowledge/problem';
import termbaseWorkspaceApi from '@/api/knowledge/termbase';
import resourceMappingApi from '@/api/workspace/resource-mapping';
import modelWorkspaceApi from '@/api/model/model';
import toolWorkspaceApi from '@/api/tool/tool';
import chatUserWorkspaceApi from '@/api/chat-user/chat-user';
import applicationWorkspaceApi from '@/api/application/application';
import applicationKeyWorkspaceApi from '@/api/application/application-key';
import workflowVersionWorkspaceApi from '@/api/application/workflow-version';
import chatLogWorkspaceApi from '@/api/application/chat-log';
import resourceAuthorizationWorkspaceApi from '@/api/workspace/resource-authorization';
import triggerApi from '@/api/trigger/trigger';
import sharedWorkspaceApi from '@/api/shared-workspace';
import toolSystemShareApi from '@/api/system-shared/tool';
import modelSystemShareApi from '@/api/system-shared/model';
import knowledgeSystemShareApi from '@/api/system-shared/knowledge';
import documentSystemShareApi from '@/api/system-shared/document';
import paragraphSystemShareApi from '@/api/system-shared/paragraph';
import problemSystemShareApi from '@/api/system-shared/problem';
import termbaseSystemShareApi from '@/api/system-shared/termbase';
import chatUserSystemShareApi from '@/api/system-shared/chat-user';
import workspaceApi from '@/api/workspace/workspace';
import folderWorkspaceApi from '@/api/workspace/folder';
import systemUserApi from '@/api/user/user';
import ToolResourceApi from '@/api/system-resource-management/tool';
import knowledgeResourceApi from '@/api/system-resource-management/knowledge';
import documentResourceApi from '@/api/system-resource-management/document';
import paragraphResourceApi from '@/api/system-resource-management/paragraph';
import problemResourceApi from '@/api/system-resource-management/problem';
import termbaseResourceApi from '@/api/system-resource-management/termbase';
import modelResourceApi from '@/api/system-resource-management/model';
import chatUserResourceApi from '@/api/system-resource-management/chat-user';
import applicationResourceApi from '@/api/system-resource-management/application';
import applicationKeyResourceApi from '@/api/system-resource-management/application-key';
import workflowVersionResourceApi from '@/api/system-resource-management/workflow-version';
import chatLogResourceApi from '@/api/system-resource-management/chat-log';
import resourceAuthorizationResourceApi from '@/api/system-resource-management/resource-authorization';
import folderResourceApi from '@/api/system-resource-management/folder';
import systemResourceMappingApi from '@/api/system-shared/resource-mapping';
import resourceManageMappingApi from '@/api/system-resource-management/resource-mapping';
import resourceTriggerApi from '@/api/system-resource-management/trigger';
// Normal API
const workspaceApiMap = {
    knowledge: knowledgeWorkspaceApi,
    model: modelWorkspaceApi,
    tool: toolWorkspaceApi,
    document: documentWorkspaceApi,
    paragraph: paragraphWorkspaceApi,
    problem: problemWorkspaceApi,
    termbase: termbaseWorkspaceApi,
    chatUser: chatUserWorkspaceApi,
    workspace: workspaceApi,
    application: applicationWorkspaceApi,
    applicationKey: applicationKeyWorkspaceApi,
    workflowVersion: workflowVersionWorkspaceApi,
    chatLog: chatLogWorkspaceApi,
    resourceAuthorization: resourceAuthorizationWorkspaceApi,
    folder: folderWorkspaceApi,
    resourceMapping: resourceMappingApi,
    trigger: triggerApi,
};
// SystemShare API
const systemShareApiMap = {
    knowledge: knowledgeSystemShareApi,
    model: modelSystemShareApi,
    tool: toolSystemShareApi,
    document: documentSystemShareApi,
    paragraph: paragraphSystemShareApi,
    problem: problemSystemShareApi,
    termbase: termbaseSystemShareApi,
    chatUser: chatUserSystemShareApi,
    workspace: systemUserApi, // Shared should query all users
    resourceMapping: systemResourceMappingApi,
};
// ResourceManage API
const systemManageApiMap = {
    knowledge: knowledgeResourceApi,
    document: documentResourceApi,
    paragraph: paragraphResourceApi,
    problem: problemResourceApi,
    termbase: termbaseResourceApi,
    model: modelResourceApi,
    tool: ToolResourceApi,
    chatUser: chatUserResourceApi,
    application: applicationResourceApi,
    applicationKey: applicationKeyResourceApi,
    workflowVersion: workflowVersionResourceApi,
    chatLog: chatLogResourceApi,
    resourceAuthorization: resourceAuthorizationResourceApi,
    folder: folderResourceApi,
    resourceMapping: resourceManageMappingApi,
    trigger: resourceTriggerApi,
};
const data = {
    systemShare: systemShareApiMap,
    workspace: workspaceApiMap,
    systemManage: systemManageApiMap,
    workspaceShare: workspaceApiMap,
};
/** DynamicImport API ModuleFunction
 *  loadSharedApi('knowledge', true,'systemShare')
 */
export function loadSharedApi({ type, isShared, systemType, }) {
    if (isShared) {
        // Shared API
        return sharedWorkspaceApi;
    }
    else {
        return data[systemType || 'workspace'][type];
    }
}
