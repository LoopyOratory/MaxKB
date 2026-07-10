/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
const emit = defineEmits(['update:modelValue', 'change']);
const props = defineProps();
const data = computed({
    get: () => {
        if (props.modelValue) {
            return props.modelValue;
        }
        return {};
    },
    set: ($event) => {
        emit('update:modelValue', $event);
    },
});
const other = computed(() => {
    return { ...(props.formfieldList ? props.formfieldList : {}), ...props.otherParams };
});
// ValidateInstanceObject
const dynamicsFormRef = ref();
/**
 * ComponentStyle
 */
const formStyle = computed(() => {
    return props_info.value.form_style ? props_info.value.form_style : {};
});
const props_info = computed(() => {
    return props.formField.props_info ? props.formField.props_info : {};
});
const style = computed(() => {
    return props_info.value.style ? props_info.value.style : {};
});
/**
 * ValidateMethod
 */
function validate() {
    if (dynamicsFormRef.value) {
        return dynamicsFormRef.value.validate();
    }
    return Promise.resolve();
}
const __VLS_exposed = {
    validate,
};
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
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: (__VLS_ctx.style) },
}));
const __VLS_2 = __VLS_1({
    ...{ style: (__VLS_ctx.style) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
const __VLS_7 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    readOnly: (__VLS_ctx.view),
    ...{ style: (__VLS_ctx.formStyle) },
    ref: "dynamicsFormRef",
    modelValue: (__VLS_ctx.data),
    otherParams: (__VLS_ctx.other),
    render_data: (__VLS_ctx.formField.children ? __VLS_ctx.formField.children : []),
    parent_field: (__VLS_ctx.formField.field),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    readOnly: (__VLS_ctx.view),
    ...{ style: (__VLS_ctx.formStyle) },
    ref: "dynamicsFormRef",
    modelValue: (__VLS_ctx.data),
    otherParams: (__VLS_ctx.other),
    render_data: (__VLS_ctx.formField.children ? __VLS_ctx.formField.children : []),
    parent_field: (__VLS_ctx.formField.field),
    labelPosition: "top",
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
(__VLS_ctx.$attrs);
var __VLS_12;
var __VLS_10;
// @ts-ignore
[style, view, formStyle, data, other, formField, formField, formField, $attrs,];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
