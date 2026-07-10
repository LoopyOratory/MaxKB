/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import DynamicsFormConstructor from '@/components/dynamics-form/constructor/index.vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
const DynamicsFormConstructorRef = ref();
const form_item_list = ref([]);
const add_field = () => {
    if (DynamicsFormConstructorRef.value) {
        DynamicsFormConstructorRef.value.validate().then(() => {
            form_item_list.value.push(DynamicsFormConstructorRef.value?.getData());
        });
    }
};
const form_data = ref({});
const item = ref({});
const dynamicsFormRef = ref();
const validate = () => {
    dynamicsFormRef.value
        ?.validate()
        .then((ok) => { })
        .catch((e) => { });
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    gutter: (12),
}));
const __VLS_2 = __VLS_1({
    gutter: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    span: (12),
}));
const __VLS_9 = __VLS_8({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    shadow: "never",
}));
const __VLS_15 = __VLS_14({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
const __VLS_19 = DynamicsFormConstructor || DynamicsFormConstructor;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    modelValue: (__VLS_ctx.item),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "DynamicsFormConstructorRef",
}));
const __VLS_21 = __VLS_20({
    modelValue: (__VLS_ctx.item),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "DynamicsFormConstructorRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
var __VLS_24;
var __VLS_22;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ 'onClick': {} },
}));
const __VLS_28 = __VLS_27({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_31;
const __VLS_32 = {
    /** @type {typeof __VLS_31.click} */
    onClick: (__VLS_ctx.add_field),
};
const { default: __VLS_33 } = __VLS_29.slots;
// @ts-ignore
[item, add_field,];
var __VLS_29;
var __VLS_30;
// @ts-ignore
[];
var __VLS_16;
// @ts-ignore
[];
var __VLS_10;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    span: (12),
}));
const __VLS_36 = __VLS_35({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    shadow: "never",
}));
const __VLS_42 = __VLS_41({
    shadow: "never",
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
const { default: __VLS_45 } = __VLS_43.slots;
const __VLS_46 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
    labelPosition: "top",
    requireAsteriskPosition: "right",
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.form_item_list),
    ref: "dynamicsFormRef",
}));
const __VLS_48 = __VLS_47({
    labelPosition: "top",
    requireAsteriskPosition: "right",
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
    render_data: (__VLS_ctx.form_item_list),
    ref: "dynamicsFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
var __VLS_51;
var __VLS_49;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    ...{ 'onClick': {} },
}));
const __VLS_55 = __VLS_54({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_58;
const __VLS_59 = {
    /** @type {typeof __VLS_58.click} */
    onClick: (__VLS_ctx.validate),
};
const { default: __VLS_60 } = __VLS_56.slots;
// @ts-ignore
[form_data, form_data, form_item_list, validate,];
var __VLS_56;
var __VLS_57;
// @ts-ignore
[];
var __VLS_43;
// @ts-ignore
[];
var __VLS_37;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_25 = __VLS_24, __VLS_52 = __VLS_51;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
