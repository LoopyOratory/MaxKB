/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, inject } from 'vue';
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
const emit = defineEmits(['update:modelValue']);
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
    ...{ class: "radio-row" },
});
/** @type {__VLS_StyleScopedClasses['radio-row']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.option_list))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                return __VLS_ctx.selected(item[__VLS_ctx.valueField]);
                // @ts-ignore
                [option_list, selected, valueField,];
            } },
        key: (item.value),
        ...{ class: "item" },
        ...{ class: ([__VLS_ctx.inputDisabled ? 'is-disabled' : '', __VLS_ctx.modelValue == item[__VLS_ctx.valueField] ? 'active' : '']) },
    });
    /** @type {__VLS_StyleScopedClasses['item']} */ ;
    (item[__VLS_ctx.textField]);
    // @ts-ignore
    [valueField, inputDisabled, modelValue, textField,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
