/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set, groupBy } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import { ref, computed, onMounted, inject, reactive } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import GeneratePromptDialog from '@/views/application/component/GeneratePromptDialog.vue';
import { t } from '@/locales';
import ReasoningParamSettingDialog from '@/views/application/component/ReasoningParamSettingDialog.vue';
import ToolDialog from '@/views/application/component/ToolDialog.vue';
import McpServersDialog from '@/views/application/component/McpServersDialog.vue';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { useRoute } from 'vue-router';
import { resetUrl } from '@/utils/common';
import { relatedObject } from '@/utils/array.ts';
import { WorkflowMode } from '@/enums/application';
import ApplicationDialog from '@/views/application/component/ApplicationDialog.vue';
import { fileTooltip } from '@/workflow/common/data.ts';
const workflowMode = inject('workflowMode') || WorkflowMode.Application;
const getResourceDetail = inject('getResourceDetail');
const route = useRoute();
const { params: { id }, } = route;
const vision = computed({
    get: () => {
        return props.nodeModel.properties.node_data.vision;
    },
    set: (vision) => {
        set(props.nodeModel.properties.node_data, 'vision', vision);
    },
});
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
function submitSystemDialog(val) {
    set(props.nodeModel.properties.node_data, 'system', val);
}
function submitDialog(val) {
    set(props.nodeModel.properties.node_data, 'prompt', val);
}
const model_change = (model_id) => {
    if (model_id) {
        AIModeParamSettingDialogRef.value?.reset_default(model_id, id);
    }
    else {
        refreshParam({});
    }
};
const defaultPrompt = `${t('workflow.nodes.aiChatNode.defaultPrompt')}：
{{${t('workflow.nodes.searchKnowledgeNode.label')}.data}}
${t('views.problem.title')}：
{{${t('workflow.nodes.startNode.label')}.question}}`;
const collapseData = reactive({
    MCP: true,
    tool: true,
    skill: true,
    agent: true,
});
const form = {
    model_id: '',
    model_id_type: 'custom',
    model_id_reference: [],
    system: '',
    prompt: defaultPrompt,
    dialogue_number: 1,
    is_result: true,
    temperature: null,
    max_tokens: null,
    dialogue_type: 'WORKFLOW',
    model_setting: {
        reasoning_content_start: '<think>',
        reasoning_content_end: '</think>',
        reasoning_content_enable: false,
    },
};
const chat_data = computed({
    get: () => {
        if (props.nodeModel.properties.node_data) {
            if (!props.nodeModel.properties.node_data.model_setting) {
                set(props.nodeModel.properties.node_data, 'model_setting', {
                    reasoning_content_start: '<think>',
                    reasoning_content_end: '</think>',
                    reasoning_content_enable: false,
                });
            }
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
const props = defineProps();
const aiChatNodeFormRef = ref();
const modelOptions = ref(null);
const AIModeParamSettingDialogRef = ref();
const nodeCascaderRef = ref();
const ReasoningParamSettingDialogRef = ref();
const validate = () => {
    return aiChatNodeFormRef.value?.validate().catch((err) => {
        return Promise.reject({ node: props.nodeModel, errMessage: err });
    });
};
const resource = getResourceDetail();
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
const openAIParamSettingDialog = (modelId) => {
    if (modelId) {
        AIModeParamSettingDialogRef.value?.open(modelId, id, chat_data.value.model_params_setting);
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
const openReasoningParamSettingDialog = () => {
    ReasoningParamSettingDialogRef.value?.open(chat_data.value.model_setting);
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
const mcpServersDialogRef = ref();
function openMcpServersDialog() {
    const config = {
        mcp_servers: chat_data.value.mcp_servers,
        mcp_tool_ids: chat_data.value.mcp_tool_ids,
        mcp_source: chat_data.value.mcp_source,
    };
    mcpServersDialogRef.value.open(config, mcpToolSelectOptions.value);
}
function submitMcpServersDialog(config) {
    set(props.nodeModel.properties.node_data, 'mcp_servers', config.mcp_servers);
    set(props.nodeModel.properties.node_data, 'mcp_tool_ids', config.mcp_tool_ids);
    set(props.nodeModel.properties.node_data, 'mcp_source', config.mcp_source);
    collapseData.MCP = true;
}
const toolDialogRef = ref();
function openToolDialog() {
    toolDialogRef.value.open(chat_data.value.tool_ids);
}
function submitToolDialog(config) {
    set(props.nodeModel.properties.node_data, 'tool_ids', config.tool_ids);
    collapseData.tool = true;
}
function removeTool(id) {
    const list = props.nodeModel.properties.node_data.tool_ids.filter((v) => v !== id);
    set(props.nodeModel.properties.node_data, 'tool_ids', list);
}
function removeMcpTool(id) {
    const list = props.nodeModel.properties.node_data.mcp_tool_ids.filter((v) => v !== id);
    set(props.nodeModel.properties.node_data, 'mcp_tool_ids', list);
}
function removeSkillTool(id) {
    const list = props.nodeModel.properties.node_data.skill_tool_ids.filter((v) => v !== id);
    set(props.nodeModel.properties.node_data, 'skill_tool_ids', list);
}
const toolSelectOptions = ref([]);
function getToolSelectOptions() {
    const obj = apiType.value === 'systemManage'
        ? {
            scope: 'WORKSPACE',
            tool_type_list: ['CUSTOM', 'WORKFLOW'],
            workspace_id: resource.value?.workspace_id,
        }
        : {
            scope: 'WORKSPACE',
            tool_type_list: ['CUSTOM', 'WORKFLOW'],
        };
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getAllToolList(obj)
        .then((res) => {
        toolSelectOptions.value = [...res.data.shared_tools, ...res.data.tools].filter((item) => item.is_active);
    });
}
const mcpToolSelectOptions = ref([]);
function getMcpToolSelectOptions() {
    const obj = apiType.value === 'systemManage'
        ? {
            scope: 'WORKSPACE',
            tool_type: 'MCP',
            workspace_id: resource.value?.workspace_id,
        }
        : {
            scope: 'WORKSPACE',
            tool_type: 'MCP',
        };
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getAllToolList(obj)
        .then((res) => {
        mcpToolSelectOptions.value = [...res.data.shared_tools, ...res.data.tools].filter((item) => item.is_active);
    });
}
const applicationSelectOptions = ref([]);
function getApplicationSelectOptions() {
    ;
    (apiType.value === 'systemShare'
        ? Promise.resolve({ data: [] })
        : loadSharedApi({ type: 'application', systemType: apiType.value }).getAllApplication({
            folder_id: resource.value?.workspace_id,
        })).then((res) => {
        applicationSelectOptions.value = res.data.filter((item) => item.is_publish);
    });
}
const applicationDialogRef = ref();
function openApplicationDialog() {
    applicationDialogRef.value.open(props.nodeModel.properties.node_data.application_ids);
}
function submitApplicationDialog(config) {
    set(props.nodeModel.properties.node_data, 'application_ids', config.application_ids);
    collapseData.agent = true;
}
function removeApplication(id) {
    if (chat_data.value.application_ids) {
        chat_data.value.application_ids = chat_data.value.application_ids.filter((v) => v !== id);
    }
}
const skillToolDialogRef = ref();
function openSkillToolDialog() {
    skillToolDialogRef.value.open(chat_data.value.skill_tool_ids);
}
function submitSkillToolDialog(config) {
    chat_data.value.skill_tool_ids = config.tool_ids;
    collapseData.skill = true;
}
const skillToolSelectOptions = ref([]);
function getSkillToolSelectOptions() {
    const obj = apiType.value === 'systemManage'
        ? {
            scope: 'WORKSPACE',
            tool_type: 'SKILL',
            workspace_id: chat_data.value?.workspace_id,
        }
        : {
            scope: 'WORKSPACE',
            tool_type: 'SKILL',
        };
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .getAllToolList(obj)
        .then((res) => {
        skillToolSelectOptions.value = [...res.data.shared_tools, ...res.data.tools].filter((item) => item.is_active);
    });
}
function refreshLongTermConfig() {
    const form_data = props.nodeModel.graphModel.nodes
        .filter((v) => v.id === 'base-node')
        .filter((v) => v.properties.node_data.long_term_enable)
        .filter((v) => v);
    if (form_data.length > 0) {
        chat_data.value.system = chat_data.value.system;
    }
}
props.nodeModel.graphModel.eventCenter.on('refreshLongTermConfig', refreshLongTermConfig);
onMounted(() => {
    getSelectModel();
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
    set(props.nodeModel, 'validate', validate);
    if (!chat_data.value.dialogue_type) {
        chat_data.value.dialogue_type = 'WORKFLOW';
    }
    if (props.nodeModel.properties.node_data?.mcp_tool_id) {
        set(props.nodeModel.properties.node_data, 'mcp_tool_ids', [
            props.nodeModel.properties.node_data?.mcp_tool_id,
        ]);
        set(props.nodeModel.properties.node_data, 'mcp_tool_id', undefined);
    }
    if (props.nodeModel.properties.node_data?.mcp_output_enable === undefined) {
        set(props.nodeModel.properties.node_data, 'mcp_output_enable', true);
    }
    getToolSelectOptions();
    getMcpToolSelectOptions();
    getApplicationSelectOptions();
    getSkillToolSelectOptions();
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
    model: (__VLS_ctx.chat_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "aiChatNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_15 = __VLS_14({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.chat_data),
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
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
    prop: (__VLS_ctx.chat_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.chat_data.model_id_type === 'reference'
            ? __VLS_ctx.$t('workflow.variable.placeholder')
            : __VLS_ctx.$t('views.application.form.aiModel.placeholder'),
        trigger: 'change',
    }),
}));
const __VLS_25 = __VLS_24({
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
    prop: (__VLS_ctx.chat_data.model_id_type === 'reference' ? 'model_id_reference' : 'model_id'),
    rules: ({
        required: true,
        message: __VLS_ctx.chat_data.model_id_type === 'reference'
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
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.chat_data.model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_32 = __VLS_31({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.chat_data.model_id_type),
        teleported: (false),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    const __VLS_36 = {
        /** @type {typeof __VLS_35.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.chat_data.model_id_reference = [];
            // @ts-ignore
            [nodeModel, $t, $t, $t, $t, $t, chat_data, chat_data, chat_data, chat_data, chat_data,];
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
if (__VLS_ctx.chat_data.model_id_type !== 'reference') {
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
        modelValue: (__VLS_ctx.chat_data.model_id),
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
        modelValue: (__VLS_ctx.chat_data.model_id),
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
        disabled: (!__VLS_ctx.chat_data.model_id),
    }));
    const __VLS_59 = __VLS_58({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        disabled: (!__VLS_ctx.chat_data.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    let __VLS_62;
    const __VLS_63 = {
        /** @type {typeof __VLS_62.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.chat_data.model_id_type !== 'reference'))
                throw 0;
            return __VLS_ctx.openAIParamSettingDialog(__VLS_ctx.chat_data.model_id);
            // @ts-ignore
            [$t, chat_data, chat_data, chat_data, chat_data, modelOptions, model_change, wheel, getSelectModel, openAIParamSettingDialog,];
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
        modelValue: (__VLS_ctx.chat_data.model_id_reference),
    }));
    const __VLS_79 = __VLS_78({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
        modelValue: (__VLS_ctx.chat_data.model_id_reference),
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    var __VLS_82;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_80;
}
// @ts-ignore
[nodeModel, $t, chat_data,];
var __VLS_26;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({}));
const __VLS_86 = __VLS_85({}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
{
    const { label: __VLS_90 } = __VLS_87.slots;
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
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.roleSettings.tooltip')),
        placement: "right",
    }));
    const __VLS_93 = __VLS_92({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.roleSettings.tooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    const { default: __VLS_96 } = __VLS_94.slots;
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }));
    const __VLS_99 = __VLS_98({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    // @ts-ignore
    [$t, $t,];
    var __VLS_94;
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (__VLS_ctx.chat_data.model_id_type === 'reference' || !__VLS_ctx.chat_data.model_id),
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (__VLS_ctx.chat_data.model_id_type === 'reference' || !__VLS_ctx.chat_data.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        /** @type {typeof __VLS_107.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.openGeneratePromptDialog(__VLS_ctx.chat_data.model_id);
            // @ts-ignore
            [chat_data, chat_data, chat_data, openGeneratePromptDialog,];
        },
    };
    const { default: __VLS_109 } = __VLS_105.slots;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        iconName: "app-generate-star",
    }));
    const __VLS_112 = __VLS_111({
        iconName: "app-generate-star",
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    // @ts-ignore
    [];
    var __VLS_105;
    var __VLS_106;
    // @ts-ignore
    [];
}
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.roleSettings.label')),
    modelValue: (__VLS_ctx.chat_data.system),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.SystemPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}));
const __VLS_117 = __VLS_116({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.roleSettings.label')),
    modelValue: (__VLS_ctx.chat_data.system),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.SystemPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
let __VLS_120;
const __VLS_121 = {
    /** @type {typeof __VLS_120.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitSystemDialog),
};
var __VLS_118;
var __VLS_119;
// @ts-ignore
[$t, chat_data, t, t, submitSystemDialog,];
var __VLS_87;
let __VLS_122;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
    label: (__VLS_ctx.$t('views.application.form.prompt.label')),
    prop: "prompt",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}));
const __VLS_124 = __VLS_123({
    label: (__VLS_ctx.$t('views.application.form.prompt.label')),
    prop: "prompt",
    rules: ({
        required: true,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_123));
const { default: __VLS_127 } = __VLS_125.slots;
{
    const { label: __VLS_128 } = __VLS_125.slots;
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
    let __VLS_129;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_130 = __VLS_asFunctionalComponent1(__VLS_129, new __VLS_129({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }));
    const __VLS_131 = __VLS_130({
        effect: "dark",
        placement: "right",
        popperClass: "max-w-200",
    }, ...__VLS_functionalComponentArgsRest(__VLS_130));
    const { default: __VLS_134 } = __VLS_132.slots;
    {
        const { content: __VLS_135 } = __VLS_132.slots;
        (__VLS_ctx.$t('views.application.form.prompt.tooltip'));
        // @ts-ignore
        [$t, $t, $t, $t,];
    }
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_138 = __VLS_137({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_132;
    // @ts-ignore
    [];
}
let __VLS_141;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
    ...{ 'onWheel': {} },
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prompt.label')),
    modelValue: (__VLS_ctx.chat_data.prompt),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.UserPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}));
const __VLS_143 = __VLS_142({
    ...{ 'onWheel': {} },
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prompt.label')),
    modelValue: (__VLS_ctx.chat_data.prompt),
    ...{ style: {} },
    placeholder: (`${__VLS_ctx.t('workflow.UserPromptPlaceholder')}{{${__VLS_ctx.t('workflow.nodes.startNode.label')}.question}}`),
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
let __VLS_146;
const __VLS_147 = {
    /** @type {typeof __VLS_146.wheel} */
    onWheel: (__VLS_ctx.wheel),
};
const __VLS_148 = {
    /** @type {typeof __VLS_146.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitDialog),
};
var __VLS_144;
var __VLS_145;
// @ts-ignore
[$t, chat_data, wheel, t, t, submitDialog,];
var __VLS_125;
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_149;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({}));
    const __VLS_151 = __VLS_150({}, ...__VLS_functionalComponentArgsRest(__VLS_150));
    const { default: __VLS_154 } = __VLS_152.slots;
    {
        const { label: __VLS_155 } = __VLS_152.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between" },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        (__VLS_ctx.$t('views.application.form.historyRecord.label'));
        let __VLS_156;
        /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
        elSelect;
        // @ts-ignore
        const __VLS_157 = __VLS_asFunctionalComponent1(__VLS_156, new __VLS_156({
            modelValue: (__VLS_ctx.chat_data.dialogue_type),
            type: "small",
            ...{ style: {} },
        }));
        const __VLS_158 = __VLS_157({
            modelValue: (__VLS_ctx.chat_data.dialogue_type),
            type: "small",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_157));
        const { default: __VLS_161 } = __VLS_159.slots;
        let __VLS_162;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
            label: (__VLS_ctx.$t('workflow.node')),
            value: "NODE",
        }));
        const __VLS_164 = __VLS_163({
            label: (__VLS_ctx.$t('workflow.node')),
            value: "NODE",
        }, ...__VLS_functionalComponentArgsRest(__VLS_163));
        let __VLS_167;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
            label: (__VLS_ctx.$t('workflow.workflow')),
            value: "WORKFLOW",
        }));
        const __VLS_169 = __VLS_168({
            label: (__VLS_ctx.$t('workflow.workflow')),
            value: "WORKFLOW",
        }, ...__VLS_functionalComponentArgsRest(__VLS_168));
        // @ts-ignore
        [$t, $t, $t, chat_data, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        var __VLS_159;
        // @ts-ignore
        [];
    }
    let __VLS_172;
    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
    elInputNumber;
    // @ts-ignore
    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
        modelValue: (__VLS_ctx.chat_data.dialogue_number),
        min: (0),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ class: "w-full" },
        step: (1),
        stepStrictly: (true),
    }));
    const __VLS_174 = __VLS_173({
        modelValue: (__VLS_ctx.chat_data.dialogue_number),
        min: (0),
        valueOnClear: (0),
        controlsPosition: "right",
        ...{ class: "w-full" },
        step: (1),
        stepStrictly: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    // @ts-ignore
    [chat_data,];
    var __VLS_152;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
(__VLS_ctx.t('workflow.nodes.aiChatNode.vision.label'));
let __VLS_177;
/** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
elSwitch;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
    size: "small",
    modelValue: (__VLS_ctx.vision),
}));
const __VLS_179 = __VLS_178({
    size: "small",
    modelValue: (__VLS_ctx.vision),
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
if (__VLS_ctx.vision) {
    let __VLS_182;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
        rules: ({
            type: 'array',
            required: true,
            message: __VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage'),
            trigger: 'change',
        }),
    }));
    const __VLS_184 = __VLS_183({
        rules: ({
            type: 'array',
            required: true,
            message: __VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage'),
            trigger: 'change',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
    const { default: __VLS_187 } = __VLS_185.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.label'));
    let __VLS_188;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
        effect: "dark",
        placement: "right",
    }));
    const __VLS_190 = __VLS_189({
        effect: "dark",
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    const { default: __VLS_193 } = __VLS_191.slots;
    {
        const { content: __VLS_194 } = __VLS_191.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        (__VLS_ctx.fileTooltip);
        // @ts-ignore
        [$t, $t, t, vision, vision, fileTooltip,];
    }
    let __VLS_195;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_196 = __VLS_asFunctionalComponent1(__VLS_195, new __VLS_195({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_197 = __VLS_196({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_196));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_191;
    const __VLS_200 = NodeCascader;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent1(__VLS_200, new __VLS_200({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage')),
        modelValue: (__VLS_ctx.chat_data.image_list),
    }));
    const __VLS_202 = __VLS_201({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.imageUnderstandNode.image.requiredMessage')),
        modelValue: (__VLS_ctx.chat_data.image_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_201));
    var __VLS_205;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_203;
    // @ts-ignore
    [nodeModel, $t, chat_data,];
    var __VLS_185;
    let __VLS_207;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
        rules: ({
            type: 'array',
            required: false,
            message: __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage'),
            trigger: 'change',
        }),
    }));
    const __VLS_209 = __VLS_208({
        rules: ({
            type: 'array',
            required: false,
            message: __VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage'),
            trigger: 'change',
        }),
    }, ...__VLS_functionalComponentArgsRest(__VLS_208));
    const { default: __VLS_212 } = __VLS_210.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.label'));
    let __VLS_213;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
        effect: "dark",
        placement: "right",
    }));
    const __VLS_215 = __VLS_214({
        effect: "dark",
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_214));
    const { default: __VLS_218 } = __VLS_216.slots;
    {
        const { content: __VLS_219 } = __VLS_216.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ style: {} },
        });
        (__VLS_ctx.fileTooltip);
        // @ts-ignore
        [$t, $t, fileTooltip,];
    }
    let __VLS_220;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent1(__VLS_220, new __VLS_220({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_222 = __VLS_221({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [];
    var __VLS_216;
    const __VLS_225 = NodeCascader;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage')),
        modelValue: (__VLS_ctx.chat_data.video_list),
    }));
    const __VLS_227 = __VLS_226({
        ref: "nodeCascaderRef",
        nodeModel: (__VLS_ctx.nodeModel),
        ...{ class: "w-full" },
        placeholder: (__VLS_ctx.$t('workflow.nodes.videoUnderstandNode.video.requiredMessage')),
        modelValue: (__VLS_ctx.chat_data.video_list),
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    var __VLS_230;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_228;
    // @ts-ignore
    [nodeModel, $t, chat_data,];
    var __VLS_210;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-8 mt-12 flex-between" },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-4 lighter" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.tool.skill.title'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_232;
/** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
elCheckbox;
// @ts-ignore
const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
    modelValue: (__VLS_ctx.chat_data.mcp_output_enable),
    label: (__VLS_ctx.$t('views.application.form.mcp_output_enable')),
}));
const __VLS_234 = __VLS_233({
    modelValue: (__VLS_ctx.chat_data.mcp_output_enable),
    label: (__VLS_ctx.$t('views.application.form.mcp_output_enable')),
}, ...__VLS_functionalComponentArgsRest(__VLS_233));
let __VLS_237;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
    shadow: "never",
    ...{ style: {} },
    ...{ class: "mb-12" },
}));
const __VLS_239 = __VLS_238({
    shadow: "never",
    ...{ style: {} },
    ...{ class: "mb-12" },
}, ...__VLS_functionalComponentArgsRest(__VLS_238));
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
const { default: __VLS_242 } = __VLS_240.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.collapseData.MCP = !__VLS_ctx.collapseData.MCP;
            // @ts-ignore
            [$t, $t, chat_data, collapseData, collapseData,];
        } },
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center lighter cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
let __VLS_243;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_244 = __VLS_asFunctionalComponent1(__VLS_243, new __VLS_243({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.MCP ? 'rotate-90' : '') },
}));
const __VLS_245 = __VLS_244({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.MCP ? 'rotate-90' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_244));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_248 } = __VLS_246.slots;
let __VLS_249;
/** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
CaretRight;
// @ts-ignore
const __VLS_250 = __VLS_asFunctionalComponent1(__VLS_249, new __VLS_249({}));
const __VLS_251 = __VLS_250({}, ...__VLS_functionalComponentArgsRest(__VLS_250));
// @ts-ignore
[collapseData,];
var __VLS_246;
if (__VLS_ctx.chat_data.mcp_tool_ids?.filter((id) => __VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, id, 'id'))?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.chat_data.mcp_tool_ids?.filter((id) => __VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, id, 'id'))?.length);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_254;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({
    ...{ 'onClick': {} },
    ...{ 'onRefreshForm': {} },
    type: "primary",
    link: true,
}));
const __VLS_256 = __VLS_255({
    ...{ 'onClick': {} },
    ...{ 'onRefreshForm': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_255));
let __VLS_259;
const __VLS_260 = {
    /** @type {typeof __VLS_259.click} */
    onClick: (__VLS_ctx.openMcpServersDialog),
};
const __VLS_261 = {
    /** @type {typeof __VLS_259.refreshForm} */
    onRefreshForm: (__VLS_ctx.refreshParam),
};
const { default: __VLS_262 } = __VLS_257.slots;
let __VLS_263;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_264 = __VLS_asFunctionalComponent1(__VLS_263, new __VLS_263({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_265 = __VLS_264({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_264));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
// @ts-ignore
[chat_data, chat_data, refreshParam, relatedObject, relatedObject, mcpToolSelectOptions, mcpToolSelectOptions, openMcpServersDialog,];
var __VLS_257;
var __VLS_258;
if (__VLS_ctx.chat_data.mcp_tool_ids?.length > 0 && __VLS_ctx.collapseData.MCP) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.mcp_tool_ids))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        if (__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.icon) {
                let __VLS_268;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_269 = __VLS_asFunctionalComponent1(__VLS_268, new __VLS_268({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_270 = __VLS_269({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_269));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_273 } = __VLS_271.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [chat_data, chat_data, collapseData, relatedObject, relatedObject, relatedObject, mcpToolSelectOptions, mcpToolSelectOptions, mcpToolSelectOptions, resetUrl,];
                var __VLS_271;
            }
            else {
                let __VLS_274;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_275 = __VLS_asFunctionalComponent1(__VLS_274, new __VLS_274({
                    type: "MCP",
                    ...{ class: "mr-8" },
                    size: (20),
                    ...{ style: {} },
                }));
                const __VLS_276 = __VLS_275({
                    type: "MCP",
                    ...{ class: "mr-8" },
                    size: (20),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_275));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis" },
                title: (__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.name ||
                __VLS_ctx.$t('common.custom') + ' MCP');
            let __VLS_279;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_280 = __VLS_asFunctionalComponent1(__VLS_279, new __VLS_279({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_281 = __VLS_280({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_280));
            let __VLS_284;
            const __VLS_285 = {
                /** @type {typeof __VLS_284.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.chat_data.mcp_tool_ids?.length > 0 && __VLS_ctx.collapseData.MCP))
                        throw 0;
                    if (!(__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')))
                        throw 0;
                    return __VLS_ctx.removeMcpTool(item);
                    // @ts-ignore
                    [$t, relatedObject, relatedObject, mcpToolSelectOptions, mcpToolSelectOptions, removeMcpTool,];
                },
            };
            const { default: __VLS_286 } = __VLS_282.slots;
            let __VLS_287;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_288 = __VLS_asFunctionalComponent1(__VLS_287, new __VLS_287({}));
            const __VLS_289 = __VLS_288({}, ...__VLS_functionalComponentArgsRest(__VLS_288));
            const { default: __VLS_292 } = __VLS_290.slots;
            let __VLS_293;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_294 = __VLS_asFunctionalComponent1(__VLS_293, new __VLS_293({}));
            const __VLS_295 = __VLS_294({}, ...__VLS_functionalComponentArgsRest(__VLS_294));
            // @ts-ignore
            [];
            var __VLS_290;
            // @ts-ignore
            [];
            var __VLS_282;
            var __VLS_283;
        }
        // @ts-ignore
        [];
    }
}
if (__VLS_ctx.chat_data.mcp_servers && __VLS_ctx.chat_data.mcp_servers.length > 0 && __VLS_ctx.collapseData.MCP) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between border border-r-6 white-bg mb-16" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['border']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_298;
    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
    ToolIcon;
    // @ts-ignore
    const __VLS_299 = __VLS_asFunctionalComponent1(__VLS_298, new __VLS_298({
        type: "MCP",
        ...{ class: "mr-8" },
        size: (20),
    }));
    const __VLS_300 = __VLS_299({
        type: "MCP",
        ...{ class: "mr-8" },
        size: (20),
    }, ...__VLS_functionalComponentArgsRest(__VLS_299));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.$t('common.custom') + ' MCP');
    let __VLS_303;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_304 = __VLS_asFunctionalComponent1(__VLS_303, new __VLS_303({
        ...{ 'onClick': {} },
        text: true,
    }));
    const __VLS_305 = __VLS_304({
        ...{ 'onClick': {} },
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_304));
    let __VLS_308;
    const __VLS_309 = {
        /** @type {typeof __VLS_308.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.chat_data.mcp_servers && __VLS_ctx.chat_data.mcp_servers.length > 0 && __VLS_ctx.collapseData.MCP))
                throw 0;
            return __VLS_ctx.chat_data.mcp_servers = '';
            // @ts-ignore
            [$t, chat_data, chat_data, chat_data, collapseData,];
        },
    };
    const { default: __VLS_310 } = __VLS_306.slots;
    let __VLS_311;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_312 = __VLS_asFunctionalComponent1(__VLS_311, new __VLS_311({}));
    const __VLS_313 = __VLS_312({}, ...__VLS_functionalComponentArgsRest(__VLS_312));
    const { default: __VLS_316 } = __VLS_314.slots;
    let __VLS_317;
    /** @ts-ignore @type { | typeof __VLS_components.Close} */
    Close;
    // @ts-ignore
    const __VLS_318 = __VLS_asFunctionalComponent1(__VLS_317, new __VLS_317({}));
    const __VLS_319 = __VLS_318({}, ...__VLS_functionalComponentArgsRest(__VLS_318));
    // @ts-ignore
    [];
    var __VLS_314;
    // @ts-ignore
    [];
    var __VLS_306;
    var __VLS_307;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.collapseData.tool = !__VLS_ctx.collapseData.tool;
            // @ts-ignore
            [collapseData, collapseData,];
        } },
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center lighter cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
let __VLS_322;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_323 = __VLS_asFunctionalComponent1(__VLS_322, new __VLS_322({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.tool ? 'rotate-90' : '') },
}));
const __VLS_324 = __VLS_323({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.tool ? 'rotate-90' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_323));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_327 } = __VLS_325.slots;
let __VLS_328;
/** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
CaretRight;
// @ts-ignore
const __VLS_329 = __VLS_asFunctionalComponent1(__VLS_328, new __VLS_328({}));
const __VLS_330 = __VLS_329({}, ...__VLS_functionalComponentArgsRest(__VLS_329));
// @ts-ignore
[collapseData,];
var __VLS_325;
(__VLS_ctx.$t('views.tool.title'));
if (__VLS_ctx.chat_data.tool_ids?.filter((id) => __VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, id, 'id'))?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.chat_data.tool_ids?.filter((id) => __VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, id, 'id'))?.length);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_333;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_334 = __VLS_asFunctionalComponent1(__VLS_333, new __VLS_333({
    ...{ 'onClick': {} },
    ...{ 'onRefreshForm': {} },
    type: "primary",
    link: true,
}));
const __VLS_335 = __VLS_334({
    ...{ 'onClick': {} },
    ...{ 'onRefreshForm': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_334));
let __VLS_338;
const __VLS_339 = {
    /** @type {typeof __VLS_338.click} */
    onClick: (__VLS_ctx.openToolDialog),
};
const __VLS_340 = {
    /** @type {typeof __VLS_338.refreshForm} */
    onRefreshForm: (__VLS_ctx.refreshParam),
};
const { default: __VLS_341 } = __VLS_336.slots;
let __VLS_342;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_343 = __VLS_asFunctionalComponent1(__VLS_342, new __VLS_342({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_344 = __VLS_343({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_343));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
// @ts-ignore
[$t, chat_data, chat_data, refreshParam, relatedObject, relatedObject, toolSelectOptions, toolSelectOptions, openToolDialog,];
var __VLS_336;
var __VLS_337;
if (__VLS_ctx.chat_data.tool_ids?.length > 0 && __VLS_ctx.collapseData.tool) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.tool_ids))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        if (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.icon) {
                let __VLS_347;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_348 = __VLS_asFunctionalComponent1(__VLS_347, new __VLS_347({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_349 = __VLS_348({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_348));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_352 } = __VLS_350.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [chat_data, chat_data, collapseData, relatedObject, relatedObject, relatedObject, resetUrl, toolSelectOptions, toolSelectOptions, toolSelectOptions,];
                var __VLS_350;
            }
            else {
                let __VLS_353;
                /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                ToolIcon;
                // @ts-ignore
                const __VLS_354 = __VLS_asFunctionalComponent1(__VLS_353, new __VLS_353({
                    ...{ class: "mr-8" },
                    size: (20),
                    type: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.tool_type)),
                    ...{ style: {} },
                }));
                const __VLS_355 = __VLS_354({
                    ...{ class: "mr-8" },
                    size: (20),
                    type: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.tool_type)),
                    ...{ style: {} },
                }, ...__VLS_functionalComponentArgsRest(__VLS_354));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis" },
                title: (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.name);
            let __VLS_358;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_359 = __VLS_asFunctionalComponent1(__VLS_358, new __VLS_358({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_360 = __VLS_359({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_359));
            let __VLS_363;
            const __VLS_364 = {
                /** @type {typeof __VLS_363.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.chat_data.tool_ids?.length > 0 && __VLS_ctx.collapseData.tool))
                        throw 0;
                    if (!(__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')))
                        throw 0;
                    return __VLS_ctx.removeTool(item);
                    // @ts-ignore
                    [relatedObject, relatedObject, relatedObject, resetUrl, toolSelectOptions, toolSelectOptions, toolSelectOptions, removeTool,];
                },
            };
            const { default: __VLS_365 } = __VLS_361.slots;
            let __VLS_366;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_367 = __VLS_asFunctionalComponent1(__VLS_366, new __VLS_366({}));
            const __VLS_368 = __VLS_367({}, ...__VLS_functionalComponentArgsRest(__VLS_367));
            const { default: __VLS_371 } = __VLS_369.slots;
            let __VLS_372;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_373 = __VLS_asFunctionalComponent1(__VLS_372, new __VLS_372({}));
            const __VLS_374 = __VLS_373({}, ...__VLS_functionalComponentArgsRest(__VLS_373));
            // @ts-ignore
            [];
            var __VLS_369;
            // @ts-ignore
            [];
            var __VLS_361;
            var __VLS_362;
        }
        // @ts-ignore
        [];
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.collapseData.skill = !__VLS_ctx.collapseData.skill;
            // @ts-ignore
            [collapseData, collapseData,];
        } },
    ...{ class: "flex-between mb-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center lighter cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
let __VLS_377;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_378 = __VLS_asFunctionalComponent1(__VLS_377, new __VLS_377({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.skill ? 'rotate-90' : '') },
}));
const __VLS_379 = __VLS_378({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.skill ? 'rotate-90' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_378));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_382 } = __VLS_380.slots;
let __VLS_383;
/** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
CaretRight;
// @ts-ignore
const __VLS_384 = __VLS_asFunctionalComponent1(__VLS_383, new __VLS_383({}));
const __VLS_385 = __VLS_384({}, ...__VLS_functionalComponentArgsRest(__VLS_384));
// @ts-ignore
[collapseData,];
var __VLS_380;
if (__VLS_ctx.chat_data.skill_tool_ids?.filter((id) => __VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, id, 'id'))?.length) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.chat_data.skill_tool_ids?.filter((id) => __VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, id, 'id'))?.length);
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
let __VLS_388;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_389 = __VLS_asFunctionalComponent1(__VLS_388, new __VLS_388({
    ...{ 'onClick': {} },
    ...{ 'onRefreshForm': {} },
    type: "primary",
    link: true,
}));
const __VLS_390 = __VLS_389({
    ...{ 'onClick': {} },
    ...{ 'onRefreshForm': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_389));
let __VLS_393;
const __VLS_394 = {
    /** @type {typeof __VLS_393.click} */
    onClick: (__VLS_ctx.openSkillToolDialog),
};
const __VLS_395 = {
    /** @type {typeof __VLS_393.refreshForm} */
    onRefreshForm: (__VLS_ctx.refreshParam),
};
const { default: __VLS_396 } = __VLS_391.slots;
let __VLS_397;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_398 = __VLS_asFunctionalComponent1(__VLS_397, new __VLS_397({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}));
const __VLS_399 = __VLS_398({
    iconName: "app-add-outlined",
    ...{ class: "mr-4" },
}, ...__VLS_functionalComponentArgsRest(__VLS_398));
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
// @ts-ignore
[chat_data, chat_data, refreshParam, relatedObject, relatedObject, skillToolSelectOptions, skillToolSelectOptions, openSkillToolDialog,];
var __VLS_391;
var __VLS_392;
if (__VLS_ctx.chat_data.skill_tool_ids?.length > 0 && __VLS_ctx.collapseData.skill) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.skill_tool_ids))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex-between border border-r-6 white-bg mb-4" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
        /** @type {__VLS_StyleScopedClasses['border']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.icon) {
            let __VLS_402;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_403 = __VLS_asFunctionalComponent1(__VLS_402, new __VLS_402({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_404 = __VLS_403({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_403));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_407 } = __VLS_405.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.icon)),
                alt: "",
            });
            // @ts-ignore
            [chat_data, chat_data, collapseData, relatedObject, relatedObject, resetUrl, skillToolSelectOptions, skillToolSelectOptions,];
            var __VLS_405;
        }
        else {
            let __VLS_408;
            /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
            ToolIcon;
            // @ts-ignore
            const __VLS_409 = __VLS_asFunctionalComponent1(__VLS_408, new __VLS_408({
                ...{ class: "mr-8" },
                size: (20),
                type: "SKILL",
                ...{ style: {} },
            }));
            const __VLS_410 = __VLS_409({
                ...{ class: "mr-8" },
                size: (20),
                type: "SKILL",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_409));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ellipsis" },
            title: (__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.name),
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.name);
        let __VLS_413;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_414 = __VLS_asFunctionalComponent1(__VLS_413, new __VLS_413({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_415 = __VLS_414({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_414));
        let __VLS_418;
        const __VLS_419 = {
            /** @type {typeof __VLS_418.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.chat_data.skill_tool_ids?.length > 0 && __VLS_ctx.collapseData.skill))
                    throw 0;
                return __VLS_ctx.removeSkillTool(item);
                // @ts-ignore
                [relatedObject, relatedObject, skillToolSelectOptions, skillToolSelectOptions, removeSkillTool,];
            },
        };
        const { default: __VLS_420 } = __VLS_416.slots;
        let __VLS_421;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_422 = __VLS_asFunctionalComponent1(__VLS_421, new __VLS_421({}));
        const __VLS_423 = __VLS_422({}, ...__VLS_functionalComponentArgsRest(__VLS_422));
        const { default: __VLS_426 } = __VLS_424.slots;
        let __VLS_427;
        /** @ts-ignore @type { | typeof __VLS_components.Close} */
        Close;
        // @ts-ignore
        const __VLS_428 = __VLS_asFunctionalComponent1(__VLS_427, new __VLS_427({}));
        const __VLS_429 = __VLS_428({}, ...__VLS_functionalComponentArgsRest(__VLS_428));
        // @ts-ignore
        [];
        var __VLS_424;
        // @ts-ignore
        [];
        var __VLS_416;
        var __VLS_417;
        // @ts-ignore
        [];
    }
}
if (__VLS_ctx.apiType !== 'systemShare') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.apiType !== 'systemShare'))
                    throw 0;
                return __VLS_ctx.collapseData.agent = !__VLS_ctx.collapseData.agent;
                // @ts-ignore
                [collapseData, collapseData, apiType,];
            } },
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center lighter cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    let __VLS_432;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_433 = __VLS_asFunctionalComponent1(__VLS_432, new __VLS_432({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.agent ? 'rotate-90' : '') },
    }));
    const __VLS_434 = __VLS_433({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.agent ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_433));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_437 } = __VLS_435.slots;
    let __VLS_438;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_439 = __VLS_asFunctionalComponent1(__VLS_438, new __VLS_438({}));
    const __VLS_440 = __VLS_439({}, ...__VLS_functionalComponentArgsRest(__VLS_439));
    // @ts-ignore
    [collapseData,];
    var __VLS_435;
    (__VLS_ctx.$t('views.application.title'));
    if (__VLS_ctx.chat_data.application_ids?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.chat_data.application_ids?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_443;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_444 = __VLS_asFunctionalComponent1(__VLS_443, new __VLS_443({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_445 = __VLS_444({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_444));
    let __VLS_448;
    const __VLS_449 = {
        /** @type {typeof __VLS_448.click} */
        onClick: (__VLS_ctx.openApplicationDialog),
    };
    const __VLS_450 = {
        /** @type {typeof __VLS_448.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_451 } = __VLS_446.slots;
    let __VLS_452;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent1(__VLS_452, new __VLS_452({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_454 = __VLS_453({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [$t, chat_data, chat_data, refreshParam, openApplicationDialog,];
    var __VLS_446;
    var __VLS_447;
    if (__VLS_ctx.chat_data.application_ids?.length && __VLS_ctx.collapseData.agent) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full mt-8" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.chat_data.application_ids))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between border border-r-6 white-bg mb-4" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            /** @type {__VLS_StyleScopedClasses['border']} */ ;
            /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
                ...{ style: {} },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.icon) {
                let __VLS_457;
                /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                elAvatar;
                // @ts-ignore
                const __VLS_458 = __VLS_asFunctionalComponent1(__VLS_457, new __VLS_457({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }));
                const __VLS_459 = __VLS_458({
                    shape: "square",
                    size: (20),
                    ...{ style: {} },
                    ...{ class: "mr-8" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_458));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                const { default: __VLS_462 } = __VLS_460.slots;
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.icon)),
                    alt: "",
                });
                // @ts-ignore
                [chat_data, chat_data, collapseData, relatedObject, relatedObject, resetUrl, applicationSelectOptions, applicationSelectOptions,];
                var __VLS_460;
            }
            else {
                let __VLS_463;
                /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                AppIcon;
                // @ts-ignore
                const __VLS_464 = __VLS_asFunctionalComponent1(__VLS_463, new __VLS_463({
                    ...{ class: "mr-8" },
                    size: (20),
                }));
                const __VLS_465 = __VLS_464({
                    ...{ class: "mr-8" },
                    size: (20),
                }, ...__VLS_functionalComponentArgsRest(__VLS_464));
                /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            }
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ellipsis" },
                title: (__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            (__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.name);
            let __VLS_468;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_469 = __VLS_asFunctionalComponent1(__VLS_468, new __VLS_468({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_470 = __VLS_469({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_469));
            let __VLS_473;
            const __VLS_474 = {
                /** @type {typeof __VLS_473.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.apiType !== 'systemShare'))
                        throw 0;
                    if (!(__VLS_ctx.chat_data.application_ids?.length && __VLS_ctx.collapseData.agent))
                        throw 0;
                    return __VLS_ctx.removeApplication(item);
                    // @ts-ignore
                    [relatedObject, relatedObject, applicationSelectOptions, applicationSelectOptions, removeApplication,];
                },
            };
            const { default: __VLS_475 } = __VLS_471.slots;
            let __VLS_476;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_477 = __VLS_asFunctionalComponent1(__VLS_476, new __VLS_476({}));
            const __VLS_478 = __VLS_477({}, ...__VLS_functionalComponentArgsRest(__VLS_477));
            const { default: __VLS_481 } = __VLS_479.slots;
            let __VLS_482;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_483 = __VLS_asFunctionalComponent1(__VLS_482, new __VLS_482({}));
            const __VLS_484 = __VLS_483({}, ...__VLS_functionalComponentArgsRest(__VLS_483));
            // @ts-ignore
            [];
            var __VLS_479;
            // @ts-ignore
            [];
            var __VLS_471;
            var __VLS_472;
            // @ts-ignore
            [];
        }
    }
}
// @ts-ignore
[];
var __VLS_240;
let __VLS_487;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_488 = __VLS_asFunctionalComponent1(__VLS_487, new __VLS_487({
    ...{ 'onClick': {} },
}));
const __VLS_489 = __VLS_488({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_488));
let __VLS_492;
const __VLS_493 = {
    /** @type {typeof __VLS_492.click} */
    onClick: () => { },
};
const { default: __VLS_494 } = __VLS_490.slots;
{
    const { label: __VLS_495 } = __VLS_490.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.reasoningContent.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.chat_data.model_setting.reasoning_content_enable) {
        let __VLS_496;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_497 = __VLS_asFunctionalComponent1(__VLS_496, new __VLS_496({
            ...{ 'onClick': {} },
            ...{ 'onRefreshForm': {} },
            type: "primary",
            link: true,
            ...{ class: "mr-4" },
        }));
        const __VLS_498 = __VLS_497({
            ...{ 'onClick': {} },
            ...{ 'onRefreshForm': {} },
            type: "primary",
            link: true,
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_497));
        let __VLS_501;
        const __VLS_502 = {
            /** @type {typeof __VLS_501.click} */
            onClick: (__VLS_ctx.openReasoningParamSettingDialog),
        };
        const __VLS_503 = {
            /** @type {typeof __VLS_501.refreshForm} */
            onRefreshForm: (__VLS_ctx.refreshParam),
        };
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        const { default: __VLS_504 } = __VLS_499.slots;
        let __VLS_505;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_506 = __VLS_asFunctionalComponent1(__VLS_505, new __VLS_505({
            iconName: "app-setting",
        }));
        const __VLS_507 = __VLS_506({
            iconName: "app-setting",
        }, ...__VLS_functionalComponentArgsRest(__VLS_506));
        // @ts-ignore
        [$t, chat_data, refreshParam, openReasoningParamSettingDialog,];
        var __VLS_499;
        var __VLS_500;
    }
    let __VLS_510;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent1(__VLS_510, new __VLS_510({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.model_setting.reasoning_content_enable),
    }));
    const __VLS_512 = __VLS_511({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.model_setting.reasoning_content_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_511));
    // @ts-ignore
    [chat_data,];
}
// @ts-ignore
[];
var __VLS_490;
var __VLS_491;
if ([
    __VLS_ctx.WorkflowMode.Application,
    __VLS_ctx.WorkflowMode.ApplicationLoop,
    __VLS_ctx.WorkflowMode.Tool,
    __VLS_ctx.WorkflowMode.ToolLoop,
].includes(__VLS_ctx.workflowMode)) {
    let __VLS_515;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_516 = __VLS_asFunctionalComponent1(__VLS_515, new __VLS_515({
        ...{ 'onClick': {} },
    }));
    const __VLS_517 = __VLS_516({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_516));
    let __VLS_520;
    const __VLS_521 = {
        /** @type {typeof __VLS_520.click} */
        onClick: () => { },
    };
    const { default: __VLS_522 } = __VLS_518.slots;
    {
        const { label: __VLS_523 } = __VLS_518.slots;
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
        let __VLS_524;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_525 = __VLS_asFunctionalComponent1(__VLS_524, new __VLS_524({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }));
        const __VLS_526 = __VLS_525({
            effect: "dark",
            placement: "right",
            popperClass: "max-w-200",
        }, ...__VLS_functionalComponentArgsRest(__VLS_525));
        const { default: __VLS_529 } = __VLS_527.slots;
        {
            const { content: __VLS_530 } = __VLS_527.slots;
            (__VLS_ctx.$t('workflow.nodes.aiChatNode.returnContent.tooltip'));
            // @ts-ignore
            [$t, $t, WorkflowMode, WorkflowMode, WorkflowMode, WorkflowMode, workflowMode,];
        }
        let __VLS_531;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_532 = __VLS_asFunctionalComponent1(__VLS_531, new __VLS_531({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }));
        const __VLS_533 = __VLS_532({
            iconName: "app-warning",
            ...{ class: "app-warning-icon" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_532));
        /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
        // @ts-ignore
        [];
        var __VLS_527;
        // @ts-ignore
        [];
    }
    let __VLS_536;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_537 = __VLS_asFunctionalComponent1(__VLS_536, new __VLS_536({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.is_result),
    }));
    const __VLS_538 = __VLS_537({
        size: "small",
        modelValue: (__VLS_ctx.chat_data.is_result),
    }, ...__VLS_functionalComponentArgsRest(__VLS_537));
    // @ts-ignore
    [chat_data,];
    var __VLS_518;
    var __VLS_519;
}
// @ts-ignore
[];
var __VLS_16;
var __VLS_17;
// @ts-ignore
[];
var __VLS_10;
const __VLS_541 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_542 = __VLS_asFunctionalComponent1(__VLS_541, new __VLS_541({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_543 = __VLS_542({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_542));
let __VLS_546;
const __VLS_547 = {
    /** @type {typeof __VLS_546.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_548;
var __VLS_544;
var __VLS_545;
const __VLS_550 = GeneratePromptDialog;
// @ts-ignore
const __VLS_551 = __VLS_asFunctionalComponent1(__VLS_550, new __VLS_550({
    ...{ 'onReplace': {} },
    ref: "GeneratePromptDialogRef",
}));
const __VLS_552 = __VLS_551({
    ...{ 'onReplace': {} },
    ref: "GeneratePromptDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_551));
let __VLS_555;
const __VLS_556 = {
    /** @type {typeof __VLS_555.replace} */
    onReplace: (__VLS_ctx.replace),
};
var __VLS_557;
var __VLS_553;
var __VLS_554;
const __VLS_559 = ReasoningParamSettingDialog;
// @ts-ignore
const __VLS_560 = __VLS_asFunctionalComponent1(__VLS_559, new __VLS_559({
    ...{ 'onRefresh': {} },
    ref: "ReasoningParamSettingDialogRef",
}));
const __VLS_561 = __VLS_560({
    ...{ 'onRefresh': {} },
    ref: "ReasoningParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_560));
let __VLS_564;
const __VLS_565 = {
    /** @type {typeof __VLS_564.refresh} */
    onRefresh: (__VLS_ctx.submitReasoningDialog),
};
var __VLS_566;
var __VLS_562;
var __VLS_563;
const __VLS_568 = McpServersDialog;
// @ts-ignore
const __VLS_569 = __VLS_asFunctionalComponent1(__VLS_568, new __VLS_568({
    ...{ 'onRefresh': {} },
    ref: "mcpServersDialogRef",
}));
const __VLS_570 = __VLS_569({
    ...{ 'onRefresh': {} },
    ref: "mcpServersDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_569));
let __VLS_573;
const __VLS_574 = {
    /** @type {typeof __VLS_573.refresh} */
    onRefresh: (__VLS_ctx.submitMcpServersDialog),
};
var __VLS_575;
var __VLS_571;
var __VLS_572;
const __VLS_577 = ToolDialog;
// @ts-ignore
const __VLS_578 = __VLS_asFunctionalComponent1(__VLS_577, new __VLS_577({
    ...{ 'onRefresh': {} },
    ref: "toolDialogRef",
    tool_type: "CUSTOM,WORKFLOW",
}));
const __VLS_579 = __VLS_578({
    ...{ 'onRefresh': {} },
    ref: "toolDialogRef",
    tool_type: "CUSTOM,WORKFLOW",
}, ...__VLS_functionalComponentArgsRest(__VLS_578));
let __VLS_582;
const __VLS_583 = {
    /** @type {typeof __VLS_582.refresh} */
    onRefresh: (__VLS_ctx.submitToolDialog),
};
var __VLS_584;
var __VLS_580;
var __VLS_581;
const __VLS_586 = ToolDialog;
// @ts-ignore
const __VLS_587 = __VLS_asFunctionalComponent1(__VLS_586, new __VLS_586({
    ...{ 'onRefresh': {} },
    ref: "skillToolDialogRef",
    tool_type: "SKILL",
}));
const __VLS_588 = __VLS_587({
    ...{ 'onRefresh': {} },
    ref: "skillToolDialogRef",
    tool_type: "SKILL",
}, ...__VLS_functionalComponentArgsRest(__VLS_587));
let __VLS_591;
const __VLS_592 = {
    /** @type {typeof __VLS_591.refresh} */
    onRefresh: (__VLS_ctx.submitSkillToolDialog),
};
var __VLS_593;
var __VLS_589;
var __VLS_590;
const __VLS_595 = ApplicationDialog;
// @ts-ignore
const __VLS_596 = __VLS_asFunctionalComponent1(__VLS_595, new __VLS_595({
    ...{ 'onRefresh': {} },
    ref: "applicationDialogRef",
}));
const __VLS_597 = __VLS_596({
    ...{ 'onRefresh': {} },
    ref: "applicationDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_596));
let __VLS_600;
const __VLS_601 = {
    /** @type {typeof __VLS_600.refresh} */
    onRefresh: (__VLS_ctx.submitApplicationDialog),
};
var __VLS_602;
var __VLS_598;
var __VLS_599;
// @ts-ignore
[refreshParam, replace, submitReasoningDialog, submitMcpServersDialog, submitToolDialog, submitSkillToolDialog, submitApplicationDialog,];
var __VLS_3;
// @ts-ignore
var __VLS_21 = __VLS_20, __VLS_83 = __VLS_82, __VLS_206 = __VLS_205, __VLS_231 = __VLS_230, __VLS_549 = __VLS_548, __VLS_558 = __VLS_557, __VLS_567 = __VLS_566, __VLS_576 = __VLS_575, __VLS_585 = __VLS_584, __VLS_594 = __VLS_593, __VLS_603 = __VLS_602;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
