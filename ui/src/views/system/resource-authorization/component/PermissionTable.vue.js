/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SourceTypeEnum } from '@/enums/common';
import { isAppIcon, resetUrl } from '@/utils/common';
import { RoleConst, PermissionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { ComplexPermission } from '@/utils/permission/type';
import { getPermissionOptions } from '@/views/system/resource-authorization/constant';
import useStore from '@/stores';
import { TreeToFlatten } from '@/utils/array';
const { model, user } = useStore();
const route = useRoute();
const props = defineProps();
const emit = defineEmits(['submitPermissions']);
const defaultExpandKeys = ref([]);
const isComputedFirst = ref(true); // Only firstOnceGetDataWhenNeedsCalculateOnceExpand property
watch(() => props.data, (newData) => {
    if (newData && newData.length > 0 && isComputedFirst.value) {
        defaultExpandKeys.value = props.data?.length > 0 ? [props.data[0]?.id] : [];
        isComputedFirst.value = false;
    }
}, { immediate: true });
// const defaultExpandKeys = computed(() => {
// const searchName = searchForm.value.name || ''
// const searchPermissions = searchForm.value.permission ?? []
// if (!searchName && (!searchPermissions || searchPermissions.length === 0)) {
// return props.data?.length > 0 ? [props.data[0]?.id] : []
// }
// const expandIds: string[] = []
// // Pass inFilter afterData
// const collectExpandIds = (nodes: any[]) => {
//   nodes.forEach((node) => {
//     if (node.children && node.children.length > 0) {
//       expandIds.push(node.id)
//       collectExpandIds(node.children)
//     }
//   })
// }
// collectExpandIds(filteredData.value)
// return expandIds
// })
const permissionOptionMap = computed(() => {
    return {
        rootFolder: getPermissionOptions(true, true),
        folder: getPermissionOptions(false, false),
        resource: getPermissionOptions(false, false),
    };
});
const getRowPermissionOptions = (row) => {
    const isFolder = row.resource_type === 'folder';
    const isRoot = isFolder && row.folder_id === null;
    if (isRoot) {
        return permissionOptionMap.value.rootFolder;
    }
    if (isFolder) {
        return permissionOptionMap.value.folder;
    }
    return permissionOptionMap.value.resource;
};
const permissionOptions = computed(() => {
    if (multipleSelection.value.some((item) => item.resource_type === 'folder' && item.folder_id == null)) {
        return permissionOptionMap.value.rootFolder;
    }
    else if (multipleSelection.value.some((item) => item.resource_type === 'folder')) {
        return permissionOptionMap.value.folder;
    }
    else {
        return permissionOptionMap.value.resource;
    }
});
const permissionObj = ref({
    APPLICATION: new ComplexPermission([RoleConst.ADMIN, RoleConst.WORKSPACE_MANAGE], [
        PermissionConst.APPLICATION_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT,
        PermissionConst.APPLICATION_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT
            .getWorkspacePermissionWorkspaceManageRole,
    ], [], 'OR'),
    KNOWLEDGE: new ComplexPermission([RoleConst.ADMIN, RoleConst.WORKSPACE_MANAGE], [
        PermissionConst.KNOWLEDGE_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT,
        PermissionConst.KNOWLEDGE_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT
            .getWorkspacePermissionWorkspaceManageRole,
    ], [], 'OR'),
    TOOL: new ComplexPermission([RoleConst.ADMIN, RoleConst.WORKSPACE_MANAGE], [
        PermissionConst.TOOL_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT,
        PermissionConst.TOOL_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT
            .getWorkspacePermissionWorkspaceManageRole,
    ], [], 'OR'),
    MODEL: new ComplexPermission([RoleConst.ADMIN, RoleConst.WORKSPACE_MANAGE], [
        PermissionConst.MODEL_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT,
        PermissionConst.MODEL_WORKSPACE_USER_RESOURCE_PERMISSION_EDIT
            .getWorkspacePermissionWorkspaceManageRole,
    ], [], 'OR'),
});
const isKnowledge = computed(() => props.type === SourceTypeEnum.KNOWLEDGE);
const isApplication = computed(() => props.type === SourceTypeEnum.APPLICATION);
const isTool = computed(() => props.type === SourceTypeEnum.TOOL);
const isModel = computed(() => props.type === SourceTypeEnum.MODEL);
const multipleTableRef = ref();
const searchType = ref('name');
const searchForm = ref({
    name: '',
    permission: undefined,
});
const search_type_change = () => {
    searchForm.value = { name: '', permission: undefined };
};
const filterTreeData = () => {
    const searchName = searchForm.value.name || '';
    const searchPermissions = searchForm.value.permission ?? [];
    if (!searchName && (!searchPermissions || searchPermissions.length === 0)) {
        return props.data;
    }
    const filterNodes = (treeData, name, permissions) => {
        if (!treeData || treeData.length === 0)
            return [];
        const result = [];
        for (const node of treeData) {
            const cloneNode = { ...node };
            let isMatch = false;
            if (searchType.value === 'name') {
                isMatch = node.name.toLowerCase().includes(name.toLowerCase());
            }
            else if (searchType.value === 'permission') {
                isMatch = node.permission && permissions.includes(node.permission);
            }
            let filteredChildren = [];
            if (node.children && node.children.length > 0) {
                filteredChildren = filterNodes(node.children, name, permissions);
            }
            if (isMatch || filteredChildren.length > 0) {
                cloneNode.children = filteredChildren;
                result.push(cloneNode);
            }
        }
        return result;
    };
    return filterNodes(props.data, searchName, searchPermissions);
};
const filteredData = computed(() => {
    return filterTreeData();
});
const multipleSelection = ref([]);
const selectObj = {};
const selectAll = (selection) => {
    multipleSelection.value = selection;
};
const select = (val, active) => {
    if (active.resource_type === 'folder') {
        if (!val.some((item) => item.id == active.id)) {
            if (selectObj[active.id] === undefined) {
                selectObj[active.id] = 0;
            }
            if (selectObj[active.id] % 2 == 0) {
                TreeToFlatten([active])
                    .filter((item) => item.id != active.id)
                    .forEach((item) => {
                    if (multipleSelection.value.some((select) => item.id == select.id)) {
                        multipleTableRef.value?.toggleRowSelection(item, true);
                    }
                });
                multipleSelection.value = multipleTableRef.value.getSelectionRows();
            }
            else {
                multipleSelection.value = val;
            }
            selectObj[active.id] = selectObj[active.id] + 1;
        }
        else {
            multipleSelection.value = val;
        }
    }
    else {
        multipleSelection.value = val;
    }
};
const dialogVisible = ref(false);
const radioPermission = ref('');
function openMulConfigureDialog() {
    if (multipleSelection.value.length === 0) {
        return;
    }
    dialogVisible.value = true;
}
function submitDialog() {
    if (multipleSelection.value.length === 0 || !radioPermission.value) {
        return;
    }
    const obj = multipleSelection.value.map((item) => ({
        target_id: item.id,
        permission: radioPermission.value,
    }));
    emit('submitPermissions', obj);
    closeDialog();
}
function closeDialog() {
    dialogVisible.value = false;
    radioPermission.value = '';
    multipleSelection.value = [];
    multipleTableRef.value?.clearSelection();
}
function getResourcesByFolderId(treeData, folderId) {
    const result = [];
    let target = null;
    function dfs(nodes) {
        for (const node of nodes) {
            if (node.id === folderId) {
                target = node;
                return;
            }
            if (node.children?.length) {
                dfs(node.children);
                if (target)
                    return;
            }
        }
    }
    function collect(node) {
        if (!node?.children)
            return;
        for (const child of node.children) {
            result.push(child);
            collect(child);
        }
    }
    dfs(treeData);
    if (target) {
        collect(target);
    }
    return result;
}
function submitPermissions(value, row) {
    const obj = [
        {
            target_id: row.id,
            permission: value,
        },
    ];
    const emitSubmitPermissions = (treeData, ids, result) => {
        if (!treeData || treeData.length === 0)
            return [];
        for (const node of treeData) {
            const isRecursion = node.permission == 'NOT_AUTH' && ids.includes(node.id);
            if (node.children && node.children.length > 0 && !isRecursion) {
                emitSubmitPermissions(node.children, ids, result);
            }
            const isMatch = node.permission == 'NOT_AUTH' && ids.includes(node.id);
            if (isMatch) {
                ids.push(node.folder_id);
                result.push({
                    target_id: node.id,
                    permission: 'VIEW',
                });
            }
        }
        return result;
    };
    if (['VIEW', 'MANAGE', 'ROLE'].includes(value)) {
        emitSubmitPermissions(props.data, [row.folder_id], obj);
    }
    if (['NOT_AUTH'].includes(value) && 'folder' == row.resource_type) {
        getResourcesByFolderId(props.data, row.id).forEach((n) => {
            obj.push({ target_id: n.id, permission: 'NOT_AUTH' });
        });
    }
    emit('submitPermissions', obj);
}
const provider_list = ref([]);
function getProvider() {
    model.asyncGetProvider().then((res) => {
        provider_list.value = res?.data;
    });
}
const getProviderIcon = computed(() => {
    return (row) => {
        return provider_list.value.find((p) => p.provider === row.icon)?.icon;
    };
});
onMounted(() => {
    if (isModel.value) {
        getProvider();
    }
});
const __VLS_exposed = {
    searchForm,
    searchType,
};
defineExpose(__VLS_exposed);
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "permission-setting p-24 flex" },
});
/** @type {__VLS_StyleScopedClasses['permission-setting']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "resource-authorization__table" },
});
/** @type {__VLS_StyleScopedClasses['resource-authorization__table']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.system.resourceAuthorization.permissionSetting'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
if (__VLS_ctx.hasPermission(__VLS_ctx.permissionObj[__VLS_ctx.route.meta?.resource || 'APPLICATION'], 'OR')) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = {
        /** @type {typeof __VLS_5.click} */
        onClick: (__VLS_ctx.openMulConfigureDialog),
    };
    const { default: __VLS_7 } = __VLS_3.slots;
    (__VLS_ctx.$t('views.system.resourceAuthorization.setting.configure'));
    // @ts-ignore
    [$t, $t, hasPermission, permissionObj, route, multipleSelection, openMulConfigureDialog,];
    var __VLS_3;
    var __VLS_4;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
let __VLS_13;
const __VLS_14 = {
    /** @type {typeof __VLS_13.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_15 } = __VLS_11.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('common.name')),
    value: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
    value: "permission",
}));
const __VLS_23 = __VLS_22({
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
    value: "permission",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[$t, $t, searchType, search_type_change,];
var __VLS_11;
var __VLS_12;
if (__VLS_ctx.searchType === 'name') {
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        modelValue: (__VLS_ctx.searchForm.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_28 = __VLS_27({
        modelValue: (__VLS_ctx.searchForm.name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
}
else if (__VLS_ctx.searchType === 'permission') {
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        modelValue: (__VLS_ctx.searchForm.permission),
        filterable: true,
        clearable: true,
        multiple: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
    }));
    const __VLS_33 = __VLS_32({
        modelValue: (__VLS_ctx.searchForm.permission),
        filterable: true,
        clearable: true,
        multiple: true,
        reserveKeyword: (false),
        collapseTags: true,
        collapseTagsTooltip: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    const { default: __VLS_36 } = __VLS_34.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.getPermissionOptions()))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_37;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            label: (item.label),
            value: (item.value),
        }));
        const __VLS_39 = __VLS_38({
            label: (item.label),
            value: (item.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        // @ts-ignore
        [$t, searchType, searchType, searchForm, searchForm, getPermissionOptions,];
    }
    // @ts-ignore
    [];
    var __VLS_34;
}
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    ...{ 'onSelect': {} },
    ...{ 'onSelectAll': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.filteredData),
    maxTableHeight: (260),
    rowKey: ((row) => row.id),
    ...{ style: {} },
    expandRowKeys: (__VLS_ctx.defaultExpandKeys),
    defaultExpandAll: (__VLS_ctx.searchForm.name || __VLS_ctx.searchForm.permission?.length > 0),
    showOverflowTooltip: true,
}));
const __VLS_44 = __VLS_43({
    ...{ 'onSelect': {} },
    ...{ 'onSelectAll': {} },
    ref: "multipleTableRef",
    ...{ class: "mt-16" },
    data: (__VLS_ctx.filteredData),
    maxTableHeight: (260),
    rowKey: ((row) => row.id),
    ...{ style: {} },
    expandRowKeys: (__VLS_ctx.defaultExpandKeys),
    defaultExpandAll: (__VLS_ctx.searchForm.name || __VLS_ctx.searchForm.permission?.length > 0),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
const __VLS_48 = {
    /** @type {typeof __VLS_47.select} */
    onSelect: (__VLS_ctx.select),
};
const __VLS_49 = {
    /** @type {typeof __VLS_47.selectAll} */
    onSelectAll: (__VLS_ctx.selectAll),
};
var __VLS_50;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_52 } = __VLS_45.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}));
const __VLS_55 = __VLS_54({
    type: "selection",
    width: "55",
    reserveSelection: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    prop: "name",
    label: (__VLS_ctx.$t('common.name')),
}));
const __VLS_60 = __VLS_59({
    prop: "name",
    label: (__VLS_ctx.$t('common.name')),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
{
    const { default: __VLS_64 } = __VLS_61.slots;
    const [{ row }] = __VLS_vSlot(__VLS_64);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ style: {} },
    });
    if (row.resource_type === 'folder') {
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            iconName: "app-folder",
            ...{ style: {} },
        }));
        const __VLS_67 = __VLS_66({
            iconName: "app-folder",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
    }
    else if (__VLS_ctx.isKnowledge) {
        let __VLS_70;
        /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
        KnowledgeIcon;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
            size: (20),
            type: (row.icon),
            ...{ style: {} },
        }));
        const __VLS_72 = __VLS_71({
            size: (20),
            type: (row.icon),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    }
    else if (__VLS_ctx.isAppIcon(row?.icon) && !__VLS_ctx.isModel) {
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            ...{ style: {} },
            shape: "square",
            size: (20),
        }));
        const __VLS_77 = __VLS_76({
            ...{ style: {} },
            shape: "square",
            size: (20),
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        const { default: __VLS_80 } = __VLS_78.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.resetUrl(row?.icon)),
            alt: "",
        });
        // @ts-ignore
        [$t, searchForm, searchForm, filteredData, defaultExpandKeys, select, selectAll, isKnowledge, isAppIcon, isModel, resetUrl,];
        var __VLS_78;
    }
    else if (__VLS_ctx.isApplication) {
        let __VLS_81;
        /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
        LogoIcon;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            height: "20px",
        }));
        const __VLS_83 = __VLS_82({
            height: "20px",
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
    }
    else if (__VLS_ctx.isTool) {
        let __VLS_86;
        /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
        ToolIcon;
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
            size: (20),
            type: (row?.tool_type),
            ...{ style: {} },
        }));
        const __VLS_88 = __VLS_87({
            size: (20),
            type: (row?.tool_type),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    }
    else if (__VLS_ctx.isModel) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
            innerHTML: (__VLS_ctx.getProviderIcon(row)),
        });
    }
    (row?.name);
    // @ts-ignore
    [isModel, isApplication, isTool, getProviderIcon,];
}
// @ts-ignore
[];
var __VLS_61;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
    align: "left",
}));
const __VLS_93 = __VLS_92({
    label: (__VLS_ctx.$t('views.model.modelForm.permissionType.label')),
    align: "left",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const { default: __VLS_96 } = __VLS_94.slots;
{
    const { default: __VLS_97 } = __VLS_94.slots;
    const [{ row }] = __VLS_vSlot(__VLS_97);
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        ...{ 'onChange': {} },
        modelValue: (row.permission),
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onChange': {} },
        modelValue: (row.permission),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_103;
    const __VLS_104 = {
        /** @type {typeof __VLS_103.change} */
        onChange: ((val) => __VLS_ctx.submitPermissions(val, row)),
    };
    const { default: __VLS_105 } = __VLS_101.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.getRowPermissionOptions(row)))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        let __VLS_106;
        /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
        elRadio;
        // @ts-ignore
        const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
            value: (item.value),
            ...{ class: "mr-16" },
        }));
        const __VLS_108 = __VLS_107({
            value: (item.value),
            ...{ class: "mr-16" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_107));
        /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
        const { default: __VLS_111 } = __VLS_109.slots;
        (item.label);
        // @ts-ignore
        [$t, submitPermissions, getRowPermissionOptions,];
        var __VLS_109;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_101;
    var __VLS_102;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_94;
// @ts-ignore
[];
var __VLS_45;
var __VLS_46;
let __VLS_112;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.configure')),
    destroyOnClose: true,
}));
const __VLS_114 = __VLS_113({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.dialogVisible),
    title: (__VLS_ctx.$t('views.system.resourceAuthorization.setting.configure')),
    destroyOnClose: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_113));
let __VLS_117;
const __VLS_118 = {
    /** @type {typeof __VLS_117.close} */
    onClose: (__VLS_ctx.closeDialog),
};
const { default: __VLS_119 } = __VLS_115.slots;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    modelValue: (__VLS_ctx.radioPermission),
    ...{ class: "radio-block" },
}));
const __VLS_122 = __VLS_121({
    modelValue: (__VLS_ctx.radioPermission),
    ...{ class: "radio-block" },
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
/** @type {__VLS_StyleScopedClasses['radio-block']} */ ;
const { default: __VLS_125 } = __VLS_123.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.permissionOptions))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_126;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
        value: (item.value),
        ...{ class: "mr-16" },
    }));
    const __VLS_128 = __VLS_127({
        value: (item.value),
        ...{ class: "mr-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_127));
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    const { default: __VLS_131 } = __VLS_129.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "color-text-primary lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['color-text-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (item.label);
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        ...{ class: "color-secondary lighter" },
    }));
    const __VLS_134 = __VLS_133({
        ...{ class: "color-secondary lighter" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_137 } = __VLS_135.slots;
    (item.desc);
    // @ts-ignore
    [$t, dialogVisible, closeDialog, radioPermission, permissionOptions,];
    var __VLS_135;
    // @ts-ignore
    [];
    var __VLS_129;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_123;
{
    const { footer: __VLS_138 } = __VLS_115.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    let __VLS_139;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
        ...{ 'onClick': {} },
    }));
    const __VLS_141 = __VLS_140({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_144;
    const __VLS_145 = {
        /** @type {typeof __VLS_144.click} */
        onClick: (__VLS_ctx.closeDialog),
    };
    const { default: __VLS_146 } = __VLS_142.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeDialog,];
    var __VLS_142;
    var __VLS_143;
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_149 = __VLS_148({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    let __VLS_152;
    const __VLS_153 = {
        /** @type {typeof __VLS_152.click} */
        onClick: (__VLS_ctx.submitDialog),
    };
    const { default: __VLS_154 } = __VLS_150.slots;
    (__VLS_ctx.$t('common.confirm'));
    // @ts-ignore
    [$t, submitDialog,];
    var __VLS_150;
    var __VLS_151;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_115;
var __VLS_116;
// @ts-ignore
var __VLS_51 = __VLS_50;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
