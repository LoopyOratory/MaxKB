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
    desc: '',
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
    label: [
        {
            required: true,
            message: t('dynamicsForm.paramForm.name.placeholder'),
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
    prop: "label",
}));
const __VLS_30 = __VLS_29({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
    prop: "label",
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
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.desc.label')),
}));
const __VLS_43 = __VLS_42({
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.desc.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.desc.placeholder')),
    maxlength: (128),
    showWordLimit: true,
}));
const __VLS_49 = __VLS_48({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.form.desc),
    placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.desc.placeholder')),
    maxlength: (128),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_52;
const __VLS_53 = {
    /** @type {typeof __VLS_52.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.form.desc = __VLS_ctx.form.desc?.trim();
        // @ts-ignore
        [$t, $t, form, form, form,];
    },
};
var __VLS_50;
var __VLS_51;
// @ts-ignore
[];
var __VLS_44;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}));
const __VLS_56 = __VLS_55({
    label: (__VLS_ctx.$t('views.tool.form.dataType.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
const { default: __VLS_59 } = __VLS_57.slots;
let __VLS_60;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
    modelValue: (__VLS_ctx.form.type),
}));
const __VLS_62 = __VLS_61({
    modelValue: (__VLS_ctx.form.type),
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const { default: __VLS_65 } = __VLS_63.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.typeOptions))) {
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        key: (item),
        label: (item),
        value: (item),
    }));
    const __VLS_68 = __VLS_67({
        key: (item),
        label: (item),
        value: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    // @ts-ignore
    [$t, form, typeOptions,];
}
// @ts-ignore
[];
var __VLS_63;
// @ts-ignore
[];
var __VLS_57;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
}));
const __VLS_73 = __VLS_72({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
let __VLS_76;
const __VLS_77 = {
    /** @type {typeof __VLS_76.click} */
    onClick: () => { },
};
const { default: __VLS_78 } = __VLS_74.slots;
let __VLS_79;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch'] | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    size: "small",
    modelValue: (__VLS_ctx.form.is_required),
}));
const __VLS_81 = __VLS_80({
    size: "small",
    modelValue: (__VLS_ctx.form.is_required),
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
// @ts-ignore
[$t, form,];
var __VLS_74;
var __VLS_75;
// @ts-ignore
[];
var __VLS_10;
{
    const { footer: __VLS_84 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_85;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
        ...{ 'onClick': {} },
    }));
    const __VLS_87 = __VLS_86({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_86));
    let __VLS_90;
    const __VLS_91 = {
        /** @type {typeof __VLS_90.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_92 } = __VLS_88.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_88;
    var __VLS_89;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_95 = __VLS_94({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    let __VLS_98;
    const __VLS_99 = {
        /** @type {typeof __VLS_98.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit(__VLS_ctx.fieldFormRef);
            // @ts-ignore
            [loading, submit, fieldFormRef,];
        },
    };
    const { default: __VLS_100 } = __VLS_96.slots;
    (__VLS_ctx.isEdit ? __VLS_ctx.$t('common.save') : __VLS_ctx.$t('common.add'));
    // @ts-ignore
    [isEdit, $t, $t,];
    var __VLS_96;
    var __VLS_97;
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
