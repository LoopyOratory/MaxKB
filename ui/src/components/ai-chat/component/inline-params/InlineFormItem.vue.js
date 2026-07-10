/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, onMounted } from 'vue';
import bus from '@/utils/bus';
import { get } from 'lodash';
const props = defineProps();
const emit = defineEmits(['change', 'changeLabel']);
const loading = ref(false);
const componentFormRef = ref();
const itemValue = computed({
    get: () => props.modelValue,
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
const attrs = computed(() => {
    const base = props.formfield.attrs || {};
    if (props.formfield.input_type === 'MultiSelect' ||
        props.formfield.input_type === 'Knowledge' ||
        (props.formfield.input_type === 'TreeSelect' && base.multiple)) {
        return {
            ...base,
            'collapse-tags': true,
            'collapse-tags-tooltip': true,
            'max-collapse-tags': 1,
        };
    }
    return base;
});
const switchLabel = computed(() => {
    const label = typeof props.formfield.label === 'string'
        ? props.formfield.label
        : props.formfield.label?.label || props.formfield.field;
    return label;
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
const onTrigger = (self, trigger_field_dict) => {
    if (trigger_field_dict) {
        Object.keys(trigger_field_dict).forEach((key) => {
            const setting = trigger_field_dict[key];
            const values = setting.values;
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
onMounted(() => {
    props.initDefaultData(props.formfield);
    initTrigger(props.formfield, props.formfield.relation_trigger_field_dict);
    onTrigger(props.formfield, props.formfield.relation_trigger_field_dict);
});
const __VLS_exposed = {
    validate: () => {
        if (props.formfield.trigger_type === 'CHILD_FORMS' && componentFormRef.value) {
            return componentFormRef.value.validate();
        }
        return Promise.resolve();
    },
};
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "inline-form-item" },
    ...{ style: ({
            width: __VLS_ctx.formfield.input_type === 'SwitchInput' || __VLS_ctx.formfield.input_type === 'DatePicker'
                ? 'auto'
                : __VLS_ctx.formfield.input_type === 'Model' ? '165px' : '150px',
        }) },
});
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
/** @type {__VLS_StyleScopedClasses['inline-form-item']} */ ;
if (__VLS_ctx.formfield.input_type === 'SwitchInput') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center border border-r-6" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (__VLS_ctx.switchLabel),
        ...{ class: "mr-4 lighter ellipsis" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.switchLabel);
    const __VLS_0 = (__VLS_ctx.formfield.input_type);
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ref: "componentFormRef",
        view: (__VLS_ctx.view),
        modelValue: (__VLS_ctx.itemValue),
        formField: (__VLS_ctx.formfield),
        otherParams: (__VLS_ctx.otherParams),
        field: (__VLS_ctx.formfield.field),
        ...(__VLS_ctx.attrs),
        formfieldList: (__VLS_ctx.formfieldList),
        size: "small",
    }));
    const __VLS_2 = __VLS_1({
        ref: "componentFormRef",
        view: (__VLS_ctx.view),
        modelValue: (__VLS_ctx.itemValue),
        formField: (__VLS_ctx.formfield),
        otherParams: (__VLS_ctx.otherParams),
        field: (__VLS_ctx.formfield.field),
        ...(__VLS_ctx.attrs),
        formfieldList: (__VLS_ctx.formfieldList),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    var __VLS_3;
}
else {
    const __VLS_7 = (__VLS_ctx.formfield.input_type);
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ref: "componentFormRef",
        view: (__VLS_ctx.view),
        modelValue: (__VLS_ctx.itemValue),
        formField: (__VLS_ctx.formfield),
        otherParams: (__VLS_ctx.otherParams),
        field: (__VLS_ctx.formfield.field),
        ...(__VLS_ctx.attrs),
        formfieldList: (__VLS_ctx.formfieldList),
    }));
    const __VLS_9 = __VLS_8({
        ref: "componentFormRef",
        view: (__VLS_ctx.view),
        modelValue: (__VLS_ctx.itemValue),
        formField: (__VLS_ctx.formfield),
        otherParams: (__VLS_ctx.otherParams),
        field: (__VLS_ctx.formfield.field),
        ...(__VLS_ctx.attrs),
        formfieldList: (__VLS_ctx.formfieldList),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    var __VLS_12;
    var __VLS_10;
}
// @ts-ignore
var __VLS_6 = __VLS_5, __VLS_13 = __VLS_12;
// @ts-ignore
[formfield, formfield, formfield, formfield, formfield, formfield, formfield, formfield, formfield, formfield, vLoading, loading, switchLabel, switchLabel, view, view, itemValue, itemValue, otherParams, otherParams, attrs, attrs, formfieldList, formfieldList,];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
