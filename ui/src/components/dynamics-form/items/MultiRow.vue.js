/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, inject } from 'vue';
import { useFormDisabled, formItemContextKey } from 'element-plus';
const inputDisabled = useFormDisabled();
const props = defineProps();
const elFormItem = inject(formItemContextKey, void 0);
const selected = (activeValue) => {
    if (_value.value.includes(activeValue)) {
        emit('update:modelValue', props.modelValue.filter((i) => i != activeValue));
    }
    else {
        emit('update:modelValue', reset(activeValue));
    }
    if (elFormItem?.validate) {
        elFormItem.validate('change');
    }
};
const reset = (activeValue) => {
    const _result = props.modelValue ? [...props.modelValue, activeValue] : [activeValue];
    return _result.filter((r) => option_value_list.value.includes(r));
};
const _value = computed(() => {
    return props.modelValue ? props.modelValue : [];
});
const emit = defineEmits(['update:modelValue']);
const textField = computed(() => {
    return props.formField.text_field ? props.formField.text_field : 'key';
});
const valueField = computed(() => {
    return props.formField.value_field ? props.formField.value_field : 'value';
});
const option_value_list = computed(() => {
    return option_list.value.map((item) => item[valueField.value]);
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
    ...{ class: "multi_row" },
});
/** @type {__VLS_StyleScopedClasses['multi_row']} */ ;
for (const [item] of __VLS_vFor((__VLS_ctx.option_list))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                return __VLS_ctx.selected(item[__VLS_ctx.valueField]);
                // @ts-ignore
                [option_list, selected, valueField,];
            } },
        key: (item.value),
        ...{ class: "item" },
        ...{ class: ([
                __VLS_ctx.inputDisabled ? 'is-disabled' : '',
                __VLS_ctx._value.includes(item[__VLS_ctx.valueField]) ? 'active' : '',
            ]) },
    });
    /** @type {__VLS_StyleScopedClasses['item']} */ ;
    (item[__VLS_ctx.textField]);
    // @ts-ignore
    [valueField, inputDisabled, _value, textField,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
