/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { getPermissionOptions } from '@/views/system/resource-authorization/constant';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import permissionMap from '@/permission';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
import useStore from '@/stores';
import { hasPermission } from '@/utils/permission/index';
import { EditionConst, PermissionConst, RoleConst } from '@/utils/permission/data';
const { user } = useStore();
const props = defineProps();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const folderType = computed(() => {
    if (route.path.includes('application')) {
        return 'application';
    }
    else if (route.path.includes('knowledge')) {
        return 'knowledge';
    }
    else if (route.path.includes('tool')) {
        return 'tool';
    }
    else {
        return 'application';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap[folderType.value]['workspace'];
});
// Take outFolderid
function getAllFolderIds(data) {
    if (!data)
        return [];
    return [data.id, ...(data.children?.flatMap((child) => getAllFolderIds(child)) || [])];
}
const RESOURCE_PERMISSION_MAP = {
    application: PermissionConst.APPLICATION_RESOURCE_AUTHORIZATION.getWorkspacePermissionWorkspaceManageRole,
    knowledge: PermissionConst.KNOWLEDGE_RESOURCE_AUTHORIZATION.getWorkspacePermissionWorkspaceManageRole,
    tool: PermissionConst.TOOL_RESOURCE_AUTHORIZATION.getWorkspacePermissionWorkspaceManageRole,
};
const resourceAuthorizationOfManager = computed(() => {
    return RESOURCE_PERMISSION_MAP[folderType.value];
});
// FilterNoneManagePermissionFolderID
function filterHasPermissionFolderIds(folderIds) {
    if (hasPermission([RoleConst.WORKSPACE_MANAGE.getWorkspaceRole, resourceAuthorizationOfManager.value], 'OR')) {
        return folderIds;
    }
    else {
        return folderIds.filter((id) => permissionPrecise.value.folderManage(id));
    }
}
function confirmSinglePermission() {
    if (!pendingPermissionChange.value)
        return;
    const { val, row } = pendingPermissionChange.value;
    let folderIds = [];
    if (authAllChildren.value && folderData.value) {
        const allFolderIds = getAllFolderIds(folderData.value);
        folderIds = filterHasPermissionFolderIds(allFolderIds);
    }
    const obj = [
        {
            user_id: row.id,
            permission: val,
            include_children: authAllChildren.value,
            ...(folderIds.length > 0 && { folder_ids: folderIds }),
        },
    ];
    submitPermissions(obj);
    singleSelectDialogVisible.value = false;
    authAllChildren.value = false;
    pendingPermissionChange.value = null;
    getPermissionList();
}
const permissionOptionMap = computed(() => {
    return {
        rootFolder: getPermissionOptions(true, true),
        folder: getPermissionOptions(false, false),
    };
});
const getFolderPermissionOptions = () => {
    if (props.isRootFolder) {
        return permissionOptionMap.value.rootFolder;
    }
    if (props.isFolder) {
        return permissionOptionMap.value.folder;
    }
    return getPermissionOptions(false, false);
};
const permissionOptions = computed(() => {
    return getPermissionOptions();
});
const drawerVisible = ref(false);
const multipleTableRef = ref();
watch(drawerVisible, (bool) => {
    if (!bool) {
        targetId.value = '';
        searchType.value = 'nick_name';
        searchForm.value = { nick_name: '', username: '', permission: undefined };
        permissionData.value = [];
        paginationConfig.current_page = 1;
        paginationConfig.total = 0;
        multipleSelection.value = [];
        multipleTableRef.value?.clearSelection();
    }
});
const loading = ref(false);
const targetId = ref('');
const folderData = ref(null);
const permissionData = ref([]);
const searchType = ref('nick_name');
const searchForm = ref({
    nick_name: '',
    username: '',
    role: '',
    permission: undefined,
});
const search_type_change = () => {
    searchForm.value = { nick_name: '', username: '', role: '', permission: undefined };
};
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getPermissionList();
}
function searchHandle() {
    paginationConfig.current_page = 1;
    getPermissionList();
}
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
    multipleSelection.value = val;
};
const dialogVisible = ref(false);
const rowWorkspaceId = ref(null);
const singleSelectDialogVisible = ref(false);
const pendingPermissionChange = ref(null);
const radioPermission = ref('');
const authAllChildren = ref(false);
function openMulConfigureDialog() {
    if (multipleSelection.value.length === 0) {
        return;
    }
    dialogVisible.value = true;
}
const batchAuthAllChildren = ref(false);
function submitDialog() {
    if (multipleSelection.value.length === 0 || !radioPermission.value) {
        return;
    }
    let folderIds = [];
    if (props.isFolder && batchAuthAllChildren.value && folderData.value) {
        const allFolderIds = getAllFolderIds(folderData.value);
        folderIds = filterHasPermissionFolderIds(allFolderIds);
    }
    const obj = multipleSelection.value.map((item) => ({
        user_id: item.id,
        permission: radioPermission.value,
        include_children: batchAuthAllChildren.value,
        ...(folderIds.length > 0 && { folder_ids: folderIds }),
    }));
    submitPermissions(obj);
    closeDialog();
}
function closeSingleSelectDialog() {
    singleSelectDialogVisible.value = false;
    authAllChildren.value = false;
    pendingPermissionChange.value = null;
    getPermissionList();
}
function closeDialog() {
    dialogVisible.value = false;
    radioPermission.value = '';
    batchAuthAllChildren.value = false;
    multipleSelection.value = [];
    multipleTableRef.value?.clearSelection();
}
function permissionsHandle(val, row) {
    if (props.isFolder) {
        singleSelectDialogVisible.value = true;
        pendingPermissionChange.value = { val, row };
        return;
    }
    const obj = [
        {
            user_id: row.id,
            permission: val,
        },
    ];
    submitPermissions(obj);
}
function submitPermissions(obj) {
    const workspaceId = rowWorkspaceId.value ?? user.getWorkspaceId() ?? 'default';
    loadSharedApi({ type: 'resourceAuthorization', systemType: apiType.value })
        .putResourceAuthorization(workspaceId, targetId.value, props.type, obj, loading)
        .then(() => {
        MsgSuccess(t('common.submitSuccess'));
        getPermissionList();
    });
}
const getPermissionList = () => {
    const workspaceId = rowWorkspaceId.value ?? user.getWorkspaceId() ?? 'default';
    const params = {};
    if (searchForm.value[searchType.value]) {
        params[searchType.value] = searchForm.value[searchType.value];
    }
    loadSharedApi({ type: 'resourceAuthorization', systemType: apiType.value })
        .getResourceAuthorization(workspaceId, targetId.value, props.type, paginationConfig, params, loading)
        .then((res) => {
        permissionData.value =
            res.data.records.map((item) => {
                if (props.isRootFolder && item.permission === 'NOT_AUTH') {
                    return { ...item, permission: 'VIEW' };
                }
                return item;
            }) || [];
        paginationConfig.total = res.data.total || 0;
    });
};
const open = (id, folder_data, workspace_id) => {
    targetId.value = id;
    folderData.value = folder_data;
    rowWorkspaceId.value = workspace_id ?? null;
    drawerVisible.value = true;
    getPermissionList();
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.drawerVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.title')),
    size: "850",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.drawerVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.title')),
    size: "850",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    type: "primary",
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (__VLS_ctx.openMulConfigureDialog),
};
const { default: __VLS_14 } = __VLS_10.slots;
(__VLS_ctx.$t('views.system.resourceAuthorization.setting.configure'));
// @ts-ignore
[drawerVisible, $t, $t, multipleSelection, openMulConfigureDialog,];
var __VLS_10;
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
const __VLS_21 = {
    /** @type {typeof __VLS_20.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_22 } = __VLS_18.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
let __VLS_33;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
    value: "permission",
}));
const __VLS_35 = __VLS_34({
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
    value: "permission",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
if (__VLS_ctx.hasPermission([__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR')) {
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        label: (__VLS_ctx.$t('views.role.member.role')),
        value: "role",
    }));
    const __VLS_40 = __VLS_39({
        label: (__VLS_ctx.$t('views.role.member.role')),
        value: "role",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
}
// @ts-ignore
[$t, $t, $t, $t, searchType, search_type_change, hasPermission, EditionConst, EditionConst,];
var __VLS_18;
var __VLS_19;
if (__VLS_ctx.searchType === 'nick_name') {
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    var __VLS_46;
    var __VLS_47;
}
if (__VLS_ctx.searchType === 'username') {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        /** @type {typeof __VLS_55.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    var __VLS_53;
    var __VLS_54;
}
if (__VLS_ctx.searchType === 'role') {
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.role),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.role),
        placeholder: (__VLS_ctx.$t('common.search')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    var __VLS_60;
    var __VLS_61;
}
else if (__VLS_ctx.searchType === 'permission') {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.permission),
        filterable: true,
        clearable: true,
        multiple: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.permission),
        filterable: true,
        clearable: true,
        multiple: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.change} */
        onChange: (__VLS_ctx.searchHandle),
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.permissionOptions))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_72;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
            label: (item.label),
            value: (item.value),
        }));
        const __VLS_74 = __VLS_73({
            label: (item.label),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_73));
        // @ts-ignore
        [$t, $t, $t, searchType, searchType, searchType, searchType, searchForm, searchForm, searchForm, searchForm, searchHandle, searchHandle, searchHandle, searchHandle, permissionOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_67;
    var __VLS_68;
}
let __VLS_77;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.permissionData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (200),
    rowKey: ((row) => row.id),
}));
const __VLS_79 = __VLS_78({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.permissionData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (200),
    rowKey: ((row) => row.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
let __VLS_82;
const __VLS_83 = {
    /** @type {typeof __VLS_82.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_84 = {
    /** @type {typeof __VLS_82.changePage} */
    onChangePage: (__VLS_ctx.getPermissionList),
};
const __VLS_85 = {
    /** @type {typeof __VLS_82.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_86;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_88 } = __VLS_80.slots;
let __VLS_89;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}));
const __VLS_91 = __VLS_90({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
let __VLS_94;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    minWidth: "120",
    showOverflowTooltip: true,
}));
const __VLS_96 = __VLS_95({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    minWidth: "120",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    prop: "username",
    minWidth: "120",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_101 = __VLS_100({
    prop: "username",
    minWidth: "120",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
if (__VLS_ctx.hasPermission([__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR')) {
    let __VLS_104;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
        prop: "role_name",
        label: (__VLS_ctx.$t('views.role.member.role')),
        width: "160",
    }));
    const __VLS_106 = __VLS_105({
        prop: "role_name",
        label: (__VLS_ctx.$t('views.role.member.role')),
        width: "160",
    }, ...__VLS_functionalComponentArgsRest(__VLS_105));
    const { default: __VLS_109 } = __VLS_107.slots;
    {
        const { default: __VLS_110 } = __VLS_107.slots;
        const [{ row }] = __VLS_vSlot(__VLS_110);
        if (row.role_name) {
            let __VLS_111;
            /** @ts-ignore @type { | typeof __VLS_components.TagGroup} */
            TagGroup;
            // @ts-ignore
            const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
                ...{ class: "cursor" },
                tags: (row.role_name),
            }));
            const __VLS_113 = __VLS_112({
                ...{ class: "cursor" },
                tags: (row.role_name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_112));
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        }
        // @ts-ignore
        [$t, $t, $t, hasPermission, EditionConst, EditionConst, permissionData, paginationConfig, handleSizeChange, getPermissionList, handleSelectionChange, vLoading, loading,];
    }
    // @ts-ignore
    [];
    var __VLS_107;
}
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "340",
}));
const __VLS_118 = __VLS_117({
    label: (__VLS_ctx.$t('common.operation')),
    align: "left",
    width: "340",
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
const { default: __VLS_121 } = __VLS_119.slots;
{
    const { default: __VLS_122 } = __VLS_119.slots;
    const [{ row }] = __VLS_vSlot(__VLS_122);
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        ...{ 'onChange': {} },
        modelValue: (row.permission),
    }));
    const __VLS_125 = __VLS_124({
        ...{ 'onChange': {} },
        modelValue: (row.permission),
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    let __VLS_128;
    const __VLS_129 = {
        /** @type {typeof __VLS_128.change} */
        onChange: ((val) => __VLS_ctx.permissionsHandle(val, row)),
    };
    const { default: __VLS_130 } = __VLS_126.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.getFolderPermissionOptions()))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_131;
        /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
        elRadio;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({
            value: (item.value),
            ...{ class: "mr-16" },
        }));
        const __VLS_133 = __VLS_132({
            value: (item.value),
            ...{ class: "mr-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_132));
        /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
        const { default: __VLS_136 } = __VLS_134.slots;
        (item.label);
        // @ts-ignore
        [$t, permissionsHandle, getFolderPermissionOptions,];
        var __VLS_134;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_126;
    var __VLS_127;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_119;
// @ts-ignore
[];
var __VLS_80;
var __VLS_81;
let __VLS_137;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.singleSelectDialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.effectiveResource')),
    destroyOnClose: true,
    width: "500px",
}));
const __VLS_139 = __VLS_138({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.singleSelectDialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.effectiveResource')),
    destroyOnClose: true,
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
let __VLS_142;
const __VLS_143 = {
    /** @type {typeof __VLS_142.close} */
    onClose: (__VLS_ctx.closeSingleSelectDialog),
};
const { default: __VLS_144 } = __VLS_140.slots;
let __VLS_145;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
    modelValue: (__VLS_ctx.authAllChildren),
    ...{ class: "radio-block" },
}));
const __VLS_147 = __VLS_146({
    modelValue: (__VLS_ctx.authAllChildren),
    ...{ class: "radio-block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
/** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
const { default: __VLS_150 } = __VLS_148.slots;
let __VLS_151;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
    value: (false),
}));
const __VLS_153 = __VLS_152({
    value: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_152));
const { default: __VLS_156 } = __VLS_154.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-text-primary lighter" },
});
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.system.resourceAuthorization.setting.currentOnly'));
// @ts-ignore
[$t, $t, singleSelectDialogVisible, closeSingleSelectDialog, authAllChildren,];
var __VLS_154;
let __VLS_157;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
    value: (true),
}));
const __VLS_159 = __VLS_158({
    value: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
const { default: __VLS_162 } = __VLS_160.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "color-text-primary lighter" },
});
/** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.system.resourceAuthorization.setting.includeAll'));
// @ts-ignore
[$t,];
var __VLS_160;
// @ts-ignore
[];
var __VLS_148;
{
    const { footer: __VLS_163 } = __VLS_140.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_164;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
        ...{ 'onClick': {} },
    }));
    const __VLS_166 = __VLS_165({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_165));
    let __VLS_169;
    const __VLS_170 = {
        /** @type {typeof __VLS_169.click} */
        onClick: (__VLS_ctx.closeSingleSelectDialog),
    };
    const { default: __VLS_171 } = __VLS_167.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeSingleSelectDialog,];
    var __VLS_167;
    var __VLS_168;
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_174 = __VLS_173({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    let __VLS_177;
    const __VLS_178 = {
        /** @type {typeof __VLS_177.click} */
        onClick: (__VLS_ctx.confirmSinglePermission),
    };
    const { default: __VLS_179 } = __VLS_175.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, confirmSinglePermission,];
    var __VLS_175;
    var __VLS_176;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_140;
var __VLS_141;
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.configure')),
    destroyOnClose: true,
    width: "500px",
}));
const __VLS_182 = __VLS_181({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.configure')),
    destroyOnClose: true,
    width: "500px",
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
let __VLS_185;
const __VLS_186 = {
    /** @type {typeof __VLS_185.close} */
    onClose: (__VLS_ctx.closeDialog),
};
const { default: __VLS_187 } = __VLS_183.slots;
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    modelValue: (__VLS_ctx.radioPermission),
    ...{ class: "radio-block" },
}));
const __VLS_190 = __VLS_189({
    modelValue: (__VLS_ctx.radioPermission),
    ...{ class: "radio-block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
/** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
const { default: __VLS_193 } = __VLS_191.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.getFolderPermissionOptions()))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_194;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
        value: (item.value),
        ...{ class: "mr-16" },
    }));
    const __VLS_196 = __VLS_195({
        value: (item.value),
        ...{ class: "mr-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    const { default: __VLS_199 } = __VLS_197.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-text-primary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (item.label);
    let __VLS_200;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
        ...{ class: "color-secondary lighter" },
    }));
    const __VLS_202 = __VLS_201({
        ...{ class: "color-secondary lighter" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_205 } = __VLS_203.slots;
    (item.desc);
    // @ts-ignore
    [$t, getFolderPermissionOptions, dialogVisible, closeDialog, radioPermission,];
    var __VLS_203;
    // @ts-ignore
    [];
    var __VLS_197;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_191;
if (__VLS_ctx.isFolder) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    let __VLS_206;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({}));
    const __VLS_208 = __VLS_207({}, ...__VLS_functionalComponentArgsRest(__VLS_207));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "color-text-primary mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('views.system.resourceAuthorization.setting.effectiveResource'));
    let __VLS_211;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_212 = __VLS_asFunctionalComponent1(__VLS_211, new __VLS_211({
        modelValue: (__VLS_ctx.batchAuthAllChildren),
        ...{ class: "radio-block" },
    }));
    const __VLS_213 = __VLS_212({
        modelValue: (__VLS_ctx.batchAuthAllChildren),
        ...{ class: "radio-block" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_212));
    /** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
    const { default: __VLS_216 } = __VLS_214.slots;
    let __VLS_217;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
        value: (false),
    }));
    const __VLS_219 = __VLS_218({
        value: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_218));
    const { default: __VLS_222 } = __VLS_220.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-text-primary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('views.system.resourceAuthorization.setting.currentOnly'));
    // @ts-ignore
    [$t, $t, isFolder, batchAuthAllChildren,];
    var __VLS_220;
    let __VLS_223;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
        value: (true),
    }));
    const __VLS_225 = __VLS_224({
        value: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_224));
    const { default: __VLS_228 } = __VLS_226.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-text-primary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('views.system.resourceAuthorization.setting.includeAll'));
    // @ts-ignore
    [$t,];
    var __VLS_226;
    // @ts-ignore
    [];
    var __VLS_214;
}
{
    const { footer: __VLS_229 } = __VLS_183.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_230;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        ...{ 'onClick': {} },
    }));
    const __VLS_232 = __VLS_231({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    let __VLS_235;
    const __VLS_236 = {
        /** @type {typeof __VLS_235.click} */
        onClick: (__VLS_ctx.closeDialog),
    };
    const { default: __VLS_237 } = __VLS_233.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeDialog,];
    var __VLS_233;
    var __VLS_234;
    let __VLS_238;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_240 = __VLS_239({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_239));
    let __VLS_243;
    const __VLS_244 = {
        /** @type {typeof __VLS_243.click} */
        onClick: (__VLS_ctx.submitDialog),
    };
    const { default: __VLS_245 } = __VLS_241.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submitDialog,];
    var __VLS_241;
    var __VLS_242;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_183;
var __VLS_184;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_87 = __VLS_86;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeProps: {},
});
export default {};
