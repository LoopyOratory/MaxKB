/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import SelectHeader from '@/components/dynamics-form/items/common/SelectHeader.vue';
import { computed, ref } from 'vue';
const rowTemp = ref();
const props = defineProps();
const emit = defineEmits(['update:modelValue', 'change']);
const _modelValue = computed({
    get() {
        if (props.modelValue) {
            return props.modelValue;
        }
        return [];
    },
    set($event) {
        emit('update:modelValue', $event);
    },
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
const label = (option) => {
    return option[textField.value];
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ class: "m-2" },
    multiple: true,
    filterable: true,
    allowCreate: true,
    clearable: true,
    defaultFirstOption: true,
    reserveKeyword: (false),
    modelValue: (__VLS_ctx._modelValue),
}));
const __VLS_2 = __VLS_1({
    ...{ class: "m-2" },
    multiple: true,
    filterable: true,
    allowCreate: true,
    clearable: true,
    defaultFirstOption: true,
    reserveKeyword: (false),
    modelValue: (__VLS_ctx._modelValue),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['m-2']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.$attrs.popperHeader) {
    {
        const { header: __VLS_7 } = __VLS_3.slots;
        const __VLS_8 = SelectHeader;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            header: (__VLS_ctx.$attrs.popperHeader),
        }));
        const __VLS_10 = __VLS_9({
            header: (__VLS_ctx.$attrs.popperHeader),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        // @ts-ignore
        [_modelValue, $attrs, $attrs, $attrs,];
    }
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.option_list))) {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        key: (index),
        label: (__VLS_ctx.label(item)),
        value: (item[__VLS_ctx.valueField]),
    }));
    const __VLS_15 = __VLS_14({
        key: (index),
        label: (__VLS_ctx.label(item)),
        value: (item[__VLS_ctx.valueField]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    // @ts-ignore
    [option_list, label, valueField,];
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
