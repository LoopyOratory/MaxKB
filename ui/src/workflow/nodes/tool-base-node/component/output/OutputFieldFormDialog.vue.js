/// <reference types="../../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
const typeOptions = ['string', 'int', 'dict', 'array', 'float', 'boolean'];
const emit = defineEmits(['refresh']);
const fieldFormRef = ref();
const loading = ref(false);
const isEdit = ref(false);
const form = ref({
    field: '',
    type: typeOptions[0],
    label: '',
    is_required: true,
});
const rules = reactive({
    field: [
        {
            required: true,
            message: t('views.tool.form.paramName.placeholder'),
            trigger: 'blur',
        },
    ],
});
const dialogVisible = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            field: '',
            type: typeOptions[0],
            label: '',
            is_required: true,
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
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid) => {
        if (valid) {
            emit('refresh', form.value);
        }
    });
};
const close = () => {
    dialogVisible.value = false;
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
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.param.editParam') : __VLS_ctx.$t('common.param.addParam')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
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
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
    prop: "field",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
    prop: "field",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.field),
    placeholder: (__VLS_ctx.$t('views.tool.form.paramName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_23 = __VLS_22({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.field),
    placeholder: (__VLS_ctx.$t('views.tool.form.paramName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    /** @type {typeof __VLS_26.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.field = __VLS_ctx.form.field.trim();
        // @ts-ignore
        [isEdit, $t, $t, $t, $t, dialogVisible, rules, form, form, form, form,];
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
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.label),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
    maxlength: (128),
    showWordLimit: true,
}));
const __VLS_36 = __VLS_35({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.label),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
    maxlength: (128),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
let __VLS_39;
const __VLS_40 = {
    /** @type {typeof __VLS_39.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.label = __VLS_ctx.form.label?.trim();
        // @ts-ignore
        [$t, $t, form, form, form,];
    },
};
var __VLS_37;
var __VLS_38;
// @ts-ignore
[];
var __VLS_31;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_41 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_42;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
        ...{ 'onClick': {} },
    }));
    const __VLS_44 = __VLS_43({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    let __VLS_47;
    const __VLS_48 = {
        /** @type {typeof __VLS_47.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_49 } = __VLS_45.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_45;
    var __VLS_46;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_52 = __VLS_51({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    let __VLS_55;
    const __VLS_56 = {
        /** @type {typeof __VLS_55.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_57 } = __VLS_53.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
    var __VLS_53;
    var __VLS_54;
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
