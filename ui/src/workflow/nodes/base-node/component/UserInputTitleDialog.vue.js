/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, computed } from 'vue';
import { t } from '@/locales';
import { ALLOWED_EXPOSED_TYPES } from '@/components/ai-chat/component/inline-params/constants';
const emit = defineEmits(['refresh']);
const fieldFormRef = ref();
const loading = ref(false);
const fieldOptions = ref([]);
const selectableFieldOptions = computed(() => fieldOptions.value.filter((item) => ALLOWED_EXPOSED_TYPES.includes(item.input_type)));
const form = ref({
    exposed_fields: [],
    menu_title: t('common.moreSettings'),
});
const rules = reactive({
    menu_title: [{ required: true, message: t('common.inputPlaceholder'), trigger: 'blur' }],
});
const dialogVisible = ref(false);
const getFieldLabel = (item) => {
    if (typeof item.label === 'string')
        return item.label;
    if (item.label?.label)
        return item.label.label;
    return item.field;
};
const open = (row, fields, setting, legacyTitle) => {
    form.value = {
        exposed_fields: setting?.exposed_fields || [],
        menu_title: setting?.menu_title || legacyTitle || t('common.moreSettings'),
    };
    fieldOptions.value = fields || [];
    dialogVisible.value = true;
};
const close = () => {
    dialogVisible.value = false;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            emit('refresh', {
                exposed_fields: form.value.exposed_fields,
                menu_title: form.value.menu_title,
            });
        }
    });
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
    title: (__VLS_ctx.$t('common.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.$t('common.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "fieldFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "fieldFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
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
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
{
    const { label: __VLS_23 } = __VLS_20.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('aiChat.userInputSetting'));
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }));
    const __VLS_26 = __VLS_25({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    {
        const { content: __VLS_30 } = __VLS_27.slots;
        (__VLS_ctx.$t('aiChat.userInputSettingTip'));
        // @ts-ignore
        [$t, $t, $t, dialogVisible, close, rules, form,];
    }
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_33 = __VLS_32({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_27;
    // @ts-ignore
    [];
}
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    modelValue: (__VLS_ctx.form.exposed_fields),
    multiple: true,
    ...{ style: {} },
}));
const __VLS_38 = __VLS_37({
    modelValue: (__VLS_ctx.form.exposed_fields),
    multiple: true,
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.selectableFieldOptions))) {
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        key: (item.field),
        label: (__VLS_ctx.getFieldLabel(item)),
        value: (item.field),
        disabled: (__VLS_ctx.form.exposed_fields.length >= 3 && !__VLS_ctx.form.exposed_fields.includes(item.field)),
    }));
    const __VLS_44 = __VLS_43({
        key: (item.field),
        label: (__VLS_ctx.getFieldLabel(item)),
        value: (item.field),
        disabled: (__VLS_ctx.form.exposed_fields.length >= 3 && !__VLS_ctx.form.exposed_fields.includes(item.field)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    // @ts-ignore
    [form, form, form, selectableFieldOptions, getFieldLabel,];
}
// @ts-ignore
[];
var __VLS_39;
// @ts-ignore
[];
var __VLS_20;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    label: (__VLS_ctx.$t('aiChat.remainingParamsMenuTitle')),
    prop: "menu_title",
}));
const __VLS_49 = __VLS_48({
    label: (__VLS_ctx.$t('aiChat.remainingParamsMenuTitle')),
    prop: "menu_title",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
const { default: __VLS_52 } = __VLS_50.slots;
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.menu_title),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_55 = __VLS_54({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.menu_title),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_58;
const __VLS_59 = {
    /** @type {typeof __VLS_58.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.menu_title = __VLS_ctx.form.menu_title.trim();
        // @ts-ignore
        [$t, form, form, form,];
    },
};
var __VLS_56;
var __VLS_57;
// @ts-ignore
[];
var __VLS_50;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_60 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_61;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        ...{ 'onClick': {} },
    }));
    const __VLS_63 = __VLS_62({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    let __VLS_66;
    const __VLS_67 = {
        /** @type {typeof __VLS_66.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_68 } = __VLS_64.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_64;
    var __VLS_65;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_74;
    const __VLS_75 = {
        /** @type {typeof __VLS_74.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_76 } = __VLS_72.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_72;
    var __VLS_73;
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
