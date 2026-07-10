/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { computed, onMounted, ref } from 'vue';
import { set } from 'lodash';
const NodeFormRef = ref();
const props = defineProps();
const file_type_list_options = ['TXT', 'DOCX', 'PDF', 'HTML', 'XLS', 'XLSX', 'ZIP', 'CSV', 'MD'];
const form = {
    file_type_list: ['TXT', 'DOCX', 'PDF', 'HTML', 'XLS', 'XLSX', 'ZIP', 'CSV', 'MD'],
    file_size_limit: 100,
    file_count_limit: 50,
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            return props.nodeModel.properties.node_data;
        }
        else {
            set(props.nodeModel.properties, 'node_data', form);
        }
        return props.nodeModel.properties.node_data;
    },
    set: (value) => {
        set(props.nodeModel.properties, 'node_data', value);
    },
});
const validate = () => {
    return NodeFormRef.value.validate();
};
onMounted(() => {
    set(props.nodeModel, 'validate', validate);
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = NodeContainer || NodeContainer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_2 = __VLS_1({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('workflow.nodeSetting'));
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    shadow: "never",
    ...{ class: "card-never" },
}));
const __VLS_9 = __VLS_8({
    shadow: "never",
    ...{ class: "card-never" },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "NodeFormRef",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "NodeFormRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
let __VLS_18;
const __VLS_19 = {
    /** @type {typeof __VLS_18.submit} */
    onSubmit: () => { },
};
var __VLS_20;
const { default: __VLS_22 } = __VLS_16.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    label: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.fileFormat.label')),
    rules: ({
        type: 'array',
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.fileFormat.requiredMessage'),
        trigger: 'change',
    }),
    prop: "file_type_list",
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.fileFormat.label')),
    rules: ({
        type: 'array',
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.fileFormat.requiredMessage'),
        trigger: 'change',
    }),
    prop: "file_type_list",
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    modelValue: (__VLS_ctx.form_data.file_type_list),
    placeholder: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.fileFormat.requiredMessage')),
    ...{ class: "w-240" },
    clearable: true,
    multiple: true,
    allowCreate: true,
    filterable: true,
    defaultFirstOption: true,
}));
const __VLS_31 = __VLS_30({
    modelValue: (__VLS_ctx.form_data.file_type_list),
    placeholder: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.fileFormat.requiredMessage')),
    ...{ class: "w-240" },
    clearable: true,
    multiple: true,
    allowCreate: true,
    filterable: true,
    defaultFirstOption: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
/** @type {__VLS_StyleScopedClasses['w-240']} */ ;
const { default: __VLS_34 } = __VLS_32.slots;
{
    const { label: __VLS_35 } = __VLS_32.slots;
    const [{ label, value }] = __VLS_vSlot(__VLS_35);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (label);
    // @ts-ignore
    [nodeModel, $t, $t, $t, $t, form_data, form_data,];
}
for (const [item] of __VLS_vFor((__VLS_ctx.file_type_list_options))) {
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        key: (item),
        label: (item),
        value: (item),
    }));
    const __VLS_38 = __VLS_37({
        key: (item),
        label: (item),
        value: (item),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    // @ts-ignore
    [file_type_list_options,];
}
// @ts-ignore
[];
var __VLS_32;
// @ts-ignore
[];
var __VLS_26;
let __VLS_41;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent1(__VLS_41, new __VLS_41({
    label: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.maxFileNumber.label')),
    rules: ({
        required: true,
        message: __VLS_ctx.$t('common.inputPlaceholder'),
        trigger: 'change',
    }),
    prop: "file_count_limit",
}));
const __VLS_43 = __VLS_42({
    label: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.maxFileNumber.label')),
    rules: ({
        required: true,
        message: __VLS_ctx.$t('common.inputPlaceholder'),
        trigger: 'change',
    }),
    prop: "file_count_limit",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
const { default: __VLS_46 } = __VLS_44.slots;
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    modelValue: (__VLS_ctx.form_data.file_count_limit),
    min: (1),
    max: (1000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}));
const __VLS_49 = __VLS_48({
    modelValue: (__VLS_ctx.form_data.file_count_limit),
    min: (1),
    max: (1000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, $t, form_data,];
var __VLS_44;
let __VLS_52;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
    label: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.maxFileCountNumber.label')),
    rules: ({
        required: true,
        message: __VLS_ctx.$t('common.inputPlaceholder'),
        trigger: 'change',
    }),
    prop: "file_size_limit",
}));
const __VLS_54 = __VLS_53({
    label: (__VLS_ctx.$t('workflow.nodes.dataSourceLocalNode.maxFileCountNumber.label')),
    rules: ({
        required: true,
        message: __VLS_ctx.$t('common.inputPlaceholder'),
        trigger: 'change',
    }),
    prop: "file_size_limit",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
const { default: __VLS_57 } = __VLS_55.slots;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    modelValue: (__VLS_ctx.form_data.file_size_limit),
    min: (1),
    max: (1000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}));
const __VLS_60 = __VLS_59({
    modelValue: (__VLS_ctx.form_data.file_size_limit),
    min: (1),
    max: (1000),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, $t, form_data,];
var __VLS_55;
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
// @ts-ignore
var __VLS_21 = __VLS_20;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
