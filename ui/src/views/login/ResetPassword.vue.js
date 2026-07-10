/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted } from 'vue';
import LoginContainer from '@/layout/login-layout/LoginContainer.vue';
import LoginLayout from '@/layout/login-layout/LoginLayout.vue';
import { useRouter, useRoute } from 'vue-router';
import { MsgSuccess } from '@/utils/message';
import UserApi from '@/api/user/user';
import { t } from '@/locales';
import JSEncrypt from "jsencrypt";
import useStore from "@/stores";
const { user } = useStore();
const router = useRouter();
const route = useRoute();
const { params: { code, email } } = route;
const resetPasswordForm = ref({
    password: '',
    re_password: '',
    email: '',
    code: '',
    encrypted: false
});
onMounted(() => {
    if (code && email) {
        resetPasswordForm.value.code = code;
        resetPasswordForm.value.email = email;
    }
    else {
        router.push('forgot_password');
    }
});
const rules = ref({
    password: [
        {
            required: true,
            message: t('views.login.loginForm.re_password.requiredMessage'),
            trigger: 'blur'
        },
        {
            min: 6,
            max: 20,
            message: t('views.login.loginForm.password.lengthMessage'),
            trigger: 'blur'
        }
    ],
    re_password: [
        {
            required: true,
            message: t('views.login.loginForm.re_password.requiredMessage'),
            trigger: 'blur'
        },
        {
            min: 6,
            max: 20,
            message: t('views.login.loginForm.password.lengthMessage'),
            trigger: 'blur'
        },
        {
            validator: (rule, value, callback) => {
                if (resetPasswordForm.value.password != resetPasswordForm.value.re_password) {
                    callback(new Error(t('views.login.loginForm.re_password.validatorMessage')));
                }
                else {
                    callback();
                }
            },
            trigger: 'blur'
        }
    ]
});
const resetPasswordFormRef = ref();
const loading = ref(false);
const resetPassword = () => {
    resetPasswordFormRef.value
        ?.validate()
        .then(() => {
        const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
        const js = new JSEncryptCtor();
        js.setPublicKey(user.rsaKey);
        resetPasswordForm.value.password = js.encrypt(resetPasswordForm.value.password);
        resetPasswordForm.value.re_password = js.encrypt(resetPasswordForm.value.re_password);
        resetPasswordForm.value.encrypted = true;
        UserApi.postResetPassword(resetPasswordForm.value, loading);
    })
        .then(() => {
        MsgSuccess(t('common.modifySuccess'));
        router.push({ name: 'login' });
    });
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = LoginLayout || LoginLayout;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
const __VLS_7 = LoginContainer || LoginContainer;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    subTitle: (__VLS_ctx.$t('theme.defaultSlogan')),
}));
const __VLS_9 = __VLS_8({
    subTitle: (__VLS_ctx.$t('theme.defaultSlogan')),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-24" },
});
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
(__VLS_ctx.$t('views.login.resetPassword'));
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ class: "reset-password-form" },
    ref: "resetPasswordFormRef",
    model: (__VLS_ctx.resetPasswordForm),
    rules: (__VLS_ctx.rules),
}));
const __VLS_15 = __VLS_14({
    ...{ class: "reset-password-form" },
    ref: "resetPasswordFormRef",
    model: (__VLS_ctx.resetPasswordForm),
    rules: (__VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
var __VLS_18;
/** @type {__VLS_StyleScopedClasses['reset-password-form']} */ ;
const { default: __VLS_20 } = __VLS_16.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-24" },
});
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    prop: "password",
}));
const __VLS_23 = __VLS_22({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    type: "password",
    size: "large",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
    showPassword: true,
}));
const __VLS_29 = __VLS_28({
    type: "password",
    size: "large",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
/** @type {__VLS_StyleScopedClasses['input-item']} */ ;
// @ts-ignore
[$t, $t, $t, resetPasswordForm, resetPasswordForm, rules,];
var __VLS_24;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-24" },
});
/** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    prop: "re_password",
}));
const __VLS_34 = __VLS_33({
    prop: "re_password",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    type: "password",
    size: "large",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.re_password.placeholder')),
    showPassword: true,
}));
const __VLS_40 = __VLS_39({
    type: "password",
    size: "large",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.re_password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
/** @type {__VLS_StyleScopedClasses['input-item']} */ ;
// @ts-ignore
[$t, resetPasswordForm,];
var __VLS_35;
// @ts-ignore
[];
var __VLS_16;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    ...{ 'onClick': {} },
    size: "large",
    type: "primary",
    ...{ class: "w-full" },
}));
const __VLS_45 = __VLS_44({
    ...{ 'onClick': {} },
    size: "large",
    type: "primary",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
let __VLS_48;
const __VLS_49 = {
    /** @type {typeof __VLS_48.click} */
    onClick: (__VLS_ctx.resetPassword),
};
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_50 } = __VLS_46.slots;
(__VLS_ctx.$t('common.confirm'));
// @ts-ignore
[$t, resetPassword,];
var __VLS_46;
var __VLS_47;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate-container mt-12" },
});
/** @type {__VLS_StyleScopedClasses['operate-container']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onClick': {} },
    size: "large",
    ...{ class: "register" },
    link: true,
    type: "primary",
    icon: "ArrowLeft",
}));
const __VLS_53 = __VLS_52({
    ...{ 'onClick': {} },
    size: "large",
    ...{ class: "register" },
    link: true,
    type: "primary",
    icon: "ArrowLeft",
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    /** @type {typeof __VLS_56.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.router.push('/login');
        // @ts-ignore
        [router,];
    },
};
/** @type {__VLS_StyleScopedClasses['register']} */ ;
const { default: __VLS_58 } = __VLS_54.slots;
(__VLS_ctx.$t('views.login.buttons.backLogin'));
// @ts-ignore
[$t,];
var __VLS_54;
var __VLS_55;
// @ts-ignore
[];
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_19 = __VLS_18;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
