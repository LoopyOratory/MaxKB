/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import overviewSystemApi from '@/api/system/api-key';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { expiredTimeList, AfterTimestamp } from '@/utils/time';
import { copyClick } from "@/utils/clipboard.ts";
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
const settingFormRef = ref();
const form = ref({
    secret_key: '',
    allow_cross_domain: false,
    cross_domain_list: '',
    expired_time: '',
    is_active: true,
    is_permanent: true,
    expiredTimeType: 'never',
});
const dialogVisible = ref(false);
const loading = ref(false);
const APIKeyId = ref('');
const APIType = ref('APPLICATION');
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            allow_cross_domain: false,
            cross_domain_list: '',
        };
    }
});
const open = (data, type) => {
    if (data) {
        APIKeyId.value = data.id;
        form.value = {
            secret_key: data.secret_key || '',
            allow_cross_domain: data.allow_cross_domain || false,
            cross_domain_list: data.cross_domain_list?.length
                ? data.cross_domain_list?.join('\n')
                : '',
            expire_time: data.expire_time || '',
            expiredTimeType: data.is_permanent ? 'never' : 'custom',
            is_active: data.is_active,
        };
    }
    APIType.value = type;
    dialogVisible.value = true;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            const obj = {
                allow_cross_domain: form.value.allow_cross_domain,
                cross_domain_list: form.value.cross_domain_list
                    ? form.value.cross_domain_list.split('\n').filter(function (item) {
                        return item !== '';
                    })
                    : [],
                expire_time: form.value.expire_time,
                is_permanent: form.value.expiredTimeType === 'never',
                is_active: form.value.is_active,
            };
            const apiCall = APIType.value === 'APPLICATION'
                ? loadSharedApi({ type: 'applicationKey', systemType: apiType.value }).putAPIKey(id, APIKeyId.value, obj, loading)
                : overviewSystemApi.putAPIKey(APIKeyId.value, obj, loading);
            apiCall.then(() => {
                emit('refresh');
                MsgSuccess(t('common.settingSuccess'));
                dialogVisible.value = false;
            });
        }
    });
};
function changeExpiredTimeHandle(value) {
    if (value === 'custom') {
        form.value.expire_time = '';
    }
    else if (value === 'never') {
        form.value.expire_time = null;
    }
    else {
        form.value.expire_time = AfterTimestamp(value);
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
    title: (__VLS_ctx.$t('common.edit') + ' API Key'),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    appendToBody: (true),
    size: "60%",
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('common.edit') + ' API Key'),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    appendToBody: (true),
    size: "60%",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "settingFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "settingFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    label: "API KEY",
}));
const __VLS_17 = __VLS_16({
    label: "API KEY",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "complex-input flex align-center w-full" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['complex-input']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ class: "complex-input__left" },
    modelValue: (__VLS_ctx.form.secret_key),
    disabled: (true),
}));
const __VLS_23 = __VLS_22({
    ...{ class: "complex-input__left" },
    modelValue: (__VLS_ctx.form.secret_key),
    disabled: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
/** @type {__VLS_StyleScopedClasses['complex-input__left']} */ ;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}));
const __VLS_28 = __VLS_27({
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    text: true,
}));
const __VLS_34 = __VLS_33({
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    ...{ 'onClick': {} },
    iconName: "app-copy",
    ...{ class: "color-secondary" },
}));
const __VLS_40 = __VLS_39({
    ...{ 'onClick': {} },
    iconName: "app-copy",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
let __VLS_43;
const __VLS_44 = {
    /** @type {typeof __VLS_43.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.form.secret_key);
        // @ts-ignore
        [$t, $t, dialogVisible, form, form, form, copyClick,];
    },
};
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
var __VLS_41;
var __VLS_42;
// @ts-ignore
[];
var __VLS_35;
// @ts-ignore
[];
var __VLS_29;
// @ts-ignore
[];
var __VLS_18;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: (__VLS_ctx.$t('layout.about.expiredTime')),
    prop: "expiredTimeType",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'change',
    }),
}));
const __VLS_47 = __VLS_46({
    label: (__VLS_ctx.$t('layout.about.expiredTime')),
    prop: "expiredTimeType",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('common.selectPlaceholder'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onChange': {} },
    teleported: (false),
    modelValue: (__VLS_ctx.form.expiredTimeType),
}));
const __VLS_53 = __VLS_52({
    ...{ 'onChange': {} },
    teleported: (false),
    modelValue: (__VLS_ctx.form.expiredTimeType),
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    /** @type {typeof __VLS_56.change} */
    onChange: (__VLS_ctx.changeExpiredTimeHandle),
};
const { default: __VLS_58 } = __VLS_54.slots;
for (const [option, value] of __VLS_vFor((__VLS_ctx.expiredTimeList))) {
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        key: (value),
        label: (option),
        value: (value),
    }));
    const __VLS_61 = __VLS_60({
        key: (value),
        label: (option),
        value: (value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    // @ts-ignore
    [$t, $t, form, changeExpiredTimeHandle, expiredTimeList,];
}
// @ts-ignore
[];
var __VLS_54;
var __VLS_55;
// @ts-ignore
[];
var __VLS_48;
if (__VLS_ctx.form.expiredTimeType === 'custom') {
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
    elDatePicker;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        modelValue: (__VLS_ctx.form.expire_time),
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss",
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
    }));
    const __VLS_72 = __VLS_71({
        modelValue: (__VLS_ctx.form.expire_time),
        type: "datetime",
        format: "YYYY-MM-DD HH:mm:ss",
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('common.selectPlaceholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    // @ts-ignore
    [$t, form, form,];
    var __VLS_67;
}
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('layout.crossSettings')),
}));
const __VLS_77 = __VLS_76({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('layout.crossSettings')),
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
let __VLS_80;
const __VLS_81 = {
    /** @type {typeof __VLS_80.click} */
    onClick: () => { },
};
const { default: __VLS_82 } = __VLS_78.slots;
let __VLS_83;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
    size: "small",
    modelValue: (__VLS_ctx.form.allow_cross_domain),
}));
const __VLS_85 = __VLS_84({
    size: "small",
    modelValue: (__VLS_ctx.form.allow_cross_domain),
}, ...__VLS_functionalComponentArgsRest(__VLS_84));
// @ts-ignore
[$t, form,];
var __VLS_78;
var __VLS_79;
if (__VLS_ctx.form.allow_cross_domain) {
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({}));
    const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
    const { default: __VLS_93 } = __VLS_91.slots;
    let __VLS_94;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        modelValue: (__VLS_ctx.form.cross_domain_list),
        placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.SettingAPIKeyDialog.crossDomainPlaceholder')),
        rows: (10),
        type: "textarea",
    }));
    const __VLS_96 = __VLS_95({
        modelValue: (__VLS_ctx.form.cross_domain_list),
        placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.SettingAPIKeyDialog.crossDomainPlaceholder')),
        rows: (10),
        type: "textarea",
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    // @ts-ignore
    [$t, form, form,];
    var __VLS_91;
}
let __VLS_99;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.document.enableStatus.label')),
}));
const __VLS_101 = __VLS_100({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.document.enableStatus.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_100));
let __VLS_104;
const __VLS_105 = {
    /** @type {typeof __VLS_104.click} */
    onClick: () => { },
};
const { default: __VLS_106 } = __VLS_102.slots;
let __VLS_107;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
    size: "small",
    modelValue: (__VLS_ctx.form.is_active),
}));
const __VLS_109 = __VLS_108({
    size: "small",
    modelValue: (__VLS_ctx.form.is_active),
}, ...__VLS_functionalComponentArgsRest(__VLS_108));
// @ts-ignore
[$t, form,];
var __VLS_102;
var __VLS_103;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_112 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_113;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
        ...{ 'onClick': {} },
    }));
    const __VLS_115 = __VLS_114({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_114));
    let __VLS_118;
    const __VLS_119 = {
        /** @type {typeof __VLS_118.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_120 } = __VLS_116.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_116;
    var __VLS_117;
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_123 = __VLS_122({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    let __VLS_126;
    const __VLS_127 = {
        /** @type {typeof __VLS_126.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.settingFormRef);
            // @ts-ignore
            [loading, submit, settingFormRef,];
        },
    };
    const { default: __VLS_128 } = __VLS_124.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_124;
    var __VLS_125;
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
    emits: {},
});
export default {};
