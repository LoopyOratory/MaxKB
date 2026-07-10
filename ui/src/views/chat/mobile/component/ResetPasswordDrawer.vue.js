/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import { t } from '@/locales';
import useStore from '@/stores';
import chatAPI from '@/api/chat/chat';
import { useRouter } from 'vue-router';
import { MsgSuccess } from '@/utils/message';
import JSEncrypt from 'jsencrypt';
const router = useRouter();
const { chatUser } = useStore();
const show = defineModel('show', {
    required: true,
});
const resetPasswordFormRef = ref();
const resetPasswordForm = ref({
    password: '',
    re_password: '',
});
const rules = ref({
    password: [
        {
            required: true,
            message: t('views.login.loginForm.new_password.placeholder'),
            trigger: 'blur',
        },
        {
            min: 6,
            max: 20,
            message: t('views.login.loginForm.password.lengthMessage'),
            trigger: 'blur',
        },
    ],
    re_password: [
        {
            required: true,
            message: t('views.login.loginForm.re_password.requiredMessage'),
            trigger: 'blur',
        },
        {
            min: 6,
            max: 20,
            message: t('views.login.loginForm.password.lengthMessage'),
            trigger: 'blur',
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
            trigger: 'blur',
        },
    ],
});
function resetPassword() {
    resetPasswordFormRef.value?.validate().then(() => {
        const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
        const js = new JSEncryptCtor();
        js.setPublicKey(chatUser?.chat_profile?.rsaKey);
        const jsonData = JSON.stringify(resetPasswordForm.value);
        const encryptedBase64 = js.encrypt(jsonData);
        chatAPI.resetCurrentPassword({ encryptedData: encryptedBase64 }).then(() => {
            MsgSuccess(t('common.modifySuccess'));
            router.push({ name: 'login' });
        });
    });
}
let __VLS_modelEmit;
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.show),
    withHeader: (false),
    ...{ class: "reset-password-drawer" },
    size: "100%",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.show),
    withHeader: (false),
    ...{ class: "reset-password-drawer" },
    size: "100%",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['reset-password-drawer']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "navigation flex align-center mb-16" },
});
/** @type {__VLS_StyleScopedClasses['navigation']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    size: "16",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    size: "16",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.show = false;
        // @ts-ignore
        [show, show,];
    },
};
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.ArrowLeftBold} */
ArrowLeftBold;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({
    ...{ class: "mb-16" },
});
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.login.resetPassword'));
let __VLS_20;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    ref: "resetPasswordFormRef",
    model: (__VLS_ctx.resetPasswordForm),
    rules: (__VLS_ctx.rules),
}));
const __VLS_22 = __VLS_21({
    ref: "resetPasswordFormRef",
    model: (__VLS_ctx.resetPasswordForm),
    rules: (__VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_25;
const { default: __VLS_27 } = __VLS_23.slots;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    prop: "password",
}));
const __VLS_30 = __VLS_29({
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    type: "password",
    size: "large",
    modelValue: (__VLS_ctx.resetPasswordForm.password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.new_password.placeholder')),
    showPassword: true,
}));
const __VLS_36 = __VLS_35({
    type: "password",
    size: "large",
    modelValue: (__VLS_ctx.resetPasswordForm.password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.new_password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, $t, resetPasswordForm, resetPasswordForm, rules,];
var __VLS_31;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    prop: "re_password",
}));
const __VLS_41 = __VLS_40({
    prop: "re_password",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    type: "password",
    size: "large",
    modelValue: (__VLS_ctx.resetPasswordForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.re_password.placeholder')),
    showPassword: true,
}));
const __VLS_47 = __VLS_46({
    type: "password",
    size: "large",
    modelValue: (__VLS_ctx.resetPasswordForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.re_password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[$t, resetPasswordForm,];
var __VLS_42;
// @ts-ignore
[];
var __VLS_23;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    ...{ class: "w-full" },
}));
const __VLS_52 = __VLS_51({
    ...{ 'onClick': {} },
    type: "primary",
    size: "large",
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_55;
const __VLS_56 = {
    /** @type {typeof __VLS_55.click} */
    onClick: (__VLS_ctx.resetPassword),
};
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_57 } = __VLS_53.slots;
(__VLS_ctx.$t('aiChat.confirmModification'));
// @ts-ignore
[$t, resetPassword,];
var __VLS_53;
var __VLS_54;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_26 = __VLS_25;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
