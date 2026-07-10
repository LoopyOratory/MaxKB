/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onBeforeMount, ref } from 'vue';
import LoginContainer from '@/layout/login-layout/LoginContainer.vue';
import LoginLayout from '@/layout/login-layout/LoginLayout.vue';
import { useRouter } from 'vue-router';
import UserApi from '@/api/user/user';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
const router = useRouter();
const { theme, user } = useStore();
const CheckEmailForm = ref({
    email: '',
    code: '',
    type: 'reset_password',
});
const resetPasswordFormRef = ref();
const rules = ref({
    email: [
        {
            required: true,
            message: t('views.login.loginForm.email.requiredMessage'),
            trigger: 'blur',
        },
        {
            validator: (rule, value, callback) => {
                const emailRegExp = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
                if (!emailRegExp.test(value) && value != '') {
                    callback(new Error(t('views.login.loginForm.email.validatorEmail')));
                }
                else {
                    callback();
                }
            },
            trigger: 'blur',
        },
    ],
    code: [{ required: true, message: t('views.login.verificationCode.placeholder') }],
});
const loading = ref(false);
const isDisabled = ref(false);
const time = ref(60);
const sendLoading = ref(false);
const checkCode = () => {
    resetPasswordFormRef.value
        ?.validate()
        .then(() => UserApi.checkCode(CheckEmailForm.value, sendLoading))
        .then(() => router.push({ name: 'ResetPassword', params: CheckEmailForm.value }));
};
/**
 * SendVerifyCode
 */
const sendEmail = () => {
    resetPasswordFormRef.value?.validateField('email', (v) => {
        if (v) {
            UserApi.sendEmit(CheckEmailForm.value.email, 'reset_password', sendLoading).then(() => {
                MsgSuccess(t('views.login.verificationCode.successMessage'));
                isDisabled.value = true;
                handleTimeChange();
            });
        }
    });
};
const handleTimeChange = () => {
    if (time.value <= 0) {
        isDisabled.value = false;
        time.value = 60;
    }
    else {
        setTimeout(() => {
            time.value--;
            handleTimeChange();
        }, 1000);
    }
};
onBeforeMount(() => {
    loading.value = true;
    user.asyncGetProfile().then(() => {
        loading.value = false;
    });
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
if (!__VLS_ctx.loading) {
    const __VLS_0 = LoginLayout || LoginLayout;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading || __VLS_ctx.sendLoading) }, null, null);
    var __VLS_5;
    const { default: __VLS_6 } = __VLS_3.slots;
    const __VLS_7 = LoginContainer || LoginContainer;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        subTitle: (__VLS_ctx.theme.themeInfo?.slogan ? __VLS_ctx.theme.themeInfo?.slogan : __VLS_ctx.$t('theme.defaultSlogan')),
    }));
    const __VLS_9 = __VLS_8({
        subTitle: (__VLS_ctx.theme.themeInfo?.slogan ? __VLS_ctx.theme.themeInfo?.slogan : __VLS_ctx.$t('theme.defaultSlogan')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
        ...{ class: "mb-24" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
    (__VLS_ctx.$t('views.login.forgotPassword'));
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        ...{ class: "register-form" },
        ref: "resetPasswordFormRef",
        model: (__VLS_ctx.CheckEmailForm),
        rules: (__VLS_ctx.rules),
    }));
    const __VLS_15 = __VLS_14({
        ...{ class: "register-form" },
        ref: "resetPasswordFormRef",
        model: (__VLS_ctx.CheckEmailForm),
        rules: (__VLS_ctx.rules),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    var __VLS_18;
    /** @type {__VLS_StyleScopedClasses['register-form']} */ ;
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
        prop: "email",
    }));
    const __VLS_23 = __VLS_22({
        prop: "email",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    const { default: __VLS_26 } = __VLS_24.slots;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        size: "large",
        ...{ class: "input-item" },
        modelValue: (__VLS_ctx.CheckEmailForm.email),
        placeholder: (__VLS_ctx.$t('views.login.loginForm.email.placeholder')),
    }));
    const __VLS_29 = __VLS_28({
        size: "large",
        ...{ class: "input-item" },
        modelValue: (__VLS_ctx.CheckEmailForm.email),
        placeholder: (__VLS_ctx.$t('views.login.loginForm.email.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    /** @type {__VLS_StyleScopedClasses['input-item']} */ ;
    // @ts-ignore
    [loading, loading, vLoading, sendLoading, theme, theme, $t, $t, $t, CheckEmailForm, CheckEmailForm, rules,];
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
        prop: "code",
    }));
    const __VLS_34 = __VLS_33({
        prop: "code",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        size: "large",
        ...{ class: "code-input" },
        modelValue: (__VLS_ctx.CheckEmailForm.code),
        placeholder: (__VLS_ctx.$t('views.login.verificationCode.placeholder')),
    }));
    const __VLS_40 = __VLS_39({
        size: "large",
        ...{ class: "code-input" },
        modelValue: (__VLS_ctx.CheckEmailForm.code),
        placeholder: (__VLS_ctx.$t('views.login.verificationCode.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    /** @type {__VLS_StyleScopedClasses['code-input']} */ ;
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.isDisabled),
        size: "large",
        ...{ class: "send-email-button ml-12" },
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.isDisabled),
        size: "large",
        ...{ class: "send-email-button ml-12" },
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.click} */
        onClick: (__VLS_ctx.sendEmail),
    };
    /** @type {__VLS_StyleScopedClasses['send-email-button']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-12']} */ ;
    const { default: __VLS_50 } = __VLS_46.slots;
    (__VLS_ctx.isDisabled
        ? `${__VLS_ctx.$t('views.login.verificationCode.resend')}（${__VLS_ctx.time}s）`
        : __VLS_ctx.$t('views.login.verificationCode.getVerificationCode'));
    // @ts-ignore
    [loading, $t, $t, $t, CheckEmailForm, isDisabled, isDisabled, sendEmail, time,];
    var __VLS_46;
    var __VLS_47;
    // @ts-ignore
    [];
    var __VLS_35;
    // @ts-ignore
    [];
    var __VLS_16;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
        size: "large",
        type: "primary",
        ...{ class: "w-full" },
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
        size: "large",
        type: "primary",
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (__VLS_ctx.checkCode),
    };
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_58 } = __VLS_54.slots;
    (__VLS_ctx.$t('views.login.buttons.checkCode'));
    // @ts-ignore
    [$t, checkCode,];
    var __VLS_54;
    var __VLS_55;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "operate-container mt-12" },
    });
    /** @type {__VLS_StyleScopedClasses['operate-container']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        ...{ class: "register" },
        link: true,
        type: "primary",
        icon: "ArrowLeft",
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        ...{ class: "register" },
        link: true,
        type: "primary",
        icon: "ArrowLeft",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.loading))
                throw 0;
            return __VLS_ctx.router.push('/login');
            // @ts-ignore
            [router,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['register']} */ ;
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('views.login.buttons.backLogin'));
    // @ts-ignore
    [$t,];
    var __VLS_62;
    var __VLS_63;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
var __VLS_19 = __VLS_18;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
