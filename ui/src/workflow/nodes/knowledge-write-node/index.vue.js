/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { computed, onMounted, ref } from 'vue';
import { set } from 'lodash';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { isLastNode } from '@/workflow/common/data';
const props = defineProps();
const KnowledgeWriteRef = ref();
const nodeCascaderRef = ref();
const form = {
    document_list: [],
};
const validate = async () => {
    const ps = [
        KnowledgeWriteRef.value?.validate(),
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
    ];
    return Promise.all(ps).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
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
onMounted(() => {
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
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
    ref: "KnowledgeWriteRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "KnowledgeWriteRef",
    hideRequiredAsterisk: true,
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
    prop: "document_list",
    label: (__VLS_ctx.$t('common.inputContent')),
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'),
        trigger: 'change',
        required: true,
    }),
}));
const __VLS_25 = __VLS_24({
    prop: "document_list",
    label: (__VLS_ctx.$t('common.inputContent')),
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'),
        trigger: 'change',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
{
    const { label: __VLS_29 } = __VLS_26.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('common.inputContent'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [nodeModel, $t, $t, $t, $t, form_data,];
}
const __VLS_30 = NodeCascader;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    modelValue: (__VLS_ctx.form_data.document_list),
}));
const __VLS_32 = __VLS_31({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    modelValue: (__VLS_ctx.form_data.document_list),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
var __VLS_35;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_33;
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_26;
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
var __VLS_21 = __VLS_20, __VLS_36 = __VLS_35;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
