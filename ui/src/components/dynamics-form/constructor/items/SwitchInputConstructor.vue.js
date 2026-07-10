/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted } from 'vue';
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const getData = () => {
    return {
        input_type: 'SwitchInput',
        show_default_value: true,
        attrs: {},
        default_value: formValue.value.default_value,
    };
};
const rander = (form_data) => {
    formValue.value.default_value = form_data.default_value || false;
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onMounted(() => {
    formValue.value.default_value = false;
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    rules: (__VLS_ctx.formValue.required
        ? [
            {
                required: true,
                message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
            },
        ]
        : []),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    rules: (__VLS_ctx.formValue.required
        ? [
            {
                required: true,
                message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
            },
        ]
        : []),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: () => { },
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
let __VLS_9;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
    modelValue: (__VLS_ctx.formValue.default_value),
}));
const __VLS_11 = __VLS_10({
    modelValue: (__VLS_ctx.formValue.default_value),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
// @ts-ignore
[$t, $t, $t, formValue, formValue, formValue,];
var __VLS_3;
var __VLS_4;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
