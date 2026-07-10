/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onBeforeMount } from 'vue';
import moment from 'moment';
import { t } from '@/locales';
const type_list = [
    {
        label: t('dynamicsForm.DatePicker.year'),
        value: 'year',
    },
    {
        label: t('dynamicsForm.DatePicker.month'),
        value: 'month',
    },
    {
        label: t('dynamicsForm.DatePicker.date'),
        value: 'date',
    },
    {
        label: t('dynamicsForm.DatePicker.datetime'),
        value: 'datetime',
    },
];
const type_dict = {
    year: [{ value: 'YYYY' }],
    month: [{ value: 'YYYY-MM' }],
    date: [{ value: 'YYYY-MM-DD' }],
    datetime: [{ value: 'YYYY-MM-DD HH:mm:ss' }],
};
const type_change = () => {
    formValue.value.format = type_dict[formValue.value.type][0].value;
    formValue.value.default_value = moment().format(formValue.value.format);
};
const props = defineProps();
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const getData = () => {
    return {
        input_type: 'DatePicker',
        attrs: {
            type: formValue.value.type,
            format: formValue.value.format,
            'value-format': formValue.value.format,
        },
        default_value: formValue.value.default_value,
        show_default_value: formValue.value.show_default_value,
    };
};
const rander = (form_data) => {
    formValue.value.type = form_data.attrs.type;
    formValue.value.format = form_data.attrs?.format;
    formValue.value.default_value = form_data.default_value;
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onBeforeMount(() => {
    formValue.value.type = 'datetime';
    formValue.value.format = 'YYYY-MM-DD HH:mm:ss';
    formValue.value.default_value = moment().format(formValue.value.format);
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
    label: (__VLS_ctx.$t('dynamicsForm.DatePicker.dataType.label')),
    required: true,
}));
const __VLS_2 = __VLS_1({
    label: (__VLS_ctx.$t('dynamicsForm.DatePicker.dataType.label')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.formValue.type),
    placeholder: (__VLS_ctx.$t('dynamicsForm.DatePicker.dataType.placeholder')),
}));
const __VLS_8 = __VLS_7({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.formValue.type),
    placeholder: (__VLS_ctx.$t('dynamicsForm.DatePicker.dataType.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
let __VLS_11;
const __VLS_12 = {
    /** @type {typeof __VLS_11.change} */
    onChange: (__VLS_ctx.type_change),
};
const { default: __VLS_13 } = __VLS_9.slots;
for (const [input_type] of __VLS_vFor((__VLS_ctx.type_list))) {
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        key: (input_type.value),
        label: (input_type.label),
        value: (input_type.value),
    }));
    const __VLS_16 = __VLS_15({
        key: (input_type.value),
        label: (input_type.label),
        value: (input_type.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    // @ts-ignore
    [$t, $t, formValue, type_change, type_list,];
}
// @ts-ignore
[];
var __VLS_9;
var __VLS_10;
// @ts-ignore
[];
var __VLS_3;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    label: (__VLS_ctx.$t('dynamicsForm.DatePicker.format.label')),
    required: true,
}));
const __VLS_21 = __VLS_20({
    label: (__VLS_ctx.$t('dynamicsForm.DatePicker.format.label')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    modelValue: (__VLS_ctx.formValue.format),
    filterable: true,
    defaultFirstOption: true,
    allowCreate: true,
    placeholder: (__VLS_ctx.$t('dynamicsForm.DatePicker.format.placeholder')),
}));
const __VLS_27 = __VLS_26({
    modelValue: (__VLS_ctx.formValue.format),
    filterable: true,
    defaultFirstOption: true,
    allowCreate: true,
    placeholder: (__VLS_ctx.$t('dynamicsForm.DatePicker.format.placeholder')),
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
for (const [input_type] of __VLS_vFor((__VLS_ctx.type_dict[__VLS_ctx.formValue.type]))) {
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        key: (input_type.value),
        label: (input_type.value),
        value: (input_type.value),
    }));
    const __VLS_33 = __VLS_32({
        key: (input_type.value),
        label: (input_type.value),
        value: (input_type.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    // @ts-ignore
    [$t, $t, formValue, formValue, type_dict,];
}
// @ts-ignore
[];
var __VLS_28;
// @ts-ignore
[];
var __VLS_22;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    ...{ class: "defaultValueItem" },
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    rules: (__VLS_ctx.formValue.required
        ? [
            {
                required: true,
                message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
            },
        ]
        : []),
}));
const __VLS_38 = __VLS_37({
    ...{ class: "defaultValueItem" },
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    rules: (__VLS_ctx.formValue.required
        ? [
            {
                required: true,
                message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
            },
        ]
        : []),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
/** @type {__VLS_StyleScopedClasses['defaultValueItem']} */ ;
const { default: __VLS_41 } = __VLS_39.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "defaultValueCheckbox" },
});
/** @type {__VLS_StyleScopedClasses['defaultValueCheckbox']} */ ;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.formValue.show_default_value),
    label: (__VLS_ctx.$t('dynamicsForm.default.show')),
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.formValue.show_default_value),
    label: (__VLS_ctx.$t('dynamicsForm.default.show')),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elDatePicker | typeof __VLS_components.ElDatePicker | typeof __VLS_components['el-date-picker']} */
elDatePicker;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.formValue.default_value),
    type: (__VLS_ctx.formValue.type),
    placeholder: (__VLS_ctx.$t('dynamicsForm.DatePicker.placeholder')),
    format: (__VLS_ctx.formValue.format),
    valueFormat: (__VLS_ctx.formValue.format),
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.formValue.default_value),
    type: (__VLS_ctx.formValue.type),
    placeholder: (__VLS_ctx.$t('dynamicsForm.DatePicker.placeholder')),
    format: (__VLS_ctx.formValue.format),
    valueFormat: (__VLS_ctx.formValue.format),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
// @ts-ignore
[$t, $t, $t, $t, $t, formValue, formValue, formValue, formValue, formValue, formValue, formValue,];
var __VLS_39;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
