/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
const emit = defineEmits(['refresh']);
const fieldFormRef = ref();
const loading = ref(false);
const isEdit = ref(false);
const currentIndex = ref(null);
const form = ref({
    field: '',
    label: '',
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
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_37 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
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
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_45 } = __VLS_41.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_41;
    var __VLS_42;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_51;
    const __VLS_52 = {
        /** @type {typeof __VLS_51.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_53 } = __VLS_49.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
    var __VLS_49;
    var __VLS_50;
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
