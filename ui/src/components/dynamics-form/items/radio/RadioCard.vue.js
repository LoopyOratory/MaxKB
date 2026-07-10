/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, inject } from 'vue';
import { useFormDisabled, formItemContextKey } from 'element-plus';
const inputDisabled = useFormDisabled();
const props = defineProps();
const elFormItem = inject(formItemContextKey, void 0);
const selected = (activeValue) => {
    emit('update:modelValue', activeValue);
    if (elFormItem?.validate) {
        elFormItem.validate('change');
    }
};
const emit = defineEmits(['update:modelValue', 'change']);
const width = ref();
const radioContentStyle = computed(() => {
    if (width.value) {
        if (width.value < 350) {
            return { '--maxkb-radio-card-width': '316px' };
        }
        else if (width.value > 770) {
            return { '--maxkb-radio-card-width': '378px' };
        }
        else {
            return { '--maxkb-radio-card-width': '100%' };
        }
    }
    return {};
});
const textField = computed(() => {
    return props.formField.text_field ? props.formField.text_field : 'key';
});
const valueField = computed(() => {
    return props.formField.value_field ? props.formField.value_field : 'value';
});
const option_list = computed(() => {
    return props.formField.option_list ? props.formField.option_list : [];
});
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
    ...{ class: "radio-card" },
    ...{ style: (__VLS_ctx.radioContentStyle) },
});
/** @type {__VLS_StyleScopedClasses['radio-card']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (12),
    ...{ class: "w-full" },
}));
const __VLS_2 = __VLS_1({
    gutter: (12),
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
for (const [item, index] of __VLS_vFor((__VLS_ctx.option_list))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        xs: (24),
        sm: (24),
        md: (24),
        lg: (12),
        xl: (12),
    }));
    const __VLS_8 = __VLS_7({
        xs: (24),
        sm: (24),
        md: (24),
        lg: (12),
        xl: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    const { default: __VLS_11 } = __VLS_9.slots;
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        ...{ 'onClick': {} },
        key: (item.value),
        ...{ class: "item break-all" },
        shadow: "never",
        ...{ style: {} },
        ...{ class: ([
                __VLS_ctx.inputDisabled ? 'is-disabled' : '',
                __VLS_ctx.modelValue == item[__VLS_ctx.valueField] ? 'active' : '',
            ]) },
        innerHTML: (item[__VLS_ctx.textField] ? item[__VLS_ctx.textField] : '\u200D'),
    }));
    const __VLS_14 = __VLS_13({
        ...{ 'onClick': {} },
        key: (item.value),
        ...{ class: "item break-all" },
        shadow: "never",
        ...{ style: {} },
        ...{ class: ([
                __VLS_ctx.inputDisabled ? 'is-disabled' : '',
                __VLS_ctx.modelValue == item[__VLS_ctx.valueField] ? 'active' : '',
            ]) },
        innerHTML: (item[__VLS_ctx.textField] ? item[__VLS_ctx.textField] : '\u200D'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    let __VLS_17;
    const __VLS_18 = {
        /** @type {typeof __VLS_17.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.inputDisabled ? () => { } : __VLS_ctx.selected(item[__VLS_ctx.valueField]);
            // @ts-ignore
            [radioContentStyle, option_list, inputDisabled, inputDisabled, modelValue, valueField, valueField, textField, textField, selected,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['item']} */ ;
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    var __VLS_15;
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_9;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
