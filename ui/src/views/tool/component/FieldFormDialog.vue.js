/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, reactive, watch } from 'vue';
import { cloneDeep } from 'lodash';
import { t } from '@/locales';
const typeOptions = ['string', 'int', 'dict', 'array', 'float', 'boolean'];
const emit = defineEmits(['refresh']);
const fieldFormRef = ref();
const loading = ref(false);
const isEdit = ref(false);
const form = ref({
    name: '',
    type: typeOptions[0],
    desc: '',
    source: 'reference',
    is_required: true,
});
const rules = reactive({
    name: [
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
            name: '',
            type: typeOptions[0],
            desc: '',
            source: 'reference',
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
            dialogVisible.value = false;
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
    prop: "name",
}));
const __VLS_17 = __VLS_16({
    label: (__VLS_ctx.$t('views.tool.form.paramName.label')),
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_16));
const { default: __VLS_20 } = __VLS_18.slots;
let __VLS_21;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.paramName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}));
const __VLS_23 = __VLS_22({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.name),
    placeholder: (__VLS_ctx.$t('views.tool.form.paramName.placeholder')),
    maxlength: "64",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_22));
let __VLS_26;
const __VLS_27 = {
    /** @type {typeof __VLS_26.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.name = __VLS_ctx.form.name.trim();
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
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
    modelValue: (__VLS_ctx.form.type),
}));
const __VLS_36 = __VLS_35({
    modelValue: (__VLS_ctx.form.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.typeOptions))) {
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        key: (item),
        label: (item),
        value: (item),
    }));
    const __VLS_42 = __VLS_41({
        key: (item),
        label: (item),
        value: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [$t, form, typeOptions,];
}
// @ts-ignore
[];
var __VLS_37;
// @ts-ignore
[];
var __VLS_31;
let __VLS_45;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.label')),
}));
const __VLS_47 = __VLS_46({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_46));
const { default: __VLS_50 } = __VLS_48.slots;
let __VLS_51;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.placeholder')),
    maxlength: (128),
    showWordLimit: true,
}));
const __VLS_53 = __VLS_52({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.placeholder')),
    maxlength: (128),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_52));
let __VLS_56;
const __VLS_57 = {
    /** @type {typeof __VLS_56.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.desc = __VLS_ctx.form.desc?.trim();
        // @ts-ignore
        [$t, $t, form, form, form,];
    },
};
var __VLS_54;
var __VLS_55;
// @ts-ignore
[];
var __VLS_48;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}));
const __VLS_60 = __VLS_59({
    label: (__VLS_ctx.$t('views.tool.form.source.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
const { default: __VLS_63 } = __VLS_61.slots;
let __VLS_64;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
    modelValue: (__VLS_ctx.form.source),
}));
const __VLS_66 = __VLS_65({
    modelValue: (__VLS_ctx.form.source),
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
const { default: __VLS_69 } = __VLS_67.slots;
let __VLS_70;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
    label: (__VLS_ctx.$t('views.tool.form.source.reference')),
    value: "reference",
}));
const __VLS_72 = __VLS_71({
    label: (__VLS_ctx.$t('views.tool.form.source.reference')),
    value: "reference",
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
let __VLS_75;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
    label: (__VLS_ctx.$t('common.custom')),
    value: "custom",
}));
const __VLS_77 = __VLS_76({
    label: (__VLS_ctx.$t('common.custom')),
    value: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_76));
// @ts-ignore
[$t, $t, $t, form,];
var __VLS_67;
// @ts-ignore
[];
var __VLS_61;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
}));
const __VLS_82 = __VLS_81({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
let __VLS_85;
const __VLS_86 = {
    /** @type {typeof __VLS_85.click} */
    onClick: () => { },
};
const { default: __VLS_87 } = __VLS_83.slots;
let __VLS_88;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    size: "small",
    modelValue: (__VLS_ctx.form.is_required),
}));
const __VLS_90 = __VLS_89({
    size: "small",
    modelValue: (__VLS_ctx.form.is_required),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
// @ts-ignore
[$t, form,];
var __VLS_83;
var __VLS_84;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_93 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_94;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_95 = __VLS_asFunctionalComponent1(__VLS_94, new __VLS_94({
        ...{ 'onClick': {} },
    }));
    const __VLS_96 = __VLS_95({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_95));
    let __VLS_99;
    const __VLS_100 = {
        /** @type {typeof __VLS_99.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_101 } = __VLS_97.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_97;
    var __VLS_98;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        /** @type {typeof __VLS_107.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_109 } = __VLS_105.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
    var __VLS_105;
    var __VLS_106;
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
