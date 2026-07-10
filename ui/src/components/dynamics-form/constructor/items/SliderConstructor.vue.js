/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onBeforeMount, watch } from 'vue';
import { t } from '@/locales';
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
        input_type: 'Slider',
        attrs: {
            min: formValue.value.min,
            max: formValue.value.max,
            step: formValue.value.step,
            precision: formValue.value.precision,
            'show-input-controls': false,
            'show-input': formValue.value.showInput,
        },
        props_info: {
            rules: [
                {
                    message: formValue.value.label + ' ' + t('dynamicsForm.tip.requiredMessage'),
                    trigger: 'blur',
                    required: formValue.value.required,
                },
            ],
        },
        show_default_value: true,
        default_value: formValue.value.default_value,
    };
};
watch(() => formValue.value.min, () => {
    if (formValue.value.min > formValue.value.max) {
        formValue.value.max = formValue.value.min;
    }
});
const rander = (form_data) => {
    const attrs = form_data.attrs;
    formValue.value.option_list = form_data.option_list;
    formValue.value.min = attrs.min;
    formValue.value.max = attrs.max;
    formValue.value.step = attrs.step;
    formValue.value.showInput = attrs['show-input'];
    formValue.value.default_value = form_data.default_value;
};
const step_rules = [
    {
        required: true,
        validator: (rule, value, callback) => {
            if (value === 0) {
                callback(new Error(t('dynamicsForm.Slider.step.requiredMessage2')));
                return false;
            }
            if (!value) {
                callback(new Error(t('dynamicsForm.Slider.step.requiredMessage1')));
                return false;
            }
            return true;
        },
        trigger: 'blur',
    },
];
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onBeforeMount(() => {
    formValue.value.min = 0;
    formValue.value.max = 20;
    formValue.value.step = 0.1;
    formValue.value.default_value = 1;
    formValue.value.showInput = true;
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
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.Slider.showInput.label')),
    required: true,
    prop: "showInput",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('dynamicsForm.Slider.showInput.label')),
    required: true,
    prop: "showInput",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.click} */
    onClick: () => { },
};
const { default: __VLS_7 } = __VLS_3.slots;
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.formValue.showInput),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.formValue.showInput),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
// @ts-ignore
[$t, formValue,];
var __VLS_3;
var __VLS_4;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    label: (__VLS_ctx.$t('dynamicsForm.Slider.valueRange.label')),
    required: true,
}));
const __VLS_15 = __VLS_14({
    label: (__VLS_ctx.$t('dynamicsForm.Slider.valueRange.label')),
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const { default: __VLS_18 } = __VLS_16.slots;
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
    span: (11),
    ...{ style: {} },
}));
const __VLS_21 = __VLS_20({
    span: (11),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
let __VLS_25;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.Slider.valueRange.minRequired'),
            trigger: 'change',
        },
    ]),
    prop: "min",
}));
const __VLS_27 = __VLS_26({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.Slider.valueRange.minRequired'),
            trigger: 'change',
        },
    ]),
    prop: "min",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const { default: __VLS_30 } = __VLS_28.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.min),
    controlsPosition: "right",
}));
const __VLS_33 = __VLS_32({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.min),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
// @ts-ignore
[$t, $t, formValue,];
var __VLS_28;
// @ts-ignore
[];
var __VLS_22;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    span: (2),
    ...{ class: "text-center" },
}));
const __VLS_38 = __VLS_37({
    span: (2),
    ...{ class: "text-center" },
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
const { default: __VLS_41 } = __VLS_39.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "text-gray-500" },
});
/** @type {__VLS_StyleScopedClasses['text-gray-500']} */ ;
// @ts-ignore
[];
var __VLS_39;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    span: (11),
}));
const __VLS_44 = __VLS_43({
    span: (11),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.Slider.valueRange.maxRequired'),
            trigger: 'change',
        },
    ]),
    prop: "max",
}));
const __VLS_50 = __VLS_49({
    rules: ([
        {
            required: true,
            message: __VLS_ctx.$t('dynamicsForm.Slider.valueRange.maxRequired'),
            trigger: 'change',
        },
    ]),
    prop: "max",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
let __VLS_54;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
    prop: "max",
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.max),
    min: (__VLS_ctx.formValue.min > __VLS_ctx.formValue.max ? __VLS_ctx.formValue.min : undefined),
    controlsPosition: "right",
}));
const __VLS_56 = __VLS_55({
    prop: "max",
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.max),
    min: (__VLS_ctx.formValue.min > __VLS_ctx.formValue.max ? __VLS_ctx.formValue.min : undefined),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
// @ts-ignore
[$t, formValue, formValue, formValue, formValue,];
var __VLS_51;
// @ts-ignore
[];
var __VLS_45;
// @ts-ignore
[];
var __VLS_16;
let __VLS_59;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
    span: (11),
    ...{ style: {} },
}));
const __VLS_61 = __VLS_60({
    span: (11),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_60));
const { default: __VLS_64 } = __VLS_62.slots;
let __VLS_65;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent1(__VLS_65, new __VLS_65({
    label: (__VLS_ctx.$t('dynamicsForm.Slider.step.label')),
    required: true,
    prop: "step",
    rules: (__VLS_ctx.step_rules),
}));
const __VLS_67 = __VLS_66({
    label: (__VLS_ctx.$t('dynamicsForm.Slider.step.label')),
    required: true,
    prop: "step",
    rules: (__VLS_ctx.step_rules),
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
const { default: __VLS_70 } = __VLS_68.slots;
let __VLS_71;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.step),
    min: (0),
    controlsPosition: "right",
}));
const __VLS_73 = __VLS_72({
    ...{ style: {} },
    modelValue: (__VLS_ctx.formValue.step),
    min: (0),
    controlsPosition: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_72));
// @ts-ignore
[$t, formValue, step_rules,];
var __VLS_68;
// @ts-ignore
[];
var __VLS_62;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    rules: (__VLS_ctx.formValue.required
        ? [{ required: true, message: __VLS_ctx.$t('dynamicsForm.default.requiredMessage') }]
        : []),
}));
const __VLS_78 = __VLS_77({
    label: (__VLS_ctx.$t('dynamicsForm.default.label')),
    required: (__VLS_ctx.formValue.required),
    prop: "default_value",
    rules: (__VLS_ctx.formValue.required
        ? [{ required: true, message: __VLS_ctx.$t('dynamicsForm.default.requiredMessage') }]
        : []),
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
const { default: __VLS_81 } = __VLS_79.slots;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elSlider | typeof __VLS_components.ElSlider | typeof __VLS_components['el-slider']} */
elSlider;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
    modelValue: (__VLS_ctx.formValue.default_value),
    showInput: (__VLS_ctx.formValue.showInput),
    showInputControls: (false),
    max: (__VLS_ctx.formValue.max),
    min: (__VLS_ctx.formValue.min),
    step: (__VLS_ctx.formValue.step == 0 ? 0.1 : __VLS_ctx.formValue.step),
    precision: (__VLS_ctx.formValue.precision),
}));
const __VLS_84 = __VLS_83({
    modelValue: (__VLS_ctx.formValue.default_value),
    showInput: (__VLS_ctx.formValue.showInput),
    showInputControls: (false),
    max: (__VLS_ctx.formValue.max),
    min: (__VLS_ctx.formValue.min),
    step: (__VLS_ctx.formValue.step == 0 ? 0.1 : __VLS_ctx.formValue.step),
    precision: (__VLS_ctx.formValue.precision),
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
// @ts-ignore
[$t, $t, formValue, formValue, formValue, formValue, formValue, formValue, formValue, formValue, formValue,];
var __VLS_79;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
