/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import PermissionTable from '@/views/system/resource-authorization/component/PermissionTable.vue';
import { MsgSuccess } from '@/utils/message';
import { SourceTypeEnum } from '@/enums/common';
import { t } from '@/locales';
import AuthorizationApi from '@/api/system/resource-authorization';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import useStore from '@/stores';
import { i18n_name } from '@/utils/common';
const route = useRoute();
const { user } = useStore();
const loading = ref(false);
const rLoading = ref(false);
const memberList = ref([]); // AllMember
const filterMember = ref([]); // SearchFilterAfterList
const currentUser = ref('');
const currentType = ref('');
const filterText = ref('');
const permissionData = ref([]);
const settingTags = reactive([
    {
        label: t('views.knowledge.title'),
        type: SourceTypeEnum.KNOWLEDGE,
    },
    {
        label: t('views.application.title'),
        type: SourceTypeEnum.APPLICATION,
    },
    {
        label: t('views.tool.title'),
        type: SourceTypeEnum.TOOL,
    },
    {
        label: t('views.model.title'),
        type: SourceTypeEnum.MODEL,
    },
]);
// CurrentActivatedDataType（Application/KnowledgeDatabase/Model/Tools）
const activeData = computed(() => {
    const lastIndex = route.path.lastIndexOf('/');
    const currentPathType = route.path.substring(lastIndex + 1).toUpperCase();
    return settingTags.filter((item) => {
        return item.type === currentPathType;
    })[0];
});
watch(filterText, (val) => {
    if (val) {
        filterMember.value = memberList.value.filter((v) => v.nick_name.toLowerCase().includes(val.toLowerCase()));
    }
    else {
        filterMember.value = memberList.value;
    }
});
function submitPermissions(obj) {
    const workspaceId = currentWorkspaceId.value || user.getWorkspaceId() || 'default';
    AuthorizationApi.putResourceAuthorization(workspaceId, currentUser.value, route.meta?.resource || 'APPLICATION', obj, rLoading).then(() => {
        MsgSuccess(t('common.submitSuccess'));
        getPermissionList();
    });
}
const PermissionTableRef = ref();
const getPermissionList = () => {
    const workspaceId = currentWorkspaceId.value || user.getWorkspaceId() || 'default';
    const params = {};
    AuthorizationApi.getResourceAuthorization(workspaceId, currentUser.value, route.meta?.resource || 'APPLICATION', params, rLoading).then((res) => {
        const resourceType = route.meta?.resource || 'APPLICATION';
        if (resourceType === 'MODEL') {
            permissionData.value = res.data || [];
        }
        else {
            permissionData.value =
                res.data.map((item) => {
                    if (!item.folder_id && item.permission === 'NOT_AUTH') {
                        return { ...item, permission: 'VIEW' };
                    }
                    return item;
                }) || [];
        }
    });
};
const toTree = (nodeList, pField) => {
    if (!nodeList || nodeList.length === 0)
        return [];
    const list = JSON.parse(JSON.stringify(nodeList));
    if (!pField) {
        pField = 'parentId';
    }
    const nodeMap = Object.fromEntries(list.map((item) => [item.id, item]));
    for (let index = 0; index < nodeList.length; index++) {
        const element = list[index];
        if (!element.children) {
            element.children = [];
        }
        if (element[pField]) {
            const pNode = nodeMap[element[pField]];
            if (pNode) {
                if (!pNode.children) {
                    pNode.children = [];
                }
                pNode.children.push(element);
            }
        }
    }
    return list.filter((item) => !item[pField]);
};
const treeData = computed(() => {
    const resourceType = route.meta?.resource || 'APPLICATION';
    if (resourceType === 'MODEL') {
        return permissionData.value;
    }
    return toTree(permissionData.value, 'folder_id');
});
function clickMemberHandle(item) {
    currentUser.value = item.id;
    currentType.value = item.type;
    getPermissionList();
}
function getMember(id) {
    const workspaceId = currentWorkspaceId.value || user.getWorkspaceId() || 'default';
    AuthorizationApi.getUserMember(workspaceId, loading).then((res) => {
        memberList.value = res.data;
        filterMember.value = res.data;
        if (memberList.value.length > 0) {
            const member = (id && memberList.value.find((p) => p.user_id === id)) || null;
            currentUser.value = member ? member.id : memberList.value?.[0]?.id;
            currentType.value = member ? member.type : memberList.value?.[0]?.type;
            getPermissionList();
        }
        else {
            permissionData.value = [];
        }
    });
}
const workspaceList = ref([]);
const currentWorkspaceId = ref('');
const currentWorkspace = computed(() => {
    return workspaceList.value.find((w) => w.id == currentWorkspaceId.value);
});
async function getWorkspaceList() {
    const res = await loadPermissionApi('workspace').getSystemWorkspaceList(loading);
    workspaceList.value = res.data;
    currentWorkspaceId.value = user.getWorkspaceId() || 'default';
}
function changeWorkspace(item) {
    currentWorkspaceId.value = item.id;
    getMember();
}
onMounted(() => {
    if (user.isEE()) {
        getWorkspaceList();
    }
    getMember();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "resource-authorization p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['resource-authorization']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
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
(__VLS_ctx.t('views.system.resourceAuthorization.title'));
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
(__VLS_ctx.activeData.label);
// @ts-ignore
[activeData,];
var __VLS_15;
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        ...{ class: "ml-24" },
        direction: "vertical",
    }));
    const __VLS_20 = __VLS_19({
        ...{ class: "ml-24" },
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
}
if (__VLS_ctx.hasPermission(__VLS_ctx.EditionConst.IS_EE, 'OR')) {
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.WorkspaceDropdown} */
    WorkspaceDropdown;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        ...{ 'onChangeWorkspace': {} },
        data: (__VLS_ctx.workspaceList),
        currentWorkspace: (__VLS_ctx.currentWorkspace),
    }));
    const __VLS_25 = __VLS_24({
        ...{ 'onChangeWorkspace': {} },
        data: (__VLS_ctx.workspaceList),
        currentWorkspace: (__VLS_ctx.currentWorkspace),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    let __VLS_28;
    const __VLS_29 = {
        /** @type {typeof __VLS_28.changeWorkspace} */
        onChangeWorkspace: (__VLS_ctx.changeWorkspace),
    };
    var __VLS_26;
    var __VLS_27;
}
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ style: {} },
}));
const __VLS_32 = __VLS_31({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
const { default: __VLS_35 } = __VLS_33.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "resource-authorization__left border-r" },
});
/** @type {__VLS_StyleScopedClasses['resource-authorization__left']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "mb-12" },
});
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
(__VLS_ctx.$t('views.system.resourceAuthorization.member'));
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "list-height-left" },
});
/** @type {__VLS_StyleScopedClasses['list-height-left']} */ ;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8-16" },
});
/** @type {__VLS_StyleScopedClasses['p-8-16']} */ ;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.filterMember),
    defaultActive: (__VLS_ctx.currentUser),
}));
const __VLS_49 = __VLS_48({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.filterMember),
    defaultActive: (__VLS_ctx.currentUser),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = {
    /** @type {typeof __VLS_52.click} */
    onClick: (__VLS_ctx.clickMemberHandle),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_54 } = __VLS_50.slots;
{
    const { default: __VLS_55 } = __VLS_50.slots;
    const [{ row }] = __VLS_vSlot(__VLS_55);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8 ellipsis-1" },
        title: (row.nick_name),
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (__VLS_ctx.i18n_name(row.nick_name));
    if (__VLS_ctx.hasPermission([__VLS_ctx.EditionConst.IS_EE, __VLS_ctx.EditionConst.IS_PE], 'OR')) {
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            ...{ class: "color-input-placeholder ellipsis-1" },
            title: (row.roles.join('，')),
        }));
        const __VLS_58 = __VLS_57({
            ...{ class: "color-input-placeholder ellipsis-1" },
            title: (row.roles.join('，')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        /** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
        /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
        const { default: __VLS_61 } = __VLS_59.slots;
        (row.roles.map((item) => __VLS_ctx.i18n_name(item))?.join('，'));
        // @ts-ignore
        [hasPermission, hasPermission, hasPermission, EditionConst, EditionConst, EditionConst, EditionConst, workspaceList, currentWorkspace, changeWorkspace, $t, $t, filterText, filterMember, currentUser, clickMemberHandle, vLoading, loading, i18n_name, i18n_name,];
        var __VLS_59;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_50;
var __VLS_51;
// @ts-ignore
[];
var __VLS_44;
const __VLS_62 = PermissionTable;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    ...{ 'onSubmitPermissions': {} },
    data: (__VLS_ctx.treeData),
    type: (__VLS_ctx.activeData.type),
    ref: "PermissionTableRef",
    getData: (__VLS_ctx.getPermissionList),
}));
const __VLS_64 = __VLS_63({
    ...{ 'onSubmitPermissions': {} },
    data: (__VLS_ctx.treeData),
    type: (__VLS_ctx.activeData.type),
    ref: "PermissionTableRef",
    getData: (__VLS_ctx.getPermissionList),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
let __VLS_67;
const __VLS_68 = {
    /** @type {typeof __VLS_67.submitPermissions} */
    onSubmitPermissions: (__VLS_ctx.submitPermissions),
};
var __VLS_69;
var __VLS_65;
var __VLS_66;
// @ts-ignore
[activeData, treeData, getPermissionList, submitPermissions,];
var __VLS_33;
// @ts-ignore
var __VLS_70 = __VLS_69;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
