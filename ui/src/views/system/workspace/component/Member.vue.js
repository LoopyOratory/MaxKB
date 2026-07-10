/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, reactive, watch } from 'vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import AddMemberDrawer from './AddMemberDrawer.vue';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
import { i18n_name } from '@/utils/common';
const props = defineProps();
const loading = ref(false);
const searchType = ref('username');
const searchForm = ref({
    username: '',
    nick_name: '',
});
const paginationConfig = reactive({
    current_page: 1,
    page_size: 20,
    total: 0,
});
const tableData = ref([]);
async function getList() {
    if (!props.currentWorkspace?.id)
        return;
    try {
        const params = {
            [searchType.value]: searchForm.value[searchType.value],
        };
        const res = await loadPermissionApi('workspace').getWorkspaceMemberList(props.currentWorkspace?.id, paginationConfig, params, loading);
        tableData.value = res.data.records.map((item) => ({
            ...item,
            nick_name: i18n_name(item.nick_name),
            role_name: i18n_name(item.role_name),
        }));
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
onMounted(() => {
    getList();
});
watch(() => props.currentWorkspace?.id, () => {
    getList();
});
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
    if (column.property === 'nick_name' || column.property === 'username') {
        const sameUserRows = tableData.value.filter((item) => item.user_id === row.user_id);
        if (rowIndex === tableData.value.findIndex((item) => item.user_id === row.user_id)) {
            return {
                rowspan: sameUserRows.length,
                colspan: 1,
            };
        }
        else {
            return {
                rowspan: 0,
                colspan: 0,
            };
        }
    }
};
const addMemberDrawerRef = ref();
function handleAdd() {
    addMemberDrawerRef.value?.open();
}
function handleDelete(row) {
    MsgConfirm(`${t('views.workspace.member.delete.confirmTitle')}${row.nick_name} ?`, '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loading.value = true;
        loadPermissionApi('workspace')
            .deleteWorkspaceMember(props.currentWorkspace?.id, row.user_relation_id, loading)
            .then(() => {
            MsgSuccess(t('common.deleteSuccess'));
            getList();
        });
    })
        .catch(() => { });
}
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.handleAdd),
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [
        __VLS_ctx.PermissionConst.WORKSPACE_ADD_MEMBER,
        __VLS_ctx.PermissionConst.WORKSPACE_WORKSPACE_ADD_MEMBER
            .getWorkspacePermissionWorkspaceManageRole,
    ], [], 'OR')) }, null, null);
const { default: __VLS_7 } = __VLS_3.slots;
(__VLS_ctx.$t('views.role.member.add'));
// @ts-ignore
[handleAdd, vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst, $t,];
var __VLS_3;
var __VLS_4;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_10 = __VLS_9({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}));
const __VLS_16 = __VLS_15({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}));
const __VLS_21 = __VLS_20({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
// @ts-ignore
[$t, $t, searchType,];
var __VLS_11;
if (__VLS_ctx.searchType === 'username') {
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_26 = __VLS_25({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    let __VLS_29;
    const __VLS_30 = {
        /** @type {typeof __VLS_29.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_27;
    var __VLS_28;
}
else if (__VLS_ctx.searchType === 'nick_name') {
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = {
        /** @type {typeof __VLS_36.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_34;
    var __VLS_35;
}
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    ...{ class: "member-table" },
    spanMethod: (__VLS_ctx.objectSpanMethod),
    maxTableHeight: (320),
}));
const __VLS_40 = __VLS_39({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    ...{ class: "member-table" },
    spanMethod: (__VLS_ctx.objectSpanMethod),
    maxTableHeight: (320),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    /** @type {typeof __VLS_43.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_45 = {
    /** @type {typeof __VLS_43.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['member-table']} */ ;
const { default: __VLS_46 } = __VLS_41.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
}));
const __VLS_49 = __VLS_48({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    prop: "username",
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_54 = __VLS_53({
    prop: "username",
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
let __VLS_57;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    prop: "role_name",
    label: (__VLS_ctx.$t('views.role.member.role')),
}));
const __VLS_59 = __VLS_58({
    prop: "role_name",
    label: (__VLS_ctx.$t('views.role.member.role')),
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: (__VLS_ctx.$t('common.operation')),
    width: "100",
    fixed: "right",
}));
const __VLS_64 = __VLS_63({
    label: (__VLS_ctx.$t('common.operation')),
    width: "100",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
{
    const { default: __VLS_68 } = __VLS_65.slots;
    const [{ row }] = __VLS_vSlot(__VLS_68);
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        effect: "dark",
        content: (`${__VLS_ctx.$t('views.role.member.delete.button')}`),
        placement: "top",
    }));
    const __VLS_71 = __VLS_70({
        effect: "dark",
        content: (`${__VLS_ctx.$t('views.role.member.delete.button')}`),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const { default: __VLS_74 } = __VLS_72.slots;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_77 = __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    let __VLS_80;
    const __VLS_81 = {
        /** @type {typeof __VLS_80.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.handleDelete(row);
            // @ts-ignore
            [$t, $t, $t, $t, $t, $t, $t, searchType, searchType, searchForm, searchForm, getList, getList, getList, tableData, paginationConfig, objectSpanMethod, handleSizeChange, vLoading, loading, handleDelete,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE.getWorkspaceRole], [
            __VLS_ctx.PermissionConst.WORKSPACE_REMOVE_MEMBER,
            __VLS_ctx.PermissionConst.WORKSPACE_WORKSPACE_REMOVE_MEMBER
                .getWorkspacePermissionWorkspaceManageRole,
        ], [], 'OR')) }, null, null);
    const { default: __VLS_82 } = __VLS_78.slots;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        iconName: "app-delete-users",
    }));
    const __VLS_85 = __VLS_84({
        iconName: "app-delete-users",
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    // @ts-ignore
    [vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst,];
    var __VLS_78;
    var __VLS_79;
    // @ts-ignore
    [];
    var __VLS_72;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_65;
// @ts-ignore
[];
var __VLS_41;
var __VLS_42;
const __VLS_88 = AddMemberDrawer;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    ...{ 'onRefresh': {} },
    ref: "addMemberDrawerRef",
    currentWorkspace: (props.currentWorkspace),
}));
const __VLS_90 = __VLS_89({
    ...{ 'onRefresh': {} },
    ref: "addMemberDrawerRef",
    currentWorkspace: (props.currentWorkspace),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
let __VLS_93;
const __VLS_94 = {
    /** @type {typeof __VLS_93.refresh} */
    onRefresh: (__VLS_ctx.getList),
};
var __VLS_95;
var __VLS_91;
var __VLS_92;
// @ts-ignore
var __VLS_96 = __VLS_95;
// @ts-ignore
[getList,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
