/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, ref, inject } from 'vue';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import ParametersFieldTable from '@/workflow/nodes/parameter-extraction-node/component/ParametersFieldTable.vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { set, groupBy } from 'lodash';
const getResourceDetail = inject('getResourceDetail');
const props = defineProps();
const AIModeParamSettingDialogRef = ref();
const route = useRoute();
const { params: { id }, } = route;
const openAIParamSettingDialog = (modelId) => {
    if (modelId) {
        AIModeParamSettingDialogRef.value?.open(modelId, id, form_data.value.model_params_setting);
    }
};
function refreshParam(data) {
    set(props.nodeModel.properties.node_data, 'model_params_setting', data);
}
const resource = getResourceDetail();
const modelOptions = ref(null);
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
function getSelectModel() {
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'LLM',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'LLM',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
    });
}
const form = {
    input_variable: [],
    model_params_setting: {},
    model_id: '',
    model_id_type: 'custom',
    model_id_reference: [],
    variable_list: [],
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            if (!props.nodeModel.properties.node_data.model_id_type) {
                set(props.nodeModel.properties.node_data, 'model_id_type', 'custom');
            }
            if (!props.nodeModel.properties.node_data.model_id_reference) {
                set(props.nodeModel.properties.node_data, 'model_id_reference', []);
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
const model_change = (model_id) => {
    if (model_id) {
        AIModeParamSettingDialogRef.value?.reset_default(model_id, id);
    }
    else {
        refreshParam({});
    }
};
const VariableSplittingRef = ref();
const nodeCascaderRef = ref();
const inputVariableCascaderRef = ref();
const validate = async () => {
    return Promise.all([
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
        inputVariableCascaderRef.value
            ? inputVariableCascaderRef.value.validate()
            : Promise.resolve(''),
        VariableSplittingRef.value.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
onMounted(() => {
    getSelectModel();
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
    ref: "VariableSplittingRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "VariableSplittingRef",
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
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
    prop: (__VLS_ctx.form_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.aiModel.placeholder'),
        trigger: 'change',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
    prop: (__VLS_ctx.form_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.aiModel.placeholder'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
const { default: __VLS_28 } = __VLS_26.slots;
{
    const { label: __VLS_29 } = __VLS_26.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.aiModel.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.form_data.model_id_reference = [];
            // @ts-ignore
            [nodeModel, $t, $t, $t, $t, $t, form_data, form_data, form_data, form_data, form_data,];
        },
    };
    const { default: __VLS_37 } = __VLS_33.slots;
    let __VLS_38;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent1(__VLS_38, new __VLS_38({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "reference",
    }));
    const __VLS_40 = __VLS_39({
        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
        value: "reference",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_45 = __VLS_44({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    // @ts-ignore
    [$t, $t,];
    var __VLS_33;
    var __VLS_34;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.model_id_type !== 'reference') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onChange': {} },
        ...{ 'onWheel': {} },
        ...{ 'onSubmitModel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onChange': {} },
        ...{ 'onWheel': {} },
        ...{ 'onSubmitModel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.change} */
        onChange: (__VLS_ctx.model_change),
    };
    const __VLS_55 = {
        /** @type {typeof __VLS_53.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const __VLS_56 = {
        /** @type {typeof __VLS_53.submitModel} */
        onSubmitModel: (__VLS_ctx.getSelectModel),
    };
    var __VLS_51;
    var __VLS_52;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    let __VLS_57;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.form_data.model_id),
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.form_data.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form_data.model_id_type !== 'reference'))
                throw 0;
            return __VLS_ctx.openAIParamSettingDialog(__VLS_ctx.form_data.model_id);
            // @ts-ignore
            [$t, form_data, form_data, form_data, form_data, modelOptions, model_change, wheel, getSelectModel, openAIParamSettingDialog,];
        },
    };
    const __VLS_64 = {
        /** @type {typeof __VLS_62.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_65 } = __VLS_60.slots;
    let __VLS_66;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_67 = __VLS_asFunctionalComponent1(__VLS_66, new __VLS_66({}));
    const __VLS_68 = __VLS_67({}, ...__VLS_functionalComponentArgsRest(__VLS_67));
    const { default: __VLS_71 } = __VLS_69.slots;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({}));
    const __VLS_74 = __VLS_73({}, ...__VLS_functionalComponentArgsRest(__VLS_73));
    // @ts-ignore
    [refreshParam,];
    var __VLS_69;
    // @ts-ignore
    [];
    var __VLS_60;
    var __VLS_61;
}
else {
    const __VLS_77 = NodeCascader;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.model_id_reference),
    }));
    const __VLS_79 = __VLS_78({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.model_id_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    var __VLS_82;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_80;
}
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_26;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    prop: "input_variable",
    rules: ({
        message: __VLS_ctx.$t('workflow.variable.placeholder'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_86 = __VLS_85({
    prop: "input_variable",
    rules: ({
        message: __VLS_ctx.$t('workflow.variable.placeholder'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
{
    const { label: __VLS_90 } = __VLS_87.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    (__VLS_ctx.$t('workflow.nodes.variableSplittingNode.inputVariables'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t,];
}
const __VLS_91 = NodeCascader;
// @ts-ignore
const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
    ref: "inputVariableCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
    modelValue: (__VLS_ctx.form_data.input_variable),
}));
const __VLS_93 = __VLS_92({
    ref: "inputVariableCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
    modelValue: (__VLS_ctx.form_data.input_variable),
}, ...__VLS_functionalComponentArgsRest(__VLS_92));
var __VLS_96;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_94;
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_87;
let __VLS_98;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent1(__VLS_98, new __VLS_98({
    prop: "variable_list",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.variableListPlaceholder'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_100 = __VLS_99({
    prop: "variable_list",
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.parameterExtractionNode.extractParameters.variableListPlaceholder'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_99));
const { default: __VLS_103 } = __VLS_101.slots;
const __VLS_104 = ParametersFieldTable || ParametersFieldTable;
// @ts-ignore
const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
    ref: "ParametersFieldTableRef",
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_106 = __VLS_105({
    ref: "ParametersFieldTableRef",
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_105));
var __VLS_109;
var __VLS_107;
// @ts-ignore
[nodeModel, $t,];
var __VLS_101;
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_111 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_113 = __VLS_112({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_112));
let __VLS_116;
const __VLS_117 = {
    /** @type {typeof __VLS_116.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_118;
var __VLS_114;
var __VLS_115;
// @ts-ignore
[refreshParam,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_83 = __VLS_82, __VLS_97 = __VLS_96, __VLS_110 = __VLS_109, __VLS_119 = __VLS_118;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
