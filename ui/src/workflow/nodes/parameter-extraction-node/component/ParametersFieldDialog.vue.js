/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
const emit = defineEmits(['refresh']);
const options = [
    {
        value: 'string',
        label: 'string',
    },
    {
        value: 'number',
        label: 'number',
    },
    {
        value: 'object',
        label: 'object',
    },
    {
        value: 'boolean',
        label: 'boolean',
    },
    {
        value: 'array',
        label: 'array',
    },
];
const fieldFormRef = ref();
const loading = ref(false);
const isEdit = ref(false);
const currentIndex = ref(null);
const form = ref({
    field: '',
    label: '',
    parameter_type: '',
    desc: '',
});
const rules = reactive({
    label: [
        { required: true, message: t('dynamicsForm.paramForm.name.requiredMessage'), trigger: 'blur' },
    ],
    field: [
        { required: true, message: t('dynamicsForm.paramForm.field.requiredMessage'), trigger: 'blur' },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: t('dynamicsForm.paramForm.field.requiredMessage2'),
            trigger: 'blur',
        },
    ],
});
const dialogVisible = ref(false);
const open = (row, index) => {
    if (row) {
        form.value = cloneDeep(row);
        isEdit.value = true;
        currentIndex.value = index;
    }
    dialogVisible.value = true;
};
const close = () => {
    dialogVisible.value = false;
    isEdit.value = false;
    currentIndex.value = null;
    form.value = {
        field: '',
        label: '',
    };
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            emit('refresh', form.value, currentIndex.value);
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
    required: (true),
    prop: "field",
    rules: (__VLS_ctx.rules.field),
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
    required: (true),
    prop: "field",
    rules: (__VLS_ctx.rules.field),
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    modelValue: (__VLS_ctx.form.field),
    maxlength: (64),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
    showWordLimit: true,
}));
const __VLS_23 = __VLS_22({
    modelValue: (__VLS_ctx.form.field),
    maxlength: (64),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
// @ts-ignore
[isEdit, $t, $t, $t, $t, dialogVisible, close, rules, rules, form, form,];
var __VLS_18;
let __VLS_26;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    required: (true),
    prop: "label",
    rules: (__VLS_ctx.rules.label),
}));
const __VLS_28 = __VLS_27({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    required: (true),
    prop: "label",
    rules: (__VLS_ctx.rules.label),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
const { default: __VLS_31 } = __VLS_29.slots;
let __VLS_32;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
    modelValue: (__VLS_ctx.form.label),
    maxlength: (64),
    showWordLimit: true,
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
}));
const __VLS_34 = __VLS_33({
    modelValue: (__VLS_ctx.form.label),
    maxlength: (64),
    showWordLimit: true,
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
// @ts-ignore
[$t, $t, rules, form,];
var __VLS_29;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    label: (__VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.parameterType')),
    required: (true),
    prop: "parameter_type",
    rules: (__VLS_ctx.rules.label),
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.parameterType')),
    required: (true),
    prop: "parameter_type",
    rules: (__VLS_ctx.rules.label),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
let __VLS_43;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
    teleported: (false),
    modelValue: (__VLS_ctx.form.parameter_type),
    placeholder: (__VLS_ctx.$t('common.selectPlaceholder') +
        __VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.parameterType')),
    ...{ style: {} },
}));
const __VLS_45 = __VLS_44({
    teleported: (false),
    modelValue: (__VLS_ctx.form.parameter_type),
    placeholder: (__VLS_ctx.$t('common.selectPlaceholder') +
        __VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.parameterType')),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_44));
const { default: __VLS_48 } = __VLS_46.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.options))) {
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }));
    const __VLS_51 = __VLS_50({
        key: (item.value),
        label: (item.label),
        value: (item.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    // @ts-ignore
    [$t, $t, $t, rules, form, options,];
}
// @ts-ignore
[];
var __VLS_46;
// @ts-ignore
[];
var __VLS_40;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}));
const __VLS_56 = __VLS_55({
    label: (__VLS_ctx.$t('common.desc')),
    prop: "desc",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.form.desc),
    ...{ style: {} },
    rows: (2),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.form.desc),
    ...{ style: {} },
    rows: (2),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('common.descPlaceholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
// @ts-ignore
[$t, $t, form,];
var __VLS_57;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_65 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        ...{ 'onClick': {} },
    }));
    const __VLS_68 = __VLS_67({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    let __VLS_71;
    const __VLS_72 = {
        /** @type {typeof __VLS_71.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_73 } = __VLS_69.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_69;
    var __VLS_70;
    let __VLS_74;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_76 = __VLS_75({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    let __VLS_79;
    const __VLS_80 = {
        /** @type {typeof __VLS_79.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_81 } = __VLS_77.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_77;
    var __VLS_78;
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
