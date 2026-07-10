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
    expression: '',
});
const rules = reactive({
    label: [
        { required: true, message: t('dynamicsForm.paramForm.name.placeholder'), trigger: 'blur' },
    ],
    field: [
        {
            required: true,
            message: t('workflow.variable.inputPlaceholder'),
            trigger: 'blur',
        },
        {
            pattern: /^[a-zA-Z0-9_]+$/,
            message: t('dynamicsForm.paramForm.field.requiredMessage2'),
            trigger: 'blur',
        },
    ],
    expression: [
        {
            required: true,
            message: t('workflow.nodes.variableSplittingNode.expression.placeholder'),
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
    title: (__VLS_ctx.isEdit
        ? __VLS_ctx.$t('workflow.nodes.variableSplittingNode.editVariables')
        : __VLS_ctx.$t('workflow.nodes.variableSplittingNode.addVariables')),
    modelValue: (__VLS_ctx.dialogVisible),
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
    destroyOnClose: (true),
    beforeClose: (__VLS_ctx.close),
    appendToBody: true,
}));
const __VLS_2 = __VLS_1({
    title: (__VLS_ctx.isEdit
        ? __VLS_ctx.$t('workflow.nodes.variableSplittingNode.editVariables')
        : __VLS_ctx.$t('workflow.nodes.variableSplittingNode.addVariables')),
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
    hideRequiredAsterisk: true,
}));
const __VLS_9 = __VLS_8({
    labelPosition: "top",
    ref: "fieldFormRef",
    rules: (__VLS_ctx.rules),
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
let __VLS_15;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
    prop: "field",
}));
const __VLS_17 = __VLS_16({
    prop: "field",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
{
    const { label: __VLS_21 } = __VLS_18.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.variable'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [isEdit, $t, $t, $t, dialogVisible, close, rules, form,];
}
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
    modelValue: (__VLS_ctx.form.field),
    maxlength: (64),
    placeholder: (__VLS_ctx.$t('workflow.variable.inputPlaceholder')),
    showWordLimit: true,
}));
const __VLS_24 = __VLS_23({
    modelValue: (__VLS_ctx.form.field),
    maxlength: (64),
    placeholder: (__VLS_ctx.$t('workflow.variable.inputPlaceholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
// @ts-ignore
[$t, form,];
var __VLS_18;
let __VLS_27;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
    prop: "label",
}));
const __VLS_29 = __VLS_28({
    prop: "label",
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
const { default: __VLS_32 } = __VLS_30.slots;
{
    const { label: __VLS_33 } = __VLS_30.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('dynamicsForm.paramForm.name.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t,];
}
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.form.label),
    maxlength: (64),
    showWordLimit: true,
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.form.label),
    maxlength: (64),
    showWordLimit: true,
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
// @ts-ignore
[$t, form,];
var __VLS_30;
let __VLS_39;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
    prop: "expression",
}));
const __VLS_41 = __VLS_40({
    prop: "expression",
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
const { default: __VLS_44 } = __VLS_42.slots;
{
    const { label: __VLS_45 } = __VLS_42.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('workflow.nodes.variableSplittingNode.expression.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_46;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        effect: "dark",
        placement: "right",
    }));
    const __VLS_48 = __VLS_47({
        effect: "dark",
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    const { default: __VLS_51 } = __VLS_49.slots;
    {
        const { content: __VLS_52 } = __VLS_49.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        __VLS_asFunctionalDirective(__VLS_directives.vHtml, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.$t('workflow.nodes.variableSplittingNode.expression.tooltip')) }, null, null);
        // @ts-ignore
        [$t, $t,];
    }
    let __VLS_53;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_55 = __VLS_54({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_49;
    // @ts-ignore
    [];
}
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.form.expression),
    maxlength: (64),
    showWordLimit: true,
    placeholder: (__VLS_ctx.$t('workflow.nodes.variableSplittingNode.expression.placeholder')),
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.form.expression),
    maxlength: (64),
    showWordLimit: true,
    placeholder: (__VLS_ctx.$t('workflow.nodes.variableSplittingNode.expression.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
// @ts-ignore
[$t, form,];
var __VLS_42;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_63 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.click} */
        onClick: (__VLS_ctx.close),
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t, close,];
    var __VLS_67;
    var __VLS_68;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_77;
    const __VLS_78 = {
        /** @type {typeof __VLS_77.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_79 } = __VLS_75.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_75;
    var __VLS_76;
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
