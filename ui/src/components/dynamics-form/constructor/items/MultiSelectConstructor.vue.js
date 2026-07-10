/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, inject } from 'vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { t } from '@/locales';
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
const default_ref_variables_value_rule = {
    required: true,
    validator: (rule, value, callback) => {
        console.log(value.length);
        if (!(Array.isArray(value) && value.length > 1)) {
            callback(t('workflow.variable.Referencing') + t('common.required'));
        }
        return true;
    },
    trigger: 'blur',
};
const addOption = () => {
    formValue.value.option_list.push({ value: '', label: '' });
};
const delOption = (index) => {
    const option = formValue.value.option_list[index];
    if (option.value && formValue.value.default_value == option.value) {
        formValue.value.default_value = '';
    }
    formValue.value.option_list.splice(index, 1);
};
const getData = () => {
    return {
        input_type: 'MultiSelect',
        attrs: {},
        default_value: formValue.value.default_value,
        show_default_value: formValue.value.show_default_value,
        text_field: 'label',
        value_field: 'value',
        option_list: formValue.value.option_list,
        assignment_method: formValue.value.assignment_method || 'custom',
    };
};
const rander = (form_data) => {
    formValue.value.option_list = form_data.option_list || [];
    formValue.value.default_value = form_data.default_value;
    formValue.value.assignment_method = form_data.assignment_method || 'custom';
};
const __VLS_exposed = { getData, rander };
defineExpose(__VLS_exposed);
onMounted(() => {
    formValue.value.option_list = [];
    formValue.value.default_value = '';
    formValue.value.assignment_method = 'custom';
    if (formValue.value.show_default_value === undefined) {
        formValue.value.show_default_value = true;
    }
    addOption();
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
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.formValue.assignment_method),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.formValue.assignment_method),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    let __VLS_18;
    const __VLS_19 = {
        /** @type {typeof __VLS_18.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.getModel))
                throw 0;
            return __VLS_ctx.formValue.option_list = [];
            // @ts-ignore
            [formValue, formValue,];
        },
    };
    const { default: __VLS_20 } = __VLS_16.slots;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.assignment_method_option_list))) {
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
        elRadio;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            value: (item.value),
            size: "large",
            key: (index),
        }));
        const __VLS_23 = __VLS_22({
            value: (item.value),
            size: "large",
            key: (index),
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        const { default: __VLS_26 } = __VLS_24.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        (item.label);
        if (item.value == 'ref_variables') {
            let __VLS_27;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
                effect: "dark",
                placement: "right",
            }));
            const __VLS_29 = __VLS_28({
                effect: "dark",
                placement: "right",
            }, ...__VLS_functionalComponentArgsRest(__VLS_28));
            const { default: __VLS_32 } = __VLS_30.slots;
            {
                const { content: __VLS_33 } = __VLS_30.slots;
                (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.ref_variables.popover'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.ref_variables.popover_label'));
                (__VLS_ctx.$t('common.required'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.ref_variables.popover_value'));
                (__VLS_ctx.$t('common.required'));
                __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
                (__VLS_ctx.$t('dynamicsForm.AssignmentMethod.ref_variables.popover_default'));
                // @ts-ignore
                [$t, $t, $t, $t, $t, $t, assignment_method_option_list,];
            }
            let __VLS_34;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
                iconName: "app-warning",
                ...{ class: "app-warning-icon ml-4" },
            }));
            const __VLS_36 = __VLS_35({
                iconName: "app-warning",
                ...{ class: "app-warning-icon ml-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_35));
            /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            // @ts-ignore
            [];
            var __VLS_30;
        }
        // @ts-ignore
        [];
        var __VLS_24;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_16;
    var __VLS_17;
    // @ts-ignore
    [];
    var __VLS_10;
    // @ts-ignore
    [];
    var __VLS_3;
}
if (__VLS_ctx.formValue.assignment_method == 'ref_variables') {
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        required: (true),
        prop: "option_list",
        rules: ([__VLS_ctx.default_ref_variables_value_rule]),
    }));
    const __VLS_41 = __VLS_40({
        required: (true),
        prop: "option_list",
        rules: ([__VLS_ctx.default_ref_variables_value_rule]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    const { default: __VLS_44 } = __VLS_42.slots;
    const __VLS_45 = NodeCascader;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.model),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.formValue.option_list),
    }));
    const __VLS_47 = __VLS_46({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.model),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.formValue.option_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    var __VLS_50;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_48;
    // @ts-ignore
    [$t, formValue, formValue, default_ref_variables_value_rule, model,];
    var __VLS_42;
}
if (__VLS_ctx.formValue.assignment_method == 'custom') {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
    const { default: __VLS_57 } = __VLS_55.slots;
    {
        const { label: __VLS_58 } = __VLS_55.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        (__VLS_ctx.$t('dynamicsForm.Select.label'));
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_61 = __VLS_60({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
        let __VLS_64;
        const __VLS_65 = {
            /** @type {typeof __VLS_64.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.formValue.assignment_method == 'custom'))
                    throw 0;
                return __VLS_ctx.addOption();
                // @ts-ignore
                [$t, formValue, addOption,];
            },
        };
        const { default: __VLS_66 } = __VLS_62.slots;
        let __VLS_67;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }));
        const __VLS_69 = __VLS_68({
            iconName: "app-add-outlined",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_68));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('common.add'));
        // @ts-ignore
        [$t,];
        var __VLS_62;
        var __VLS_63;
        // @ts-ignore
        [];
    }
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        ...{ style: {} },
        gutter: (10),
    }));
    const __VLS_74 = __VLS_73({
        ...{ style: {} },
        gutter: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    const { default: __VLS_77 } = __VLS_75.slots;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        span: (10),
    }));
    const __VLS_80 = __VLS_79({
        span: (10),
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    const { default: __VLS_83 } = __VLS_81.slots;
    (__VLS_ctx.$t('dynamicsForm.tag.label'));
    // @ts-ignore
    [$t,];
    var __VLS_81;
    let __VLS_84;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
        span: (12),
    }));
    const __VLS_86 = __VLS_85({
        span: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    const { default: __VLS_89 } = __VLS_87.slots;
    (__VLS_ctx.$t('dynamicsForm.Select.label'));
    // @ts-ignore
    [$t,];
    var __VLS_87;
    // @ts-ignore
    [];
    var __VLS_75;
    for (const [option, $index] of __VLS_vFor((__VLS_ctx.formValue.option_list))) {
        let __VLS_90;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
            ...{ style: {} },
            key: ($index),
            gutter: (10),
            ...{ class: "mb-8" },
        }));
        const __VLS_92 = __VLS_91({
            ...{ style: {} },
            key: ($index),
            gutter: (10),
            ...{ class: "mb-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_91));
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        const { default: __VLS_95 } = __VLS_93.slots;
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            span: (10),
        }));
        const __VLS_98 = __VLS_97({
            span: (10),
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        const { default: __VLS_101 } = __VLS_99.slots;
        let __VLS_102;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
            modelValue: (__VLS_ctx.formValue.option_list[$index].label),
            placeholder: (__VLS_ctx.$t('dynamicsForm.tag.placeholder')),
        }));
        const __VLS_104 = __VLS_103({
            modelValue: (__VLS_ctx.formValue.option_list[$index].label),
            placeholder: (__VLS_ctx.$t('dynamicsForm.tag.placeholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_103));
        // @ts-ignore
        [$t, formValue, formValue,];
        var __VLS_99;
        let __VLS_107;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
            span: (12),
        }));
        const __VLS_109 = __VLS_108({
            span: (12),
        }, ...__VLS_functionalComponentArgsRest(__VLS_108));
        const { default: __VLS_112 } = __VLS_110.slots;
        let __VLS_113;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
            modelValue: (__VLS_ctx.formValue.option_list[$index].value),
            placeholder: (__VLS_ctx.$t('dynamicsForm.Select.label')),
        }));
        const __VLS_115 = __VLS_114({
            modelValue: (__VLS_ctx.formValue.option_list[$index].value),
            placeholder: (__VLS_ctx.$t('dynamicsForm.Select.label')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        // @ts-ignore
        [$t, formValue,];
        var __VLS_110;
        let __VLS_118;
        /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
        elCol;
        // @ts-ignore
        const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
            span: (1),
        }));
        const __VLS_120 = __VLS_119({
            span: (1),
        }, ...__VLS_functionalComponentArgsRest(__VLS_119));
        const { default: __VLS_123 } = __VLS_121.slots;
        let __VLS_124;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent1(__VLS_124, new __VLS_124({
            ...{ 'onClick': {} },
            link: true,
            ...{ class: "ml-8" },
        }));
        const __VLS_126 = __VLS_125({
            ...{ 'onClick': {} },
            link: true,
            ...{ class: "ml-8" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        let __VLS_129;
        const __VLS_130 = {
            /** @type {typeof __VLS_129.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.formValue.assignment_method == 'custom'))
                    throw 0;
                return __VLS_ctx.delOption($index);
                // @ts-ignore
                [delOption,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        const { default: __VLS_131 } = __VLS_127.slots;
        let __VLS_132;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
            iconName: "app-delete",
        }));
        const __VLS_134 = __VLS_133({
            iconName: "app-delete",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        // @ts-ignore
        [];
        var __VLS_127;
        var __VLS_128;
        // @ts-ignore
        [];
        var __VLS_121;
        // @ts-ignore
        [];
        var __VLS_93;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_55;
}
if (__VLS_ctx.formValue.assignment_method == 'custom') {
    let __VLS_137;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_138 = __VLS_asFunctionalComponent1(__VLS_137, new __VLS_137({
        ...{ class: "defaultValueItem" },
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
        required: (__VLS_ctx.formValue.required),
        prop: "default_value",
        rules: (__VLS_ctx.formValue.required
            ? [
                {
                    required: true,
                    message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
                },
            ]
            : []),
    }));
    const __VLS_139 = __VLS_138({
        ...{ class: "defaultValueItem" },
        label: (__VLS_ctx.$t('dynamicsForm.default.label')),
        required: (__VLS_ctx.formValue.required),
        prop: "default_value",
        rules: (__VLS_ctx.formValue.required
            ? [
                {
                    required: true,
                    message: `${__VLS_ctx.$t('dynamicsForm.default.label')}${__VLS_ctx.$t('dynamicsForm.default.requiredMessage')}`,
                },
            ]
            : []),
    }, ...__VLS_functionalComponentArgsRest(__VLS_138));
    /** @type {__VLS_StyleScopedClasses['defaultValueItem']} */ ;
    const { default: __VLS_142 } = __VLS_140.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "defaultValueCheckbox" },
    });
    /** @type {__VLS_StyleScopedClasses['defaultValueCheckbox']} */ ;
    let __VLS_143;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_144 = __VLS_asFunctionalComponent1(__VLS_143, new __VLS_143({
        modelValue: (__VLS_ctx.formValue.show_default_value),
        label: (__VLS_ctx.$t('dynamicsForm.default.show')),
    }));
    const __VLS_145 = __VLS_144({
        modelValue: (__VLS_ctx.formValue.show_default_value),
        label: (__VLS_ctx.$t('dynamicsForm.default.show')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_144));
    let __VLS_148;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent1(__VLS_148, new __VLS_148({
        ...{ class: "m-2" },
        multiple: true,
        collapseTags: true,
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        modelValue: (__VLS_ctx.formValue.default_value),
        teleported: (false),
        popperClass: "custom-select-popper",
    }));
    const __VLS_150 = __VLS_149({
        ...{ class: "m-2" },
        multiple: true,
        collapseTags: true,
        filterable: true,
        clearable: true,
        reserveKeyword: (false),
        modelValue: (__VLS_ctx.formValue.default_value),
        teleported: (false),
        popperClass: "custom-select-popper",
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    /** @type {__VLS_StyleScopedClasses['m-2']} */ ;
    const { default: __VLS_153 } = __VLS_151.slots;
    for (const [option, index] of __VLS_vFor((__VLS_ctx.formValue.option_list))) {
        let __VLS_154;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
            key: (index),
            label: (option.label),
            value: (option.value),
        }));
        const __VLS_156 = __VLS_155({
            key: (index),
            label: (option.label),
            value: (option.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_155));
        // @ts-ignore
        [$t, $t, $t, $t, formValue, formValue, formValue, formValue, formValue, formValue,];
    }
    // @ts-ignore
    [];
    var __VLS_151;
    // @ts-ignore
    [];
    var __VLS_140;
}
// @ts-ignore
var __VLS_51 = __VLS_50;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __typeProps: {},
});
export default {};
