/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import DynamicsForm from '@/components/dynamics-form/index.vue';
const props = withDefaults(defineProps(), {
    disabled: false
});
const form_setting_data = computed(() => {
    if (props.form_setting) {
        return JSON.parse(props.form_setting);
    }
    else {
        return {};
    }
});
const _submit = ref(false);
/**
 * FormFieldList
 */
const form_field_list = computed(() => {
    if (form_setting_data.value.form_field_list) {
        return form_setting_data.value.form_field_list;
    }
    return [];
});
const is_submit = computed(() => {
    if (_submit.value) {
        return true;
    }
    if (form_setting_data.value.is_submit) {
        return form_setting_data.value.is_submit;
    }
    else {
        return false;
    }
});
const _form_data = ref({});
const form_data = computed({
    get: () => {
        if (form_setting_data.value.is_submit) {
            return form_setting_data.value.form_data;
        }
        else {
            return _form_data.value;
        }
    },
    set: (v) => {
        _form_data.value = v;
    }
});
const dynamicsFormRef = ref();
const submit = () => {
    dynamicsFormRef.value?.validate().then(() => {
        _submit.value = true;
        if (props.sendMessage) {
            props.sendMessage('', 'old', {
                child_node: props.child_node,
                runtime_node_id: props.runtime_node_id,
                chat_record_id: props.chat_record_id,
                node_data: form_data.value
            });
        }
    });
};
const __VLS_defaults = {
    disabled: false
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
const __VLS_0 = DynamicsForm || DynamicsForm;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    disabled: (__VLS_ctx.is_submit || __VLS_ctx.disabled),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "dynamicsFormRef",
    render_data: (__VLS_ctx.form_field_list),
    labelSuffix: ":",
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
}));
const __VLS_2 = __VLS_1({
    disabled: (__VLS_ctx.is_submit || __VLS_ctx.disabled),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ref: "dynamicsFormRef",
    render_data: (__VLS_ctx.form_field_list),
    labelSuffix: ":",
    modelValue: (__VLS_ctx.form_data),
    model: (__VLS_ctx.form_data),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.is_submit ? 'info' : 'primary'),
    disabled: (__VLS_ctx.is_submit || __VLS_ctx.disabled),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onClick': {} },
    type: (__VLS_ctx.is_submit ? 'info' : 'primary'),
    disabled: (__VLS_ctx.is_submit || __VLS_ctx.disabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.click} */
    onClick: (__VLS_ctx.submit),
};
const { default: __VLS_14 } = __VLS_10.slots;
(__VLS_ctx.$t('common.submit'));
// @ts-ignore
[is_submit, is_submit, is_submit, disabled, disabled, form_field_list, form_data, form_data, submit, $t,];
var __VLS_10;
var __VLS_11;
// @ts-ignore
var __VLS_6 = __VLS_5;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
