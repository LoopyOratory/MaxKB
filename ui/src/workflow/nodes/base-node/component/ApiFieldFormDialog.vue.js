/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
const emit = defineEmits(['refresh']);
const fieldFormRef = ref();
const loading = ref(false);
const isEdit = ref(false);
const form = ref({
    name: '',
    variable: '',
    type: 'input',
    is_required: true,
    assignment_method: 'api_input',
    optionList: [''],
    default_value: '',
    desc: '',
});
const rules = reactive({
    name: [
        { required: true, message: t('dynamicsForm.paramForm.name.requiredMessage'), trigger: 'blur' },
    ],
    variable: [
        { required: true, message: t('dynamicsForm.paramForm.field.requiredMessage'), trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: t('dynamicsForm.paramForm.field.requiredMessage2'),
            trigger: 'blur',
        },
    ],
});
const dialogVisible = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            name: '',
            variable: '',
            type: 'input',
            is_required: true,
            assignment_method: 'api_input',
            optionList: [''],
            default_value: '',
            desc: '',
        };
        isEdit.value = false;
    }
});
const open = (row) => {
    if (row) {
        form.value = cloneDeep(row);
        isEdit.value = true;
    }
    dialogVisible.value = true;
};
const close = () => {
    dialogVisible.value = false;
    isEdit.value = false;
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            emit('refresh', form.value);
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
    title: (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.param.editParam') : __VLS_ctx.$t('common.param.addParam')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.param.editParam') : __VLS_ctx.$t('common.param.addParam')),
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
    labelPosition: "top",
    ref: "fieldFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "fieldFormRef",
    rules: (__VLS_ctx.rules),
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
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    prop: "variable",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    prop: "variable",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.variable),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_23 = __VLS_22({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.variable),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    /** @type {typeof __VLS_26.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.variable = __VLS_ctx.form.variable.trim();
        // @ts-ignore
        [isEdit, $t, $t, $t, $t, dialogVisible, close, rules, form, form, form, form,];
    },
};
var __VLS_24;
var __VLS_25;
// @ts-ignore
[];
var __VLS_18;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_36 = __VLS_35({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
const __VLS_40 = {
    /** @type {typeof __VLS_39.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name.trim();
        // @ts-ignore
        [$t, $t, form, form, form,];
    },
};
var __VLS_37;
var __VLS_38;
// @ts-ignore
[];
var __VLS_31;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
}));
const __VLS_43 = __VLS_42({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
let __VLS_46;
const __VLS_47 = {
    /** @type {typeof __VLS_46.click} */
    onClick: () => { },
};
const { default: __VLS_48 } = __VLS_44.slots;
let __VLS_49;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
    size: "small",
    modelValue: (__VLS_ctx.form.is_required),
}));
const __VLS_51 = __VLS_50({
    size: "small",
    modelValue: (__VLS_ctx.form.is_required),
}, ...__VLS_functionalComponentArgsRest(__VLS_50));
// @ts-ignore
[$t, form,];
var __VLS_44;
var __VLS_45;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    prop: "default_value",
    rules: ({
        required: __VLS_ctx.form.is_required,
        message: __VLS_ctx.$t('dynamicsForm.default.placeholder'),
        trigger: 'blur',
    }),
}));
const __VLS_56 = __VLS_55({
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    prop: "default_value",
    rules: ({
        required: __VLS_ctx.form.is_required,
        message: __VLS_ctx.$t('dynamicsForm.default.placeholder'),
        trigger: 'blur',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.default_value),
    placeholder: (__VLS_ctx.$t('dynamicsForm.default.placeholder')),
}));
const __VLS_62 = __VLS_61({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.default_value),
    placeholder: (__VLS_ctx.$t('dynamicsForm.default.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
let __VLS_65;
const __VLS_66 = {
    /** @type {typeof __VLS_65.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name.trim();
        // @ts-ignore
        [$t, $t, $t, form, form, form, form,];
    },
};
var __VLS_63;
var __VLS_64;
// @ts-ignore
[];
var __VLS_57;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_67 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_68;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
        ...{ 'onClick': {} },
    }));
    const __VLS_70 = __VLS_69({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
    let __VLS_73;
    const __VLS_74 = {
        /** @type {typeof __VLS_73.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_75 } = __VLS_71.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_71;
    var __VLS_72;
    let __VLS_76;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_78 = __VLS_77({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
    let __VLS_81;
    const __VLS_82 = {
        /** @type {typeof __VLS_81.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_83 } = __VLS_79.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
    var __VLS_79;
    var __VLS_80;
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
