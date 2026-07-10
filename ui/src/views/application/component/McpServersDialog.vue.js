/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { MsgError } from '@/utils/message.ts';
import { t } from '@/locales';
import { resetUrl } from '@/utils/common';
const emit = defineEmits(['refresh']);
const paramFormRef = ref();
const mcpServerJson = `{
  "math": {
    "url": "your_server",
    "transport": "sse"
  }
}`;
const form = ref({
    mcp_servers: '',
    mcp_tool_ids: [],
    mcp_source: 'referencing',
});
const mcpToolSelectOptions = ref([]);
const dialogVisible = ref(false);
const loading = ref(false);
watch(dialogVisible, (bool) => {
    if (!bool) {
        form.value = {
            mcp_servers: '',
            mcp_tool_ids: [],
            mcp_source: 'referencing',
        };
        paramFormRef.value?.clearValidate();
    }
});
function mcpSourceChange() {
    if (form.value.mcp_source === 'referencing') {
        form.value.mcp_servers = '';
    }
    else {
        form.value.mcp_tool_ids = [];
    }
}
const open = (data, selectOptions) => {
    form.value = { ...form.value, ...data };
    if (data.mcp_servers && Object.keys(data.mcp_servers).length > 0) {
        form.value.mcp_source = 'custom';
    }
    else if (data.mcp_tool_ids) {
        form.value.mcp_source = 'referencing';
        form.value.mcp_tool_ids = data.mcp_tool_ids;
        form.value.mcp_servers = '';
    }
    else {
        form.value.mcp_source = data.mcp_source || 'referencing';
    }
    dialogVisible.value = true;
    mcpToolSelectOptions.value = selectOptions || [];
};
const submit = () => {
    paramFormRef.value.validate((valid) => {
        if (valid) {
            try {
                JSON.parse(form.value.mcp_servers || '{}');
            }
            catch (e) {
                MsgError(t('workflow.nodes.mcpNode.mcpServerTip'));
                return;
            }
            emit('refresh', form.value);
            dialogVisible.value = false;
        }
    });
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    alignCenter: true,
    title: (__VLS_ctx.$t('common.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('common.setting')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form'] | typeof __VLS_components.elForm | typeof __VLS_components.ElForm | typeof __VLS_components['el-form']} */
elForm;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
    hideRequiredAsterisk: true,
}));
const __VLS_9 = __VLS_8({
    ...{ 'onSubmit': {} },
    labelPosition: "top",
    ref: "paramFormRef",
    model: (__VLS_ctx.form),
    requireAsteriskPosition: "right",
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
const __VLS_18 = __VLS_asFunctionalComponent1(__VLS_17, new __VLS_17({}));
const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
const { default: __VLS_22 } = __VLS_20.slots;
let __VLS_23;
/** @ts-ignore @type { | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group'] | typeof __VLS_components.elRadioGroup | typeof __VLS_components.ElRadioGroup | typeof __VLS_components['el-radio-group']} */
elRadioGroup;
// @ts-ignore
const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.mcp_source),
}));
const __VLS_25 = __VLS_24({
    ...{ 'onChange': {} },
    modelValue: (__VLS_ctx.form.mcp_source),
}, ...__VLS_functionalComponentArgsRest(__VLS_24));
let __VLS_28;
const __VLS_29 = {
    /** @type {typeof __VLS_28.change} */
    onChange: (__VLS_ctx.mcpSourceChange),
};
const { default: __VLS_30 } = __VLS_26.slots;
let __VLS_31;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
    value: "referencing",
}));
const __VLS_33 = __VLS_32({
    value: "referencing",
}, ...__VLS_functionalComponentArgsRest(__VLS_32));
const { default: __VLS_36 } = __VLS_34.slots;
(__VLS_ctx.$t('workflow.nodes.mcpNode.reference'));
// @ts-ignore
[$t, $t, dialogVisible, form, form, mcpSourceChange,];
var __VLS_34;
let __VLS_37;
/** @ts-ignore @type { | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio'] | typeof __VLS_components.elRadio | typeof __VLS_components.ElRadio | typeof __VLS_components['el-radio']} */
elRadio;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
    value: "custom",
}));
const __VLS_39 = __VLS_38({
    value: "custom",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
const { default: __VLS_42 } = __VLS_40.slots;
(__VLS_ctx.$t('common.custom'));
// @ts-ignore
[$t,];
var __VLS_40;
// @ts-ignore
[];
var __VLS_26;
var __VLS_27;
// @ts-ignore
[];
var __VLS_20;
if (__VLS_ctx.form.mcp_source === 'referencing') {
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        rules: ([
            {
                required: true,
                message: __VLS_ctx.$t('common.selectPlaceholder') + ` MCP ${__VLS_ctx.$t('views.tool.title')}`,
            },
        ]),
        prop: "mcp_tool_ids",
    }));
    const __VLS_45 = __VLS_44({
        rules: ([
            {
                required: true,
                message: __VLS_ctx.$t('common.selectPlaceholder') + ` MCP ${__VLS_ctx.$t('views.tool.title')}`,
            },
        ]),
        prop: "mcp_tool_ids",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    const { default: __VLS_48 } = __VLS_46.slots;
    {
        const { label: __VLS_49 } = __VLS_46.slots;
        (`MCP ${__VLS_ctx.$t('views.tool.title')}`);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        // @ts-ignore
        [$t, $t, $t, form,];
    }
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select'] | typeof __VLS_components.elSelect | typeof __VLS_components.ElSelect | typeof __VLS_components['el-select']} */
    elSelect;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
        modelValue: (__VLS_ctx.form.mcp_tool_ids),
        filterable: true,
        multiple: true,
        reserveKeyword: (false),
    }));
    const __VLS_52 = __VLS_51({
        modelValue: (__VLS_ctx.form.mcp_tool_ids),
        filterable: true,
        multiple: true,
        reserveKeyword: (false),
    }, ...__VLS_functionalComponentArgsRest(__VLS_51));
    const { default: __VLS_55 } = __VLS_53.slots;
    for (const [mcpTool] of __VLS_vFor((__VLS_ctx.mcpToolSelectOptions))) {
        let __VLS_56;
        /** @ts-ignore @type { | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option'] | typeof __VLS_components.elOption | typeof __VLS_components.ElOption | typeof __VLS_components['el-option']} */
        elOption;
        // @ts-ignore
        const __VLS_57 = __VLS_asFunctionalComponent1(__VLS_56, new __VLS_56({
            key: (mcpTool.id),
            label: (mcpTool.name),
            value: (mcpTool.id),
        }));
        const __VLS_58 = __VLS_57({
            key: (mcpTool.id),
            label: (mcpTool.name),
            value: (mcpTool.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_57));
        const { default: __VLS_61 } = __VLS_59.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        if (mcpTool?.icon) {
            let __VLS_62;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }));
            const __VLS_64 = __VLS_63({
                shape: "square",
                size: (20),
                ...{ style: {} },
                ...{ class: "mr-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_63));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_67 } = __VLS_65.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.resetUrl(mcpTool?.icon)),
                alt: "",
            });
            // @ts-ignore
            [form, mcpToolSelectOptions, resetUrl,];
            var __VLS_65;
        }
        else {
            let __VLS_68;
            /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
            elAvatar;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
                shape: "square",
                size: (20),
                ...{ class: "mr-8" },
                ...{ style: {} },
            }));
            const __VLS_70 = __VLS_69({
                shape: "square",
                size: (20),
                ...{ class: "mr-8" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const { default: __VLS_73 } = __VLS_71.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: "@/assets/tool/icon_mcp.svg",
                ...{ style: {} },
                alt: "",
            });
            // @ts-ignore
            [];
            var __VLS_71;
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
                ...{ class: "info-tag ml-8 mt-4" },
            }));
            const __VLS_76 = __VLS_75({
                size: "small",
                type: "info",
                ...{ class: "info-tag ml-8 mt-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_75));
            /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
            const { default: __VLS_79 } = __VLS_77.slots;
            (__VLS_ctx.$t('views.shared.title'));
            // @ts-ignore
            [$t,];
            var __VLS_77;
        }
        // @ts-ignore
        [];
        var __VLS_59;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_53;
    // @ts-ignore
    [];
    var __VLS_46;
}
else {
    let __VLS_80;
    /** @ts-ignore @type { | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item'] | typeof __VLS_components.elFormItem | typeof __VLS_components.ElFormItem | typeof __VLS_components['el-form-item']} */
    elFormItem;
    // @ts-ignore
    const __VLS_81 = __VLS_asFunctionalComponent1(__VLS_80, new __VLS_80({
        prop: "mcp_servers",
        rules: ([
            {
                required: true,
                message: __VLS_ctx.$t('common.inputPlaceholder') + ' ' + __VLS_ctx.$t('views.tool.mcp.label'),
            },
        ]),
    }));
    const __VLS_82 = __VLS_81({
        prop: "mcp_servers",
        rules: ([
            {
                required: true,
                message: __VLS_ctx.$t('common.inputPlaceholder') + ' ' + __VLS_ctx.$t('views.tool.mcp.label'),
            },
        ]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_81));
    const { default: __VLS_85 } = __VLS_83.slots;
    {
        const { label: __VLS_86 } = __VLS_83.slots;
        (__VLS_ctx.$t('views.tool.mcp.label'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "color-danger" },
        });
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        let __VLS_87;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_88 = __VLS_asFunctionalComponent1(__VLS_87, new __VLS_87({
            type: "info",
            ...{ class: "color-secondary" },
        }));
        const __VLS_89 = __VLS_88({
            type: "info",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_88));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        const { default: __VLS_92 } = __VLS_90.slots;
        (__VLS_ctx.$t('views.tool.mcp.tip'));
        // @ts-ignore
        [$t, $t, $t, $t,];
        var __VLS_90;
        // @ts-ignore
        [];
    }
    let __VLS_93;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({
        modelValue: (__VLS_ctx.form.mcp_servers),
        rows: (6),
        type: "textarea",
        placeholder: (__VLS_ctx.mcpServerJson),
    }));
    const __VLS_95 = __VLS_94({
        modelValue: (__VLS_ctx.form.mcp_servers),
        rows: (6),
        type: "textarea",
        placeholder: (__VLS_ctx.mcpServerJson),
    }, ...__VLS_functionalComponentArgsRest(__VLS_94));
    // @ts-ignore
    [form, mcpServerJson,];
    var __VLS_83;
}
// @ts-ignore
[];
var __VLS_10;
var __VLS_11;
{
    const { footer: __VLS_98 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dialog-footer" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    let __VLS_99;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_100 = __VLS_asFunctionalComponent1(__VLS_99, new __VLS_99({
        ...{ 'onClick': {} },
    }));
    const __VLS_101 = __VLS_100({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_100));
    let __VLS_104;
    const __VLS_105 = {
        /** @type {typeof __VLS_104.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.dialogVisible = false;
            // @ts-ignore
            [dialogVisible,];
        },
    };
    const { default: __VLS_106 } = __VLS_102.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_102;
    var __VLS_103;
    let __VLS_107;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_109 = __VLS_108({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    let __VLS_112;
    const __VLS_113 = {
        /** @type {typeof __VLS_112.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.submit();
            // @ts-ignore
            [loading, submit,];
        },
    };
    const { default: __VLS_114 } = __VLS_110.slots;
    (__VLS_ctx.$t('common.save'));
    // @ts-ignore
    [$t,];
    var __VLS_110;
    var __VLS_111;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_15 = __VLS_14;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
