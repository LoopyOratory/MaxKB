/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { set, cloneDeep, groupBy } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import ParamSettingDialog from './ParamSettingDialog.vue';
import { ref, computed, onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
const { params: { id }, } = route;
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else {
        return 'workspace';
    }
});
const props = defineProps();
const ParamSettingDialogRef = ref();
const form = {
    reranker_reference_list: [[]],
    reranker_model_id: '',
    reranker_model_id_type: 'custom',
    reranker_model_id_reference: [],
    question_reference_address: [],
    reranker_setting: {
        top_n: 3,
        similarity: 0,
        max_paragraph_char_number: 5000,
    },
    show_knowledge: false,
};
const modelOptions = ref(null);
const openParamSettingDialog = () => {
    ParamSettingDialogRef.value?.open(form_data.value.reranker_setting);
};
const deleteCondition = (index) => {
    const list = cloneDeep(props.nodeModel.properties.node_data.reranker_reference_list);
    list.splice(index, 1);
    set(props.nodeModel.properties.node_data, 'reranker_reference_list', list);
};
const wheel = (e) => {
    if (e.ctrlKey === true) {
        e.preventDefault();
        return true;
    }
    else {
        e.stopPropagation();
        return true;
    }
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            if (!props.nodeModel.properties.node_data.reranker_model_id_type) {
                set(props.nodeModel.properties.node_data, 'reranker_model_id_type', 'custom');
            }
            if (!props.nodeModel.properties.node_data.reranker_model_id_reference) {
                set(props.nodeModel.properties.node_data, 'reranker_model_id_reference', []);
            }
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
function refreshParam(data) {
    set(props.nodeModel.properties.node_data, 'reranker_setting', data);
}
const modelCascaderRef = ref();
const resource = getResourceDetail();
function getSelectModel() {
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'RERANKER',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'RERANKER',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
    });
}
const add_reranker_reference = () => {
    const list = cloneDeep(props.nodeModel.properties.node_data.reranker_reference_list);
    list.push([]);
    set(props.nodeModel.properties.node_data, 'reranker_reference_list', list);
};
const rerankerNodeFormRef = ref();
const nodeCascaderRef = ref();
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
        modelCascaderRef.value ? modelCascaderRef.value.validate() : Promise.resolve(''),
        rerankerNodeFormRef.value?.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
onMounted(() => {
    getSelectModel();
    form_data.value.show_knowledge = form_data.value.show_knowledge
        ? form_data.value.show_knowledge
        : false;
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
    ref: "rerankerNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "rerankerNodeFormRef",
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
    label: (__VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.label')),
    prop: "reranker_reference_list",
    rules: ({
        type: 'array',
        message: __VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.requiredMessage'),
        trigger: 'change',
        required: true,
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.label')),
    prop: "reranker_reference_list",
    rules: ({
        type: 'array',
        message: __VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.requiredMessage'),
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
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onClick': {} },
        link: true,
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.click} */
        onClick: (__VLS_ctx.add_reranker_reference),
    };
    const { default: __VLS_37 } = __VLS_33.slots;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        iconName: "app-add-outlined",
    }));
    const __VLS_40 = __VLS_39({
        iconName: "app-add-outlined",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    // @ts-ignore
    [nodeModel, form_data, $t, $t, $t, add_reranker_reference,];
    var __VLS_33;
    var __VLS_34;
    // @ts-ignore
    [];
}
for (const [reranker_reference, index] of __VLS_vFor((__VLS_ctx.form_data.reranker_reference_list))) {
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        gutter: (8),
        ...{ style: {} },
        key: (index),
        ...{ class: "w-full" },
    }));
    const __VLS_45 = __VLS_44({
        gutter: (8),
        ...{ style: {} },
        key: (index),
        ...{ class: "w-full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({
        span: (22),
    }));
    const __VLS_51 = __VLS_50({
        span: (22),
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    const { default: __VLS_54 } = __VLS_52.slots;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        prop: ('reranker_reference_list.' + index),
        rules: ({
            type: 'array',
            required: true,
            message: __VLS_ctx.$t('workflow.variable.placeholder'),
            trigger: 'change',
        }),
    }));
    const __VLS_57 = __VLS_56({
        prop: ('reranker_reference_list.' + index),
        rules: ({
            type: 'array',
            required: true,
            message: __VLS_ctx.$t('workflow.variable.placeholder'),
            trigger: 'change',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    const { default: __VLS_60 } = __VLS_58.slots;
    const __VLS_61 = NodeCascader;
    // @ts-ignore
    const __VLS_62 = __VLS_asFunctionalComponent1(__VLS_61, new __VLS_61({
        key: (index),
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.requiredMessage')),
        modelValue: (__VLS_ctx.form_data.reranker_reference_list[index]),
    }));
    const __VLS_63 = __VLS_62({
        key: (index),
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.rerankerNode.rerankerContent.requiredMessage')),
        modelValue: (__VLS_ctx.form_data.reranker_reference_list[index]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_62));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    // @ts-ignore
    [nodeModel, form_data, form_data, $t, $t,];
    var __VLS_58;
    // @ts-ignore
    [];
    var __VLS_52;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({
        span: (2),
    }));
    const __VLS_68 = __VLS_67({
        span: (2),
    }, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const { default: __VLS_71 } = __VLS_69.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        link: true,
        type: "info",
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_77;
    const __VLS_78 = {
        /** @type {typeof __VLS_77.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.deleteCondition(index);
            // @ts-ignore
            [deleteCondition,];
        },
    };
    const { default: __VLS_79 } = __VLS_75.slots;
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        iconName: "app-delete",
    }));
    const __VLS_82 = __VLS_81({
        iconName: "app-delete",
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    // @ts-ignore
    [];
    var __VLS_75;
    var __VLS_76;
    // @ts-ignore
    [];
    var __VLS_69;
    // @ts-ignore
    [];
    var __VLS_46;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_26;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchParam')),
}));
const __VLS_87 = __VLS_86({
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchParam')),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
const { default: __VLS_90 } = __VLS_88.slots;
{
    const { label: __VLS_91 } = __VLS_88.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchParam'));
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_97;
    const __VLS_98 = {
        /** @type {typeof __VLS_97.click} */
        onClick: (__VLS_ctx.openParamSettingDialog),
    };
    const { default: __VLS_99 } = __VLS_95.slots;
    let __VLS_100;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
        iconName: "app-setting",
    }));
    const __VLS_102 = __VLS_101({
        iconName: "app-setting",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    // @ts-ignore
    [$t, $t, openParamSettingDialog,];
    var __VLS_95;
    var __VLS_96;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({}));
const __VLS_107 = __VLS_106({}, ...__VLS_functionalComponentArgsRest(__VLS_106));
const { default: __VLS_110 } = __VLS_108.slots;
let __VLS_111;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_113 = __VLS_112({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_116 } = __VLS_114.slots;
(__VLS_ctx.$t('workflow.nodes.rerankerNode.higher'));
// @ts-ignore
[$t,];
var __VLS_114;
let __VLS_117;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent1(__VLS_117, new __VLS_117({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_119 = __VLS_118({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_122 } = __VLS_120.slots;
(__VLS_ctx.form_data.reranker_setting.similarity?.toFixed(3));
// @ts-ignore
[form_data,];
var __VLS_120;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_125 = __VLS_124({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_128 } = __VLS_126.slots;
(__VLS_ctx.$t('aiChat.KnowledgeSource.referenceParagraph'));
// @ts-ignore
[$t,];
var __VLS_126;
let __VLS_129;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_131 = __VLS_130({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_134 } = __VLS_132.slots;
(__VLS_ctx.form_data.reranker_setting.top_n);
// @ts-ignore
[form_data,];
var __VLS_132;
let __VLS_135;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
    span: (12),
    ...{ class: "color-secondary lighter" },
}));
const __VLS_137 = __VLS_136({
    span: (12),
    ...{ class: "color-secondary lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_136));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_140 } = __VLS_138.slots;
(__VLS_ctx.$t('workflow.nodes.rerankerNode.max_paragraph_char_number'));
// @ts-ignore
[$t,];
var __VLS_138;
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    span: (12),
    ...{ class: "lighter" },
}));
const __VLS_143 = __VLS_142({
    span: (12),
    ...{ class: "lighter" },
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
const { default: __VLS_146 } = __VLS_144.slots;
(__VLS_ctx.form_data.reranker_setting.max_paragraph_char_number);
// @ts-ignore
[form_data,];
var __VLS_144;
// @ts-ignore
[];
var __VLS_108;
// @ts-ignore
[];
var __VLS_88;
let __VLS_147;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label')),
    prop: "question_reference_address",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_149 = __VLS_148({
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label')),
    prop: "question_reference_address",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.requiredMessage'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_148));
const { default: __VLS_152 } = __VLS_150.slots;
{
    const { label: __VLS_153 } = __VLS_150.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t, $t,];
}
const __VLS_154 = NodeCascader;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label')),
    modelValue: (__VLS_ctx.form_data.question_reference_address),
}));
const __VLS_156 = __VLS_155({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.searchQuestion.label')),
    modelValue: (__VLS_ctx.form_data.question_reference_address),
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
var __VLS_159;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_157;
// @ts-ignore
[nodeModel, form_data, $t,];
var __VLS_150;
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    label: (__VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.label')),
    prop: (__VLS_ctx.form_data.reranker_model_id_type === 'reference'
        ? 'reranker_model_id_reference'
        : 'reranker_model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.reranker_model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.placeholder'),
        trigger: 'change',
    }),
}));
const __VLS_163 = __VLS_162({
    label: (__VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.label')),
    prop: (__VLS_ctx.form_data.reranker_model_id_type === 'reference'
        ? 'reranker_model_id_reference'
        : 'reranker_model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.reranker_model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.placeholder'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
const { default: __VLS_166 } = __VLS_164.slots;
{
    const { label: __VLS_167 } = __VLS_164.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.reranker_model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_170 = __VLS_169({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.reranker_model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    let __VLS_173;
    const __VLS_174 = {
        /** @type {typeof __VLS_173.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.form_data.reranker_model_id_reference = [];
            // @ts-ignore
            [form_data, form_data, form_data, form_data, $t, $t, $t, $t,];
        },
    };
    const { default: __VLS_175 } = __VLS_171.slots;
    let __VLS_176;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent1(__VLS_176, new __VLS_176({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "reference",
    }));
    const __VLS_178 = __VLS_177({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "reference",
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_181;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_183 = __VLS_182({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_182));
    // @ts-ignore
    [$t, $t,];
    var __VLS_171;
    var __VLS_172;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.reranker_model_id_type !== 'reference') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_186;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
        ...{ 'onWheel': {} },
        ...{ 'onSubmitModel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.reranker_model_id),
        placeholder: (__VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('RERANKER'),
    }));
    const __VLS_188 = __VLS_187({
        ...{ 'onWheel': {} },
        ...{ 'onSubmitModel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.reranker_model_id),
        placeholder: (__VLS_ctx.$t('workflow.nodes.rerankerNode.reranker_model.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('RERANKER'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_187));
    let __VLS_191;
    const __VLS_192 = {
        /** @type {typeof __VLS_191.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const __VLS_193 = {
        /** @type {typeof __VLS_191.submitModel} */
        onSubmitModel: (__VLS_ctx.getSelectModel),
    };
    var __VLS_189;
    var __VLS_190;
}
else {
    const __VLS_194 = NodeCascader;
    // @ts-ignore
    const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.reranker_model_id_reference),
    }));
    const __VLS_196 = __VLS_195({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.reranker_model_id_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_195));
    var __VLS_199;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_197;
}
// @ts-ignore
[nodeModel, form_data, form_data, form_data, $t, $t, modelOptions, wheel, getSelectModel,];
var __VLS_164;
let __VLS_201;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent1(__VLS_201, new __VLS_201({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.showKnowledge.label')),
    prop: "show_knowledge",
    required: true,
}));
const __VLS_203 = __VLS_202({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('workflow.nodes.searchKnowledgeNode.showKnowledge.label')),
    prop: "show_knowledge",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
let __VLS_206;
const __VLS_207 = {
    /** @type {typeof __VLS_206.click} */
    onClick: () => { },
};
const { default: __VLS_208 } = __VLS_204.slots;
let __VLS_209;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
    size: "small",
    modelValue: (__VLS_ctx.form_data.show_knowledge),
}));
const __VLS_211 = __VLS_210({
    size: "small",
    modelValue: (__VLS_ctx.form_data.show_knowledge),
}, ...__VLS_functionalComponentArgsRest(__VLS_210));
// @ts-ignore
[form_data, $t,];
var __VLS_204;
var __VLS_205;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_214 = ParamSettingDialog;
// @ts-ignore
const __VLS_215 = __VLS_asFunctionalComponent1(__VLS_214, new __VLS_214({
    ...{ 'onRefresh': {} },
    ref: "ParamSettingDialogRef",
}));
const __VLS_216 = __VLS_215({
    ...{ 'onRefresh': {} },
    ref: "ParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_215));
let __VLS_219;
const __VLS_220 = {
    /** @type {typeof __VLS_219.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_221;
var __VLS_217;
var __VLS_218;
// @ts-ignore
[refreshParam,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_160 = __VLS_159, __VLS_200 = __VLS_199, __VLS_222 = __VLS_221;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
