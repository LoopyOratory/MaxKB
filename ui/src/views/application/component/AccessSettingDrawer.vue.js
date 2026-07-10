/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import { MsgError, MsgSuccess } from '@/utils/message';
import { copyClick } from '@/utils/clipboard';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const emit = defineEmits(['refresh']);
const formRef = ref();
const visible = ref(false);
const loading = ref(false);
const dataLoaded = ref(false);
const configType = ref('wechat');
const form = reactive({
    wechat: {
        app_id: '',
        app_secret: '',
        token: '',
        encoding_aes_key: '',
        is_certification: false,
        callback_url: '',
    },
    dingtalk: { client_id: '', client_secret: '', callback_url: '' },
    wecom: {
        app_id: '',
        agent_id: '',
        secret: '',
        token: '',
        encoding_aes_key: '',
        callback_url: '',
    },
    lark: { app_id: '', app_secret: '', verification_token: '', callback_url: '' },
    slack: { signing_secret: '', bot_user_token: '', callback_url: '' },
    wecomBot: {
        token: '',
        encoding_aes_key: '',
        callback_url: '',
    },
});
const rules = reactive({
    wechat: {
        app_id: [
            {
                required: true,
                message: t('views.application.applicationAccess.wechatSetting.appIdPlaceholder'),
                trigger: 'blur',
            },
        ],
        app_secret: [
            {
                required: true,
                message: t('views.application.applicationAccess.wechatSetting.appSecretPlaceholder'),
                trigger: 'blur',
            },
        ],
        token: [
            {
                required: true,
                message: t('views.application.applicationAccess.wechatSetting.tokenPlaceholder'),
                trigger: 'blur',
            },
        ],
        encoding_aes_key: [
            {
                required: true,
                message: t('views.application.applicationAccess.wechatSetting.aesKeyPlaceholder'),
                trigger: 'blur',
            },
        ],
    },
    dingtalk: {
        client_id: [
            {
                required: true,
                message: t('views.application.applicationAccess.dingtalkSetting.clientIdPlaceholder'),
                trigger: 'blur',
            },
        ],
        client_secret: [
            {
                required: true,
                message: t('views.application.applicationAccess.dingtalkSetting.clientSecretPlaceholder'),
                trigger: 'blur',
            },
        ],
    },
    wecom: {
        app_id: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.cropIdPlaceholder'),
                trigger: 'blur',
            },
        ],
        agent_id: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.agentIdPlaceholder'),
                trigger: 'blur',
            },
        ],
        secret: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.secretPlaceholder'),
                trigger: 'blur',
            },
        ],
        token: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.tokenPlaceholder'),
                trigger: 'blur',
            },
        ],
        encoding_aes_key: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.encodingAesKeyPlaceholder'),
                trigger: 'blur',
            },
        ],
    },
    lark: {
        app_id: [
            {
                required: true,
                message: t('views.application.applicationAccess.larkSetting.appIdPlaceholder'),
                trigger: 'blur',
            },
        ],
        app_secret: [
            {
                required: true,
                message: t('views.application.applicationAccess.larkSetting.appSecretPlaceholder'),
                trigger: 'blur',
            },
        ],
        verification_token: [
            {
                required: false,
                message: t('views.application.applicationAccess.larkSetting.verificationTokenPlaceholder'),
                trigger: 'blur',
            },
        ],
    },
    slack: {
        signing_secret: [
            {
                required: true,
                message: t('views.application.applicationAccess.slackSetting.signingSecretPlaceholder'),
                trigger: 'blur',
            },
        ],
        bot_user_token: [
            {
                required: true,
                message: t('views.application.applicationAccess.slackSetting.botUserTokenPlaceholder'),
                trigger: 'blur',
            },
        ],
    },
    wecomBot: {
        token: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.tokenPlaceholder'),
                trigger: 'blur',
            },
        ],
        encoding_aes_key: [
            {
                required: true,
                message: t('views.application.applicationAccess.wecomSetting.encodingAesKeyPlaceholder'),
                trigger: 'blur',
            },
        ],
    },
});
const configFields = {
    wechat: {
        app_id: {
            label: t('views.application.applicationAccess.wechatSetting.appId'),
            placeholder: '',
        },
        app_secret: {
            label: t('views.application.applicationAccess.wechatSetting.appSecret'),
            placeholder: '',
        },
        token: { label: t('views.application.applicationAccess.wechatSetting.token'), placeholder: '' },
        encoding_aes_key: {
            label: t('views.application.applicationAccess.wechatSetting.aesKey'),
            placeholder: '',
        },
    },
    dingtalk: {
        client_id: { label: 'Client ID', placeholder: '' },
        client_secret: { label: 'Client Secret', placeholder: '' },
    },
    wecom: {
        app_id: {
            label: t('views.application.applicationAccess.wecomSetting.cropId'),
            placeholder: '',
        },
        agent_id: { label: 'Agent ID', placeholder: '' },
        secret: { label: 'Secret', placeholder: '' },
        token: { label: 'Token', placeholder: '' },
        encoding_aes_key: { label: 'EncodingAESKey', placeholder: '' },
    },
    wecomBot: {
        token: { label: 'Token', placeholder: '' },
        encoding_aes_key: { label: 'EncodingAESKey', placeholder: '' },
    },
    lark: {
        app_id: { label: 'App ID', placeholder: '' },
        app_secret: { label: 'App Secret', placeholder: '' },
        verification_token: { label: 'Verification Token', placeholder: '' },
    },
    slack: {
        signing_secret: { label: 'Signing Secret', placeholder: '' },
        bot_user_token: { label: 'Bot User Token', placeholder: '' },
    },
};
const passwordFields = new Set([
    'app_secret',
    'client_secret',
    'secret',
    'bot_user_token',
    'signing_secret',
]);
const drawerTitle = computed(() => ({
    wechat: t('views.application.applicationAccess.wechatSetting.title'),
    dingtalk: t('views.application.applicationAccess.dingtalkSetting.title'),
    wecom: t('views.application.applicationAccess.wecomSetting.title'),
    lark: t('views.application.applicationAccess.larkSetting.title'),
    slack: t('views.application.applicationAccess.slackSetting.title'),
    wecomBot: t('views.application.applicationAccess.wecomBotSetting.title'),
})[configType.value]);
const infoTitle = computed(() => ({
    wechat: t('common.info'),
    dingtalk: t('common.info'),
    wecom: t('common.info'),
    lark: t('common.info'),
    slack: t('common.info'),
    wecomBot: t('common.info'),
})[configType.value]);
const passwordVisible = reactive(Object.keys(configFields[configType.value]).reduce((acc, key) => {
    if (passwordFields.has(key)) {
        acc[key] = false;
    }
    return acc;
}, {}));
const isPasswordField = (key) => passwordFields.has(key);
const closeDrawer = () => {
    visible.value = false;
};
const submit = async () => {
    if (loading.value)
        return;
    formRef.value?.validate(async (valid) => {
        if (valid) {
            try {
                loadSharedApi({ type: 'application', systemType: apiType.value })
                    .updatePlatformConfig(id, configType.value, form[configType.value], loading)
                    .then(() => {
                    MsgSuccess(t('common.saveSuccess'));
                    closeDrawer();
                    emit('refresh');
                });
            }
            catch {
                MsgError(t('views.application.tip.saveErrorMessage'));
            }
        }
    });
};
const open = async (id, type) => {
    visible.value = true;
    configType.value = type;
    loading.value = true;
    dataLoaded.value = false;
    formRef.value?.resetFields();
    try {
        const res = await loadSharedApi({
            type: 'application',
            systemType: apiType.value,
        }).getPlatformConfig(id, type);
        if (res.data) {
            form[configType.value] = res.data;
        }
        dataLoaded.value = true;
    }
    catch {
        MsgError(t('views.application.tip.loadingErrorMessage'));
    }
    finally {
        loading.value = false;
        form[configType.value].callback_url =
            `${window.location.origin}${window.MaxKB.prefix}/api/chat/${type}/${id}`;
    }
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
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    appendToBody: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    size: "60%",
    appendToBody: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.drawerTitle);
    // @ts-ignore
    [visible, drawerTitle,];
}
if (__VLS_ctx.dataLoaded) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ref: "formRef",
        model: (__VLS_ctx.form[__VLS_ctx.configType]),
        labelWidth: "120px",
        rules: (__VLS_ctx.rules[__VLS_ctx.configType]),
        labelPosition: "top",
        requireAsteriskPosition: "right",
    }));
    const __VLS_10 = __VLS_9({
        ref: "formRef",
        model: (__VLS_ctx.form[__VLS_ctx.configType]),
        labelWidth: "120px",
        rules: (__VLS_ctx.rules[__VLS_ctx.configType]),
        labelPosition: "top",
        requireAsteriskPosition: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    var __VLS_13;
    const { default: __VLS_15 } = __VLS_11.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    (__VLS_ctx.infoTitle);
    for (const [item, key] of __VLS_vFor((__VLS_ctx.configFields[__VLS_ctx.configType]))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (key),
        });
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            label: (item.label),
            prop: (key),
        }));
        const __VLS_18 = __VLS_17({
            label: (item.label),
            prop: (key),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        const { default: __VLS_21 } = __VLS_19.slots;
        let __VLS_22;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
            modelValue: (__VLS_ctx.form[__VLS_ctx.configType][key]),
            type: (__VLS_ctx.isPasswordField(key) ? (__VLS_ctx.passwordVisible[key] ? 'text' : 'password') : 'text'),
            placeholder: (item.placeholder),
            showPassword: (__VLS_ctx.isPasswordField(key)),
        }));
        const __VLS_24 = __VLS_23({
            modelValue: (__VLS_ctx.form[__VLS_ctx.configType][key]),
            type: (__VLS_ctx.isPasswordField(key) ? (__VLS_ctx.passwordVisible[key] ? 'text' : 'password') : 'text'),
            placeholder: (item.placeholder),
            showPassword: (__VLS_ctx.isPasswordField(key)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_23));
        // @ts-ignore
        [dataLoaded, form, form, configType, configType, configType, configType, rules, infoTitle, configFields, isPasswordField, isPasswordField, passwordVisible,];
        var __VLS_19;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.configType === 'wechat') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "lighter mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        (__VLS_ctx.$t('views.application.applicationAccess.wecomSetting.authenticationSuccessful'));
        if (__VLS_ctx.configType === 'wechat') {
            let __VLS_27;
            /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
            elSwitch;
            // @ts-ignore
            const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
                modelValue: (__VLS_ctx.form[__VLS_ctx.configType].is_certification),
            }));
            const __VLS_29 = __VLS_28({
                modelValue: (__VLS_ctx.form[__VLS_ctx.configType].is_certification),
            }, ...__VLS_functionalComponentArgsRest(__VLS_28));
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    (__VLS_ctx.$t('views.application.applicationAccess.callback'));
    let __VLS_32;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
        label: "URL",
        prop: "callback_url",
    }));
    const __VLS_34 = __VLS_33({
        label: "URL",
        prop: "callback_url",
    }, ...__VLS_functionalComponentArgsRest(__VLS_33));
    const { default: __VLS_37 } = __VLS_35.slots;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        modelValue: (__VLS_ctx.form[__VLS_ctx.configType].callback_url),
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.callbackTip')),
        readonly: true,
    }));
    const __VLS_40 = __VLS_39({
        modelValue: (__VLS_ctx.form[__VLS_ctx.configType].callback_url),
        placeholder: (__VLS_ctx.$t('views.application.applicationAccess.callbackTip')),
        readonly: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    const { default: __VLS_43 } = __VLS_41.slots;
    {
        const { append: __VLS_44 } = __VLS_41.slots;
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            ...{ 'onClick': {} },
        }));
        const __VLS_47 = __VLS_46({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        let __VLS_50;
        const __VLS_51 = {
            /** @type {typeof __VLS_50.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.dataLoaded))
                    throw 0;
                return __VLS_ctx.copyClick(__VLS_ctx.form[__VLS_ctx.configType].callback_url);
                // @ts-ignore
                [form, form, form, configType, configType, configType, configType, configType, $t, $t, $t, copyClick,];
            },
        };
        const { default: __VLS_52 } = __VLS_48.slots;
        let __VLS_53;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
            iconName: "app-copy",
        }));
        const __VLS_55 = __VLS_54({
            iconName: "app-copy",
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        // @ts-ignore
        [];
        var __VLS_48;
        var __VLS_49;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_41;
    if (__VLS_ctx.configType === 'wechat') {
        let __VLS_58;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
            type: "info",
        }));
        const __VLS_60 = __VLS_59({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        const { default: __VLS_63 } = __VLS_61.slots;
        (__VLS_ctx.$t('views.application.applicationAccess.copyUrl'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
            ...{ class: "color-primary" },
            href: "https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev",
            target: "_blank",
        });
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        (__VLS_ctx.$t('views.application.applicationAccess.wechatPlatform'));
        (__VLS_ctx.$t('views.application.applicationAccess.wechatSetting.urlInfo'));
        // @ts-ignore
        [configType, $t, $t, $t,];
        var __VLS_61;
    }
    if (__VLS_ctx.configType === 'dingtalk') {
        let __VLS_64;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
            type: "info",
        }));
        const __VLS_66 = __VLS_65({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_65));
        const { default: __VLS_69 } = __VLS_67.slots;
        (__VLS_ctx.$t('views.application.applicationAccess.copyUrl'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
            ...{ class: "color-primary" },
            href: "https://open-dev.dingtalk.com/fe/app?hash=%23%2Fcorp%2Fapp#/corp/app",
            target: "_blank",
        });
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        (__VLS_ctx.$t('views.application.applicationAccess.dingtalkPlatform'));
        (__VLS_ctx.$t('views.application.applicationAccess.dingtalkSetting.urlInfo'));
        // @ts-ignore
        [configType, $t, $t, $t,];
        var __VLS_67;
    }
    if (__VLS_ctx.configType === 'wecom') {
        let __VLS_70;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
            type: "info",
        }));
        const __VLS_72 = __VLS_71({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_71));
        const { default: __VLS_75 } = __VLS_73.slots;
        (__VLS_ctx.$t('views.application.applicationAccess.copyUrl'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
            ...{ class: "color-primary" },
            href: "https://work.weixin.qq.com/wework_admin/frame#apps",
            target: "_blank",
        });
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        (__VLS_ctx.$t('views.application.applicationAccess.wecomPlatform'));
        (__VLS_ctx.$t('views.application.applicationAccess.wecomSetting.urlInfo'));
        // @ts-ignore
        [configType, $t, $t, $t,];
        var __VLS_73;
    }
    if (__VLS_ctx.configType === 'lark') {
        let __VLS_76;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            type: "info",
        }));
        const __VLS_78 = __VLS_77({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        const { default: __VLS_81 } = __VLS_79.slots;
        (__VLS_ctx.$t('views.application.applicationAccess.copyUrl'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
            ...{ class: "color-primary" },
            href: "https://open.feishu.cn/app/",
            target: "_blank",
        });
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        (__VLS_ctx.$t('views.application.applicationAccess.larkPlatform'));
        (__VLS_ctx.$t('views.application.applicationAccess.larkSetting.urlInfo'));
        // @ts-ignore
        [configType, $t, $t, $t,];
        var __VLS_79;
    }
    if (__VLS_ctx.configType === 'wecomBot') {
        let __VLS_82;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            type: "info",
        }));
        const __VLS_84 = __VLS_83({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        const { default: __VLS_87 } = __VLS_85.slots;
        (__VLS_ctx.$t('views.application.applicationAccess.copyUrl'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
            ...{ class: "color-primary" },
            href: "https://work.weixin.qq.com/wework_admin/frame#/manageTools",
            target: "_blank",
        });
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        (__VLS_ctx.$t('views.application.applicationAccess.wecomPlatform'));
        (__VLS_ctx.$t('views.application.applicationAccess.wecomBotSetting.urlInfo'));
        // @ts-ignore
        [configType, $t, $t, $t,];
        var __VLS_85;
    }
    // @ts-ignore
    [];
    var __VLS_35;
    // @ts-ignore
    [];
    var __VLS_11;
}
{
    const { footer: __VLS_88 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_89;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
        ...{ 'onClick': {} },
    }));
    const __VLS_91 = __VLS_90({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    let __VLS_94;
    const __VLS_95 = {
        /** @type {typeof __VLS_94.click} */
        onClick: (__VLS_ctx.closeDrawer),
    };
    const { default: __VLS_96 } = __VLS_92.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, closeDrawer,];
    var __VLS_92;
    var __VLS_93;
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_99 = __VLS_98({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    let __VLS_102;
    const __VLS_103 = {
        /** @type {typeof __VLS_102.click} */
        onClick: (__VLS_ctx.submit),
    };
    const { default: __VLS_104 } = __VLS_100.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t, loading, submit,];
    var __VLS_100;
    var __VLS_101;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_14 = __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
