/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import FormItemLabel from './FormItemLabel.vue';
import bus from '@/utils/bus';
import { t } from '@/locales';
import { get } from 'lodash';
const props = defineProps();
const emit = defineEmits(['change', 'changeLabel']);
const loading = ref(false);
const isString = (value) => {
    return typeof value === 'string';
};
const labelValue = computed({
    get: () => {
        return props.formValue[props.formfield.label.field];
    },
    set: (value) => {
        emit('changeLabel', value);
        bus.emit(props.formfield.label.field, value);
    },
});
const itemValue = computed({
    get: () => {
        return props.modelValue;
    },
    set: (value) => {
        emit('change', value);
        if (props.parent_field) {
            bus.emit(props.parent_field + '.' + props.formfield.field, value);
        }
        else {
            bus.emit(props.formfield.field, value);
        }
    },
});
const componentFormRef = ref();
const label_attrs = computed(() => {
    return props.formfield.label &&
        typeof props.formfield.label !== 'string' &&
        props.formfield.label.attrs
        ? props.formfield.label.attrs
        : {};
});
const props_info = computed(() => {
    return props.formfield.props_info ? props.formfield.props_info : {};
});
/**
 * Form item style
 */
const formItemStyle = computed(() => {
    return props_info.value.item_style ? props_info.value.item_style : {};
});
/**
 * FormErrorMsg
 */
const errMsg = computed(() => {
    return props_info.value.err_msg
        ? props_info.value.err_msg
        : isString(props.formfield.label)
            ? props.formfield.label + ' ' + t('dynamicsForm.tip.requiredMessage')
            : props.formfield.label.label + ' ' + t('dynamicsForm.tip.requiredMessage');
});
/**
 * Deserialize
 * @param rule
 */
const to_rule = (rule) => {
    if (rule.validator) {
        // eslint-disable-next-line prefer-const
        let validator = (rule, value, callback) => { };
        eval(rule.validator);
        return { ...rule, validator };
    }
    return rule;
};
/**
 * Validate
 */
const rules = computed(() => {
    return props_info.value.rules
        ? props_info.value.rules.map(to_rule)
        : {
            message: errMsg.value,
            trigger: props.formfield.input_type === 'Slider' ? 'blur' : ['blur', 'change'],
            required: props.formfield.required === false ? false : true,
        };
});
/**
 * ComponentStyle
 */
const componentStyle = computed(() => {
    return props_info.value.style ? props_info.value.style : {};
});
/**
 * Componentattrs
 */
const attrs = computed(() => {
    return props.formfield.attrs ? props.formfield.attrs : {};
});
const initTrigger = (self, trigger_field_dict) => {
    if (trigger_field_dict) {
        Object.keys(trigger_field_dict).forEach((key) => {
            const setting = trigger_field_dict[key];
            const triggerValues = setting['values'];
            const value = get(props.formValue, key);
            if (triggerValues && triggerValues.length > 0) {
                if (triggerValues.includes(value)) {
                    props.trigger(key, value, setting, self, loading);
                }
            }
            else {
                props.trigger(key, value, setting, self, loading);
            }
        });
    }
};
onMounted(() => {
    props.initDefaultData(props.formfield);
    initTrigger(props.formfield, props.formfield.relation_trigger_field_dict);
    initTrigger(props.formfield.label, props.formfield.label?.relation_trigger_field_dict);
    isString(props.formfield.label)
        ? undefined
        : onTrigger(props.formfield.label, props.formfield.label.relation_trigger_field_dict);
    onTrigger(props.formfield, props.formfield.relation_trigger_field_dict);
});
const onTrigger = (self, trigger_field_dict) => {
    if (trigger_field_dict) {
        const keys = Object.keys(trigger_field_dict);
        keys.forEach((key) => {
            const setting = trigger_field_dict[key];
            const values = setting.values;
            // AddRelation
            bus.on(key, (v) => {
                if (values && values.length > 0) {
                    if (values.includes(v)) {
                        props.trigger(key, v, setting, self, loading);
                    }
                }
                else {
                    props.trigger(key, v, setting, self, loading);
                }
            });
        });
    }
};
const validate = () => {
    if (props.formfield.trigger_type === 'CHILD_FORMS' && componentFormRef.value) {
        return componentFormRef.value.validate();
    }
    return Promise.resolve();
};
const __VLS_exposed = { validate };
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
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ style: (__VLS_ctx.formItemStyle) },
    prop: (__VLS_ctx.formfield.field),
    key: (__VLS_ctx.formfield.field),
    rules: (__VLS_ctx.rules),
    ...{ class: (__VLS_ctx.formfield.required_asterisk ? 'hide-asterisk' : '') },
}));
const __VLS_2 = __VLS_1({
    ...{ style: (__VLS_ctx.formItemStyle) },
    prop: (__VLS_ctx.formfield.field),
    key: (__VLS_ctx.formfield.field),
    rules: (__VLS_ctx.rules),
    ...{ class: (__VLS_ctx.formfield.required_asterisk ? 'hide-asterisk' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
if (__VLS_ctx.formfield.label) {
    {
        const { label: __VLS_7 } = __VLS_3.slots;
        if (__VLS_ctx.isString(__VLS_ctx.formfield.label)) {
            const __VLS_8 = FormItemLabel || FormItemLabel;
            // @ts-ignore
            const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
                formField: (__VLS_ctx.formfield),
            }));
            const __VLS_10 = __VLS_9({
                formField: (__VLS_ctx.formfield),
            }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        }
        else {
            const __VLS_13 = (__VLS_ctx.formfield.label.input_type);
            // @ts-ignore
            const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
                label: (__VLS_ctx.formfield.label),
                modelValue: (__VLS_ctx.labelValue),
                formValue: (__VLS_ctx.formValue),
                ...(__VLS_ctx.label_attrs),
            }));
            const __VLS_15 = __VLS_14({
                label: (__VLS_ctx.formfield.label),
                modelValue: (__VLS_ctx.labelValue),
                formValue: (__VLS_ctx.formValue),
                ...(__VLS_ctx.label_attrs),
            }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        }
        // @ts-ignore
        [formItemStyle, formfield, formfield, formfield, formfield, formfield, formfield, formfield, formfield, rules, vLoading, loading, isString, labelValue, formValue, label_attrs,];
    }
}
const __VLS_18 = (__VLS_ctx.formfield.input_type);
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ref: "componentFormRef",
    view: (__VLS_ctx.view),
    modelValue: (__VLS_ctx.itemValue),
    formField: (__VLS_ctx.formfield),
    otherParams: (__VLS_ctx.otherParams),
    ...{ style: (__VLS_ctx.componentStyle) },
    field: (__VLS_ctx.formfield.field),
    ...(__VLS_ctx.attrs),
    formfieldList: (__VLS_ctx.formfieldList),
}));
const __VLS_20 = __VLS_19({
    ref: "componentFormRef",
    view: (__VLS_ctx.view),
    modelValue: (__VLS_ctx.itemValue),
    formField: (__VLS_ctx.formfield),
    otherParams: (__VLS_ctx.otherParams),
    ...{ style: (__VLS_ctx.componentStyle) },
    field: (__VLS_ctx.formfield.field),
    ...(__VLS_ctx.attrs),
    formfieldList: (__VLS_ctx.formfieldList),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
var __VLS_23;
var __VLS_21;
// @ts-ignore
[formfield, formfield, formfield, view, itemValue, otherParams, componentStyle, attrs, formfieldList,];
var __VLS_3;
// @ts-ignore
var __VLS_24 = __VLS_23;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
