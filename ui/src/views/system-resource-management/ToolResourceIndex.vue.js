/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { cloneDeep } from 'lodash';
import InitParamDrawer from '@/views/tool/component/InitParamDrawer.vue';
import ToolResourceApi from '@/api/system-resource-management/tool';
import AddInternalToolDialog from '@/views/tool/tool-store/AddInternalToolDialog.vue';
import ToolFormDrawer from '@/views/tool/ToolFormDrawer.vue';
import McpToolFormDrawer from '@/views/tool/McpToolFormDrawer.vue';
import DataSourceToolFormDrawer from '@/views/tool/DataSourceToolFormDrawer.vue';
import ResourceAuthorizationDrawer from '@/components/resource-authorization-drawer/index.vue';
import ResourceTriggerDrawer from '@/views/trigger/ResourceTriggerDrawer.vue';
import WorkflowFormDialog from '@/views/tool/WorkflowFormDialog.vue';
import { t } from '@/locales';
import { SourceTypeEnum } from '@/enums/common';
import { resetUrl } from '@/utils/common';
import { ToolType } from '@/enums/tool';
import useStore from '@/stores';
import { datetimeFormat } from '@/utils/time';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import UserApi from '@/api/user/user.ts';
import { MsgSuccess, MsgConfirm, MsgError } from '@/utils/message';
import permissionMap from '@/permission';
import McpToolConfigDialog from '@/views/tool/component/McpToolConfigDialog.vue';
import ResourceMappingDrawer from '@/components/resource_mapping/index.vue';
import ExecutionRecordDrawer from '@/views/tool-workflow/execution-record/ExecutionRecordDrawer.vue';
import SkillToolFormDrawer from '@/views/tool/SkillToolFormDrawer.vue';
const { user } = useStore();
const router = useRouter();
const search_type = ref('name');
const search_form = ref({
    name: '',
    create_user: '',
    tool_type: '',
    source: '',
});
const user_options = ref([]);
const type_options = ref([
    {
        label: 'MCP',
        value: 'MCP',
    },
    {
        label: t('views.tool.dataSource.title'),
        value: 'DATA_SOURCE',
    },
    {
        label: t('views.tool.title'),
        value: 'CUSTOM',
    },
    {
        label: 'Skills',
        value: 'SKILL',
    },
    {
        label: t('views.tool.toolWorkflow.title'),
        value: 'WORKFLOW',
    },
]);
const source_options = ref([
    {
        label: t('views.tool.toolStore.title'),
        value: 'TOOL_STORE',
    },
    {
        label: t('common.custom'),
        value: 'CUSTOM',
    },
]);
const loading = ref(false);
const changeStateloading = ref(false);
const toolList = ref([]);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const workspaceOptions = ref([]);
const workspaceVisible = ref(false);
const workspaceArr = ref([]);
const permissionPrecise = computed(() => {
    return permissionMap['tool']['systemManage'];
});
const MoreFilledPermission = (row) => {
    return (permissionPrecise.value.export() ||
        permissionPrecise.value.delete() ||
        permissionPrecise.value.auth() ||
        permissionPrecise.value.relate_map() ||
        permissionPrecise.value.trigger_read() ||
        (row.init_field_list?.length > 0 && permissionPrecise.value.edit()));
};
const resourceTriggerDrawerRef = ref();
const openTriggerDrawer = (data) => {
    resourceTriggerDrawerRef.value?.open(data);
};
const ResourceAuthorizationDrawerRef = ref();
function openAuthorization(item) {
    ResourceAuthorizationDrawerRef.value.open(item.id, undefined, item.workspace_id);
}
function exportTool(row) {
    ToolResourceApi.exportTool(row.id, row.name, loading).catch((e) => {
        if (e.response.status !== 403) {
            e.response.data.text().then((res) => {
                MsgError(`${t('views.application.tip.ExportError')}:${JSON.parse(res).message}`);
            });
        }
    });
}
const McpToolConfigDialogRef = ref();
function showMcpConfig(item) {
    ToolResourceApi.getToolById(item?.id, loading).then((res) => {
        McpToolConfigDialogRef.value.open(res.data);
    });
}
function deleteTool(row) {
    MsgConfirm(`${t('views.tool.delete.confirmTitle')}：${row.name} ?`, row.resource_count > 0 ? t('views.tool.delete.resourceCountMessage', row.resource_count) : '', {
        confirmButtonText: t('common.confirm'),
        cancelButtonText: t('common.cancel'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        ToolResourceApi.delTool(row.id, loading).then(() => {
            getList();
            MsgSuccess(t('common.deleteSuccess'));
        });
    })
        .catch(() => { });
}
function configInitParams(item) {
    ToolResourceApi.getToolById(item?.id, changeStateloading).then((res) => {
        InitParamDrawerRef.value.open(res.data);
    });
}
async function copyTool(row) {
    ToolDrawertitle.value = t('views.tool.copyTool');
    const res = await ToolResourceApi.getToolById(row.id, changeStateloading);
    const obj = cloneDeep(res.data);
    delete obj['id'];
    obj['name'] = obj['name'] + `  ${t('common.copyTitle')}`;
    ToolFormDrawerRef.value.open(obj);
}
const ToolFormDrawerRef = ref();
const McpToolFormDrawerRef = ref();
const DataSourceToolFormDrawerRef = ref();
const SkillToolFormDrawerRef = ref();
const ToolDrawertitle = ref('');
const McpToolDrawertitle = ref('');
const DataSourceToolDrawertitle = ref('');
const SkillToolDrawertitle = ref('');
function openCreateDialog(data) {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    ToolDrawertitle.value = t('views.tool.editTool');
    if (data) {
        ToolResourceApi.getToolById(data?.id, loading).then((res) => {
            ToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        ToolFormDrawerRef.value.open(data);
    }
}
function openCreateMcpDialog(data) {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    McpToolDrawertitle.value = data
        ? t('views.tool.mcp.editMcpTool')
        : t('views.tool.mcp.createMcpTool');
    if (data) {
        ToolResourceApi.getToolById(data?.id, loading).then((res) => {
            McpToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        McpToolFormDrawerRef.value.open(data);
    }
}
function openCreateDataSourceDialog(data) {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    DataSourceToolDrawertitle.value = data
        ? t('views.tool.dataSource.editDataSource')
        : t('views.tool.dataSource.createDataSource');
    if (data) {
        ToolResourceApi.getToolById(data?.id, loading).then((res) => {
            DataSourceToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        DataSourceToolFormDrawerRef.value.open(data);
    }
}
function openCreateSkillToolDialog(data) {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    SkillToolDrawertitle.value = data
        ? t('views.tool.skill.editSkillTool')
        : t('views.tool.skill.createSkillTool');
    if (data) {
        ToolResourceApi.getToolById(data?.id, loading).then((res) => {
            SkillToolFormDrawerRef.value.open(res.data);
        });
    }
    else {
        SkillToolFormDrawerRef.value.open(data);
    }
}
const workflowFormDialogRef = ref();
const workflowFormDialogtitle = ref('');
const openCreateWorkflowDialog = (data) => {
    // Has template_id, not allowed to edit, transformed from template
    if (data?.template_id) {
        return;
    }
    workflowFormDialogtitle.value = t('common.edit');
    if (data) {
        ToolResourceApi.getToolById(data?.id, loading).then((res) => {
            workflowFormDialogRef.value?.open(res.data);
        });
    }
    else {
        workflowFormDialogRef.value?.open(data);
    }
};
const AddInternalToolDialogRef = ref();
function addInternalTool(data, isEdit) {
    AddInternalToolDialogRef.value?.open(data, isEdit);
}
function confirmAddInternalTool(data, isEdit) {
    if (isEdit) {
        ToolResourceApi.putTool(data?.id, { name: data.name }, loading).then((res) => {
            MsgSuccess(t('common.saveSuccess'));
            refresh();
        });
    }
}
const InitParamDrawerRef = ref();
async function changeState(row) {
    if (row.is_active) {
        MsgConfirm(`${t('views.tool.disabled.confirmTitle')}${row.name} ?`, t('views.tool.disabled.confirmMessage'), {
            confirmButtonText: t('common.status.disable'),
            confirmButtonClass: 'danger',
        }).then(() => {
            const obj = {
                is_active: !row.is_active,
            };
            ToolResourceApi.putTool(row.id, obj, changeStateloading)
                .then(() => {
                getList();
                return true;
            })
                .catch(() => {
                return false;
            });
        });
    }
    else {
        const res = await ToolResourceApi.getToolById(row.id, changeStateloading);
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
        ToolResourceApi.putTool(row.id, obj, changeStateloading)
            .then(() => {
            getList();
            return true;
        })
            .catch(() => {
            return false;
        });
    }
}
function toWorkflow(data) {
    router.push({ name: 'ToolWorkflow', params: { id: data.id, folderId: 'resource-management' } });
}
const filterText = ref('');
const filterData = ref([]);
watch([() => workspaceOptions.value, () => filterText.value], () => {
    if (!filterText.value.length) {
        filterData.value = workspaceOptions.value;
    }
    filterData.value = workspaceOptions.value.filter((v) => v.label.toLowerCase().includes(filterText.value.toLowerCase()));
}, { immediate: true });
function filterWorkspaceChange(val) {
    if (val === 'clear') {
        workspaceArr.value = [];
    }
    getList();
    workspaceVisible.value = false;
}
async function getWorkspaceList() {
    if (user.isEE()) {
        const res = await loadPermissionApi('workspace').getSystemWorkspaceList(loading);
        workspaceOptions.value = res.data.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }
}
const search_type_change = () => {
    search_form.value = { name: '', create_user: '' };
};
function getList() {
    const params = {};
    if (search_form.value[search_type.value]) {
        params[search_type.value] = search_form.value[search_type.value];
    }
    if (workspaceArr.value.length > 0) {
        params.workspace_ids = JSON.stringify(workspaceArr.value);
    }
    ToolResourceApi.getToolListPage(paginationConfig, params, loading).then((res) => {
        paginationConfig.total = res.data?.total;
        toolList.value = res.data?.records;
    });
}
function refresh(data) {
    if (data) {
        getList();
    }
    else {
        paginationConfig.total = 0;
        paginationConfig.current_page = 1;
        getList();
    }
}
const resourceMappingDrawerRef = ref();
const openResourceMappingDrawer = (tool) => {
    resourceMappingDrawerRef.value?.open('TOOL', tool);
};
const toolRecordDrawerRef = ref();
const openToolRecordDrawer = (data) => {
    toolRecordDrawerRef.value?.open(data);
};
function getUserList(query) {
    UserApi.getAllMemberList(query ? { nick_name: query } : '')
        .then((res) => {
        user_options.value = res.data || [];
    })
        .catch(() => {
        user_options.value = [];
    });
}
onMounted(() => {
    getWorkspaceList();
    getList();
    getUserList('');
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "resource-manage_tool p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['resource-manage_tool']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
elBreadcrumb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    separatorIcon: "ArrowRight",
}));
const __VLS_2 = __VLS_1({
    separatorIcon: "ArrowRight",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.t('views.system.resource_management.label'));
// @ts-ignore
[t,];
var __VLS_9;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "ml-4 color-text-primary" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
(__VLS_ctx.t('views.tool.title'));
// @ts-ignore
[t,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ class: "mt-16" },
    ...{ style: {} },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "mt-16" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "complex-search" },
});
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}));
const __VLS_26 = __VLS_25({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
const __VLS_30 = {
    /** @type {typeof __VLS_29.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_31 } = __VLS_27.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}));
const __VLS_34 = __VLS_33({
    label: (__VLS_ctx.$t('common.creator')),
    value: "create_user",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    label: (__VLS_ctx.$t('common.type')),
    value: "tool_type",
}));
const __VLS_44 = __VLS_43({
    label: (__VLS_ctx.$t('common.type')),
    value: "tool_type",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
    value: "source",
}));
const __VLS_49 = __VLS_48({
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
    value: "source",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
// @ts-ignore
[search_type, search_type_change, $t, $t, $t, $t,];
var __VLS_27;
var __VLS_28;
if (__VLS_ctx.search_type === 'name') {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_55;
    var __VLS_56;
}
else if (__VLS_ctx.search_type === 'create_user') {
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.create_user),
        filterable: true,
        clearable: true,
        remote: true,
        remoteMethod: (__VLS_ctx.getUserList),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.user_options))) {
        let __VLS_67;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }));
        const __VLS_69 = __VLS_68({
            key: (u.id),
            value: (u.id),
            label: (u.nick_name),
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        // @ts-ignore
        [search_type, search_type, $t, search_form, search_form, getList, getList, getUserList, user_options,];
    }
    // @ts-ignore
    [];
    var __VLS_62;
    var __VLS_63;
}
else if (__VLS_ctx.search_type === 'tool_type') {
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.tool_type),
        clearable: true,
        filterable: true,
        ...{ style: {} },
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.tool_type),
        clearable: true,
        filterable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_77;
    const __VLS_78 = {
        /** @type {typeof __VLS_77.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_79 } = __VLS_75.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.type_options))) {
        let __VLS_80;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
            key: (u.id),
            value: (u.value),
            label: (u.label),
        }));
        const __VLS_82 = __VLS_81({
            key: (u.id),
            value: (u.value),
            label: (u.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_81));
        // @ts-ignore
        [search_type, search_form, getList, type_options,];
    }
    // @ts-ignore
    [];
    var __VLS_75;
    var __VLS_76;
}
else if (__VLS_ctx.search_type === 'source') {
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.source),
        clearable: true,
        filterable: true,
        ...{ style: {} },
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.source),
        clearable: true,
        filterable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_90;
    const __VLS_91 = {
        /** @type {typeof __VLS_90.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_92 } = __VLS_88.slots;
    for (const [u] of __VLS_vFor((__VLS_ctx.source_options))) {
        let __VLS_93;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
            key: (u.id),
            value: (u.value),
            label: (u.label),
        }));
        const __VLS_95 = __VLS_94({
            key: (u.id),
            value: (u.value),
            label: (u.label),
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        // @ts-ignore
        [search_type, search_form, getList, source_options,];
    }
    // @ts-ignore
    [];
    var __VLS_88;
    var __VLS_89;
}
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.toolList),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (260),
}));
const __VLS_100 = __VLS_99({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.toolList),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (260),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
let __VLS_103;
const __VLS_104 = {
    /** @type {typeof __VLS_103.sizeChange} */
    onSizeChange: (__VLS_ctx.getList),
};
const __VLS_105 = {
    /** @type {typeof __VLS_103.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const { default: __VLS_106 } = __VLS_101.slots;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    width: "220",
    label: (__VLS_ctx.$t('common.name')),
    showOverflowTooltip: true,
}));
const __VLS_109 = __VLS_108({
    width: "220",
    label: (__VLS_ctx.$t('common.name')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
const { default: __VLS_112 } = __VLS_110.slots;
{
    const { default: __VLS_113 } = __VLS_110.slots;
    const [{ row }] = __VLS_vSlot(__VLS_113);
    let __VLS_114;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
        size: (8),
    }));
    const __VLS_116 = __VLS_115({
        size: (8),
    }, ...__VLS_functionalComponentArgsRest(__VLS_115));
    const { default: __VLS_119 } = __VLS_117.slots;
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        size: "24",
    }));
    const __VLS_122 = __VLS_121({
        size: "24",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    const { default: __VLS_125 } = __VLS_123.slots;
    if (row?.icon) {
        let __VLS_126;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
            shape: "square",
            size: (24),
            ...{ style: {} },
        }));
        const __VLS_128 = __VLS_127({
            shape: "square",
            size: (24),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_127));
        const { default: __VLS_131 } = __VLS_129.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(row?.icon)),
            alt: "",
        });
        // @ts-ignore
        [$t, getList, getList, toolList, paginationConfig, resetUrl,];
        var __VLS_129;
    }
    else {
        let __VLS_132;
        /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
        ToolIcon;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
            size: (24),
            type: (row?.tool_type),
        }));
        const __VLS_134 = __VLS_133({
            size: (24),
            type: (row?.tool_type),
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    }
    // @ts-ignore
    [];
    var __VLS_123;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.name);
    // @ts-ignore
    [];
    var __VLS_117;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_110;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    prop: "tool_type",
    label: (__VLS_ctx.$t('common.type')),
}));
const __VLS_139 = __VLS_138({
    prop: "tool_type",
    label: (__VLS_ctx.$t('common.type')),
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
const { default: __VLS_142 } = __VLS_140.slots;
{
    const { default: __VLS_143 } = __VLS_140.slots;
    const [scope] = __VLS_vSlot(__VLS_143);
    if (scope.row.tool_type === 'MCP') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    else if (scope.row.tool_type === 'DATA_SOURCE') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.tool.dataSource.title'));
    }
    else if (scope.row.tool_type === 'SKILL') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    }
    else if (scope.row.tool_type === 'WORKFLOW') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.tool.toolWorkflow.title'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.tool.title'));
    }
    // @ts-ignore
    [$t, $t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_140;
let __VLS_144;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
    prop: "source",
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}));
const __VLS_146 = __VLS_145({
    prop: "source",
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_145));
const { default: __VLS_149 } = __VLS_147.slots;
{
    const { default: __VLS_150 } = __VLS_147.slots;
    const [scope] = __VLS_vSlot(__VLS_150);
    if (scope.row.template_id) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.tool.toolStore.title'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t(__VLS_ctx.ToolType['CUSTOM']));
    }
    // @ts-ignore
    [$t, $t, $t, ToolType,];
}
// @ts-ignore
[];
var __VLS_147;
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    label: (__VLS_ctx.$t('common.status.label')),
    width: "120",
}));
const __VLS_153 = __VLS_152({
    label: (__VLS_ctx.$t('common.status.label')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
{
    const { default: __VLS_157 } = __VLS_154.slots;
    const [{ row }] = __VLS_vSlot(__VLS_157);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_158;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_160 = __VLS_159({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_159));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_163 } = __VLS_161.slots;
        let __VLS_164;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({}));
        const __VLS_166 = __VLS_165({}, ...__VLS_functionalComponentArgsRest(__VLS_165));
        // @ts-ignore
        [$t,];
        var __VLS_161;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.enabled'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_169;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_171 = __VLS_170({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-text-primary" },
        });
        /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
        (__VLS_ctx.$t('common.status.disabled'));
    }
    // @ts-ignore
    [$t, $t,];
}
// @ts-ignore
[];
var __VLS_154;
if (__VLS_ctx.user.isEE()) {
    let __VLS_174;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }));
    const __VLS_176 = __VLS_175({
        width: "150",
        prop: "workspace_name",
        label: (__VLS_ctx.$t('views.workspace.title')),
        showOverflowTooltip: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    const { default: __VLS_179 } = __VLS_177.slots;
    {
        const { header: __VLS_180 } = __VLS_177.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.workspace.title'));
        let __VLS_181;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }));
        const __VLS_183 = __VLS_182({
            width: (200),
            trigger: "click",
            visible: (__VLS_ctx.workspaceVisible),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_182));
        const { default: __VLS_186 } = __VLS_184.slots;
        {
            const { reference: __VLS_187 } = __VLS_184.slots;
            let __VLS_188;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }));
            const __VLS_190 = __VLS_189({
                ...{ 'onClick': {} },
                ...{ style: {} },
                type: (__VLS_ctx.workspaceArr && __VLS_ctx.workspaceArr.length > 0 ? 'primary' : ''),
                link: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            let __VLS_193;
            const __VLS_194 = {
                /** @type {typeof __VLS_193.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.user.isEE()))
                        throw 0;
                    return __VLS_ctx.workspaceVisible = !__VLS_ctx.workspaceVisible;
                    // @ts-ignore
                    [$t, $t, user, workspaceVisible, workspaceVisible, workspaceVisible, workspaceArr, workspaceArr,];
                },
            };
            const { default: __VLS_195 } = __VLS_191.slots;
            let __VLS_196;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_197 = __VLS_asFunctionalComponent1(__VLS_196, new __VLS_196({}));
            const __VLS_198 = __VLS_197({}, ...__VLS_functionalComponentArgsRest(__VLS_197));
            const { default: __VLS_201 } = __VLS_199.slots;
            let __VLS_202;
            /** @ts-ignore @type { | typeof __VLS_components.Filter} */
            Filter;
            // @ts-ignore
            const __VLS_203 = __VLS_asFunctionalComponent1(__VLS_202, new __VLS_202({}));
            const __VLS_204 = __VLS_203({}, ...__VLS_functionalComponentArgsRest(__VLS_203));
            // @ts-ignore
            [];
            var __VLS_199;
            // @ts-ignore
            [];
            var __VLS_191;
            var __VLS_192;
            // @ts-ignore
            [];
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "filter" },
        });
        /** @type {__VLS_StyleScopedClasses['filter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "form-item mb-16 ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['form-item']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        let __VLS_207;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }));
        const __VLS_209 = __VLS_208({
            modelValue: (__VLS_ctx.filterText),
            placeholder: (__VLS_ctx.$t('common.search')),
            prefixIcon: "Search",
            clearable: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_208));
        if (__VLS_ctx.filterData.length) {
            let __VLS_212;
            /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
            elScrollbar;
            // @ts-ignore
            const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
                height: "300",
            }));
            const __VLS_214 = __VLS_213({
                height: "300",
            }, ...__VLS_functionalComponentArgsRest(__VLS_213));
            const { default: __VLS_217 } = __VLS_215.slots;
            let __VLS_218;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
            elCheckboxGroup;
            // @ts-ignore
            const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }));
            const __VLS_220 = __VLS_219({
                modelValue: (__VLS_ctx.workspaceArr),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_219));
            const { default: __VLS_223 } = __VLS_221.slots;
            for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
                let __VLS_224;
                /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
                elCheckbox;
                // @ts-ignore
                const __VLS_225 = __VLS_asFunctionalComponent1(__VLS_224, new __VLS_224({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }));
                const __VLS_226 = __VLS_225({
                    key: (item.value),
                    label: (item.label),
                    value: (item.value),
                }, ...__VLS_functionalComponentArgsRest(__VLS_225));
                // @ts-ignore
                [$t, workspaceArr, filterText, filterData, filterData,];
            }
            // @ts-ignore
            [];
            var __VLS_221;
            // @ts-ignore
            [];
            var __VLS_215;
        }
        else {
            let __VLS_229;
            /** @ts-ignore @type { | typeof __VLS_components.elEmpty | typeof __VLS_components.ElEmpty | typeof __VLS_components['el-empty']} */
            elEmpty;
            // @ts-ignore
            const __VLS_230 = __VLS_asFunctionalComponent1(__VLS_229, new __VLS_229({
                description: (__VLS_ctx.$t('common.noData')),
            }));
            const __VLS_231 = __VLS_230({
                description: (__VLS_ctx.$t('common.noData')),
            }, ...__VLS_functionalComponentArgsRest(__VLS_230));
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "text-right" },
        });
        /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
        let __VLS_234;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
            ...{ 'onClick': {} },
            size: "small",
        }));
        const __VLS_236 = __VLS_235({
            ...{ 'onClick': {} },
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_235));
        let __VLS_239;
        const __VLS_240 = {
            /** @type {typeof __VLS_239.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.user.isEE()))
                    throw 0;
                return __VLS_ctx.filterWorkspaceChange('clear');
                // @ts-ignore
                [$t, filterWorkspaceChange,];
            },
        };
        const { default: __VLS_241 } = __VLS_237.slots;
        (__VLS_ctx.$t('common.clear'));
        // @ts-ignore
        [$t,];
        var __VLS_237;
        var __VLS_238;
        let __VLS_242;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_243 = __VLS_asFunctionalComponent1(__VLS_242, new __VLS_242({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }));
        const __VLS_244 = __VLS_243({
            ...{ 'onClick': {} },
            type: "primary",
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_243));
        let __VLS_247;
        const __VLS_248 = {
            /** @type {typeof __VLS_247.click} */
            onClick: (__VLS_ctx.filterWorkspaceChange),
        };
        const { default: __VLS_249 } = __VLS_245.slots;
        (__VLS_ctx.$t('common.confirm'));
        // @ts-ignore
        [$t, filterWorkspaceChange,];
        var __VLS_245;
        var __VLS_246;
        // @ts-ignore
        [];
        var __VLS_184;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_177;
}
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}));
const __VLS_252 = __VLS_251({
    prop: "nick_name",
    label: (__VLS_ctx.$t('common.creator')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
let __VLS_255;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "180",
}));
const __VLS_257 = __VLS_256({
    label: (__VLS_ctx.$t('views.document.table.updateTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
const { default: __VLS_260 } = __VLS_258.slots;
{
    const { default: __VLS_261 } = __VLS_258.slots;
    const [{ row }] = __VLS_vSlot(__VLS_261);
    (__VLS_ctx.datetimeFormat(row.update_time));
    // @ts-ignore
    [$t, $t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_258;
let __VLS_262;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}));
const __VLS_264 = __VLS_263({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
const { default: __VLS_267 } = __VLS_265.slots;
{
    const { default: __VLS_268 } = __VLS_265.slots;
    const [{ row }] = __VLS_vSlot(__VLS_268);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_265;
let __VLS_269;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_270 = __VLS_asFunctionalComponent1(__VLS_269, new __VLS_269({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "160",
    fixed: "right",
}));
const __VLS_271 = __VLS_270({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "160",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_270));
const { default: __VLS_274 } = __VLS_272.slots;
{
    const { default: __VLS_275 } = __VLS_272.slots;
    const [{ row }] = __VLS_vSlot(__VLS_275);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: () => { } },
    });
    if (__VLS_ctx.permissionPrecise.switch()) {
        let __VLS_276;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_277 = __VLS_asFunctionalComponent1(__VLS_276, new __VLS_276({
            modelValue: (row.is_active),
            beforeChange: (() => __VLS_ctx.changeState(row)),
            size: "small",
            ...{ class: "mr-4" },
        }));
        const __VLS_278 = __VLS_277({
            modelValue: (row.is_active),
            beforeChange: (() => __VLS_ctx.changeState(row)),
            size: "small",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_277));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    }
    let __VLS_281;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_282 = __VLS_asFunctionalComponent1(__VLS_281, new __VLS_281({
        direction: "vertical",
    }));
    const __VLS_283 = __VLS_282({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_282));
    if (row.template_id && __VLS_ctx.permissionPrecise.edit()) {
        let __VLS_286;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_287 = __VLS_asFunctionalComponent1(__VLS_286, new __VLS_286({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_288 = __VLS_287({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_287));
        const { default: __VLS_291 } = __VLS_289.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_292;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_294 = __VLS_293({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_293));
        let __VLS_297;
        const __VLS_298 = {
            /** @type {typeof __VLS_297.click} */
            onClick: (...[$event]) => {
                if (!(row.template_id && __VLS_ctx.permissionPrecise.edit()))
                    throw 0;
                return __VLS_ctx.addInternalTool(row, true);
                // @ts-ignore
                [$t, $t, $t, permissionPrecise, permissionPrecise, changeState, addInternalTool,];
            },
        };
        const { default: __VLS_299 } = __VLS_295.slots;
        let __VLS_300;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
            iconName: "app-edit",
        }));
        const __VLS_302 = __VLS_301({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_301));
        // @ts-ignore
        [];
        var __VLS_295;
        var __VLS_296;
        // @ts-ignore
        [];
        var __VLS_289;
    }
    if (!row.template_id && row.tool_type === 'CUSTOM' && __VLS_ctx.permissionPrecise.edit()) {
        let __VLS_305;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_306 = __VLS_asFunctionalComponent1(__VLS_305, new __VLS_305({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_307 = __VLS_306({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_306));
        const { default: __VLS_310 } = __VLS_308.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_311;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_313 = __VLS_312({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_312));
        let __VLS_316;
        const __VLS_317 = {
            /** @type {typeof __VLS_316.click} */
            onClick: (...[$event]) => {
                if (!(!row.template_id && row.tool_type === 'CUSTOM' && __VLS_ctx.permissionPrecise.edit()))
                    throw 0;
                return __VLS_ctx.openCreateDialog(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, openCreateDialog,];
            },
        };
        const { default: __VLS_318 } = __VLS_314.slots;
        let __VLS_319;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_320 = __VLS_asFunctionalComponent1(__VLS_319, new __VLS_319({
            iconName: "app-edit",
        }));
        const __VLS_321 = __VLS_320({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_320));
        // @ts-ignore
        [];
        var __VLS_314;
        var __VLS_315;
        // @ts-ignore
        [];
        var __VLS_308;
    }
    if (!row.template_id && row.tool_type === 'MCP' && __VLS_ctx.permissionPrecise.edit()) {
        let __VLS_324;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_325 = __VLS_asFunctionalComponent1(__VLS_324, new __VLS_324({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_326 = __VLS_325({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_325));
        const { default: __VLS_329 } = __VLS_327.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_330;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_331 = __VLS_asFunctionalComponent1(__VLS_330, new __VLS_330({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_332 = __VLS_331({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_331));
        let __VLS_335;
        const __VLS_336 = {
            /** @type {typeof __VLS_335.click} */
            onClick: (...[$event]) => {
                if (!(!row.template_id && row.tool_type === 'MCP' && __VLS_ctx.permissionPrecise.edit()))
                    throw 0;
                return __VLS_ctx.openCreateMcpDialog(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, openCreateMcpDialog,];
            },
        };
        const { default: __VLS_337 } = __VLS_333.slots;
        let __VLS_338;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_339 = __VLS_asFunctionalComponent1(__VLS_338, new __VLS_338({
            iconName: "app-edit",
        }));
        const __VLS_340 = __VLS_339({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_339));
        // @ts-ignore
        [];
        var __VLS_333;
        var __VLS_334;
        // @ts-ignore
        [];
        var __VLS_327;
    }
    if (!row.template_id && row.tool_type === 'DATA_SOURCE' && __VLS_ctx.permissionPrecise.edit()) {
        let __VLS_343;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_344 = __VLS_asFunctionalComponent1(__VLS_343, new __VLS_343({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_345 = __VLS_344({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_344));
        const { default: __VLS_348 } = __VLS_346.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_349;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_350 = __VLS_asFunctionalComponent1(__VLS_349, new __VLS_349({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_351 = __VLS_350({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_350));
        let __VLS_354;
        const __VLS_355 = {
            /** @type {typeof __VLS_354.click} */
            onClick: (...[$event]) => {
                if (!(!row.template_id && row.tool_type === 'DATA_SOURCE' && __VLS_ctx.permissionPrecise.edit()))
                    throw 0;
                return __VLS_ctx.openCreateDataSourceDialog(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, openCreateDataSourceDialog,];
            },
        };
        const { default: __VLS_356 } = __VLS_352.slots;
        let __VLS_357;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_358 = __VLS_asFunctionalComponent1(__VLS_357, new __VLS_357({
            iconName: "app-edit",
        }));
        const __VLS_359 = __VLS_358({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_358));
        // @ts-ignore
        [];
        var __VLS_352;
        var __VLS_353;
        // @ts-ignore
        [];
        var __VLS_346;
    }
    if (!row.template_id && row.tool_type === 'SKILL' && __VLS_ctx.permissionPrecise.edit()) {
        let __VLS_362;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_363 = __VLS_asFunctionalComponent1(__VLS_362, new __VLS_362({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_364 = __VLS_363({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_363));
        const { default: __VLS_367 } = __VLS_365.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_368;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_369 = __VLS_asFunctionalComponent1(__VLS_368, new __VLS_368({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_370 = __VLS_369({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_369));
        let __VLS_373;
        const __VLS_374 = {
            /** @type {typeof __VLS_373.click} */
            onClick: (...[$event]) => {
                if (!(!row.template_id && row.tool_type === 'SKILL' && __VLS_ctx.permissionPrecise.edit()))
                    throw 0;
                return __VLS_ctx.openCreateSkillToolDialog(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, openCreateSkillToolDialog,];
            },
        };
        const { default: __VLS_375 } = __VLS_371.slots;
        let __VLS_376;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_377 = __VLS_asFunctionalComponent1(__VLS_376, new __VLS_376({
            iconName: "app-edit",
        }));
        const __VLS_378 = __VLS_377({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_377));
        // @ts-ignore
        [];
        var __VLS_371;
        var __VLS_372;
        // @ts-ignore
        [];
        var __VLS_365;
    }
    if (!row.template_id && row.tool_type === 'WORKFLOW' && __VLS_ctx.permissionPrecise.edit()) {
        let __VLS_381;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_382 = __VLS_asFunctionalComponent1(__VLS_381, new __VLS_381({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_383 = __VLS_382({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_382));
        const { default: __VLS_386 } = __VLS_384.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_387;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_388 = __VLS_asFunctionalComponent1(__VLS_387, new __VLS_387({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_389 = __VLS_388({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_388));
        let __VLS_392;
        const __VLS_393 = {
            /** @type {typeof __VLS_392.click} */
            onClick: (...[$event]) => {
                if (!(!row.template_id && row.tool_type === 'WORKFLOW' && __VLS_ctx.permissionPrecise.edit()))
                    throw 0;
                return __VLS_ctx.openCreateWorkflowDialog(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, openCreateWorkflowDialog,];
            },
        };
        const { default: __VLS_394 } = __VLS_390.slots;
        let __VLS_395;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_396 = __VLS_asFunctionalComponent1(__VLS_395, new __VLS_395({
            iconName: "app-edit",
        }));
        const __VLS_397 = __VLS_396({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_396));
        // @ts-ignore
        [];
        var __VLS_390;
        var __VLS_391;
        // @ts-ignore
        [];
        var __VLS_384;
    }
    if (!row.template_id && __VLS_ctx.permissionPrecise.copy()) {
        let __VLS_400;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent1(__VLS_400, new __VLS_400({
            effect: "dark",
            content: (__VLS_ctx.$t('common.copy')),
            placement: "top",
        }));
        const __VLS_402 = __VLS_401({
            effect: "dark",
            content: (__VLS_ctx.$t('common.copy')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        const { default: __VLS_405 } = __VLS_403.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_406;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_407 = __VLS_asFunctionalComponent1(__VLS_406, new __VLS_406({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.copy')),
        }));
        const __VLS_408 = __VLS_407({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.copy')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_407));
        let __VLS_411;
        const __VLS_412 = {
            /** @type {typeof __VLS_411.click} */
            onClick: (...[$event]) => {
                if (!(!row.template_id && __VLS_ctx.permissionPrecise.copy()))
                    throw 0;
                return __VLS_ctx.copyTool(row);
                // @ts-ignore
                [$t, $t, permissionPrecise, copyTool,];
            },
        };
        const { default: __VLS_413 } = __VLS_409.slots;
        let __VLS_414;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_415 = __VLS_asFunctionalComponent1(__VLS_414, new __VLS_414({
            iconName: "app-copy",
        }));
        const __VLS_416 = __VLS_415({
            iconName: "app-copy",
        }, ...__VLS_functionalComponentArgsRest(__VLS_415));
        // @ts-ignore
        [];
        var __VLS_409;
        var __VLS_410;
        // @ts-ignore
        [];
        var __VLS_403;
    }
    if (__VLS_ctx.MoreFilledPermission(row)) {
        let __VLS_419;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_420 = __VLS_asFunctionalComponent1(__VLS_419, new __VLS_419({
            trigger: "click",
        }));
        const __VLS_421 = __VLS_420({
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_420));
        const { default: __VLS_424 } = __VLS_422.slots;
        let __VLS_425;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_426 = __VLS_asFunctionalComponent1(__VLS_425, new __VLS_425({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }));
        const __VLS_427 = __VLS_426({
            ...{ 'onClick': {} },
            text: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_426));
        let __VLS_430;
        const __VLS_431 = {
            /** @type {typeof __VLS_430.click} */
            onClick: () => { },
        };
        const { default: __VLS_432 } = __VLS_428.slots;
        let __VLS_433;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_434 = __VLS_asFunctionalComponent1(__VLS_433, new __VLS_433({
            iconName: "app-more",
        }));
        const __VLS_435 = __VLS_434({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_434));
        // @ts-ignore
        [MoreFilledPermission,];
        var __VLS_428;
        var __VLS_429;
        {
            const { dropdown: __VLS_438 } = __VLS_422.slots;
            let __VLS_439;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_440 = __VLS_asFunctionalComponent1(__VLS_439, new __VLS_439({}));
            const __VLS_441 = __VLS_440({}, ...__VLS_functionalComponentArgsRest(__VLS_440));
            const { default: __VLS_444 } = __VLS_442.slots;
            if (row.tool_type === 'WORKFLOW') {
                let __VLS_445;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_446 = __VLS_asFunctionalComponent1(__VLS_445, new __VLS_445({
                    ...{ 'onClick': {} },
                }));
                const __VLS_447 = __VLS_446({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_446));
                let __VLS_450;
                const __VLS_451 = {
                    /** @type {typeof __VLS_450.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(row.tool_type === 'WORKFLOW'))
                            throw 0;
                        return __VLS_ctx.toWorkflow(row);
                        // @ts-ignore
                        [toWorkflow,];
                    },
                };
                const { default: __VLS_452 } = __VLS_448.slots;
                let __VLS_453;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_454 = __VLS_asFunctionalComponent1(__VLS_453, new __VLS_453({
                    iconName: "app-workflow",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_455 = __VLS_454({
                    iconName: "app-workflow",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_454));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('workflow.workflow'));
                // @ts-ignore
                [$t,];
                var __VLS_448;
                var __VLS_449;
            }
            if (row.init_field_list?.length > 0 && __VLS_ctx.permissionPrecise.edit()) {
                let __VLS_458;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_459 = __VLS_asFunctionalComponent1(__VLS_458, new __VLS_458({
                    ...{ 'onClick': {} },
                }));
                const __VLS_460 = __VLS_459({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_459));
                let __VLS_463;
                const __VLS_464 = {
                    /** @type {typeof __VLS_463.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(row.init_field_list?.length > 0 && __VLS_ctx.permissionPrecise.edit()))
                            throw 0;
                        return __VLS_ctx.configInitParams(row);
                        // @ts-ignore
                        [permissionPrecise, configInitParams,];
                    },
                };
                const { default: __VLS_465 } = __VLS_461.slots;
                let __VLS_466;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_467 = __VLS_asFunctionalComponent1(__VLS_466, new __VLS_466({
                    iconName: "app-operation",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_468 = __VLS_467({
                    iconName: "app-operation",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_467));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.param.initParam'));
                // @ts-ignore
                [$t,];
                var __VLS_461;
                var __VLS_462;
            }
            if (__VLS_ctx.permissionPrecise.auth()) {
                let __VLS_471;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_472 = __VLS_asFunctionalComponent1(__VLS_471, new __VLS_471({
                    ...{ 'onClick': {} },
                }));
                const __VLS_473 = __VLS_472({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_472));
                let __VLS_476;
                const __VLS_477 = {
                    /** @type {typeof __VLS_476.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.auth()))
                            throw 0;
                        return __VLS_ctx.openAuthorization(row);
                        // @ts-ignore
                        [permissionPrecise, openAuthorization,];
                    },
                };
                const { default: __VLS_478 } = __VLS_474.slots;
                let __VLS_479;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_480 = __VLS_asFunctionalComponent1(__VLS_479, new __VLS_479({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_481 = __VLS_480({
                    iconName: "app-resource-authorization",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_480));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceAuthorization.title'));
                // @ts-ignore
                [$t,];
                var __VLS_474;
                var __VLS_475;
            }
            if (!row.template_id && __VLS_ctx.permissionPrecise.export()) {
                let __VLS_484;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_485 = __VLS_asFunctionalComponent1(__VLS_484, new __VLS_484({
                    ...{ 'onClick': {} },
                }));
                const __VLS_486 = __VLS_485({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_485));
                let __VLS_489;
                const __VLS_490 = {
                    /** @type {typeof __VLS_489.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(!row.template_id && __VLS_ctx.permissionPrecise.export()))
                            throw 0;
                        return __VLS_ctx.exportTool(row);
                        // @ts-ignore
                        [permissionPrecise, exportTool,];
                    },
                };
                const { default: __VLS_491 } = __VLS_487.slots;
                let __VLS_492;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_493 = __VLS_asFunctionalComponent1(__VLS_492, new __VLS_492({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_494 = __VLS_493({
                    iconName: "app-export",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_493));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.export'));
                // @ts-ignore
                [$t,];
                var __VLS_487;
                var __VLS_488;
            }
            if (row.tool_type === 'MCP' && __VLS_ctx.permissionPrecise.edit()) {
                let __VLS_497;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_498 = __VLS_asFunctionalComponent1(__VLS_497, new __VLS_497({
                    ...{ 'onClick': {} },
                }));
                const __VLS_499 = __VLS_498({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_498));
                let __VLS_502;
                const __VLS_503 = {
                    /** @type {typeof __VLS_502.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(row.tool_type === 'MCP' && __VLS_ctx.permissionPrecise.edit()))
                            throw 0;
                        return __VLS_ctx.showMcpConfig(row);
                        // @ts-ignore
                        [permissionPrecise, showMcpConfig,];
                    },
                };
                const { default: __VLS_504 } = __VLS_500.slots;
                let __VLS_505;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_506 = __VLS_asFunctionalComponent1(__VLS_505, new __VLS_505({
                    iconName: "app-operate-log",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_507 = __VLS_506({
                    iconName: "app-operate-log",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_506));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.tool.mcp.mcpConfig'));
                // @ts-ignore
                [$t,];
                var __VLS_500;
                var __VLS_501;
            }
            if ((row.tool_type === 'CUSTOM' || row.tool_type === 'WORKFLOW') &&
                __VLS_ctx.permissionPrecise.trigger_read()) {
                let __VLS_510;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_511 = __VLS_asFunctionalComponent1(__VLS_510, new __VLS_510({
                    ...{ 'onClick': {} },
                }));
                const __VLS_512 = __VLS_511({
                    ...{ 'onClick': {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_511));
                let __VLS_515;
                const __VLS_516 = {
                    /** @type {typeof __VLS_515.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!((row.tool_type === 'CUSTOM' || row.tool_type === 'WORKFLOW') &&
                            __VLS_ctx.permissionPrecise.trigger_read()))
                            throw 0;
                        return __VLS_ctx.openTriggerDrawer(row);
                        // @ts-ignore
                        [permissionPrecise, openTriggerDrawer,];
                    },
                };
                const { default: __VLS_517 } = __VLS_513.slots;
                let __VLS_518;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_519 = __VLS_asFunctionalComponent1(__VLS_518, new __VLS_518({
                    iconName: "app-trigger",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_520 = __VLS_519({
                    iconName: "app-trigger",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_519));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.trigger.title'));
                // @ts-ignore
                [$t,];
                var __VLS_513;
                var __VLS_514;
            }
            if (__VLS_ctx.permissionPrecise.relate_map()) {
                let __VLS_523;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_524 = __VLS_asFunctionalComponent1(__VLS_523, new __VLS_523({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_525 = __VLS_524({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_524));
                let __VLS_528;
                const __VLS_529 = {
                    /** @type {typeof __VLS_528.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.relate_map()))
                            throw 0;
                        return __VLS_ctx.openResourceMappingDrawer(row);
                        // @ts-ignore
                        [permissionPrecise, openResourceMappingDrawer,];
                    },
                };
                const { default: __VLS_530 } = __VLS_526.slots;
                let __VLS_531;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_532 = __VLS_asFunctionalComponent1(__VLS_531, new __VLS_531({
                    iconName: "app-resource-mapping",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_533 = __VLS_532({
                    iconName: "app-resource-mapping",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_532));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('views.system.resourceMapping.title'));
                // @ts-ignore
                [$t,];
                var __VLS_526;
                var __VLS_527;
            }
            if ((row.tool_type === 'CUSTOM' || row.tool_type === 'WORKFLOW') &&
                __VLS_ctx.permissionPrecise.record()) {
                let __VLS_536;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_537 = __VLS_asFunctionalComponent1(__VLS_536, new __VLS_536({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_538 = __VLS_537({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_537));
                let __VLS_541;
                const __VLS_542 = {
                    /** @type {typeof __VLS_541.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!((row.tool_type === 'CUSTOM' || row.tool_type === 'WORKFLOW') &&
                            __VLS_ctx.permissionPrecise.record()))
                            throw 0;
                        return __VLS_ctx.openToolRecordDrawer(row);
                        // @ts-ignore
                        [permissionPrecise, openToolRecordDrawer,];
                    },
                };
                const { default: __VLS_543 } = __VLS_539.slots;
                let __VLS_544;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_545 = __VLS_asFunctionalComponent1(__VLS_544, new __VLS_544({
                    iconName: "app-schedule-report",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_546 = __VLS_545({
                    iconName: "app-schedule-report",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_545));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.ExecutionRecord.subTitle'));
                // @ts-ignore
                [$t,];
                var __VLS_539;
                var __VLS_540;
            }
            if (__VLS_ctx.permissionPrecise.delete()) {
                let __VLS_549;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_550 = __VLS_asFunctionalComponent1(__VLS_549, new __VLS_549({
                    ...{ 'onClick': {} },
                    divided: true,
                }));
                const __VLS_551 = __VLS_550({
                    ...{ 'onClick': {} },
                    divided: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_550));
                let __VLS_554;
                const __VLS_555 = {
                    /** @type {typeof __VLS_554.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.MoreFilledPermission(row)))
                            throw 0;
                        if (!(__VLS_ctx.permissionPrecise.delete()))
                            throw 0;
                        return __VLS_ctx.deleteTool(row);
                        // @ts-ignore
                        [permissionPrecise, deleteTool,];
                    },
                };
                const { default: __VLS_556 } = __VLS_552.slots;
                let __VLS_557;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_558 = __VLS_asFunctionalComponent1(__VLS_557, new __VLS_557({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_559 = __VLS_558({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_558));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_552;
                var __VLS_553;
            }
            // @ts-ignore
            [];
            var __VLS_442;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_422;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_272;
// @ts-ignore
[];
var __VLS_101;
var __VLS_102;
// @ts-ignore
[];
var __VLS_21;
const __VLS_562 = InitParamDrawer;
// @ts-ignore
const __VLS_563 = __VLS_asFunctionalComponent1(__VLS_562, new __VLS_562({
    ...{ 'onRefresh': {} },
    ref: "InitParamDrawerRef",
}));
const __VLS_564 = __VLS_563({
    ...{ 'onRefresh': {} },
    ref: "InitParamDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_563));
let __VLS_567;
const __VLS_568 = {
    /** @type {typeof __VLS_567.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_569;
var __VLS_565;
var __VLS_566;
const __VLS_571 = ToolFormDrawer;
// @ts-ignore
const __VLS_572 = __VLS_asFunctionalComponent1(__VLS_571, new __VLS_571({
    ...{ 'onRefresh': {} },
    ref: "ToolFormDrawerRef",
    title: (__VLS_ctx.ToolDrawertitle),
}));
const __VLS_573 = __VLS_572({
    ...{ 'onRefresh': {} },
    ref: "ToolFormDrawerRef",
    title: (__VLS_ctx.ToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_572));
let __VLS_576;
const __VLS_577 = {
    /** @type {typeof __VLS_576.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_578;
var __VLS_574;
var __VLS_575;
const __VLS_580 = SkillToolFormDrawer;
// @ts-ignore
const __VLS_581 = __VLS_asFunctionalComponent1(__VLS_580, new __VLS_580({
    ...{ 'onRefresh': {} },
    ref: "SkillToolFormDrawerRef",
    title: (__VLS_ctx.SkillToolDrawertitle),
}));
const __VLS_582 = __VLS_581({
    ...{ 'onRefresh': {} },
    ref: "SkillToolFormDrawerRef",
    title: (__VLS_ctx.SkillToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_581));
let __VLS_585;
const __VLS_586 = {
    /** @type {typeof __VLS_585.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_587;
var __VLS_583;
var __VLS_584;
const __VLS_589 = McpToolFormDrawer;
// @ts-ignore
const __VLS_590 = __VLS_asFunctionalComponent1(__VLS_589, new __VLS_589({
    ...{ 'onRefresh': {} },
    ref: "McpToolFormDrawerRef",
    title: (__VLS_ctx.McpToolDrawertitle),
}));
const __VLS_591 = __VLS_590({
    ...{ 'onRefresh': {} },
    ref: "McpToolFormDrawerRef",
    title: (__VLS_ctx.McpToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_590));
let __VLS_594;
const __VLS_595 = {
    /** @type {typeof __VLS_594.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_596;
var __VLS_592;
var __VLS_593;
const __VLS_598 = DataSourceToolFormDrawer;
// @ts-ignore
const __VLS_599 = __VLS_asFunctionalComponent1(__VLS_598, new __VLS_598({
    ...{ 'onRefresh': {} },
    ref: "DataSourceToolFormDrawerRef",
    title: (__VLS_ctx.DataSourceToolDrawertitle),
}));
const __VLS_600 = __VLS_599({
    ...{ 'onRefresh': {} },
    ref: "DataSourceToolFormDrawerRef",
    title: (__VLS_ctx.DataSourceToolDrawertitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_599));
let __VLS_603;
const __VLS_604 = {
    /** @type {typeof __VLS_603.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_605;
var __VLS_601;
var __VLS_602;
const __VLS_607 = AddInternalToolDialog;
// @ts-ignore
const __VLS_608 = __VLS_asFunctionalComponent1(__VLS_607, new __VLS_607({
    ...{ 'onRefresh': {} },
    ref: "AddInternalToolDialogRef",
}));
const __VLS_609 = __VLS_608({
    ...{ 'onRefresh': {} },
    ref: "AddInternalToolDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_608));
let __VLS_612;
const __VLS_613 = {
    /** @type {typeof __VLS_612.refresh} */
    onRefresh: (__VLS_ctx.confirmAddInternalTool),
};
var __VLS_614;
var __VLS_610;
var __VLS_611;
const __VLS_616 = McpToolConfigDialog;
// @ts-ignore
const __VLS_617 = __VLS_asFunctionalComponent1(__VLS_616, new __VLS_616({
    ...{ 'onRefresh': {} },
    ref: "McpToolConfigDialogRef",
}));
const __VLS_618 = __VLS_617({
    ...{ 'onRefresh': {} },
    ref: "McpToolConfigDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_617));
let __VLS_621;
const __VLS_622 = {
    /** @type {typeof __VLS_621.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_623;
var __VLS_619;
var __VLS_620;
const __VLS_625 = ResourceAuthorizationDrawer;
// @ts-ignore
const __VLS_626 = __VLS_asFunctionalComponent1(__VLS_625, new __VLS_625({
    type: (__VLS_ctx.SourceTypeEnum.TOOL),
    ref: "ResourceAuthorizationDrawerRef",
}));
const __VLS_627 = __VLS_626({
    type: (__VLS_ctx.SourceTypeEnum.TOOL),
    ref: "ResourceAuthorizationDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_626));
var __VLS_630;
var __VLS_628;
const __VLS_632 = ResourceMappingDrawer || ResourceMappingDrawer;
// @ts-ignore
const __VLS_633 = __VLS_asFunctionalComponent1(__VLS_632, new __VLS_632({
    ref: "resourceMappingDrawerRef",
}));
const __VLS_634 = __VLS_633({
    ref: "resourceMappingDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_633));
var __VLS_637;
var __VLS_635;
const __VLS_639 = ExecutionRecordDrawer;
// @ts-ignore
const __VLS_640 = __VLS_asFunctionalComponent1(__VLS_639, new __VLS_639({
    ref: "toolRecordDrawerRef",
}));
const __VLS_641 = __VLS_640({
    ref: "toolRecordDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_640));
var __VLS_644;
var __VLS_642;
const __VLS_646 = ResourceTriggerDrawer || ResourceTriggerDrawer;
// @ts-ignore
const __VLS_647 = __VLS_asFunctionalComponent1(__VLS_646, new __VLS_646({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.TOOL),
}));
const __VLS_648 = __VLS_647({
    ref: "resourceTriggerDrawerRef",
    source: (__VLS_ctx.SourceTypeEnum.TOOL),
}, ...__VLS_functionalComponentArgsRest(__VLS_647));
var __VLS_651;
var __VLS_649;
const __VLS_653 = WorkflowFormDialog || WorkflowFormDialog;
// @ts-ignore
const __VLS_654 = __VLS_asFunctionalComponent1(__VLS_653, new __VLS_653({
    ref: "workflowFormDialogRef",
    title: (__VLS_ctx.workflowFormDialogtitle),
}));
const __VLS_655 = __VLS_654({
    ref: "workflowFormDialogRef",
    title: (__VLS_ctx.workflowFormDialogtitle),
}, ...__VLS_functionalComponentArgsRest(__VLS_654));
var __VLS_658;
var __VLS_656;
// @ts-ignore
var __VLS_570 = __VLS_569, __VLS_579 = __VLS_578, __VLS_588 = __VLS_587, __VLS_597 = __VLS_596, __VLS_606 = __VLS_605, __VLS_615 = __VLS_614, __VLS_624 = __VLS_623, __VLS_631 = __VLS_630, __VLS_638 = __VLS_637, __VLS_645 = __VLS_644, __VLS_652 = __VLS_651, __VLS_659 = __VLS_658;
// @ts-ignore
[refresh, refresh, refresh, refresh, refresh, refresh, ToolDrawertitle, SkillToolDrawertitle, McpToolDrawertitle, DataSourceToolDrawertitle, confirmAddInternalTool, SourceTypeEnum, SourceTypeEnum, workflowFormDialogtitle,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
