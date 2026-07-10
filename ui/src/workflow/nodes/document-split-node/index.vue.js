/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { computed, onMounted, ref } from 'vue';
import { set } from 'lodash';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { useRoute } from 'vue-router';
const route = useRoute();
const { query: { id }, // id is knowledgeID
 } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const props = defineProps();
const splitPatternList = ref([]);
const form = {
    document_list: [],
    split_strategy: 'auto',
    paragraph_title_relate_problem_type: 'custom',
    paragraph_title_relate_problem: false,
    paragraph_title_relate_problem_reference: [],
    document_name_relate_problem_type: 'custom',
    document_name_relate_problem: false,
    document_name_relate_problem_reference: [],
    limit: 4096,
    limit_type: 'custom',
    limit_reference: [],
    chunk_size: 256,
    chunk_size_type: 'custom',
    chunk_size_reference: [],
    patterns: [],
    patterns_type: 'custom',
    patterns_reference: [],
    with_filter: false,
    with_filter_type: 'custom',
    with_filter_reference: [],
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
const aiChatNodeFormRef = ref();
const nodeCascaderRef = ref();
const nodeCascaderRef2 = ref();
const nodeCascaderRef3 = ref();
const nodeCascaderRef4 = ref();
const nodeCascaderRef5 = ref();
const nodeCascaderRef6 = ref();
const nodeCascaderRef7 = ref();
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
        nodeCascaderRef2.value ? nodeCascaderRef2.value.validate() : Promise.resolve(''),
        nodeCascaderRef3.value ? nodeCascaderRef3.value.validate() : Promise.resolve(''),
        nodeCascaderRef4.value ? nodeCascaderRef4.value.validate() : Promise.resolve(''),
        nodeCascaderRef5.value ? nodeCascaderRef5.value.validate() : Promise.resolve(''),
        nodeCascaderRef6.value ? nodeCascaderRef6.value.validate() : Promise.resolve(''),
        nodeCascaderRef7.value ? nodeCascaderRef7.value.validate() : Promise.resolve(''),
        aiChatNodeFormRef.value?.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
const patternLoading = ref(false);
const initSplitPatternList = () => {
    loadSharedApi({ type: 'document', systemType: apiType.value })
        .listSplitPattern(id, patternLoading)
        .then((ok) => {
        splitPatternList.value = ok.data;
    });
};
onMounted(() => {
    initSplitPatternList();
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
    ref: "aiChatNodeFormRef",
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    ref: "aiChatNodeFormRef",
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
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
    label: (__VLS_ctx.$t('views.problem.relateParagraph.selectDocument')),
    rules: ({
        type: 'array',
        required: true,
        message: __VLS_ctx.$t('views.chatLog.documentPlaceholder'),
        trigger: 'change',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('views.problem.relateParagraph.selectDocument')),
    rules: ({
        type: 'array',
        required: true,
        message: __VLS_ctx.$t('views.chatLog.documentPlaceholder'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
const __VLS_29 = NodeCascader;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
    modelValue: (__VLS_ctx.form_data.document_list),
}));
const __VLS_31 = __VLS_30({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
    modelValue: (__VLS_ctx.form_data.document_list),
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
var __VLS_34;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_32;
// @ts-ignore
[nodeModel, nodeModel, $t, $t, $t, $t, form_data, form_data,];
var __VLS_26;
let __VLS_36;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
    label: (__VLS_ctx.$t('workflow.nodes.documentSplitNode.splitStrategy.label')),
    rules: ({
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.documentSplitNode.splitStrategy.requiredMessage'),
        trigger: 'change',
    }),
}));
const __VLS_38 = __VLS_37({
    label: (__VLS_ctx.$t('workflow.nodes.documentSplitNode.splitStrategy.label')),
    rules: ({
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.documentSplitNode.splitStrategy.requiredMessage'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
const { default: __VLS_41 } = __VLS_39.slots;
let __VLS_42;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_43 = __VLS_asFunctionalComponent1(__VLS_42, new __VLS_42({
    modelValue: (__VLS_ctx.form_data.split_strategy),
    placeholder: (__VLS_ctx.$t('workflow.nodes.documentSplitNode.splitStrategy.placeholder')),
    teleported: (false),
}));
const __VLS_44 = __VLS_43({
    modelValue: (__VLS_ctx.form_data.split_strategy),
    placeholder: (__VLS_ctx.$t('workflow.nodes.documentSplitNode.splitStrategy.placeholder')),
    teleported: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_43));
const { default: __VLS_47 } = __VLS_45.slots;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    label: (__VLS_ctx.$t('views.document.setRules.intelligent.label')),
    value: "auto",
}));
const __VLS_50 = __VLS_49({
    label: (__VLS_ctx.$t('views.document.setRules.intelligent.label')),
    value: "auto",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
let __VLS_53;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
    label: (__VLS_ctx.$t('views.document.setRules.advanced.label')),
    value: "custom",
}));
const __VLS_55 = __VLS_54({
    label: (__VLS_ctx.$t('views.document.setRules.advanced.label')),
    value: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_54));
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
elOption;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    label: (__VLS_ctx.$t('views.document.fileType.QA.label')),
    value: "qa",
}));
const __VLS_60 = __VLS_59({
    label: (__VLS_ctx.$t('views.document.fileType.QA.label')),
    value: "qa",
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
// @ts-ignore
[$t, $t, $t, $t, $t, $t, form_data,];
var __VLS_45;
// @ts-ignore
[];
var __VLS_39;
let __VLS_63;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
const { default: __VLS_68 } = __VLS_66.slots;
{
    const { label: __VLS_69 } = __VLS_66.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.documentSplitNode.chunk_length.label'));
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({
        effect: "dark",
        placement: "right",
    }));
    const __VLS_72 = __VLS_71({
        effect: "dark",
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    {
        const { content: __VLS_76 } = __VLS_73.slots;
        (__VLS_ctx.$t('workflow.nodes.documentSplitNode.chunk_length.tooltip1'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
        (__VLS_ctx.$t('workflow.nodes.documentSplitNode.chunk_length.tooltip2'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.br)({});
        (__VLS_ctx.$t('workflow.nodes.documentSplitNode.chunk_length.tooltip3'));
        // @ts-ignore
        [$t, $t, $t, $t,];
    }
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_79 = __VLS_78({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_73;
    let __VLS_82;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
        modelValue: (__VLS_ctx.form_data.chunk_size_type),
        size: "small",
        ...{ style: {} },
        teleported: (false),
    }));
    const __VLS_84 = __VLS_83({
        modelValue: (__VLS_ctx.form_data.chunk_size_type),
        size: "small",
        ...{ style: {} },
        teleported: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_83));
    const { default: __VLS_87 } = __VLS_85.slots;
    let __VLS_88;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }));
    const __VLS_90 = __VLS_89({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_95 = __VLS_94({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    // @ts-ignore
    [$t, $t, form_data,];
    var __VLS_85;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.chunk_size_type === 'custom') {
    let __VLS_98;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
        modelValue: (__VLS_ctx.form_data.chunk_size),
        min: (50),
        max: (100000),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ class: "w-full" },
        step: (1),
        stepStrictly: (true),
    }));
    const __VLS_100 = __VLS_99({
        modelValue: (__VLS_ctx.form_data.chunk_size),
        min: (50),
        max: (100000),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ class: "w-full" },
        step: (1),
        stepStrictly: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_99));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
}
else {
    const __VLS_103 = NodeCascader;
    // @ts-ignore
    const __VLS_104 = __VLS_asFunctionalComponent1(__VLS_103, new __VLS_103({
        ref: "nodeCascaderRef4",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
        modelValue: (__VLS_ctx.form_data.chunk_size_reference),
    }));
    const __VLS_105 = __VLS_104({
        ref: "nodeCascaderRef4",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
        modelValue: (__VLS_ctx.form_data.chunk_size_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_104));
    var __VLS_108;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_106;
}
// @ts-ignore
[nodeModel, $t, form_data, form_data, form_data,];
var __VLS_66;
if (__VLS_ctx.form_data.split_strategy === 'custom') {
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    const { default: __VLS_115 } = __VLS_113.slots;
    {
        const { label: __VLS_116 } = __VLS_113.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.document.setRules.patterns.label'));
        let __VLS_117;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.setRules.patterns.tooltip')),
            placement: "right",
        }));
        const __VLS_119 = __VLS_118({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.setRules.patterns.tooltip')),
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        const { default: __VLS_122 } = __VLS_120.slots;
        let __VLS_123;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_125 = __VLS_124({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [$t, $t, form_data,];
        var __VLS_120;
        let __VLS_128;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent1(__VLS_128, new __VLS_128({
            teleported: (false),
            modelValue: (__VLS_ctx.form_data.patterns_type),
            size: "small",
            ...{ style: {} },
        }));
        const __VLS_130 = __VLS_129({
            teleported: (false),
            modelValue: (__VLS_ctx.form_data.patterns_type),
            size: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        const { default: __VLS_133 } = __VLS_131.slots;
        let __VLS_134;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }));
        const __VLS_136 = __VLS_135({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }, ...__VLS_functionalComponentArgsRest(__VLS_135));
        let __VLS_139;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }));
        const __VLS_141 = __VLS_140({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }, ...__VLS_functionalComponentArgsRest(__VLS_140));
        // @ts-ignore
        [$t, $t, form_data,];
        var __VLS_131;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.form_data.patterns_type === 'custom') {
        let __VLS_144;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent1(__VLS_144, new __VLS_144({
            teleported: (false),
            modelValue: (__VLS_ctx.form_data.patterns),
            multiple: true,
            reserveKeyword: (false),
            allowCreate: true,
            defaultFirstOption: true,
            filterable: true,
            placeholder: (__VLS_ctx.$t('views.document.setRules.patterns.placeholder')),
        }));
        const __VLS_146 = __VLS_145({
            teleported: (false),
            modelValue: (__VLS_ctx.form_data.patterns),
            multiple: true,
            reserveKeyword: (false),
            allowCreate: true,
            defaultFirstOption: true,
            filterable: true,
            placeholder: (__VLS_ctx.$t('views.document.setRules.patterns.placeholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        const { default: __VLS_149 } = __VLS_147.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.splitPatternList))) {
            let __VLS_150;
            /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
            elOption;
            // @ts-ignore
            const __VLS_151 = __VLS_asFunctionalComponent1(__VLS_150, new __VLS_150({
                key: (index),
                label: (item.key),
                value: (item.value),
            }));
            const __VLS_152 = __VLS_151({
                key: (index),
                label: (item.key),
                value: (item.value),
            }, ...__VLS_functionalComponentArgsRest(__VLS_151));
            // @ts-ignore
            [$t, form_data, form_data, splitPatternList,];
        }
        // @ts-ignore
        [];
        var __VLS_147;
    }
    else {
        const __VLS_155 = NodeCascader;
        // @ts-ignore
        const __VLS_156 = __VLS_asFunctionalComponent1(__VLS_155, new __VLS_155({
            ref: "nodeCascaderRef5",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.patterns_reference),
        }));
        const __VLS_157 = __VLS_156({
            ref: "nodeCascaderRef5",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.patterns_reference),
        }, ...__VLS_functionalComponentArgsRest(__VLS_156));
        var __VLS_160;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        var __VLS_158;
    }
    // @ts-ignore
    [nodeModel, $t, form_data,];
    var __VLS_113;
}
if (__VLS_ctx.form_data.split_strategy === 'custom') {
    let __VLS_162;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({}));
    const __VLS_164 = __VLS_163({}, ...__VLS_functionalComponentArgsRest(__VLS_163));
    const { default: __VLS_167 } = __VLS_165.slots;
    {
        const { label: __VLS_168 } = __VLS_165.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('views.document.setRules.limit.label'));
        let __VLS_169;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent1(__VLS_169, new __VLS_169({
            modelValue: (__VLS_ctx.form_data.limit_type),
            size: "small",
            ...{ style: {} },
            teleported: (false),
        }));
        const __VLS_171 = __VLS_170({
            modelValue: (__VLS_ctx.form_data.limit_type),
            size: "small",
            ...{ style: {} },
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        const { default: __VLS_174 } = __VLS_172.slots;
        let __VLS_175;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }));
        const __VLS_177 = __VLS_176({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }, ...__VLS_functionalComponentArgsRest(__VLS_176));
        let __VLS_180;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent1(__VLS_180, new __VLS_180({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }));
        const __VLS_182 = __VLS_181({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        // @ts-ignore
        [$t, $t, $t, form_data, form_data,];
        var __VLS_172;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.form_data.limit_type === 'custom') {
        let __VLS_185;
        /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
        elInputNumber;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent1(__VLS_185, new __VLS_185({
            modelValue: (__VLS_ctx.form_data.limit),
            min: (50),
            max: (100000),
            valueOnClear: (0),
            controlsPosition: "right",
            ...{ class: "w-full" },
            step: (1),
            stepStrictly: (true),
        }));
        const __VLS_187 = __VLS_186({
            modelValue: (__VLS_ctx.form_data.limit),
            min: (50),
            max: (100000),
            valueOnClear: (0),
            controlsPosition: "right",
            ...{ class: "w-full" },
            step: (1),
            stepStrictly: (true),
        }, ...__VLS_functionalComponentArgsRest(__VLS_186));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    }
    else {
        const __VLS_190 = NodeCascader;
        // @ts-ignore
        const __VLS_191 = __VLS_asFunctionalComponent1(__VLS_190, new __VLS_190({
            ref: "nodeCascaderRef6",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.limit_reference),
        }));
        const __VLS_192 = __VLS_191({
            ref: "nodeCascaderRef6",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.limit_reference),
        }, ...__VLS_functionalComponentArgsRest(__VLS_191));
        var __VLS_195;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        var __VLS_193;
    }
    // @ts-ignore
    [nodeModel, $t, form_data, form_data, form_data,];
    var __VLS_165;
}
if (__VLS_ctx.form_data.split_strategy === 'custom') {
    let __VLS_197;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_198 = __VLS_asFunctionalComponent1(__VLS_197, new __VLS_197({}));
    const __VLS_199 = __VLS_198({}, ...__VLS_functionalComponentArgsRest(__VLS_198));
    const { default: __VLS_202 } = __VLS_200.slots;
    {
        const { label: __VLS_203 } = __VLS_200.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        (__VLS_ctx.$t('views.document.setRules.with_filter.label'));
        let __VLS_204;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent1(__VLS_204, new __VLS_204({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.setRules.with_filter.text')),
            placement: "right",
        }));
        const __VLS_206 = __VLS_205({
            effect: "dark",
            content: (__VLS_ctx.$t('views.document.setRules.with_filter.text')),
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        const { default: __VLS_209 } = __VLS_207.slots;
        let __VLS_210;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_211 = __VLS_asFunctionalComponent1(__VLS_210, new __VLS_210({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_212 = __VLS_211({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_211));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [$t, $t, form_data,];
        var __VLS_207;
        let __VLS_215;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
            modelValue: (__VLS_ctx.form_data.with_filter_type),
            size: "small",
            ...{ style: {} },
            teleported: (false),
        }));
        const __VLS_217 = __VLS_216({
            modelValue: (__VLS_ctx.form_data.with_filter_type),
            size: "small",
            ...{ style: {} },
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_216));
        const { default: __VLS_220 } = __VLS_218.slots;
        let __VLS_221;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }));
        const __VLS_223 = __VLS_222({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        let __VLS_226;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }));
        const __VLS_228 = __VLS_227({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }, ...__VLS_functionalComponentArgsRest(__VLS_227));
        // @ts-ignore
        [$t, $t, form_data,];
        var __VLS_218;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.form_data.with_filter_type === 'custom') {
        let __VLS_231;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_232 = __VLS_asFunctionalComponent1(__VLS_231, new __VLS_231({
            size: "small",
            modelValue: (__VLS_ctx.form_data.with_filter),
        }));
        const __VLS_233 = __VLS_232({
            size: "small",
            modelValue: (__VLS_ctx.form_data.with_filter),
        }, ...__VLS_functionalComponentArgsRest(__VLS_232));
    }
    else {
        const __VLS_236 = NodeCascader;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent1(__VLS_236, new __VLS_236({
            ref: "nodeCascaderRef7",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.with_filter_reference),
        }));
        const __VLS_238 = __VLS_237({
            ref: "nodeCascaderRef7",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.with_filter_reference),
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
        var __VLS_241;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        var __VLS_239;
    }
    // @ts-ignore
    [nodeModel, $t, form_data, form_data, form_data,];
    var __VLS_200;
}
if (__VLS_ctx.form_data.split_strategy !== 'qa') {
    let __VLS_243;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({}));
    const __VLS_245 = __VLS_244({}, ...__VLS_functionalComponentArgsRest(__VLS_244));
    const { default: __VLS_248 } = __VLS_246.slots;
    {
        const { label: __VLS_249 } = __VLS_246.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.nodes.documentSplitNode.title1'));
        let __VLS_250;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
            modelValue: (__VLS_ctx.form_data.paragraph_title_relate_problem_type),
            size: "small",
            ...{ style: {} },
            teleported: (false),
        }));
        const __VLS_252 = __VLS_251({
            modelValue: (__VLS_ctx.form_data.paragraph_title_relate_problem_type),
            size: "small",
            ...{ style: {} },
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_251));
        const { default: __VLS_255 } = __VLS_253.slots;
        let __VLS_256;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent1(__VLS_256, new __VLS_256({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }));
        const __VLS_258 = __VLS_257({
            label: (__VLS_ctx.$t('workflow.variable.Referencing')),
            value: "referencing",
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        let __VLS_261;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_262 = __VLS_asFunctionalComponent1(__VLS_261, new __VLS_261({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }));
        const __VLS_263 = __VLS_262({
            label: (__VLS_ctx.$t('common.custom')),
            value: "custom",
        }, ...__VLS_functionalComponentArgsRest(__VLS_262));
        // @ts-ignore
        [$t, $t, $t, form_data, form_data,];
        var __VLS_253;
        // @ts-ignore
        [];
    }
    if (__VLS_ctx.form_data.paragraph_title_relate_problem_type === 'custom') {
        let __VLS_266;
        /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
        elSwitch;
        // @ts-ignore
        const __VLS_267 = __VLS_asFunctionalComponent1(__VLS_266, new __VLS_266({
            size: "small",
            modelValue: (__VLS_ctx.form_data.paragraph_title_relate_problem),
        }));
        const __VLS_268 = __VLS_267({
            size: "small",
            modelValue: (__VLS_ctx.form_data.paragraph_title_relate_problem),
        }, ...__VLS_functionalComponentArgsRest(__VLS_267));
    }
    else {
        const __VLS_271 = NodeCascader;
        // @ts-ignore
        const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
            ref: "nodeCascaderRef2",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.paragraph_title_relate_problem_reference),
        }));
        const __VLS_273 = __VLS_272({
            ref: "nodeCascaderRef2",
            nodeModel: (__VLS_ctx.nodeModel),
            ...{ class: "w-full" },
            placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
            modelValue: (__VLS_ctx.form_data.paragraph_title_relate_problem_reference),
        }, ...__VLS_functionalComponentArgsRest(__VLS_272));
        var __VLS_276;
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        var __VLS_274;
    }
    // @ts-ignore
    [nodeModel, $t, form_data, form_data, form_data,];
    var __VLS_246;
}
let __VLS_278;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({}));
const __VLS_280 = __VLS_279({}, ...__VLS_functionalComponentArgsRest(__VLS_279));
const { default: __VLS_283 } = __VLS_281.slots;
{
    const { label: __VLS_284 } = __VLS_281.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.documentSplitNode.title2'));
    let __VLS_285;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent1(__VLS_285, new __VLS_285({
        modelValue: (__VLS_ctx.form_data.document_name_relate_problem_type),
        size: "small",
        ...{ style: {} },
        teleported: (false),
    }));
    const __VLS_287 = __VLS_286({
        modelValue: (__VLS_ctx.form_data.document_name_relate_problem_type),
        size: "small",
        ...{ style: {} },
        teleported: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    const { default: __VLS_290 } = __VLS_288.slots;
    let __VLS_291;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_292 = __VLS_asFunctionalComponent1(__VLS_291, new __VLS_291({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }));
    const __VLS_293 = __VLS_292({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "referencing",
    }, ...__VLS_functionalComponentArgsRest(__VLS_292));
    let __VLS_296;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent1(__VLS_296, new __VLS_296({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_298 = __VLS_297({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    // @ts-ignore
    [$t, $t, $t, form_data,];
    var __VLS_288;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.document_name_relate_problem_type === 'custom') {
    let __VLS_301;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent1(__VLS_301, new __VLS_301({
        size: "small",
        modelValue: (__VLS_ctx.form_data.document_name_relate_problem),
    }));
    const __VLS_303 = __VLS_302({
        size: "small",
        modelValue: (__VLS_ctx.form_data.document_name_relate_problem),
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
}
else {
    const __VLS_306 = NodeCascader;
    // @ts-ignore
    const __VLS_307 = __VLS_asFunctionalComponent1(__VLS_306, new __VLS_306({
        ref: "nodeCascaderRef3",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
        modelValue: (__VLS_ctx.form_data.document_name_relate_problem_reference),
    }));
    const __VLS_308 = __VLS_307({
        ref: "nodeCascaderRef3",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('views.chatLog.documentPlaceholder')),
        modelValue: (__VLS_ctx.form_data.document_name_relate_problem_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_307));
    var __VLS_311;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_309;
}
// @ts-ignore
[nodeModel, $t, form_data, form_data, form_data,];
var __VLS_281;
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
var __VLS_21 = __VLS_20, __VLS_35 = __VLS_34, __VLS_109 = __VLS_108, __VLS_161 = __VLS_160, __VLS_196 = __VLS_195, __VLS_242 = __VLS_241, __VLS_277 = __VLS_276, __VLS_312 = __VLS_311;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
