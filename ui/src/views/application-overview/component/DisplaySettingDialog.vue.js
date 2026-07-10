/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { MsgSuccess } from '@/utils/message';
import { langList, t } from '@/locales';
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
const displayFormRef = ref();
const form = ref({
    show_source: false,
    show_exec: false,
    language: '',
});
const detail = ref(null);
const dialogVisible = ref(false);
const loading = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            show_source: false,
            show_exec: false,
            language: '',
        };
    }
});
const open = (data, content) => {
    detail.value = content;
    form.value.show_source = data.show_source;
    form.value.show_exec = data.show_exec;
    form.value.language = data.language;
    dialogVisible.value = true;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            loadSharedApi({ type: 'application', systemType: apiType.value })
                .putAccessToken(id, form.value, loading)
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
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.displaySetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    width: "550",
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('views.applicationOverview.appInfo.displaySetting')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    width: "550",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    labelPosition: "top",
    ref: "displayFormRef",
    model: (__VLS_ctx.form),
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "displayFormRef",
    model: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({}));
const __VLS_17 = __VLS_16({}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('layout.language'));
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.language),
    clearable: true,
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.language),
    clearable: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
const { default: __VLS_26 } = __VLS_24.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.langList))) {
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_29 = __VLS_28({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    // @ts-ignore
    [$t, $t, dialogVisible, form, form, langList,];
}
// @ts-ignore
[];
var __VLS_24;
// @ts-ignore
[];
var __VLS_18;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
const { default: __VLS_37 } = __VLS_35.slots;
let __VLS_38;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
    direction: "vertical",
    alignment: "start",
    size: (2),
}));
const __VLS_40 = __VLS_39({
    direction: "vertical",
    alignment: "start",
    size: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_39));
const { default: __VLS_43 } = __VLS_41.slots;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    modelValue: (__VLS_ctx.form.show_source),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showSourceLabel')),
}));
const __VLS_46 = __VLS_45({
    modelValue: (__VLS_ctx.form.show_source),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showSourceLabel')),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    modelValue: (__VLS_ctx.form.show_exec),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showExecutionDetail')),
}));
const __VLS_51 = __VLS_50({
    modelValue: (__VLS_ctx.form.show_exec),
    label: (__VLS_ctx.$t('views.applicationOverview.SettingDisplayDialog.showExecutionDetail')),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
// @ts-ignore
[$t, $t, form, form,];
var __VLS_41;
// @ts-ignore
[];
var __VLS_35;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_54 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        /** @type {typeof __VLS_60.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_62 } = __VLS_58.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_58;
    var __VLS_59;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        /** @type {typeof __VLS_68.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.displayFormRef);
            // @ts-ignore
            [loading, submit, displayFormRef,];
        },
    };
    const { default: __VLS_70 } = __VLS_66.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_66;
    var __VLS_67;
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
