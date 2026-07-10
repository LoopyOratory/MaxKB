/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import ProviderApi from '@/api/model/provider';
import { modelTypeList } from './data';
import { t } from '@/locales';
const loading = ref(false);
const dialogVisible = ref(false);
const list_provider = ref([]);
const currentModelType = ref('');
const selectModelType = ref('');
const modelTypeOptions = [
    { text: t('views.model.modelType.allModel'), value: '' },
    ...modelTypeList,
];
const open = (model_type) => {
    dialogVisible.value = true;
    const option = modelTypeOptions.find((item) => item.text === currentModelType.value);
    checkModelType(model_type ? model_type : option ? option.value : '');
};
const close = () => {
    dialogVisible.value = false;
};
const checkModelType = (model_type) => {
    selectModelType.value = model_type;
    currentModelType.value = modelTypeOptions.filter((item) => item.value === model_type)[0].text;
    ProviderApi.getProviderByModelType(model_type, loading).then((ok) => {
        list_provider.value = ok.data;
        list_provider.value.sort((a, b) => a.provider.localeCompare(b.provider));
    });
};
const emit = defineEmits(['change']);
const go_create = (provider) => {
    close();
    emit('change', provider, selectModelType.value);
};
const __VLS_exposed = { open, close };
defineExpose(__VLS_exposed);
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    width: "600px",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.model.providerPlaceholder'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown'] | typeof __VLS_components.elDropdown | typeof __VLS_components.ElDropdown | typeof __VLS_components['el-dropdown']} */
    elDropdown;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({}));
    const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    (__VLS_ctx.currentModelType || __VLS_ctx.$t('views..model.modelType.allModel'));
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        ...{ class: "el-icon--right" },
    }));
    const __VLS_16 = __VLS_15({
        ...{ class: "el-icon--right" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    /** @type {__VLS_StyleScopedClasses['el-icon--right']} */ ;
    const { default: __VLS_19 } = __VLS_17.slots;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.arrowDown | typeof __VLS_components.ArrowDown | typeof __VLS_components['arrow-down']} */
    arrowDown;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    // @ts-ignore
    [dialogVisible, close, $t, $t, currentModelType,];
    var __VLS_17;
    {
        const { dropdown: __VLS_25 } = __VLS_11.slots;
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu'] | typeof __VLS_components.elDropdownMenu | typeof __VLS_components.ElDropdownMenu | typeof __VLS_components['el-dropdown-menu']} */
        elDropdownMenu;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({}));
        const __VLS_28 = __VLS_27({}, ...__VLS_functionalComponentArgsRest(__VLS_27));
        const { default: __VLS_31 } = __VLS_29.slots;
        for (const [item] of __VLS_vFor((__VLS_ctx.modelTypeOptions))) {
            let __VLS_32;
            /** @ts-ignore @type { | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item'] | typeof __VLS_components.elDropdownItem | typeof __VLS_components.ElDropdownItem | typeof __VLS_components['el-dropdown-item']} */
            elDropdownItem;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                ...{ 'onClick': {} },
                key: (item.value),
                ...{ class: "flex-between w-120" },
                ...{ class: (__VLS_ctx.currentModelType === item.text ? 'active' : '') },
            }));
            const __VLS_34 = __VLS_33({
                ...{ 'onClick': {} },
                key: (item.value),
                ...{ class: "flex-between w-120" },
                ...{ class: (__VLS_ctx.currentModelType === item.text ? 'active' : '') },
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            let __VLS_37;
            const __VLS_38 = {
                /** @type {typeof __VLS_37.click} */
                onClick: (...[$event]) => {
                    return __VLS_ctx.checkModelType(item.value);
                    // @ts-ignore
                    [currentModelType, modelTypeOptions, checkModelType,];
                },
            };
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['w-120']} */ ;
            const { default: __VLS_39 } = __VLS_35.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
            (item.text);
            if (__VLS_ctx.currentModelType === item.text) {
                let __VLS_40;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({}));
                const __VLS_42 = __VLS_41({}, ...__VLS_functionalComponentArgsRest(__VLS_41));
                const { default: __VLS_45 } = __VLS_43.slots;
                let __VLS_46;
                /** @ts-ignore @type { | typeof __VLS_components.Check} */
                Check;
                // @ts-ignore
                const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({}));
                const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
                // @ts-ignore
                [currentModelType,];
                var __VLS_43;
            }
            // @ts-ignore
            [];
            var __VLS_35;
            var __VLS_36;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_29;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_11;
    // @ts-ignore
    [];
}
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    gutter: (12),
}));
const __VLS_53 = __VLS_52({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_56 } = __VLS_54.slots;
for (const [data, index] of __VLS_vFor((__VLS_ctx.list_provider))) {
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        span: (12),
        ...{ class: "mb-16" },
        key: (index),
    }));
    const __VLS_59 = __VLS_58({
        span: (12),
        ...{ class: "mb-16" },
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_62 } = __VLS_60.slots;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        shadow: "hover",
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        shadow: "hover",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        /** @type {typeof __VLS_68.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.go_create(data);
            // @ts-ignore
            [vLoading, loading, list_provider, go_create,];
        },
    };
    const { default: __VLS_70 } = __VLS_66.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span)({
        innerHTML: (data.icon),
        alt: "",
        ...{ style: {} },
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (data.name);
    // @ts-ignore
    [];
    var __VLS_66;
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_60;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_54;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
