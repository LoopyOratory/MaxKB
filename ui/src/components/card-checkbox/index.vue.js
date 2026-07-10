/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
defineOptions({ name: 'CardCheckbox' });
const props = defineProps();
const toModelValue = computed(() => (props.valueField ? props.data[props.valueField] : props.data));
const emit = defineEmits(['update:modelValue', 'change']);
const checked = () => {
    const value = props.modelValue ? props.modelValue : [];
    if (props.modelValue.includes(toModelValue.value)) {
        emit('update:modelValue', value.filter((item) => item !== toModelValue.value));
    }
    else {
        emit('update:modelValue', [...value, toModelValue.value]);
    }
    checkboxChange();
};
function checkboxChange() {
    emit('change');
}
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
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor" },
    ...{ class: (__VLS_ctx.modelValue.includes(__VLS_ctx.toModelValue) ? 'border-active' : '') },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    shadow: "hover",
    ...{ class: "card-checkbox cursor" },
    ...{ class: (__VLS_ctx.modelValue.includes(__VLS_ctx.toModelValue) ? 'border-active' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: (__VLS_ctx.checked),
};
var __VLS_7;
/** @type {__VLS_StyleScopedClasses['card-checkbox']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
const { default: __VLS_8 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
var __VLS_9 = {};
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
KnowledgeIcon;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    type: (__VLS_ctx.data.type),
}));
const __VLS_13 = __VLS_12({
    type: (__VLS_ctx.data.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
var __VLS_16 = {};
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.modelValue.includes(__VLS_ctx.toModelValue)),
}));
const __VLS_20 = __VLS_19({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.modelValue.includes(__VLS_ctx.toModelValue)),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_23;
const __VLS_24 = {
    /** @type {typeof __VLS_23.change} */
    onChange: (__VLS_ctx.checkboxChange),
};
var __VLS_21;
var __VLS_22;
// @ts-ignore
[modelValue, modelValue, toModelValue, toModelValue, checked, data, checkboxChange,];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_10 = __VLS_9, __VLS_17 = __VLS_16;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
const __VLS_export = {};
export default {};
