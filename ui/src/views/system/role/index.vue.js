/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, watch } from 'vue';
import { t } from '@/locales';
import { i18n_name } from '@/utils/common';
import PermissionConfiguration from './component/PermissionConfiguration.vue';
import Member from './component/Member.vue';
import CreateOrUpdateRoleDialog from './component/CreateOrUpdateRoleDialog.vue';
import { roleTypeMap } from './index';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { ComplexPermission } from '@/utils/permission/type';
import { hasPermission } from '@/utils/permission/index';
const filterText = ref('');
const loading = ref(false);
const internalRoleList = ref([]);
const filterInternalRole = ref([]); // SearchFilterAfterList
const customRoleList = ref([]);
const filterCustomRole = ref([]); // SearchFilterAfterList
const currentRole = ref();
async function getRole() {
    try {
        const res = await loadPermissionApi('role').getRoleList(loading);
        internalRoleList.value = res.data.internal_role;
        customRoleList.value = res.data.custom_role;
        filterInternalRole.value = filter(internalRoleList.value, filterText.value);
        filterCustomRole.value = filter(customRoleList.value, filterText.value);
    }
    catch (error) {
        console.error(error);
    }
}
const editPermission = () => {
    return hasPermission(new ComplexPermission([RoleConst.ADMIN], [PermissionConst.ROLE_EDIT], [], 'OR'), 'OR');
};
const delPermission = () => {
    return hasPermission(new ComplexPermission([RoleConst.ADMIN], [PermissionConst.ROLE_DELETE], [], 'OR'), 'OR');
};
onMounted(async () => {
    await getRole();
    currentRole.value = internalRoleList.value[0];
});
async function refresh(role) {
    await getRole();
    // CreationRoleAfterSelectCreateRole
    if (role) {
        currentRole.value = role;
    }
    else {
        currentRole.value = customRoleList.value.find((item) => item.id === currentRole.value?.id);
    }
}
function filter(list, filterText) {
    if (!filterText.length) {
        return list;
    }
    return list.filter((v) => v.role_name.toLowerCase().includes(filterText.toLowerCase()));
}
watch(filterText, (val) => {
    filterInternalRole.value = filter(internalRoleList.value, val);
    filterCustomRole.value = filter(customRoleList.value, val);
});
function clickRole(item) {
    currentRole.value = item;
}
const createOrUpdateRoleDialogRef = ref();
function createOrUpdateRole(item) {
    createOrUpdateRoleDialogRef.value?.open(item);
}
function deleteRole(item) {
    MsgConfirm(`${t('views.role.delete.confirmTitle')}${item.role_name} ?`, t('views.role.delete.confirmMessage'), {
        confirmButtonText: t('common.confirm'),
        confirmButtonClass: 'danger',
    })
        .then(() => {
        loadPermissionApi('role')
            .deleteRole(item.id, loading)
            .then(async () => {
            MsgSuccess(t('common.deleteSuccess'));
            await getRole();
            currentRole.value =
                item.id === currentRole.value?.id ? internalRoleList.value[0] : currentRole.value;
        });
    })
        .catch(() => { });
}
const currentTab = ref('permission');
const tabList = [
    {
        value: 'permission',
        label: t('views.role.permission.title'),
    },
    {
        value: 'member',
        label: t('views.role.member.title'),
    },
];
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
    ...{ class: "role-manage p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['role-manage']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.role.title'));
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: {} },
    ...{ class: "main-calc-height" },
}));
const __VLS_2 = __VLS_1({
    ...{ style: {} },
    ...{ class: "main-calc-height" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "role-left border-r" },
});
/** @type {__VLS_StyleScopedClasses['role-left']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "color-secondary lighter ml-8 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('views.role.internalRole'));
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterInternalRole),
    defaultActive: (__VLS_ctx.currentRole?.id),
}));
const __VLS_19 = __VLS_18({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterInternalRole),
    defaultActive: (__VLS_ctx.currentRole?.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
let __VLS_22;
const __VLS_23 = {
    /** @type {typeof __VLS_22.click} */
    onClick: (__VLS_ctx.clickRole),
};
const __VLS_24 = {
    /** @type {typeof __VLS_22.mouseenter} */
    onMouseenter: (__VLS_ctx.mouseenter),
};
const __VLS_25 = {
    /** @type {typeof __VLS_22.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.mouseId = '';
        // @ts-ignore
        [$t, $t, $t, filterText, vLoading, loading, filterInternalRole, currentRole, clickRole, mouseenter, mouseId,];
    },
};
const { default: __VLS_26 } = __VLS_20.slots;
{
    const { default: __VLS_27 } = __VLS_20.slots;
    const [{ row }] = __VLS_vSlot(__VLS_27);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1" },
        title: (row.role_name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    (__VLS_ctx.i18n_name(row.role_name));
    // @ts-ignore
    [i18n_name,];
}
{
    const { empty: __VLS_28 } = __VLS_20.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_20;
var __VLS_21;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "ml-8 border-t flex-between mb-8" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
/** @type {__VLS_StyleScopedClasses['border-t']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-secondary lighter" },
});
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.role.customRole'));
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    effect: "dark",
    content: (`${__VLS_ctx.$t('common.create')}${__VLS_ctx.$t('views.role.customRole')}`),
    placement: "top",
}));
const __VLS_31 = __VLS_30({
    effect: "dark",
    content: (`${__VLS_ctx.$t('common.create')}${__VLS_ctx.$t('views.role.customRole')}`),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}));
const __VLS_37 = __VLS_36({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_40;
const __VLS_41 = {
    /** @type {typeof __VLS_40.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.createOrUpdateRole();
        // @ts-ignore
        [$t, $t, $t, createOrUpdateRole,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: (new __VLS_ctx.ComplexPermission([__VLS_ctx.RoleConst.ADMIN], [__VLS_ctx.PermissionConst.ROLE_CREATE], [], 'OR')) }, null, null);
const { default: __VLS_42 } = __VLS_38.slots;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    iconName: "app-add-outlined",
}));
const __VLS_45 = __VLS_44({
    iconName: "app-add-outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
// @ts-ignore
[vHasPermission, ComplexPermission, RoleConst, PermissionConst,];
var __VLS_38;
var __VLS_39;
// @ts-ignore
[];
var __VLS_32;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterCustomRole),
    defaultActive: (__VLS_ctx.currentRole?.id),
}));
const __VLS_50 = __VLS_49({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterCustomRole),
    defaultActive: (__VLS_ctx.currentRole?.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
const __VLS_54 = {
    /** @type {typeof __VLS_53.click} */
    onClick: (__VLS_ctx.clickRole),
};
const __VLS_55 = {
    /** @type {typeof __VLS_53.mouseenter} */
    onMouseenter: (__VLS_ctx.mouseenter),
};
const __VLS_56 = {
    /** @type {typeof __VLS_53.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.mouseId = '';
        // @ts-ignore
        [currentRole, clickRole, mouseenter, mouseId, filterCustomRole,];
    },
};
const { default: __VLS_57 } = __VLS_51.slots;
{
    const { default: __VLS_58 } = __VLS_51.slots;
    const [{ row }] = __VLS_vSlot(__VLS_58);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex align-center mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (row.role_name);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-input-placeholder ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.roleTypeMap[row.type]);
    if (__VLS_ctx.editPermission() || __VLS_ctx.delPermission()) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: () => { } },
        });
        __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.mouseId === row.id) }, null, null);
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            teleported: (false),
            trigger: "click",
        }));
        const __VLS_61 = __VLS_60({
            teleported: (false),
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        const { default: __VLS_64 } = __VLS_62.slots;
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            text: true,
        }));
        const __VLS_67 = __VLS_66({
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        const { default: __VLS_70 } = __VLS_68.slots;
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            iconName: "app-more",
        }));
        const __VLS_73 = __VLS_72({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        // @ts-ignore
        [mouseId, roleTypeMap, editPermission, delPermission,];
        var __VLS_68;
        {
            const { dropdown: __VLS_76 } = __VLS_62.slots;
            let __VLS_77;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
                ...{ style: {} },
            }));
            const __VLS_79 = __VLS_78({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_78));
            const { default: __VLS_82 } = __VLS_80.slots;
            if (__VLS_ctx.editPermission()) {
                let __VLS_83;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
                    ...{ 'onClick': {} },
                    ...{ class: "p-8" },
                }));
                const __VLS_85 = __VLS_84({
                    ...{ 'onClick': {} },
                    ...{ class: "p-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_84));
                let __VLS_88;
                const __VLS_89 = {
                    /** @type {typeof __VLS_88.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.editPermission() || __VLS_ctx.delPermission()))
                            throw 0;
                        if (!(__VLS_ctx.editPermission()))
                            throw 0;
                        return __VLS_ctx.createOrUpdateRole(row);
                        // @ts-ignore
                        [createOrUpdateRole, editPermission,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
                const { default: __VLS_90 } = __VLS_86.slots;
                let __VLS_91;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_93 = __VLS_92({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_92));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.rename'));
                // @ts-ignore
                [$t,];
                var __VLS_86;
                var __VLS_87;
            }
            if (__VLS_ctx.delPermission()) {
                let __VLS_96;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
                    ...{ 'onClick': {} },
                    ...{ class: "border-t p-8" },
                }));
                const __VLS_98 = __VLS_97({
                    ...{ 'onClick': {} },
                    ...{ class: "border-t p-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_97));
                let __VLS_101;
                const __VLS_102 = {
                    /** @type {typeof __VLS_101.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.editPermission() || __VLS_ctx.delPermission()))
                            throw 0;
                        if (!(__VLS_ctx.delPermission()))
                            throw 0;
                        return __VLS_ctx.deleteRole(row);
                        // @ts-ignore
                        [delPermission, deleteRole,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
                const { default: __VLS_103 } = __VLS_99.slots;
                let __VLS_104;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_106 = __VLS_105({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_105));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_99;
                var __VLS_100;
            }
            // @ts-ignore
            [];
            var __VLS_80;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_62;
    }
    // @ts-ignore
    [];
}
{
    const { empty: __VLS_109 } = __VLS_51.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_51;
var __VLS_52;
// @ts-ignore
[];
var __VLS_14;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "role-right p-24" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['role-right']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.i18n_name(__VLS_ctx.currentRole?.role_name));
if (__VLS_ctx.currentRole?.type && !__VLS_ctx.currentRole.internal) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-input-placeholder ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.roleTypeMap[__VLS_ctx.currentRole?.type]);
}
let __VLS_110;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
    direction: "vertical",
}));
const __VLS_112 = __VLS_111({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_111));
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    ...{ class: "color-input-placeholder" },
}));
const __VLS_117 = __VLS_116({
    ...{ class: "color-input-placeholder" },
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
const { default: __VLS_120 } = __VLS_118.slots;
let __VLS_121;
/** @ts-ignore @type { | typeof __VLS_components.UserFilled} */
UserFilled;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({}));
const __VLS_123 = __VLS_122({}, ...__VLS_functionalComponentArgsRest(__VLS_122));
// @ts-ignore
[vLoading, loading, currentRole, currentRole, currentRole, currentRole, i18n_name, roleTypeMap,];
var __VLS_118;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-input-placeholder ml-4" },
});
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.currentRole?.user_count);
let __VLS_126;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
    modelValue: (__VLS_ctx.currentTab),
    ...{ class: "app-radio-button-group" },
}));
const __VLS_128 = __VLS_127({
    modelValue: (__VLS_ctx.currentTab),
    ...{ class: "app-radio-button-group" },
}, ...__VLS_functionalComponentArgsRest(__VLS_127));
/** @type {__VLS_StyleScopedClasses['app-radio-button-group']} */ ;
const { default: __VLS_131 } = __VLS_129.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.tabList))) {
    let __VLS_132;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioButton | typeof __VLS_components.ElRadioButton | typeof __VLS_components['el-radio-button']} */
    elRadioButton;
    // @ts-ignore
    const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_134 = __VLS_133({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_133));
    // @ts-ignore
    [currentRole, currentTab, tabList,];
}
// @ts-ignore
[];
var __VLS_129;
if (__VLS_ctx.currentTab === 'permission') {
    const __VLS_137 = PermissionConfiguration;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
        currentRole: (__VLS_ctx.currentRole),
    }));
    const __VLS_139 = __VLS_138({
        currentRole: (__VLS_ctx.currentRole),
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
}
else {
    const __VLS_142 = Member;
    // @ts-ignore
    const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
        currentRole: (__VLS_ctx.currentRole),
    }));
    const __VLS_144 = __VLS_143({
        currentRole: (__VLS_ctx.currentRole),
    }, ...__VLS_functionalComponentArgsRest(__VLS_143));
}
// @ts-ignore
[currentRole, currentRole, currentTab,];
var __VLS_3;
const __VLS_147 = CreateOrUpdateRoleDialog;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    ...{ 'onRefresh': {} },
    ref: "createOrUpdateRoleDialogRef",
}));
const __VLS_149 = __VLS_148({
    ...{ 'onRefresh': {} },
    ref: "createOrUpdateRoleDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
let __VLS_152;
const __VLS_153 = {
    /** @type {typeof __VLS_152.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_154;
var __VLS_150;
var __VLS_151;
// @ts-ignore
var __VLS_155 = __VLS_154;
// @ts-ignore
[refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
