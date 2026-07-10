/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { reactive, ref, onMounted, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { groupBy } from 'lodash';
import AIModeParamSettingDialog from './component/AIModeParamSettingDialog.vue';
import GeneratePromptDialog from './component/GeneratePromptDialog.vue';
import ParamSettingDialog from './component/ParamSettingDialog.vue';
import AddKnowledgeDialog from './component/AddKnowledgeDialog.vue';
import { relatedObject } from '@/utils/array';
import { MsgSuccess } from '@/utils/message';
import { t } from '@/locales';
import TTSModeParamSettingDialog from './component/TTSModeParamSettingDialog.vue';
import STTModeParamSettingDialog from './component/STTModelParamSettingDialog.vue';
import ReasoningParamSettingDialog from './component/ReasoningParamSettingDialog.vue';
import permissionMap from '@/permission';
import { EditionConst } from '@/utils/permission/data';
import { hasPermission } from '@/utils/permission/index';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { resetUrl } from '@/utils/common';
import McpServersDialog from '@/views/application/component/McpServersDialog.vue';
import ToolDialog from '@/views/application/component/ToolDialog.vue';
import ApplicationDialog from '@/views/application/component/ApplicationDialog.vue';
import useStore from '@/stores';
import LongTermSettingDialog from '@/views/application/component/LongTermSettingDialog.vue';
import IconUploader from '@/views/application/component/IconUploader.vue';
const route = useRoute();
const router = useRouter();
const { params: { id }, } = route;
const { user, folder } = useStore();
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap['application'][apiType.value];
});
const toolPermissionPrecise = computed(() => {
    return permissionMap['tool'][apiType.value];
});
const defaultPrompt = t('views.application.form.prompt.defaultPrompt', {
    data: '{data}',
    question: '{question}',
});
const optimizationPrompt = t('views.application.dialog.defaultPrompt1', {
    question: '{question}',
}) +
    '<data></data>' +
    t('views.application.dialog.defaultPrompt2');
const longTermPrompt = t('views.application.longTermMemory.tips1') +
    '{memory}' +
    t('views.application.longTermMemory.tips2');
const collapseData = reactive({
    prompt: true,
    knowledge_setting: true,
    MCP: true,
    tool: true,
    skill: true,
    agent: true,
});
const AIModeParamSettingDialogRef = ref();
const LongTermModeParamSettingDialogRef = ref();
const LongTermSettingDialogRef = ref();
const ReasoningParamSettingDialogRef = ref();
const TTSModeParamSettingDialogRef = ref();
const STTModeParamSettingDialogRef = ref();
const ParamSettingDialogRef = ref();
const GeneratePromptDialogRef = ref();
const applicationFormRef = ref();
const AddKnowledgeDialogRef = ref();
const loading = ref(false);
const knowledgeLoading = ref(false);
const applicationForm = ref({
    name: '',
    desc: '',
    model_id: '',
    dialogue_number: 1,
    prologue: t('views.application.form.defaultPrologue'),
    knowledge_id_list: [],
    knowledge_setting: {
        top_n: 3,
        similarity: 0.6,
        max_paragraph_char_number: 5000,
        search_mode: 'embedding',
        no_references_setting: {
            status: 'ai_questioning',
            value: '{question}',
        },
    },
    model_setting: {
        prompt: defaultPrompt,
        system: '',
        no_references_prompt: '{question}',
        reasoning_content_enable: false,
    },
    model_params_setting: {},
    problem_optimization: false,
    problem_optimization_prompt: optimizationPrompt,
    stt_model_id: '',
    tts_model_id: '',
    stt_model_enable: false,
    tts_model_enable: false,
    tts_type: 'BROWSER',
    type: 'SIMPLE',
    application_enable: true,
    application_ids: [],
    mcp_enable: true,
    mcp_tool_ids: [],
    mcp_servers: '',
    mcp_source: 'referencing',
    tool_enable: true,
    tool_ids: [],
    skill_tool_ids: [],
    mcp_output_enable: false,
    long_term_enable: false,
    long_term_model_id: '',
    long_term_model_params_setting: {},
    long_term_trigger_setting: { rounds: 10 },
    long_term_trigger_type: 'ROUND',
    user_avatar: '',
});
const rules = reactive({
    name: [
        {
            required: true,
            message: t('views.application.form.appName.placeholder'),
            trigger: 'blur',
        },
    ],
});
const modelOptions = ref(null);
const knowledgeList = ref([]);
const sttModelOptions = ref(null);
const ttsModelOptions = ref(null);
function submitPrologueDialog(val) {
    applicationForm.value.prologue = val;
}
function submitPromptDialog(val) {
    applicationForm.value.model_setting.prompt = val;
}
function submitNoReferencesPromptDialog(val) {
    applicationForm.value.model_setting.no_references_prompt = val;
}
function submitSystemDialog(val) {
    applicationForm.value.model_setting.system = val;
}
function submitReasoningDialog(val) {
    applicationForm.value.model_setting = {
        ...applicationForm.value.model_setting,
        ...val,
    };
}
const publish = (formEl) => {
    if (!formEl)
        return;
    formEl.validate().then(() => {
        return loadSharedApi({ type: 'application', systemType: apiType.value })
            .putApplication(id, applicationForm.value, loading)
            .then(() => {
            return loadSharedApi({ type: 'application', systemType: apiType.value }).publish(id, {}, loading);
        })
            .then(() => {
            MsgSuccess(t('views.application.tip.publishSuccess'));
        });
    });
};
const submit = async (formEl) => {
    if (!formEl)
        return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            loadSharedApi({ type: 'application', systemType: apiType.value })
                .putApplication(id, applicationForm.value, loading)
                .then(() => {
                MsgSuccess(t('common.saveSuccess'));
            });
        }
    });
};
const model_change = (model_id) => {
    applicationForm.value.model_id = model_id;
    if (model_id) {
        AIModeParamSettingDialogRef.value?.reset_default(model_id, id);
    }
    else {
        refreshForm({});
    }
};
const long_term_model_change = (model_id) => {
    applicationForm.value.long_term_model_id = model_id;
    if (model_id) {
        LongTermModeParamSettingDialogRef.value?.reset_default(model_id, id);
    }
    else {
        refreshLongTermForm({});
    }
};
const openAIParamSettingDialog = () => {
    if (applicationForm.value.model_id) {
        AIModeParamSettingDialogRef.value?.open(applicationForm.value.model_id, id, applicationForm.value.model_params_setting);
    }
};
const openLongTermParamSettingDialog = () => {
    if (applicationForm.value.long_term_model_id) {
        LongTermModeParamSettingDialogRef.value?.open(applicationForm.value.long_term_model_id, id, applicationForm.value.long_term_model_params_setting);
    }
};
const openGeneratePromptDialog = () => {
    if (applicationForm.value.model_id) {
        GeneratePromptDialogRef.value?.open(applicationForm.value.model_id, id);
    }
};
const replace = (v) => {
    applicationForm.value.model_setting.system = v;
};
const openReasoningParamSettingDialog = () => {
    ReasoningParamSettingDialogRef.value?.open(applicationForm.value.model_setting);
};
const openTTSParamSettingDialog = () => {
    if (applicationForm.value.tts_model_id) {
        TTSModeParamSettingDialogRef.value?.open(applicationForm.value.tts_model_id, id, applicationForm.value.tts_model_params_setting);
    }
};
const openSTTParamSettingDialog = () => {
    if (applicationForm.value.stt_model_id) {
        STTModeParamSettingDialogRef.value?.open(applicationForm.value.stt_model_id, id, applicationForm.value.stt_model_params_setting);
    }
};
const openParamSettingDialog = () => {
    ParamSettingDialogRef.value?.open(applicationForm.value);
};
function openLongTermConfigDialog() {
    LongTermSettingDialogRef.value?.open(applicationForm.value.long_term_trigger_type, applicationForm.value.long_term_trigger_setting);
}
function switchLongTerm() {
    if (applicationForm.value.long_term_enable) {
        applicationForm.value.model_setting.system = applicationForm.value.model_setting.system;
    }
}
function submitLongTermSettingDialog(data) {
    applicationForm.value.long_term_trigger_type = data.trigger_type;
    applicationForm.value.long_term_trigger_setting = data.trigger_setting;
}
function removeTool(id) {
    if (applicationForm.value.tool_ids) {
        applicationForm.value.tool_ids = applicationForm.value.tool_ids.filter((v) => v !== id);
    }
}
function removeMcpTool(id) {
    if (applicationForm.value.mcp_tool_ids) {
        applicationForm.value.mcp_tool_ids = applicationForm.value.mcp_tool_ids.filter((v) => v !== id);
    }
}
function removeSkillTool(id) {
    if (applicationForm.value.skill_tool_ids) {
        applicationForm.value.skill_tool_ids = applicationForm.value.skill_tool_ids.filter((v) => v !== id);
    }
}
function removeApplication(id) {
    if (applicationForm.value.application_ids) {
        applicationForm.value.application_ids = applicationForm.value.application_ids.filter((v) => v !== id);
    }
}
const mcpServersDialogRef = ref();
function openMcpServersDialog() {
    const config = {
        mcp_servers: applicationForm.value.mcp_servers,
        mcp_tool_ids: applicationForm.value.mcp_tool_ids,
        mcp_source: applicationForm.value.mcp_source,
    };
    mcpServersDialogRef.value.open(config, mcpToolSelectOptions.value);
}
function submitMcpServersDialog(config) {
    applicationForm.value.mcp_servers = config.mcp_servers;
    applicationForm.value.mcp_tool_ids = config.mcp_tool_ids;
    applicationForm.value.mcp_source = config.mcp_source;
    collapseData.MCP = true;
}
const toolDialogRef = ref();
function openToolDialog() {
    toolDialogRef.value.open(applicationForm.value.tool_ids);
}
function submitToolDialog(config) {
    applicationForm.value.tool_ids = config.tool_ids;
    collapseData.tool = true;
}
const applicationDialogRef = ref();
function openApplicationDialog() {
    applicationDialogRef.value.open(applicationForm.value.application_ids);
}
function submitApplicationDialog(config) {
    applicationForm.value.application_ids = config.application_ids;
    collapseData.agent = true;
}
const applicationSelectOptions = ref([]);
function getApplicationSelectOptions() {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getAllApplication({ folder_id: folder.currentFolder?.id || user.getWorkspaceId() })
        .then((res) => {
        applicationSelectOptions.value = res.data.filter((item) => item.is_publish);
    });
}
const toolSelectOptions = ref([]);
function getToolSelectOptions() {
    const obj = apiType.value === 'systemManage'
        ? {
            scope: 'WORKSPACE',
            tool_type_list: ['CUSTOM', 'WORKFLOW'],
            workspace_id: applicationForm.value?.workspace_id,
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
            workspace_id: applicationForm.value?.workspace_id,
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
const skillToolDialogRef = ref();
function openSkillToolDialog() {
    skillToolDialogRef.value.open(applicationForm.value.skill_tool_ids);
}
function submitSkillToolDialog(config) {
    applicationForm.value.skill_tool_ids = config.tool_ids;
    collapseData.skill = true;
}
const skillToolSelectOptions = ref([]);
function getSkillToolSelectOptions() {
    const obj = apiType.value === 'systemManage'
        ? {
            scope: 'WORKSPACE',
            tool_type: 'SKILL',
            workspace_id: applicationForm.value?.workspace_id,
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
function refreshParam(data) {
    applicationForm.value = { ...applicationForm.value, ...data };
}
function refreshForm(data) {
    applicationForm.value.model_params_setting = data;
}
function refreshTTSForm(data) {
    applicationForm.value.tts_model_params_setting = data;
}
function refreshSTTForm(data) {
    applicationForm.value.stt_model_params_setting = data;
}
function refreshLongTermForm(data) {
    applicationForm.value.long_term_model_params_setting = data;
}
function removeKnowledge(id) {
    if (applicationForm.value.knowledge_id_list) {
        applicationForm.value.knowledge_id_list.splice(applicationForm.value.knowledge_id_list.indexOf(id), 1);
    }
}
function addKnowledge(val) {
    knowledgeList.value = val;
    applicationForm.value.knowledge_id_list = val.map((item) => item.id);
}
function openKnowledgeDialog() {
    AddKnowledgeDialogRef.value.open(applicationForm.value.knowledge_id_list);
}
function getDetail() {
    loadSharedApi({ type: 'application', systemType: apiType.value })
        .getApplicationDetail(id, loading)
        .then((res) => {
        applicationForm.value = res.data;
        applicationForm.value.model_id = res.data.model;
        applicationForm.value.stt_model_id = res.data.stt_model;
        applicationForm.value.tts_model_id = res.data.tts_model;
        applicationForm.value.tts_type = res.data.tts_type;
        applicationForm.value.long_term_model_id = res.data.long_term_model;
        knowledgeList.value = res.data.knowledge_list;
        applicationForm.value.model_setting.no_references_prompt =
            res.data.model_setting.no_references_prompt || '{question}';
        // EnterpriseAnd Professional
        if (hasPermission([EditionConst.IS_EE, EditionConst.IS_PE], 'OR')) {
            loadSharedApi({ type: 'application', systemType: apiType.value })
                .getApplicationSetting(id)
                .then((ok) => {
                applicationForm.value = { ...applicationForm.value, ...ok.data };
            });
        }
    });
}
function getSelectModel() {
    loading.value = true;
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'LLM',
            workspace_id: applicationForm.value?.workspace_id,
        }
        : {
            model_type: 'LLM',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
function getSTTModel() {
    loading.value = true;
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'STT',
            workspace_id: applicationForm.value?.workspace_id,
        }
        : {
            model_type: 'STT',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        sttModelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
function getTTSModel() {
    loading.value = true;
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'TTS',
            workspace_id: applicationForm.value?.workspace_id,
        }
        : {
            model_type: 'TTS',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        ttsModelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
function ttsModelChange() {
    if (applicationForm.value.tts_model_id) {
        TTSModeParamSettingDialogRef.value?.reset_default(applicationForm.value.tts_model_id, id);
    }
    else {
        refreshTTSForm({});
    }
}
function sttModelChange() {
    if (applicationForm.value.stt_model_id) {
        STTModeParamSettingDialogRef.value?.reset_default(applicationForm.value.stt_model_id, id);
    }
    else {
        refreshSTTForm({});
    }
}
function ttsModelEnableChange() {
    if (!applicationForm.value.tts_model_enable) {
        applicationForm.value.tts_model_id = undefined;
        applicationForm.value.tts_type = 'BROWSER';
    }
}
function sttModelEnableChange() {
    if (!applicationForm.value.stt_model_enable) {
        applicationForm.value.stt_model_id = undefined;
    }
}
onBeforeMount(() => {
    if (route.path.includes('WORK_FLOW')) {
        if (apiType.value == 'workspace') {
            router.push(`/application/workspace/${route.params.id}/workflow`);
        }
        else {
            router.push(`/application/resource-management/${route.params.id}/workflow`);
        }
    }
});
onMounted(() => {
    getSelectModel();
    getDetail();
    getSTTModel();
    getTTSModel();
    if (toolPermissionPrecise.value.read()) {
        getToolSelectOptions();
        getMcpToolSelectOptions();
        getApplicationSelectOptions();
        getSkillToolSelectOptions();
    }
});
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16-24 application-setting" },
});
/** @type {__VLS_StyleScopedClasses['p-16-24']} */ ;
/** @type {__VLS_StyleScopedClasses['application-setting']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full mb-16" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
(__VLS_ctx.$t('common.setting'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.permissionPrecise.edit(__VLS_ctx.id)) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    const __VLS_6 = {
        /** @type {typeof __VLS_5.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.edit(__VLS_ctx.id)))
                throw 0;
            return __VLS_ctx.submit(__VLS_ctx.applicationFormRef);
            // @ts-ignore
            [$t, permissionPrecise, id, loading, submit, applicationFormRef,];
        },
    };
    const { default: __VLS_7 } = __VLS_3.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_3;
    var __VLS_4;
}
if (__VLS_ctx.permissionPrecise.publish(__VLS_ctx.id)) {
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.permissionPrecise.publish(__VLS_ctx.id)))
                throw 0;
            return __VLS_ctx.publish(__VLS_ctx.applicationFormRef);
            // @ts-ignore
            [permissionPrecise, id, loading, applicationFormRef, publish,];
        },
    };
    const { default: __VLS_15 } = __VLS_11.slots;
    (__VLS_ctx.$t('common.publish'));
    // @ts-ignore
    [$t,];
    var __VLS_11;
    var __VLS_12;
}
let __VLS_16;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
    ...{ style: {} },
}));
const __VLS_18 = __VLS_17({
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const { default: __VLS_21 } = __VLS_19.slots;
let __VLS_22;
/** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
elRow;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
__VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
const { default: __VLS_27 } = __VLS_25.slots;
let __VLS_28;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
    span: (10),
}));
const __VLS_30 = __VLS_29({
    span: (10),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const { default: __VLS_33 } = __VLS_31.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-24 mb-16" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
(__VLS_ctx.$t('common.info'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "scrollbar-height-left" },
});
/** @type {__VLS_StyleScopedClasses['scrollbar-height-left']} */ ;
let __VLS_34;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({}));
const __VLS_36 = __VLS_35({}, ...__VLS_functionalComponentArgsRest(__VLS_35));
const { default: __VLS_39 } = __VLS_37.slots;
let __VLS_40;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
    hideRequiredAsterisk: true,
    ref: "applicationFormRef",
    model: (__VLS_ctx.applicationForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "p-24" },
    ...{ style: {} },
}));
const __VLS_42 = __VLS_41({
    hideRequiredAsterisk: true,
    ref: "applicationFormRef",
    model: (__VLS_ctx.applicationForm),
    rules: (__VLS_ctx.rules),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    ...{ class: "p-24" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_41));
var __VLS_45;
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
const { default: __VLS_47 } = __VLS_43.slots;
let __VLS_48;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
    prop: "name",
}));
const __VLS_50 = __VLS_49({
    prop: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_49));
const { default: __VLS_53 } = __VLS_51.slots;
{
    const { label: __VLS_54 } = __VLS_51.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('common.name'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    // @ts-ignore
    [$t, $t, loading, vLoading, applicationForm, rules,];
}
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.applicationForm.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}));
const __VLS_57 = __VLS_56({
    ...{ 'onBlur': {} },
    modelValue: (__VLS_ctx.applicationForm.name),
    maxlength: "64",
    placeholder: (__VLS_ctx.$t('views.application.form.appName.placeholder')),
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_60;
const __VLS_61 = {
    /** @type {typeof __VLS_60.blur} */
    onBlur: (...[$event]) => {
        return __VLS_ctx.applicationForm.name = __VLS_ctx.applicationForm.name?.trim();
        // @ts-ignore
        [$t, applicationForm, applicationForm, applicationForm,];
    },
};
var __VLS_58;
var __VLS_59;
// @ts-ignore
[];
var __VLS_51;
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
    label: (__VLS_ctx.$t('common.desc')),
}));
const __VLS_64 = __VLS_63({
    label: (__VLS_ctx.$t('common.desc')),
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
let __VLS_68;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    modelValue: (__VLS_ctx.applicationForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}));
const __VLS_70 = __VLS_69({
    modelValue: (__VLS_ctx.applicationForm.desc),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.form.appDescription.placeholder')),
    rows: (3),
    maxlength: "256",
    showWordLimit: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
// @ts-ignore
[$t, $t, applicationForm,];
var __VLS_65;
let __VLS_73;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
    label: (__VLS_ctx.$t('views.application.form.appIcon')),
}));
const __VLS_75 = __VLS_74({
    label: (__VLS_ctx.$t('views.application.form.appIcon')),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
const { default: __VLS_78 } = __VLS_76.slots;
const __VLS_79 = IconUploader;
// @ts-ignore
const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
    modelValue: (__VLS_ctx.applicationForm.icon),
    applicationId: (__VLS_ctx.id),
    shape: "square",
}));
const __VLS_81 = __VLS_80({
    modelValue: (__VLS_ctx.applicationForm.icon),
    applicationId: (__VLS_ctx.id),
    shape: "square",
}, ...__VLS_functionalComponentArgsRest(__VLS_80));
// @ts-ignore
[$t, id, applicationForm,];
var __VLS_76;
let __VLS_84;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_85 = __VLS_asFunctionalComponent1(__VLS_84, new __VLS_84({
    label: (__VLS_ctx.$t('views.application.form.userIcon')),
}));
const __VLS_86 = __VLS_85({
    label: (__VLS_ctx.$t('views.application.form.userIcon')),
}, ...__VLS_functionalComponentArgsRest(__VLS_85));
const { default: __VLS_89 } = __VLS_87.slots;
const __VLS_90 = IconUploader;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent1(__VLS_90, new __VLS_90({
    modelValue: (__VLS_ctx.applicationForm.user_avatar),
    applicationId: (__VLS_ctx.id),
    shape: "circle",
}));
const __VLS_92 = __VLS_91({
    modelValue: (__VLS_ctx.applicationForm.user_avatar),
    applicationId: (__VLS_ctx.id),
    shape: "circle",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
// @ts-ignore
[$t, id, applicationForm,];
var __VLS_87;
let __VLS_95;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
}));
const __VLS_97 = __VLS_96({
    label: (__VLS_ctx.$t('views.application.form.aiModel.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_96));
const { default: __VLS_100 } = __VLS_98.slots;
{
    const { label: __VLS_101 } = __VLS_98.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.application.form.aiModel.label'));
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.applicationForm.model_id),
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.applicationForm.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        /** @type {typeof __VLS_107.click} */
        onClick: (__VLS_ctx.openAIParamSettingDialog),
    };
    const { default: __VLS_109 } = __VLS_105.slots;
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
        iconName: "app-setting",
        ...{ class: "mr-4" },
    }));
    const __VLS_112 = __VLS_111({
        iconName: "app-setting",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_111));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('common.paramSetting'));
    // @ts-ignore
    [$t, $t, $t, applicationForm, openAIParamSettingDialog,];
    var __VLS_105;
    var __VLS_106;
    // @ts-ignore
    [];
}
let __VLS_115;
/** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
ModelSelect;
// @ts-ignore
const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
    ...{ 'onChange': {} },
    ...{ 'onSubmitModel': {} },
    modelValue: (__VLS_ctx.applicationForm.model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
    options: (__VLS_ctx.modelOptions),
    showFooter: true,
    modelType: ('LLM'),
}));
const __VLS_117 = __VLS_116({
    ...{ 'onChange': {} },
    ...{ 'onSubmitModel': {} },
    modelValue: (__VLS_ctx.applicationForm.model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
    options: (__VLS_ctx.modelOptions),
    showFooter: true,
    modelType: ('LLM'),
}, ...__VLS_functionalComponentArgsRest(__VLS_116));
let __VLS_120;
const __VLS_121 = {
    /** @type {typeof __VLS_120.change} */
    onChange: (__VLS_ctx.model_change),
};
const __VLS_122 = {
    /** @type {typeof __VLS_120.submitModel} */
    onSubmitModel: (__VLS_ctx.getSelectModel),
};
var __VLS_118;
var __VLS_119;
// @ts-ignore
[$t, applicationForm, modelOptions, model_change, getSelectModel,];
var __VLS_98;
let __VLS_123;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({}));
const __VLS_125 = __VLS_124({}, ...__VLS_functionalComponentArgsRest(__VLS_124));
const { default: __VLS_128 } = __VLS_126.slots;
{
    const { label: __VLS_129 } = __VLS_126.slots;
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
    let __VLS_130;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_131 = __VLS_asFunctionalComponent1(__VLS_130, new __VLS_130({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.roleSettings.tooltip')),
        placement: "right",
    }));
    const __VLS_132 = __VLS_131({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.roleSettings.tooltip')),
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_131));
    const { default: __VLS_135 } = __VLS_133.slots;
    let __VLS_136;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_137 = __VLS_asFunctionalComponent1(__VLS_136, new __VLS_136({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }));
    const __VLS_138 = __VLS_137({
        iconName: "app-warning",
        ...{ class: "app-warning-icon ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_137));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    // @ts-ignore
    [$t, $t,];
    var __VLS_133;
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.applicationForm.model_id),
    }));
    const __VLS_143 = __VLS_142({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        disabled: (!__VLS_ctx.applicationForm.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    let __VLS_146;
    const __VLS_147 = {
        /** @type {typeof __VLS_146.click} */
        onClick: (__VLS_ctx.openGeneratePromptDialog),
    };
    const { default: __VLS_148 } = __VLS_144.slots;
    let __VLS_149;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
        iconName: "app-generate-star",
        ...{ class: "mr-4" },
    }));
    const __VLS_151 = __VLS_150({
        iconName: "app-generate-star",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_150));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.generateDialog.label'));
    // @ts-ignore
    [$t, applicationForm, openGeneratePromptDialog,];
    var __VLS_144;
    var __VLS_145;
    // @ts-ignore
    [];
}
let __VLS_154;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.roleSettings.label')),
    modelValue: (__VLS_ctx.applicationForm.model_setting.system),
    ...{ style: {} },
    placeholder: (__VLS_ctx.$t('views.application.form.roleSettings.placeholder', {
        data: '{data}',
        question: '{question}',
        memory: '{memory}',
    })),
}));
const __VLS_156 = __VLS_155({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.roleSettings.label')),
    modelValue: (__VLS_ctx.applicationForm.model_setting.system),
    ...{ style: {} },
    placeholder: (__VLS_ctx.$t('views.application.form.roleSettings.placeholder', {
        data: '{data}',
        question: '{question}',
        memory: '{memory}',
    })),
}, ...__VLS_functionalComponentArgsRest(__VLS_155));
let __VLS_159;
const __VLS_160 = {
    /** @type {typeof __VLS_159.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitSystemDialog),
};
var __VLS_157;
var __VLS_158;
// @ts-ignore
[$t, $t, applicationForm, submitSystemDialog,];
var __VLS_126;
let __VLS_161;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent1(__VLS_161, new __VLS_161({
    prop: "model_setting.no_references_prompt",
    rules: ({
        required: __VLS_ctx.applicationForm.model_id,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}));
const __VLS_163 = __VLS_162({
    prop: "model_setting.no_references_prompt",
    rules: ({
        required: __VLS_ctx.applicationForm.model_id,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
const { default: __VLS_166 } = __VLS_164.slots;
{
    const { label: __VLS_167 } = __VLS_164.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.prompt.label') +
        __VLS_ctx.$t('views.application.form.prompt.noReferences'));
    let __VLS_168;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.prompt.tooltip')),
        placement: "right",
        popperClass: "max-w-350",
    }));
    const __VLS_170 = __VLS_169({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.prompt.tooltip')),
        placement: "right",
        popperClass: "max-w-350",
    }, ...__VLS_functionalComponentArgsRest(__VLS_169));
    const { default: __VLS_173 } = __VLS_171.slots;
    let __VLS_174;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_175 = __VLS_asFunctionalComponent1(__VLS_174, new __VLS_174({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_176 = __VLS_175({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_175));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t, $t, $t, applicationForm,];
    var __VLS_171;
    if (__VLS_ctx.applicationForm.model_id) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    }
    // @ts-ignore
    [applicationForm,];
}
let __VLS_179;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_180 = __VLS_asFunctionalComponent1(__VLS_179, new __VLS_179({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prompt.label') +
        __VLS_ctx.$t('views.application.form.prompt.noReferences')),
    modelValue: (__VLS_ctx.applicationForm.model_setting.no_references_prompt),
    ...{ style: {} },
    placeholder: (__VLS_ctx.$t('views.application.form.prompt.placeholder', {
        data: '{data}',
        question: '{question}',
    })),
}));
const __VLS_181 = __VLS_180({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prompt.label') +
        __VLS_ctx.$t('views.application.form.prompt.noReferences')),
    modelValue: (__VLS_ctx.applicationForm.model_setting.no_references_prompt),
    ...{ style: {} },
    placeholder: (__VLS_ctx.$t('views.application.form.prompt.placeholder', {
        data: '{data}',
        question: '{question}',
    })),
}, ...__VLS_functionalComponentArgsRest(__VLS_180));
let __VLS_184;
const __VLS_185 = {
    /** @type {typeof __VLS_184.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitNoReferencesPromptDialog),
};
var __VLS_182;
var __VLS_183;
// @ts-ignore
[$t, $t, $t, applicationForm, submitNoReferencesPromptDialog,];
var __VLS_164;
let __VLS_186;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_187 = __VLS_asFunctionalComponent1(__VLS_186, new __VLS_186({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.application.form.historyRecord.label')),
}));
const __VLS_188 = __VLS_187({
    ...{ 'onClick': {} },
    label: (__VLS_ctx.$t('views.application.form.historyRecord.label')),
}, ...__VLS_functionalComponentArgsRest(__VLS_187));
let __VLS_191;
const __VLS_192 = {
    /** @type {typeof __VLS_191.click} */
    onClick: () => { },
};
const { default: __VLS_193 } = __VLS_189.slots;
let __VLS_194;
/** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
elInputNumber;
// @ts-ignore
const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
    modelValue: (__VLS_ctx.applicationForm.dialogue_number),
    min: (0),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}));
const __VLS_196 = __VLS_195({
    modelValue: (__VLS_ctx.applicationForm.dialogue_number),
    min: (0),
    valueOnClear: (0),
    controlsPosition: "right",
    ...{ class: "w-full" },
    step: (1),
    stepStrictly: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_195));
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
// @ts-ignore
[$t, applicationForm,];
var __VLS_189;
var __VLS_190;
let __VLS_199;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({}));
const __VLS_201 = __VLS_200({}, ...__VLS_functionalComponentArgsRest(__VLS_200));
const { default: __VLS_204 } = __VLS_202.slots;
{
    const { label: __VLS_205 } = __VLS_202.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.longTermMemory.title'));
    let __VLS_206;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_207 = __VLS_asFunctionalComponent1(__VLS_206, new __VLS_206({
        effect: "dark",
        content: (__VLS_ctx.longTermPrompt),
        placement: "right",
        popperClass: "max-w-350",
    }));
    const __VLS_208 = __VLS_207({
        effect: "dark",
        content: (__VLS_ctx.longTermPrompt),
        placement: "right",
        popperClass: "max-w-350",
    }, ...__VLS_functionalComponentArgsRest(__VLS_207));
    const { default: __VLS_211 } = __VLS_209.slots;
    let __VLS_212;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent1(__VLS_212, new __VLS_212({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_214 = __VLS_213({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, longTermPrompt,];
    var __VLS_209;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    if (__VLS_ctx.applicationForm.long_term_enable) {
        let __VLS_217;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent1(__VLS_217, new __VLS_217({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_219 = __VLS_218({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_218));
        let __VLS_222;
        const __VLS_223 = {
            /** @type {typeof __VLS_222.click} */
            onClick: (__VLS_ctx.openLongTermConfigDialog),
        };
        const { default: __VLS_224 } = __VLS_220.slots;
        let __VLS_225;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_226 = __VLS_asFunctionalComponent1(__VLS_225, new __VLS_225({
            iconName: "app-setting",
            ...{ class: "mr-4" },
        }));
        const __VLS_227 = __VLS_226({
            iconName: "app-setting",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_226));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        // @ts-ignore
        [applicationForm, openLongTermConfigDialog,];
        var __VLS_220;
        var __VLS_221;
    }
    let __VLS_230;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_231 = __VLS_asFunctionalComponent1(__VLS_230, new __VLS_230({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.long_term_enable),
    }));
    const __VLS_232 = __VLS_231({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.long_term_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_231));
    let __VLS_235;
    const __VLS_236 = {
        /** @type {typeof __VLS_235.change} */
        onChange: (__VLS_ctx.switchLongTerm),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_233;
    var __VLS_234;
    // @ts-ignore
    [applicationForm, switchLongTerm,];
}
if (__VLS_ctx.applicationForm.long_term_enable) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    let __VLS_237;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent1(__VLS_237, new __VLS_237({
        ...{ 'onChange': {} },
        ...{ 'onSubmitModel': {} },
        modelValue: (__VLS_ctx.applicationForm.long_term_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }));
    const __VLS_239 = __VLS_238({
        ...{ 'onChange': {} },
        ...{ 'onSubmitModel': {} },
        modelValue: (__VLS_ctx.applicationForm.long_term_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    let __VLS_242;
    const __VLS_243 = {
        /** @type {typeof __VLS_242.change} */
        onChange: (__VLS_ctx.long_term_model_change),
    };
    const __VLS_244 = {
        /** @type {typeof __VLS_242.submitModel} */
        onSubmitModel: (__VLS_ctx.getSelectModel),
    };
    var __VLS_240;
    var __VLS_241;
    let __VLS_245;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        ...{ class: "ml-8" },
        disabled: (!__VLS_ctx.applicationForm.long_term_model_id),
    }));
    const __VLS_247 = __VLS_246({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        ...{ class: "ml-8" },
        disabled: (!__VLS_ctx.applicationForm.long_term_model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    let __VLS_250;
    const __VLS_251 = {
        /** @type {typeof __VLS_250.click} */
        onClick: (__VLS_ctx.openLongTermParamSettingDialog),
    };
    const __VLS_252 = {
        /** @type {typeof __VLS_250.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    const { default: __VLS_253 } = __VLS_248.slots;
    let __VLS_254;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_255 = __VLS_asFunctionalComponent1(__VLS_254, new __VLS_254({}));
    const __VLS_256 = __VLS_255({}, ...__VLS_functionalComponentArgsRest(__VLS_255));
    const { default: __VLS_259 } = __VLS_257.slots;
    let __VLS_260;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({}));
    const __VLS_262 = __VLS_261({}, ...__VLS_functionalComponentArgsRest(__VLS_261));
    // @ts-ignore
    [$t, applicationForm, applicationForm, applicationForm, modelOptions, getSelectModel, long_term_model_change, openLongTermParamSettingDialog, refreshParam,];
    var __VLS_257;
    // @ts-ignore
    [];
    var __VLS_248;
    var __VLS_249;
}
// @ts-ignore
[];
var __VLS_202;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "mb-12 lighter" },
});
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.knowledge.title'));
let __VLS_265;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}));
const __VLS_267 = __VLS_266({
    shadow: "never",
    ...{ class: "card-never" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_266));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
const { default: __VLS_270 } = __VLS_268.slots;
let __VLS_271;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_272 = __VLS_asFunctionalComponent1(__VLS_271, new __VLS_271({
    label: (__VLS_ctx.$t('views.application.form.prompt.label')),
    prop: "model_setting.prompt",
    rules: ({
        required: __VLS_ctx.applicationForm.model_id,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}));
const __VLS_273 = __VLS_272({
    label: (__VLS_ctx.$t('views.application.form.prompt.label')),
    prop: "model_setting.prompt",
    rules: ({
        required: __VLS_ctx.applicationForm.model_id,
        message: __VLS_ctx.$t('views.application.form.prompt.requiredMessage'),
        trigger: 'blur',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_272));
const { default: __VLS_276 } = __VLS_274.slots;
{
    const { label: __VLS_277 } = __VLS_274.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                return __VLS_ctx.collapseData.prompt = !__VLS_ctx.collapseData.prompt;
                // @ts-ignore
                [$t, $t, $t, applicationForm, collapseData, collapseData,];
            } },
        ...{ class: "flex align-center cursor" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
    let __VLS_278;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_279 = __VLS_asFunctionalComponent1(__VLS_278, new __VLS_278({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.prompt ? 'rotate-90' : '') },
    }));
    const __VLS_280 = __VLS_279({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.prompt ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_279));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_283 } = __VLS_281.slots;
    let __VLS_284;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent1(__VLS_284, new __VLS_284({}));
    const __VLS_286 = __VLS_285({}, ...__VLS_functionalComponentArgsRest(__VLS_285));
    // @ts-ignore
    [collapseData,];
    var __VLS_281;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.prompt.label'));
    (__VLS_ctx.$t('views.application.form.prompt.references'));
    let __VLS_289;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent1(__VLS_289, new __VLS_289({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.prompt.tooltip')),
        popperClass: "max-w-350",
        placement: "right",
    }));
    const __VLS_291 = __VLS_290({
        effect: "dark",
        content: (__VLS_ctx.$t('views.application.form.prompt.tooltip')),
        popperClass: "max-w-350",
        placement: "right",
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    const { default: __VLS_294 } = __VLS_292.slots;
    let __VLS_295;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_296 = __VLS_asFunctionalComponent1(__VLS_295, new __VLS_295({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_297 = __VLS_296({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_296));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [$t, $t, $t,];
    var __VLS_292;
    if (__VLS_ctx.applicationForm.model_id) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    }
    // @ts-ignore
    [applicationForm,];
}
if (__VLS_ctx.collapseData.prompt) {
    let __VLS_300;
    /** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
    MdEditorMagnify;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent1(__VLS_300, new __VLS_300({
        ...{ 'onSubmitDialog': {} },
        title: (__VLS_ctx.$t('views.application.form.prompt.label') +
            __VLS_ctx.$t('views.application.form.prompt.references')),
        modelValue: (__VLS_ctx.applicationForm.model_setting.prompt),
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('views.application.form.prompt.placeholder', {
            data: '{data}',
            question: '{question}',
        })),
    }));
    const __VLS_302 = __VLS_301({
        ...{ 'onSubmitDialog': {} },
        title: (__VLS_ctx.$t('views.application.form.prompt.label') +
            __VLS_ctx.$t('views.application.form.prompt.references')),
        modelValue: (__VLS_ctx.applicationForm.model_setting.prompt),
        ...{ style: {} },
        placeholder: (__VLS_ctx.$t('views.application.form.prompt.placeholder', {
            data: '{data}',
            question: '{question}',
        })),
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    let __VLS_305;
    const __VLS_306 = {
        /** @type {typeof __VLS_305.submitDialog} */
        onSubmitDialog: (__VLS_ctx.submitPromptDialog),
    };
    var __VLS_303;
    var __VLS_304;
}
// @ts-ignore
[$t, $t, $t, applicationForm, collapseData, submitPromptDialog,];
var __VLS_274;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.collapseData.knowledge_setting = !__VLS_ctx.collapseData.knowledge_setting;
            // @ts-ignore
            [collapseData, collapseData,];
        } },
    ...{ class: "flex-between mb-12 cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
let __VLS_307;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_308 = __VLS_asFunctionalComponent1(__VLS_307, new __VLS_307({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.knowledge_setting ? 'rotate-90' : '') },
}));
const __VLS_309 = __VLS_308({
    ...{ class: "mr-8 arrow-icon" },
    ...{ class: (__VLS_ctx.collapseData.knowledge_setting ? 'rotate-90' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_308));
/** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_312 } = __VLS_310.slots;
let __VLS_313;
/** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
CaretRight;
// @ts-ignore
const __VLS_314 = __VLS_asFunctionalComponent1(__VLS_313, new __VLS_313({}));
const __VLS_315 = __VLS_314({}, ...__VLS_functionalComponentArgsRest(__VLS_314));
// @ts-ignore
[collapseData,];
var __VLS_310;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "lighter" },
});
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
(__VLS_ctx.$t('views.application.form.relatedKnowledge.label'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "mr-4" },
});
/** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
let __VLS_318;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_319 = __VLS_asFunctionalComponent1(__VLS_318, new __VLS_318({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_320 = __VLS_319({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_319));
let __VLS_323;
const __VLS_324 = {
    /** @type {typeof __VLS_323.click} */
    onClick: (__VLS_ctx.openParamSettingDialog),
};
const { default: __VLS_325 } = __VLS_321.slots;
let __VLS_326;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_327 = __VLS_asFunctionalComponent1(__VLS_326, new __VLS_326({
    iconName: "app-setting",
}));
const __VLS_328 = __VLS_327({
    iconName: "app-setting",
}, ...__VLS_functionalComponentArgsRest(__VLS_327));
// @ts-ignore
[$t, openParamSettingDialog,];
var __VLS_321;
var __VLS_322;
let __VLS_331;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_332 = __VLS_asFunctionalComponent1(__VLS_331, new __VLS_331({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}));
const __VLS_333 = __VLS_332({
    ...{ 'onClick': {} },
    type: "primary",
    link: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_332));
let __VLS_336;
const __VLS_337 = {
    /** @type {typeof __VLS_336.click} */
    onClick: (__VLS_ctx.openKnowledgeDialog),
};
const { default: __VLS_338 } = __VLS_334.slots;
let __VLS_339;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_340 = __VLS_asFunctionalComponent1(__VLS_339, new __VLS_339({
    iconName: "app-add-outlined",
}));
const __VLS_341 = __VLS_340({
    iconName: "app-add-outlined",
}, ...__VLS_functionalComponentArgsRest(__VLS_340));
// @ts-ignore
[openKnowledgeDialog,];
var __VLS_334;
var __VLS_335;
if (__VLS_ctx.collapseData.knowledge_setting) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.applicationForm.knowledge_id_list?.length === 0) {
        let __VLS_344;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_345 = __VLS_asFunctionalComponent1(__VLS_344, new __VLS_344({
            type: "info",
        }));
        const __VLS_346 = __VLS_345({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_345));
        const { default: __VLS_349 } = __VLS_347.slots;
        (__VLS_ctx.$t('views.application.form.relatedKnowledge.placeholder'));
        // @ts-ignore
        [$t, applicationForm, collapseData,];
        var __VLS_347;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationForm.knowledge_id_list))) {
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
            let __VLS_350;
            /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
            KnowledgeIcon;
            // @ts-ignore
            const __VLS_351 = __VLS_asFunctionalComponent1(__VLS_350, new __VLS_350({
                type: (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.type),
                ...{ class: "mr-8" },
                size: (20),
                ...{ style: {} },
            }));
            const __VLS_352 = __VLS_351({
                type: (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.type),
                ...{ class: "mr-8" },
                size: (20),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_351));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis cursor" },
                title: (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            (__VLS_ctx.relatedObject(__VLS_ctx.knowledgeList, item, 'id')?.name);
            let __VLS_355;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_356 = __VLS_asFunctionalComponent1(__VLS_355, new __VLS_355({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_357 = __VLS_356({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_356));
            let __VLS_360;
            const __VLS_361 = {
                /** @type {typeof __VLS_360.click} */
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.collapseData.knowledge_setting))
                        throw 0;
                    if (!!(__VLS_ctx.applicationForm.knowledge_id_list?.length === 0))
                        throw 0;
                    return __VLS_ctx.removeKnowledge(item);
                    // @ts-ignore
                    [applicationForm, relatedObject, relatedObject, relatedObject, knowledgeList, knowledgeList, knowledgeList, removeKnowledge,];
                },
            };
            const { default: __VLS_362 } = __VLS_358.slots;
            let __VLS_363;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_364 = __VLS_asFunctionalComponent1(__VLS_363, new __VLS_363({}));
            const __VLS_365 = __VLS_364({}, ...__VLS_functionalComponentArgsRest(__VLS_364));
            const { default: __VLS_368 } = __VLS_366.slots;
            let __VLS_369;
            /** @ts-ignore @type { | typeof __VLS_components.Close} */
            Close;
            // @ts-ignore
            const __VLS_370 = __VLS_asFunctionalComponent1(__VLS_369, new __VLS_369({}));
            const __VLS_371 = __VLS_370({}, ...__VLS_functionalComponentArgsRest(__VLS_370));
            // @ts-ignore
            [];
            var __VLS_366;
            // @ts-ignore
            [];
            var __VLS_358;
            var __VLS_359;
            // @ts-ignore
            [];
        }
    }
}
// @ts-ignore
[];
var __VLS_268;
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
if (__VLS_ctx.toolPermissionPrecise.read()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_374;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
    elCheckbox;
    // @ts-ignore
    const __VLS_375 = __VLS_asFunctionalComponent1(__VLS_374, new __VLS_374({
        modelValue: (__VLS_ctx.applicationForm.mcp_output_enable),
        label: (__VLS_ctx.$t('views.application.form.mcp_output_enable')),
    }));
    const __VLS_376 = __VLS_375({
        modelValue: (__VLS_ctx.applicationForm.mcp_output_enable),
        label: (__VLS_ctx.$t('views.application.form.mcp_output_enable')),
    }, ...__VLS_functionalComponentArgsRest(__VLS_375));
}
let __VLS_379;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_380 = __VLS_asFunctionalComponent1(__VLS_379, new __VLS_379({
    shadow: "never",
    ...{ class: "card-never mb-8" },
    ...{ style: {} },
}));
const __VLS_381 = __VLS_380({
    shadow: "never",
    ...{ class: "card-never mb-8" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_380));
/** @type {__VLS_StyleScopedClasses['card-never']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_384 } = __VLS_382.slots;
if (__VLS_ctx.toolPermissionPrecise.read()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.toolPermissionPrecise.read()))
                    throw 0;
                return __VLS_ctx.collapseData.MCP = !__VLS_ctx.collapseData.MCP;
                // @ts-ignore
                [$t, $t, applicationForm, collapseData, collapseData, toolPermissionPrecise, toolPermissionPrecise,];
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
    let __VLS_385;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_386 = __VLS_asFunctionalComponent1(__VLS_385, new __VLS_385({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.MCP ? 'rotate-90' : '') },
    }));
    const __VLS_387 = __VLS_386({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.MCP ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_386));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_390 } = __VLS_388.slots;
    let __VLS_391;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_392 = __VLS_asFunctionalComponent1(__VLS_391, new __VLS_391({}));
    const __VLS_393 = __VLS_392({}, ...__VLS_functionalComponentArgsRest(__VLS_392));
    // @ts-ignore
    [collapseData,];
    var __VLS_388;
    if (__VLS_ctx.applicationForm.mcp_tool_ids?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.applicationForm.mcp_tool_ids?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_396;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_397 = __VLS_asFunctionalComponent1(__VLS_396, new __VLS_396({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_398 = __VLS_397({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_397));
    let __VLS_401;
    const __VLS_402 = {
        /** @type {typeof __VLS_401.click} */
        onClick: (__VLS_ctx.openMcpServersDialog),
    };
    const __VLS_403 = {
        /** @type {typeof __VLS_401.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_404 } = __VLS_399.slots;
    let __VLS_405;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_406 = __VLS_asFunctionalComponent1(__VLS_405, new __VLS_405({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_407 = __VLS_406({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_406));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [applicationForm, applicationForm, refreshParam, openMcpServersDialog,];
    var __VLS_399;
    var __VLS_400;
    if (__VLS_ctx.applicationForm.mcp_tool_ids &&
        __VLS_ctx.applicationForm.mcp_tool_ids.length > 0 &&
        __VLS_ctx.toolPermissionPrecise.read() &&
        __VLS_ctx.collapseData.MCP) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationForm.mcp_tool_ids))) {
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
                    let __VLS_410;
                    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                    elAvatar;
                    // @ts-ignore
                    const __VLS_411 = __VLS_asFunctionalComponent1(__VLS_410, new __VLS_410({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }));
                    const __VLS_412 = __VLS_411({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_411));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    const { default: __VLS_415 } = __VLS_413.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.icon)),
                        alt: "",
                    });
                    // @ts-ignore
                    [applicationForm, applicationForm, applicationForm, collapseData, relatedObject, relatedObject, relatedObject, toolPermissionPrecise, mcpToolSelectOptions, mcpToolSelectOptions, mcpToolSelectOptions, resetUrl,];
                    var __VLS_413;
                }
                else {
                    let __VLS_416;
                    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                    ToolIcon;
                    // @ts-ignore
                    const __VLS_417 = __VLS_asFunctionalComponent1(__VLS_416, new __VLS_416({
                        type: "MCP",
                        ...{ class: "mr-8" },
                        size: (20),
                        ...{ style: {} },
                    }));
                    const __VLS_418 = __VLS_417({
                        type: "MCP",
                        ...{ class: "mr-8" },
                        size: (20),
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_417));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "ellipsis-1" },
                    title: (__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.name),
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                (__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')?.name ||
                    __VLS_ctx.$t('common.custom') + ' MCP');
                let __VLS_421;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_422 = __VLS_asFunctionalComponent1(__VLS_421, new __VLS_421({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_423 = __VLS_422({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_422));
                let __VLS_426;
                const __VLS_427 = {
                    /** @type {typeof __VLS_426.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.toolPermissionPrecise.read()))
                            throw 0;
                        if (!(__VLS_ctx.applicationForm.mcp_tool_ids &&
                            __VLS_ctx.applicationForm.mcp_tool_ids.length > 0 &&
                            __VLS_ctx.toolPermissionPrecise.read() &&
                            __VLS_ctx.collapseData.MCP))
                            throw 0;
                        if (!(__VLS_ctx.relatedObject(__VLS_ctx.mcpToolSelectOptions, item, 'id')))
                            throw 0;
                        return __VLS_ctx.removeMcpTool(item);
                        // @ts-ignore
                        [$t, relatedObject, relatedObject, mcpToolSelectOptions, mcpToolSelectOptions, removeMcpTool,];
                    },
                };
                const { default: __VLS_428 } = __VLS_424.slots;
                let __VLS_429;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_430 = __VLS_asFunctionalComponent1(__VLS_429, new __VLS_429({}));
                const __VLS_431 = __VLS_430({}, ...__VLS_functionalComponentArgsRest(__VLS_430));
                const { default: __VLS_434 } = __VLS_432.slots;
                let __VLS_435;
                /** @ts-ignore @type { | typeof __VLS_components.Close} */
                Close;
                // @ts-ignore
                const __VLS_436 = __VLS_asFunctionalComponent1(__VLS_435, new __VLS_435({}));
                const __VLS_437 = __VLS_436({}, ...__VLS_functionalComponentArgsRest(__VLS_436));
                // @ts-ignore
                [];
                var __VLS_432;
                // @ts-ignore
                [];
                var __VLS_424;
                var __VLS_425;
            }
            // @ts-ignore
            [];
        }
    }
    if (__VLS_ctx.applicationForm.mcp_servers &&
        __VLS_ctx.applicationForm.mcp_servers.length > 0 &&
        __VLS_ctx.toolPermissionPrecise.read() &&
        __VLS_ctx.collapseData.MCP) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
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
        let __VLS_440;
        /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
        ToolIcon;
        // @ts-ignore
        const __VLS_441 = __VLS_asFunctionalComponent1(__VLS_440, new __VLS_440({
            type: "MCP",
            ...{ class: "mr-8" },
            size: (20),
            ...{ style: {} },
        }));
        const __VLS_442 = __VLS_441({
            type: "MCP",
            ...{ class: "mr-8" },
            size: (20),
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_441));
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ellipsis" },
        });
        /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
        (__VLS_ctx.$t('common.custom') + ' MCP');
        let __VLS_445;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_446 = __VLS_asFunctionalComponent1(__VLS_445, new __VLS_445({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_447 = __VLS_446({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_446));
        let __VLS_450;
        const __VLS_451 = {
            /** @type {typeof __VLS_450.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.toolPermissionPrecise.read()))
                    throw 0;
                if (!(__VLS_ctx.applicationForm.mcp_servers &&
                    __VLS_ctx.applicationForm.mcp_servers.length > 0 &&
                    __VLS_ctx.toolPermissionPrecise.read() &&
                    __VLS_ctx.collapseData.MCP))
                    throw 0;
                return __VLS_ctx.applicationForm.mcp_servers = '';
                // @ts-ignore
                [$t, applicationForm, applicationForm, applicationForm, collapseData, toolPermissionPrecise,];
            },
        };
        const { default: __VLS_452 } = __VLS_448.slots;
        let __VLS_453;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_454 = __VLS_asFunctionalComponent1(__VLS_453, new __VLS_453({}));
        const __VLS_455 = __VLS_454({}, ...__VLS_functionalComponentArgsRest(__VLS_454));
        const { default: __VLS_458 } = __VLS_456.slots;
        let __VLS_459;
        /** @ts-ignore @type { | typeof __VLS_components.Close} */
        Close;
        // @ts-ignore
        const __VLS_460 = __VLS_asFunctionalComponent1(__VLS_459, new __VLS_459({}));
        const __VLS_461 = __VLS_460({}, ...__VLS_functionalComponentArgsRest(__VLS_460));
        // @ts-ignore
        [];
        var __VLS_456;
        // @ts-ignore
        [];
        var __VLS_448;
        var __VLS_449;
    }
}
if (__VLS_ctx.toolPermissionPrecise.read()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.toolPermissionPrecise.read()))
                    throw 0;
                return __VLS_ctx.collapseData.tool = !__VLS_ctx.collapseData.tool;
                // @ts-ignore
                [collapseData, collapseData, toolPermissionPrecise,];
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
    let __VLS_464;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent1(__VLS_464, new __VLS_464({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.tool ? 'rotate-90' : '') },
    }));
    const __VLS_466 = __VLS_465({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.tool ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_465));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_469 } = __VLS_467.slots;
    let __VLS_470;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_471 = __VLS_asFunctionalComponent1(__VLS_470, new __VLS_470({}));
    const __VLS_472 = __VLS_471({}, ...__VLS_functionalComponentArgsRest(__VLS_471));
    // @ts-ignore
    [collapseData,];
    var __VLS_467;
    (__VLS_ctx.$t('views.tool.title'));
    if (__VLS_ctx.applicationForm.tool_ids?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.applicationForm.tool_ids?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_475;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_476 = __VLS_asFunctionalComponent1(__VLS_475, new __VLS_475({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_477 = __VLS_476({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_476));
    let __VLS_480;
    const __VLS_481 = {
        /** @type {typeof __VLS_480.click} */
        onClick: (__VLS_ctx.openToolDialog),
    };
    const __VLS_482 = {
        /** @type {typeof __VLS_480.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_483 } = __VLS_478.slots;
    let __VLS_484;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_485 = __VLS_asFunctionalComponent1(__VLS_484, new __VLS_484({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_486 = __VLS_485({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_485));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [$t, applicationForm, applicationForm, refreshParam, openToolDialog,];
    var __VLS_478;
    var __VLS_479;
    if (__VLS_ctx.applicationForm.tool_ids &&
        __VLS_ctx.applicationForm.tool_ids.length > 0 &&
        __VLS_ctx.toolPermissionPrecise.read() &&
        __VLS_ctx.collapseData.tool) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationForm.tool_ids))) {
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
                    let __VLS_489;
                    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                    elAvatar;
                    // @ts-ignore
                    const __VLS_490 = __VLS_asFunctionalComponent1(__VLS_489, new __VLS_489({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }));
                    const __VLS_491 = __VLS_490({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_490));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    const { default: __VLS_494 } = __VLS_492.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.icon)),
                        alt: "",
                    });
                    // @ts-ignore
                    [applicationForm, applicationForm, applicationForm, collapseData, relatedObject, relatedObject, relatedObject, toolPermissionPrecise, resetUrl, toolSelectOptions, toolSelectOptions, toolSelectOptions,];
                    var __VLS_492;
                }
                else {
                    let __VLS_495;
                    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                    ToolIcon;
                    // @ts-ignore
                    const __VLS_496 = __VLS_asFunctionalComponent1(__VLS_495, new __VLS_495({
                        ...{ class: "mr-8" },
                        size: (20),
                        ...{ style: {} },
                        type: (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.tool_type),
                    }));
                    const __VLS_497 = __VLS_496({
                        ...{ class: "mr-8" },
                        size: (20),
                        ...{ style: {} },
                        type: (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.tool_type),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_496));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "ellipsis-1" },
                    title: (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.name),
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                (__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')?.name);
                let __VLS_500;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_501 = __VLS_asFunctionalComponent1(__VLS_500, new __VLS_500({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_502 = __VLS_501({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_501));
                let __VLS_505;
                const __VLS_506 = {
                    /** @type {typeof __VLS_505.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.toolPermissionPrecise.read()))
                            throw 0;
                        if (!(__VLS_ctx.applicationForm.tool_ids &&
                            __VLS_ctx.applicationForm.tool_ids.length > 0 &&
                            __VLS_ctx.toolPermissionPrecise.read() &&
                            __VLS_ctx.collapseData.tool))
                            throw 0;
                        if (!(__VLS_ctx.relatedObject(__VLS_ctx.toolSelectOptions, item, 'id')))
                            throw 0;
                        return __VLS_ctx.removeTool(item);
                        // @ts-ignore
                        [relatedObject, relatedObject, relatedObject, toolSelectOptions, toolSelectOptions, toolSelectOptions, removeTool,];
                    },
                };
                const { default: __VLS_507 } = __VLS_503.slots;
                let __VLS_508;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_509 = __VLS_asFunctionalComponent1(__VLS_508, new __VLS_508({}));
                const __VLS_510 = __VLS_509({}, ...__VLS_functionalComponentArgsRest(__VLS_509));
                const { default: __VLS_513 } = __VLS_511.slots;
                let __VLS_514;
                /** @ts-ignore @type { | typeof __VLS_components.Close} */
                Close;
                // @ts-ignore
                const __VLS_515 = __VLS_asFunctionalComponent1(__VLS_514, new __VLS_514({}));
                const __VLS_516 = __VLS_515({}, ...__VLS_functionalComponentArgsRest(__VLS_515));
                // @ts-ignore
                [];
                var __VLS_511;
                // @ts-ignore
                [];
                var __VLS_503;
                var __VLS_504;
            }
            // @ts-ignore
            [];
        }
    }
}
if (__VLS_ctx.toolPermissionPrecise.read()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.toolPermissionPrecise.read()))
                    throw 0;
                return __VLS_ctx.collapseData.skill = !__VLS_ctx.collapseData.skill;
                // @ts-ignore
                [collapseData, collapseData, toolPermissionPrecise,];
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
    let __VLS_519;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_520 = __VLS_asFunctionalComponent1(__VLS_519, new __VLS_519({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.skill ? 'rotate-90' : '') },
    }));
    const __VLS_521 = __VLS_520({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.skill ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_520));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_524 } = __VLS_522.slots;
    let __VLS_525;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_526 = __VLS_asFunctionalComponent1(__VLS_525, new __VLS_525({}));
    const __VLS_527 = __VLS_526({}, ...__VLS_functionalComponentArgsRest(__VLS_526));
    // @ts-ignore
    [collapseData,];
    var __VLS_522;
    if (__VLS_ctx.applicationForm.skill_tool_ids?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.applicationForm.skill_tool_ids?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_530;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_531 = __VLS_asFunctionalComponent1(__VLS_530, new __VLS_530({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_532 = __VLS_531({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_531));
    let __VLS_535;
    const __VLS_536 = {
        /** @type {typeof __VLS_535.click} */
        onClick: (__VLS_ctx.openSkillToolDialog),
    };
    const __VLS_537 = {
        /** @type {typeof __VLS_535.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_538 } = __VLS_533.slots;
    let __VLS_539;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_540 = __VLS_asFunctionalComponent1(__VLS_539, new __VLS_539({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_541 = __VLS_540({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_540));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [applicationForm, applicationForm, refreshParam, openSkillToolDialog,];
    var __VLS_533;
    var __VLS_534;
    if (__VLS_ctx.applicationForm.skill_tool_ids &&
        __VLS_ctx.applicationForm.skill_tool_ids.length > 0 &&
        __VLS_ctx.toolPermissionPrecise.read() &&
        __VLS_ctx.collapseData.skill) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationForm.skill_tool_ids))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')) {
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
                    let __VLS_544;
                    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                    elAvatar;
                    // @ts-ignore
                    const __VLS_545 = __VLS_asFunctionalComponent1(__VLS_544, new __VLS_544({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }));
                    const __VLS_546 = __VLS_545({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_545));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    const { default: __VLS_549 } = __VLS_547.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.icon)),
                        alt: "",
                    });
                    // @ts-ignore
                    [applicationForm, applicationForm, applicationForm, collapseData, relatedObject, relatedObject, relatedObject, toolPermissionPrecise, resetUrl, skillToolSelectOptions, skillToolSelectOptions, skillToolSelectOptions,];
                    var __VLS_547;
                }
                else {
                    let __VLS_550;
                    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
                    ToolIcon;
                    // @ts-ignore
                    const __VLS_551 = __VLS_asFunctionalComponent1(__VLS_550, new __VLS_550({
                        ...{ class: "mr-8" },
                        size: (20),
                        type: "SKILL",
                        ...{ style: {} },
                    }));
                    const __VLS_552 = __VLS_551({
                        ...{ class: "mr-8" },
                        size: (20),
                        type: "SKILL",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_551));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "ellipsis-1" },
                    title: (__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.name),
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                (__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')?.name);
                let __VLS_555;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_556 = __VLS_asFunctionalComponent1(__VLS_555, new __VLS_555({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_557 = __VLS_556({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_556));
                let __VLS_560;
                const __VLS_561 = {
                    /** @type {typeof __VLS_560.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.toolPermissionPrecise.read()))
                            throw 0;
                        if (!(__VLS_ctx.applicationForm.skill_tool_ids &&
                            __VLS_ctx.applicationForm.skill_tool_ids.length > 0 &&
                            __VLS_ctx.toolPermissionPrecise.read() &&
                            __VLS_ctx.collapseData.skill))
                            throw 0;
                        if (!(__VLS_ctx.relatedObject(__VLS_ctx.skillToolSelectOptions, item, 'id')))
                            throw 0;
                        return __VLS_ctx.removeSkillTool(item);
                        // @ts-ignore
                        [relatedObject, relatedObject, skillToolSelectOptions, skillToolSelectOptions, removeSkillTool,];
                    },
                };
                const { default: __VLS_562 } = __VLS_558.slots;
                let __VLS_563;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_564 = __VLS_asFunctionalComponent1(__VLS_563, new __VLS_563({}));
                const __VLS_565 = __VLS_564({}, ...__VLS_functionalComponentArgsRest(__VLS_564));
                const { default: __VLS_568 } = __VLS_566.slots;
                let __VLS_569;
                /** @ts-ignore @type { | typeof __VLS_components.Close} */
                Close;
                // @ts-ignore
                const __VLS_570 = __VLS_asFunctionalComponent1(__VLS_569, new __VLS_569({}));
                const __VLS_571 = __VLS_570({}, ...__VLS_functionalComponentArgsRest(__VLS_570));
                // @ts-ignore
                [];
                var __VLS_566;
                // @ts-ignore
                [];
                var __VLS_558;
                var __VLS_559;
            }
            // @ts-ignore
            [];
        }
    }
}
if (__VLS_ctx.toolPermissionPrecise.read()) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: (...[$event]) => {
                if (!(__VLS_ctx.toolPermissionPrecise.read()))
                    throw 0;
                return __VLS_ctx.collapseData.agent = !__VLS_ctx.collapseData.agent;
                // @ts-ignore
                [collapseData, collapseData, toolPermissionPrecise,];
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
    let __VLS_574;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_575 = __VLS_asFunctionalComponent1(__VLS_574, new __VLS_574({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.agent ? 'rotate-90' : '') },
    }));
    const __VLS_576 = __VLS_575({
        ...{ class: "mr-8 arrow-icon" },
        ...{ class: (__VLS_ctx.collapseData.agent ? 'rotate-90' : '') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_575));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
    const { default: __VLS_579 } = __VLS_577.slots;
    let __VLS_580;
    /** @ts-ignore @type { | typeof __VLS_components.CaretRight} */
    CaretRight;
    // @ts-ignore
    const __VLS_581 = __VLS_asFunctionalComponent1(__VLS_580, new __VLS_580({}));
    const __VLS_582 = __VLS_581({}, ...__VLS_functionalComponentArgsRest(__VLS_581));
    // @ts-ignore
    [collapseData,];
    var __VLS_577;
    (__VLS_ctx.$t('views.application.title'));
    if (__VLS_ctx.applicationForm.application_ids?.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-4" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        (__VLS_ctx.applicationForm.application_ids?.length);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_585;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_586 = __VLS_asFunctionalComponent1(__VLS_585, new __VLS_585({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_587 = __VLS_586({
        ...{ 'onClick': {} },
        ...{ 'onRefreshForm': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_586));
    let __VLS_590;
    const __VLS_591 = {
        /** @type {typeof __VLS_590.click} */
        onClick: (__VLS_ctx.openApplicationDialog),
    };
    const __VLS_592 = {
        /** @type {typeof __VLS_590.refreshForm} */
        onRefreshForm: (__VLS_ctx.refreshParam),
    };
    const { default: __VLS_593 } = __VLS_588.slots;
    let __VLS_594;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_595 = __VLS_asFunctionalComponent1(__VLS_594, new __VLS_594({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_596 = __VLS_595({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_595));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    // @ts-ignore
    [$t, applicationForm, applicationForm, refreshParam, openApplicationDialog,];
    var __VLS_588;
    var __VLS_589;
    if (__VLS_ctx.applicationForm.application_ids &&
        __VLS_ctx.applicationForm.application_ids.length > 0 &&
        __VLS_ctx.toolPermissionPrecise.read() &&
        __VLS_ctx.collapseData.agent) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "w-full mb-16" },
        });
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.applicationForm.application_ids))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')) {
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
                    let __VLS_599;
                    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
                    elAvatar;
                    // @ts-ignore
                    const __VLS_600 = __VLS_asFunctionalComponent1(__VLS_599, new __VLS_599({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }));
                    const __VLS_601 = __VLS_600({
                        shape: "square",
                        size: (20),
                        ...{ style: {} },
                        ...{ class: "mr-8" },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_600));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                    const { default: __VLS_604 } = __VLS_602.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                        src: (__VLS_ctx.resetUrl(__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.icon)),
                        alt: "",
                    });
                    // @ts-ignore
                    [applicationForm, applicationForm, applicationForm, collapseData, relatedObject, relatedObject, relatedObject, toolPermissionPrecise, resetUrl, applicationSelectOptions, applicationSelectOptions, applicationSelectOptions,];
                    var __VLS_602;
                }
                else {
                    let __VLS_605;
                    /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
                    AppIcon;
                    // @ts-ignore
                    const __VLS_606 = __VLS_asFunctionalComponent1(__VLS_605, new __VLS_605({
                        ...{ class: "mr-8" },
                        size: (20),
                    }));
                    const __VLS_607 = __VLS_606({
                        ...{ class: "mr-8" },
                        size: (20),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_606));
                    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
                }
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "ellipsis-1" },
                    title: (__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.name),
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                (__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')?.name);
                let __VLS_610;
                /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
                elButton;
                // @ts-ignore
                const __VLS_611 = __VLS_asFunctionalComponent1(__VLS_610, new __VLS_610({
                    ...{ 'onClick': {} },
                    text: true,
                }));
                const __VLS_612 = __VLS_611({
                    ...{ 'onClick': {} },
                    text: true,
                }, ...__VLS_functionalComponentArgsRest(__VLS_611));
                let __VLS_615;
                const __VLS_616 = {
                    /** @type {typeof __VLS_615.click} */
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.toolPermissionPrecise.read()))
                            throw 0;
                        if (!(__VLS_ctx.applicationForm.application_ids &&
                            __VLS_ctx.applicationForm.application_ids.length > 0 &&
                            __VLS_ctx.toolPermissionPrecise.read() &&
                            __VLS_ctx.collapseData.agent))
                            throw 0;
                        if (!(__VLS_ctx.relatedObject(__VLS_ctx.applicationSelectOptions, item, 'id')))
                            throw 0;
                        return __VLS_ctx.removeApplication(item);
                        // @ts-ignore
                        [relatedObject, relatedObject, applicationSelectOptions, applicationSelectOptions, removeApplication,];
                    },
                };
                const { default: __VLS_617 } = __VLS_613.slots;
                let __VLS_618;
                /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
                elIcon;
                // @ts-ignore
                const __VLS_619 = __VLS_asFunctionalComponent1(__VLS_618, new __VLS_618({}));
                const __VLS_620 = __VLS_619({}, ...__VLS_functionalComponentArgsRest(__VLS_619));
                const { default: __VLS_623 } = __VLS_621.slots;
                let __VLS_624;
                /** @ts-ignore @type { | typeof __VLS_components.Close} */
                Close;
                // @ts-ignore
                const __VLS_625 = __VLS_asFunctionalComponent1(__VLS_624, new __VLS_624({}));
                const __VLS_626 = __VLS_625({}, ...__VLS_functionalComponentArgsRest(__VLS_625));
                // @ts-ignore
                [];
                var __VLS_621;
                // @ts-ignore
                [];
                var __VLS_613;
                var __VLS_614;
            }
            // @ts-ignore
            [];
        }
    }
}
// @ts-ignore
[];
var __VLS_382;
let __VLS_629;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_630 = __VLS_asFunctionalComponent1(__VLS_629, new __VLS_629({
    label: (__VLS_ctx.$t('views.application.form.prologue')),
}));
const __VLS_631 = __VLS_630({
    label: (__VLS_ctx.$t('views.application.form.prologue')),
}, ...__VLS_functionalComponentArgsRest(__VLS_630));
const { default: __VLS_634 } = __VLS_632.slots;
let __VLS_635;
/** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
MdEditorMagnify;
// @ts-ignore
const __VLS_636 = __VLS_asFunctionalComponent1(__VLS_635, new __VLS_635({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prologue')),
    modelValue: (__VLS_ctx.applicationForm.prologue),
    ...{ style: {} },
}));
const __VLS_637 = __VLS_636({
    ...{ 'onSubmitDialog': {} },
    title: (__VLS_ctx.$t('views.application.form.prologue')),
    modelValue: (__VLS_ctx.applicationForm.prologue),
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_636));
let __VLS_640;
const __VLS_641 = {
    /** @type {typeof __VLS_640.submitDialog} */
    onSubmitDialog: (__VLS_ctx.submitPrologueDialog),
};
var __VLS_638;
var __VLS_639;
// @ts-ignore
[$t, $t, applicationForm, submitPrologueDialog,];
var __VLS_632;
let __VLS_642;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_643 = __VLS_asFunctionalComponent1(__VLS_642, new __VLS_642({
    ...{ 'onClick': {} },
}));
const __VLS_644 = __VLS_643({
    ...{ 'onClick': {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_643));
let __VLS_647;
const __VLS_648 = {
    /** @type {typeof __VLS_647.click} */
    onClick: () => { },
};
const { default: __VLS_649 } = __VLS_645.slots;
{
    const { label: __VLS_650 } = __VLS_645.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.reasoningContent.label'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    let __VLS_651;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_652 = __VLS_asFunctionalComponent1(__VLS_651, new __VLS_651({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_653 = __VLS_652({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_652));
    let __VLS_656;
    const __VLS_657 = {
        /** @type {typeof __VLS_656.click} */
        onClick: (__VLS_ctx.openReasoningParamSettingDialog),
    };
    const { default: __VLS_658 } = __VLS_654.slots;
    let __VLS_659;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_660 = __VLS_asFunctionalComponent1(__VLS_659, new __VLS_659({
        iconName: "app-setting",
    }));
    const __VLS_661 = __VLS_660({
        iconName: "app-setting",
    }, ...__VLS_functionalComponentArgsRest(__VLS_660));
    // @ts-ignore
    [$t, openReasoningParamSettingDialog,];
    var __VLS_654;
    var __VLS_655;
    let __VLS_664;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_665 = __VLS_asFunctionalComponent1(__VLS_664, new __VLS_664({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.model_setting.reasoning_content_enable),
    }));
    const __VLS_666 = __VLS_665({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.model_setting.reasoning_content_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_665));
    let __VLS_669;
    const __VLS_670 = {
        /** @type {typeof __VLS_669.change} */
        onChange: (__VLS_ctx.sttModelEnableChange),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_667;
    var __VLS_668;
    // @ts-ignore
    [applicationForm, sttModelEnableChange,];
}
// @ts-ignore
[];
var __VLS_645;
var __VLS_646;
let __VLS_671;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_672 = __VLS_asFunctionalComponent1(__VLS_671, new __VLS_671({
    prop: "stt_model_id",
    rules: ({
        required: __VLS_ctx.applicationForm.stt_model_enable,
        message: __VLS_ctx.$t('views.application.form.voiceInput.requiredMessage'),
        trigger: 'change',
    }),
}));
const __VLS_673 = __VLS_672({
    prop: "stt_model_id",
    rules: ({
        required: __VLS_ctx.applicationForm.stt_model_enable,
        message: __VLS_ctx.$t('views.application.form.voiceInput.requiredMessage'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_672));
const { default: __VLS_676 } = __VLS_674.slots;
{
    const { label: __VLS_677 } = __VLS_674.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.voiceInput.label'));
    if (__VLS_ctx.applicationForm.stt_model_enable) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.applicationForm.stt_model_enable) {
        let __VLS_678;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_679 = __VLS_asFunctionalComponent1(__VLS_678, new __VLS_678({
            modelValue: (__VLS_ctx.applicationForm.stt_autosend),
        }));
        const __VLS_680 = __VLS_679({
            modelValue: (__VLS_ctx.applicationForm.stt_autosend),
        }, ...__VLS_functionalComponentArgsRest(__VLS_679));
        const { default: __VLS_683 } = __VLS_681.slots;
        (__VLS_ctx.$t('views.application.form.voiceInput.autoSend'));
        // @ts-ignore
        [$t, $t, $t, applicationForm, applicationForm, applicationForm, applicationForm,];
        var __VLS_681;
    }
    let __VLS_684;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_685 = __VLS_asFunctionalComponent1(__VLS_684, new __VLS_684({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.stt_model_enable),
    }));
    const __VLS_686 = __VLS_685({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.stt_model_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_685));
    let __VLS_689;
    const __VLS_690 = {
        /** @type {typeof __VLS_689.change} */
        onChange: (__VLS_ctx.sttModelEnableChange),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_687;
    var __VLS_688;
    // @ts-ignore
    [applicationForm, sttModelEnableChange,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_691;
/** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
ModelSelect;
// @ts-ignore
const __VLS_692 = __VLS_asFunctionalComponent1(__VLS_691, new __VLS_691({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.applicationForm.stt_model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.voiceInput.placeholder')),
    options: (__VLS_ctx.sttModelOptions),
    modelType: ('STT'),
}));
const __VLS_693 = __VLS_692({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.applicationForm.stt_model_id),
    placeholder: (__VLS_ctx.$t('views.application.form.voiceInput.placeholder')),
    options: (__VLS_ctx.sttModelOptions),
    modelType: ('STT'),
}, ...__VLS_functionalComponentArgsRest(__VLS_692));
let __VLS_696;
const __VLS_697 = {
    /** @type {typeof __VLS_696.change} */
    onChange: (__VLS_ctx.sttModelChange),
};
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.applicationForm.stt_model_enable) }, null, null);
var __VLS_694;
var __VLS_695;
if (__VLS_ctx.applicationForm.stt_model_enable) {
    let __VLS_698;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_699 = __VLS_asFunctionalComponent1(__VLS_698, new __VLS_698({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.applicationForm.stt_model_id),
        ...{ class: "ml-8" },
    }));
    const __VLS_700 = __VLS_699({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.applicationForm.stt_model_id),
        ...{ class: "ml-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_699));
    let __VLS_703;
    const __VLS_704 = {
        /** @type {typeof __VLS_703.click} */
        onClick: (__VLS_ctx.openSTTParamSettingDialog),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    const { default: __VLS_705 } = __VLS_701.slots;
    let __VLS_706;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_707 = __VLS_asFunctionalComponent1(__VLS_706, new __VLS_706({}));
    const __VLS_708 = __VLS_707({}, ...__VLS_functionalComponentArgsRest(__VLS_707));
    const { default: __VLS_711 } = __VLS_709.slots;
    let __VLS_712;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_713 = __VLS_asFunctionalComponent1(__VLS_712, new __VLS_712({}));
    const __VLS_714 = __VLS_713({}, ...__VLS_functionalComponentArgsRest(__VLS_713));
    // @ts-ignore
    [$t, applicationForm, applicationForm, applicationForm, applicationForm, sttModelOptions, sttModelChange, openSTTParamSettingDialog,];
    var __VLS_709;
    // @ts-ignore
    [];
    var __VLS_701;
    var __VLS_702;
}
// @ts-ignore
[];
var __VLS_674;
let __VLS_717;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_718 = __VLS_asFunctionalComponent1(__VLS_717, new __VLS_717({
    prop: "tts_model_id",
    rules: ({
        required: __VLS_ctx.applicationForm.tts_type === 'TTS' && __VLS_ctx.applicationForm.tts_model_enable,
        message: __VLS_ctx.$t('views.application.form.voicePlay.requiredMessage'),
        trigger: 'change',
    }),
}));
const __VLS_719 = __VLS_718({
    prop: "tts_model_id",
    rules: ({
        required: __VLS_ctx.applicationForm.tts_type === 'TTS' && __VLS_ctx.applicationForm.tts_model_enable,
        message: __VLS_ctx.$t('views.application.form.voicePlay.requiredMessage'),
        trigger: 'change',
    }),
}, ...__VLS_functionalComponentArgsRest(__VLS_718));
const { default: __VLS_722 } = __VLS_720.slots;
{
    const { label: __VLS_723 } = __VLS_720.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.form.voicePlay.label'));
    if (__VLS_ctx.applicationForm.tts_type === 'TTS' && __VLS_ctx.applicationForm.tts_model_enable) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.applicationForm.tts_model_enable) {
        let __VLS_724;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox'] | typeof __VLS_components.elCheckbox | typeof __VLS_components.ElCheckbox | typeof __VLS_components['el-checkbox']} */
        elCheckbox;
        // @ts-ignore
        const __VLS_725 = __VLS_asFunctionalComponent1(__VLS_724, new __VLS_724({
            modelValue: (__VLS_ctx.applicationForm.tts_autoplay),
        }));
        const __VLS_726 = __VLS_725({
            modelValue: (__VLS_ctx.applicationForm.tts_autoplay),
        }, ...__VLS_functionalComponentArgsRest(__VLS_725));
        const { default: __VLS_729 } = __VLS_727.slots;
        (__VLS_ctx.$t('views.application.form.voicePlay.autoPlay'));
        // @ts-ignore
        [$t, $t, $t, applicationForm, applicationForm, applicationForm, applicationForm, applicationForm, applicationForm,];
        var __VLS_727;
    }
    let __VLS_730;
    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
    elSwitch;
    // @ts-ignore
    const __VLS_731 = __VLS_asFunctionalComponent1(__VLS_730, new __VLS_730({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.tts_model_enable),
    }));
    const __VLS_732 = __VLS_731({
        ...{ 'onChange': {} },
        ...{ class: "ml-8" },
        size: "small",
        modelValue: (__VLS_ctx.applicationForm.tts_model_enable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_731));
    let __VLS_735;
    const __VLS_736 = {
        /** @type {typeof __VLS_735.change} */
        onChange: (__VLS_ctx.ttsModelEnableChange),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    var __VLS_733;
    var __VLS_734;
    // @ts-ignore
    [applicationForm, ttsModelEnableChange,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "w-full" },
});
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
let __VLS_737;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_738 = __VLS_asFunctionalComponent1(__VLS_737, new __VLS_737({
    modelValue: (__VLS_ctx.applicationForm.tts_type),
    ...{ class: "mb-8" },
}));
const __VLS_739 = __VLS_738({
    modelValue: (__VLS_ctx.applicationForm.tts_type),
    ...{ class: "mb-8" },
}, ...__VLS_functionalComponentArgsRest(__VLS_738));
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.applicationForm.tts_model_enable) }, null, null);
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
const { default: __VLS_742 } = __VLS_740.slots;
let __VLS_743;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_744 = __VLS_asFunctionalComponent1(__VLS_743, new __VLS_743({
    value: "BROWSER",
}));
const __VLS_745 = __VLS_744({
    value: "BROWSER",
}, ...__VLS_functionalComponentArgsRest(__VLS_744));
const { default: __VLS_748 } = __VLS_746.slots;
(__VLS_ctx.$t('views.application.form.voicePlay.browser'));
// @ts-ignore
[$t, applicationForm, applicationForm,];
var __VLS_746;
let __VLS_749;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_750 = __VLS_asFunctionalComponent1(__VLS_749, new __VLS_749({
    value: "TTS",
}));
const __VLS_751 = __VLS_750({
    value: "TTS",
}, ...__VLS_functionalComponentArgsRest(__VLS_750));
const { default: __VLS_754 } = __VLS_752.slots;
(__VLS_ctx.$t('views.application.form.voicePlay.tts'));
// @ts-ignore
[$t,];
var __VLS_752;
// @ts-ignore
[];
var __VLS_740;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between w-full" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
if (__VLS_ctx.applicationForm.tts_type === 'TTS' && __VLS_ctx.applicationForm.tts_model_enable) {
    let __VLS_755;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_756 = __VLS_asFunctionalComponent1(__VLS_755, new __VLS_755({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.applicationForm.tts_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.voicePlay.placeholder')),
        options: (__VLS_ctx.ttsModelOptions),
        modelType: ('TTS'),
    }));
    const __VLS_757 = __VLS_756({
        ...{ 'onChange': {} },
        modelValue: (__VLS_ctx.applicationForm.tts_model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.voicePlay.placeholder')),
        options: (__VLS_ctx.ttsModelOptions),
        modelType: ('TTS'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_756));
    let __VLS_760;
    const __VLS_761 = {
        /** @type {typeof __VLS_760.change} */
        onChange: (...[$event]) => {
            if (!(__VLS_ctx.applicationForm.tts_type === 'TTS' && __VLS_ctx.applicationForm.tts_model_enable))
                throw 0;
            return __VLS_ctx.ttsModelChange();
            // @ts-ignore
            [$t, applicationForm, applicationForm, applicationForm, ttsModelOptions, ttsModelChange,];
        },
    };
    var __VLS_758;
    var __VLS_759;
}
if (__VLS_ctx.applicationForm.tts_type === 'TTS') {
    let __VLS_762;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_763 = __VLS_asFunctionalComponent1(__VLS_762, new __VLS_762({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.applicationForm.tts_model_id),
        ...{ class: "ml-8" },
    }));
    const __VLS_764 = __VLS_763({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.applicationForm.tts_model_id),
        ...{ class: "ml-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_763));
    let __VLS_767;
    const __VLS_768 = {
        /** @type {typeof __VLS_767.click} */
        onClick: (__VLS_ctx.openTTSParamSettingDialog),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    const { default: __VLS_769 } = __VLS_765.slots;
    let __VLS_770;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_771 = __VLS_asFunctionalComponent1(__VLS_770, new __VLS_770({}));
    const __VLS_772 = __VLS_771({}, ...__VLS_functionalComponentArgsRest(__VLS_771));
    const { default: __VLS_775 } = __VLS_773.slots;
    let __VLS_776;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_777 = __VLS_asFunctionalComponent1(__VLS_776, new __VLS_776({}));
    const __VLS_778 = __VLS_777({}, ...__VLS_functionalComponentArgsRest(__VLS_777));
    // @ts-ignore
    [applicationForm, applicationForm, openTTSParamSettingDialog,];
    var __VLS_773;
    // @ts-ignore
    [];
    var __VLS_765;
    var __VLS_766;
}
// @ts-ignore
[];
var __VLS_720;
// @ts-ignore
[];
var __VLS_43;
// @ts-ignore
[];
var __VLS_37;
// @ts-ignore
[];
var __VLS_31;
let __VLS_781;
/** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
elCol;
// @ts-ignore
const __VLS_782 = __VLS_asFunctionalComponent1(__VLS_781, new __VLS_781({
    span: (14),
    ...{ class: "p-24 border-l" },
}));
const __VLS_783 = __VLS_782({
    span: (14),
    ...{ class: "p-24 border-l" },
}, ...__VLS_functionalComponentArgsRest(__VLS_782));
/** @type {__VLS_StyleScopedClasses['p-24']} */ ;
/** @type {__VLS_StyleScopedClasses['border-l']} */ ;
const { default: __VLS_786 } = __VLS_784.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
(__VLS_ctx.$t('views.application.appTest'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "dialog-bg" },
});
/** @type {__VLS_StyleScopedClasses['dialog-bg']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "scrollbar-height" },
});
/** @type {__VLS_StyleScopedClasses['scrollbar-height']} */ ;
let __VLS_787;
/** @ts-ignore @type { | typeof __VLS_components.AiChat | typeof __VLS_components.AiChat} */
AiChat;
// @ts-ignore
const __VLS_788 = __VLS_asFunctionalComponent1(__VLS_787, new __VLS_787({
    applicationDetails: (__VLS_ctx.applicationForm),
    type: ('debug-ai-chat'),
}));
const __VLS_789 = __VLS_788({
    applicationDetails: (__VLS_ctx.applicationForm),
    type: ('debug-ai-chat'),
}, ...__VLS_functionalComponentArgsRest(__VLS_788));
// @ts-ignore
[$t, applicationForm,];
var __VLS_784;
// @ts-ignore
[];
var __VLS_25;
// @ts-ignore
[];
var __VLS_19;
const __VLS_792 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_793 = __VLS_asFunctionalComponent1(__VLS_792, new __VLS_792({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_794 = __VLS_793({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_793));
let __VLS_797;
const __VLS_798 = {
    /** @type {typeof __VLS_797.refresh} */
    onRefresh: (__VLS_ctx.refreshForm),
};
var __VLS_799;
var __VLS_795;
var __VLS_796;
const __VLS_801 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_802 = __VLS_asFunctionalComponent1(__VLS_801, new __VLS_801({
    ...{ 'onRefresh': {} },
    ref: "LongTermModeParamSettingDialogRef",
}));
const __VLS_803 = __VLS_802({
    ...{ 'onRefresh': {} },
    ref: "LongTermModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_802));
let __VLS_806;
const __VLS_807 = {
    /** @type {typeof __VLS_806.refresh} */
    onRefresh: (__VLS_ctx.refreshLongTermForm),
};
var __VLS_808;
var __VLS_804;
var __VLS_805;
const __VLS_810 = GeneratePromptDialog;
// @ts-ignore
const __VLS_811 = __VLS_asFunctionalComponent1(__VLS_810, new __VLS_810({
    ...{ 'onReplace': {} },
    ref: "GeneratePromptDialogRef",
}));
const __VLS_812 = __VLS_811({
    ...{ 'onReplace': {} },
    ref: "GeneratePromptDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_811));
let __VLS_815;
const __VLS_816 = {
    /** @type {typeof __VLS_815.replace} */
    onReplace: (__VLS_ctx.replace),
};
var __VLS_817;
var __VLS_813;
var __VLS_814;
const __VLS_819 = TTSModeParamSettingDialog;
// @ts-ignore
const __VLS_820 = __VLS_asFunctionalComponent1(__VLS_819, new __VLS_819({
    ...{ 'onRefresh': {} },
    ref: "TTSModeParamSettingDialogRef",
}));
const __VLS_821 = __VLS_820({
    ...{ 'onRefresh': {} },
    ref: "TTSModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_820));
let __VLS_824;
const __VLS_825 = {
    /** @type {typeof __VLS_824.refresh} */
    onRefresh: (__VLS_ctx.refreshTTSForm),
};
var __VLS_826;
var __VLS_822;
var __VLS_823;
const __VLS_828 = STTModeParamSettingDialog;
// @ts-ignore
const __VLS_829 = __VLS_asFunctionalComponent1(__VLS_828, new __VLS_828({
    ...{ 'onRefresh': {} },
    ref: "STTModeParamSettingDialogRef",
}));
const __VLS_830 = __VLS_829({
    ...{ 'onRefresh': {} },
    ref: "STTModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_829));
let __VLS_833;
const __VLS_834 = {
    /** @type {typeof __VLS_833.refresh} */
    onRefresh: (__VLS_ctx.refreshSTTForm),
};
var __VLS_835;
var __VLS_831;
var __VLS_832;
const __VLS_837 = ParamSettingDialog;
// @ts-ignore
const __VLS_838 = __VLS_asFunctionalComponent1(__VLS_837, new __VLS_837({
    ...{ 'onRefresh': {} },
    ref: "ParamSettingDialogRef",
}));
const __VLS_839 = __VLS_838({
    ...{ 'onRefresh': {} },
    ref: "ParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_838));
let __VLS_842;
const __VLS_843 = {
    /** @type {typeof __VLS_842.refresh} */
    onRefresh: (__VLS_ctx.refreshParam),
};
var __VLS_844;
var __VLS_840;
var __VLS_841;
const __VLS_846 = AddKnowledgeDialog;
// @ts-ignore
const __VLS_847 = __VLS_asFunctionalComponent1(__VLS_846, new __VLS_846({
    ...{ 'onAddData': {} },
    ref: "AddKnowledgeDialogRef",
    data: (__VLS_ctx.knowledgeList),
    loading: (__VLS_ctx.knowledgeLoading),
}));
const __VLS_848 = __VLS_847({
    ...{ 'onAddData': {} },
    ref: "AddKnowledgeDialogRef",
    data: (__VLS_ctx.knowledgeList),
    loading: (__VLS_ctx.knowledgeLoading),
}, ...__VLS_functionalComponentArgsRest(__VLS_847));
let __VLS_851;
const __VLS_852 = {
    /** @type {typeof __VLS_851.addData} */
    onAddData: (__VLS_ctx.addKnowledge),
};
var __VLS_853;
var __VLS_849;
var __VLS_850;
const __VLS_855 = ReasoningParamSettingDialog;
// @ts-ignore
const __VLS_856 = __VLS_asFunctionalComponent1(__VLS_855, new __VLS_855({
    ...{ 'onRefresh': {} },
    ref: "ReasoningParamSettingDialogRef",
}));
const __VLS_857 = __VLS_856({
    ...{ 'onRefresh': {} },
    ref: "ReasoningParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_856));
let __VLS_860;
const __VLS_861 = {
    /** @type {typeof __VLS_860.refresh} */
    onRefresh: (__VLS_ctx.submitReasoningDialog),
};
var __VLS_862;
var __VLS_858;
var __VLS_859;
const __VLS_864 = McpServersDialog;
// @ts-ignore
const __VLS_865 = __VLS_asFunctionalComponent1(__VLS_864, new __VLS_864({
    ...{ 'onRefresh': {} },
    ref: "mcpServersDialogRef",
}));
const __VLS_866 = __VLS_865({
    ...{ 'onRefresh': {} },
    ref: "mcpServersDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_865));
let __VLS_869;
const __VLS_870 = {
    /** @type {typeof __VLS_869.refresh} */
    onRefresh: (__VLS_ctx.submitMcpServersDialog),
};
var __VLS_871;
var __VLS_867;
var __VLS_868;
const __VLS_873 = ToolDialog;
// @ts-ignore
const __VLS_874 = __VLS_asFunctionalComponent1(__VLS_873, new __VLS_873({
    ...{ 'onRefresh': {} },
    ref: "toolDialogRef",
    tool_type: "CUSTOM,WORKFLOW",
}));
const __VLS_875 = __VLS_874({
    ...{ 'onRefresh': {} },
    ref: "toolDialogRef",
    tool_type: "CUSTOM,WORKFLOW",
}, ...__VLS_functionalComponentArgsRest(__VLS_874));
let __VLS_878;
const __VLS_879 = {
    /** @type {typeof __VLS_878.refresh} */
    onRefresh: (__VLS_ctx.submitToolDialog),
};
var __VLS_880;
var __VLS_876;
var __VLS_877;
const __VLS_882 = ToolDialog;
// @ts-ignore
const __VLS_883 = __VLS_asFunctionalComponent1(__VLS_882, new __VLS_882({
    ...{ 'onRefresh': {} },
    ref: "skillToolDialogRef",
    tool_type: "SKILL",
}));
const __VLS_884 = __VLS_883({
    ...{ 'onRefresh': {} },
    ref: "skillToolDialogRef",
    tool_type: "SKILL",
}, ...__VLS_functionalComponentArgsRest(__VLS_883));
let __VLS_887;
const __VLS_888 = {
    /** @type {typeof __VLS_887.refresh} */
    onRefresh: (__VLS_ctx.submitSkillToolDialog),
};
var __VLS_889;
var __VLS_885;
var __VLS_886;
const __VLS_891 = ApplicationDialog;
// @ts-ignore
const __VLS_892 = __VLS_asFunctionalComponent1(__VLS_891, new __VLS_891({
    ...{ 'onRefresh': {} },
    ref: "applicationDialogRef",
}));
const __VLS_893 = __VLS_892({
    ...{ 'onRefresh': {} },
    ref: "applicationDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_892));
let __VLS_896;
const __VLS_897 = {
    /** @type {typeof __VLS_896.refresh} */
    onRefresh: (__VLS_ctx.submitApplicationDialog),
};
var __VLS_898;
var __VLS_894;
var __VLS_895;
const __VLS_900 = LongTermSettingDialog;
// @ts-ignore
const __VLS_901 = __VLS_asFunctionalComponent1(__VLS_900, new __VLS_900({
    ...{ 'onRefresh': {} },
    ref: "LongTermSettingDialogRef",
}));
const __VLS_902 = __VLS_901({
    ...{ 'onRefresh': {} },
    ref: "LongTermSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_901));
let __VLS_905;
const __VLS_906 = {
    /** @type {typeof __VLS_905.refresh} */
    onRefresh: (__VLS_ctx.submitLongTermSettingDialog),
};
var __VLS_907;
var __VLS_903;
var __VLS_904;
// @ts-ignore
var __VLS_46 = __VLS_45, __VLS_800 = __VLS_799, __VLS_809 = __VLS_808, __VLS_818 = __VLS_817, __VLS_827 = __VLS_826, __VLS_836 = __VLS_835, __VLS_845 = __VLS_844, __VLS_854 = __VLS_853, __VLS_863 = __VLS_862, __VLS_872 = __VLS_871, __VLS_881 = __VLS_880, __VLS_890 = __VLS_889, __VLS_899 = __VLS_898, __VLS_908 = __VLS_907;
// @ts-ignore
[refreshParam, knowledgeList, refreshForm, refreshLongTermForm, replace, refreshTTSForm, refreshSTTForm, knowledgeLoading, addKnowledge, submitReasoningDialog, submitMcpServersDialog, submitToolDialog, submitSkillToolDialog, submitApplicationDialog, submitLongTermSettingDialog,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
