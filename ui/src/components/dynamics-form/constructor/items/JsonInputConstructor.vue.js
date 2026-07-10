/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, ref, inject } from 'vue';
import { t } from '@/locales';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import JsonInput from '@/components/dynamics-form/items/JsonInput.vue';
const props = defineProps();
const getModel = inject('getModel');
const assignment_method_option_list = computed(() => {
    const option_list = [
        {
            label: t('common.custom'),
            value: 'custom',
        },
    ];
    if (getModel) {
        option_list.push({
            label: t('workflow.variable.Referencing'),
            value: 'ref_variables',
        });
    }
    return option_list;
});
const model = computed(() => {
    if (getModel) {
        return getModel();
    }
    else {
        return null;
    }
});
const emit = defineEmits(['update:modelValue']);
const formValue = computed({
    set: (item) => {
        emit('update:modelValue', item);
    },
    get: () => {
        return props.modelValue;
    },
});
const jsonInputRef = ref();
const getData = () => {
    return {
        input_type: 'JsonInput',
        attrs: {},
        props_info: {
            rules: [
                {
                    required: formValue.value.required,
                    validator: `validator = (rule, value, callback) => {
            return componentFormRef.value?.validate_rules(rule, value, callback);

}`,
                    trigger: 'blur',
                },
            ],
        },
        default_value: formValue.value.default_value,
        show_default_value: formValue.value.show_default_value,
        default_value_assignment_method: formValue.value.default_value_assignment_method || 'custom',
    };
};
const default_value_rule = {
    required: true,
    validator: (rule, value, callback) => {
        jsonInputRef.value?.validate_rules(rule, value, callback);
        return true;
    },
    trigger: 'blur',
};
const default_ref_variables_value_rule = {
    required: true,
    validator: (rule, value, callback) => {
        if (!(Array.isArray(value) && value.length > 1)) {
            callback(t('workflow.variable.Referencing') + t('common.required'));
        }
        return true;
    },
    trigger: 'blur',
};
const rander = (form_data) => {
    formValue.value.default_value = form_data.default_value;
    formValue.value.default_value_assignment_method =
        form_data.default_value_assignment_method || 'custom';
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onMounted(() => {
    formValue.value.default_value = {};
    formValue.value.default_value_assignment_method = 'custom';
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
if (__VLS_ctx.getModel) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
    const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
    const { default: __VLS_5 } = __VLS_3.slots;
    {
        const { label: __VLS_6 } = __VLS_3.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.label', 'Assignment method'));
        // @ts-ignore
        [getModel, $t,];
    }
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        ...{ class: "w-full" },
    }));
    const __VLS_9 = __VLS_8({
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
    elRadioGroup;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        modelValue: (__VLS_ctx.formValue.default_value_assignment_method),
    }));
    const __VLS_15 = __VLS_14({
        modelValue: (__VLS_ctx.formValue.default_value_assignment_method),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    const { default: __VLS_18 } = __VLS_16.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.assignment_method_option_list))) {
        let __VLS_19;
        /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
        elRadio;
        // @ts-ignore
        const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
            value: (item.value),
            size: "large",
            key: (index),
        }));
        const __VLS_21 = __VLS_20({
            value: (item.value),
            size: "large",
            key: (index),
        }, ...__VLS_functionalComponentArgsRest(__VLS_20));
        const { default: __VLS_24 } = __VLS_22.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        (item.label);
        if (item.value == 'ref_variables') {
            let __VLS_25;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
                effect: "dark",
                placement: "right",
            }));
            const __VLS_27 = __VLS_26({
                effect: "dark",
                placement: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
            const { default: __VLS_30 } = __VLS_28.slots;
            {
                const { content: __VLS_31 } = __VLS_28.slots;
                (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.ref_variables.popover'));
                (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.ref_variables.json_format'));
                // @ts-ignore
                [$t, $t, formValue, assignment_method_option_list,];
            }
            let __VLS_32;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                iconName: "app-warning",
                ...{ class: "app-warning-icon ml-4" },
            }));
            const __VLS_34 = __VLS_33({
                iconName: "app-warning",
                ...{ class: "app-warning-icon ml-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            // @ts-ignore
            [];
            var __VLS_28;
        }
        // @ts-ignore
        [];
        var __VLS_22;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_16;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
    var __VLS_3;
}
if (__VLS_ctx.formValue.default_value_assignment_method == 'ref_variables') {
    let __VLS_37;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
        required: (true),
        prop: "default_value",
        rules: ([__VLS_ctx.default_ref_variables_value_rule]),
    }));
    const __VLS_39 = __VLS_38({
        required: (true),
        prop: "default_value",
        rules: ([__VLS_ctx.default_ref_variables_value_rule]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    const { default: __VLS_42 } = __VLS_40.slots;
    const __VLS_43 = NodeCascader;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.model),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.formValue.default_value),
    }));
    const __VLS_45 = __VLS_44({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.model),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.formValue.default_value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    var __VLS_48;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_46;
    // @ts-ignore
    [$t, formValue, formValue, default_ref_variables_value_rule, model,];
    var __VLS_40;
}
if (__VLS_ctx.formValue.default_value_assignment_method == 'custom') {
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        ...{ class: "defaultValueItem" },
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
        required: (__VLS_ctx.formValue.required),
        prop: "default_value",
        rules: ([__VLS_ctx.default_value_rule]),
    }));
    const __VLS_52 = __VLS_51({
        ...{ class: "defaultValueItem" },
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
        required: (__VLS_ctx.formValue.required),
        prop: "default_value",
        rules: ([__VLS_ctx.default_value_rule]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    /** @type {__VLS_StyleScopedClasses['defaultValueItem']} */ ;
    const { default: __VLS_55 } = __VLS_53.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "defaultValueCheckbox" },
    });
    /** @type {__VLS_StyleScopedClasses['defaultValueCheckbox']} */ ;
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        modelValue: (__VLS_ctx.formValue.show_default_value),
        label: (__VLS_ctx.$t('dynamicsForm.default.show')),
    }));
    const __VLS_58 = __VLS_57({
        modelValue: (__VLS_ctx.formValue.show_default_value),
        label: (__VLS_ctx.$t('dynamicsForm.default.show')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    const __VLS_61 = JsonInput || JsonInput;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        ref: "jsonInputRef",
        modelValue: (__VLS_ctx.formValue.default_value),
    }));
    const __VLS_63 = __VLS_62({
        ref: "jsonInputRef",
        modelValue: (__VLS_ctx.formValue.default_value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    var __VLS_66;
    var __VLS_64;
    // @ts-ignore
    [$t, $t, formValue, formValue, formValue, formValue, default_value_rule,];
    var __VLS_53;
}
// @ts-ignore
var __VLS_49 = __VLS_48, __VLS_67 = __VLS_66;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
