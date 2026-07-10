/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { cloneDeep, set } from 'lodash';
import NodeContainer from '@/workflow/common/NodeContainer.vue';
import { computed, inject, onMounted, ref } from 'vue';
import { isLastNode } from '@/workflow/common/data';
import { t } from '@/locales';
import { MsgError, MsgSuccess } from '@/utils/message';
import TooltipLabel from '@/components/dynamics-form/items/label/TooltipLabel.vue';
import NodeCascader from '@/workflow/common/NodeCascader.vue';
import McpServerInputDialog from './component/McpServerInputDialog.vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { resetUrl } from '@/utils/common';
import { WorkflowMode } from '@/enums/application';
const props = defineProps();
const route = useRoute();
const { params: { id }, } = route;
const getResourceDetail = inject('getResourceDetail');
const workflow_mode = inject('workflowMode') || WorkflowMode.Application;
const resource = getResourceDetail();
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else {
        return 'workspace';
    }
});
const dynamicsFormRef = ref();
const loading = ref(false);
const mcpServerJson = `{
  "math": {
    "url": "your_server",
    "transport": "sse"
  }
}`;
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
    mcp_tool: '',
    mcp_tools: [],
    mcp_servers: '',
    mcp_server: '',
    mcp_source: 'referencing',
    mcp_tool_id: '',
    tool_params: {},
    tool_form_field: [],
    params_nested: '',
};
const mcpToolSelectOptions = ref([]);
function submitDialog(val) {
    set(props.nodeModel.properties.node_data, 'mcp_servers', val);
}
async function mcpToolSelectChange() {
    const tool = await loadSharedApi({ type: 'tool', systemType: apiType.value }).getToolById(form_data.value.mcp_tool_id, loading);
    form_data.value.mcp_servers = tool.data.code;
}
function getTools() {
    if (form_data.value.mcp_source === 'referencing' && !form_data.value.mcp_tool_id) {
        MsgError(t('workflow.nodes.mcpNode.mcpToolTip'));
        return;
    }
    if (form_data.value.mcp_source === 'referencing' && form_data.value.mcp_tool_id) {
        if (!mcpToolSelectOptions.value.find((item) => item.id === form_data.value.mcp_tool_id)) {
            MsgError(t('workflow.nodes.mcpNode.mcpToolTip'));
            return;
        }
    }
    if (form_data.value.mcp_source === 'custom' && !form_data.value.mcp_servers) {
        MsgError(t('workflow.nodes.mcpNode.mcpServerTip'));
        return;
    }
    try {
        JSON.parse(form_data.value.mcp_servers);
        const vars = extractPlaceholders(form_data.value.mcp_servers);
        if (vars.length > 0) {
            mcpServerInputDialogRef.value.open(vars);
            return;
        }
    }
    catch (e) {
        MsgError(t('workflow.nodes.mcpNode.mcpServerTip'));
        return;
    }
    // Everything OK, fetching tool
    _getTools(form_data.value.mcp_servers);
}
function _getTools(mcp_servers) {
    console.log({
        type: [WorkflowMode.Application, WorkflowMode.ApplicationLoop].includes(workflow_mode)
            ? 'application'
            : 'knowledge',
        systemType: apiType.value,
    });
    const resourceDict = {
        [WorkflowMode.Application]: 'application',
        [WorkflowMode.ApplicationLoop]: 'application',
        [WorkflowMode.Knowledge]: 'knowledge',
        [WorkflowMode.KnowledgeLoop]: 'knowledge',
        [WorkflowMode.Tool]: 'tool',
        [WorkflowMode.ToolLoop]: 'tool',
    };
    loadSharedApi({
        type: resourceDict[workflow_mode],
        systemType: apiType.value,
    })
        .getMcpTools(id, mcp_servers, loading)
        .then((res) => {
        form_data.value.mcp_tools = res.data;
        MsgSuccess(t('workflow.nodes.mcpNode.getToolsSuccess'));
        // JSON modified, refreshing mcp_server
        form_data.value.mcp_server = form_data.value.mcp_tools.find((item) => item.name === form_data.value.mcp_tool)?.server;
    });
}
const mcpServerInputDialogRef = ref();
// Extract all placeholder ({{...}}) variable paths from JSON
function extractPlaceholders(input) {
    const re = /\{\{\s*([a-zA-Z_][\w.]*)\s*\}\}/g; // capture {{ path.like.this }}
    const found = new Set();
    const visit = (v) => {
        if (typeof v === 'string') {
            let m;
            while ((m = re.exec(v)) !== null)
                found.add(m[1]);
        }
        else if (Array.isArray(v)) {
            v.forEach(visit);
        }
        else if (v && typeof v === 'object') {
            Object.values(v).forEach(visit);
        }
    };
    // If input is a JSON string, try to parse it; otherwise treat as string/object
    if (typeof input === 'string') {
        try {
            visit(JSON.parse(input));
        }
        catch {
            visit(input);
        }
    }
    else {
        visit(input);
    }
    return [...found];
}
function handleMcpVariables(vars) {
    let mcp_servers = form_data.value.mcp_servers;
    for (const item in vars) {
        mcp_servers = mcp_servers.replace(`{{${item}}}`, vars[item]);
    }
    // Everything OK, fetching tool
    _getTools(mcp_servers);
}
function changeTool() {
    form_data.value.mcp_server = form_data.value.mcp_tools.find((item) => item.name === form_data.value.mcp_tool)?.server;
    const args_schema = form_data.value.mcp_tools.find((item) => item.name === form_data.value.mcp_tool)?.args_schema;
    form_data.value.tool_form_field = [];
    for (const item in args_schema?.properties) {
        const params = args_schema?.properties[item].properties;
        if (params) {
            form_data.value.params_nested = item;
            for (const item2 in params) {
                let input_type = 'TextInput';
                if (params[item2].type === 'string') {
                    input_type = 'TextInput';
                }
                else if (params[item2].type === 'number') {
                    input_type = 'NumberInput';
                }
                else if (params[item2].type === 'boolean') {
                    input_type = 'SwitchInput';
                }
                else if (params[item2].type === 'array') {
                    input_type = 'JsonInput';
                }
                else if (params[item2].type === 'object') {
                    input_type = 'JsonInput';
                }
                form_data.value.tool_form_field.push({
                    field: item2,
                    label: {
                        input_type: 'TooltipLabel',
                        label: item2,
                        attrs: { tooltip: params[item2].description },
                        props_info: {},
                    },
                    input_type: input_type,
                    source: 'referencing',
                    required: args_schema.properties[item].required?.indexOf(item2) !== -1,
                    props_info: {
                        rules: [
                            {
                                required: args_schema.properties[item].required?.indexOf(item2) !== -1,
                                message: t('dynamicsForm.tip.requiredMessage'),
                                trigger: 'blur',
                            },
                        ],
                    },
                });
            }
        }
        else {
            form_data.value.params_nested = '';
            let input_type = 'TextInput';
            if (args_schema.properties[item].type === 'string') {
                input_type = 'TextInput';
            }
            else if (args_schema.properties[item].type === 'number') {
                input_type = 'NumberInput';
            }
            else if (args_schema.properties[item].type === 'boolean') {
                input_type = 'SwitchInput';
            }
            else if (args_schema.properties[item].type === 'array') {
                input_type = 'JsonInput';
            }
            else if (args_schema.properties[item].type === 'object') {
                input_type = 'JsonInput';
            }
            form_data.value.tool_form_field.push({
                field: item,
                label: {
                    input_type: 'TooltipLabel',
                    label: item,
                    attrs: { tooltip: args_schema.properties[item].description },
                    props_info: {},
                },
                input_type: input_type,
                source: 'referencing',
                required: args_schema.required?.indexOf(item) !== -1,
                props_info: {
                    rules: [
                        {
                            required: args_schema.required?.indexOf(item) !== -1,
                            message: t('dynamicsForm.tip.requiredMessage'),
                            trigger: 'blur',
                        },
                    ],
                },
            });
        }
    }
    //
    if (form_data.value.params_nested) {
        form_data.value.tool_params = { [form_data.value.params_nested]: {} };
    }
    else {
        form_data.value.tool_params = {};
    }
}
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
const replyNodeFormRef = ref();
const validate = async () => {
    // For dynamic forms, only validate required fields
    if (dynamicsFormRef.value) {
        const requiredFields = form_data.value.tool_form_field
            .filter((item) => item.required)
            .map((item) => item.label.label);
        if (requiredFields.length > 0) {
            for (const item of requiredFields) {
                if (form_data.value.params_nested) {
                    if (!form_data.value.tool_params[form_data.value.params_nested][item]) {
                        return Promise.reject({
                            node: props.nodeModel,
                            errMessage: item + t('dynamicsForm.tip.requiredMessage'),
                        });
                    }
                }
                else {
                    // This is the no-nesting case
                    if (!form_data.value.tool_params[item]) {
                        return Promise.reject({
                            node: props.nodeModel,
                            errMessage: item + t('dynamicsForm.tip.requiredMessage'),
                        });
                    }
                }
            }
        }
    }
    if (replyNodeFormRef.value) {
        const form = cloneDeep(form_data.value);
        if (!form.mcp_servers) {
            return Promise.reject({
                node: props.nodeModel,
                errMessage: t('workflow.nodes.mcpNode.mcpServerTip'),
            });
        }
        if (!form.mcp_tool) {
            return Promise.reject({
                node: props.nodeModel,
                errMessage: t('workflow.nodes.mcpNode.mcpToolTip'),
            });
        }
    }
};
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
        .getAllToolList(obj, loading)
        .then((res) => {
        mcpToolSelectOptions.value = [...res.data.shared_tools, ...res.data.tools].filter((item) => item.is_active);
    });
}
onMounted(() => {
    if (typeof props.nodeModel.properties.node_data?.is_result === 'undefined') {
        if (isLastNode(props.nodeModel)) {
            set(props.nodeModel.properties.node_data, 'is_result', true);
        }
    }
    if (props.nodeModel.properties.node_data.mcp_servers &&
        !props.nodeModel.properties.node_data.mcp_source) {
        set(props.nodeModel.properties.node_data, 'mcp_source', 'custom');
    }
    getMcpToolSelectOptions();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "border-r-6 p-8-12 mb-8 layout-bg lighter" },
});
/** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "replyNodeFormRef",
    hideRequiredAsterisk: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    model: (__VLS_ctx.form_data),
    labelPosition: "top",
    requireAsteriskPosition: "right",
    labelWidth: "auto",
    ref: "replyNodeFormRef",
    hideRequiredAsterisk: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_12;
const __VLS_13 = {
    /** @type {typeof __VLS_12.submit} */
    onSubmit: () => { },
};
var __VLS_14;
const { default: __VLS_16 } = __VLS_10.slots;
let __VLS_17;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({
    label: "MCP Server Config",
}));
const __VLS_19 = __VLS_18({
    label: "MCP Server Config",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
{
    const { label: __VLS_23 } = __VLS_20.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "color-danger" },
    });
    /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.mcp_source),
        size: "small",
        ...{ style: {} },
    }));
    const __VLS_26 = __VLS_25({
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.mcp_source),
        size: "small",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
        label: (__VLS_ctx.$t('workflow.nodes.mcpNode.reference')),
        value: "referencing",
    }));
    const __VLS_32 = __VLS_31({
        label: (__VLS_ctx.$t('workflow.nodes.mcpNode.reference')),
        value: "referencing",
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }));
    const __VLS_37 = __VLS_36({
        label: (__VLS_ctx.$t('common.custom')),
        value: "custom",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    // @ts-ignore
    [nodeModel, $t, $t, $t, form_data, form_data,];
    var __VLS_27;
    // @ts-ignore
    [];
}
if (__VLS_ctx.form_data.mcp_source === 'custom') {
    let __VLS_40;
    /** @ts-ignore @type { | typeof __VLS_components.MdEditorMagnify} */
    MdEditorMagnify;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
        ...{ 'onWheel': {} },
        ...{ 'onSubmitDialog': {} },
        title: "MCP Server Config",
        modelValue: (__VLS_ctx.form_data.mcp_servers),
        ...{ style: {} },
        placeholder: (__VLS_ctx.mcpServerJson),
    }));
    const __VLS_42 = __VLS_41({
        ...{ 'onWheel': {} },
        ...{ 'onSubmitDialog': {} },
        title: "MCP Server Config",
        modelValue: (__VLS_ctx.form_data.mcp_servers),
        ...{ style: {} },
        placeholder: (__VLS_ctx.mcpServerJson),
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    let __VLS_45;
    const __VLS_46 = {
        /** @type {typeof __VLS_45.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const __VLS_47 = {
        /** @type {typeof __VLS_45.submitDialog} */
        onSubmitDialog: (__VLS_ctx.submitDialog),
    };
    var __VLS_43;
    var __VLS_44;
}
else {
    let __VLS_48;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
        ...{ 'onChange': {} },
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.mcp_tool_id),
        filterable: true,
    }));
    const __VLS_50 = __VLS_49({
        ...{ 'onChange': {} },
        ...{ 'onWheel': {} },
        teleported: (false),
        modelValue: (__VLS_ctx.form_data.mcp_tool_id),
        filterable: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_49));
    let __VLS_53;
    const __VLS_54 = {
        /** @type {typeof __VLS_53.change} */
        onChange: (__VLS_ctx.mcpToolSelectChange),
    };
    const __VLS_55 = {
        /** @type {typeof __VLS_53.wheel} */
        onWheel: (__VLS_ctx.wheel),
    };
    const { default: __VLS_56 } = __VLS_51.slots;
    for (const [mcpTool] of __VLS_vFor((__VLS_ctx.mcpToolSelectOptions))) {
        let __VLS_57;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_58 = __VLS_asFunctionalComponent1(__VLS_57, new __VLS_57({
            key: (mcpTool.id),
            label: (mcpTool.name),
            value: (mcpTool.id),
        }));
        const __VLS_59 = __VLS_58({
            key: (mcpTool.id),
            label: (mcpTool.name),
            value: (mcpTool.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_58));
        const { default: __VLS_62 } = __VLS_60.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (mcpTool?.icon) {
            let __VLS_63;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_65 = __VLS_64({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_64));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_68 } = __VLS_66.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(mcpTool?.icon)),
                alt: "",
            });
            // @ts-ignore
            [form_data, form_data, form_data, mcpServerJson, wheel, wheel, submitDialog, mcpToolSelectChange, mcpToolSelectOptions, resetUrl,];
            var __VLS_66;
        }
        else {
            let __VLS_69;
            /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
            ToolIcon;
            // @ts-ignore
            const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
                size: (20),
                type: (mcpTool?.tool_type),
                ...{ class: "mr-8" },
            }));
            const __VLS_71 = __VLS_70({
                size: (20),
                type: (mcpTool?.tool_type),
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_70));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        }
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (mcpTool.name);
        if (mcpTool.scope === 'SHARED') {
            let __VLS_74;
            /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
            elTag;
            // @ts-ignore
            const __VLS_75 = __VLS_asFunctionalComponent1(__VLS_74, new __VLS_74({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-8" },
            }));
            const __VLS_76 = __VLS_75({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_75));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            const { default: __VLS_79 } = __VLS_77.slots;
            (__VLS_ctx.t('views.shared.title'));
            // @ts-ignore
            [t,];
            var __VLS_77;
        }
        // @ts-ignore
        [];
        var __VLS_60;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_51;
    var __VLS_52;
}
// @ts-ignore
[];
var __VLS_20;
let __VLS_80;
/** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
elFormItem;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({}));
const __VLS_82 = __VLS_81({}, ...__VLS_functionalComponentArgsRest(__VLS_81));
const { default: __VLS_85 } = __VLS_83.slots;
{
    const { label: __VLS_86 } = __VLS_83.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('views.tool.title'));
    let __VLS_87;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }));
    const __VLS_89 = __VLS_88({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_88));
    let __VLS_92;
    const __VLS_93 = {
        /** @type {typeof __VLS_92.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.getTools();
            // @ts-ignore
            [$t, getTools,];
        },
    };
    const { default: __VLS_94 } = __VLS_90.slots;
    let __VLS_95;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_96 = __VLS_asFunctionalComponent1(__VLS_95, new __VLS_95({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_97 = __VLS_96({
        iconName: "app-add-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_96));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('workflow.nodes.mcpNode.getTool'));
    // @ts-ignore
    [$t,];
    var __VLS_90;
    var __VLS_91;
    // @ts-ignore
    [];
}
let __VLS_100;
/** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
elSelect;
// @ts-ignore
const __VLS_101 = __VLS_asFunctionalComponent1(__VLS_100, new __VLS_100({
    ...{ 'onChange': {} },
    ...{ 'onWheel': {} },
    modelValue: (__VLS_ctx.form_data.mcp_tool),
    filterable: true,
    teleported: (false),
}));
const __VLS_102 = __VLS_101({
    ...{ 'onChange': {} },
    ...{ 'onWheel': {} },
    modelValue: (__VLS_ctx.form_data.mcp_tool),
    filterable: true,
    teleported: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_101));
let __VLS_105;
const __VLS_106 = {
    /** @type {typeof __VLS_105.change} */
    onChange: (__VLS_ctx.changeTool),
};
const __VLS_107 = {
    /** @type {typeof __VLS_105.wheel} */
    onWheel: (__VLS_ctx.wheel),
};
const { default: __VLS_108 } = __VLS_103.slots;
for (const [item] of __VLS_vFor((__VLS_ctx.form_data.mcp_tools))) {
    let __VLS_109;
    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
    elOption;
    // @ts-ignore
    const __VLS_110 = __VLS_asFunctionalComponent1(__VLS_109, new __VLS_109({
        key: (item.value),
        label: (item.name),
        value: (item.name),
        ...{ class: "flex align-center" },
    }));
    const __VLS_111 = __VLS_110({
        key: (item.value),
        label: (item.name),
        value: (item.name),
        ...{ class: "flex align-center" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_110));
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    const { default: __VLS_114 } = __VLS_112.slots;
    let __VLS_115;
    /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
    elTooltip;
    // @ts-ignore
    const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
        effect: "dark",
        content: (item.description),
        placement: "top-start",
        popperClass: "max-w-350",
    }));
    const __VLS_117 = __VLS_116({
        effect: "dark",
        content: (item.description),
        placement: "top-start",
        popperClass: "max-w-350",
    }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    const { default: __VLS_120 } = __VLS_118.slots;
    let __VLS_121;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_122 = __VLS_asFunctionalComponent1(__VLS_121, new __VLS_121({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }));
    const __VLS_123 = __VLS_122({
        iconName: "app-warning",
        ...{ class: "app-warning-icon" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_122));
    /** @type {__VLS_StyleScopedClasses['app-warning-icon']} */ ;
    // @ts-ignore
    [form_data, form_data, wheel, changeTool,];
    var __VLS_118;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (item.name);
    // @ts-ignore
    [];
    var __VLS_112;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_103;
var __VLS_104;
// @ts-ignore
[];
var __VLS_83;
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
__VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
    ...{ class: "title-decoration-1 mb-8" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
(__VLS_ctx.$t('workflow.nodes.mcpNode.toolParam'));
if (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested]) {
    if (!__VLS_ctx.form_data.mcp_tool) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        let __VLS_126;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
            type: "info",
        }));
        const __VLS_128 = __VLS_127({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_127));
        const { default: __VLS_131 } = __VLS_129.slots;
        (__VLS_ctx.$t('common.noData'));
        // @ts-ignore
        [$t, $t, form_data, form_data, form_data,];
        var __VLS_129;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "border-r-6 p-8-12 mb-8 layout-bg lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        if (__VLS_ctx.form_data.mcp_tool) {
            let __VLS_132;
            /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
            elForm;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
                ...{ 'onSubmit': {} },
                ref: "dynamicsFormRef",
                labelPosition: "top",
                requireAsteriskPosition: "right",
                hideRequiredAsterisk: (true),
            }));
            const __VLS_134 = __VLS_133({
                ...{ 'onSubmit': {} },
                ref: "dynamicsFormRef",
                labelPosition: "top",
                requireAsteriskPosition: "right",
                hideRequiredAsterisk: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            let __VLS_137;
            const __VLS_138 = {
                /** @type {typeof __VLS_137.submit} */
                onSubmit: () => { },
            };
            __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
            var __VLS_139;
            const { default: __VLS_141 } = __VLS_135.slots;
            for (const [item] of __VLS_vFor((__VLS_ctx.form_data.tool_form_field))) {
                let __VLS_142;
                /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
                elFormItem;
                // @ts-ignore
                const __VLS_143 = __VLS_asFunctionalComponent1(__VLS_142, new __VLS_142({
                    key: (item.field),
                    required: (item.required),
                }));
                const __VLS_144 = __VLS_143({
                    key: (item.field),
                    required: (item.required),
                }, ...__VLS_functionalComponentArgsRest(__VLS_143));
                const { default: __VLS_147 } = __VLS_145.slots;
                {
                    const { label: __VLS_148 } = __VLS_145.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex-between" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                    if (item.label.attrs.tooltip) {
                        const __VLS_149 = TooltipLabel;
                        // @ts-ignore
                        const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
                            label: (item.label),
                            tooltip: (item.label.attrs.tooltip),
                        }));
                        const __VLS_151 = __VLS_150({
                            label: (item.label),
                            tooltip: (item.label.attrs.tooltip),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
                    }
                    else {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                        (item.label.label);
                    }
                    if (item.required) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-danger" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
                    }
                    let __VLS_154;
                    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
                    elSelect;
                    // @ts-ignore
                    const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
                        ...{ 'onChange': {} },
                        teleported: (false),
                        modelValue: (item.source),
                        size: "small",
                        ...{ style: {} },
                    }));
                    const __VLS_156 = __VLS_155({
                        ...{ 'onChange': {} },
                        teleported: (false),
                        modelValue: (item.source),
                        size: "small",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_155));
                    let __VLS_159;
                    const __VLS_160 = {
                        /** @type {typeof __VLS_159.change} */
                        onChange: (...[$event]) => {
                            if (!(__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested]))
                                throw 0;
                            if (!!(!__VLS_ctx.form_data.mcp_tool))
                                throw 0;
                            if (!(__VLS_ctx.form_data.mcp_tool))
                                throw 0;
                            return __VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label] = '';
                            // @ts-ignore
                            [form_data, form_data, form_data, form_data, vLoading, loading,];
                        },
                    };
                    const { default: __VLS_161 } = __VLS_157.slots;
                    let __VLS_162;
                    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                    elOption;
                    // @ts-ignore
                    const __VLS_163 = __VLS_asFunctionalComponent1(__VLS_162, new __VLS_162({
                        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
                        value: "referencing",
                    }));
                    const __VLS_164 = __VLS_163({
                        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
                        value: "referencing",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
                    let __VLS_167;
                    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                    elOption;
                    // @ts-ignore
                    const __VLS_168 = __VLS_asFunctionalComponent1(__VLS_167, new __VLS_167({
                        label: (__VLS_ctx.$t('common.custom')),
                        value: "custom",
                    }));
                    const __VLS_169 = __VLS_168({
                        label: (__VLS_ctx.$t('common.custom')),
                        value: "custom",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_168));
                    // @ts-ignore
                    [$t, $t,];
                    var __VLS_157;
                    var __VLS_158;
                    // @ts-ignore
                    [];
                }
                if (item.source === 'custom' && item.input_type === 'TextInput') {
                    let __VLS_172;
                    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                    elInput;
                    // @ts-ignore
                    const __VLS_173 = __VLS_asFunctionalComponent1(__VLS_172, new __VLS_172({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }));
                    const __VLS_174 = __VLS_173({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_173));
                }
                else if (item.source === 'custom' && item.input_type === 'NumberInput') {
                    let __VLS_177;
                    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
                    elInputNumber;
                    // @ts-ignore
                    const __VLS_178 = __VLS_asFunctionalComponent1(__VLS_177, new __VLS_177({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }));
                    const __VLS_179 = __VLS_178({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_178));
                }
                else if (item.source === 'custom' && item.input_type === 'SwitchInput') {
                    let __VLS_182;
                    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
                    elSwitch;
                    // @ts-ignore
                    const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }));
                    const __VLS_184 = __VLS_183({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_183));
                }
                else if (item.source === 'custom' && item.input_type === 'JsonInput') {
                    let __VLS_187;
                    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                    elInput;
                    // @ts-ignore
                    const __VLS_188 = __VLS_asFunctionalComponent1(__VLS_187, new __VLS_187({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                        type: "textarea",
                    }));
                    const __VLS_189 = __VLS_188({
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                        type: "textarea",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_188));
                }
                if (item.source === 'referencing') {
                    const __VLS_192 = NodeCascader;
                    // @ts-ignore
                    const __VLS_193 = __VLS_asFunctionalComponent1(__VLS_192, new __VLS_192({
                        ref: "nodeCascaderRef2",
                        nodeModel: (__VLS_ctx.nodeModel),
                        ...{ class: "w-full" },
                        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }));
                    const __VLS_194 = __VLS_193({
                        ref: "nodeCascaderRef2",
                        nodeModel: (__VLS_ctx.nodeModel),
                        ...{ class: "w-full" },
                        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
                        modelValue: (__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested][item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
                    var __VLS_197;
                    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                    var __VLS_195;
                }
                // @ts-ignore
                [nodeModel, $t, form_data, form_data, form_data, form_data, form_data, form_data, form_data, form_data, form_data, form_data,];
                var __VLS_145;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_135;
            var __VLS_136;
        }
    }
}
else {
    if (!__VLS_ctx.form_data.mcp_tool) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        let __VLS_199;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
            type: "info",
        }));
        const __VLS_201 = __VLS_200({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_200));
        const { default: __VLS_204 } = __VLS_202.slots;
        (__VLS_ctx.$t('common.noData'));
        // @ts-ignore
        [$t, form_data,];
        var __VLS_202;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "border-r-6 p-8-12 mb-8 layout-bg lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        if (__VLS_ctx.form_data.mcp_tool) {
            let __VLS_205;
            /** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
            elForm;
            // @ts-ignore
            const __VLS_206 = __VLS_asFunctionalComponent1(__VLS_205, new __VLS_205({
                ...{ 'onSubmit': {} },
                ref: "dynamicsFormRef",
                labelPosition: "top",
                requireAsteriskPosition: "right",
                hideRequiredAsterisk: (true),
            }));
            const __VLS_207 = __VLS_206({
                ...{ 'onSubmit': {} },
                ref: "dynamicsFormRef",
                labelPosition: "top",
                requireAsteriskPosition: "right",
                hideRequiredAsterisk: (true),
            }, ...__VLS_functionalComponentArgsRest(__VLS_206));
            let __VLS_210;
            const __VLS_211 = {
                /** @type {typeof __VLS_210.submit} */
                onSubmit: () => { },
            };
            __VLS_asFunctionalDirective(__VLS_directives.vLoading, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
            var __VLS_212;
            const { default: __VLS_214 } = __VLS_208.slots;
            for (const [item] of __VLS_vFor((__VLS_ctx.form_data.tool_form_field))) {
                let __VLS_215;
                /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
                elFormItem;
                // @ts-ignore
                const __VLS_216 = __VLS_asFunctionalComponent1(__VLS_215, new __VLS_215({
                    key: (item.field),
                    required: (item.required),
                }));
                const __VLS_217 = __VLS_216({
                    key: (item.field),
                    required: (item.required),
                }, ...__VLS_functionalComponentArgsRest(__VLS_216));
                const { default: __VLS_220 } = __VLS_218.slots;
                {
                    const { label: __VLS_221 } = __VLS_218.slots;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                        ...{ class: "flex-between" },
                    });
                    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
                    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
                    if (item.label.attrs.tooltip) {
                        const __VLS_222 = TooltipLabel;
                        // @ts-ignore
                        const __VLS_223 = __VLS_asFunctionalComponent1(__VLS_222, new __VLS_222({
                            label: (item.label),
                            tooltip: (item.label.attrs.tooltip),
                        }));
                        const __VLS_224 = __VLS_223({
                            label: (item.label),
                            tooltip: (item.label.attrs.tooltip),
                        }, ...__VLS_functionalComponentArgsRest(__VLS_223));
                    }
                    else {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
                        (item.label.label);
                    }
                    if (item.required) {
                        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                            ...{ class: "color-danger" },
                        });
                        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
                    }
                    let __VLS_227;
                    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
                    elSelect;
                    // @ts-ignore
                    const __VLS_228 = __VLS_asFunctionalComponent1(__VLS_227, new __VLS_227({
                        ...{ 'onChange': {} },
                        teleported: (false),
                        modelValue: (item.source),
                        size: "small",
                        ...{ style: {} },
                    }));
                    const __VLS_229 = __VLS_228({
                        ...{ 'onChange': {} },
                        teleported: (false),
                        modelValue: (item.source),
                        size: "small",
                        ...{ style: {} },
                    }, ...__VLS_functionalComponentArgsRest(__VLS_228));
                    let __VLS_232;
                    const __VLS_233 = {
                        /** @type {typeof __VLS_232.change} */
                        onChange: (...[$event]) => {
                            if (!!(__VLS_ctx.form_data.tool_params[__VLS_ctx.form_data.params_nested]))
                                throw 0;
                            if (!!(!__VLS_ctx.form_data.mcp_tool))
                                throw 0;
                            if (!(__VLS_ctx.form_data.mcp_tool))
                                throw 0;
                            return __VLS_ctx.form_data.tool_params[item.label.label] = '';
                            // @ts-ignore
                            [form_data, form_data, form_data, vLoading, loading,];
                        },
                    };
                    const { default: __VLS_234 } = __VLS_230.slots;
                    let __VLS_235;
                    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                    elOption;
                    // @ts-ignore
                    const __VLS_236 = __VLS_asFunctionalComponent1(__VLS_235, new __VLS_235({
                        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
                        value: "referencing",
                    }));
                    const __VLS_237 = __VLS_236({
                        label: (__VLS_ctx.$t('workflow.variable.Referencing')),
                        value: "referencing",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_236));
                    let __VLS_240;
                    /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
                    elOption;
                    // @ts-ignore
                    const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
                        label: (__VLS_ctx.$t('common.custom')),
                        value: "custom",
                    }));
                    const __VLS_242 = __VLS_241({
                        label: (__VLS_ctx.$t('common.custom')),
                        value: "custom",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
                    // @ts-ignore
                    [$t, $t,];
                    var __VLS_230;
                    var __VLS_231;
                    // @ts-ignore
                    [];
                }
                if (item.source === 'custom' && item.input_type === 'TextInput') {
                    let __VLS_245;
                    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                    elInput;
                    // @ts-ignore
                    const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }));
                    const __VLS_247 = __VLS_246({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
                }
                else if (item.source === 'custom' && item.input_type === 'NumberInput') {
                    let __VLS_250;
                    /** @ts-ignore @type { | typeof __VLS_components.elInputNumber | typeof __VLS_components.ElInputNumber | typeof __VLS_components['el-input-number']} */
                    elInputNumber;
                    // @ts-ignore
                    const __VLS_251 = __VLS_asFunctionalComponent1(__VLS_250, new __VLS_250({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }));
                    const __VLS_252 = __VLS_251({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_251));
                }
                else if (item.source === 'custom' && item.input_type === 'SwitchInput') {
                    let __VLS_255;
                    /** @ts-ignore @type { | typeof __VLS_components.elSwitch | typeof __VLS_components.ElSwitch | typeof __VLS_components['el-switch']} */
                    elSwitch;
                    // @ts-ignore
                    const __VLS_256 = __VLS_asFunctionalComponent1(__VLS_255, new __VLS_255({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }));
                    const __VLS_257 = __VLS_256({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_256));
                }
                else if (item.source === 'custom' && item.input_type === 'JsonInput') {
                    let __VLS_260;
                    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
                    elInput;
                    // @ts-ignore
                    const __VLS_261 = __VLS_asFunctionalComponent1(__VLS_260, new __VLS_260({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                        type: "textarea",
                    }));
                    const __VLS_262 = __VLS_261({
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                        type: "textarea",
                    }, ...__VLS_functionalComponentArgsRest(__VLS_261));
                }
                if (item.source === 'referencing') {
                    const __VLS_265 = NodeCascader;
                    // @ts-ignore
                    const __VLS_266 = __VLS_asFunctionalComponent1(__VLS_265, new __VLS_265({
                        ref: "nodeCascaderRef2",
                        nodeModel: (__VLS_ctx.nodeModel),
                        ...{ class: "w-full" },
                        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }));
                    const __VLS_267 = __VLS_266({
                        ref: "nodeCascaderRef2",
                        nodeModel: (__VLS_ctx.nodeModel),
                        ...{ class: "w-full" },
                        placeholder: (__VLS_ctx.$t('workflow.variable.placeholder')),
                        modelValue: (__VLS_ctx.form_data.tool_params[item.label.label]),
                    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
                    var __VLS_270;
                    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
                    var __VLS_268;
                }
                // @ts-ignore
                [nodeModel, $t, form_data, form_data, form_data, form_data, form_data,];
                var __VLS_218;
                // @ts-ignore
                [];
            }
            // @ts-ignore
            [];
            var __VLS_208;
            var __VLS_209;
        }
    }
}
const __VLS_272 = McpServerInputDialog;
// @ts-ignore
const __VLS_273 = __VLS_asFunctionalComponent1(__VLS_272, new __VLS_272({
    ...{ 'onRefresh': {} },
    ref: "mcpServerInputDialogRef",
}));
const __VLS_274 = __VLS_273({
    ...{ 'onRefresh': {} },
    ref: "mcpServerInputDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_273));
let __VLS_277;
const __VLS_278 = {
    /** @type {typeof __VLS_277.refresh} */
    onRefresh: (__VLS_ctx.handleMcpVariables),
};
var __VLS_279;
var __VLS_275;
var __VLS_276;
// @ts-ignore
[handleMcpVariables,];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14, __VLS_140 = __VLS_139, __VLS_198 = __VLS_197, __VLS_213 = __VLS_212, __VLS_271 = __VLS_270, __VLS_280 = __VLS_279;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
