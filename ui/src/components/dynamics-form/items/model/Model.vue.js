/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { groupBy, flatMap } from 'lodash';
import SelectHeader from '@/components/dynamics-form/items/common/SelectHeader.vue';
import { relatedObject } from '@/utils/array';
import { providerList } from './provider-data';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
const props = withDefaults(defineProps(), {
    modelValue: null,
});
const emit = defineEmits(['update:modelValue', 'change']);
const model_value = computed({
    get: () => props.modelValue,
    set: (value) => {
        emit('update:modelValue', value);
        emit('change', props.formField);
    },
});
const groupedOptions = computed(() => {
    const list = props.formField.attrs?.provider_list || [];
    return groupBy(list, 'provider');
});
const getModelProvider = computed(() => {
    return (id) => {
        const item = flatMap(groupedOptions.value)?.find((item) => item.model_id === id);
        return item?.provider || '';
    };
});
const AIModeParamSettingDialogRef = ref();
function openParamSetting() {
    if (!model_value.value?.model_id)
        return;
    const model_form_field = props.formField.attrs?.provider_list.find((p) => p.model_id === model_value.value?.model_id).model_form_field || [];
    AIModeParamSettingDialogRef.value?.open(model_value.value.model_id, undefined, model_value.value.model_params_setting, model_form_field);
}
function handleParamRefresh(paramData) {
    if (model_value.value) {
        model_value.value = {
            ...model_value.value,
            model_params_setting: paramData,
        };
    }
}
const handleModelChange = (selectedId) => {
    const list = props.formField.attrs?.provider_list || [];
    const selectedItem = list.find((p) => p.model_id === selectedId);
    model_value.value = {
        model_id: selectedId,
        model_params_setting: selectedItem?.model_params_setting || {},
    };
};
const __VLS_defaults = {
    modelValue: null,
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "complex-select flex align-center w-full" },
});
/** @type {__VLS_StyleScopedClasses['complex-select']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onChange': {} },
    ...{ class: "complex-select__left" },
    modelValue: (__VLS_ctx.model_value?.model_id),
    popperClass: "select-model",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onChange': {} },
    ...{ class: "complex-select__left" },
    modelValue: (__VLS_ctx.model_value?.model_id),
    popperClass: "select-model",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.change} */
    onChange: (__VLS_ctx.handleModelChange),
};
/** @type {__VLS_StyleScopedClasses['complex-select__left']} */ ;
const { default: __VLS_7 } = __VLS_3.slots;
if (__VLS_ctx.$attrs.popperHeader) {
    {
        const { header: __VLS_8 } = __VLS_3.slots;
        const __VLS_9 = SelectHeader;
        // @ts-ignore
        const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
            header: (__VLS_ctx.$attrs.popperHeader),
        }));
        const __VLS_11 = __VLS_10({
            header: (__VLS_ctx.$attrs.popperHeader),
        }, ...__VLS_functionalComponentArgsRest(__VLS_10));
        // @ts-ignore
        [model_value, $attrs, $attrs, $attrs, handleModelChange,];
    }
}
for (const [modelList, providerName] of __VLS_vFor((__VLS_ctx.groupedOptions))) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group'] | typeof __VLS_components.elOptionGroup | typeof __VLS_components.ElOptionGroup | typeof __VLS_components['el-option-group']} */
    elOptionGroup;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        key: (providerName),
        label: (__VLS_ctx.relatedObject(__VLS_ctx.providerList, providerName, 'provider')?.name),
    }));
    const __VLS_16 = __VLS_15({
        key: (providerName),
        label: (__VLS_ctx.relatedObject(__VLS_ctx.providerList, providerName, 'provider')?.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    const { default: __VLS_19 } = __VLS_17.slots;
    for (const [item] of __VLS_vFor((modelList))) {
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            key: (item.model_id),
            label: (item.model_name),
            value: (item.model_id),
        }));
        const __VLS_22 = __VLS_21({
            key: (item.model_id),
            label: (item.model_name),
            value: (item.model_id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        const { default: __VLS_25 } = __VLS_23.slots;
        let __VLS_26;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
            size: (8),
        }));
        const __VLS_28 = __VLS_27({
            size: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_27));
        const { default: __VLS_31 } = __VLS_29.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerList, providerName, 'provider')?.icon),
            ...{ class: "select-model-icon" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (item.model_name);
        // @ts-ignore
        [groupedOptions, relatedObject, relatedObject, providerList, providerList,];
        var __VLS_29;
        // @ts-ignore
        [];
        var __VLS_23;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_17;
    // @ts-ignore
    [];
}
{
    const { label: __VLS_32 } = __VLS_3.slots;
    const [{ label, value }] = __VLS_vSlot(__VLS_32);
    if (value) {
        let __VLS_33;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            size: (8),
        }));
        const __VLS_35 = __VLS_34({
            size: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        const { default: __VLS_38 } = __VLS_36.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "select-model-icon" },
            innerHTML: (__VLS_ctx.relatedObject(__VLS_ctx.providerList, __VLS_ctx.getModelProvider(value), 'provider')?.icon),
        });
        /** @type {__VLS_StyleScopedClasses['select-model-icon']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (label);
        // @ts-ignore
        [relatedObject, providerList, getModelProvider,];
        var __VLS_36;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
elDivider;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    direction: "vertical",
}));
const __VLS_41 = __VLS_40({
    direction: "vertical",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    ...{ 'onClick': {} },
    text: true,
    disabled: (!__VLS_ctx.model_value?.model_id),
    ...{ class: "mr-4" },
}));
const __VLS_46 = __VLS_45({
    ...{ 'onClick': {} },
    text: true,
    disabled: (!__VLS_ctx.model_value?.model_id),
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
const __VLS_50 = {
    /** @type {typeof __VLS_49.click} */
    onClick: (__VLS_ctx.openParamSetting),
};
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
const { default: __VLS_51 } = __VLS_47.slots;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    iconName: "app-operation",
    ...{ class: "color-secondary" },
    size: "16",
}));
const __VLS_54 = __VLS_53({
    iconName: "app-operation",
    ...{ class: "color-secondary" },
    size: "16",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
// @ts-ignore
[model_value, openParamSetting,];
var __VLS_47;
var __VLS_48;
const __VLS_57 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_59 = __VLS_58({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_58));
let __VLS_62;
const __VLS_63 = {
    /** @type {typeof __VLS_62.refresh} */
    onRefresh: (__VLS_ctx.handleParamRefresh),
};
var __VLS_64;
var __VLS_60;
var __VLS_61;
// @ts-ignore
var __VLS_65 = __VLS_64;
// @ts-ignore
[handleParamRefresh,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
