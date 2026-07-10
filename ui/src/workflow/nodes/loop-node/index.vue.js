/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set, throttle } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { loopBodyNode, loopStartNode } from '@/workflow/common/data';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
const props = defineProps();
const form = {
    loop_type: 'ARRAY',
    array: [],
    number: 1,
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
const showNode = computed({
    get: () => {
        console.log(props.nodeModel.properties.showNode);
        if (props.nodeModel.properties.showNode !== undefined) {
            return props.nodeModel.properties.showNode;
        }
        set(props.nodeModel.properties, 'showNode', true);
        return true;
    },
    set: (_v) => {
        set(props.nodeModel.properties, 'showNode', _v);
    },
});
watch(showNode, () => {
    if (showNode.value) {
        throttle(mountLoopBodyNode, 1000)();
    }
    else {
        throttle(destroyLoopBodyNode, 1000)();
    }
});
const replyNodeFormRef = ref();
const nodeCascaderRef = ref();
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
        replyNodeFormRef.value?.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
const destroyLoopBodyNode = () => {
    const nodeOutgoingNode = props.nodeModel.graphModel.getNodeOutgoingNode(props.nodeModel.id);
    const loopBody = nodeOutgoingNode.find((item) => item.type == loopBodyNode.type);
    if (loopBody) {
        loopBody.set_loop_body();
        props.nodeModel.graphModel.deleteNode(loopBody.id);
    }
};
const mountLoopBodyNode = () => {
    const nodeOutgoingNode = props.nodeModel.graphModel.getNodeOutgoingNode(props.nodeModel.id);
    if (!nodeOutgoingNode.some((item) => item.type == loopBodyNode.type)) {
        let workflow = { nodes: [loopStartNode], edges: [] };
        let x = props.nodeModel.x;
        let y = props.nodeModel.y + 350;
        if (props.nodeModel.properties.node_data.loop_body) {
            workflow = props.nodeModel.properties.node_data.loop_body;
        }
        if (props.nodeModel.properties.node_data.loop) {
            x = props.nodeModel.properties.node_data.loop.x;
            y = props.nodeModel.properties.node_data.loop.y;
        }
        const nodeModel = props.nodeModel.graphModel.addNode({
            type: loopBodyNode.type,
            properties: {
                ...loopBodyNode.properties,
                workflow: workflow,
                loop_node_id: props.nodeModel.id,
            },
            x: x,
            y: y,
        });
        props.nodeModel.graphModel.addEdge({
            type: 'loop-edge',
            sourceNodeId: props.nodeModel.id,
            sourceAnchorId: props.nodeModel.id + '_children',
            targetNodeId: nodeModel.id,
            virtual: true,
        });
    }
};
onMounted(() => {
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
    set(props.nodeModel, 'validate', validate);
    if (!props.nodeModel.virtual && showNode.value) {
        mountLoopBodyNode();
    }
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
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}));
const __VLS_9 = __VLS_8({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
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
    ref: "replyNodeFormRef",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "replyNodeFormRef",
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
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.label')),
    prop: "loop_type",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.loopNode.loopType.requiredMessage'),
        trigger: 'change',
        required: true,
    }),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.label')),
    prop: "loop_type",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.loopNode.loopType.requiredMessage'),
        trigger: 'change',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.click} */
    onClick: () => { },
};
const { default: __VLS_30 } = __VLS_26.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    modelValue: (__VLS_ctx.form_data.loop_type),
    type: "small",
    teleported: (false),
}));
const __VLS_33 = __VLS_32({
    modelValue: (__VLS_ctx.form_data.loop_type),
    type: "small",
    teleported: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_36 } = __VLS_34.slots;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.arrayLoop')),
    value: "ARRAY",
}));
const __VLS_39 = __VLS_38({
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.arrayLoop')),
    value: "ARRAY",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.numberLoop')),
    value: "NUMBER",
}));
const __VLS_44 = __VLS_43({
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.numberLoop')),
    value: "NUMBER",
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
let __VLS_47;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.infiniteLoop')),
    value: "LOOP",
}));
const __VLS_49 = __VLS_48({
    label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopType.infiniteLoop')),
    value: "LOOP",
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
// @ts-ignore
[nodeModel, form_data, form_data, $t, $t, $t, $t, $t,];
var __VLS_34;
// @ts-ignore
[];
var __VLS_26;
var __VLS_27;
if (__VLS_ctx.form_data.loop_type == 'ARRAY') {
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopArray.label')),
        prop: "array",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.loopNode.loopArray.requiredMessage'),
            trigger: 'blur',
            required: true,
        }),
    }));
    const __VLS_54 = __VLS_53({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopArray.label')),
        prop: "array",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.loopNode.loopArray.requiredMessage'),
            trigger: 'blur',
            required: true,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    let __VLS_57;
    const __VLS_58 = {
        /** @type {typeof __VLS_57.click} */
        onClick: () => { },
    };
    const { default: __VLS_59 } = __VLS_55.slots;
    const __VLS_60 = NodeCascader;
    // @ts-ignore
    const __VLS_61 = __VLS_asFunctionalComponent1(__VLS_60, new __VLS_60({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.loopNode.loopArray.placeholder')),
        modelValue: (__VLS_ctx.form_data.array),
    }));
    const __VLS_62 = __VLS_61({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.loopNode.loopArray.placeholder')),
        modelValue: (__VLS_ctx.form_data.array),
    }, ...__VLS_functionalComponentArgsRest(__VLS_61));
    var __VLS_65;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_63;
    // @ts-ignore
    [nodeModel, form_data, form_data, $t, $t, $t,];
    var __VLS_55;
    var __VLS_56;
}
else if (__VLS_ctx.form_data.loop_type == 'NUMBER') {
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopNumber.label')),
        prop: "number",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.loopNode.loopNumber.requiredMessage'),
            trigger: 'blur',
            required: true,
        }),
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.loopNode.loopNumber.label')),
        prop: "number",
        rules: ({
            message: __VLS_ctx.$t('workflow.nodes.loopNode.loopNumber.requiredMessage'),
            trigger: 'blur',
            required: true,
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_72;
    const __VLS_73 = {
        /** @type {typeof __VLS_72.click} */
        onClick: () => { },
    };
    const { default: __VLS_74 } = __VLS_70.slots;
    let __VLS_75;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        modelValue: (__VLS_ctx.form_data.number),
        min: (1),
    }));
    const __VLS_77 = __VLS_76({
        modelValue: (__VLS_ctx.form_data.number),
        min: (1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    // @ts-ignore
    [form_data, form_data, $t, $t,];
    var __VLS_70;
    var __VLS_71;
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
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_66 = __VLS_65;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
