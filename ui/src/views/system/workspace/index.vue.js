/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, watch } from 'vue';
import { t } from '@/locales';
import { i18n_name } from '@/utils/common';
import Member from './component/Member.vue';
import CreateOrUpdateWorkspaceDialog from './component/CreateOrUpdateWorkspaceDialog.vue';
import { MsgSuccess, MsgConfirm } from '@/utils/message';
import { PermissionConst, RoleConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
const filterText = ref('');
const loading = ref(false);
const list = ref([]);
const filterList = ref([]); // SearchFilterAfterList
const currentWorkspace = ref();
async function getWorkspace() {
    try {
        const res = await loadPermissionApi('workspace').getSystemWorkspaceList(loading);
        list.value = res.data;
        filterList.value = filter(list.value, filterText.value);
    }
    catch (error) {
        console.error(error);
    }
}
onMounted(async () => {
    await getWorkspace();
    currentWorkspace.value = list.value[0];
});
const editPermission = () => {
    return hasPermission([RoleConst.ADMIN, PermissionConst.WORKSPACE_EDIT], 'OR');
};
const dlePermission = () => {
    return hasPermission([RoleConst.ADMIN, PermissionConst.WORKSPACE_DELETE], 'OR');
};
async function refresh(workspace) {
    await getWorkspace();
    // CreationAfterSelectCreate
    if (workspace) {
        currentWorkspace.value = workspace;
    }
    else {
        currentWorkspace.value = list.value.find((item) => item.id === currentWorkspace.value?.id);
    }
}
function filter(list, filterText) {
    if (!filterText.length) {
        return list;
    }
    return list.filter((v) => v.name.toLowerCase().includes(filterText.toLowerCase()));
}
watch(filterText, (val) => {
    filterList.value = filter(list.value, val);
});
function clickWorkspace(item) {
    currentWorkspace.value = item;
}
const createOrUpdateWorkspaceDialogRef = ref();
function createOrUpdateWorkspace(item) {
    createOrUpdateWorkspaceDialogRef.value?.open(item);
}
async function check(id) {
    try {
        return await loadPermissionApi('workspace').deleteWorkspaceCheck(id);
    }
    catch (error) {
        console.log(error);
    }
}
async function deleteWorkspace(item) {
    // Determine whether deletion is possible
    const res = await check(item.id);
    const canDelete = res ? res.data.can_delete : true;
    if (canDelete) {
        MsgConfirm(`${t('views.workspace.delete.confirmTitle')}${item.name} ?`, t('views.workspace.delete.confirmContent'), {
            confirmButtonText: t('common.confirm'),
            confirmButtonClass: 'danger',
        }).then(() => {
            loadPermissionApi('workspace')
                .deleteWorkspace(item.id, loading)
                .then(async () => {
                MsgSuccess(t('common.deleteSuccess'));
                await getWorkspace();
                currentWorkspace.value =
                    item.id === currentWorkspace.value?.id ? list.value[0] : currentWorkspace.value;
            });
        });
    }
    else {
        MsgConfirm(`${t('views.workspace.delete.confirmTitle')}${item.name} ?`, res ? res.data.message : t('views.workspace.delete.confirmContent'), {
            showConfirmButton: false,
            cancelButtonText: t('common.close'),
        });
    }
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
    ...{ class: "workspace-manage p-16-24" },
});
/** @type {__VLS_StyleScopedClasses['workspace-manage']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.workspace.title'));
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
    ...{ class: "flex main-calc-height" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['main-calc-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "workspace-left border-r" },
});
/** @type {__VLS_StyleScopedClasses['workspace-left']} */ ;
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
(__VLS_ctx.$t('views.workspace.list'));
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    effect: "dark",
    content: (`${__VLS_ctx.$t('common.create')}${__VLS_ctx.$t('views.workspace.title')}`),
    placement: "top",
}));
const __VLS_8 = __VLS_7({
    effect: "dark",
    content: (`${__VLS_ctx.$t('common.create')}${__VLS_ctx.$t('views.workspace.title')}`),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onClick': {} },
    type: "primary",
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_17;
const __VLS_18 = {
    /** @type {typeof __VLS_17.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.createOrUpdateWorkspace();
        // @ts-ignore
        [$t, $t, $t, $t, createOrUpdateWorkspace,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vHasPermission, {})(null, { ...__VLS_directiveBindingRestFields, value: ([__VLS_ctx.RoleConst.ADMIN, __VLS_ctx.PermissionConst.WORKSPACE_CREATE]) }, null, null);
const { default: __VLS_19 } = __VLS_15.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    iconName: "app-add-outlined",
}));
const __VLS_22 = __VLS_21({
    iconName: "app-add-outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
// @ts-ignore
[vHasPermission, RoleConst, PermissionConst,];
var __VLS_15;
var __VLS_16;
// @ts-ignore
[];
var __VLS_9;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.filterText),
    placeholder: (__VLS_ctx.$t('common.search')),
    prefixIcon: "Search",
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "list-height-left" },
});
/** @type {__VLS_StyleScopedClasses['list-height-left']} */ ;
let __VLS_30;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({}));
const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_35 } = __VLS_33.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-8-16" },
});
/** @type {__VLS_StyleScopedClasses['p-8-16']} */ ;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list'] | typeof __VLS_components.commonList | typeof __VLS_components.CommonList | typeof __VLS_components['common-list']} */
commonList;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterList),
    defaultActive: (__VLS_ctx.currentWorkspace?.id),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    data: (__VLS_ctx.filterList),
    defaultActive: (__VLS_ctx.currentWorkspace?.id),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_41;
const __VLS_42 = {
    /** @type {typeof __VLS_41.click} */
    onClick: (__VLS_ctx.clickWorkspace),
};
const __VLS_43 = {
    /** @type {typeof __VLS_41.mouseenter} */
    onMouseenter: (__VLS_ctx.mouseenter),
};
const __VLS_44 = {
    /** @type {typeof __VLS_41.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.mouseId = '';
        // @ts-ignore
        [$t, filterText, vLoading, loading, filterList, currentWorkspace, clickWorkspace, mouseenter, mouseId,];
    },
};
const { default: __VLS_45 } = __VLS_39.slots;
{
    const { default: __VLS_46 } = __VLS_39.slots;
    const [{ row }] = __VLS_vSlot(__VLS_46);
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
        let __VLS_47;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
        elDropdown;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
            teleported: (false),
            trigger: "click",
        }));
        const __VLS_49 = __VLS_48({
            teleported: (false),
            trigger: "click",
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        const { default: __VLS_52 } = __VLS_50.slots;
        let __VLS_53;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
            text: true,
        }));
        const __VLS_55 = __VLS_54({
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        const { default: __VLS_58 } = __VLS_56.slots;
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            iconName: "app-more",
        }));
        const __VLS_61 = __VLS_60({
            iconName: "app-more",
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        // @ts-ignore
        [mouseId, i18n_name, editPermission, dlePermission,];
        var __VLS_56;
        {
            const { dropdown: __VLS_64 } = __VLS_50.slots;
            let __VLS_65;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
            elDropdownMenu;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
                ...{ style: {} },
            }));
            const __VLS_67 = __VLS_66({
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
            const { default: __VLS_70 } = __VLS_68.slots;
            if (__VLS_ctx.editPermission()) {
                let __VLS_71;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
                    ...{ 'onClick': {} },
                    ...{ class: "p-8" },
                }));
                const __VLS_73 = __VLS_72({
                    ...{ 'onClick': {} },
                    ...{ class: "p-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_72));
                let __VLS_76;
                const __VLS_77 = {
                    /** @type {typeof __VLS_76.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.editPermission() || __VLS_ctx.dlePermission()))
                            throw 0;
                        if (!(__VLS_ctx.editPermission()))
                            throw 0;
                        return __VLS_ctx.createOrUpdateWorkspace(row);
                        // @ts-ignore
                        [createOrUpdateWorkspace, editPermission,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
                const { default: __VLS_78 } = __VLS_74.slots;
                let __VLS_79;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_81 = __VLS_80({
                    iconName: "app-edit",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_80));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.rename'));
                // @ts-ignore
                [$t,];
                var __VLS_74;
                var __VLS_75;
            }
            if (__VLS_ctx.dlePermission()) {
                let __VLS_84;
                /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
                elDropdownItem;
                // @ts-ignore
                const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
                    ...{ 'onClick': {} },
                    ...{ class: "border-t p-8" },
                }));
                const __VLS_86 = __VLS_85({
                    ...{ 'onClick': {} },
                    ...{ class: "border-t p-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_85));
                let __VLS_89;
                const __VLS_90 = {
                    /** @type {typeof __VLS_89.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.editPermission() || __VLS_ctx.dlePermission()))
                            throw 0;
                        if (!(__VLS_ctx.dlePermission()))
                            throw 0;
                        return __VLS_ctx.deleteWorkspace(row);
                        // @ts-ignore
                        [dlePermission, deleteWorkspace,];
                    },
                };
                /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
                /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
                const { default: __VLS_91 } = __VLS_87.slots;
                let __VLS_92;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }));
                const __VLS_94 = __VLS_93({
                    iconName: "app-delete",
                    ...{ class: "color-secondary" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_93));
                /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
                (__VLS_ctx.$t('common.delete'));
                // @ts-ignore
                [$t,];
                var __VLS_87;
                var __VLS_88;
            }
            // @ts-ignore
            [];
            var __VLS_68;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_50;
    }
    // @ts-ignore
    [];
}
{
    const { empty: __VLS_97 } = __VLS_39.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_39;
var __VLS_40;
// @ts-ignore
[];
var __VLS_33;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "workspace-right p-24" },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['workspace-right']} */ ;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "medium" },
});
/** @type {__VLS_StyleScopedClasses['medium']} */ ;
(__VLS_ctx.i18n_name(__VLS_ctx.currentWorkspace?.name));
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    direction: "vertical",
    ...{ class: "mr-8 ml-8" },
}));
const __VLS_100 = __VLS_99({
    direction: "vertical",
    ...{ class: "mr-8 ml-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
let __VLS_103;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
    ...{ class: "color-input-placeholder" },
}));
const __VLS_105 = __VLS_104({
    ...{ class: "color-input-placeholder" },
}, ...__VLS_functionalComponentArgsRest(__VLS_104));
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
const { default: __VLS_108 } = __VLS_106.slots;
let __VLS_109;
/** @ts-ignore @type { | typeof __VLS_components.UserFilled} */
UserFilled;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({}));
const __VLS_111 = __VLS_110({}, ...__VLS_functionalComponentArgsRest(__VLS_110));
// @ts-ignore
[vLoading, loading, currentWorkspace, i18n_name,];
var __VLS_106;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-input-placeholder ml-4" },
});
/** @type {__VLS_StyleScopedClasses['color-input-placeholder']} */ ;
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.currentWorkspace?.user_count);
const __VLS_114 = Member;
// @ts-ignore
const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({
    currentWorkspace: (__VLS_ctx.currentWorkspace),
}));
const __VLS_116 = __VLS_115({
    currentWorkspace: (__VLS_ctx.currentWorkspace),
}, ...__VLS_functionalComponentArgsRest(__VLS_115));
// @ts-ignore
[currentWorkspace, currentWorkspace,];
var __VLS_3;
const __VLS_119 = CreateOrUpdateWorkspaceDialog;
// @ts-ignore
const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({
    ...{ 'onRefresh': {} },
    ref: "createOrUpdateWorkspaceDialogRef",
}));
const __VLS_121 = __VLS_120({
    ...{ 'onRefresh': {} },
    ref: "createOrUpdateWorkspaceDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_120));
let __VLS_124;
const __VLS_125 = {
    /** @type {typeof __VLS_124.refresh} */
    onRefresh: (__VLS_ctx.refresh),
};
var __VLS_126;
var __VLS_122;
var __VLS_123;
// @ts-ignore
var __VLS_127 = __VLS_126;
// @ts-ignore
[refresh,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
