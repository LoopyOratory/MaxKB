/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { computed, onMounted, ref, inject } from 'vue';
import { cloneDeep, groupBy, set } from 'lodash';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import { t } from '@/locales';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import GeneratePromptDialog from '@/views/application/component/GeneratePromptDialog.vue';
import { WorkflowMode } from '@/enums/application';
import ReasoningParamSettingDialog from '@/views/application/component/ReasoningParamSettingDialog.vue';
const workflowMode = inject('workflowMode') || WorkflowMode.Application;
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
import { fileTooltip } from "@/workflow/common/data.ts";
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
const ReasoningParamSettingDialogRef = ref();
const openReasoningParamSettingDialog = () => {
    ReasoningParamSettingDialogRef.value?.open(form_data.value.model_setting);
};
const props = defineProps();
const modelOptions = ref(null);
const AIModeParamSettingDialogRef = ref();
const aiChatNodeFormRef = ref();
const nodeCascaderRef = ref();
const modelCascaderRef = ref();
const validate = () => {
    return Promise.all([
        nodeCascaderRef.value ? nodeCascaderRef.value.validate() : Promise.resolve(''),
        modelCascaderRef.value ? modelCascaderRef.value.validate() : Promise.resolve(''),
        aiChatNodeFormRef.value?.validate(),
    ]).catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
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
const defaultPrompt = `{{${t('workflow.nodes.startNode.label')}.question}}`;
const form = {
    model_id: '',
    model_id_type: 'custom',
    model_id_reference: [],
    system: '',
    prompt: defaultPrompt,
    dialogue_number: 0,
    dialogue_type: 'NODE',
    is_result: true,
    temperature: null,
    max_tokens: null,
    video_list: ['start-node', 'video'],
    model_setting: {
        reasoning_content_start: '<think>',
        reasoning_content_end: '</think>',
        reasoning_content_enable: false,
    },
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
            if (!props.nodeModel.properties.node_data.model_setting) {
                set(props.nodeModel.properties.node_data, 'model_setting', {
                    reasoning_content_start: '<think>',
                    reasoning_content_end: '</think>',
                    reasoning_content_enable: false,
                });
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
const resource = getResourceDetail();
function getSelectModel() {
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'IMAGE',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'IMAGE',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
    });
}
function submitSystemDialog(val) {
    set(props.nodeModel.properties.node_data, 'system', val);
}
function submitDialog(val) {
    set(props.nodeModel.properties.node_data, 'prompt', val);
}
const openAIParamSettingDialog = (modelId) => {
    if (modelId) {
        AIModeParamSettingDialogRef.value?.open(modelId, id, form_data.value.model_params_setting);
    }
};
const GeneratePromptDialogRef = ref();
const openGeneratePromptDialog = (modelId) => {
    if (modelId) {
        GeneratePromptDialogRef.value?.open(modelId, id);
    }
};
const replace = (v) => {
    set(props.nodeModel.properties.node_data, 'system', v);
};
function refreshParam(data) {
    set(props.nodeModel.properties.node_data, 'model_params_setting', data);
}
function submitReasoningDialog(val) {
    let model_setting = cloneDeep(props.nodeModel.properties.node_data.model_setting);
    model_setting = {
        ...model_setting,
        ...val,
    };
    set(props.nodeModel.properties.node_data, 'model_setting', model_setting);
}
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
    ref: "aiChatNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "aiChatNodeFormRef",
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
    label: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.model.label')),
    prop: (__VLS_ctx.form_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.model.requiredMessage'),
        trigger: 'change',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.model.label')),
    prop: (__VLS_ctx.form_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.model.requiredMessage'),
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
    (__VLS_ctx.t('workflow.nodes.videoUnderstandNode.model.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
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
            [nodeModel, $t, $t, $t, $t, form_data, form_data, form_data, form_data, form_data, t,];
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
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.model_id),
        placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.model.requiredMessage')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('IMAGE'),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.model_id),
        placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.model.requiredMessage')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('IMAGE'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    var __VLS_51;
    var __VLS_52;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    let __VLS_55;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.form_data.model_id),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.form_data.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        /** @type {typeof __VLS_60.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.form_data.model_id_type !== 'reference'))
                throw 0;
            return __VLS_ctx.openAIParamSettingDialog(__VLS_ctx.form_data.model_id);
            // @ts-ignore
            [$t, form_data, form_data, form_data, form_data, modelOptions, wheel, openAIParamSettingDialog,];
        },
    };
    const __VLS_62 = {
        /** @type {typeof __VLS_60.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_63 } = __VLS_58.slots;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
    const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({}));
    const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
    // @ts-ignore
    [refreshParam,];
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_58;
    var __VLS_59;
}
else {
    const __VLS_75 = NodeCascader;
    // @ts-ignore
    const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.model_id_reference),
    }));
    const __VLS_77 = __VLS_76({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.model_id_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_76));
    var __VLS_80;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_78;
}
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_26;
let __VLS_82;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({}));
const __VLS_84 = __VLS_83({}, ...__VLS_functionalComponentArgsRest(__VLS_83));
const { default: __VLS_87 } = __VLS_85.slots;
{
    const { label: __VLS_88 } = __VLS_85.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.roleSettings.label'));
    let __VLS_89;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_90 = __VLS_asFunctionalComponent1(__VLS_89, new __VLS_89({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.roleSettings.tooltip')),
        placement: "right",
    }));
    const __VLS_91 = __VLS_90({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.roleSettings.tooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_90));
    const { default: __VLS_94 } = __VLS_92.slots;
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }));
    const __VLS_97 = __VLS_96({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    // @ts-ignore
    [$t, $t,];
    var __VLS_92;
    let __VLS_100;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.form_data.model_id),
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.form_data.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_105;
    const __VLS_106 = {
        /** @type {typeof __VLS_105.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openGeneratePromptDialog(__VLS_ctx.form_data.model_id);
            // @ts-ignore
            [form_data, form_data, openGeneratePromptDialog,];
        },
    };
    const { default: __VLS_107 } = __VLS_103.slots;
    let __VLS_108;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
        iconName: "app-generate-star",
    }));
    const __VLS_110 = __VLS_109({
        iconName: "app-generate-star",
    }, ...__VLS_functionalComponentArgsRest(__VLS_109));
    // @ts-ignore
    [];
    var __VLS_103;
    var __VLS_104;
    // @ts-ignore
    [];
}
let __VLS_113;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.roleSettings.label')),
    modelValue: (__VLS_ctx.form_data.system),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.SystemPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}));
const __VLS_115 = __VLS_114({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.roleSettings.label')),
    modelValue: (__VLS_ctx.form_data.system),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.SystemPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
let __VLS_118;
const __VLS_119 = {
    /** @type {typeof __VLS_118.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitSystemDialog),
};
var __VLS_116;
var __VLS_117;
// @ts-ignore
[$t, form_data, t, t, submitSystemDialog,];
var __VLS_85;
let __VLS_120;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
    label: (__VLS_ctx.$t('views.application.form.prompt.label')),
    prop: "prompt",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}));
const __VLS_122 = __VLS_121({
    label: (__VLS_ctx.$t('views.application.form.prompt.label')),
    prop: "prompt",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_121));
const { default: __VLS_125 } = __VLS_123.slots;
{
    const { label: __VLS_126 } = __VLS_123.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.prompt.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_127;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }));
    const __VLS_129 = __VLS_128({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_128));
    const { default: __VLS_132 } = __VLS_130.slots;
    {
        const { content: __VLS_133 } = __VLS_130.slots;
        (__VLS_ctx.$t('views.application.form.prompt.tooltip'));
        // @ts-ignore
        [$t, $t, $t, $t,];
    }
    let __VLS_134;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_135 = __VLS_asFunctionalComponent1(__VLS_134, new __VLS_134({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_136 = __VLS_135({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_135));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_130;
    // @ts-ignore
    [];
}
let __VLS_139;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_140 = __VLS_asFunctionalComponent1(__VLS_139, new __VLS_139({
    ...{ 'onWheel': {} },
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prompt.label')),
    modelValue: (__VLS_ctx.form_data.prompt),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.UserPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}));
const __VLS_141 = __VLS_140({
    ...{ 'onWheel': {} },
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prompt.label')),
    modelValue: (__VLS_ctx.form_data.prompt),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.UserPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_140));
let __VLS_144;
const __VLS_145 = {
    /** @type {typeof __VLS_144.wheel} */
    onWheel: (__VLS_ctx.wheel),
};
const __VLS_146 = {
    /** @type {typeof __VLS_144.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitDialog),
};
var __VLS_142;
var __VLS_143;
// @ts-ignore
[$t, form_data, t, t, wheel, submitDialog,];
var __VLS_123;
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_147;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({}));
    const __VLS_149 = __VLS_148({}, ...__VLS_functionalComponentArgsRest(__VLS_148));
    const { default: __VLS_152 } = __VLS_150.slots;
    {
        const { label: __VLS_153 } = __VLS_150.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (__VLS_ctx.$t('views.application.form.historyRecord.label'));
        let __VLS_154;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
            modelValue: (__VLS_ctx.form_data.dialogue_type),
            type: "small",
            ...{ style: {} },
            teleported: (false),
        }));
        const __VLS_156 = __VLS_155({
            modelValue: (__VLS_ctx.form_data.dialogue_type),
            type: "small",
            ...{ style: {} },
            teleported: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_155));
        const { default: __VLS_159 } = __VLS_157.slots;
        let __VLS_160;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
            label: (__VLS_ctx.$t('workflow.node')),
            value: "NODE",
        }));
        const __VLS_162 = __VLS_161({
            label: (__VLS_ctx.$t('workflow.node')),
            value: "NODE",
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        let __VLS_165;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent1(__VLS_165, new __VLS_165({
            label: (__VLS_ctx.$t('workflow.workflow')),
            value: "WORKFLOW",
        }));
        const __VLS_167 = __VLS_166({
            label: (__VLS_ctx.$t('workflow.workflow')),
            value: "WORKFLOW",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        // @ts-ignore
        [$t, $t, $t, form_data, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        var __VLS_157;
        // @ts-ignore
        [];
    }
    let __VLS_170;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_171 = __VLS_asFunctionalComponent1(__VLS_170, new __VLS_170({
        modelValue: (__VLS_ctx.form_data.dialogue_number),
        min: (0),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ class: "w-full" },
        step: (1),
        stepStrictly: (true),
    }));
    const __VLS_172 = __VLS_171({
        modelValue: (__VLS_ctx.form_data.dialogue_number),
        min: (0),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ class: "w-full" },
        step: (1),
        stepStrictly: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_171));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    // @ts-ignore
    [form_data,];
    var __VLS_150;
}
let __VLS_175;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_176 = __VLS_asFunctionalComponent1(__VLS_175, new __VLS_175({
    rules: ({
        type: 'array',
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage'),
        trigger: 'change',
    }),
}));
const __VLS_177 = __VLS_176({
    rules: ({
        type: 'array',
        required: true,
        message: __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_176));
const { default: __VLS_180 } = __VLS_178.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
(__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.label'));
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "color-danger" },
});
/** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
let __VLS_181;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent1(__VLS_181, new __VLS_181({
    effect: "dark",
    placement: "right",
}));
const __VLS_183 = __VLS_182({
    effect: "dark",
    placement: "right",
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
const { default: __VLS_186 } = __VLS_184.slots;
{
    const { content: __VLS_187 } = __VLS_184.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    (__VLS_ctx.fileTooltip);
    // @ts-ignore
    [$t, $t, fileTooltip,];
}
let __VLS_188;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
    iconName: "app-warning",
    ...{ class: "app-warning-icon" },
}));
const __VLS_190 = __VLS_189({
    iconName: "app-warning",
    ...{ class: "app-warning-icon" },
}, ...__VLS_functionalComponentArgsRest(__VLS_189));
/** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
// @ts-ignore
[];
var __VLS_184;
const __VLS_193 = NodeCascader;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent1(__VLS_193, new __VLS_193({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage')),
    modelValue: (__VLS_ctx.form_data.video_list),
}));
const __VLS_195 = __VLS_194({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage')),
    modelValue: (__VLS_ctx.form_data.video_list),
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
var __VLS_198;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_196;
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_178;
let __VLS_200;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
    ...{ 'onClick': {} },
}));
const __VLS_202 = __VLS_201({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_201));
let __VLS_205;
const __VLS_206 = {
    /** @type {typeof __VLS_205.click} */
    onClick: () => { },
};
const { default: __VLS_207 } = __VLS_203.slots;
{
    const { label: __VLS_208 } = __VLS_203.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.reasoningContent.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.form_data.model_setting.reasoning_content_enable) {
        let __VLS_209;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent1(__VLS_209, new __VLS_209({
            ...{ 'onClick': {} },
            ...{ 'onRefreshForm': {} },
            type: "primary",
            link: true,
            ...{ class: "mr-4" },
        }));
        const __VLS_211 = __VLS_210({
            ...{ 'onClick': {} },
            ...{ 'onRefreshForm': {} },
            type: "primary",
            link: true,
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        let __VLS_214;
        const __VLS_215 = {
            /** @type {typeof __VLS_214.click} */
            onClick: (__VLS_ctx.openReasoningParamSettingDialog),
        };
        const __VLS_216 = {
            /** @type {typeof __VLS_214.refreshForm} */
            onRefreshForm: (__VLS_ctx.refreshParam),
        };
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        const { default: __VLS_217 } = __VLS_212.slots;
        let __VLS_218;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_219 = __VLS_asFunctionalComponent1(__VLS_218, new __VLS_218({
            iconName: "app-setting",
        }));
        const __VLS_220 = __VLS_219({
            iconName: "app-setting",
        }, ...__VLS_functionalComponentArgsRest(__VLS_219));
        // @ts-ignore
        [$t, form_data, refreshParam, openReasoningParamSettingDialog,];
        var __VLS_212;
        var __VLS_213;
    }
    let __VLS_223;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_224 = __VLS_asFunctionalComponent1(__VLS_223, new __VLS_223({
        size: "small",
        modelValue: (__VLS_ctx.form_data.model_setting.reasoning_content_enable),
    }));
    const __VLS_225 = __VLS_224({
        size: "small",
        modelValue: (__VLS_ctx.form_data.model_setting.reasoning_content_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_224));
    // @ts-ignore
    [form_data,];
}
// @ts-ignore
[];
var __VLS_203;
var __VLS_204;
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_228;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent1(__VLS_228, new __VLS_228({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }));
    const __VLS_230 = __VLS_229({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    let __VLS_233;
    const __VLS_234 = {
        /** @type {typeof __VLS_233.click} */
        onClick: () => { },
    };
    const { default: __VLS_235 } = __VLS_231.slots;
    {
        const { label: __VLS_236 } = __VLS_231.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label'));
        let __VLS_237;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }));
        const __VLS_239 = __VLS_238({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_238));
        const { default: __VLS_242 } = __VLS_240.slots;
        {
            const { content: __VLS_243 } = __VLS_240.slots;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.tooltip'));
            // @ts-ignore
            [$t, $t, $t, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        }
        let __VLS_244;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent1(__VLS_244, new __VLS_244({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_246 = __VLS_245({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_240;
        // @ts-ignore
        [];
    }
    let __VLS_249;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({
        size: "small",
        modelValue: (__VLS_ctx.form_data.is_result),
    }));
    const __VLS_251 = __VLS_250({
        size: "small",
        modelValue: (__VLS_ctx.form_data.is_result),
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    // @ts-ignore
    [form_data,];
    var __VLS_231;
    var __VLS_232;
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_254 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_256 = __VLS_255({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
let __VLS_259;
const __VLS_260 = {
    /** @type {typeof __VLS_259.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_261;
var __VLS_257;
var __VLS_258;
const __VLS_263 = ReasoningParamSettingDialog;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
    ...{ 'onRefresh': {} },
    ref: "ReasoningParamSettingDialogRef",
}));
const __VLS_265 = __VLS_264({
    ...{ 'onRefresh': {} },
    ref: "ReasoningParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
let __VLS_268;
const __VLS_269 = {
    /** @type {typeof __VLS_268.refresh} */
    onRefresh: (__VLS_ctx.submitReasoningDialog),
};
var __VLS_270;
var __VLS_266;
var __VLS_267;
const __VLS_272 = GeneratePromptDialog;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    ...{ 'onReplace': {} },
    ref: "GeneratePromptDialogRef",
}));
const __VLS_274 = __VLS_273({
    ...{ 'onReplace': {} },
    ref: "GeneratePromptDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
let __VLS_277;
const __VLS_278 = {
    /** @type {typeof __VLS_277.replace} */
    onReplace: (__VLS_ctx.replace),
};
var __VLS_279;
var __VLS_275;
var __VLS_276;
// @ts-ignore
[refreshParam, submitReasoningDialog, replace,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_81 = __VLS_80, __VLS_199 = __VLS_198, __VLS_262 = __VLS_261, __VLS_271 = __VLS_270, __VLS_280 = __VLS_279;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
