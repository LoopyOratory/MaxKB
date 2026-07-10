/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, watch, reactive, computed } from 'vue';
import { t } from '@/locales';
import { useRoute } from 'vue-router';
import { SourceTypeEnum } from '@/enums/common';
import { MsgSuccess } from '@/utils/message';
import { ComplexPermission } from '@/utils/permission/type';
import { RoleConst, PermissionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import permissionMap from '@/permission';
const route = useRoute();
const { params: { id, folderId }, } = route;
const permissionObj = ref({
    APPLICATION: permissionMap['application']['workspace'].application_chat_user_edit(id),
    KNOWLEDGE: permissionMap['knowledge']['workspace'].chat_user_edit(id),
    RESOURCE_APPLICATION: hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_APPLICATION_CHAT_USER_EDIT], 'OR'),
    RESOURCE_KNOWLEDGE: hasPermission([RoleConst.ADMIN, PermissionConst.RESOURCE_KNOWLEDGE_CHAT_USER_EDIT], 'OR'),
    SHAREDKNOWLEDGE: hasPermission(new ComplexPermission([RoleConst.ADMIN], [PermissionConst.SHARED_KNOWLEDGE_CHAT_USER_EDIT], [], 'OR'), 'OR')
});
const currentPermissionKey = computed(() => {
    if (route.path.includes('resource-management')) {
        if (route.meta?.resourceType === 'KNOWLEDGE') {
            return 'RESOURCE_KNOWLEDGE';
        }
        else if (route.meta?.resourceType === 'APPLICATION') {
            return 'RESOURCE_APPLICATION';
        }
    }
    else if (route.path.includes('shared')) {
        return 'SHAREDKNOWLEDGE';
    }
    else {
        if (route.path.includes('knowledge/'))
            return 'KNOWLEDGE';
        if (route.path.includes('application/'))
            return 'APPLICATION';
    }
    return route.meta?.resourceType;
});
const resource = reactive({
    resource_id: route.params.id,
    resource_type: route.meta.resourceType,
});
const filterText = ref('');
const loading = ref(false);
const list = ref([]);
const filterList = ref([]); // SearchFilterAfterList
const current = ref();
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
async function getUserGroupList() {
    try {
        const res = await loadSharedApi({
            type: 'chatUser',
            isShared: isShared.value,
            systemType: apiType.value,
        }).getUserGroupList(resource, loading);
        list.value = res.data;
        filterList.value = filter(list.value, filterText.value);
    }
    catch (error) {
        console.error(error);
    }
}
onMounted(async () => {
    await getUserGroupList();
    current.value = list.value[0];
});
function filter(list, filterText) {
    if (!filterText.length) {
        return list;
    }
    return list.filter((v) => v.name.toLowerCase().includes(filterText.toLowerCase()));
}
watch(filterText, (val) => {
    filterList.value = filter(list.value, val);
});
const checkedMap = reactive({}); // Selected in 
function clickUserGroup(item) {
    // Clear cross-group selectionCache
    for (const key in checkedMap)
        delete checkedMap[key];
    current.value = item;
}
async function changeAuth() {
    const params = [{ user_group_id: current.value?.id, is_auth: !current.value?.is_auth }];
    try {
        await loadSharedApi({
            type: 'chatUser',
            systemType: apiType.value,
        }).editUserGroupList(resource, params, loading);
        await getUserGroupList();
        current.value = {
            name: current.value?.name,
            id: current.value?.id,
            is_auth: !current.value?.is_auth,
        };
        getList();
    }
    catch (error) {
        console.error(error);
    }
}
const rightLoading = ref(false);
const searchType = ref('username');
const searchForm = ref({
    username: '',
    nick_name: '',
    source: '',
});
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const tableData = ref([]);
const isShared = computed(() => {
    return folderId === 'share';
});
async function getList() {
    if (!current.value?.id)
        return;
    const params = {};
    const searchValue = searchForm.value[searchType.value];
    if (searchValue !== undefined && searchValue !== null && searchValue !== '') {
        params[searchType.value] = searchValue;
    }
    try {
        const res = await loadSharedApi({
            type: 'chatUser',
            isShared: isShared.value,
            systemType: apiType.value,
        }).getUserGroupUserList(resource, current.value?.id, paginationConfig, params, rightLoading);
        // UpdateCacheAnd echoState
        res.data.records.forEach((item) => {
            if (checkedMap[item.id] === undefined) {
                checkedMap[item.id] = item.is_auth;
            }
            item.is_auth = checkedMap[item.id];
        });
        tableData.value = res.data.records;
        paginationConfig.total = res.data.total;
    }
    catch (error) {
        console.error(error);
    }
}
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getList();
}
watch(() => current.value?.id, () => {
    paginationConfig.current_page = 1;
    getList();
});
const allChecked = computed(() => tableData.value.length > 0 && tableData.value.every((item) => checkedMap[item.id]));
const allIndeterminate = computed(() => !allChecked.value && tableData.value.some((item) => checkedMap[item.id]));
const handleCheckAll = (checked) => {
    tableData.value.forEach((item) => {
        item.is_auth = checked;
        checkedMap[item.id] = checked;
    });
};
const handleRowChange = (value, row) => {
    row.is_auth = value;
    checkedMap[row.id] = value;
};
async function handleSave() {
    try {
        const params = Object.entries(checkedMap).map(([id, is_auth]) => ({
            chat_user_id: id,
            is_auth,
        }));
        await loadSharedApi({
            type: 'chatUser',
            systemType: apiType.value,
        }).putUserGroupUser(resource, current.value?.id, params, rightLoading);
        MsgSuccess(t('common.saveSuccess'));
    }
    catch (error) {
        console.error(error);
    }
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "group p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
(__VLS_ctx.$t('views.chatUser.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-secondary" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
(__VLS_ctx.resource.resource_type === __VLS_ctx.SourceTypeEnum.APPLICATION
    ? __VLS_ctx.$t('views.chatUser.applicationTitleTip')
    : __VLS_ctx.$t('views.chatUser.knowledgeTitleTip'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-left border-r" },
});
/** @type {__VLS_StyleScopedClasses['user-left']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "medium mb-12" },
});
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
(__VLS_ctx.$t('views.chatUser.group.title'));
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}));
const __VLS_8 = __VLS_7({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "list-height-left" },
});
/** @type {__VLS_StyleScopedClasses['list-height-left']} */ ;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({}));
const __VLS_13 = __VLS_12({}, ...__VLS_functionalComponentArgsRest(__VLS_12));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_16 } = __VLS_14.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16" },
});
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.filterList),
    defaultActive: (__VLS_ctx.current?.id),
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    data: (__VLS_ctx.filterList),
    defaultActive: (__VLS_ctx.current?.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = {
    /** @type {typeof __VLS_22.click} */
    onClick: (__VLS_ctx.clickUserGroup),
};
const { default: __VLS_24 } = __VLS_20.slots;
{
    const { default: __VLS_25 } = __VLS_20.slots;
    const [{ row }] = __VLS_vSlot(__VLS_25);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (row.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (row.name);
    // @ts-ignore
    [$t, $t, $t, $t, $t, resource, SourceTypeEnum, filterText, vLoading, loading, filterList, current, clickUserGroup,];
}
{
    const { empty: __VLS_26 } = __VLS_20.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_20;
var __VLS_21;
// @ts-ignore
[];
var __VLS_14;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-right" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.rightLoading) }, null, null);
/** @type {__VLS_StyleScopedClasses['user-right']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "medium ellipsis" },
    title: (__VLS_ctx.current?.name),
});
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.current?.name || '-');
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    direction: "vertical",
    ...{ class: "mr-8 ml-8" },
}));
const __VLS_29 = __VLS_28({
    direction: "vertical",
    ...{ class: "mr-8 ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ class: "color-input-placeholder" },
}));
const __VLS_34 = __VLS_33({
    ...{ class: "color-input-placeholder" },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.UserFilled} */
UserFilled;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({}));
const __VLS_40 = __VLS_39({}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[vLoading, current, current, rightLoading,];
var __VLS_35;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-input-placeholder ml-4" },
});
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.paginationConfig.total);
if (__VLS_ctx.route.path.includes('share/')
    ? false
    : __VLS_ctx.permissionObj[__VLS_ctx.currentPermissionKey]) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "color-secondary mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.chatUser.autoAuthorization'));
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        size: "small",
        modelValue: (__VLS_ctx.current?.is_auth),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        size: "small",
        modelValue: (__VLS_ctx.current?.is_auth),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.click} */
        onClick: (__VLS_ctx.changeAuth),
    };
    var __VLS_46;
    var __VLS_47;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_52 = __VLS_51({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_55 } = __VLS_53.slots;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}));
const __VLS_58 = __VLS_57({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_61;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}));
const __VLS_63 = __VLS_62({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
let __VLS_66;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    value: "source",
}));
const __VLS_68 = __VLS_67({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    value: "source",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
// @ts-ignore
[$t, $t, $t, $t, loading, current, paginationConfig, route, permissionObj, currentPermissionKey, changeAuth, searchType,];
var __VLS_53;
if (__VLS_ctx.searchType === 'username') {
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_73 = __VLS_72({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    let __VLS_76;
    const __VLS_77 = {
        /** @type {typeof __VLS_76.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_74;
    var __VLS_75;
}
else if (__VLS_ctx.searchType === 'nick_name') {
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_80 = __VLS_79({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    let __VLS_83;
    const __VLS_84 = {
        /** @type {typeof __VLS_83.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_81;
    var __VLS_82;
}
else if (__VLS_ctx.searchType === 'source') {
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.source),
        placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.source),
        placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_90;
    const __VLS_91 = {
        /** @type {typeof __VLS_90.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_92 } = __VLS_88.slots;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }));
    const __VLS_95 = __VLS_94({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        label: "CAS",
        value: "CAS",
    }));
    const __VLS_100 = __VLS_99({
        label: "CAS",
        value: "CAS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_103;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        label: "LDAP",
        value: "LDAP",
    }));
    const __VLS_105 = __VLS_104({
        label: "LDAP",
        value: "LDAP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        label: "OIDC",
        value: "OIDC",
    }));
    const __VLS_110 = __VLS_109({
        label: "OIDC",
        value: "OIDC",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        label: "OAuth2",
        value: "OAuth2",
    }));
    const __VLS_115 = __VLS_114({
        label: "OAuth2",
        value: "OAuth2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    let __VLS_118;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }));
    const __VLS_120 = __VLS_119({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    let __VLS_123;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }));
    const __VLS_125 = __VLS_124({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_124));
    let __VLS_128;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }));
    const __VLS_130 = __VLS_129({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }, ...__VLS_functionalComponentArgsRest(__VLS_129));
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, $t, searchType, searchType, searchType, searchForm, searchForm, searchForm, getList, getList, getList,];
    var __VLS_88;
    var __VLS_89;
}
if (__VLS_ctx.route.path.includes('share/')
    ? false
    : __VLS_ctx.permissionObj[__VLS_ctx.currentPermissionKey]) {
    let __VLS_133;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.current?.is_auth),
    }));
    const __VLS_135 = __VLS_134({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.current?.is_auth),
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    let __VLS_138;
    const __VLS_139 = {
        /** @type {typeof __VLS_138.click} */
        onClick: (__VLS_ctx.handleSave),
    };
    const { default: __VLS_140 } = __VLS_136.slots;
    (__VLS_ctx.t('common.save'));
    // @ts-ignore
    [current, route, permissionObj, currentPermissionKey, handleSave, t,];
    var __VLS_136;
    var __VLS_137;
}
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (350),
}));
const __VLS_143 = __VLS_142({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (350),
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
let __VLS_146;
const __VLS_147 = {
    /** @type {typeof __VLS_146.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_148 = {
    /** @type {typeof __VLS_146.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const { default: __VLS_149 } = __VLS_144.slots;
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
}));
const __VLS_152 = __VLS_151({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
let __VLS_155;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
    prop: "username",
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_157 = __VLS_156({
    prop: "username",
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_156));
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    prop: "source",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}));
const __VLS_162 = __VLS_161({
    prop: "source",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
const { default: __VLS_165 } = __VLS_163.slots;
{
    const { default: __VLS_166 } = __VLS_163.slots;
    const [{ row }] = __VLS_vSlot(__VLS_166);
    (row.source === 'LOCAL'
        ? __VLS_ctx.$t('views.userManage.source.local')
        : row.source === 'wecom'
            ? __VLS_ctx.$t('views.userManage.source.wecom')
            : row.source === 'lark'
                ? __VLS_ctx.$t('views.userManage.source.lark')
                : row.source === 'dingtalk'
                    ? __VLS_ctx.$t('views.userManage.source.dingtalk')
                    : row.source === 'OAUTH2' || row.source === 'OAuth2'
                        ? 'OAuth2'
                        : row.source);
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, $t, paginationConfig, getList, tableData, handleSizeChange,];
}
// @ts-ignore
[];
var __VLS_163;
let __VLS_167;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
    width: (140),
    align: "center",
}));
const __VLS_169 = __VLS_168({
    width: (140),
    align: "center",
}, ...__VLS_functionalComponentArgsRest(__VLS_168));
const { default: __VLS_172 } = __VLS_170.slots;
{
    const { header: __VLS_173 } = __VLS_170.slots;
    let __VLS_174;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.allChecked),
        indeterminate: (__VLS_ctx.allIndeterminate),
        disabled: (__VLS_ctx.current?.is_auth),
    }));
    const __VLS_176 = __VLS_175({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.allChecked),
        indeterminate: (__VLS_ctx.allIndeterminate),
        disabled: (__VLS_ctx.current?.is_auth),
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    let __VLS_179;
    const __VLS_180 = {
        /** @type {typeof __VLS_179.change} */
        onChange: (__VLS_ctx.handleCheckAll),
    };
    const { default: __VLS_181 } = __VLS_177.slots;
    (__VLS_ctx.$t('views.chatUser.authorization'));
    // @ts-ignore
    [$t, current, allChecked, allIndeterminate, handleCheckAll,];
    var __VLS_177;
    var __VLS_178;
    // @ts-ignore
    [];
}
{
    const { default: __VLS_182 } = __VLS_170.slots;
    const [{ row }] = __VLS_vSlot(__VLS_182);
    let __VLS_183;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_184 = __VLS_asFunctionalComponent1(__VLS_183, new __VLS_183({
        ...{ 'onChange': {} },
        modelValue: (row.is_auth),
        indeterminate: (row.indeterminate),
        disabled: (__VLS_ctx.current?.is_auth),
    }));
    const __VLS_185 = __VLS_184({
        ...{ 'onChange': {} },
        modelValue: (row.is_auth),
        indeterminate: (row.indeterminate),
        disabled: (__VLS_ctx.current?.is_auth),
    }, ...__VLS_functionalComponentArgsRest(__VLS_184));
    let __VLS_188;
    const __VLS_189 = {
        /** @type {typeof __VLS_188.change} */
        onChange: ((value) => __VLS_ctx.handleRowChange(value, row)),
    };
    var __VLS_186;
    var __VLS_187;
    // @ts-ignore
    [current, handleRowChange,];
}
// @ts-ignore
[];
var __VLS_170;
// @ts-ignore
[];
var __VLS_144;
var __VLS_145;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
