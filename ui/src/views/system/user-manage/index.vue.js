/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive } from 'vue';
import UserDrawer from './component/UserDrawer.vue';
import UserPwdDialog from './component/UserPwdDialog.vue';
import SetUserRoleDialog from './component/SetUserRoleDialog.vue';
import userManageApi from '@/api/system/user-manage';
import { datetimeFormat } from '@/utils/time';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { i18n_name } from '@/utils/common';
const { user, common } = useStore();
const search_type = ref('username');
const search_form = ref({
    username: '',
    nick_name: '',
    email: '',
    is_active: null,
    source: '',
});
const UserDrawerRef = ref();
const UserPwdDialogRef = ref();
const loading = ref(false);
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const userTableData = ref([]);
const search_type_change = () => {
    search_form.value = { username: '', nick_name: '', email: '', is_active: null };
};
function handleSizeChange() {
    paginationConfig.current_page = 1;
    getList();
}
function getList() {
    const params = {};
    const searchValue = search_form.value[search_type.value];
    if (searchValue !== undefined && searchValue !== null && searchValue !== '') {
        params[search_type.value] = searchValue;
    }
    return userManageApi.getUserManage(paginationConfig, params, loading).then((res) => {
        userTableData.value = res.data.records.map((item) => ({
            ...item,
            nick_name: i18n_name(item.nick_name),
            role_workspace: Object.entries(item.role_workspace ?? {}).map(([role, workspaces]) => ({
                role: i18n_name(role),
                workspace: workspaces?.[0] === 'None'
                    ? '-'
                    : workspaces?.map((ws) => i18n_name(ws)).join(', '),
            })),
        }));
        paginationConfig.total = res.data.total;
    });
}
async function changeState(row) {
    const obj = {
        is_active: !row.is_active,
    };
    const str = obj.is_active ? t('common.status.enableSuccess') : t('common.status.disableSuccess');
    await userManageApi
        .putUserManage(row.id, obj, loading)
        .then((res) => {
        getList();
        MsgSuccess(str);
        return true;
    })
        .catch(() => {
        return false;
    });
}
const title = ref('');
function editUser(row) {
    title.value = t('views.userManage.editUser');
    UserDrawerRef.value.open(row);
}
function createUser() {
    title.value = t('views.userManage.createUser');
    UserDrawerRef.value.open();
}
function deleteUserManage(row) {
    MsgConfirm(`${t('views.userManage.delete.confirmTitle')}${row.nick_name} ?`, t('views.userManage.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loading.value = true;
        userManageApi.delUserManage(row.id, loading).then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getList();
        });
    })
        .catch(() => { });
}
function editPwdUser(row) {
    UserPwdDialogRef.value.open(row);
}
function refresh() {
    getList();
}
const multipleSelection = ref([]);
function handleSelectionChange(val) {
    multipleSelection.value = val;
}
function handleBatchDelete() {
    MsgConfirm(t('views.chatUser.batchDeleteUser', { count: multipleSelection.value.length }), '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        userManageApi
            .batchDelete(multipleSelection.value.map((item) => item.id), loading)
            .then(async () => {
            MsgSuccess(t('common.deleteSuccess'));
            await getList();
        });
    })
        .catch(() => { });
}
const setUserRoleRef = ref();
function setUserRoles() {
    setUserRoleRef.value?.open(multipleSelection.value.map((item) => item.id));
}
onMounted(() => {
    getList();
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.userManage.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "main-calc-height" },
}));
const __VLS_2 = __VLS_1({
    ...{ class: "main-calc-height" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_8 = __VLS_7({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.click} */
    onClick: (__VLS_ctx.createUser),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_CREATE]) }, null, null);
const { default: __VLS_13 } = __VLS_9.slots;
(__VLS_ctx.$t('views.userManage.createUser'));
// @ts-ignore
[$t, $t, createUser, vHasPermission, RoleConst, PermissionConst,];
var __VLS_9;
var __VLS_10;
if (__VLS_ctx.user.isPE() || __VLS_ctx.user.isEE()) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }));
    const __VLS_16 = __VLS_15({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.multipleSelection.length === 0),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    let __VLS_19;
    const __VLS_20 = {
        /** @type {typeof __VLS_19.click} */
        onClick: (__VLS_ctx.setUserRoles),
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_EDIT]) }, null, null);
    const { default: __VLS_21 } = __VLS_17.slots;
    (__VLS_ctx.$t('views.userManage.settingRole'));
    // @ts-ignore
    [$t, vHasPermission, RoleConst, PermissionConst, user, user, multipleSelection, setUserRoles,];
    var __VLS_17;
    var __VLS_18;
}
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_24 = __VLS_23({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_27;
const __VLS_28 = {
    /** @type {typeof __VLS_27.click} */
    onClick: (__VLS_ctx.handleBatchDelete),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_DELETE]) }, null, null);
const { default: __VLS_29 } = __VLS_25.slots;
(__VLS_ctx.$t('common.delete'));
// @ts-ignore
[$t, vHasPermission, RoleConst, PermissionConst, multipleSelection, handleBatchDelete,];
var __VLS_25;
var __VLS_26;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}));
const __VLS_32 = __VLS_31({
    ...{ 'onChange': {} },
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.search_type),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.change} */
    onChange: (__VLS_ctx.search_type_change),
};
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_37 } = __VLS_33.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}));
const __VLS_40 = __VLS_39({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}));
const __VLS_45 = __VLS_44({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    value: "email",
}));
const __VLS_50 = __VLS_49({
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    value: "email",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "is_active",
}));
const __VLS_55 = __VLS_54({
    label: (__VLS_ctx.$t('common.status.label')),
    value: "is_active",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
if (__VLS_ctx.user.isEE() || __VLS_ctx.user.isPE()) {
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        label: (__VLS_ctx.$t('views.userManage.source.label')),
        value: "source",
    }));
    const __VLS_60 = __VLS_59({
        label: (__VLS_ctx.$t('views.userManage.source.label')),
        value: "source",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
}
// @ts-ignore
[$t, $t, $t, $t, $t, user, user, search_type, search_type_change,];
var __VLS_33;
var __VLS_34;
if (__VLS_ctx.search_type === 'username') {
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.username),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.username),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        /** @type {typeof __VLS_68.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_66;
    var __VLS_67;
}
else if (__VLS_ctx.search_type === 'nick_name') {
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.nick_name),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_72 = __VLS_71({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.nick_name),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    let __VLS_75;
    const __VLS_76 = {
        /** @type {typeof __VLS_75.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_73;
    var __VLS_74;
}
else if (__VLS_ctx.search_type === 'email') {
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.email),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_79 = __VLS_78({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.email),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    let __VLS_82;
    const __VLS_83 = {
        /** @type {typeof __VLS_82.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_80;
    var __VLS_81;
}
else if (__VLS_ctx.search_type === 'is_active') {
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.is_active),
        clearable: true,
        ...{ style: {} },
    }));
    const __VLS_86 = __VLS_85({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.is_active),
        clearable: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    let __VLS_89;
    const __VLS_90 = {
        /** @type {typeof __VLS_89.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_91 } = __VLS_87.slots;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        label: (__VLS_ctx.$t('common.status.enabled')),
        value: (true),
    }));
    const __VLS_94 = __VLS_93({
        label: (__VLS_ctx.$t('common.status.enabled')),
        value: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        label: (__VLS_ctx.$t('common.status.disabled')),
        value: (false),
    }));
    const __VLS_99 = __VLS_98({
        label: (__VLS_ctx.$t('common.status.disabled')),
        value: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    // @ts-ignore
    [$t, $t, $t, $t, $t, search_type, search_type, search_type, search_type, search_form, search_form, search_form, search_form, getList, getList, getList, getList,];
    var __VLS_87;
    var __VLS_88;
}
else if (__VLS_ctx.search_type === 'source') {
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.source),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.search_form.source),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        /** @type {typeof __VLS_107.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_109 } = __VLS_105.slots;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }));
    const __VLS_112 = __VLS_111({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        label: "CAS",
        value: "CAS",
    }));
    const __VLS_117 = __VLS_116({
        label: "CAS",
        value: "CAS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    let __VLS_120;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
        label: "LDAP",
        value: "LDAP",
    }));
    const __VLS_122 = __VLS_121({
        label: "LDAP",
        value: "LDAP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_121));
    let __VLS_125;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
        label: "OIDC",
        value: "OIDC",
    }));
    const __VLS_127 = __VLS_126({
        label: "OIDC",
        value: "OIDC",
    }, ...__VLS_functionalComponentArgsRest(__VLS_126));
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        label: "OAuth2",
        value: "OAuth2",
    }));
    const __VLS_132 = __VLS_131({
        label: "OAuth2",
        value: "OAuth2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    let __VLS_135;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }));
    const __VLS_137 = __VLS_136({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_136));
    let __VLS_140;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }));
    const __VLS_142 = __VLS_141({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_141));
    let __VLS_145;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }));
    const __VLS_147 = __VLS_146({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    // @ts-ignore
    [$t, $t, $t, $t, $t, search_type, search_form, getList,];
    var __VLS_105;
    var __VLS_106;
}
let __VLS_150;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.userTableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
}));
const __VLS_152 = __VLS_151({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    ...{ class: "mt-16" },
    data: (__VLS_ctx.userTableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (280),
}, ...__VLS_functionalComponentArgsRest(__VLS_151));
let __VLS_155;
const __VLS_156 = {
    /** @type {typeof __VLS_155.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_157 = {
    /** @type {typeof __VLS_155.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_158 = {
    /** @type {typeof __VLS_155.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
const { default: __VLS_159 } = __VLS_153.slots;
let __VLS_160;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
    type: "selection",
    width: "55",
}));
const __VLS_162 = __VLS_161({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_161));
let __VLS_165;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    minWidth: "180",
    showOverflowTooltip: true,
}));
const __VLS_167 = __VLS_166({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    minWidth: "180",
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
let __VLS_170;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
    prop: "username",
    minWidth: "180",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_172 = __VLS_171({
    prop: "username",
    minWidth: "180",
    showOverflowTooltip: true,
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_171));
let __VLS_175;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    width: "100",
    prop: "is_active",
    label: (__VLS_ctx.$t('common.status.label')),
}));
const __VLS_177 = __VLS_176({
    width: "100",
    prop: "is_active",
    label: (__VLS_ctx.$t('common.status.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
const { default: __VLS_180 } = __VLS_178.slots;
{
    const { default: __VLS_181 } = __VLS_178.slots;
    const [{ row }] = __VLS_vSlot(__VLS_181);
    if (row.is_active) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_182;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }));
        const __VLS_184 = __VLS_183({
            ...{ class: "color-success mr-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_183));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        const { default: __VLS_187 } = __VLS_185.slots;
        let __VLS_188;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({}));
        const __VLS_190 = __VLS_189({}, ...__VLS_functionalComponentArgsRest(__VLS_189));
        // @ts-ignore
        [$t, $t, $t, getList, userTableData, paginationConfig, handleSizeChange, handleSelectionChange, vLoading, loading,];
        var __VLS_185;
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
        let __VLS_193;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }));
        const __VLS_195 = __VLS_194({
            iconName: "app-disabled",
            ...{ class: "color-secondary mr-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_194));
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
var __VLS_178;
let __VLS_198;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_199 = __VLS_asFunctionalComponent1(__VLS_198, new __VLS_198({
    prop: "email",
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    showOverflowTooltip: true,
    minWidth: "180",
}));
const __VLS_200 = __VLS_199({
    prop: "email",
    label: (__VLS_ctx.$t('views.login.loginForm.email.label')),
    showOverflowTooltip: true,
    minWidth: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_199));
const { default: __VLS_203 } = __VLS_201.slots;
{
    const { default: __VLS_204 } = __VLS_201.slots;
    const [{ row }] = __VLS_vSlot(__VLS_204);
    (row.email || '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_201;
let __VLS_205;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
    prop: "phone",
    width: "120",
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
}));
const __VLS_207 = __VLS_206({
    prop: "phone",
    width: "120",
    label: (__VLS_ctx.$t('views.userManage.userForm.phone.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
const { default: __VLS_210 } = __VLS_208.slots;
{
    const { default: __VLS_211 } = __VLS_208.slots;
    const [{ row }] = __VLS_vSlot(__VLS_211);
    (row.phone || '-');
    // @ts-ignore
    [$t,];
}
// @ts-ignore
[];
var __VLS_208;
if (__VLS_ctx.user.isEE() || __VLS_ctx.user.isPE()) {
    let __VLS_212;
    /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
    elTableColumn;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
        prop: "role_name",
        label: (__VLS_ctx.$t('views.role.member.role')),
        width: "210",
    }));
    const __VLS_214 = __VLS_213({
        prop: "role_name",
        label: (__VLS_ctx.$t('views.role.member.role')),
        width: "210",
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    const { default: __VLS_217 } = __VLS_215.slots;
    {
        const { default: __VLS_218 } = __VLS_215.slots;
        const [{ row }] = __VLS_vSlot(__VLS_218);
        let __VLS_219;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_220 = __VLS_asFunctionalComponent1(__VLS_219, new __VLS_219({
            width: (500),
            persistent: (false),
        }));
        const __VLS_221 = __VLS_220({
            width: (500),
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_220));
        const { default: __VLS_224 } = __VLS_222.slots;
        {
            const { reference: __VLS_225 } = __VLS_222.slots;
            let __VLS_226;
            /** @ts-ignore @type { | typeof __VLS_components.TagGroup} */
            TagGroup;
            // @ts-ignore
            const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
                ...{ class: "cursor" },
                tags: (row.role_name),
                tooltipDisabled: true,
            }));
            const __VLS_228 = __VLS_227({
                ...{ class: "cursor" },
                tags: (row.role_name),
                tooltipDisabled: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_227));
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            // @ts-ignore
            [$t, user, user,];
        }
        {
            const { default: __VLS_231 } = __VLS_222.slots;
            let __VLS_232;
            /** @ts-ignore @type { | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table'] | typeof __VLS_components.elTable | typeof __VLS_components.ElTable | typeof __VLS_components['el-table']} */
            elTable;
            // @ts-ignore
            const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
                data: (row.role_workspace),
                maxHeight: (300),
                tooltipOptions: ({
                    popperClass: 'max-w-350',
                }),
            }));
            const __VLS_234 = __VLS_233({
                data: (row.role_workspace),
                maxHeight: (300),
                tooltipOptions: ({
                    popperClass: 'max-w-350',
                }),
            }, ...__VLS_functionalComponentArgsRest(__VLS_233));
            const { default: __VLS_237 } = __VLS_235.slots;
            let __VLS_238;
            /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
            elTableColumn;
            // @ts-ignore
            const __VLS_239 = __VLS_asFunctionalComponent1(__VLS_238, new __VLS_238({
                prop: "role",
                label: (__VLS_ctx.$t('views.role.member.role')),
                width: "200",
                showOverflowTooltip: true,
            }));
            const __VLS_240 = __VLS_239({
                prop: "role",
                label: (__VLS_ctx.$t('views.role.member.role')),
                width: "200",
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_239));
            let __VLS_243;
            /** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
            elTableColumn;
            // @ts-ignore
            const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
                prop: "workspace",
                label: (__VLS_ctx.$t('views.workspace.title')),
                showOverflowTooltip: true,
            }));
            const __VLS_245 = __VLS_244({
                prop: "workspace",
                label: (__VLS_ctx.$t('views.workspace.title')),
                showOverflowTooltip: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_244));
            // @ts-ignore
            [$t, $t,];
            var __VLS_235;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_222;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_215;
}
let __VLS_248;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_249 = __VLS_asFunctionalComponent1(__VLS_248, new __VLS_248({
    prop: "source",
    width: "120",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}));
const __VLS_250 = __VLS_249({
    prop: "source",
    width: "120",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_249));
const { default: __VLS_253 } = __VLS_251.slots;
{
    const { default: __VLS_254 } = __VLS_251.slots;
    const [{ row }] = __VLS_vSlot(__VLS_254);
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
    [$t, $t, $t, $t, $t,];
}
// @ts-ignore
[];
var __VLS_251;
let __VLS_255;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}));
const __VLS_257 = __VLS_256({
    label: (__VLS_ctx.$t('common.createTime')),
    width: "180",
}, ...__VLS_functionalComponentArgsRest(__VLS_256));
const { default: __VLS_260 } = __VLS_258.slots;
{
    const { default: __VLS_261 } = __VLS_258.slots;
    const [{ row }] = __VLS_vSlot(__VLS_261);
    (__VLS_ctx.datetimeFormat(row.create_time));
    // @ts-ignore
    [$t, datetimeFormat,];
}
// @ts-ignore
[];
var __VLS_258;
let __VLS_262;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_263 = __VLS_asFunctionalComponent1(__VLS_262, new __VLS_262({
    label: (__VLS_ctx.$t('common.operation')),
    width: "160",
    align: "left",
    fixed: "right",
}));
const __VLS_264 = __VLS_263({
    label: (__VLS_ctx.$t('common.operation')),
    width: "160",
    align: "left",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_263));
const { default: __VLS_267 } = __VLS_265.slots;
{
    const { default: __VLS_268 } = __VLS_265.slots;
    const [{ row }] = __VLS_vSlot(__VLS_268);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ onClick: () => { } },
    });
    if (__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_EDIT], 'OR')) {
        let __VLS_269;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_270 = __VLS_asFunctionalComponent1(__VLS_269, new __VLS_269({
            disabled: (row.role === 'ADMIN' || row.id === __VLS_ctx.user.userInfo?.id),
            size: "small",
            modelValue: (row.is_active),
            beforeChange: (() => __VLS_ctx.changeState(row)),
        }));
        const __VLS_271 = __VLS_270({
            disabled: (row.role === 'ADMIN' || row.id === __VLS_ctx.user.userInfo?.id),
            size: "small",
            modelValue: (row.is_active),
            beforeChange: (() => __VLS_ctx.changeState(row)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_270));
    }
    let __VLS_274;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
        direction: "vertical",
    }));
    const __VLS_276 = __VLS_275({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_275));
    if (__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_EDIT], 'OR')) {
        let __VLS_279;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }));
        const __VLS_281 = __VLS_280({
            effect: "dark",
            content: (__VLS_ctx.$t('common.edit')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_280));
        const { default: __VLS_284 } = __VLS_282.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_285;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }));
        const __VLS_287 = __VLS_286({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.edit')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_286));
        let __VLS_290;
        const __VLS_291 = {
            /** @type {typeof __VLS_290.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_EDIT], 'OR')))
                    throw 0;
                return __VLS_ctx.editUser(row);
                // @ts-ignore
                [$t, $t, $t, RoleConst, RoleConst, PermissionConst, PermissionConst, user, hasPermission, hasPermission, changeState, editUser,];
            },
        };
        const { default: __VLS_292 } = __VLS_288.slots;
        let __VLS_293;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_294 = __VLS_asFunctionalComponent1(__VLS_293, new __VLS_293({
            iconName: "app-edit",
        }));
        const __VLS_295 = __VLS_294({
            iconName: "app-edit",
        }, ...__VLS_functionalComponentArgsRest(__VLS_294));
        // @ts-ignore
        [];
        var __VLS_288;
        var __VLS_289;
        // @ts-ignore
        [];
        var __VLS_282;
    }
    if (__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_EDIT], 'OR')) {
        let __VLS_298;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
            effect: "dark",
            content: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
            placement: "top",
        }));
        const __VLS_300 = __VLS_299({
            effect: "dark",
            content: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_299));
        const { default: __VLS_303 } = __VLS_301.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        let __VLS_304;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_305 = __VLS_asFunctionalComponent1(__VLS_304, new __VLS_304({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
        }));
        const __VLS_306 = __VLS_305({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_305));
        let __VLS_309;
        const __VLS_310 = {
            /** @type {typeof __VLS_309.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_EDIT], 'OR')))
                    throw 0;
                return __VLS_ctx.editPwdUser(row);
                // @ts-ignore
                [$t, $t, RoleConst, PermissionConst, hasPermission, editPwdUser,];
            },
        };
        const { default: __VLS_311 } = __VLS_307.slots;
        let __VLS_312;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_313 = __VLS_asFunctionalComponent1(__VLS_312, new __VLS_312({
            iconName: "app-key",
        }));
        const __VLS_314 = __VLS_313({
            iconName: "app-key",
        }, ...__VLS_functionalComponentArgsRest(__VLS_313));
        // @ts-ignore
        [];
        var __VLS_307;
        var __VLS_308;
        // @ts-ignore
        [];
        var __VLS_301;
    }
    if (__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_DELETE], 'OR')) {
        let __VLS_317;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }));
        const __VLS_319 = __VLS_318({
            effect: "dark",
            content: (__VLS_ctx.$t('common.delete')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_318));
        const { default: __VLS_322 } = __VLS_320.slots;
        let __VLS_323;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_324 = __VLS_asFunctionalComponent1(__VLS_323, new __VLS_323({
            ...{ 'onClick': {} },
            disabled: (row.role === 'ADMIN' || row.id === __VLS_ctx.user.userInfo?.id),
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.delete')),
        }));
        const __VLS_325 = __VLS_324({
            ...{ 'onClick': {} },
            disabled: (row.role === 'ADMIN' || row.id === __VLS_ctx.user.userInfo?.id),
            type: "primary",
            text: true,
            title: (__VLS_ctx.$t('common.delete')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_324));
        let __VLS_328;
        const __VLS_329 = {
            /** @type {typeof __VLS_328.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.hasPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.USER_DELETE], 'OR')))
                    throw 0;
                return __VLS_ctx.deleteUserManage(row);
                // @ts-ignore
                [$t, $t, RoleConst, PermissionConst, user, hasPermission, deleteUserManage,];
            },
        };
        const { default: __VLS_330 } = __VLS_326.slots;
        let __VLS_331;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
            iconName: "app-delete",
        }));
        const __VLS_333 = __VLS_332({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_332));
        // @ts-ignore
        [];
        var __VLS_326;
        var __VLS_327;
        // @ts-ignore
        [];
        var __VLS_320;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_265;
// @ts-ignore
[];
var __VLS_153;
var __VLS_154;
// @ts-ignore
[];
var __VLS_3;
const __VLS_336 = UserDrawer;
// @ts-ignore
const __VLS_337 = __VLS_asFunctionalComponent1(__VLS_336, new __VLS_336({
    ...{ 'onRefresh': {} },
    title: (__VLS_ctx.title),
    ref: "UserDrawerRef",
}));
const __VLS_338 = __VLS_337({
    ...{ 'onRefresh': {} },
    title: (__VLS_ctx.title),
    ref: "UserDrawerRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_337));
let __VLS_341;
const __VLS_342 = {
    /** @type {typeof __VLS_341.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_343;
var __VLS_339;
var __VLS_340;
const __VLS_345 = UserPwdDialog;
// @ts-ignore
const __VLS_346 = __VLS_asFunctionalComponent1(__VLS_345, new __VLS_345({
    ...{ 'onRefresh': {} },
    ref: "UserPwdDialogRef",
}));
const __VLS_347 = __VLS_346({
    ...{ 'onRefresh': {} },
    ref: "UserPwdDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_346));
let __VLS_350;
const __VLS_351 = {
    /** @type {typeof __VLS_350.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_352;
var __VLS_348;
var __VLS_349;
const __VLS_354 = SetUserRoleDialog;
// @ts-ignore
const __VLS_355 = __VLS_asFunctionalComponent1(__VLS_354, new __VLS_354({
    ...{ 'onRefresh': {} },
    ref: "setUserRoleRef",
}));
const __VLS_356 = __VLS_355({
    ...{ 'onRefresh': {} },
    ref: "setUserRoleRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_355));
let __VLS_359;
const __VLS_360 = {
    /** @type {typeof __VLS_359.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_361;
var __VLS_357;
var __VLS_358;
// @ts-ignore
var __VLS_344 = __VLS_343, __VLS_353 = __VLS_352, __VLS_362 = __VLS_361;
// @ts-ignore
[title, refresh, refresh, refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
