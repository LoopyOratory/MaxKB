/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import authorizationApi from '@/api/system-shared/authorization';
import { loadPermissionApi } from '@/utils/dynamics-api/permission-api.ts';
const checkAll = ref(false);
const isIndeterminate = ref(true);
const checkedWorkspace = ref([]);
const workspace = ref([]);
const listType = ref('WHITE_LIST');
const search = ref('');
let knowledge_id = '';
let currentType = 'Knowledge';
const loading = ref(false);
const centerDialogVisible = ref(false);
const workspaceWithKeywords = computed(() => {
    return workspace.value.filter((ele) => ele.name.includes(search.value));
});
const handleCheckAllChange = (val) => {
    checkedWorkspace.value = val ? workspace.value : [];
    isIndeterminate.value = false;
    if (!val) {
        clearWorkspaceAll();
    }
};
const handleCheckedWorkspaceChange = (value) => {
    const checkedCount = value.length;
    checkAll.value = checkedCount === workspace.value.length;
    isIndeterminate.value = checkedCount > 0 && checkedCount < workspace.value.length;
};
const open = async ({ id }, type = 'Knowledge') => {
    knowledge_id = id;
    loading.value = true;
    currentType = type;
    const [authList, systemWorkspaceList] = await Promise.all([
        authorizationApi[`getSharedAuthorization${type}`](id),
        loadPermissionApi('workspace').getSystemWorkspaceList(),
    ]);
    workspace.value = systemWorkspaceList.data;
    listType.value = (authList.data || {}).authentication_type || 'WHITE_LIST';
    const workspace_id_list = (authList.data || {}).workspace_id_list || [];
    checkedWorkspace.value = workspace.value.filter((ele) => workspace_id_list.includes(ele.id));
    handleCheckedWorkspaceChange(checkedWorkspace.value);
    loading.value = false;
    centerDialogVisible.value = true;
};
const handleConfirm = () => {
    authorizationApi[`postSharedAuthorization${currentType}`](knowledge_id, {
        workspace_id_list: checkedWorkspace.value.map((ele) => ele.id),
        authentication_type: listType.value,
    }).then(() => {
        centerDialogVisible.value = false;
    });
};
const clearWorkspace = (val) => {
    checkedWorkspace.value = checkedWorkspace.value.filter((ele) => ele.id !== val.id);
};
const clearWorkspaceAll = () => {
    checkedWorkspace.value = [];
    handleCheckedWorkspaceChange([]);
};
const __VLS_exposed = {
    open,
};
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modalClass: "authorized-workspace",
    modelValue: (__VLS_ctx.centerDialogVisible),
    width: "840",
}));
const __VLS_2 = __VLS_1({
    modalClass: "authorized-workspace",
    modelValue: (__VLS_ctx.centerDialogVisible),
    width: "840",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('views.shared.authorized_workspace'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ class: "color-secondary lighter" },
    }));
    const __VLS_10 = __VLS_9({
        ...{ class: "color-secondary lighter" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_13 } = __VLS_11.slots;
    (__VLS_ctx.$t('views.shared.authorized_tip'));
    // @ts-ignore
    [centerDialogVisible, $t, $t,];
    var __VLS_11;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-8 lighter" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('common.type'));
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    modelValue: (__VLS_ctx.listType),
}));
const __VLS_16 = __VLS_15({
    modelValue: (__VLS_ctx.listType),
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
const { default: __VLS_19 } = __VLS_17.slots;
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    value: "WHITE_LIST",
}));
const __VLS_22 = __VLS_21({
    value: "WHITE_LIST",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const { default: __VLS_25 } = __VLS_23.slots;
(__VLS_ctx.$t('views.shared.WHITE_LIST'));
// @ts-ignore
[$t, $t, listType,];
var __VLS_23;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    value: "BLACK_LIST",
}));
const __VLS_28 = __VLS_27({
    value: "BLACK_LIST",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
(__VLS_ctx.$t('views.shared.BLACK_LIST'));
// @ts-ignore
[$t,];
var __VLS_29;
// @ts-ignore
[];
var __VLS_17;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-8 lighter mt-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
(__VLS_ctx.$t('views.shared.select_workspace'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex border" },
    ...{ style: {} },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['border']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border-r" },
});
/** @type {__VLS_StyleScopedClasses['border-r']} */ ;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.search),
    validateEvent: (false),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ style: {} },
    clearable: true,
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.search),
    validateEvent: (false),
    placeholder: (__VLS_ctx.$t('common.search')),
    ...{ style: {} },
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
{
    const { prefix: __VLS_38 } = __VLS_35.slots;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
    const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const { default: __VLS_44 } = __VLS_42.slots;
    let __VLS_45;
    /** @ts-ignore @type { | typeof __VLS_components.Search} */
    Search;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({}));
    const __VLS_47 = __VLS_46({}, ...__VLS_functionalComponentArgsRest(__VLS_46));
    // @ts-ignore
    [$t, $t, vLoading, loading, search,];
    var __VLS_42;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_35;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-8" },
});
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
if (!__VLS_ctx.search) {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onChange': {} },
        ...{ class: "mb-8" },
        ...{ style: {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onChange': {} },
        ...{ class: "mb-8" },
        ...{ style: {} },
        modelValue: (__VLS_ctx.checkAll),
        indeterminate: (__VLS_ctx.isIndeterminate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        /** @type {typeof __VLS_55.change} */
        onChange: (__VLS_ctx.handleCheckAllChange),
    };
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    const { default: __VLS_57 } = __VLS_53.slots;
    (__VLS_ctx.$t('common.allCheck'));
    // @ts-ignore
    [$t, search, checkAll, isIndeterminate, handleCheckAllChange,];
    var __VLS_53;
    var __VLS_54;
}
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    maxHeight: "205",
    wrapClass: "p-16 pt-0",
}));
const __VLS_60 = __VLS_59({
    maxHeight: "205",
    wrapClass: "p-16 pt-0",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
elCheckboxGroup;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    ...{ 'onChange': {} },
    ...{ class: "checkbox-group-block" },
    modelValue: (__VLS_ctx.checkedWorkspace),
}));
const __VLS_66 = __VLS_65({
    ...{ 'onChange': {} },
    ...{ class: "checkbox-group-block" },
    modelValue: (__VLS_ctx.checkedWorkspace),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
let __VLS_69;
const __VLS_70 = {
    /** @type {typeof __VLS_69.change} */
    onChange: (__VLS_ctx.handleCheckedWorkspaceChange),
};
/** @type {__VLS_StyleScopedClasses['checkbox-group-block']} */ ;
const { default: __VLS_71 } = __VLS_67.slots;
for (const [space] of __VLS_vFor((__VLS_ctx.workspaceWithKeywords))) {
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        key: (space.id),
        label: (space.name),
        value: (space),
    }));
    const __VLS_74 = __VLS_73({
        key: (space.id),
        label: (space.name),
        value: (space),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const { default: __VLS_77 } = __VLS_75.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        iconName: "app-workspace",
    }));
    const __VLS_80 = __VLS_79({
        iconName: "app-workspace",
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4 ellipsis" },
        title: (space.name),
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (space.name);
    // @ts-ignore
    [checkedWorkspace, handleCheckedWorkspaceChange, workspaceWithKeywords,];
    var __VLS_75;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_67;
var __VLS_68;
// @ts-ignore
[];
var __VLS_61;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between p-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('common.selected'));
(__VLS_ctx.checkedWorkspace.length);
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}));
const __VLS_85 = __VLS_84({
    ...{ 'onClick': {} },
    link: true,
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
let __VLS_88;
const __VLS_89 = {
    /** @type {typeof __VLS_88.click} */
    onClick: (__VLS_ctx.clearWorkspaceAll),
};
const { default: __VLS_90 } = __VLS_86.slots;
(__VLS_ctx.$t('common.clear'));
// @ts-ignore
[$t, $t, checkedWorkspace, clearWorkspaceAll,];
var __VLS_86;
var __VLS_87;
let __VLS_91;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    maxHeight: "250",
    wrapClass: "p-16 pt-0",
}));
const __VLS_93 = __VLS_92({
    maxHeight: "250",
    wrapClass: "p-16 pt-0",
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
const { default: __VLS_96 } = __VLS_94.slots;
for (const [ele, index] of __VLS_vFor((__VLS_ctx.checkedWorkspace))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        iconName: "app-workspace",
    }));
    const __VLS_99 = __VLS_98({
        iconName: "app-workspace",
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4 lighter ellipsis" },
        title: (ele.name),
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (ele.name);
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        link: true,
    }));
    const __VLS_104 = __VLS_103({
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    const { default: __VLS_107 } = __VLS_105.slots;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        ...{ 'onClick': {} },
        size: (18),
    }));
    const __VLS_110 = __VLS_109({
        ...{ 'onClick': {} },
        size: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    let __VLS_113;
    const __VLS_114 = {
        /** @type {typeof __VLS_113.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.clearWorkspace(ele);
            // @ts-ignore
            [checkedWorkspace, clearWorkspace,];
        },
    };
    const { default: __VLS_115 } = __VLS_111.slots;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.Close} */
    Close;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({}));
    const __VLS_118 = __VLS_117({}, ...__VLS_functionalComponentArgsRest(__VLS_117));
    // @ts-ignore
    [];
    var __VLS_111;
    var __VLS_112;
    // @ts-ignore
    [];
    var __VLS_105;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_94;
{
    const { footer: __VLS_121 } = __VLS_3.slots;
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        ...{ 'onClick': {} },
    }));
    const __VLS_124 = __VLS_123({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    let __VLS_127;
    const __VLS_128 = {
        /** @type {typeof __VLS_127.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.centerDialogVisible = false;
            // @ts-ignore
            [centerDialogVisible,];
        },
    };
    const { default: __VLS_129 } = __VLS_125.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_125;
    var __VLS_126;
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_132 = __VLS_131({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    let __VLS_135;
    const __VLS_136 = {
        /** @type {typeof __VLS_135.click} */
        onClick: (__VLS_ctx.handleConfirm),
    };
    const { default: __VLS_137 } = __VLS_133.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, handleConfirm,];
    var __VLS_133;
    var __VLS_134;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
});
export default {};
