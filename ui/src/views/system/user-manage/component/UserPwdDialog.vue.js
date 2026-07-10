/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch } from 'vue';
import useStore from '@/stores';
import userManageApi from '@/api/system/user-manage';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import JSEncrypt from "jsencrypt";
const emit = defineEmits(['refresh']);
const { user } = useStore();
const userFormRef = ref();
const userForm = ref({
    password: '',
    re_password: ''
});
const rules = reactive({
    password: [
        {
            required: true,
            message: t('views.login.loginForm.new_password.requiredMessage'),
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
                if (userFormRef.value.password != userFormRef.value.re_password) {
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
const dialogVisible = ref(false);
const loading = ref(false);
const userId = ref('');
watch(dialogVisible, (bool) => {
    if (!bool) {
        userForm.value = {
            password: '',
            re_password: ''
        };
    }
});
const open = (data) => {
    userId.value = data.id;
    dialogVisible.value = true;
    userFormRef.value?.clearValidate();
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            const JSEncryptCtor = JSEncrypt?.default ? JSEncrypt.default : JSEncrypt;
            const js = new JSEncryptCtor();
            js.setPublicKey(user.rsaKey);
            const jsonData = JSON.stringify(userForm.value);
            const encryptedBase64 = js.encrypt(jsonData);
            userManageApi.putUserManagePassword(userId.value, { encryptedData: encryptedBase64 }, loading).then((res) => {
                emit('refresh');
                user.profile();
                MsgSuccess(t('views.userManage.tip.updatePwdSuccess'));
                dialogVisible.value = false;
            });
        }
    });
};
const __VLS_exposed = { open };
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
    title: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
    modelValue: (__VLS_ctx.dialogVisible),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.userManage.setting.updatePwd')),
    modelValue: (__VLS_ctx.dialogVisible),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    ref: "userFormRef",
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    ref: "userFormRef",
    model: (__VLS_ctx.userForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: (__VLS_ctx.$t('views.login.loginForm.new_password.label')),
    prop: "password",
}));
const __VLS_19 = __VLS_18({
    label: (__VLS_ctx.$t('views.login.loginForm.new_password.label')),
    prop: "password",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    type: "password",
    modelValue: (__VLS_ctx.userForm.password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.new_password.placeholder')),
    showPassword: true,
}));
const __VLS_25 = __VLS_24({
    type: "password",
    modelValue: (__VLS_ctx.userForm.password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.new_password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[$t, $t, $t, dialogVisible, userForm, userForm, rules,];
var __VLS_20;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('views.login.loginForm.re_password.label')),
    prop: "re_password",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('views.login.loginForm.re_password.label')),
    prop: "re_password",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    type: "password",
    modelValue: (__VLS_ctx.userForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.re_password.placeholder')),
    showPassword: true,
}));
const __VLS_36 = __VLS_35({
    type: "password",
    modelValue: (__VLS_ctx.userForm.re_password),
    placeholder: (__VLS_ctx.$t('views.login.loginForm.re_password.placeholder')),
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, $t, userForm,];
var __VLS_31;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_39 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onClick': {} },
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_47 } = __VLS_43.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_43;
    var __VLS_44;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.userFormRef);
            // @ts-ignore
            [loading, submit, userFormRef,];
        },
    };
    const { default: __VLS_55 } = __VLS_51.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_51;
    var __VLS_52;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
