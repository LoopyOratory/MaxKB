/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref } from 'vue';
import platformApi from '@/api/system-settings/platform-source';
import { MsgError, MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
const visible = ref(false);
const loading = ref(false);
const formRef = ref();
const currentPlatform = reactive({
    key: '',
    logoSrc: '',
    name: '',
    isActive: false,
    isValid: false,
    config: {}
});
const formatFieldName = (key) => {
    const fieldNames = {
        corp_id: 'Corp ID',
        app_key: currentPlatform?.key != 'lark' ? 'APP Key' : 'App ID',
        app_secret: 'APP Secret',
        agent_id: 'Agent ID',
        callback_url: t('views.application.applicationAccess.callback')
    };
    return (fieldNames[key] ||
        (key ? key.charAt(0).toUpperCase() + key.slice(1) : ''));
};
const getValidationRules = (key) => {
    switch (key) {
        case 'app_key':
            return [
                {
                    required: true,
                    message: t('views.system.authentication.scanTheQRCode.appKeyPlaceholder'),
                    trigger: ['blur', 'change']
                }
            ];
        case 'app_secret':
            return [
                {
                    required: true,
                    message: t('views.system.authentication.scanTheQRCode.appSecretPlaceholder'),
                    trigger: ['blur', 'change']
                }
            ];
        case 'corp_id':
            return [
                {
                    required: true,
                    message: t('views.system.authentication.scanTheQRCode.corpIdPlaceholder'),
                    trigger: ['blur', 'change']
                }
            ];
        case 'agent_id':
            return [
                {
                    required: true,
                    message: t('views.system.authentication.scanTheQRCode.agentIdPlaceholder'),
                    trigger: ['blur', 'change']
                }
            ];
        case 'callback_url':
            return [
                {
                    required: true,
                    message: t('views.application.applicationAccess.callbackTip'),
                    trigger: ['blur', 'change']
                },
                {
                    pattern: /^https?:\/\/.+/,
                    message: t('views.system.authentication.scanTheQRCode.callbackWarning'),
                    trigger: ['blur', 'change']
                }
            ];
        default:
            return [];
    }
};
const open = async (platform) => {
    visible.value = true;
    loading.value = true;
    Object.assign(currentPlatform, platform);
    // SettingsDefault callback_url
    const defaultCallbackUrl = window.location.origin + window.MaxKB.prefix;
    switch (platform.key) {
        case 'wecom':
            if (currentPlatform.config.app_key) {
                currentPlatform.config.agent_id = currentPlatform.config.app_key;
                delete currentPlatform.config.app_key;
            }
            currentPlatform.config.callback_url = `${defaultCallbackUrl}/api/wecom`;
            break;
        case 'dingtalk':
            if (currentPlatform.config.agent_id) {
                currentPlatform.config.corp_id = currentPlatform.config.agent_id;
                delete currentPlatform.config.agent_id;
            }
            currentPlatform.config = {
                corp_id: currentPlatform.config.corp_id,
                app_key: currentPlatform.config.app_key,
                app_secret: currentPlatform.config.app_secret,
                callback_url: defaultCallbackUrl
            };
            currentPlatform.config.callback_url = `${defaultCallbackUrl}/api/dingtalk`;
            break;
        case 'lark':
            currentPlatform.config.callback_url = `${defaultCallbackUrl}/api/lark`;
            break;
        default:
            break;
    }
    formRef.value?.clearValidate();
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
const validateForm = () => {
    formRef.value?.validate((valid) => {
        if (valid) {
            saveConfig();
        }
        else {
            MsgError(t('views.system.authentication.scanTheQRCode.validateFailedTip'));
        }
    });
};
const handleClose = () => {
    visible.value = false;
    formRef.value?.clearValidate();
    emit('refresh');
};
function validateConnection() {
    platformApi.validateConnection(currentPlatform, loading).then((res) => {
        if (res.data) {
            MsgSuccess(t('views.system.authentication.scanTheQRCode.validateSuccess'));
        }
        else {
            MsgError(t('views.system.authentication.scanTheQRCode.validateFailed'));
        }
    });
}
const passwordFields = new Set(['app_secret', 'client_secret', 'secret']);
const isPasswordField = (key) => passwordFields.has(key);
const emit = defineEmits(['refresh']);
function saveConfig() {
    platformApi.updateConfig(currentPlatform, loading).then((res) => {
        MsgSuccess(t('common.saveSuccess'));
        emit('refresh');
        visible.value = false;
        formRef.value?.clearValidate();
    });
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    appendToBody: (true),
    destroyOnClose: (true),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClose': {} },
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    appendToBody: (true),
    destroyOnClose: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.close} */
    onClose: (__VLS_ctx.handleClose),
};
var __VLS_7;
const { default: __VLS_8 } = __VLS_3.slots;
{
    const { header: __VLS_9 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.currentPlatform.name + __VLS_ctx.$t('views.system.authentication.scanTheQRCode.setting'));
    // @ts-ignore
    [visible, handleClose, currentPlatform, $t,];
}
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    model: (__VLS_ctx.currentPlatform.config),
    labelWidth: "120px",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "formRef",
}));
const __VLS_12 = __VLS_11({
    model: (__VLS_ctx.currentPlatform.config),
    labelWidth: "120px",
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "formRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
var __VLS_15;
const { default: __VLS_17 } = __VLS_13.slots;
for (const [value, key] of __VLS_vFor((__VLS_ctx.currentPlatform.config))) {
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        key: (key),
        label: (__VLS_ctx.formatFieldName(key)),
        prop: (key),
        rules: (__VLS_ctx.getValidationRules(key)),
    }));
    const __VLS_20 = __VLS_19({
        key: (key),
        label: (__VLS_ctx.formatFieldName(key)),
        prop: (key),
        rules: (__VLS_ctx.getValidationRules(key)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const { default: __VLS_23 } = __VLS_21.slots;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        modelValue: (__VLS_ctx.currentPlatform.config[key]),
        type: (__VLS_ctx.isPasswordField(key) ? 'password' : 'text'),
        showPassword: (__VLS_ctx.isPasswordField(key)),
    }));
    const __VLS_26 = __VLS_25({
        modelValue: (__VLS_ctx.currentPlatform.config[key]),
        type: (__VLS_ctx.isPasswordField(key) ? 'password' : 'text'),
        showPassword: (__VLS_ctx.isPasswordField(key)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    // @ts-ignore
    [currentPlatform, currentPlatform, currentPlatform, formatFieldName, getValidationRules, isPasswordField, isPasswordField,];
    var __VLS_21;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_13;
{
    const { footer: __VLS_29 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onClick': {} },
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.click} */
        onClick: (__VLS_ctx.handleClose),
    };
    const { default: __VLS_37 } = __VLS_33.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [handleClose, $t,];
    var __VLS_33;
    var __VLS_34;
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
        onClick: (__VLS_ctx.validateConnection),
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    (__VLS_ctx.$t('views.system.authentication.scanTheQRCode.validate'));
    // @ts-ignore
    [$t, validateConnection,];
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
        onClick: (__VLS_ctx.validateForm),
    };
    const { default: __VLS_53 } = __VLS_49.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, validateForm,];
    var __VLS_49;
    var __VLS_50;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_16 = __VLS_15;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
