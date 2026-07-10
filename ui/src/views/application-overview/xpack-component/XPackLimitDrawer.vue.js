/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { copyClick } from '@/utils/clipboard';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const router = useRouter();
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
const auth_list = ref([]);
const limitFormRef = ref();
const form = ref({
    access_num: 0,
    white_active: true,
    white_list: '',
    authentication_value: {
        type: 'password',
        max_attempts: 1,
    },
    authentication: false,
});
const dialogVisible = ref(false);
const loading = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            access_num: 0,
            white_active: true,
            white_list: '',
        };
    }
});
const open = (data) => {
    form.value.access_num = data.access_num;
    form.value.white_active = data.white_active;
    form.value.white_list = data.white_list?.length ? data.white_list?.join('\n') : '';
    form.value.authentication_value = data.authentication_value || {
        type: 'password',
    };
    if (form.value.authentication_value.type === 'password' &&
        !form.value.authentication_value.password_value) {
        refreshAuthentication();
    }
    if (!form.value.authentication_value.max_attempts) {
        form.value.authentication_value.max_attempts = 1;
    }
    form.value.authentication = data.authentication;
    dialogVisible.value = true;
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getChatUserAuthType()
        .then((ok) => {
        auth_list.value = ok.data;
    });
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            const obj = {
                white_list: form.value.white_list ? form.value.white_list.split('\n') : [],
                white_active: form.value.white_active,
                access_num: form.value.access_num,
                authentication: form.value.authentication,
                authentication_value: form.value.authentication_value,
            };
            loadSharedApi({ type: 'application', systemType: apiType.value })
                .putAccessToken(id, obj, loading)
                .then(() => {
                emit('refresh');
                MsgSuccess(t('common.settingSuccess'));
                dialogVisible.value = false;
            });
        }
    });
};
function generateAuthenticationValue(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = new Uint8Array(length);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues)
        .map((value) => chars[value % chars.length])
        .join('');
}
function refreshAuthentication() {
    form.value.authentication_value.password_value = generateAuthenticationValue();
}
function firstGeneration() {
    if (form.value.authentication && !form.value.authentication_value.password_value) {
        form.value.authentication_value = {
            type: 'password',
            password_value: generateAuthenticationValue(),
        };
        if (!form.value.authentication_value.max_attempts) {
            form.value.authentication_value.max_attempts = 1;
        }
    }
}
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
    modelValue: (__VLS_ctx.dialogVisible),
    size: "60%",
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.dialogVisible),
    size: "60%",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.applicationOverview.appInfo.accessControl'));
    // @ts-ignore
    [dialogVisible, $t,];
}
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    labelPosition: "top",
    ref: "limitFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_10 = __VLS_9({
    labelPosition: "top",
    ref: "limitFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
var __VLS_13;
const { default: __VLS_15 } = __VLS_11.slots;
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.clientQueryLimitLabel')),
}));
const __VLS_18 = __VLS_17({
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.clientQueryLimitLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.access_num),
    min: (0),
    step: (1),
    max: (10000000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ style: {} },
    stepStrictly: true,
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.access_num),
    min: (0),
    step: (1),
    max: (10000000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ style: {} },
    stepStrictly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.timesDays'));
// @ts-ignore
[$t, $t, form, form,];
var __VLS_19;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.authentication')),
}));
const __VLS_29 = __VLS_28({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.authentication')),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_32;
const __VLS_33 = {
    /** @type {typeof __VLS_32.click} */
    onClick: () => { },
};
const { default: __VLS_34 } = __VLS_30.slots;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    ...{ 'onChange': {} },
    size: "small",
    modelValue: (__VLS_ctx.form.authentication),
}));
const __VLS_37 = __VLS_36({
    ...{ 'onChange': {} },
    size: "small",
    modelValue: (__VLS_ctx.form.authentication),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
let __VLS_40;
const __VLS_41 = {
    /** @type {typeof __VLS_40.change} */
    onChange: (__VLS_ctx.firstGeneration),
};
var __VLS_38;
var __VLS_39;
// @ts-ignore
[$t, form, firstGeneration,];
var __VLS_30;
var __VLS_31;
if (__VLS_ctx.form.authentication) {
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        modelValue: (__VLS_ctx.form.authentication_value.type),
        ...{ class: "card__radio" },
    }));
    const __VLS_44 = __VLS_43({
        modelValue: (__VLS_ctx.form.authentication_value.type),
        ...{ class: "card__radio" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    /** @type {__VLS_StyleScopedClasses['card__radio']} */ ;
    const { default: __VLS_47 } = __VLS_45.slots;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        shadow: "never",
        ...{ class: "mb-16" },
        ...{ class: (__VLS_ctx.form.authentication_value?.type === 'password' ? 'border-active' : '') },
    }));
    const __VLS_50 = __VLS_49({
        shadow: "never",
        ...{ class: "mb-16" },
        ...{ class: (__VLS_ctx.form.authentication_value?.type === 'password' ? 'border-active' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_53 } = __VLS_51.slots;
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        value: "password",
        size: "large",
    }));
    const __VLS_56 = __VLS_55({
        value: "password",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    const { default: __VLS_59 } = __VLS_57.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "mb-4 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.authenticationValue'));
    // @ts-ignore
    [$t, form, form, form,];
    var __VLS_57;
    if (__VLS_ctx.form.authentication_value.type === 'password') {
        let __VLS_60;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
            ...{ class: "ml-24" },
        }));
        const __VLS_62 = __VLS_61({
            ...{ class: "ml-24" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
        const { default: __VLS_65 } = __VLS_63.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "complex-input flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['complex-input']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_66;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
            ...{ class: "complex-input__left" },
            modelValue: (__VLS_ctx.form.authentication_value.password_value),
            readonly: true,
            ...{ style: {} },
        }));
        const __VLS_68 = __VLS_67({
            ...{ class: "complex-input__left" },
            modelValue: (__VLS_ctx.form.authentication_value.password_value),
            readonly: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_67));
        /** @type {__VLS_StyleScopedClasses['complex-input__left']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        let __VLS_71;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
            content: (__VLS_ctx.$t('common.copy')),
            placement: "top",
        }));
        const __VLS_73 = __VLS_72({
            content: (__VLS_ctx.$t('common.copy')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_72));
        const { default: __VLS_76 } = __VLS_74.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_79 = __VLS_78({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        let __VLS_82;
        const __VLS_83 = {
            /** @type {typeof __VLS_82.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.authentication))
                    throw 0;
                if (!(__VLS_ctx.form.authentication_value.type === 'password'))
                    throw 0;
                return __VLS_ctx.copyClick(__VLS_ctx.form.authentication_value.password_value);
                // @ts-ignore
                [$t, form, form, form, copyClick,];
            },
        };
        const { default: __VLS_84 } = __VLS_80.slots;
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
            iconName: "app-copy",
            ...{ class: "color-secondary" },
        }));
        const __VLS_87 = __VLS_86({
            iconName: "app-copy",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_80;
        var __VLS_81;
        // @ts-ignore
        [];
        var __VLS_74;
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
            content: (__VLS_ctx.$t('common.refresh')),
            placement: "top",
        }));
        const __VLS_92 = __VLS_91({
            content: (__VLS_ctx.$t('common.refresh')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        const { default: __VLS_95 } = __VLS_93.slots;
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            ...{ 'onClick': {} },
            text: true,
            ...{ style: {} },
        }));
        const __VLS_98 = __VLS_97({
            ...{ 'onClick': {} },
            text: true,
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        let __VLS_101;
        const __VLS_102 = {
            /** @type {typeof __VLS_101.click} */
            onClick: (__VLS_ctx.refreshAuthentication),
        };
        const { default: __VLS_103 } = __VLS_99.slots;
        let __VLS_104;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
            iconName: "app-refresh",
            ...{ class: "color-secondary" },
        }));
        const __VLS_106 = __VLS_105({
            iconName: "app-refresh",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [$t, refreshAuthentication,];
        var __VLS_99;
        var __VLS_100;
        // @ts-ignore
        [];
        var __VLS_93;
        // @ts-ignore
        [];
        var __VLS_63;
    }
    // @ts-ignore
    [];
    var __VLS_51;
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        shadow: "never",
        ...{ class: "mb-16" },
        ...{ class: (__VLS_ctx.form.authentication_value.type === 'login' ? 'border-active' : '') },
    }));
    const __VLS_111 = __VLS_110({
        shadow: "never",
        ...{ class: "mb-16" },
        ...{ class: (__VLS_ctx.form.authentication_value.type === 'login' ? 'border-active' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    const { default: __VLS_114 } = __VLS_112.slots;
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
    elRadio;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        value: "login",
        size: "large",
    }));
    const __VLS_117 = __VLS_116({
        value: "login",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    const { default: __VLS_120 } = __VLS_118.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "mb-16 lighter flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    (__VLS_ctx.$t('views.system.authentication.title'));
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
        popperClass: "max-w-350",
        effect: "dark",
        content: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.authenticationTooltip')),
    }));
    const __VLS_123 = __VLS_122({
        popperClass: "max-w-350",
        effect: "dark",
        content: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.authenticationTooltip')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    const { default: __VLS_126 } = __VLS_124.slots;
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_129 = __VLS_128({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t, form,];
    var __VLS_124;
    if (__VLS_ctx.form.authentication_value.type === 'login') {
        let __VLS_132;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_134 = __VLS_133({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        let __VLS_137;
        const __VLS_138 = {
            /** @type {typeof __VLS_137.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.form.authentication))
                    throw 0;
                if (!(__VLS_ctx.form.authentication_value.type === 'login'))
                    throw 0;
                return __VLS_ctx.router.push({ name: 'applicationChatUser' });
                // @ts-ignore
                [form, router,];
            },
        };
        const { default: __VLS_139 } = __VLS_135.slots;
        (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.toSettingChatUser'));
        // @ts-ignore
        [$t,];
        var __VLS_135;
        var __VLS_136;
    }
    // @ts-ignore
    [];
    var __VLS_118;
    if (__VLS_ctx.form.authentication_value.type === 'login') {
        let __VLS_140;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
            label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethod')),
            rules: ([
                {
                    required: true,
                    message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
                    trigger: 'change',
                },
            ]),
            prop: "authentication_value.login_value",
            ...{ class: "ml-24 border-t" },
            ...{ style: {} },
        }));
        const __VLS_142 = __VLS_141({
            label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethod')),
            rules: ([
                {
                    required: true,
                    message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.loginMethodRequired'),
                    trigger: 'change',
                },
            ]),
            prop: "authentication_value.login_value",
            ...{ class: "ml-24 border-t" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
        const { default: __VLS_145 } = __VLS_143.slots;
        let __VLS_146;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group'] | typeof __VLS_components.elCheckboxGroup | typeof __VLS_components.ElCheckboxGroup | typeof __VLS_components['el-checkbox-group']} */
        elCheckboxGroup;
        // @ts-ignore
        const __VLS_147 = __VLS_asFunctionalComponent1(__VLS_146, new __VLS_146({
            modelValue: (__VLS_ctx.form.authentication_value.login_value),
        }));
        const __VLS_148 = __VLS_147({
            modelValue: (__VLS_ctx.form.authentication_value.login_value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_147));
        const { default: __VLS_151 } = __VLS_149.slots;
        for (const [t] of __VLS_vFor((__VLS_ctx.auth_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (t.value),
            });
            let __VLS_152;
            /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
            elCheckbox;
            // @ts-ignore
            const __VLS_153 = __VLS_asFunctionalComponent1(__VLS_152, new __VLS_152({
                label: (t.label),
                value: (t.value),
            }));
            const __VLS_154 = __VLS_153({
                label: (t.label),
                value: (t.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_153));
            // @ts-ignore
            [$t, $t, form, form, auth_list,];
        }
        // @ts-ignore
        [];
        var __VLS_149;
        // @ts-ignore
        [];
        var __VLS_143;
    }
    if (__VLS_ctx.form.authentication_value.type === 'login' &&
        __VLS_ctx.form.authentication_value?.login_value?.includes('LOCAL')) {
        let __VLS_157;
        /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
        elFormItem;
        // @ts-ignore
        const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
            ...{ class: "ml-24" },
            label: (__VLS_ctx.$t('views.system.display_code')),
            rules: ([
                {
                    required: true,
                    message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.displayCodeRequired'),
                    trigger: 'change',
                },
            ]),
            prop: "authentication_value.max_attempts",
        }));
        const __VLS_159 = __VLS_158({
            ...{ class: "ml-24" },
            label: (__VLS_ctx.$t('views.system.display_code')),
            rules: ([
                {
                    required: true,
                    message: __VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.displayCodeRequired'),
                    trigger: 'change',
                },
            ]),
            prop: "authentication_value.max_attempts",
        }, ...__VLS_functionalComponentArgsRest(__VLS_158));
        /** @type {__VLS_StyleScopedClasses['ml-24']} */ ;
        const { default: __VLS_162 } = __VLS_160.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ style: {} },
        });
        (__VLS_ctx.$t('views.system.loginFailed'));
        let __VLS_163;
        /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
        elInputNumber;
        // @ts-ignore
        const __VLS_164 = __VLS_asFunctionalComponent1(__VLS_163, new __VLS_163({
            ...{ style: {} },
            modelValue: (__VLS_ctx.form.authentication_value.max_attempts),
            min: (-1),
            max: (10),
            step: (1),
            controlsPosition: "right",
        }));
        const __VLS_165 = __VLS_164({
            ...{ style: {} },
            modelValue: (__VLS_ctx.form.authentication_value.max_attempts),
            min: (-1),
            max: (10),
            step: (1),
            controlsPosition: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_164));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        (__VLS_ctx.$t('views.system.loginFailedMessage'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8 font-small" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['font-small']} */ ;
        (__VLS_ctx.$t('views.system.display_codeTip'));
        // @ts-ignore
        [$t, $t, $t, $t, $t, form, form, form,];
        var __VLS_160;
    }
    // @ts-ignore
    [];
    var __VLS_112;
    // @ts-ignore
    [];
    var __VLS_45;
}
let __VLS_168;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistLabel')),
}));
const __VLS_170 = __VLS_169({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_169));
let __VLS_173;
const __VLS_174 = {
    /** @type {typeof __VLS_173.click} */
    onClick: () => { },
};
const { default: __VLS_175 } = __VLS_171.slots;
let __VLS_176;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
    size: "small",
    modelValue: (__VLS_ctx.form.white_active),
}));
const __VLS_178 = __VLS_177({
    size: "small",
    modelValue: (__VLS_ctx.form.white_active),
}, ...__VLS_functionalComponentArgsRest(__VLS_177));
// @ts-ignore
[$t, form,];
var __VLS_171;
var __VLS_172;
if (__VLS_ctx.form.white_active) {
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({}));
    const __VLS_183 = __VLS_182({}, ...__VLS_functionalComponentArgsRest(__VLS_182));
    const { default: __VLS_186 } = __VLS_184.slots;
    let __VLS_187;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
        modelValue: (__VLS_ctx.form.white_list),
        placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistPlaceholder')),
        rows: (10),
        type: "textarea",
    }));
    const __VLS_189 = __VLS_188({
        modelValue: (__VLS_ctx.form.white_list),
        placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistPlaceholder')),
        rows: (10),
        type: "textarea",
    }, ...__VLS_functionalComponentArgsRest(__VLS_188));
    // @ts-ignore
    [$t, form, form,];
    var __VLS_184;
}
// @ts-ignore
[];
var __VLS_11;
{
    const { footer: __VLS_192 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_193;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
        ...{ 'onClick': {} },
    }));
    const __VLS_195 = __VLS_194({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_194));
    let __VLS_198;
    const __VLS_199 = {
        /** @type {typeof __VLS_198.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_200 } = __VLS_196.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_196;
    var __VLS_197;
    let __VLS_201;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_203 = __VLS_202({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_202));
    let __VLS_206;
    const __VLS_207 = {
        /** @type {typeof __VLS_206.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.limitFormRef);
            // @ts-ignore
            [loading, submit, limitFormRef,];
        },
    };
    const { default: __VLS_208 } = __VLS_204.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_204;
    var __VLS_205;
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
