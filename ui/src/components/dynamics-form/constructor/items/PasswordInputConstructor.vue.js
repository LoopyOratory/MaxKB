/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, watch } from 'vue';
import { t } from '@/locales';
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    }
});
watch(() => formValue.value.minlength, () => {
    if (formValue.value.minlength > formValue.value.maxlength) {
        formValue.value.maxlength = formValue.value.minlength;
    }
});
const getData = () => {
    return {
        input_type: 'PasswordInput',
        attrs: {
            maxlength: formValue.value.maxlength,
            minlength: formValue.value.minlength,
            'show-word-limit': true,
            type: 'password',
            'show-password': true
        },
        default_value: formValue.value.default_value,
        show_default_value: formValue.value.show_default_value,
        props_info: {
            rules: formValue.value.required
                ? [
                    {
                        required: true,
                        message: `${formValue.value.label} ${t('dynamicsForm.default.requiredMessage')}`
                    },
                    {
                        min: formValue.value.minlength,
                        max: formValue.value.maxlength,
                        message: `${formValue.value.label}${t('dynamicsForm.TextInput.length.requiredMessage1')} ${formValue.value.minlength} ${t('dynamicsForm.TextInput.length.requiredMessage2')} ${formValue.value.maxlength} ${t('dynamicsForm.TextInput.length.requiredMessage3')}`,
                        trigger: 'blur'
                    }
                ]
                : [
                    {
                        min: formValue.value.minlength,
                        max: formValue.value.maxlength,
                        message: `${formValue.value.label}${t('dynamicsForm.TextInput.length.requiredMessage1')} ${formValue.value.minlength} ${t('dynamicsForm.TextInput.length.requiredMessage2')} ${formValue.value.maxlength} ${t('dynamicsForm.TextInput.length.requiredMessage3')}`,
                        trigger: 'blur'
                    }
                ]
        }
    };
};
const rander = (form_data) => {
    const attrs = form_data.attrs || {};
    formValue.value.minlength = attrs.minlength;
    formValue.value.maxlength = attrs.maxlength;
    formValue.value.default_value = form_data.default_value;
    formValue.value.show_default_value = form_data.show_default_value;
    formValue.value.show_password = attrs['show-password'];
};
const rangeRules = [
    {
        required: true,
        validator: (rule, value, callback) => {
            if (!formValue.value.minlength) {
                callback(new Error(t('dynamicsForm.TextInput.length.requiredMessage4')));
            }
            if (!formValue.value.maxlength) {
                callback(new Error(t('dynamicsForm.TextInput.length.requiredMessage4')));
            }
            return true;
        },
        message: `${formValue.value.label} ${t('dynamicsForm.default.requiredMessage')}`
    }
];
const rules = computed(() => [
    {
        min: formValue.value.minlength,
        max: formValue.value.maxlength,
        message: `${t('dynamicsForm.TextInput.length.requiredMessage1')} ${formValue.value.minlength} ${t('dynamicsForm.TextInput.length.requiredMessage2')} ${formValue.value.maxlength} ${t('dynamicsForm.TextInput.length.requiredMessage3')}`,
        trigger: 'blur'
    }
]);
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onMounted(() => {
    formValue.value.minlength = 0;
    formValue.value.maxlength = 200;
    formValue.value.default_value = '';
    formValue.value.show_password = true;
    if (formValue.value.show_default_value === undefined) {
        formValue.value.show_default_value = true;
    }
});
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
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    label: (__VLS_ctx.$t('dynamicsForm.TextInput.length.label')),
    required: true,
}));
const __VLS_2 = __VLS_1({
    label: (__VLS_ctx.$t('dynamicsForm.TextInput.length.label')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ class: "w-full" },
}));
const __VLS_8 = __VLS_7({
    ...{ class: "w-full" },
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_11 } = __VLS_9.slots;
let __VLS_12;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    span: (11),
}));
const __VLS_14 = __VLS_13({
    span: (11),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
const { default: __VLS_17 } = __VLS_15.slots;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.TextInput.length.minRequired'),
            trigger: 'change'
        }
    ]),
    prop: "minlength",
}));
const __VLS_20 = __VLS_19({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.TextInput.length.minRequired'),
            trigger: 'change'
        }
    ]),
    prop: "minlength",
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ...{ style: {} },
    min: (1),
    step: (1),
    stepStrictly: true,
    modelValue: (__VLS_ctx.formValue.minlength),
    controlsPosition: "right",
}));
const __VLS_26 = __VLS_25({
    ...{ style: {} },
    min: (1),
    step: (1),
    stepStrictly: true,
    modelValue: (__VLS_ctx.formValue.minlength),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[$t, $t, formValue,];
var __VLS_21;
// @ts-ignore
[];
var __VLS_15;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    span: (2),
    ...{ class: "text-center" },
}));
const __VLS_31 = __VLS_30({
    span: (2),
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
const { default: __VLS_34 } = __VLS_32.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
// @ts-ignore
[];
var __VLS_32;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    span: (11),
}));
const __VLS_37 = __VLS_36({
    span: (11),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
const { default: __VLS_40 } = __VLS_38.slots;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.TextInput.length.maxRequired'),
            trigger: 'change'
        }
    ]),
    prop: "maxlength",
}));
const __VLS_43 = __VLS_42({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.TextInput.length.maxRequired'),
            trigger: 'change'
        }
    ]),
    prop: "maxlength",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    ...{ style: {} },
    min: (__VLS_ctx.formValue.minlength > __VLS_ctx.formValue.maxlength ? __VLS_ctx.formValue.minlength : 1),
    stepStrictly: true,
    step: (1),
    modelValue: (__VLS_ctx.formValue.maxlength),
    controlsPosition: "right",
}));
const __VLS_49 = __VLS_48({
    ...{ style: {} },
    min: (__VLS_ctx.formValue.minlength > __VLS_ctx.formValue.maxlength ? __VLS_ctx.formValue.minlength : 1),
    stepStrictly: true,
    step: (1),
    modelValue: (__VLS_ctx.formValue.maxlength),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
// @ts-ignore
[$t, formValue, formValue, formValue, formValue,];
var __VLS_44;
// @ts-ignore
[];
var __VLS_38;
// @ts-ignore
[];
var __VLS_9;
// @ts-ignore
[];
var __VLS_3;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    ...{ class: "defaultValueItem" },
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    rules: (__VLS_ctx.formValue.required ? [{ required: true, message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}` }, ...__VLS_ctx.rules] : __VLS_ctx.rules),
}));
const __VLS_54 = __VLS_53({
    ...{ class: "defaultValueItem" },
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    rules: (__VLS_ctx.formValue.required ? [{ required: true, message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}` }, ...__VLS_ctx.rules] : __VLS_ctx.rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
/** @type {__VLS_StyleScopedClasses['defaultValueItem']} */ ;
const { default: __VLS_57 } = __VLS_55.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "defaultValueCheckbox" },
});
/** @type {__VLS_StyleScopedClasses['defaultValueCheckbox']} */ ;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.formValue.show_default_value),
    label: (__VLS_ctx.$t('dynamicsForm.default.show')),
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.formValue.show_default_value),
    label: (__VLS_ctx.$t('dynamicsForm.default.show')),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
    modelValue: (__VLS_ctx.formValue.default_value),
    maxlength: (__VLS_ctx.formValue.maxlength),
    minlength: (__VLS_ctx.formValue.minlength),
    placeholder: (__VLS_ctx.$t('dynamicsForm.default.placeholder')),
    showWordLimit: true,
    type: "password",
    showPassword: true,
}));
const __VLS_65 = __VLS_64({
    modelValue: (__VLS_ctx.formValue.default_value),
    maxlength: (__VLS_ctx.formValue.maxlength),
    minlength: (__VLS_ctx.formValue.minlength),
    placeholder: (__VLS_ctx.$t('dynamicsForm.default.placeholder')),
    showWordLimit: true,
    type: "password",
    showPassword: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_64));
// @ts-ignore
[$t, $t, $t, $t, $t, formValue, formValue, formValue, formValue, formValue, formValue, rules, rules,];
var __VLS_55;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
