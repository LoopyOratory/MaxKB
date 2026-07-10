/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import useStore from '@/stores';
import { t } from '@/locales';
import { useRoute, useRouter } from 'vue-router';
const FormRef = ref();
const { chatUser } = useStore();
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const auth = () => {
    return chatUser.passwordAuthentication(form.value.password).then((ok) => {
        router.push({ name: 'chat', params: { accessToken: chatUser.accessToken }, query: route.query });
    });
};
const validator_auth = (rule, value, callback) => {
    if (value === '') {
        callback(new Error(t('aiChat.passwordValidator.errorMessage1')));
    }
    else {
        auth().catch(() => {
            callback(new Error(t('aiChat.passwordValidator.errorMessage2')));
        });
    }
};
const validator = () => {
    FormRef.value.validate();
};
const rules = {
    password: [{ required: true, validator: validator_auth, trigger: 'manual' }],
};
const form = ref({
    password: '',
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onSubmit': {} },
    ref: "FormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.submit} */
    onSubmit: (__VLS_ctx.validator),
};
var __VLS_7;
const { default: __VLS_9 } = __VLS_3.slots;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    prop: "value",
    rules: (__VLS_ctx.rules.password),
}));
const __VLS_12 = __VLS_11({
    prop: "value",
    rules: (__VLS_ctx.rules.password),
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    showPassword: true,
    modelValue: (__VLS_ctx.form.password),
}));
const __VLS_18 = __VLS_17({
    showPassword: true,
    modelValue: (__VLS_ctx.form.password),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
// @ts-ignore
[form, form, validator, rules,];
var __VLS_13;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onClick': {} },
    ...{ class: "w-full mt-8" },
    type: "primary",
    loading: (__VLS_ctx.loading),
}));
const __VLS_23 = __VLS_22({
    ...{ 'onClick': {} },
    ...{ class: "w-full mt-8" },
    type: "primary",
    loading: (__VLS_ctx.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    /** @type {typeof __VLS_26.click} */
    onClick: (__VLS_ctx.validator),
};
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
const { default: __VLS_28 } = __VLS_24.slots;
(__VLS_ctx.$t('common.confirm'));
// @ts-ignore
[validator, loading, $t,];
var __VLS_24;
var __VLS_25;
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
