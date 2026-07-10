/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, nextTick } from 'vue';
import { input_type_list as input_type_list_data } from '@/components/dynamics-form/constructor/data';
import { t } from '@/locales';
import VisibilityConstructor from '../visibility/Constructor.vue';
const props = withDefaults(defineProps(), {
    enableVisibility: false,
    input_type_list: () => input_type_list_data.map((item) => ({
        label: item.label,
        value: item.value + 'Constructor',
    })),
});
const emit = defineEmits(['update:modelValue']);
const activeTab = ref('basic');
const ruleFormRef = ref();
const componentFormRef = ref();
const form_data = ref({
    label: '',
    field: '',
    tooltip: '',
    required: false,
    input_type: '',
});
const visibility_rules = ref(null);
const visibilityRef = ref();
const rules = {
    label: [{ required: true, message: t('dynamicsForm.paramForm.name.requiredMessage') }],
    field: [{ required: true, message: t('dynamicsForm.paramForm.field.requiredMessage') }],
    required: [{ required: true, message: t('dynamicsForm.paramForm.required.requiredMessage') }],
    input_type: [{ required: true, message: t('dynamicsForm.paramForm.input_type.requiredMessage') }],
};
const getData = () => {
    let label = form_data.value.label;
    if (form_data.value.tooltip) {
        label = {
            input_type: 'TooltipLabel',
            label: form_data.value.label,
            attrs: { tooltip: form_data.value.tooltip },
            props_info: {},
        };
    }
    return {
        label: label,
        required: form_data.value.required,
        field: form_data.value.field,
        default_value: form_data.value.default_value,
        show_default_value: form_data.value.show_default_value,
        visibility_rules: visibilityRef.value?.getData() ?? null,
        ...componentFormRef.value.getData(),
    };
};
const validate = () => {
    const promises = [];
    if (ruleFormRef.value) {
        promises.push(ruleFormRef.value.validate());
    }
    if (visibilityRef.value?.validate) {
        promises.push(visibilityRef.value.validate());
    }
    return Promise.all(promises);
};
onMounted(() => {
    if (props.modelValue) {
        rander(props.modelValue);
    }
});
const rander = (data) => {
    form_data.value.required = data.required ? data.required : false;
    form_data.value.field = data.field;
    visibility_rules.value = data.visibility_rules ?? null;
    if (data.show_default_value !== undefined) {
        form_data.value.show_default_value = data.show_default_value;
    }
    if (data.input_type) {
        form_data.value.input_type = data.input_type + 'Constructor';
    }
    if (data.label && data.label.input_type === 'TooltipLabel') {
        form_data.value.tooltip = data.label.attrs.tooltip;
        form_data.value.label = data.label.label;
    }
    else {
        form_data.value.label = data.label;
    }
    nextTick(() => {
        componentFormRef.value?.rander(data);
        visibilityRef.value?.restore(data.visibility_rules);
    });
};
const __VLS_exposed = { getData, validate, rander };
defineExpose(__VLS_exposed);
const __VLS_defaults = {
    enableVisibility: false,
    input_type_list: () => input_type_list_data.map((item) => ({
        label: item.label,
        value: item.value + 'Constructor',
    })),
};
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
if (__VLS_ctx.enableVisibility) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
    elTabs;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        modelValue: (__VLS_ctx.activeTab),
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_ctx.activeTab),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    const { default: __VLS_6 } = __VLS_3.slots;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        label: (__VLS_ctx.$t('common.info')),
        name: "basic",
    }));
    const __VLS_9 = __VLS_8({
        label: (__VLS_ctx.$t('common.info')),
        name: "basic",
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    const { default: __VLS_12 } = __VLS_10.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        ...{ 'onSubmit': {} },
        ref: "ruleFormRef",
        ...{ class: "mb-24" },
        labelWidth: "auto",
        model: (__VLS_ctx.form_data),
    }));
    const __VLS_15 = __VLS_14({
        ...{ 'onSubmit': {} },
        ref: "ruleFormRef",
        ...{ class: "mb-24" },
        labelWidth: "auto",
        model: (__VLS_ctx.form_data),
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    (__VLS_ctx.$attrs);
    let __VLS_18;
    const __VLS_19 = {
        /** @type {typeof __VLS_18.submit} */
        onSubmit: () => { },
    };
    var __VLS_20;
    /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
    const { default: __VLS_22 } = __VLS_16.slots;
    let __VLS_23;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        required: (true),
        prop: "field",
        rules: (__VLS_ctx.rules.field),
    }));
    const __VLS_25 = __VLS_24({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        required: (true),
        prop: "field",
        rules: (__VLS_ctx.rules.field),
    }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    const { default: __VLS_28 } = __VLS_26.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        modelValue: (__VLS_ctx.form_data.field),
        maxlength: (64),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
        showWordLimit: true,
    }));
    const __VLS_31 = __VLS_30({
        modelValue: (__VLS_ctx.form_data.field),
        maxlength: (64),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
        showWordLimit: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    // @ts-ignore
    [enableVisibility, activeTab, $t, $t, $t, form_data, form_data, $attrs, rules,];
    var __VLS_26;
    let __VLS_34;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
        required: (true),
        prop: "label",
        rules: (__VLS_ctx.rules.label),
    }));
    const __VLS_36 = __VLS_35({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
        required: (true),
        prop: "label",
        rules: (__VLS_ctx.rules.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    const { default: __VLS_39 } = __VLS_37.slots;
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        modelValue: (__VLS_ctx.form_data.label),
        maxlength: (64),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
    }));
    const __VLS_42 = __VLS_41({
        modelValue: (__VLS_ctx.form_data.label),
        maxlength: (64),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    // @ts-ignore
    [$t, $t, form_data, rules,];
    var __VLS_37;
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
        modelValue: (__VLS_ctx.form_data.tooltip),
        maxlength: (128),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.placeholder')),
    }));
    const __VLS_53 = __VLS_52({
        modelValue: (__VLS_ctx.form_data.tooltip),
        maxlength: (128),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_52));
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_48;
    let __VLS_56;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
        required: (true),
        prop: "required",
        rules: (__VLS_ctx.rules.required),
    }));
    const __VLS_58 = __VLS_57({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
        required: (true),
        prop: "required",
        rules: (__VLS_ctx.rules.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_57));
    let __VLS_61;
    const __VLS_62 = {
        /** @type {typeof __VLS_61.click} */
        onClick: () => { },
    };
    const { default: __VLS_63 } = __VLS_59.slots;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        modelValue: (__VLS_ctx.form_data.required),
        activeValue: (true),
        inactiveValue: (false),
    }));
    const __VLS_66 = __VLS_65({
        modelValue: (__VLS_ctx.form_data.required),
        activeValue: (true),
        inactiveValue: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    // @ts-ignore
    [$t, form_data, rules,];
    var __VLS_59;
    var __VLS_60;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        required: (true),
        prop: "input_type",
        rules: (__VLS_ctx.rules.input_type),
    }));
    const __VLS_71 = __VLS_70({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        required: (true),
        prop: "input_type",
        rules: (__VLS_ctx.rules.input_type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    const { default: __VLS_74 } = __VLS_72.slots;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        modelValue: (__VLS_ctx.form_data.input_type),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.placeholder')),
    }));
    const __VLS_77 = __VLS_76({
        modelValue: (__VLS_ctx.form_data.input_type),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    const { default: __VLS_80 } = __VLS_78.slots;
    for (const [input_type] of __VLS_vFor((__VLS_ctx.input_type_list))) {
        let __VLS_81;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
            key: (input_type.value),
            label: (input_type.label),
            value: (input_type.value),
        }));
        const __VLS_83 = __VLS_82({
            key: (input_type.value),
            label: (input_type.label),
            value: (input_type.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        // @ts-ignore
        [$t, $t, form_data, rules, input_type_list,];
    }
    // @ts-ignore
    [];
    var __VLS_78;
    // @ts-ignore
    [];
    var __VLS_72;
    if (__VLS_ctx.form_data.input_type) {
        const __VLS_86 = (__VLS_ctx.form_data.input_type);
        // @ts-ignore
        const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
            ref: "componentFormRef",
            modelValue: (__VLS_ctx.form_data),
        }));
        const __VLS_88 = __VLS_87({
            ref: "componentFormRef",
            modelValue: (__VLS_ctx.form_data),
        }, ...__VLS_functionalComponentArgsRest(__VLS_87));
        var __VLS_91;
        var __VLS_89;
    }
    // @ts-ignore
    [form_data, form_data, form_data,];
    var __VLS_16;
    var __VLS_17;
    // @ts-ignore
    [];
    var __VLS_10;
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        label: (__VLS_ctx.$t('workflow.nodes.baseNode.visibilitySetting.label')),
        name: "visibility",
    }));
    const __VLS_95 = __VLS_94({
        label: (__VLS_ctx.$t('workflow.nodes.baseNode.visibilitySetting.label')),
        name: "visibility",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    const { default: __VLS_98 } = __VLS_96.slots;
    const __VLS_99 = VisibilityConstructor;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        ref: "visibilityRef",
        initialValue: (__VLS_ctx.visibility_rules),
        nodeModel: (__VLS_ctx.nodeModel),
        currentNodeFields: (__VLS_ctx.currentNodeFields),
        currentEditingIndex: (__VLS_ctx.currentEditingIndex),
    }));
    const __VLS_101 = __VLS_100({
        ref: "visibilityRef",
        initialValue: (__VLS_ctx.visibility_rules),
        nodeModel: (__VLS_ctx.nodeModel),
        currentNodeFields: (__VLS_ctx.currentNodeFields),
        currentEditingIndex: (__VLS_ctx.currentEditingIndex),
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    var __VLS_104;
    var __VLS_102;
    // @ts-ignore
    [$t, visibility_rules, nodeModel, currentNodeFields, currentEditingIndex,];
    var __VLS_96;
    // @ts-ignore
    [];
    var __VLS_3;
}
else {
    let __VLS_106;
    /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
    elForm;
    // @ts-ignore
    const __VLS_107 = __VLS_asFunctionalComponent1(__VLS_106, new __VLS_106({
        ...{ 'onSubmit': {} },
        ref: "ruleFormRef",
        ...{ class: "mb-24" },
        labelWidth: "auto",
        model: (__VLS_ctx.form_data),
    }));
    const __VLS_108 = __VLS_107({
        ...{ 'onSubmit': {} },
        ref: "ruleFormRef",
        ...{ class: "mb-24" },
        labelWidth: "auto",
        model: (__VLS_ctx.form_data),
    }, ...__VLS_functionalComponentArgsRest(__VLS_107));
    (__VLS_ctx.$attrs);
    let __VLS_111;
    const __VLS_112 = {
        /** @type {typeof __VLS_111.submit} */
        onSubmit: () => { },
    };
    var __VLS_113;
    /** @type {__VLS_StyleScopedClasses['mb-24']} */ ;
    const { default: __VLS_115 } = __VLS_109.slots;
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        required: (true),
        prop: "field",
        rules: (__VLS_ctx.rules.field),
    }));
    const __VLS_118 = __VLS_117({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.field.label')),
        required: (true),
        prop: "field",
        rules: (__VLS_ctx.rules.field),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    const { default: __VLS_121 } = __VLS_119.slots;
    let __VLS_122;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
        modelValue: (__VLS_ctx.form_data.field),
        maxlength: (64),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
        showWordLimit: true,
    }));
    const __VLS_124 = __VLS_123({
        modelValue: (__VLS_ctx.form_data.field),
        maxlength: (64),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.field.placeholder')),
        showWordLimit: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_123));
    // @ts-ignore
    [$t, $t, form_data, form_data, $attrs, rules,];
    var __VLS_119;
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
        required: (true),
        prop: "label",
        rules: (__VLS_ctx.rules.label),
    }));
    const __VLS_129 = __VLS_128({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.name.label')),
        required: (true),
        prop: "label",
        rules: (__VLS_ctx.rules.label),
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    const { default: __VLS_132 } = __VLS_130.slots;
    let __VLS_133;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_134 = __VLS_asFunctionalComponent1(__VLS_133, new __VLS_133({
        modelValue: (__VLS_ctx.form_data.label),
        maxlength: (64),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
    }));
    const __VLS_135 = __VLS_134({
        modelValue: (__VLS_ctx.form_data.label),
        maxlength: (64),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.name.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_134));
    // @ts-ignore
    [$t, $t, form_data, rules,];
    var __VLS_130;
    let __VLS_138;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_139 = __VLS_asFunctionalComponent1(__VLS_138, new __VLS_138({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.label')),
    }));
    const __VLS_140 = __VLS_139({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_139));
    const { default: __VLS_143 } = __VLS_141.slots;
    let __VLS_144;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
        modelValue: (__VLS_ctx.form_data.tooltip),
        maxlength: (128),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.placeholder')),
    }));
    const __VLS_146 = __VLS_145({
        modelValue: (__VLS_ctx.form_data.tooltip),
        maxlength: (128),
        showWordLimit: true,
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.tooltip.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_145));
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_141;
    let __VLS_149;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
        required: (true),
        prop: "required",
        rules: (__VLS_ctx.rules.required),
    }));
    const __VLS_151 = __VLS_150({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.required.label')),
        required: (true),
        prop: "required",
        rules: (__VLS_ctx.rules.required),
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    let __VLS_154;
    const __VLS_155 = {
        /** @type {typeof __VLS_154.click} */
        onClick: () => { },
    };
    const { default: __VLS_156 } = __VLS_152.slots;
    let __VLS_157;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_158 = __VLS_asFunctionalComponent1(__VLS_157, new __VLS_157({
        modelValue: (__VLS_ctx.form_data.required),
        activeValue: (true),
        inactiveValue: (false),
    }));
    const __VLS_159 = __VLS_158({
        modelValue: (__VLS_ctx.form_data.required),
        activeValue: (true),
        inactiveValue: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_158));
    // @ts-ignore
    [$t, form_data, rules,];
    var __VLS_152;
    var __VLS_153;
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        required: (true),
        prop: "input_type",
        rules: (__VLS_ctx.rules.input_type),
    }));
    const __VLS_164 = __VLS_163({
        label: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.label')),
        required: (true),
        prop: "input_type",
        rules: (__VLS_ctx.rules.input_type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    const { default: __VLS_167 } = __VLS_165.slots;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        modelValue: (__VLS_ctx.form_data.input_type),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.placeholder')),
    }));
    const __VLS_170 = __VLS_169({
        modelValue: (__VLS_ctx.form_data.input_type),
        placeholder: (__VLS_ctx.$t('dynamicsForm.paramForm.input_type.placeholder')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    const { default: __VLS_173 } = __VLS_171.slots;
    for (const [input_type] of __VLS_vFor((__VLS_ctx.input_type_list))) {
        let __VLS_174;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
            key: (input_type.value),
            label: (input_type.label),
            value: (input_type.value),
        }));
        const __VLS_176 = __VLS_175({
            key: (input_type.value),
            label: (input_type.label),
            value: (input_type.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_175));
        // @ts-ignore
        [$t, $t, form_data, rules, input_type_list,];
    }
    // @ts-ignore
    [];
    var __VLS_171;
    // @ts-ignore
    [];
    var __VLS_165;
    if (__VLS_ctx.form_data.input_type) {
        const __VLS_179 = (__VLS_ctx.form_data.input_type);
        // @ts-ignore
        const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
            ref: "componentFormRef",
            modelValue: (__VLS_ctx.form_data),
        }));
        const __VLS_181 = __VLS_180({
            ref: "componentFormRef",
            modelValue: (__VLS_ctx.form_data),
        }, ...__VLS_functionalComponentArgsRest(__VLS_180));
        var __VLS_184;
        var __VLS_182;
    }
    // @ts-ignore
    [form_data, form_data, form_data,];
    var __VLS_109;
    var __VLS_110;
}
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_92 = __VLS_91, __VLS_105 = __VLS_104, __VLS_114 = __VLS_113, __VLS_185 = __VLS_184;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
