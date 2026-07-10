/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
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
const limitFormRef = ref();
const form = ref({
    access_num: 0,
    white_active: true,
    white_list: '',
    authentication_value: '',
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
    form.value.authentication_value = data.authentication_value;
    form.value.authentication = data.authentication;
    dialogVisible.value = true;
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
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.accessControl')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    width: "650",
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.accessControl')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    width: "650",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "limitFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "limitFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.clientQueryLimitLabel')),
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.clientQueryLimitLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.access_num),
    min: (0),
    step: (1),
    max: (10000000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ style: {} },
    stepStrictly: true,
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.access_num),
    min: (0),
    step: (1),
    max: (10000000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ style: {} },
    stepStrictly: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.timesDays'));
// @ts-ignore
[$t, $t, $t, dialogVisible, form, form,];
var __VLS_18;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistLabel')),
}));
const __VLS_28 = __VLS_27({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_31;
const __VLS_32 = {
    /** @type {typeof __VLS_31.click} */
    onClick: () => { },
};
const { default: __VLS_33 } = __VLS_29.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    size: "small",
    modelValue: (__VLS_ctx.form.white_active),
}));
const __VLS_36 = __VLS_35({
    size: "small",
    modelValue: (__VLS_ctx.form.white_active),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, form,];
var __VLS_29;
var __VLS_30;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({}));
const __VLS_41 = __VLS_40({}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    modelValue: (__VLS_ctx.form.white_list),
    placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistPlaceholder')),
    rows: (10),
    type: "textarea",
}));
const __VLS_47 = __VLS_46({
    modelValue: (__VLS_ctx.form.white_list),
    placeholder: (__VLS_ctx.$t('views.applicationOverview.appInfo.LimitDialog.whitelistPlaceholder')),
    rows: (10),
    type: "textarea",
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
// @ts-ignore
[$t, form,];
var __VLS_42;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_50 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_51;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
        ...{ 'onClick': {} },
    }));
    const __VLS_53 = __VLS_52({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    let __VLS_56;
    const __VLS_57 = {
        /** @type {typeof __VLS_56.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_58 } = __VLS_54.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_54;
    var __VLS_55;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.limitFormRef);
            // @ts-ignore
            [loading, submit, limitFormRef,];
        },
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_62;
    var __VLS_63;
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
