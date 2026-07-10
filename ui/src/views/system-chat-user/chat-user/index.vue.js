/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive } from 'vue';
import UserDrawer from './component/UserDrawer.vue';
import UserPwdDialog from './component/UserPwdDialog.vue';
import SetUserGroupsDialog from './component/SetUserGroupsDialog.vue';
import SyncUsersDialog from './component/SyncUsersDialog.vue';
import { datetimeFormat } from '@/utils/time';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
import { hasPermission } from '@/utils/permission';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
const search_type = ref('username');
const search_form = ref({
    username: '',
    nick_name: '',
    source: '',
    is_active: null,
});
const search_type_change = () => {
    search_form.value = { username: '', nick_name: '', source: '', is_active: null };
};
const loading = ref(false);
const multipleSelection = ref([]);
function handleSelectionChange(val) {
    multipleSelection.value = val;
}
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const userTableData = ref([]);
function getList() {
    const params = {};
    const searchValue = search_form.value[search_type.value];
    if (searchValue !== undefined && searchValue !== null && searchValue !== '') {
        params[search_type.value] = searchValue;
    }
    return loadPermissionApi('chatUser')
        .getUserManage(paginationConfig, params, loading)
        .then((res) => {
        userTableData.value = res.data.records;
        paginationConfig.total = res.data.total;
    });
}
const orderBy = ref('');
function handleSortChange({ prop, order }) {
    orderBy.value = order === 'ascending' ? prop : `-${prop}`;
    getList();
}
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getList();
}
async function changeState(row) {
    const obj = {
        ...row,
        is_active: !row.is_active,
    };
    const str = obj.is_active ? t('common.status.enableSuccess') : t('common.status.disableSuccess');
    await loadPermissionApi('chatUser')
        .putUserManage(row.id, obj, loading)
        .then(() => {
        getList();
        MsgSuccess(str);
        return true;
    })
        .catch(() => {
        return false;
    });
}
const title = ref('');
const UserDrawerRef = ref();
function editUser(row) {
    title.value = t('views.userManage.editUser');
    UserDrawerRef.value.open(row);
}
function createUser() {
    title.value = t('views.userManage.createUser');
    UserDrawerRef.value.open();
}
function deleteUserManage(row) {
    MsgConfirm(`${t('views.userManage.delete.confirmTitle')}${row.nick_name} ?`, '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loading.value = true;
        loadPermissionApi('chatUser')
            .delUserManage(row.id, loading)
            .then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getList();
        });
    })
        .catch(() => { });
}
const UserPwdDialogRef = ref();
function editPwdUser(row) {
    UserPwdDialogRef.value.open(row);
}
function refresh() {
    getList();
}
onMounted(() => {
    getChatGroupList();
    getList();
});
const optionLoading = ref(false);
const chatGroupList = ref([]);
async function getChatGroupList() {
    try {
        const res = await loadPermissionApi('userGroup').getUserGroup(optionLoading);
        chatGroupList.value = res.data;
    }
    catch (e) {
        console.error(e);
    }
}
function handleBatchDelete() {
    MsgConfirm(t('views.chatUser.batchDeleteUser', { count: multipleSelection.value.length }), '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadPermissionApi('chatUser')
            .batchDelete(multipleSelection.value.map((item) => item.id), loading)
            .then(async () => {
            MsgSuccess(t('common.deleteSuccess'));
            await getList();
        });
    })
        .catch(() => { });
}
const setUserGroupsRef = ref();
function setUserGroups() {
    setUserGroupsRef.value?.open(multipleSelection.value.map((item) => item.id));
}
const syncUsersDialogRef = ref();
function syncUsers() {
    syncUsersDialogRef.value?.open();
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-user p-24" },
});
/** @type {__VLS_StyleScopedClasses['chat-user']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb'] | typeof __VLS_components.elBreadcrumb | typeof __VLS_components.ElBreadcrumb | typeof __VLS_components['el-breadcrumb']} */
elBreadcrumb;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}));
const __VLS_2 = __VLS_1({
    separatorIcon: "ArrowRight",
    ...{ class: "mb-16" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item'] | typeof __VLS_components.elBreadcrumbItem | typeof __VLS_components.ElBreadcrumbItem | typeof __VLS_components['el-breadcrumb-item']} */
elBreadcrumbItem;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({}));
const __VLS_8 = __VLS_7({}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
(__VLS_ctx.t('views.chatUser.title'));
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
(__VLS_ctx.t('views.chatUser.title'));
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
    ...{ style: {} },
}));
const __VLS_20 = __VLS_19({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_26 = __VLS_25({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_29;
const __VLS_30 = {
    /** @type {typeof __VLS_29.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.createUser();
        // @ts-ignore
        [createUser,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_CREATE, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_CREATE], [], 'OR')) }, null, null);
const { default: __VLS_31 } = __VLS_27.slots;
(__VLS_ctx.t('views.userManage.createUser'));
// @ts-ignore
[t, vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst,];
var __VLS_27;
var __VLS_28;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_37;
const __VLS_38 = {
    /** @type {typeof __VLS_37.click} */
    onClick: (__VLS_ctx.syncUsers),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.CHAT_USER_SYNC], [], 'OR')) }, null, null);
const { default: __VLS_39 } = __VLS_35.slots;
(__VLS_ctx.$t('views.chatUser.syncUsers'));
// @ts-ignore
[vHasPermission, ComplexPermission, RoleConst, PermissionConst, syncUsers, $t,];
var __VLS_35;
var __VLS_36;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_42 = __VLS_41({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
let __VLS_45;
const __VLS_46 = {
    /** @type {typeof __VLS_45.click} */
    onClick: (__VLS_ctx.setUserGroups),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_GROUP, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_GROUP], [], 'OR')) }, null, null);
const { default: __VLS_47 } = __VLS_43.slots;
(__VLS_ctx.$t('views.chatUser.setUserGroups'));
// @ts-ignore
[vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst, $t, multipleSelection, setUserGroups,];
var __VLS_43;
var __VLS_44;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
const __VLS_54 = {
    /** @type {typeof __VLS_53.click} */
    onClick: (__VLS_ctx.handleBatchDelete),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_DELETE, __VLS_ctx.PermissionConst.CHAT_USER_DELETE], [], 'OR')) }, null, null);
const { default: __VLS_55 } = __VLS_51.slots;
(__VLS_ctx.$t('common.delete'));
// @ts-ignore
[vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst, $t, multipleSelection, handleBatchDelete,];
var __VLS_51;
var __VLS_52;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_56;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}));
const __VLS_58 = __VLS_57({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
let __VLS_61;
const __VLS_62 = {
    /** @type {typeof __VLS_61.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_63 } = __VLS_59.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}));
const __VLS_66 = __VLS_65({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_69;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}));
const __VLS_71 = __VLS_70({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
let __VLS_74;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "is_active",
}));
const __VLS_76 = __VLS_75({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "is_active",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    value: "source",
}));
const __VLS_81 = __VLS_80({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    value: "source",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
// @ts-ignore
[$t, $t, $t, $t, search_type, search_type_change,];
var __VLS_59;
var __VLS_60;
if (__VLS_ctx.search_type === 'username') {
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.username),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.username),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_89;
    const __VLS_90 = {
        /** @type {typeof __VLS_89.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_87;
    var __VLS_88;
}
if (__VLS_ctx.search_type === 'nick_name') {
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.nick_name),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_93 = __VLS_92({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.nick_name),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    let __VLS_96;
    const __VLS_97 = {
        /** @type {typeof __VLS_96.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_94;
    var __VLS_95;
}
else if (__VLS_ctx.search_type === 'is_active') {
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.is_active),
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_100 = __VLS_99({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.is_active),
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    let __VLS_103;
    const __VLS_104 = {
        /** @type {typeof __VLS_103.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_105 } = __VLS_101.slots;
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        label: (__VLS_ctx.$t('common.status.enabled')),
        value: (true),
    }));
    const __VLS_108 = __VLS_107({
        label: (__VLS_ctx.$t('common.status.enabled')),
        value: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    let __VLS_111;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
        label: (__VLS_ctx.$t('common.status.disabled')),
        value: (false),
    }));
    const __VLS_113 = __VLS_112({
        label: (__VLS_ctx.$t('common.status.disabled')),
        value: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_112));
    // @ts-ignore
    [$t, $t, search_type, search_type, search_type, search_form, search_form, search_form, getList, getList, getList,];
    var __VLS_101;
    var __VLS_102;
}
else if (__VLS_ctx.search_type === 'source') {
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.source),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_118 = __VLS_117({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.source),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    let __VLS_121;
    const __VLS_122 = {
        /** @type {typeof __VLS_121.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_123 } = __VLS_119.slots;
    let __VLS_124;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }));
    const __VLS_126 = __VLS_125({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_125));
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        label: "CAS",
        value: "CAS",
    }));
    const __VLS_131 = __VLS_130({
        label: "CAS",
        value: "CAS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    let __VLS_134;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
        label: "LDAP",
        value: "LDAP",
    }));
    const __VLS_136 = __VLS_135({
        label: "LDAP",
        value: "LDAP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    let __VLS_139;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
        label: "OIDC",
        value: "OIDC",
    }));
    const __VLS_141 = __VLS_140({
        label: "OIDC",
        value: "OIDC",
    }, ...__VLS_functionalComponentArgsRest(__VLS_140));
    let __VLS_144;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
        label: "OAuth2",
        value: "OAuth2",
    }));
    const __VLS_146 = __VLS_145({
        label: "OAuth2",
        value: "OAuth2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    let __VLS_149;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }));
    const __VLS_151 = __VLS_150({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    let __VLS_154;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }));
    const __VLS_156 = __VLS_155({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
    let __VLS_159;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }));
    const __VLS_161 = __VLS_160({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }, ...__VLS_functionalComponentArgsRest(__VLS_160));
    // @ts-ignore
    [$t, $t, $t, $t, $t, search_type, search_form, getList,];
    var __VLS_119;
    var __VLS_120;
}
let __VLS_164;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_165 = __VLS_asFunctionalComponent1(__VLS_164, new __VLS_164({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.userTableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (270),
}));
const __VLS_166 = __VLS_165({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ...{ 'onSortChange': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.userTableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (270),
}, ...__VLS_functionalComponentArgsRest(__VLS_165));
let __VLS_169;
const __VLS_170 = {
    /** @type {typeof __VLS_169.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_171 = {
    /** @type {typeof __VLS_169.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_172 = {
    /** @type {typeof __VLS_169.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
const __VLS_173 = {
    /** @type {typeof __VLS_169.sortChange} */
    onSortChange: (__VLS_ctx.handleSortChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_174 } = __VLS_167.slots;
let __VLS_175;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    type: "selection",
    width: "55",
}));
const __VLS_177 = __VLS_176({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
let __VLS_180;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_182 = __VLS_181({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_181));
let __VLS_185;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
    prop: "username",
    label: (__VLS_ctx.$t('common.username')),
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_187 = __VLS_186({
    prop: "username",
    label: (__VLS_ctx.$t('common.username')),
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
let __VLS_190;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
    prop: "is_active",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}));
const __VLS_192 = __VLS_191({
    prop: "is_active",
    label: (__VLS_ctx.$t('common.status.label')),
    width: "100",
}, ...__VLS_functionalComponentArgsRest(__VLS_191));
const { default: __VLS_195 } = __VLS_193.slots;
{
    const { default: __VLS_196 } = __VLS_193.slots;
    const [{ row }] = __VLS_vSlot(__VLS_196);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_197;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_199 = __VLS_198({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_198));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_202 } = __VLS_200.slots;
        let __VLS_203;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_204 = __VLS_asFunctionalComponent1(__VLS_203, new __VLS_203({}));
        const __VLS_205 = __VLS_204({}, ...__VLS_functionalComponentArgsRest(__VLS_204));
        // @ts-ignore
        [$t, $t, $t, getList, userTableData, paginationConfig, handleSizeChange, handleSelectionChange, handleSortChange, vLoading, loading,];
        var __VLS_200;
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
        let __VLS_208;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent1(__VLS_208, new __VLS_208({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_210 = __VLS_209({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
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
var __VLS_193;
let __VLS_213;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
    prop: "email",
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    showOverflowTooltip: true,
    minWidth: "180",
}));
const __VLS_215 = __VLS_214({
    prop: "email",
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    showOverflowTooltip: true,
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
const { default: __VLS_218 } = __VLS_216.slots;
{
    const { default: __VLS_219 } = __VLS_216.slots;
    const [{ row }] = __VLS_vSlot(__VLS_219);
    (row.email || '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_216;
let __VLS_220;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
    prop: "phone",
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
    width: "120",
}));
const __VLS_222 = __VLS_221({
    prop: "phone",
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
    width: "120",
}, ...__VLS_functionalComponentArgsRest(__VLS_221));
const { default: __VLS_225 } = __VLS_223.slots;
{
    const { default: __VLS_226 } = __VLS_223.slots;
    const [{ row }] = __VLS_vSlot(__VLS_226);
    (row.phone || '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_223;
let __VLS_227;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
    prop: "user_group_names",
    label: (__VLS_ctx.$t('views.chatUser.group.title')),
    minWidth: "150",
}));
const __VLS_229 = __VLS_228({
    prop: "user_group_names",
    label: (__VLS_ctx.$t('views.chatUser.group.title')),
    minWidth: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_228));
const { default: __VLS_232 } = __VLS_230.slots;
{
    const { default: __VLS_233 } = __VLS_230.slots;
    const [{ row }] = __VLS_vSlot(__VLS_233);
    let __VLS_234;
    /** @ts-ignore @type { | typeof __VLS_components.TagGroup} */
    TagGroup;
    // @ts-ignore
    const __VLS_235 = __VLS_asFunctionalComponent1(__VLS_234, new __VLS_234({
        tags: (row.user_group_names),
    }));
    const __VLS_236 = __VLS_235({
        tags: (row.user_group_names),
    }, ...__VLS_functionalComponentArgsRest(__VLS_235));
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_230;
let __VLS_239;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_240 = __VLS_asFunctionalComponent1(__VLS_239, new __VLS_239({
    prop: "source",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}));
const __VLS_241 = __VLS_240({
    prop: "source",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_240));
const { default: __VLS_244 } = __VLS_242.slots;
{
    const { default: __VLS_245 } = __VLS_242.slots;
    const [{ row }] = __VLS_vSlot(__VLS_245);
    (row.source === 'LOCAL'
        ? __VLS_ctx.$t('views.userManage.source.localCreate')
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
    [$t, $t, $t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_242;
let __VLS_246;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_247 = __VLS_asFunctionalComponent1(__VLS_246, new __VLS_246({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}));
const __VLS_248 = __VLS_247({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_247));
const { default: __VLS_251 } = __VLS_249.slots;
{
    const { default: __VLS_252 } = __VLS_249.slots;
    const [{ row }] = __VLS_vSlot(__VLS_252);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_249;
let __VLS_253;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_254 = __VLS_asFunctionalComponent1(__VLS_253, new __VLS_253({
    label: (__VLS_ctx.$t('common.operation')),
    width: "160",
    align: "left",
    fixed: "right",
}));
const __VLS_255 = __VLS_254({
    label: (__VLS_ctx.$t('common.operation')),
    width: "160",
    align: "left",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_254));
const { default: __VLS_258 } = __VLS_256.slots;
{
    const { default: __VLS_259 } = __VLS_256.slots;
    const [{ row }] = __VLS_vSlot(__VLS_259);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: () => { } },
    });
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_EDIT, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_EDIT], [], 'OR'), 'OR')) {
        let __VLS_260;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
            size: "small",
            modelValue: (row.is_active),
            beforeChange: (() => __VLS_ctx.changeState(row)),
        }));
        const __VLS_262 = __VLS_261({
            size: "small",
            modelValue: (row.is_active),
            beforeChange: (() => __VLS_ctx.changeState(row)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
    }
    let __VLS_265;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
        direction: "vertical",
    }));
    const __VLS_267 = __VLS_266({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_EDIT, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_EDIT], [], 'OR'), 'OR')) {
        let __VLS_270;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_272 = __VLS_271({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_271));
        let __VLS_275;
        const __VLS_276 = {
            /** @type {typeof __VLS_275.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_EDIT, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_EDIT], [], 'OR'), 'OR')))
                    throw 0;
                return __VLS_ctx.editUser(row);
                // @ts-ignore
                [ComplexPermission, ComplexPermission, RoleConst, RoleConst, RoleConst, RoleConst, PermissionConst, PermissionConst, PermissionConst, PermissionConst, $t, $t, hasPermission, hasPermission, changeState, editUser,];
            },
        };
        const { default: __VLS_277 } = __VLS_273.slots;
        let __VLS_278;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
            iconName: "app-edit",
        }));
        const __VLS_280 = __VLS_279({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_279));
        // @ts-ignore
        [];
        var __VLS_273;
        var __VLS_274;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_EDIT, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_EDIT], [], 'OR'), 'OR')) {
        let __VLS_283;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
        }));
        const __VLS_285 = __VLS_284({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_284));
        let __VLS_288;
        const __VLS_289 = {
            /** @type {typeof __VLS_288.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [__VLS_ctx.PermissionConst.CHAT_USER_EDIT, __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_EDIT], [], 'OR'), 'OR')))
                    throw 0;
                return __VLS_ctx.editPwdUser(row);
                // @ts-ignore
                [ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst, $t, hasPermission, editPwdUser,];
            },
        };
        const { default: __VLS_290 } = __VLS_286.slots;
        let __VLS_291;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
            iconName: "app-key",
        }));
        const __VLS_293 = __VLS_292({
            iconName: "app-key",
        }, ...__VLS_functionalComponentArgsRest(__VLS_292));
        // @ts-ignore
        [];
        var __VLS_286;
        var __VLS_287;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    if (__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [
        __VLS_ctx.PermissionConst.CHAT_USER_DELETE,
        __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_DELETE,
    ], [], 'OR'), 'OR')) {
        let __VLS_296;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
            ...{ 'onClick': {} },
            disabled: (row.role === 'ADMIN'),
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.delete')),
        }));
        const __VLS_298 = __VLS_297({
            ...{ 'onClick': {} },
            disabled: (row.role === 'ADMIN'),
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.delete')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_297));
        let __VLS_301;
        const __VLS_302 = {
            /** @type {typeof __VLS_301.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission(new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [
                    __VLS_ctx.PermissionConst.CHAT_USER_DELETE,
                    __VLS_ctx.PermissionConst.WORKSPACE_CHAT_USER_DELETE,
                ], [], 'OR'), 'OR')))
                    throw 0;
                return __VLS_ctx.deleteUserManage(row);
                // @ts-ignore
                [ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst, $t, hasPermission, deleteUserManage,];
            },
        };
        const { default: __VLS_303 } = __VLS_299.slots;
        let __VLS_304;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
            iconName: "app-delete",
        }));
        const __VLS_306 = __VLS_305({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_305));
        // @ts-ignore
        [];
        var __VLS_299;
        var __VLS_300;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_256;
// @ts-ignore
[];
var __VLS_167;
var __VLS_168;
// @ts-ignore
[];
var __VLS_21;
const __VLS_309 = UserDrawer;
// @ts-ignore
const __VLS_310 = __VLS_asFunctionalComponent1(__VLS_309, new __VLS_309({
    ...{ 'onRefresh': {} },
    title: (__VLS_ctx.title),
    optionLoading: (__VLS_ctx.optionLoading),
    chatGroupList: (__VLS_ctx.chatGroupList),
    ref: "UserDrawerRef",
}));
const __VLS_311 = __VLS_310({
    ...{ 'onRefresh': {} },
    title: (__VLS_ctx.title),
    optionLoading: (__VLS_ctx.optionLoading),
    chatGroupList: (__VLS_ctx.chatGroupList),
    ref: "UserDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_310));
let __VLS_314;
const __VLS_315 = {
    /** @type {typeof __VLS_314.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_316;
var __VLS_312;
var __VLS_313;
const __VLS_318 = UserPwdDialog;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
    ...{ 'onRefresh': {} },
    ref: "UserPwdDialogRef",
}));
const __VLS_320 = __VLS_319({
    ...{ 'onRefresh': {} },
    ref: "UserPwdDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
let __VLS_323;
const __VLS_324 = {
    /** @type {typeof __VLS_323.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_325;
var __VLS_321;
var __VLS_322;
const __VLS_327 = SetUserGroupsDialog;
// @ts-ignore
const __VLS_328 = __VLS_asFunctionalComponent1(__VLS_327, new __VLS_327({
    ...{ 'onRefresh': {} },
    optionLoading: (__VLS_ctx.optionLoading),
    chatGroupList: (__VLS_ctx.chatGroupList),
    ref: "setUserGroupsRef",
}));
const __VLS_329 = __VLS_328({
    ...{ 'onRefresh': {} },
    optionLoading: (__VLS_ctx.optionLoading),
    chatGroupList: (__VLS_ctx.chatGroupList),
    ref: "setUserGroupsRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_328));
let __VLS_332;
const __VLS_333 = {
    /** @type {typeof __VLS_332.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_334;
var __VLS_330;
var __VLS_331;
const __VLS_336 = SyncUsersDialog;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
    ...{ 'onRefresh': {} },
    ref: "syncUsersDialogRef",
}));
const __VLS_338 = __VLS_337({
    ...{ 'onRefresh': {} },
    ref: "syncUsersDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
let __VLS_341;
const __VLS_342 = {
    /** @type {typeof __VLS_341.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_343;
var __VLS_339;
var __VLS_340;
// @ts-ignore
var __VLS_317 = __VLS_316, __VLS_326 = __VLS_325, __VLS_335 = __VLS_334, __VLS_344 = __VLS_343;
// @ts-ignore
[title, optionLoading, optionLoading, chatGroupList, chatGroupList, refresh, refresh, refresh, refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
