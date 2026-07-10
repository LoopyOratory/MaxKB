/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import overviewSystemApi from '@/api/system/api-key';
import { MsgSuccess } from '@/utils/message';
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
const settingFormRef = ref();
const form = ref({
    allow_cross_domain: false,
    cross_domain_list: '',
});
const dialogVisible = ref(false);
const loading = ref(false);
const APIKeyId = ref('');
const APIType = ref('APPLICATION');
const isCreate = ref(false);
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
        isCreate.value = false;
        APIKeyId.value = data.id;
        form.value.allow_cross_domain = data.allow_cross_domain;
        form.value.cross_domain_list = data.cross_domain_list?.length
            ? data.cross_domain_list?.join('\n')
            : '';
    }
    else {
        isCreate.value = true;
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
    title: (__VLS_ctx.$t('common.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('common.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
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
    labelPosition: "top",
    ref: "settingFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "settingFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.SettingAPIKeyDialog.allowCrossDomainLabel')),
}));
const __VLS_17 = __VLS_16({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.SettingAPIKeyDialog.allowCrossDomainLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
let __VLS_20;
const __VLS_21 = {
    /** @type {typeof __VLS_20.click} */
    onClick: () => { },
};
const { default: __VLS_22 } = __VLS_18.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    size: "small",
    modelValue: (__VLS_ctx.form.allow_cross_domain),
}));
const __VLS_25 = __VLS_24({
    size: "small",
    modelValue: (__VLS_ctx.form.allow_cross_domain),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
// @ts-ignore
[$t, $t, dialogVisible, form, form,];
var __VLS_18;
var __VLS_19;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({}));
const __VLS_30 = __VLS_29({}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.form.cross_domain_list),
    placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.SettingAPIKeyDialog.crossDomainPlaceholder')),
    rows: (10),
    type: "textarea",
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.form.cross_domain_list),
    placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.SettingAPIKeyDialog.crossDomainPlaceholder')),
    rows: (10),
    type: "textarea",
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, form,];
var __VLS_31;
// @ts-ignore
[];
var __VLS_10;
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
            return __VLS_ctx.submit(__VLS_ctx.settingFormRef);
            // @ts-ignore
            [loading, submit, settingFormRef,];
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
var __VLS_13 = __VLS_12;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
