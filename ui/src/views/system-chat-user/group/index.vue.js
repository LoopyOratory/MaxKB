/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, watch, reactive } from 'vue';
import { t } from '@/locales';
import { i18n_name } from '@/utils/common';
import CreateOrUpdateGroupDialog from './component/CreateOrUpdateGroupDialog.vue';
import CreateGroupUserDialog from './component/CreateGroupUserDialog.vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
import { hasPermission } from '@/utils/permission/index';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
const filterText = ref('');
const loading = ref(false);
const list = ref([]);
const filterList = ref([]); // SearchFilterAfterList
const current = ref();
async function getUserGroupList() {
    try {
        const res = await loadPermissionApi('userGroup').getUserGroup(loading);
        list.value = res.data;
        filterList.value = filter(list.value, filterText.value);
    }
    catch (error) {
        console.error(error);
    }
}
const editPermission = () => {
    return hasPermission(new ComplexPermission([RoleConst.ADMIN, RoleConst.WORKSPACE_MANAGE], [PermissionConst.WORKSPACE_USER_GROUP_EDIT, PermissionConst.USER_GROUP_EDIT], [], 'OR'), 'OR');
};
const dlePermission = () => {
    return hasPermission(new ComplexPermission([RoleConst.ADMIN, RoleConst.WORKSPACE_MANAGE], [PermissionConst.WORKSPACE_USER_GROUP_DELETE, PermissionConst.USER_GROUP_DELETE], [], 'OR'), 'OR');
};
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
function clickUserGroup(item) {
    current.value = item;
}
const createOrUpdateGroupDialogRef = ref();
function createOrUpdate(item) {
    createOrUpdateGroupDialogRef.value?.open(item);
}
function deleteGroup(item) {
    MsgConfirm(`${t('views.chatUser.group.delete.confirmTitle')}${item.name} ?`, t('views.chatUser.group.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadPermissionApi('userGroup')
            .delUserGroup(item.id, loading)
            .then(async () => {
            MsgSuccess(t('common.deleteSuccess'));
            await getUserGroupList();
            current.value = item.id === current.value?.id ? list.value[0] : current.value;
        });
    })
        .catch(() => { });
}
async function refresh(group) {
    await getUserGroupList();
    // CreationAfterSelectCreate
    if (group) {
        current.value = group;
    }
    else {
        current.value = list.value.find((item) => item.id === current.value?.id);
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
async function getList() {
    if (!current.value?.id)
        return;
    try {
        const params = {
            [searchType.value]: searchForm.value[searchType.value],
        };
        const res = await loadPermissionApi('userGroup').getUserListByGroup(current.value?.id, paginationConfig, params, rightLoading);
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
    getList();
});
const createGroupUserDialogRef = ref();
function createUser() {
    createGroupUserDialogRef.value?.open(current.value?.id);
}
const multipleSelection = ref([]);
function handleSelectionChange(val) {
    multipleSelection.value = val;
}
function handleDeleteUser(item) {
    MsgConfirm(item
        ? `${t('views.workspace.member.delete.confirmTitle')}${item.nick_name} ?`
        : t('views.chatUser.group.batchDeleteMember', { count: multipleSelection.value.length }), '', {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadPermissionApi('userGroup')
            .postRemoveMember(current.value?.id, {
            group_relation_ids: item
                ? [item.user_group_relation_id]
                : multipleSelection.value.map((item) => item.user_group_relation_id),
        }, loading)
            .then(async () => {
            MsgSuccess(t('common.removeSuccess'));
            await getList();
        });
    })
        .catch(() => { });
}
const mouseId = ref('');
function mouseenter(row) {
    mouseId.value = row.id;
}
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "group p-24" },
});
/** @type {__VLS_StyleScopedClasses['group']} */ ;
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
(__VLS_ctx.t('views.chatUser.group.title'));
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-12" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "medium" },
});
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
(__VLS_ctx.$t('views.chatUser.group.title'));
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    effect: "dark",
    content: (`${__VLS_ctx.$t('common.create')}${__VLS_ctx.$t('views.chatUser.group.title')}`),
    placement: "top",
}));
const __VLS_26 = __VLS_25({
    effect: "dark",
    content: (`${__VLS_ctx.$t('common.create')}${__VLS_ctx.$t('views.chatUser.group.title')}`),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const { default: __VLS_29 } = __VLS_27.slots;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}));
const __VLS_32 = __VLS_31({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_35;
const __VLS_36 = {
    /** @type {typeof __VLS_35.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.createOrUpdate();
        // @ts-ignore
        [$t, $t, $t, createOrUpdate,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [
        __VLS_ctx.PermissionConst.WORKSPACE_USER_GROUP_CREATE,
        __VLS_ctx.PermissionConst.USER_GROUP_CREATE,
    ], [], 'OR')) }, null, null);
const { default: __VLS_37 } = __VLS_33.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    iconName: "app-add-outlined",
}));
const __VLS_40 = __VLS_39({
    iconName: "app-add-outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
// @ts-ignore
[vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst,];
var __VLS_33;
var __VLS_34;
// @ts-ignore
[];
var __VLS_27;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
    filterable: true,
}));
const __VLS_45 = __VLS_44({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
    filterable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "list-height-left" },
});
/** @type {__VLS_StyleScopedClasses['list-height-left']} */ ;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({}));
const __VLS_50 = __VLS_49({}, ...__VLS_functionalComponentArgsRest(__VLS_49));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_53 } = __VLS_51.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8-16" },
});
/** @type {__VLS_StyleScopedClasses['p-8-16']} */ ;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterList),
    defaultActive: (__VLS_ctx.current?.id),
}));
const __VLS_56 = __VLS_55({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterList),
    defaultActive: (__VLS_ctx.current?.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
let __VLS_59;
const __VLS_60 = {
    /** @type {typeof __VLS_59.click} */
    onClick: (__VLS_ctx.clickUserGroup),
};
const __VLS_61 = {
    /** @type {typeof __VLS_59.mouseenter} */
    onMouseenter: (__VLS_ctx.mouseenter),
};
const __VLS_62 = {
    /** @type {typeof __VLS_59.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.mouseId = '';
        // @ts-ignore
        [$t, filterText, vLoading, loading, filterList, current, clickUserGroup, mouseenter, mouseId,];
    },
};
const { default: __VLS_63 } = __VLS_57.slots;
{
    const { default: __VLS_64 } = __VLS_57.slots;
    const [{ row }] = __VLS_vSlot(__VLS_64);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis" },
        title: (row.name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.i18n_name(row.name));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.mouseId === row.id) }, null, null);
    if (__VLS_ctx.editPermission() || __VLS_ctx.dlePermission()) {
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            teleported: (false),
            trigger: "click",
        }));
        const __VLS_67 = __VLS_66({
            teleported: (false),
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        const { default: __VLS_70 } = __VLS_68.slots;
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            text: true,
        }));
        const __VLS_73 = __VLS_72({
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        const { default: __VLS_76 } = __VLS_74.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            iconName: "app-more",
        }));
        const __VLS_79 = __VLS_78({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        // @ts-ignore
        [mouseId, i18n_name, editPermission, dlePermission,];
        var __VLS_74;
        {
            const { dropdown: __VLS_82 } = __VLS_68.slots;
            let __VLS_83;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                ...{ style: {} },
            }));
            const __VLS_85 = __VLS_84({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_84));
            const { default: __VLS_88 } = __VLS_86.slots;
            if (__VLS_ctx.editPermission()) {
                let __VLS_89;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
                    ...{ 'onClick': {} },
                    ...{ class: "p-8" },
                }));
                const __VLS_91 = __VLS_90({
                    ...{ 'onClick': {} },
                    ...{ class: "p-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_90));
                let __VLS_94;
                const __VLS_95 = {
                    /** @type {typeof __VLS_94.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.editPermission() || __VLS_ctx.dlePermission()))
                            throw 0;
                        if (!(__VLS_ctx.editPermission()))
                            throw 0;
                        return __VLS_ctx.createOrUpdate(row);
                        // @ts-ignore
                        [createOrUpdate, editPermission,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
                const { default: __VLS_96 } = __VLS_92.slots;
                let __VLS_97;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_99 = __VLS_98({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_98));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.rename'));
                // @ts-ignore
                [$t,];
                var __VLS_92;
                var __VLS_93;
            }
            if (__VLS_ctx.dlePermission()) {
                let __VLS_102;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
                    ...{ 'onClick': {} },
                    ...{ class: "border-t p-8" },
                }));
                const __VLS_104 = __VLS_103({
                    ...{ 'onClick': {} },
                    ...{ class: "border-t p-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_103));
                let __VLS_107;
                const __VLS_108 = {
                    /** @type {typeof __VLS_107.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.editPermission() || __VLS_ctx.dlePermission()))
                            throw 0;
                        if (!(__VLS_ctx.dlePermission()))
                            throw 0;
                        return __VLS_ctx.deleteGroup(row);
                        // @ts-ignore
                        [dlePermission, deleteGroup,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
                const { default: __VLS_109 } = __VLS_105.slots;
                let __VLS_110;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_112 = __VLS_111({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_111));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_105;
                var __VLS_106;
            }
            // @ts-ignore
            [];
            var __VLS_86;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_68;
    }
    // @ts-ignore
    [];
}
{
    const { empty: __VLS_115 } = __VLS_57.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_57;
var __VLS_58;
// @ts-ignore
[];
var __VLS_51;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "user-right" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.rightLoading) }, null, null);
/** @type {__VLS_StyleScopedClasses['user-right']} */ ;
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
(__VLS_ctx.i18n_name(__VLS_ctx.current?.name));
let __VLS_116;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
    direction: "vertical",
    ...{ class: "mr-8 ml-8" },
}));
const __VLS_118 = __VLS_117({
    direction: "vertical",
    ...{ class: "mr-8 ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_117));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    iconName: "app-workspace",
    ...{ style: {} },
    ...{ class: "color-input-placeholder" },
}));
const __VLS_123 = __VLS_122({
    iconName: "app-workspace",
    ...{ style: {} },
    ...{ class: "color-input-placeholder" },
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-input-placeholder ml-4" },
});
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.paginationConfig.total);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_128 = __VLS_127({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
let __VLS_131;
const __VLS_132 = {
    /** @type {typeof __VLS_131.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.createUser();
        // @ts-ignore
        [vLoading, current, current, i18n_name, rightLoading, paginationConfig, createUser,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [
        __VLS_ctx.PermissionConst.WORKSPACE_USER_GROUP_ADD_MEMBER,
        __VLS_ctx.PermissionConst.USER_GROUP_ADD_MEMBER,
    ], [], 'OR')) }, null, null);
const { default: __VLS_133 } = __VLS_129.slots;
(__VLS_ctx.t('views.role.member.add'));
// @ts-ignore
[t, vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst,];
var __VLS_129;
var __VLS_130;
let __VLS_134;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}));
const __VLS_136 = __VLS_135({
    ...{ 'onClick': {} },
    disabled: (__VLS_ctx.multipleSelection.length === 0),
}, ...__VLS_functionalComponentArgsRest(__VLS_135));
let __VLS_139;
const __VLS_140 = {
    /** @type {typeof __VLS_139.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.handleDeleteUser();
        // @ts-ignore
        [multipleSelection, handleDeleteUser,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [
        __VLS_ctx.PermissionConst.WORKSPACE_USER_GROUP_REMOVE_MEMBER,
        __VLS_ctx.PermissionConst.USER_GROUP_REMOVE_MEMBER,
    ], [], 'OR')) }, null, null);
const { default: __VLS_141 } = __VLS_137.slots;
(__VLS_ctx.$t('common.remove'));
// @ts-ignore
[$t, vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst,];
var __VLS_137;
var __VLS_138;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between complex-search" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['complex-search']} */ ;
let __VLS_142;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}));
const __VLS_144 = __VLS_143({
    ...{ class: "complex-search__left" },
    modelValue: (__VLS_ctx.searchType),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_143));
/** @type {__VLS_StyleScopedClasses['complex-search__left']} */ ;
const { default: __VLS_147 } = __VLS_145.slots;
let __VLS_148;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}));
const __VLS_150 = __VLS_149({
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
    value: "username",
}, ...__VLS_functionalComponentArgsRest(__VLS_149));
let __VLS_153;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent1(__VLS_153, new __VLS_153({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}));
const __VLS_155 = __VLS_154({
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    value: "nick_name",
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
let __VLS_158;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_159 = __VLS_asFunctionalComponent1(__VLS_158, new __VLS_158({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    value: "source",
}));
const __VLS_160 = __VLS_159({
    label: (__VLS_ctx.$t('views.userManage.source.label')),
    value: "source",
}, ...__VLS_functionalComponentArgsRest(__VLS_159));
// @ts-ignore
[$t, $t, $t, searchType,];
var __VLS_145;
if (__VLS_ctx.searchType === 'username') {
    let __VLS_163;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_165 = __VLS_164({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.username),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_164));
    let __VLS_168;
    const __VLS_169 = {
        /** @type {typeof __VLS_168.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_166;
    var __VLS_167;
}
else if (__VLS_ctx.searchType === 'nick_name') {
    let __VLS_170;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }));
    const __VLS_172 = __VLS_171({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.nick_name),
        placeholder: (__VLS_ctx.$t('common.searchBar.placeholder')),
        ...{ style: {} },
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    let __VLS_175;
    const __VLS_176 = {
        /** @type {typeof __VLS_175.change} */
        onChange: (__VLS_ctx.getList),
    };
    var __VLS_173;
    var __VLS_174;
}
else if (__VLS_ctx.searchType === 'source') {
    let __VLS_177;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.source),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }));
    const __VLS_179 = __VLS_178({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.searchForm.source),
        ...{ style: {} },
        clearable: true,
        placeholder: (__VLS_ctx.$t('common.inputPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
    let __VLS_182;
    const __VLS_183 = {
        /** @type {typeof __VLS_182.change} */
        onChange: (__VLS_ctx.getList),
    };
    const { default: __VLS_184 } = __VLS_180.slots;
    let __VLS_185;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }));
    const __VLS_187 = __VLS_186({
        label: (__VLS_ctx.$t('views.userManage.source.local')),
        value: "LOCAL",
    }, ...__VLS_functionalComponentArgsRest(__VLS_186));
    let __VLS_190;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
        label: "CAS",
        value: "CAS",
    }));
    const __VLS_192 = __VLS_191({
        label: "CAS",
        value: "CAS",
    }, ...__VLS_functionalComponentArgsRest(__VLS_191));
    let __VLS_195;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
        label: "LDAP",
        value: "LDAP",
    }));
    const __VLS_197 = __VLS_196({
        label: "LDAP",
        value: "LDAP",
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    let __VLS_200;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
        label: "OIDC",
        value: "OIDC",
    }));
    const __VLS_202 = __VLS_201({
        label: "OIDC",
        value: "OIDC",
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    let __VLS_205;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
        label: "OAuth2",
        value: "OAuth2",
    }));
    const __VLS_207 = __VLS_206({
        label: "OAuth2",
        value: "OAuth2",
    }, ...__VLS_functionalComponentArgsRest(__VLS_206));
    let __VLS_210;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }));
    const __VLS_212 = __VLS_211({
        label: (__VLS_ctx.$t('views.userManage.source.wecom')),
        value: "wecom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_211));
    let __VLS_215;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }));
    const __VLS_217 = __VLS_216({
        label: (__VLS_ctx.$t('views.userManage.source.lark')),
        value: "lark",
    }, ...__VLS_functionalComponentArgsRest(__VLS_216));
    let __VLS_220;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }));
    const __VLS_222 = __VLS_221({
        label: (__VLS_ctx.$t('views.userManage.source.dingtalk')),
        value: "dingtalk",
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    // @ts-ignore
    [$t, $t, $t, $t, $t, $t, $t, searchType, searchType, searchType, searchForm, searchForm, searchForm, getList, getList, getList,];
    var __VLS_180;
    var __VLS_181;
}
let __VLS_225;
/** @ts-ignore @type { | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table'] | typeof __VLS_components.appTable | typeof __VLS_components.AppTable | typeof __VLS_components['app-table']} */
appTable;
// @ts-ignore
const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (330),
}));
const __VLS_227 = __VLS_226({
    ...{ 'onSizeChange': {} },
    ...{ 'onChangePage': {} },
    ...{ 'onSelectionChange': {} },
    data: (__VLS_ctx.tableData),
    paginationConfig: (__VLS_ctx.paginationConfig),
    maxTableHeight: (330),
}, ...__VLS_functionalComponentArgsRest(__VLS_226));
let __VLS_230;
const __VLS_231 = {
    /** @type {typeof __VLS_230.sizeChange} */
    onSizeChange: (__VLS_ctx.handleSizeChange),
};
const __VLS_232 = {
    /** @type {typeof __VLS_230.changePage} */
    onChangePage: (__VLS_ctx.getList),
};
const __VLS_233 = {
    /** @type {typeof __VLS_230.selectionChange} */
    onSelectionChange: (__VLS_ctx.handleSelectionChange),
};
const { default: __VLS_234 } = __VLS_228.slots;
let __VLS_235;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
    type: "selection",
    width: "55",
}));
const __VLS_237 = __VLS_236({
    type: "selection",
    width: "55",
}, ...__VLS_functionalComponentArgsRest(__VLS_236));
let __VLS_240;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    showOverflowTooltip: true,
}));
const __VLS_242 = __VLS_241({
    prop: "nick_name",
    label: (__VLS_ctx.$t('views.userManage.userForm.nick_name.label')),
    showOverflowTooltip: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_241));
let __VLS_245;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    prop: "username",
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}));
const __VLS_247 = __VLS_246({
    prop: "username",
    label: (__VLS_ctx.$t('views.login.loginForm.username.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
let __VLS_250;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
    prop: "source",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}));
const __VLS_252 = __VLS_251({
    prop: "source",
    label: (__VLS_ctx.$t('views.userManage.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_251));
const { default: __VLS_255 } = __VLS_253.slots;
{
    const { default: __VLS_256 } = __VLS_253.slots;
    const [{ row }] = __VLS_vSlot(__VLS_256);
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
    [$t, $t, $t, $t, $t, $t, $t, paginationConfig, getList, tableData, handleSizeChange, handleSelectionChange,];
}
// @ts-ignore
[];
var __VLS_253;
let __VLS_257;
/** @ts-ignore @type { | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column'] | typeof __VLS_components.elTableColumn | typeof __VLS_components.ElTableColumn | typeof __VLS_components['el-table-column']} */
elTableColumn;
// @ts-ignore
const __VLS_258 = __VLS_asFunctionalComponent1(__VLS_257, new __VLS_257({
    label: (__VLS_ctx.$t('common.operation')),
    width: "100",
    fixed: "right",
}));
const __VLS_259 = __VLS_258({
    label: (__VLS_ctx.$t('common.operation')),
    width: "100",
    fixed: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_258));
const { default: __VLS_262 } = __VLS_260.slots;
{
    const { default: __VLS_263 } = __VLS_260.slots;
    const [{ row }] = __VLS_vSlot(__VLS_263);
    let __VLS_264;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent1(__VLS_264, new __VLS_264({
        effect: "dark",
        content: (`${__VLS_ctx.$t('common.remove')}`),
        placement: "top",
    }));
    const __VLS_266 = __VLS_265({
        effect: "dark",
        content: (`${__VLS_ctx.$t('common.remove')}`),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    const { default: __VLS_269 } = __VLS_267.slots;
    let __VLS_270;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_271 = __VLS_asFunctionalComponent1(__VLS_270, new __VLS_270({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }));
    const __VLS_272 = __VLS_271({
        ...{ 'onClick': {} },
        type: "primary",
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_271));
    let __VLS_275;
    const __VLS_276 = {
        /** @type {typeof __VLS_275.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.handleDeleteUser(row);
            // @ts-ignore
            [$t, $t, handleDeleteUser,];
        },
    };
    __VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.RoleConst.WORKSPACE_MANAGE], [
            __VLS_ctx.PermissionConst.WORKSPACE_USER_GROUP_REMOVE_MEMBER,
            __VLS_ctx.PermissionConst.USER_GROUP_REMOVE_MEMBER,
        ], [], 'OR')) }, null, null);
    const { default: __VLS_277 } = __VLS_273.slots;
    let __VLS_278;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
        iconName: "app-delete-users",
    }));
    const __VLS_280 = __VLS_279({
        iconName: "app-delete-users",
    }, ...__VLS_functionalComponentArgsRest(__VLS_279));
    // @ts-ignore
    [vHasPermission, ComplexPermission, RoleConst, RoleConst, PermissionConst, PermissionConst,];
    var __VLS_273;
    var __VLS_274;
    // @ts-ignore
    [];
    var __VLS_267;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_260;
// @ts-ignore
[];
var __VLS_228;
var __VLS_229;
// @ts-ignore
[];
var __VLS_21;
const __VLS_283 = CreateOrUpdateGroupDialog;
// @ts-ignore
const __VLS_284 = __VLS_asFunctionalComponent1(__VLS_283, new __VLS_283({
    ...{ 'onRefresh': {} },
    ref: "createOrUpdateGroupDialogRef",
}));
const __VLS_285 = __VLS_284({
    ...{ 'onRefresh': {} },
    ref: "createOrUpdateGroupDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_284));
let __VLS_288;
const __VLS_289 = {
    /** @type {typeof __VLS_288.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_290;
var __VLS_286;
var __VLS_287;
const __VLS_292 = CreateGroupUserDialog;
// @ts-ignore
const __VLS_293 = __VLS_asFunctionalComponent1(__VLS_292, new __VLS_292({
    ...{ 'onRefresh': {} },
    ref: "createGroupUserDialogRef",
}));
const __VLS_294 = __VLS_293({
    ...{ 'onRefresh': {} },
    ref: "createGroupUserDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_293));
let __VLS_297;
const __VLS_298 = {
    /** @type {typeof __VLS_297.refresh} */
    onRefresh: (__VLS_ctx.getList),
};
var __VLS_299;
var __VLS_295;
var __VLS_296;
// @ts-ignore
var __VLS_291 = __VLS_290, __VLS_300 = __VLS_299;
// @ts-ignore
[getList, refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
