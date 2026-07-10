/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
import UserApi from '@/api/user/user';
import useStore from '@/stores';
import { useRouter } from 'vue-router';
import { t } from '@/locales';
import JSEncrypt from "jsencrypt";
const props = defineProps();
const emit = defineEmits();
const router = useRouter();
const { login, user } = useStore();
const resetPasswordDialog = ref(false);
const resetPasswordForm = ref({
    code: '',
    password: '',
    re_password: '',
});
const resetPasswordFormRef1 = ref();
const resetPasswordFormRef2 = ref();
const loading = ref(false);
const isDisabled = ref(false);
const time = ref(60);
const rules1 = ref({
    password: [
        {
            required: true,
            message: t('views.login.enterPassword'),
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
const open = () => {
    resetPasswordForm.value = {
        //code: '',
        password: '',
        re_password: '',
    };
    resetPasswordDialog.value = true;
    resetPasswordFormRef1.value?.resetFields();
    resetPasswordFormRef2.value?.resetFields();
};
const resetPassword = () => {
    resetPasswordFormRef1.value?.validate().then(() => {
        if (props.emitConfirm) {
            emit('confirm', resetPasswordForm.value);
        }
        else {
            const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
            const js = new JSEncryptCtor();
            js.setPublicKey(user.rsaKey);
            const jsonData = JSON.stringify(resetPasswordForm.value);
            const encryptedBase64 = js.encrypt(jsonData);
            return UserApi.resetCurrentPassword({ encryptedData: encryptedBase64 }).then(() => {
                login.logout();
                router.push({ name: 'login' });
            });
        }
    });
};
const close = () => {
    resetPasswordDialog.value = false;
};
const __VLS_exposed = { open, close };
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
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.resetPasswordDialog),
    title: (__VLS_ctx.$t('views.login.resetPassword')),
    destroyOnClose: true,
    appendToBody: true,
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.resetPasswordDialog),
    title: (__VLS_ctx.$t('views.login.resetPassword')),
    destroyOnClose: true,
    appendToBody: true,
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "reset-password-form" },
    ref: "resetPasswordFormRef1",
    model: (__VLS_ctx.resetPasswordForm),
    rules: (__VLS_ctx.rules1),
}));
const __VLS_9 = __VLS_8({
    ...{ class: "reset-password-form" },
    ref: "resetPasswordFormRef1",
    model: (__VLS_ctx.resetPasswordForm),
    rules: (__VLS_ctx.rules1),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
/** @type {__VLS_StyleScopedClasses['reset-password-form']} */ ;
const { default: __VLS_14 } = __VLS_10.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-8 lighter" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.login.newPassword'));
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    prop: "password",
    ...{ style: {} },
}));
const __VLS_17 = __VLS_16({
    prop: "password",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    type: "password",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.password),
    placeholder: (__VLS_ctx.$t('views.login.enterPassword')),
    showPassword: true,
}));
const __VLS_23 = __VLS_22({
    type: "password",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.password),
    placeholder: (__VLS_ctx.$t('views.login.enterPassword')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
/** @type {__VLS_StyleScopedClasses['input-item']} */ ;
// @ts-ignore
[resetPasswordDialog, $t, $t, $t, resetPasswordForm, resetPasswordForm, rules1,];
var __VLS_18;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    prop: "re_password",
}));
const __VLS_28 = __VLS_27({
    prop: "re_password",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    type: "password",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.enterPassword')),
    showPassword: true,
}));
const __VLS_34 = __VLS_33({
    type: "password",
    ...{ class: "input-item" },
    modelValue: (__VLS_ctx.resetPasswordForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.enterPassword')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
/** @type {__VLS_StyleScopedClasses['input-item']} */ ;
// @ts-ignore
[$t, resetPasswordForm,];
var __VLS_29;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_37 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        ...{ 'onClick': {} },
    }));
    const __VLS_40 = __VLS_39({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    const __VLS_44 = {
        /** @type {typeof __VLS_43.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.resetPasswordDialog = false;
            // @ts-ignore
            [resetPasswordDialog,];
        },
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_41;
    var __VLS_42;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_51;
    const __VLS_52 = {
        /** @type {typeof __VLS_51.click} */
        onClick: (__VLS_ctx.resetPassword),
    };
    const { default: __VLS_53 } = __VLS_49.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, resetPassword,];
    var __VLS_49;
    var __VLS_50;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __typeProps: {},
});
export default {};
