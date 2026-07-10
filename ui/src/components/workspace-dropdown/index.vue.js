/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { watch, ref } from 'vue';
import { i18n_name } from '@/utils/common';
import useStore from '@/stores';
const props = defineProps({
    data: {
        type: (Array),
        default: () => [],
    },
    currentWorkspace: {
        type: Object,
        default: () => { },
    },
});
const { folder } = useStore();
const loading = ref(false);
const emit = defineEmits(['changeWorkspace']);
function changeWorkspace(item) {
    folder.setCurrentFolder({});
    emit('changeWorkspace', item);
}
const filterText = ref('');
const filterData = ref([]);
watch([() => props.data, () => filterText.value], () => {
    if (!filterText.value.length) {
        filterData.value = props.data;
    }
    filterData.value = props.data.filter((v) => v.name.toLowerCase().includes(filterText.value.toLowerCase()));
}, { immediate: true });
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
elDropdown;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    trigger: "click",
    placement: "bottom-start",
    ...{ class: "workspace-dropdown" },
    popperClass: "workspace-dropdown-popper",
}));
const __VLS_2 = __VLS_1({
    trigger: "click",
    placement: "bottom-start",
    ...{ class: "workspace-dropdown" },
    popperClass: "workspace-dropdown-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['workspace-dropdown']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    text: true,
    ...{ style: {} },
    ...{ class: "workspace-dropdown__button" },
}));
const __VLS_9 = __VLS_8({
    text: true,
    ...{ style: {} },
    ...{ class: "workspace-dropdown__button" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['workspace-dropdown__button']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    iconName: "app-workspace",
    ...{ style: {} },
}));
const __VLS_15 = __VLS_14({
    iconName: "app-workspace",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ellipsis" },
    ...{ style: {} },
    title: (__VLS_ctx.currentWorkspace?.name),
});
/** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
(__VLS_ctx.i18n_name(__VLS_ctx.currentWorkspace?.name));
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ class: "el-icon--right" },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "el-icon--right" },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.CaretBottom} */
CaretBottom;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[currentWorkspace, currentWorkspace, i18n_name,];
var __VLS_21;
// @ts-ignore
[];
var __VLS_10;
{
    const { dropdown: __VLS_29 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full p-8" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-8']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        modelValue: (__VLS_ctx.filterText),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        clearable: true,
    }));
    const __VLS_32 = __VLS_31({
        modelValue: (__VLS_ctx.filterText),
        placeholder: (__VLS_ctx.$t('common.search')),
        prefixIcon: "Search",
        clearable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        maxHeight: "300",
    }));
    const __VLS_37 = __VLS_36({
        maxHeight: "300",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    const { default: __VLS_40 } = __VLS_38.slots;
    let __VLS_41;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
    elDropdownMenu;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({}));
    const __VLS_43 = __VLS_42({}, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
    const { default: __VLS_46 } = __VLS_44.slots;
    for (const [item] of __VLS_vFor((__VLS_ctx.filterData))) {
        let __VLS_47;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
        elDropdownItem;
        // @ts-ignore
        const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
            ...{ 'onClick': {} },
            key: (item.id),
            ...{ class: (`${item.id === __VLS_ctx.currentWorkspace?.id ? 'active' : ''} flex-between`) },
        }));
        const __VLS_49 = __VLS_48({
            ...{ 'onClick': {} },
            key: (item.id),
            ...{ class: (`${item.id === __VLS_ctx.currentWorkspace?.id ? 'active' : ''} flex-between`) },
        }, ...__VLS_functionalComponentArgsRest(__VLS_48));
        let __VLS_52;
        const __VLS_53 = {
            /** @type {typeof __VLS_52.click} */
            onClick: (...[$event]) => {
                return __VLS_ctx.changeWorkspace(item);
                // @ts-ignore
                [currentWorkspace, filterText, $t, vLoading, loading, filterData, changeWorkspace,];
            },
        };
        const { default: __VLS_54 } = __VLS_50.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_55;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
            ...{ class: "mr-8" },
            iconName: "app-workspace",
            ...{ style: {} },
        }));
        const __VLS_57 = __VLS_56({
            ...{ class: "mr-8" },
            iconName: "app-workspace",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ellipsis" },
            ...{ style: {} },
            title: (item.name),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (item.name);
        if (item.role_name) {
            let __VLS_60;
            /** @ts-ignore @type { | typeof __VLS_components.TagGroup} */
            TagGroup;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
                ...{ class: "ml-8" },
                size: "small",
                tags: (item.role_name),
            }));
            const __VLS_62 = __VLS_61({
                ...{ class: "ml-8" },
                size: "small",
                tags: (item.role_name),
            }, ...__VLS_functionalComponentArgsRest(__VLS_61));
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        }
        let __VLS_65;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
            ...{ class: "ml-8" },
            ...{ style: {} },
        }));
        const __VLS_67 = __VLS_66({
            ...{ class: "ml-8" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_66));
        __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (item.id === __VLS_ctx.currentWorkspace?.id) }, null, null);
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        const { default: __VLS_70 } = __VLS_68.slots;
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.Check} */
        Check;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({}));
        const __VLS_73 = __VLS_72({}, ...__VLS_functionalComponentArgsRest(__VLS_72));
        // @ts-ignore
        [currentWorkspace,];
        var __VLS_68;
        // @ts-ignore
        [];
        var __VLS_50;
        var __VLS_51;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_44;
    // @ts-ignore
    [];
    var __VLS_38;
    if (!__VLS_ctx.filterData.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "no-data color-info" },
        });
        /** @type {__VLS_StyleScopedClasses['no-data']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-info']} */ ;
        (__VLS_ctx.$t('common.noData'));
    }
    // @ts-ignore
    [$t, filterData,];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        data: {
            type: (Array),
            default: () => [],
        },
        currentWorkspace: {
            type: Object,
            default: () => { },
        },
    },
});
export default {};
