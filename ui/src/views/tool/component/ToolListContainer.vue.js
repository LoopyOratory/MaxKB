/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { useRoute, onBeforeRouteLeave, useRouter } from 'vue-router';
import InitParamDrawer from '@/views/tool/component/InitParamDrawer.vue';
import ToolFormDrawer from '@/views/tool/ToolFormDrawer.vue';
import McpToolFormDrawer from '@/views/tool/McpToolFormDrawer.vue';
import SkillToolFormDrawer from '@/views/tool/SkillToolFormDrawer.vue';
import DataSourceToolFormDrawer from '@/views/tool/DataSourceToolFormDrawer.vue';
import CreateFolderDialog from '@/components/folder-virtualized-tree/CreateFolderDialog.vue';
import AuthorizedWorkspace from '@/views/system-shared/AuthorizedWorkspaceDialog.vue';
import ToolStoreDialog from '@/views/tool/tool-store/ToolStoreDialog.vue';
import AddInternalToolDialog from '@/views/tool/tool-store/AddInternalToolDialog.vue';
import MoveToDialog from '@/components/folder-virtualized-tree/MoveToDialog.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import McpToolConfigDialog from '@/views/tool/component/McpToolConfigDialog.vue';
import ResourceTriggerDrawer from '@/views/trigger/ResourceTriggerDrawer.vue';
import ToolStoreDescDrawer from '@/views/tool/component/ToolStoreDescDrawer.vue';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
import WorkflowFormDialog from '../WorkflowFormDialog.vue';
import ExecutionRecordDrawer from '@/views/tool-workflow/execution-record/ExecutionRecordDrawer.vue';
import ToolStoreApi from '@/api/tool/store.ts';
import { resetUrl, i18n_name } from '@/utils/common';
import { MsgSuccess, MsgConfirm, MsgError } from '@/utils/message';
import { SourceTypeEnum } from '@/enums/common';
import { dateFormat } from '@/utils/time';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
import useStore from '@/stores';
import { t } from '@/locales';
import bus from '@/bus';
const router = useRouter();
const route = useRoute();
const { folder, user, tool } = useStore();
onBeforeRouteLeave((to, from) => {
    tool.setToolList([]);
});
const emit = defineEmits(['refreshFolder']);
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const isShared = computed(() => {
    return folder.currentFolder.id === 'share';
});
const isSystemShare = computed(() => {
    return apiType.value === 'systemShare';
});
const permissionPrecise = computed(() => {
    return permissionMap['tool'][apiType.value];
});
const MoreFieldPermission = (id) => {
    return (permissionPrecise.value.edit(id) ||
        permissionPrecise.value.export(id) ||
        permissionPrecise.value.delete(id) ||
        permissionPrecise.value.auth(id) ||
        permissionPrecise.value.relate_map(id) ||
        permissionPrecise.value.trigger_read(id) ||
        permissionPrecise.value.record(id) ||
        isSystemShare.value);
};
const resourceTriggerDrawerRef = ref();
const openTriggerDrawer = (data) => {
    resourceTriggerDrawerRef.value?.open(data);
};
const resourceMappingDrawerRef = ref();
const openResourceMappingDrawer = (tool) => {
    resourceMappingDrawerRef.value?.open('TOOL', tool);
};
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id);
}
const toolRecordDrawerRef = ref();
const openToolRecordDrawer = (data) => {
    toolRecordDrawerRef.value?.open(data);
};
const InitParamDrawerRef = ref();
const search_type = ref('name');
const search_form = ref({
    name: '',
    create_user: '',
});
const user_options = ref([]);
const loading = ref(false);
const changeStateloading = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 30,
    total: 0,
});
const search_type_change = () => {
    search_form.value = { name: '', create_user: '' };
};
const ToolFormDrawerRef = ref();
const McpToolFormDrawerRef = ref();
const SkillToolFormDrawerRef = ref();
const DataSourceToolFormDrawerRef = ref();
const ToolDrawertitle = ref('');
const McpToolDrawertitle = ref('');
const SkillToolDrawertitle = ref('');
const DataSourceToolDrawertitle = ref('');
// BatchActions
const isBatch = ref(false);
const multipleSelection = ref([]);
const checkAll = ref(false);
const isIndeterminate = computed(() => {
    return multipleSelection.value.length > 0 && multipleSelection.value.length < tool.toolList.length;
});
function batchSelectedHandle(bool) {
    isBatch.value = bool;
    multipleSelection.value = [];
    checkAll.value = false;
}
const handleCheckAllChange = (val) => {
    let bool;
    if (isIndeterminate.value) {
        bool = true;
    }
    else {
        bool = val;
    }
    multipleSelection.value = bool ? tool.toolList.map((v) => v.id) : [];
    checkAll.value = bool;
};
const handleCheckedChatChange = (value) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === tool.toolList.length;
};
const checkboxChange = (data) => {
    const index = multipleSelection.value.indexOf(data?.id);
    if (index === -1) {
        multipleSelection.value.push(data?.id);
    }
    else {
        multipleSelection.value.splice(index, 1);
    }
    checkAll.value = multipleSelection.value.length === tool.toolList.length;
};
function deleteMulTool() {
    MsgConfirm(`${t('views.document.delete.confirmTitle1')} ${multipleSelection.value.length} ${t('views.tool.delete.confirmTitle2')}`, t('views.paragraph.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .delMulTool(multipleSelection.value, loading)
            .then(() => {
            batchSelectedHandle(false);
            paginationConfig.current_page = 1;
            tool.setToolList([]);
            getList();
            MsgSuccess(t('views.document.delete.successMessage'));
        });
    })
        .catch(() => { });
}
function openEditDialog(data) {
    if (isBatch.value) {
        const index = multipleSelection.value.indexOf(data?.id);
        if (index === -1) {
            multipleSelection.value.push(data?.id);
        }
        else {
            multipleSelection.value.splice(index, 1);
        }
        checkAll.value = multipleSelection.value.length === tool.toolList.length;
        return;
    }
    if (!permissionPrecise.value.edit(data?.id)) {
        return;
    }
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    // Shared tools prevent editing
    if (isShared.value) {
        return;
    }
    if (data) {
        bus.emit('select_node', data.folder_id);
    }
    // Has version number displayed in readme, updated from store
    if (data?.version) {
        let readMe = '';
        storeTools.value
            .filter((item) => item.id === data.template_id)
            .forEach((item) => {
            readMe = item.readMe;
        });
        toolStoreDescDrawerRef.value?.open(readMe, data);
        return;
    }
    // mcpTools
    if (data?.tool_type === 'MCP') {
        openCreateMcpDialog(data);
        return;
    }
    // Data sourceTools
    if (data?.tool_type === 'DATA_SOURCE') {
        openCreateDataSourceDialog(data);
        return;
    }
    // Skills
    if (data?.tool_type === 'SKILL') {
        openCreateSkillDialog(data);
        return;
    }
    // Workflow
    if (data?.tool_type === 'WORKFLOW') {
        toWorkflow(data);
        return;
    }
    ToolDrawertitle.value = t('views.tool.editTool');
    if (data) {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .getToolById(data?.id, loading)
            .then((res) => {
            ToolFormDrawerRef.value.open(res.data);
        });
    }
}
const MoveToDialogRef = ref();
function openMoveToDialog(data) {
    let obj;
    if (isBatch.value) {
        obj = {
            id_list: multipleSelection.value,
        };
    }
    else {
        obj = {
            id: data.id,
            folder_id: data.folder,
        };
    }
    MoveToDialogRef.value?.open(obj);
}
function refreshToolList(row) {
    if (row) {
        // Not rootDirectoryOnly thenRemove
        if (folder.currentFolder?.parent_id) {
            const list = cloneDeep(tool.toolList);
            const index = list.findIndex((v) => v.id === row.id);
            list.splice(index, 1);
            tool.setToolList(list);
        }
    }
    else {
        batchSelectedHandle(false);
        paginationConfig.current_page = 1;
        tool.setToolList([]);
        getList();
    }
}
const AuthorizedWorkspaceDialogRef = ref();
function openAuthorizedWorkspaceDialog(row) {
    if (AuthorizedWorkspaceDialogRef.value) {
        AuthorizedWorkspaceDialogRef.value.open(row, 'Tool');
    }
}
const toolStoreDescDrawerRef = ref();
function openCreateDialog() {
    ToolDrawertitle.value = t('views.tool.createTool');
    ToolFormDrawerRef.value.open();
}
function openCreateMcpDialog(data) {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    // Shared tools prevent editing
    if (isShared.value) {
        return;
    }
    McpToolDrawertitle.value = data
        ? t('views.tool.mcp.editMcpTool')
        : t('views.tool.mcp.createMcpTool');
    if (data) {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .getToolById(data?.id, loading)
            .then((res) => {
            McpToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        McpToolFormDrawerRef.value.open(data);
    }
}
function openCreateSkillDialog(data) {
    // Has version number displayed in readme, updated from store
    if (data?.version) {
        let readMe = '';
        storeTools.value
            .filter((item) => item.id === data.template_id)
            .forEach((item) => {
            readMe = item.readMe;
        });
        toolStoreDescDrawerRef.value?.open(readMe, data);
        return;
    }
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    // Shared tools prevent editing
    if (isShared.value) {
        return;
    }
    SkillToolDrawertitle.value = data
        ? t('views.tool.skill.editSkillTool')
        : t('views.tool.skill.createSkillTool');
    if (data) {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .getToolById(data?.id, loading)
            .then((res) => {
            SkillToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        SkillToolFormDrawerRef.value.open(data);
    }
}
function toWorkflow(data) {
    const folderId = data.scope === 'SHARED' ? 'shared' : data.folder_id;
    router.push({ name: 'ToolWorkflow', params: { id: data.id, folderId: folderId } });
}
const workflowFormDialogRef = ref();
const workflowFormDialogTitle = ref('');
const openCreateWorkflowDialog = (data) => {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    // Shared tools prevent editing
    if (isShared.value) {
        return;
    }
    workflowFormDialogTitle.value = data
        ? t('common.edit')
        : t('views.tool.toolWorkflow.creatToolWorkflow');
    if (data) {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .getToolById(data?.id, loading)
            .then((res) => {
            workflowFormDialogRef.value?.open(res.data);
        });
    }
    else {
        workflowFormDialogRef.value?.open(data);
    }
};
function openCreateDataSourceDialog(data) {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    // Shared tools prevent editing
    if (isShared.value) {
        return;
    }
    DataSourceToolDrawertitle.value = data
        ? t('views.tool.dataSource.editDataSource')
        : t('views.tool.dataSource.createDataSource');
    if (data) {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .getToolById(data?.id, loading)
            .then((res) => {
            DataSourceToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        DataSourceToolFormDrawerRef.value.open(data);
    }
}
async function changeState(row) {
    if (row.is_active) {
        MsgConfirm(`${t('views.tool.disabled.confirmTitle')}${row.name} ?`, t('views.tool.disabled.confirmMessage'), {
            confirmButtonText: t('common.status.disable'),
            confirmButtonClass: 'danger',
        }).then(() => {
            const obj = {
                is_active: !row.is_active,
            };
            loadSharedApi({ type: 'tool', systemType: apiType.value })
                .putTool(row.id, obj, changeStateloading)
                .then(() => {
                const list = cloneDeep(tool.toolList);
                const index = list.findIndex((v) => v.id === row.id);
                list[index].is_active = !row.is_active;
                tool.setToolList(list);
                return true;
            })
                .catch(() => {
                return false;
            });
        });
    }
    else {
        const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(row.id, changeStateloading);
        if (row.tool_type === 'WORKFLOW' && !res.data.is_publish) {
            MsgConfirm(t('common.tip'), t('views.tool.toolWorkflow.toActiveTip')).then(() => {
                toWorkflow(row);
            });
            return;
        }
        if ((!res.data.init_params || Object.keys(res.data.init_params).length === 0) &&
            res.data.init_field_list &&
            res.data.init_field_list.length > 0 &&
            res.data.init_field_list.filter((item) => item.default_value && item.show_default_value)
                .length !== res.data.init_field_list.length) {
            InitParamDrawerRef.value.open(res.data, !row.is_active);
            return false;
        }
        const obj = {
            is_active: !row.is_active,
        };
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .putTool(row.id, obj, changeStateloading)
            .then(() => {
            const list = cloneDeep(tool.toolList);
            const index = list.findIndex((v) => v.id === row.id);
            list[index].is_active = !row.is_active;
            tool.setToolList(list);
            return true;
        })
            .catch(() => {
            return false;
        });
    }
}
async function copyTool(row) {
    // mcpTools
    if (row?.tool_type === 'MCP') {
        bus.emit('select_node', row.folder_id);
        await copyMcpTool(row);
        return;
    }
    // Data sourceTools
    if (row?.tool_type === 'DATA_SOURCE') {
        bus.emit('select_node', row.folder_id);
        await copyDataSource(row);
        return;
    }
    // Skills
    if (row?.tool_type === 'SKILL') {
        bus.emit('select_node', row.folder_id);
        await copySkillTool(row);
        return;
    }
    if (row?.tool_type === 'WORKFLOW') {
        workflowFormDialogTitle.value = t('views.tool.toolWorkflow.copyToolWorkflow');
        const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(row.id, changeStateloading);
        const obj = cloneDeep(res.data);
        delete obj['id'];
        obj['name'] = obj['name'] + `  ${t('common.copyTitle')}`;
        workflowFormDialogRef.value?.open(obj);
        return;
    }
    ToolDrawertitle.value = t('views.tool.copyTool');
    const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(row.id, changeStateloading);
    const obj = cloneDeep(res.data);
    delete obj['id'];
    obj['name'] = obj['name'] + `  ${t('common.copyTitle')}`;
    ToolFormDrawerRef.value.open(obj);
}
async function copyMcpTool(row) {
    McpToolDrawertitle.value = t('views.tool.mcp.copyMcpTool');
    const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(row.id, changeStateloading);
    const obj = cloneDeep(res.data);
    delete obj['id'];
    obj['name'] = obj['name'] + `  ${t('common.copyTitle')}`;
    McpToolFormDrawerRef.value.open(obj);
}
async function copyDataSource(row) {
    DataSourceToolDrawertitle.value = t('views.tool.dataSource.copyDataSource');
    const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(row.id, changeStateloading);
    const obj = cloneDeep(res.data);
    delete obj['id'];
    obj['name'] = obj['name'] + `  ${t('common.copyTitle')}`;
    DataSourceToolFormDrawerRef.value.open(obj);
}
async function copySkillTool(row) {
    SkillToolDrawertitle.value = t('views.tool.skill.copySkillTool');
    const res = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(row.id, changeStateloading);
    const obj = cloneDeep(res.data);
    delete obj['id'];
    obj['name'] = obj['name'] + `  ${t('common.copyTitle')}`;
    SkillToolFormDrawerRef.value.open(obj);
}
function exportTool(row) {
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .exportTool(row.id, row.name, loading)
        .catch((e) => {
        if (e.response.status !== 403) {
            e.response.data.text().then((res) => {
                MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
            });
        }
    });
}
function deleteTool(row) {
    MsgConfirm(`${t('views.tool.delete.confirmTitle')}：${row.name} ?`, row.resource_count > 0 ? t('views.tool.delete.resourceCountMessage', row.resource_count) : '', {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .delTool(row.id, loading)
            .then(() => {
            const list = cloneDeep(tool.toolList);
            const index = list.findIndex((v) => v.id === row.id);
            list.splice(index, 1);
            tool.setToolList(list);
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
}
function configInitParams(item) {
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getToolById(item?.id, changeStateloading)
        .then((res) => {
        InitParamDrawerRef.value.open(res.data);
    });
}
const toolStoreDialogRef = ref();
function openToolStoreDialog() {
    toolStoreDialogRef.value?.open(folder.currentFolder.id);
}
const AddInternalToolDialogRef = ref();
function addInternalTool(data, isEdit) {
    AddInternalToolDialogRef.value?.open(data, isEdit);
}
function confirmAddInternalTool(data, isEdit) {
    if (isEdit) {
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .putTool(data?.id, { name: data.name }, loading)
            .then((res) => {
            MsgSuccess(t('common.saveSuccess'));
            refresh();
        });
    }
}
const storeTools = ref([]);
function getStoreToolList() {
    ToolStoreApi.getStoreToolList({ name: '' }, loading).then((res) => {
        storeTools.value = res.data.apps;
    });
}
function showUpdateStoreTool(item) {
    for (const tool of storeTools.value) {
        if (tool.id === item.template_id && tool.version !== item.version) {
            item.downloadUrl = tool.downloadUrl;
            item.downloadCallbackUrl = tool.downloadCallbackUrl;
            item.icon = tool.icon;
            item.versions = tool.versions;
            item.label = tool.label;
            return true;
        }
    }
}
function updateStoreTool(item) {
    MsgConfirm(t('views.tool.toolStore.confirmTip') + item.name, t('views.tool.toolStore.updateStoreToolMessage'), {
        cancelButtonText: t('common.cancel'),
        confirmButtonText: t('common.confirm'),
    })
        .then(() => {
        const obj = {
            download_url: item.downloadUrl,
            download_callback_url: item.downloadCallbackUrl,
            icon: item.icon,
            versions: item.versions,
            label: item.label,
        };
        loadSharedApi({ type: 'tool', systemType: apiType.value })
            .updateStoreTool(item.id, obj, loading)
            .then(async (res) => {
            if (res?.data) {
                tool.setToolList([]);
                return user.profile().then(() => {
                    getList();
                });
            }
        });
    })
        .catch(() => { });
}
const elUploadRef = ref();
function importTool(file) {
    const formData = new FormData();
    formData.append('file', file.raw, file.name);
    formData.append('folder_id', folder.currentFolder.id || user.getWorkspaceId());
    elUploadRef.value.clearFiles();
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .postImportTool(formData, loading)
        .then(async (res) => {
        if (res?.data) {
            tool.setToolList([]);
            return user.profile().then(() => {
                getList();
            });
        }
    })
        .catch((e) => {
        if (e.code === 400) {
            MsgConfirm(t('common.tip'), t('views.application.tip.professionalMessage'), {
                cancelButtonText: t('common.confirm'),
                confirmButtonText: t('common.professional'),
            }).then(() => {
                window.open('https://maxkb.cn/pricing.html', '_blank');
            });
        }
    });
}
const McpToolConfigDialogRef = ref();
function showMcpConfig(item) {
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getToolById(item?.id, loading)
        .then((res) => {
        McpToolConfigDialogRef.value.open(res.data);
    });
}
function refresh(data) {
    if (data) {
        const list = cloneDeep(tool.toolList);
        const index = list.findIndex((v) => v.id === data.id);
        list.splice(index, 1, data);
        tool.setToolList(list);
    }
    else {
        paginationConfig.total = 0;
        paginationConfig.current_page = 1;
        tool.setToolList([]);
        getList();
    }
}
// FolderRelated
const CreateFolderDialogRef = ref();
function openCreateFolder() {
    CreateFolderDialogRef.value.open(SourceTypeEnum.TOOL, folder.currentFolder.id);
}
watch(() => folder.currentFolder, (newValue) => {
    if (newValue && newValue.id) {
        batchSelectedHandle(false);
        paginationConfig.current_page = 1;
        tool.setToolList([]);
        getList();
    }
}, { deep: true, immediate: true });
watch(() => tool.tool_type, () => {
    paginationConfig.current_page = 1;
    tool.setToolList([]);
    getList();
});
function getList() {
    const params = {
        folder_id: folder.currentFolder?.id || user.getWorkspaceId(),
        scope: apiType.value === 'systemShare' ? 'SHARED' : 'WORKSPACE',
        tool_type: tool.tool_type || '',
    };
    if (search_form.value[search_type.value]) {
        params[search_type.value] = search_form.value[search_type.value];
    }
    loadSharedApi({ type: 'tool', isShared: isShared.value, systemType: apiType.value })
        .getToolListPage(paginationConfig, params, loading)
        .then((res) => {
        paginationConfig.total = res.data?.total;
        tool.setToolList([...tool.toolList, ...res.data?.records]);
    });
}
function refreshFolder() {
    emit('refreshFolder');
}
function searchHandle() {
    paginationConfig.current_page = 1;
    tool.setToolList([]);
    getList();
}
function getUserList(query) {
    let workspaceId = user.getWorkspaceId();
    if (isSystemShare.value) {
        workspaceId = '';
    }
    const actualWorkspaceId = workspaceId || (query ? { nick_name: query } : '');
    const actualQuery = workspaceId ? (query ? { nick_name: query } : '') : undefined;
    loadSharedApi({ type: 'workspace', isShared: isShared.value, systemType: apiType.value })
        .getAllMemberList(actualWorkspaceId, actualQuery, loading)
        .then((res) => {
        user_options.value = res.data;
    });
}
onMounted(() => {
    if (apiType.value !== 'workspace') {
        getList();
    }
    getStoreToolList();
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.ContentContainer | typeof __VLS_components.ContentContainer} */
ContentContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    var __VLS_8 = {};
}
{
    const { search: __VLS_10 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between complex-search" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
    let __VLS_11;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }));
    const __VLS_13 = __VLS_12({
        ...{ 'onChange': {} },
        ...{ class: "complex-search__left" },
        modelValue: (__VLS_ctx.search_type),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    let __VLS_16;
    const __VLS_17 = {
        /** @type {typeof __VLS_16.change} */
        onChange: (__VLS_ctx.search_type_change),
    };
    /** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
    const { default: __VLS_18 } = __VLS_14.slots;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }));
    const __VLS_21 = __VLS_20({
        label: (__VLS_ctx.$t('common.creator')),
        value: "create_user",
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        label: (__VLS_ctx.$t('common.name')),
        value: "name",
    }));
    const __VLS_26 = __VLS_25({
        label: (__VLS_ctx.$t('common.name')),
        value: "name",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    // @ts-ignore
    [search_type, search_type_change, $t, $t,];
    var __VLS_14;
    var __VLS_15;
    if (__VLS_ctx.search_type === 'name') {
        let __VLS_29;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }));
        const __VLS_31 = __VLS_30({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.name),
            placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
            ...{ style: {} },
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        let __VLS_34;
        const __VLS_35 = {
            /** @type {typeof __VLS_34.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        var __VLS_32;
        var __VLS_33;
    }
    else if (__VLS_ctx.search_type === 'create_user') {
        let __VLS_36;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }));
        const __VLS_38 = __VLS_37({
            ...{ 'onChange': {} },
            modelValue: (__VLS_ctx.search_form.create_user),
            filterable: true,
            clearable: true,
            remote: true,
            remoteMethod: (__VLS_ctx.getUserList),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_37));
        let __VLS_41;
        const __VLS_42 = {
            /** @type {typeof __VLS_41.change} */
            onChange: (__VLS_ctx.searchHandle),
        };
        const { default: __VLS_43 } = __VLS_39.slots;
        for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
            let __VLS_44;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }));
            const __VLS_46 = __VLS_45({
                key: (u.id),
                value: (u.id),
                label: (u.nick_name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_45));
            // @ts-ignore
            [search_type, search_type, $t, search_form, search_form, searchHandle, searchHandle, getUserList, user_options,];
        }
        // @ts-ignore
        [];
        var __VLS_39;
        var __VLS_40;
    }
    if (!__VLS_ctx.isShared && (__VLS_ctx.permissionPrecise.batchMove() || __VLS_ctx.permissionPrecise.batchDelete())) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        if (__VLS_ctx.isBatch === false) {
            let __VLS_49;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
                ...{ 'onClick': {} },
            }));
            const __VLS_51 = __VLS_50({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
            let __VLS_54;
            const __VLS_55 = {
                /** @type {typeof __VLS_54.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.isShared && (__VLS_ctx.permissionPrecise.batchMove() || __VLS_ctx.permissionPrecise.batchDelete())))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.batchSelectedHandle(true);
                    // @ts-ignore
                    [isShared, permissionPrecise, permissionPrecise, isBatch, batchSelectedHandle,];
                },
            };
            const { default: __VLS_56 } = __VLS_52.slots;
            let __VLS_57;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }));
            const __VLS_59 = __VLS_58({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.paragraph.setting.batchSelected'));
            // @ts-ignore
            [$t,];
            var __VLS_52;
            var __VLS_53;
        }
        if (__VLS_ctx.isBatch === true) {
            let __VLS_62;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
                ...{ 'onClick': {} },
            }));
            const __VLS_64 = __VLS_63({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_63));
            let __VLS_67;
            const __VLS_68 = {
                /** @type {typeof __VLS_67.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.isShared && (__VLS_ctx.permissionPrecise.batchMove() || __VLS_ctx.permissionPrecise.batchDelete())))
                        throw 0;
                    if (!(__VLS_ctx.isBatch === true))
                        throw 0;
                    return __VLS_ctx.batchSelectedHandle(false);
                    // @ts-ignore
                    [isBatch, batchSelectedHandle,];
                },
            };
            const { default: __VLS_69 } = __VLS_65.slots;
            let __VLS_70;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }));
            const __VLS_72 = __VLS_71({
                iconName: "app-batch-delete",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_71));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
            // @ts-ignore
            [$t,];
            var __VLS_65;
            var __VLS_66;
        }
    }
    if (__VLS_ctx.isBatch === false) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        if (!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            let __VLS_75;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
                ...{ 'onClick': {} },
            }));
            const __VLS_77 = __VLS_76({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_76));
            let __VLS_80;
            const __VLS_81 = {
                /** @type {typeof __VLS_80.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    if (!(!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()))
                        throw 0;
                    return __VLS_ctx.openToolStoreDialog();
                    // @ts-ignore
                    [isShared, permissionPrecise, isBatch, openToolStoreDialog,];
                },
            };
            const { default: __VLS_82 } = __VLS_78.slots;
            let __VLS_83;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                iconName: "app-tool-store",
                ...{ class: "mr-4" },
            }));
            const __VLS_85 = __VLS_84({
                iconName: "app-tool-store",
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('views.tool.toolStore.title'));
            // @ts-ignore
            [$t,];
            var __VLS_78;
            var __VLS_79;
        }
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            trigger: "click",
        }));
        const __VLS_90 = __VLS_89({
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        const { default: __VLS_93 } = __VLS_91.slots;
        if (!__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.create()) {
            let __VLS_94;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
                type: "primary",
                ...{ class: "ml-8" },
            }));
            const __VLS_96 = __VLS_95({
                type: "primary",
                ...{ class: "ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_95));
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_99 } = __VLS_97.slots;
            (__VLS_ctx.$t('common.create'));
            let __VLS_100;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
                ...{ class: "el-icon--right" },
            }));
            const __VLS_102 = __VLS_101({
                ...{ class: "el-icon--right" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_101));
            /** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
            const { default: __VLS_105 } = __VLS_103.slots;
            let __VLS_106;
            /** @ts-ignore @type { | typeof __VLS_components.arrowDown | typeof __VLS_components.ArrowDown | typeof __VLS_components['arrow-down']} */
            arrowDown;
            // @ts-ignore
            const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({}));
            const __VLS_108 = __VLS_107({}, ...__VLS_functionalComponentArgsRest(__VLS_107));
            // @ts-ignore
            [$t, isShared, permissionPrecise,];
            var __VLS_103;
            // @ts-ignore
            [];
            var __VLS_97;
        }
        {
            const { dropdown: __VLS_111 } = __VLS_91.slots;
            let __VLS_112;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
                ...{ class: "create-dropdown" },
            }));
            const __VLS_114 = __VLS_113({
                ...{ class: "create-dropdown" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_113));
            /** @type {__VLS_StyleScopedClasses['create-dropdown']} */ ;
            const { default: __VLS_117 } = __VLS_115.slots;
            let __VLS_118;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
                ...{ 'onClick': {} },
            }));
            const __VLS_120 = __VLS_119({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_119));
            let __VLS_123;
            const __VLS_124 = {
                /** @type {typeof __VLS_123.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.openCreateDialog();
                    // @ts-ignore
                    [openCreateDialog,];
                },
            };
            const { default: __VLS_125 } = __VLS_121.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_126;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
                ...{ class: "avatar-green" },
                shape: "square",
                size: (32),
            }));
            const __VLS_128 = __VLS_127({
                ...{ class: "avatar-green" },
                shape: "square",
                size: (32),
            }, ...__VLS_functionalComponentArgsRest(__VLS_127));
            /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
            const { default: __VLS_131 } = __VLS_129.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/tool/icon_tool.svg",
                ...{ style: {} },
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_129;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "pre-wrap ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.$t('views.tool.title'));
            // @ts-ignore
            [$t,];
            var __VLS_121;
            var __VLS_122;
            let __VLS_132;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
                ...{ 'onClick': {} },
            }));
            const __VLS_134 = __VLS_133({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            let __VLS_137;
            const __VLS_138 = {
                /** @type {typeof __VLS_137.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.openCreateWorkflowDialog();
                    // @ts-ignore
                    [openCreateWorkflowDialog,];
                },
            };
            const { default: __VLS_139 } = __VLS_135.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_140;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
                ...{ class: "avatar-green mt-4" },
                shape: "square",
                size: (32),
            }));
            const __VLS_142 = __VLS_141({
                ...{ class: "avatar-green mt-4" },
                shape: "square",
                size: (32),
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            /** @type {__VLS_StyleScopedClasses['avatar-green']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_145 } = __VLS_143.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/workflow/logo_workflow.svg",
                ...{ style: {} },
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_143;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "pre-wrap ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.$t('workflow.workflow'));
            // @ts-ignore
            [$t,];
            var __VLS_135;
            var __VLS_136;
            let __VLS_146;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
                ...{ 'onClick': {} },
            }));
            const __VLS_148 = __VLS_147({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_147));
            let __VLS_151;
            const __VLS_152 = {
                /** @type {typeof __VLS_151.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.openCreateSkillDialog();
                    // @ts-ignore
                    [openCreateSkillDialog,];
                },
            };
            const { default: __VLS_153 } = __VLS_149.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_154;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
                shape: "square",
                size: (32),
            }));
            const __VLS_156 = __VLS_155({
                shape: "square",
                size: (32),
            }, ...__VLS_functionalComponentArgsRest(__VLS_155));
            const { default: __VLS_159 } = __VLS_157.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/tool/icon_skill.svg",
                ...{ style: {} },
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_157;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "pre-wrap ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            // @ts-ignore
            [];
            var __VLS_149;
            var __VLS_150;
            let __VLS_160;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
                ...{ 'onClick': {} },
            }));
            const __VLS_162 = __VLS_161({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_161));
            let __VLS_165;
            const __VLS_166 = {
                /** @type {typeof __VLS_165.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.openCreateMcpDialog();
                    // @ts-ignore
                    [openCreateMcpDialog,];
                },
            };
            const { default: __VLS_167 } = __VLS_163.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_168;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
                shape: "square",
                size: (32),
            }));
            const __VLS_170 = __VLS_169({
                shape: "square",
                size: (32),
            }, ...__VLS_functionalComponentArgsRest(__VLS_169));
            const { default: __VLS_173 } = __VLS_171.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/tool/icon_mcp.svg",
                ...{ style: {} },
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_171;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "pre-wrap ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            // @ts-ignore
            [];
            var __VLS_163;
            var __VLS_164;
            let __VLS_174;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
                ...{ 'onClick': {} },
            }));
            const __VLS_176 = __VLS_175({
                ...{ 'onClick': {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_175));
            let __VLS_179;
            const __VLS_180 = {
                /** @type {typeof __VLS_179.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.isBatch === false))
                        throw 0;
                    return __VLS_ctx.openCreateDataSourceDialog();
                    // @ts-ignore
                    [openCreateDataSourceDialog,];
                },
            };
            const { default: __VLS_181 } = __VLS_177.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_182;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                ...{ class: "avatar-purple" },
                shape: "square",
                size: (32),
            }));
            const __VLS_184 = __VLS_183({
                ...{ class: "avatar-purple" },
                shape: "square",
                size: (32),
            }, ...__VLS_functionalComponentArgsRest(__VLS_183));
            /** @type {__VLS_StyleScopedClasses['avatar-purple']} */ ;
            const { default: __VLS_187 } = __VLS_185.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/tool/icon_datasource.svg",
                ...{ style: {} },
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_185;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "pre-wrap ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "lighter" },
            });
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            (__VLS_ctx.$t('views.tool.dataSource.title'));
            // @ts-ignore
            [$t,];
            var __VLS_177;
            var __VLS_178;
            let __VLS_188;
            /** @ts-ignore @type { | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload'] | typeof __VLS_components.elUpload | typeof __VLS_components.ElUpload | typeof __VLS_components['el-upload']} */
            elUpload;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
                ref: "elUploadRef",
                fileList: ([]),
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                limit: (1),
                onChange: ((file, fileList) => __VLS_ctx.importTool(file)),
                ...{ class: "import-button" },
            }));
            const __VLS_190 = __VLS_189({
                ref: "elUploadRef",
                fileList: ([]),
                action: "#",
                multiple: true,
                autoUpload: (false),
                showFileList: (false),
                limit: (1),
                onChange: ((file, fileList) => __VLS_ctx.importTool(file)),
                ...{ class: "import-button" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            var __VLS_193;
            /** @type {__VLS_StyleScopedClasses['import-button']} */ ;
            const { default: __VLS_195 } = __VLS_191.slots;
            if (__VLS_ctx.permissionPrecise.import()) {
                let __VLS_196;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({}));
                const __VLS_198 = __VLS_197({}, ...__VLS_functionalComponentArgsRest(__VLS_197));
                const { default: __VLS_201 } = __VLS_199.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center w-full" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                let __VLS_202;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }));
                const __VLS_204 = __VLS_203({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_203));
                const { default: __VLS_207 } = __VLS_205.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/icon_import.svg",
                    alt: "",
                });
                // @ts-ignore
                [permissionPrecise, importTool,];
                var __VLS_205;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-8" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('common.importCreate'));
                // @ts-ignore
                [$t,];
                var __VLS_199;
            }
            // @ts-ignore
            [];
            var __VLS_191;
            if (__VLS_ctx.apiType === 'workspace') {
                let __VLS_208;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
                    ...{ 'onClick': {} },
                    divided: true,
                }));
                const __VLS_210 = __VLS_209({
                    ...{ 'onClick': {} },
                    divided: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_209));
                let __VLS_213;
                const __VLS_214 = {
                    /** @type {typeof __VLS_213.click} */
                    onClick: (__VLS_ctx.openCreateFolder),
                };
                const { default: __VLS_215 } = __VLS_211.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                let __VLS_216;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_217 = __VLS_asFunctionalComponent1(__VLS_216, new __VLS_216({
                    iconName: "app-folder",
                    ...{ style: {} },
                }));
                const __VLS_218 = __VLS_217({
                    iconName: "app-folder",
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_217));
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "pre-wrap ml-4" },
                });
                /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "lighter" },
                });
                /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
                (__VLS_ctx.$t('components.folder.addFolder'));
                // @ts-ignore
                [$t, apiType, openCreateFolder,];
                var __VLS_211;
                var __VLS_212;
            }
            // @ts-ignore
            [];
            var __VLS_115;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_91;
    }
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, modifiers: { fullscreen: true, lock: true, }, value: (__VLS_ctx.paginationConfig.current_page === 1 && __VLS_ctx.loading) }, null, null);
let __VLS_221;
/** @ts-ignore @type { | typeof __VLS_components.InfiniteScroll | typeof __VLS_components.InfiniteScroll} */
InfiniteScroll;
// @ts-ignore
const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.tool.toolList.length),
    total: (__VLS_ctx.paginationConfig.total),
    page_size: (__VLS_ctx.paginationConfig.page_size),
    current_page: (__VLS_ctx.paginationConfig.current_page),
    loading: (__VLS_ctx.loading),
}));
const __VLS_223 = __VLS_222({
    ...{ 'onLoad': {} },
    size: (__VLS_ctx.tool.toolList.length),
    total: (__VLS_ctx.paginationConfig.total),
    page_size: (__VLS_ctx.paginationConfig.page_size),
    current_page: (__VLS_ctx.paginationConfig.current_page),
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_222));
let __VLS_226;
const __VLS_227 = {
    /** @type {typeof __VLS_226.load} */
    onLoad: (__VLS_ctx.getList),
};
const { default: __VLS_228 } = __VLS_224.slots;
let __VLS_229;
/** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
elCheckboxGroup;
// @ts-ignore
const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.multipleSelection),
}));
const __VLS_231 = __VLS_230({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.multipleSelection),
}, ...__VLS_functionalComponentArgsRest(__VLS_230));
let __VLS_234;
const __VLS_235 = {
    /** @type {typeof __VLS_234.change} */
    onChange: (__VLS_ctx.handleCheckedChatChange),
};
const { default: __VLS_236 } = __VLS_232.slots;
if (__VLS_ctx.tool.toolList.length > 0) {
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        gutter: (15),
        ...{ class: "w-full" },
    }));
    const __VLS_239 = __VLS_238({
        gutter: (15),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_242 } = __VLS_240.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.tool.toolList))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_243;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            ...{ class: "mb-16" },
        }));
        const __VLS_245 = __VLS_244({
            xs: (24),
            sm: (12),
            md: (12),
            lg: (8),
            xl: (6),
            ...{ class: "mb-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_244));
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        const { default: __VLS_248 } = __VLS_246.slots;
        let __VLS_249;
        /** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
        CardBox;
        // @ts-ignore
        const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
            ...{ 'onClick': {} },
            title: (item.name),
            description: (item.desc),
            ...{ class: "cursor" },
            ...{ class: ({
                    'border-active': __VLS_ctx.multipleSelection.includes(item.id),
                }) },
            disabled: (!__VLS_ctx.permissionPrecise.edit(item.id) || __VLS_ctx.isBatch),
        }));
        const __VLS_251 = __VLS_250({
            ...{ 'onClick': {} },
            title: (item.name),
            description: (item.desc),
            ...{ class: "cursor" },
            ...{ class: ({
                    'border-active': __VLS_ctx.multipleSelection.includes(item.id),
                }) },
            disabled: (!__VLS_ctx.permissionPrecise.edit(item.id) || __VLS_ctx.isBatch),
        }, ...__VLS_functionalComponentArgsRest(__VLS_250));
        let __VLS_254;
        const __VLS_255 = {
            /** @type {typeof __VLS_254.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.tool.toolList.length > 0))
                    throw 0;
                return __VLS_ctx.openEditDialog(item);
                // @ts-ignore
                [permissionPrecise, isBatch, vLoading, paginationConfig, paginationConfig, paginationConfig, paginationConfig, loading, loading, tool, tool, tool, getList, multipleSelection, multipleSelection, handleCheckedChatChange, openEditDialog,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-active']} */ ;
        const { default: __VLS_256 } = __VLS_252.slots;
        {
            const { icon: __VLS_257 } = __VLS_252.slots;
            if (item?.icon) {
                let __VLS_258;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_259 = __VLS_asFunctionalComponent1(__VLS_258, new __VLS_258({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }));
                const __VLS_260 = __VLS_259({
                    shape: "square",
                    size: (32),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_259));
                const { default: __VLS_263 } = __VLS_261.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(item?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [resetUrl,];
                var __VLS_261;
            }
            else {
                let __VLS_264;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
                    size: (32),
                    type: (item?.tool_type),
                }));
                const __VLS_266 = __VLS_265({
                    size: (32),
                    type: (item?.tool_type),
                }, ...__VLS_functionalComponentArgsRest(__VLS_265));
            }
            // @ts-ignore
            [];
        }
        {
            const { title: __VLS_269 } = __VLS_252.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis-1" },
                title: (item.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (item.name);
            if (item.version) {
                let __VLS_270;
                /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                elTag;
                // @ts-ignore
                const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
                    ...{ class: "ml-4" },
                    size: "small",
                    type: "info",
                    effect: "plain",
                }));
                const __VLS_272 = __VLS_271({
                    ...{ class: "ml-4" },
                    size: "small",
                    type: "info",
                    effect: "plain",
                }, ...__VLS_functionalComponentArgsRest(__VLS_271));
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                const { default: __VLS_275 } = __VLS_273.slots;
                (item.version);
                // @ts-ignore
                [];
                var __VLS_273;
            }
            // @ts-ignore
            [];
        }
        {
            const { subTitle: __VLS_276 } = __VLS_252.slots;
            let __VLS_277;
            /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
            elText;
            // @ts-ignore
            const __VLS_278 = __VLS_asFunctionalComponent1(__VLS_277, new __VLS_277({
                ...{ class: "color-secondary lighter flex align-center" },
                size: "small",
            }));
            const __VLS_279 = __VLS_278({
                ...{ class: "color-secondary lighter flex align-center" },
                size: "small",
            }, ...__VLS_functionalComponentArgsRest(__VLS_278));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            const { default: __VLS_282 } = __VLS_280.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                title: (__VLS_ctx.i18n_name(item.nick_name)),
                ...{ class: "ellipsis" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (__VLS_ctx.i18n_name(item.nick_name));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-4 mr-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            (__VLS_ctx.$t('common.createdIn'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (__VLS_ctx.dateFormat(item.create_time));
            // @ts-ignore
            [$t, i18n_name, i18n_name, dateFormat,];
            var __VLS_280;
            // @ts-ignore
            [];
        }
        {
            const { tag: __VLS_283 } = __VLS_252.slots;
            const [{ hoverShow }] = __VLS_vSlot(__VLS_283);
            if (__VLS_ctx.isBatch) {
                let __VLS_284;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({
                    ...{ 'onChange': {} },
                    value: (item.id),
                }));
                const __VLS_286 = __VLS_285({
                    ...{ 'onChange': {} },
                    value: (item.id),
                }, ...__VLS_functionalComponentArgsRest(__VLS_285));
                let __VLS_289;
                const __VLS_290 = {
                    /** @type {typeof __VLS_289.change} */
                    onChange: (...[$event]) => {
                        if (!(__VLS_ctx.tool.toolList.length > 0))
                            throw 0;
                        if (!(__VLS_ctx.isBatch))
                            throw 0;
                        return __VLS_ctx.checkboxChange(item);
                        // @ts-ignore
                        [isBatch, checkboxChange,];
                    },
                };
                var __VLS_287;
                var __VLS_288;
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                if (__VLS_ctx.isShared) {
                    let __VLS_291;
                    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
                    elTag;
                    // @ts-ignore
                    const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
                        size: "small",
                        type: "info",
                        ...{ class: "info-tag" },
                    }));
                    const __VLS_293 = __VLS_292({
                        size: "small",
                        type: "info",
                        ...{ class: "info-tag" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
                    /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
                    const { default: __VLS_296 } = __VLS_294.slots;
                    (__VLS_ctx.t('views.shared.title'));
                    // @ts-ignore
                    [isShared, t,];
                    var __VLS_294;
                }
                if (__VLS_ctx.showUpdateStoreTool(item) && !__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.edit(item.id)) {
                    let __VLS_297;
                    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
                    elTooltip;
                    // @ts-ignore
                    const __VLS_298 = __VLS_asFunctionalComponent1(__VLS_297, new __VLS_297({
                        effect: "dark",
                        content: (__VLS_ctx.$t('views.tool.updatedVersion')),
                    }));
                    const __VLS_299 = __VLS_298({
                        effect: "dark",
                        content: (__VLS_ctx.$t('views.tool.updatedVersion')),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
                    const { default: __VLS_302 } = __VLS_300.slots;
                    let __VLS_303;
                    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                    elButton;
                    // @ts-ignore
                    const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
                        ...{ 'onClick': {} },
                        text: true,
                    }));
                    const __VLS_305 = __VLS_304({
                        ...{ 'onClick': {} },
                        text: true,
                    }, ...__VLS_functionalComponentArgsRest(__VLS_304));
                    let __VLS_308;
                    const __VLS_309 = {
                        /** @type {typeof __VLS_308.click} */
                        onClick: (...[$event]) => {
                            if (!(__VLS_ctx.tool.toolList.length > 0))
                                throw 0;
                            if (!!(__VLS_ctx.isBatch))
                                throw 0;
                            if (!(__VLS_ctx.showUpdateStoreTool(item) && !__VLS_ctx.isShared && __VLS_ctx.permissionPrecise.edit(item.id)))
                                throw 0;
                            return __VLS_ctx.updateStoreTool(item);
                            // @ts-ignore
                            [$t, isShared, permissionPrecise, showUpdateStoreTool, updateStoreTool,];
                        },
                    };
                    const { default: __VLS_310 } = __VLS_306.slots;
                    if (hoverShow) {
                        let __VLS_311;
                        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                        elIcon;
                        // @ts-ignore
                        const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({}));
                        const __VLS_313 = __VLS_312({}, ...__VLS_functionalComponentArgsRest(__VLS_312));
                        const { default: __VLS_316 } = __VLS_314.slots;
                        let __VLS_317;
                        /** @ts-ignore @type { | typeof __VLS_components.Refresh} */
                        Refresh;
                        // @ts-ignore
                        const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({}));
                        const __VLS_319 = __VLS_318({}, ...__VLS_functionalComponentArgsRest(__VLS_318));
                        // @ts-ignore
                        [];
                        var __VLS_314;
                    }
                    else {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                            ...{ class: "dot-success" },
                        });
                        /** @type {__VLS_StyleScopedClasses['dot-success']} */ ;
                    }
                    // @ts-ignore
                    [];
                    var __VLS_306;
                    var __VLS_307;
                    // @ts-ignore
                    [];
                    var __VLS_300;
                }
            }
            // @ts-ignore
            [];
        }
        {
            const { footer: __VLS_322 } = __VLS_252.slots;
            if (item.is_active) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                let __VLS_323;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_324 = __VLS_asFunctionalComponent1(__VLS_323, new __VLS_323({
                    ...{ class: "color-success mr-8" },
                    ...{ style: {} },
                }));
                const __VLS_325 = __VLS_324({
                    ...{ class: "color-success mr-8" },
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_324));
                /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_328 } = __VLS_326.slots;
                let __VLS_329;
                /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
                SuccessFilled;
                // @ts-ignore
                const __VLS_330 = __VLS_asFunctionalComponent1(__VLS_329, new __VLS_329({}));
                const __VLS_331 = __VLS_330({}, ...__VLS_functionalComponentArgsRest(__VLS_330));
                // @ts-ignore
                [];
                var __VLS_326;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.status.enabled'));
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "flex align-center" },
                });
                /** @type {__VLS_StyleScopedClasses['flex']} */ ;
                /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
                let __VLS_334;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_335 = __VLS_asFunctionalComponent1(__VLS_334, new __VLS_334({
                    iconName: "app-disabled",
                    ...{ class: "color-secondary mr-8" },
                }));
                const __VLS_336 = __VLS_335({
                    iconName: "app-disabled",
                    ...{ class: "color-secondary mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_335));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "color-secondary" },
                });
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.status.disabled'));
            }
            // @ts-ignore
            [$t, $t,];
        }
        {
            const { mouseEnter: __VLS_339 } = __VLS_252.slots;
            if (!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ onClick: () => { } },
                });
                if (__VLS_ctx.permissionPrecise.switch(item.id)) {
                    let __VLS_340;
                    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
                    elSwitch;
                    // @ts-ignore
                    const __VLS_341 = __VLS_asFunctionalComponent1(__VLS_340, new __VLS_340({
                        modelValue: (item.is_active),
                        beforeChange: (() => __VLS_ctx.changeState(item)),
                        size: "small",
                        ...{ class: "mr-4" },
                    }));
                    const __VLS_342 = __VLS_341({
                        modelValue: (item.is_active),
                        beforeChange: (() => __VLS_ctx.changeState(item)),
                        size: "small",
                        ...{ class: "mr-4" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
                    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
                }
                let __VLS_345;
                /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
                elDivider;
                // @ts-ignore
                const __VLS_346 = __VLS_asFunctionalComponent1(__VLS_345, new __VLS_345({
                    direction: "vertical",
                }));
                const __VLS_347 = __VLS_346({
                    direction: "vertical",
                }, ...__VLS_functionalComponentArgsRest(__VLS_346));
                let __VLS_350;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
                elDropdown;
                // @ts-ignore
                const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
                    trigger: "click",
                }));
                const __VLS_352 = __VLS_351({
                    trigger: "click",
                }, ...__VLS_functionalComponentArgsRest(__VLS_351));
                const { default: __VLS_355 } = __VLS_353.slots;
                let __VLS_356;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_357 = __VLS_asFunctionalComponent1(__VLS_356, new __VLS_356({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_358 = __VLS_357({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_357));
                let __VLS_361;
                const __VLS_362 = {
                    /** @type {typeof __VLS_361.click} */
                    onClick: () => { },
                };
                const { default: __VLS_363 } = __VLS_359.slots;
                let __VLS_364;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_365 = __VLS_asFunctionalComponent1(__VLS_364, new __VLS_364({
                    iconName: "app-more",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_366 = __VLS_365({
                    iconName: "app-more",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_365));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                // @ts-ignore
                [isShared, permissionPrecise, MoreFieldPermission, changeState,];
                var __VLS_359;
                var __VLS_360;
                {
                    const { dropdown: __VLS_369 } = __VLS_353.slots;
                    let __VLS_370;
                    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
                    elDropdownMenu;
                    // @ts-ignore
                    const __VLS_371 = __VLS_asFunctionalComponent1(__VLS_370, new __VLS_370({}));
                    const __VLS_372 = __VLS_371({}, ...__VLS_functionalComponentArgsRest(__VLS_371));
                    const { default: __VLS_375 } = __VLS_373.slots;
                    if (item.tool_type === 'MCP') {
                        let __VLS_376;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_377 = __VLS_asFunctionalComponent1(__VLS_376, new __VLS_376({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_378 = __VLS_377({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
                        let __VLS_381;
                        const __VLS_382 = {
                            /** @type {typeof __VLS_381.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(item.tool_type === 'MCP'))
                                    throw 0;
                                return __VLS_ctx.showMcpConfig(item);
                                // @ts-ignore
                                [showMcpConfig,];
                            },
                        };
                        const { default: __VLS_383 } = __VLS_379.slots;
                        let __VLS_384;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_385 = __VLS_asFunctionalComponent1(__VLS_384, new __VLS_384({
                            iconName: "app-operate-log",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_386 = __VLS_385({
                            iconName: "app-operate-log",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_385));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.tool.mcp.mcpConfig'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_379;
                        var __VLS_380;
                    }
                    if (item.template_id && __VLS_ctx.permissionPrecise.edit(item.id)) {
                        let __VLS_389;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_390 = __VLS_asFunctionalComponent1(__VLS_389, new __VLS_389({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_391 = __VLS_390({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_390));
                        let __VLS_394;
                        const __VLS_395 = {
                            /** @type {typeof __VLS_394.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(item.template_id && __VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                return __VLS_ctx.addInternalTool(item, true);
                                // @ts-ignore
                                [permissionPrecise, addInternalTool,];
                            },
                        };
                        const { default: __VLS_396 } = __VLS_392.slots;
                        let __VLS_397;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_398 = __VLS_asFunctionalComponent1(__VLS_397, new __VLS_397({
                            iconName: "app-edit",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_399 = __VLS_398({
                            iconName: "app-edit",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_398));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.edit'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_392;
                        var __VLS_393;
                    }
                    else if (item.tool_type === 'WORKFLOW' && __VLS_ctx.permissionPrecise.edit(item.id)) {
                        let __VLS_402;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_403 = __VLS_asFunctionalComponent1(__VLS_402, new __VLS_402({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_404 = __VLS_403({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_403));
                        let __VLS_407;
                        const __VLS_408 = {
                            /** @type {typeof __VLS_407.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!!(item.template_id && __VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                if (!(item.tool_type === 'WORKFLOW' && __VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                return __VLS_ctx.openCreateWorkflowDialog(item);
                                // @ts-ignore
                                [permissionPrecise, openCreateWorkflowDialog,];
                            },
                        };
                        const { default: __VLS_409 } = __VLS_405.slots;
                        let __VLS_410;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_411 = __VLS_asFunctionalComponent1(__VLS_410, new __VLS_410({
                            iconName: "app-edit",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_412 = __VLS_411({
                            iconName: "app-edit",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_411));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.edit'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_405;
                        var __VLS_406;
                    }
                    else if (__VLS_ctx.permissionPrecise.edit(item.id)) {
                        let __VLS_415;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_416 = __VLS_asFunctionalComponent1(__VLS_415, new __VLS_415({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_417 = __VLS_416({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_416));
                        let __VLS_420;
                        const __VLS_421 = {
                            /** @type {typeof __VLS_420.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!!(item.template_id && __VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                if (!!(item.tool_type === 'WORKFLOW' && __VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                return __VLS_ctx.openEditDialog(item);
                                // @ts-ignore
                                [permissionPrecise, openEditDialog,];
                            },
                        };
                        const { default: __VLS_422 } = __VLS_418.slots;
                        let __VLS_423;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_424 = __VLS_asFunctionalComponent1(__VLS_423, new __VLS_423({
                            iconName: "app-edit",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_425 = __VLS_424({
                            iconName: "app-edit",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_424));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.edit'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_418;
                        var __VLS_419;
                    }
                    if (item.tool_type === 'WORKFLOW') {
                        let __VLS_428;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_429 = __VLS_asFunctionalComponent1(__VLS_428, new __VLS_428({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_430 = __VLS_429({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_429));
                        let __VLS_433;
                        const __VLS_434 = {
                            /** @type {typeof __VLS_433.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(item.tool_type === 'WORKFLOW'))
                                    throw 0;
                                return __VLS_ctx.toWorkflow(item);
                                // @ts-ignore
                                [toWorkflow,];
                            },
                        };
                        const { default: __VLS_435 } = __VLS_431.slots;
                        let __VLS_436;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_437 = __VLS_asFunctionalComponent1(__VLS_436, new __VLS_436({
                            iconName: "app-workflow",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_438 = __VLS_437({
                            iconName: "app-workflow",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_437));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('workflow.workflow'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_431;
                        var __VLS_432;
                    }
                    if (!item.template_id && __VLS_ctx.permissionPrecise.copy(item.id)) {
                        let __VLS_441;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_442 = __VLS_asFunctionalComponent1(__VLS_441, new __VLS_441({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_443 = __VLS_442({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_442));
                        let __VLS_446;
                        const __VLS_447 = {
                            /** @type {typeof __VLS_446.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(!item.template_id && __VLS_ctx.permissionPrecise.copy(item.id)))
                                    throw 0;
                                return __VLS_ctx.copyTool(item);
                                // @ts-ignore
                                [permissionPrecise, copyTool,];
                            },
                        };
                        const { default: __VLS_448 } = __VLS_444.slots;
                        let __VLS_449;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_450 = __VLS_asFunctionalComponent1(__VLS_449, new __VLS_449({
                            iconName: "app-copy",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_451 = __VLS_450({
                            iconName: "app-copy",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_450));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.copy'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_444;
                        var __VLS_445;
                    }
                    if (item.init_field_list?.length > 0 && __VLS_ctx.permissionPrecise.edit(item.id)) {
                        let __VLS_454;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_455 = __VLS_asFunctionalComponent1(__VLS_454, new __VLS_454({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_456 = __VLS_455({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_455));
                        let __VLS_459;
                        const __VLS_460 = {
                            /** @type {typeof __VLS_459.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(item.init_field_list?.length > 0 && __VLS_ctx.permissionPrecise.edit(item.id)))
                                    throw 0;
                                return __VLS_ctx.configInitParams(item);
                                // @ts-ignore
                                [permissionPrecise, configInitParams,];
                            },
                        };
                        const { default: __VLS_461 } = __VLS_457.slots;
                        let __VLS_462;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_463 = __VLS_asFunctionalComponent1(__VLS_462, new __VLS_462({
                            iconName: "app-operation",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_464 = __VLS_463({
                            iconName: "app-operation",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_463));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.param.initParam'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_457;
                        var __VLS_458;
                    }
                    if (__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.auth(item.id)) {
                        let __VLS_467;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_468 = __VLS_asFunctionalComponent1(__VLS_467, new __VLS_467({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_469 = __VLS_468({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_468));
                        let __VLS_472;
                        const __VLS_473 = {
                            /** @type {typeof __VLS_472.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(__VLS_ctx.apiType === 'workspace' && __VLS_ctx.permissionPrecise.auth(item.id)))
                                    throw 0;
                                return __VLS_ctx.openAuthorization(item);
                                // @ts-ignore
                                [permissionPrecise, apiType, openAuthorization,];
                            },
                        };
                        const { default: __VLS_474 } = __VLS_470.slots;
                        let __VLS_475;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_476 = __VLS_asFunctionalComponent1(__VLS_475, new __VLS_475({
                            iconName: "app-resource-authorization",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_477 = __VLS_476({
                            iconName: "app-resource-authorization",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_476));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_470;
                        var __VLS_471;
                    }
                    if (['workspace', 'systemManage'].includes(__VLS_ctx.apiType) &&
                        (item.tool_type === 'CUSTOM' || item.tool_type === 'WORKFLOW') &&
                        __VLS_ctx.permissionPrecise.trigger_read(item.id)) {
                        let __VLS_480;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_481 = __VLS_asFunctionalComponent1(__VLS_480, new __VLS_480({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_482 = __VLS_481({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_481));
                        let __VLS_485;
                        const __VLS_486 = {
                            /** @type {typeof __VLS_485.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(['workspace', 'systemManage'].includes(__VLS_ctx.apiType) &&
                                    (item.tool_type === 'CUSTOM' || item.tool_type === 'WORKFLOW') &&
                                    __VLS_ctx.permissionPrecise.trigger_read(item.id)))
                                    throw 0;
                                return __VLS_ctx.openTriggerDrawer(item);
                                // @ts-ignore
                                [permissionPrecise, apiType, openTriggerDrawer,];
                            },
                        };
                        const { default: __VLS_487 } = __VLS_483.slots;
                        let __VLS_488;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_489 = __VLS_asFunctionalComponent1(__VLS_488, new __VLS_488({
                            iconName: "app-trigger",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_490 = __VLS_489({
                            iconName: "app-trigger",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_489));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.trigger.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_483;
                        var __VLS_484;
                    }
                    if (__VLS_ctx.permissionPrecise.relate_map(item.id)) {
                        let __VLS_493;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_494 = __VLS_asFunctionalComponent1(__VLS_493, new __VLS_493({
                            ...{ 'onClick': {} },
                            text: true,
                        }));
                        const __VLS_495 = __VLS_494({
                            ...{ 'onClick': {} },
                            text: true,
                        }, ...__VLS_functionalComponentArgsRest(__VLS_494));
                        let __VLS_498;
                        const __VLS_499 = {
                            /** @type {typeof __VLS_498.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.relate_map(item.id)))
                                    throw 0;
                                return __VLS_ctx.openResourceMappingDrawer(item);
                                // @ts-ignore
                                [permissionPrecise, openResourceMappingDrawer,];
                            },
                        };
                        const { default: __VLS_500 } = __VLS_496.slots;
                        let __VLS_501;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_502 = __VLS_asFunctionalComponent1(__VLS_501, new __VLS_501({
                            iconName: "app-resource-mapping",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_503 = __VLS_502({
                            iconName: "app-resource-mapping",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_502));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.system.resourceMapping.title'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_496;
                        var __VLS_497;
                    }
                    if ((item.tool_type === 'CUSTOM' || item.tool_type === 'WORKFLOW') &&
                        __VLS_ctx.permissionPrecise.record(item.id)) {
                        let __VLS_506;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_507 = __VLS_asFunctionalComponent1(__VLS_506, new __VLS_506({
                            ...{ 'onClick': {} },
                            text: true,
                        }));
                        const __VLS_508 = __VLS_507({
                            ...{ 'onClick': {} },
                            text: true,
                        }, ...__VLS_functionalComponentArgsRest(__VLS_507));
                        let __VLS_511;
                        const __VLS_512 = {
                            /** @type {typeof __VLS_511.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!((item.tool_type === 'CUSTOM' || item.tool_type === 'WORKFLOW') &&
                                    __VLS_ctx.permissionPrecise.record(item.id)))
                                    throw 0;
                                return __VLS_ctx.openToolRecordDrawer(item);
                                // @ts-ignore
                                [permissionPrecise, openToolRecordDrawer,];
                            },
                        };
                        const { default: __VLS_513 } = __VLS_509.slots;
                        let __VLS_514;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_515 = __VLS_asFunctionalComponent1(__VLS_514, new __VLS_514({
                            iconName: "app-schedule-report",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_516 = __VLS_515({
                            iconName: "app-schedule-report",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_515));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.ExecutionRecord.subTitle'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_509;
                        var __VLS_510;
                    }
                    if (__VLS_ctx.permissionPrecise.copy(item.id) && __VLS_ctx.apiType === 'workspace') {
                        let __VLS_519;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_520 = __VLS_asFunctionalComponent1(__VLS_519, new __VLS_519({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_521 = __VLS_520({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_520));
                        let __VLS_524;
                        const __VLS_525 = {
                            /** @type {typeof __VLS_524.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.copy(item.id) && __VLS_ctx.apiType === 'workspace'))
                                    throw 0;
                                return __VLS_ctx.openMoveToDialog(item);
                                // @ts-ignore
                                [permissionPrecise, apiType, openMoveToDialog,];
                            },
                        };
                        const { default: __VLS_526 } = __VLS_522.slots;
                        let __VLS_527;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_528 = __VLS_asFunctionalComponent1(__VLS_527, new __VLS_527({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_529 = __VLS_528({
                            iconName: "app-migrate",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_528));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.moveTo'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_522;
                        var __VLS_523;
                    }
                    if (__VLS_ctx.isSystemShare) {
                        let __VLS_532;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_533 = __VLS_asFunctionalComponent1(__VLS_532, new __VLS_532({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_534 = __VLS_533({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_533));
                        let __VLS_537;
                        const __VLS_538 = {
                            /** @type {typeof __VLS_537.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(__VLS_ctx.isSystemShare))
                                    throw 0;
                                return __VLS_ctx.openAuthorizedWorkspaceDialog(item);
                                // @ts-ignore
                                [isSystemShare, openAuthorizedWorkspaceDialog,];
                            },
                        };
                        const { default: __VLS_539 } = __VLS_535.slots;
                        let __VLS_540;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_541 = __VLS_asFunctionalComponent1(__VLS_540, new __VLS_540({
                            iconName: "app-lock",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_542 = __VLS_541({
                            iconName: "app-lock",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_541));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('views.shared.authorized_workspace'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_535;
                        var __VLS_536;
                    }
                    if (!item.template_id && __VLS_ctx.permissionPrecise.export(item.id)) {
                        let __VLS_545;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_546 = __VLS_asFunctionalComponent1(__VLS_545, new __VLS_545({
                            ...{ 'onClick': {} },
                        }));
                        const __VLS_547 = __VLS_546({
                            ...{ 'onClick': {} },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_546));
                        let __VLS_550;
                        const __VLS_551 = {
                            /** @type {typeof __VLS_550.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(!item.template_id && __VLS_ctx.permissionPrecise.export(item.id)))
                                    throw 0;
                                return __VLS_ctx.exportTool(item);
                                // @ts-ignore
                                [permissionPrecise, exportTool,];
                            },
                        };
                        const { default: __VLS_552 } = __VLS_548.slots;
                        let __VLS_553;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_554 = __VLS_asFunctionalComponent1(__VLS_553, new __VLS_553({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_555 = __VLS_554({
                            iconName: "app-export",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_554));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.export'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_548;
                        var __VLS_549;
                    }
                    if (__VLS_ctx.permissionPrecise.delete(item.id)) {
                        let __VLS_558;
                        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                        elDropdownItem;
                        // @ts-ignore
                        const __VLS_559 = __VLS_asFunctionalComponent1(__VLS_558, new __VLS_558({
                            ...{ 'onClick': {} },
                            divided: true,
                        }));
                        const __VLS_560 = __VLS_559({
                            ...{ 'onClick': {} },
                            divided: true,
                        }, ...__VLS_functionalComponentArgsRest(__VLS_559));
                        let __VLS_563;
                        const __VLS_564 = {
                            /** @type {typeof __VLS_563.click} */
                            onClick: (...[$event]) => {
                                if (!(__VLS_ctx.tool.toolList.length > 0))
                                    throw 0;
                                if (!(!__VLS_ctx.isShared && __VLS_ctx.MoreFieldPermission(item.id)))
                                    throw 0;
                                if (!(__VLS_ctx.permissionPrecise.delete(item.id)))
                                    throw 0;
                                return __VLS_ctx.deleteTool(item);
                                // @ts-ignore
                                [permissionPrecise, deleteTool,];
                            },
                        };
                        const { default: __VLS_565 } = __VLS_561.slots;
                        let __VLS_566;
                        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                        AppIcon;
                        // @ts-ignore
                        const __VLS_567 = __VLS_asFunctionalComponent1(__VLS_566, new __VLS_566({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }));
                        const __VLS_568 = __VLS_567({
                            iconName: "app-delete",
                            ...{ class: "color-secondary" },
                        }, ...__VLS_functionalComponentArgsRest(__VLS_567));
                        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                        (__VLS_ctx.$t('common.delete'));
                        // @ts-ignore
                        [$t,];
                        var __VLS_561;
                        var __VLS_562;
                    }
                    // @ts-ignore
                    [];
                    var __VLS_373;
                    // @ts-ignore
                    [];
                }
                // @ts-ignore
                [];
                var __VLS_353;
            }
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_252;
        var __VLS_253;
        // @ts-ignore
        [];
        var __VLS_246;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_240;
}
else {
    let __VLS_571;
    /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
    elEmpty;
    // @ts-ignore
    const __VLS_572 = __VLS_asFunctionalComponent1(__VLS_571, new __VLS_571({
        description: (__VLS_ctx.$t('common.noData')),
    }));
    const __VLS_573 = __VLS_572({
        description: (__VLS_ctx.$t('common.noData')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_572));
}
// @ts-ignore
[$t,];
var __VLS_232;
var __VLS_233;
// @ts-ignore
[];
var __VLS_224;
var __VLS_225;
if (__VLS_ctx.isBatch) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mul-operation border-t w-full flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mul-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_576;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_577 = __VLS_asFunctionalComponent1(__VLS_576, new __VLS_576({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }));
    const __VLS_578 = __VLS_577({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_577));
    let __VLS_581;
    const __VLS_582 = {
        /** @type {typeof __VLS_581.change} */
        onChange: (__VLS_ctx.handleCheckAllChange),
    };
    const { default: __VLS_583 } = __VLS_579.slots;
    (__VLS_ctx.$t('common.allCheck'));
    // @ts-ignore
    [$t, isBatch, checkAll, isIndeterminate, handleCheckAllChange,];
    var __VLS_579;
    var __VLS_580;
    if (__VLS_ctx.permissionPrecise.batchMove()) {
        let __VLS_584;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_585 = __VLS_asFunctionalComponent1(__VLS_584, new __VLS_584({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_586 = __VLS_585({
            ...{ 'onClick': {} },
            ...{ class: "ml-16" },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_585));
        let __VLS_589;
        const __VLS_590 = {
            /** @type {typeof __VLS_589.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.isBatch))
                    throw 0;
                if (!(__VLS_ctx.permissionPrecise.batchMove()))
                    throw 0;
                return __VLS_ctx.openMoveToDialog();
                // @ts-ignore
                [permissionPrecise, multipleSelection, openMoveToDialog,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['ml-16']} */ ;
        const { default: __VLS_591 } = __VLS_587.slots;
        (__VLS_ctx.$t('common.moveTo'));
        // @ts-ignore
        [$t,];
        var __VLS_587;
        var __VLS_588;
    }
    if (__VLS_ctx.permissionPrecise.batchDelete()) {
        let __VLS_592;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_593 = __VLS_asFunctionalComponent1(__VLS_592, new __VLS_592({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }));
        const __VLS_594 = __VLS_593({
            ...{ 'onClick': {} },
            disabled: (__VLS_ctx.multipleSelection.length === 0),
        }, ...__VLS_functionalComponentArgsRest(__VLS_593));
        let __VLS_597;
        const __VLS_598 = {
            /** @type {typeof __VLS_597.click} */
            onClick: (__VLS_ctx.deleteMulTool),
        };
        const { default: __VLS_599 } = __VLS_595.slots;
        (__VLS_ctx.$t('common.delete'));
        // @ts-ignore
        [$t, permissionPrecise, multipleSelection, deleteMulTool,];
        var __VLS_595;
        var __VLS_596;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-secondary ml-24 mr-16" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    (__VLS_ctx.$t('common.selected'));
    (__VLS_ctx.multipleSelection.length);
    (__VLS_ctx.paginationConfig.total);
    (__VLS_ctx.$t('views.document.items'));
    let __VLS_600;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_601 = __VLS_asFunctionalComponent1(__VLS_600, new __VLS_600({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_602 = __VLS_601({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_601));
    let __VLS_605;
    const __VLS_606 = {
        /** @type {typeof __VLS_605.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.isBatch))
                throw 0;
            return __VLS_ctx.batchSelectedHandle(false);
            // @ts-ignore
            [$t, $t, batchSelectedHandle, paginationConfig, multipleSelection,];
        },
    };
    const { default: __VLS_607 } = __VLS_603.slots;
    (__VLS_ctx.$t('views.paragraph.setting.cancelSelected'));
    // @ts-ignore
    [$t,];
    var __VLS_603;
    var __VLS_604;
}
const __VLS_608 = InitParamDrawer;
// @ts-ignore
const __VLS_609 = __VLS_asFunctionalComponent1(__VLS_608, new __VLS_608({
    ...{ 'onRefresh': {} },
    ref: "InitParamDrawerRef",
}));
const __VLS_610 = __VLS_609({
    ...{ 'onRefresh': {} },
    ref: "InitParamDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_609));
let __VLS_613;
const __VLS_614 = {
    /** @type {typeof __VLS_613.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_615;
var __VLS_611;
var __VLS_612;
const __VLS_617 = ToolFormDrawer;
// @ts-ignore
const __VLS_618 = __VLS_asFunctionalComponent1(__VLS_617, new __VLS_617({
    ...{ 'onRefresh': {} },
    ref: "ToolFormDrawerRef",
    title: (__VLS_ctx.ToolDrawertitle),
}));
const __VLS_619 = __VLS_618({
    ...{ 'onRefresh': {} },
    ref: "ToolFormDrawerRef",
    title: (__VLS_ctx.ToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_618));
let __VLS_622;
const __VLS_623 = {
    /** @type {typeof __VLS_622.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_624;
var __VLS_620;
var __VLS_621;
const __VLS_626 = McpToolFormDrawer;
// @ts-ignore
const __VLS_627 = __VLS_asFunctionalComponent1(__VLS_626, new __VLS_626({
    ...{ 'onRefresh': {} },
    ref: "McpToolFormDrawerRef",
    title: (__VLS_ctx.McpToolDrawertitle),
}));
const __VLS_628 = __VLS_627({
    ...{ 'onRefresh': {} },
    ref: "McpToolFormDrawerRef",
    title: (__VLS_ctx.McpToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_627));
let __VLS_631;
const __VLS_632 = {
    /** @type {typeof __VLS_631.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_633;
var __VLS_629;
var __VLS_630;
const __VLS_635 = SkillToolFormDrawer;
// @ts-ignore
const __VLS_636 = __VLS_asFunctionalComponent1(__VLS_635, new __VLS_635({
    ...{ 'onRefresh': {} },
    ref: "SkillToolFormDrawerRef",
    title: (__VLS_ctx.SkillToolDrawertitle),
}));
const __VLS_637 = __VLS_636({
    ...{ 'onRefresh': {} },
    ref: "SkillToolFormDrawerRef",
    title: (__VLS_ctx.SkillToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_636));
let __VLS_640;
const __VLS_641 = {
    /** @type {typeof __VLS_640.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_642;
var __VLS_638;
var __VLS_639;
const __VLS_644 = DataSourceToolFormDrawer;
// @ts-ignore
const __VLS_645 = __VLS_asFunctionalComponent1(__VLS_644, new __VLS_644({
    ...{ 'onRefresh': {} },
    ref: "DataSourceToolFormDrawerRef",
    title: (__VLS_ctx.DataSourceToolDrawertitle),
}));
const __VLS_646 = __VLS_645({
    ...{ 'onRefresh': {} },
    ref: "DataSourceToolFormDrawerRef",
    title: (__VLS_ctx.DataSourceToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_645));
let __VLS_649;
const __VLS_650 = {
    /** @type {typeof __VLS_649.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_651;
var __VLS_647;
var __VLS_648;
if (!__VLS_ctx.isShared) {
    const __VLS_653 = CreateFolderDialog;
    // @ts-ignore
    const __VLS_654 = __VLS_asFunctionalComponent1(__VLS_653, new __VLS_653({
        ...{ 'onRefresh': {} },
        ref: "CreateFolderDialogRef",
    }));
    const __VLS_655 = __VLS_654({
        ...{ 'onRefresh': {} },
        ref: "CreateFolderDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_654));
    let __VLS_658;
    const __VLS_659 = {
        /** @type {typeof __VLS_658.refresh} */
        onRefresh: (__VLS_ctx.refreshFolder),
    };
    var __VLS_660;
    var __VLS_656;
    var __VLS_657;
}
const __VLS_662 = ToolStoreDialog;
// @ts-ignore
const __VLS_663 = __VLS_asFunctionalComponent1(__VLS_662, new __VLS_662({
    ...{ 'onRefresh': {} },
    ref: "toolStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
}));
const __VLS_664 = __VLS_663({
    ...{ 'onRefresh': {} },
    ref: "toolStoreDialogRef",
    apiType: (__VLS_ctx.apiType),
}, ...__VLS_functionalComponentArgsRest(__VLS_663));
let __VLS_667;
const __VLS_668 = {
    /** @type {typeof __VLS_667.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_669;
var __VLS_665;
var __VLS_666;
const __VLS_671 = AddInternalToolDialog;
// @ts-ignore
const __VLS_672 = __VLS_asFunctionalComponent1(__VLS_671, new __VLS_671({
    ...{ 'onRefresh': {} },
    ref: "AddInternalToolDialogRef",
}));
const __VLS_673 = __VLS_672({
    ...{ 'onRefresh': {} },
    ref: "AddInternalToolDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_672));
let __VLS_676;
const __VLS_677 = {
    /** @type {typeof __VLS_676.refresh} */
    onRefresh: (__VLS_ctx.confirmAddInternalTool),
};
var __VLS_678;
var __VLS_674;
var __VLS_675;
const __VLS_680 = McpToolConfigDialog;
// @ts-ignore
const __VLS_681 = __VLS_asFunctionalComponent1(__VLS_680, new __VLS_680({
    ...{ 'onRefresh': {} },
    ref: "McpToolConfigDialogRef",
}));
const __VLS_682 = __VLS_681({
    ...{ 'onRefresh': {} },
    ref: "McpToolConfigDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_681));
let __VLS_685;
const __VLS_686 = {
    /** @type {typeof __VLS_685.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_687;
var __VLS_683;
var __VLS_684;
if (__VLS_ctx.isSystemShare) {
    const __VLS_689 = AuthorizedWorkspace || AuthorizedWorkspace;
    // @ts-ignore
    const __VLS_690 = __VLS_asFunctionalComponent1(__VLS_689, new __VLS_689({
        ref: "AuthorizedWorkspaceDialogRef",
    }));
    const __VLS_691 = __VLS_690({
        ref: "AuthorizedWorkspaceDialogRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_690));
    var __VLS_694;
    var __VLS_692;
}
if (__VLS_ctx.apiType === 'workspace') {
    const __VLS_696 = MoveToDialog;
    // @ts-ignore
    const __VLS_697 = __VLS_asFunctionalComponent1(__VLS_696, new __VLS_696({
        ...{ 'onRefresh': {} },
        ref: "MoveToDialogRef",
        source: (__VLS_ctx.SourceTypeEnum.TOOL),
    }));
    const __VLS_698 = __VLS_697({
        ...{ 'onRefresh': {} },
        ref: "MoveToDialogRef",
        source: (__VLS_ctx.SourceTypeEnum.TOOL),
    }, ...__VLS_functionalComponentArgsRest(__VLS_697));
    let __VLS_701;
    const __VLS_702 = {
        /** @type {typeof __VLS_701.refresh} */
        onRefresh: (__VLS_ctx.refreshToolList),
    };
    var __VLS_703;
    var __VLS_699;
    var __VLS_700;
}
if (__VLS_ctx.apiType === 'workspace') {
    const __VLS_705 = ResourceAuthorizationDrawer;
    // @ts-ignore
    const __VLS_706 = __VLS_asFunctionalComponent1(__VLS_705, new __VLS_705({
        type: (__VLS_ctx.SourceTypeEnum.TOOL),
        ref: "ResourceAuthorizationDrawerRef",
    }));
    const __VLS_707 = __VLS_706({
        type: (__VLS_ctx.SourceTypeEnum.TOOL),
        ref: "ResourceAuthorizationDrawerRef",
    }, ...__VLS_functionalComponentArgsRest(__VLS_706));
    var __VLS_710;
    var __VLS_708;
}
const __VLS_712 = ToolStoreDescDrawer;
// @ts-ignore
const __VLS_713 = __VLS_asFunctionalComponent1(__VLS_712, new __VLS_712({
    ref: "toolStoreDescDrawerRef",
}));
const __VLS_714 = __VLS_713({
    ref: "toolStoreDescDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_713));
var __VLS_717;
var __VLS_715;
const __VLS_719 = ResourceMappingDrawer || ResourceMappingDrawer;
// @ts-ignore
const __VLS_720 = __VLS_asFunctionalComponent1(__VLS_719, new __VLS_719({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_721 = __VLS_720({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_720));
var __VLS_724;
var __VLS_722;
const __VLS_726 = ResourceTriggerDrawer || ResourceTriggerDrawer;
// @ts-ignore
const __VLS_727 = __VLS_asFunctionalComponent1(__VLS_726, new __VLS_726({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.TOOL),
}));
const __VLS_728 = __VLS_727({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.TOOL),
}, ...__VLS_functionalComponentArgsRest(__VLS_727));
var __VLS_731;
var __VLS_729;
const __VLS_733 = ExecutionRecordDrawer;
// @ts-ignore
const __VLS_734 = __VLS_asFunctionalComponent1(__VLS_733, new __VLS_733({
    ref: "toolRecordDrawerRef",
}));
const __VLS_735 = __VLS_734({
    ref: "toolRecordDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_734));
var __VLS_738;
var __VLS_736;
const __VLS_740 = WorkflowFormDialog || WorkflowFormDialog;
// @ts-ignore
const __VLS_741 = __VLS_asFunctionalComponent1(__VLS_740, new __VLS_740({
    ...{ 'onRefresh': {} },
    ref: "workflowFormDialogRef",
    title: (__VLS_ctx.workflowFormDialogTitle),
}));
const __VLS_742 = __VLS_741({
    ...{ 'onRefresh': {} },
    ref: "workflowFormDialogRef",
    title: (__VLS_ctx.workflowFormDialogTitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_741));
let __VLS_745;
const __VLS_746 = {
    /** @type {typeof __VLS_745.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_747;
var __VLS_743;
var __VLS_744;
// @ts-ignore
[isShared, apiType, apiType, apiType, isSystemShare, refresh, refresh, refresh, refresh, refresh, refresh, refresh, refresh, ToolDrawertitle, McpToolDrawertitle, SkillToolDrawertitle, DataSourceToolDrawertitle, refreshFolder, confirmAddInternalTool, SourceTypeEnum, SourceTypeEnum, SourceTypeEnum, refreshToolList, workflowFormDialogTitle,];
var __VLS_3;
// @ts-ignore
var __VLS_9 = __VLS_8, __VLS_194 = __VLS_193, __VLS_616 = __VLS_615, __VLS_625 = __VLS_624, __VLS_634 = __VLS_633, __VLS_643 = __VLS_642, __VLS_652 = __VLS_651, __VLS_661 = __VLS_660, __VLS_670 = __VLS_669, __VLS_679 = __VLS_678, __VLS_688 = __VLS_687, __VLS_695 = __VLS_694, __VLS_704 = __VLS_703, __VLS_711 = __VLS_710, __VLS_718 = __VLS_717, __VLS_725 = __VLS_724, __VLS_732 = __VLS_731, __VLS_739 = __VLS_738, __VLS_748 = __VLS_747;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
});
const __VLS_export = {};
export default {};
