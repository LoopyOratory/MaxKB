/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onMounted, ref, inject } from 'vue';
import { groupBy, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import TTSModeParamSettingDialog from '@/views/application/component/TTSModeParamSettingDialog.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { WorkflowMode } from '@/enums/application';
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
const workflowMode = inject('workflowMode') || WorkflowMode.Application;
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
const TTSModeParamSettingDialogRef = ref();
const modelOptions = ref(null);
const aiChatNodeFormRef = ref();
const modelCascaderRef = ref();
const nodeCascaderRef = ref();
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
const form = {
    tts_model_id: '',
    tts_model_id_type: 'custom',
    tts_model_id_reference: [],
    is_result: true,
    content_list: [],
    model_params_setting: {},
};
const form_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            if (!props.nodeModel.properties.node_data.tts_model_id_type) {
                set(props.nodeModel.properties.node_data, 'tts_model_id_type', 'custom');
            }
            if (!props.nodeModel.properties.node_data.tts_model_id_reference) {
                set(props.nodeModel.properties.node_data, 'tts_model_id_reference', []);
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
            model_type: 'TTS',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            model_type: 'TTS',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
    });
}
const openTTSParamSettingDialog = () => {
    const model_id = form_data.value.tts_model_id;
    if (!model_id) {
        MsgSuccess(t('views.application.form.voicePlay.requiredMessage'));
        return;
    }
    TTSModeParamSettingDialogRef.value?.open(model_id, id, form_data.value.model_params_setting);
};
const refreshTTSForm = (data) => {
    form_data.value.model_params_setting = data;
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
    label: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.tts_model.label')),
    prop: (__VLS_ctx.form_data.tts_model_id_type === 'reference' ? 'tts_model_id_reference' : 'tts_model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.tts_model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.voicePlay.placeholder'),
        trigger: 'change',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.tts_model.label')),
    prop: (__VLS_ctx.form_data.tts_model_id_type === 'reference' ? 'tts_model_id_reference' : 'tts_model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.form_data.tts_model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.voicePlay.placeholder'),
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
    (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.tts_model.label'));
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
        modelValue: (__VLS_ctx.form_data.tts_model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.form_data.tts_model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.form_data.tts_model_id_reference = [];
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
if (__VLS_ctx.form_data.tts_model_id_type !== 'reference') {
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
        modelValue: (__VLS_ctx.form_data.tts_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.voicePlay.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('TTS'),
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.tts_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.voicePlay.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('TTS'),
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
        disabled: (!__VLS_ctx.form_data.tts_model_id),
    }));
    const __VLS_57 = __VLS_56({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.form_data.tts_model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_56));
    let __VLS_60;
    const __VLS_61 = {
        /** @type {typeof __VLS_60.click} */
        onClick: (__VLS_ctx.openTTSParamSettingDialog),
    };
    const { default: __VLS_62 } = __VLS_58.slots;
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({}));
    const __VLS_65 = __VLS_64({}, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_68 } = __VLS_66.slots;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({}));
    const __VLS_71 = __VLS_70({}, ...__VLS_functionalComponentArgsRest(__VLS_70));
    // @ts-ignore
    [$t, form_data, form_data, form_data, modelOptions, wheel, openTTSParamSettingDialog,];
    var __VLS_66;
    // @ts-ignore
    [];
    var __VLS_58;
    var __VLS_59;
}
else {
    const __VLS_74 = NodeCascader;
    // @ts-ignore
    const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.tts_model_id_reference),
    }));
    const __VLS_76 = __VLS_75({
        ref: "modelCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.form_data.tts_model_id_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_75));
    var __VLS_79;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_77;
}
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_26;
let __VLS_81;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent1(__VLS_81, new __VLS_81({
    prop: "content_list",
    label: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'),
        trigger: 'blur',
        required: true,
    }),
}));
const __VLS_83 = __VLS_82({
    prop: "content_list",
    label: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    rules: ({
        message: __VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'),
        trigger: 'blur',
        required: true,
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
const { default: __VLS_86 } = __VLS_84.slots;
{
    const { label: __VLS_87 } = __VLS_84.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t, $t,];
}
const __VLS_88 = NodeCascader;
// @ts-ignore
const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    modelValue: (__VLS_ctx.form_data.content_list),
}));
const __VLS_90 = __VLS_89({
    ref: "nodeCascaderRef",
    nodeModel: (__VLS_ctx.nodeModel),
    ...{ class: "w-full" },
    placeholder: (__VLS_ctx.$t('workflow.nodes.textToSpeechNode.content.label')),
    modelValue: (__VLS_ctx.form_data.content_list),
}, ...__VLS_functionalComponentArgsRest(__VLS_89));
var __VLS_93;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
var __VLS_91;
// @ts-ignore
[nodeModel, $t, form_data,];
var __VLS_84;
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }));
    const __VLS_97 = __VLS_96({
        ...{ 'onClick': {} },
        label: (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.label')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    let __VLS_100;
    const __VLS_101 = {
        /** @type {typeof __VLS_100.click} */
        onClick: () => { },
    };
    const { default: __VLS_102 } = __VLS_98.slots;
    {
        const { label: __VLS_103 } = __VLS_98.slots;
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
        let __VLS_104;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent1(__VLS_104, new __VLS_104({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }));
        const __VLS_106 = __VLS_105({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        const { default: __VLS_109 } = __VLS_107.slots;
        {
            const { content: __VLS_110 } = __VLS_107.slots;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.tooltip'));
            // @ts-ignore
            [$t, $t, $t, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        }
        let __VLS_111;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_112 = __VLS_asFunctionalComponent1(__VLS_111, new __VLS_111({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_113 = __VLS_112({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_112));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_107;
        // @ts-ignore
        [];
    }
    let __VLS_116;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
        size: "small",
        modelValue: (__VLS_ctx.form_data.is_result),
    }));
    const __VLS_118 = __VLS_117({
        size: "small",
        modelValue: (__VLS_ctx.form_data.is_result),
    }, ...__VLS_functionalComponentArgsRest(__VLS_117));
    // @ts-ignore
    [form_data,];
    var __VLS_98;
    var __VLS_99;
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_121 = TTSModeParamSettingDialog;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
    ...{ 'onRefresh': {} },
    ref: "TTSModeParamSettingDialogRef",
}));
const __VLS_123 = __VLS_122({
    ...{ 'onRefresh': {} },
    ref: "TTSModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
let __VLS_126;
const __VLS_127 = {
    /** @type {typeof __VLS_126.refresh} */
    onRefresh: (__VLS_ctx.refreshTTSForm),
};
var __VLS_128;
var __VLS_124;
var __VLS_125;
// @ts-ignore
[refreshTTSForm,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_80 = __VLS_79, __VLS_94 = __VLS_93, __VLS_129 = __VLS_128;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
