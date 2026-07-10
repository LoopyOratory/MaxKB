/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { config } from 'md-editor-v3';
import HtmlRander from './HtmlRander.vue';
import EchartsRander from './EchartsRander.vue';
import FormRander from './FormRander.vue';
import ReasoningRander from './ReasoningRander.vue';
import IframeRender from './IframeRender.vue';
import ToolCallsRender from './tool-calls-render/index.vue';
config({
    markdownItConfig(md) {
        md.renderer.rules.image = (tokens, idx, options) => {
            tokens[idx].attrSet('style', 'display:inline-block;min-height:33px;padding:0;margin:0');
            tokens[idx].attrSet('onerror', `
      this.onerror=null;
      if(!this.src.endsWith("load_error.png")){
        this.src="./load_error.png";
     }
  `);
            return md.renderer.renderToken(tokens, idx, options);
        };
        md.renderer.rules.link_open = (tokens, idx, options) => {
            tokens[idx].attrSet('target', '_blank');
            return md.renderer.renderToken(tokens, idx, options);
        };
    },
});
const props = withDefaults(defineProps(), {
    source: '',
    disabled: false,
});
const TAG_PLUGINS = [
    { tag: 'quick_question', type: 'question' },
    { tag: 'html_rander', type: 'html_rander' },
    { tag: 'iframe_render', type: 'iframe_render' },
    { tag: 'tool_calls_render', type: 'tool_calls_render' },
    {
        tag: 'echarts_rander',
        type: 'echarts_rander',
        transform: (c) => {
            return c;
        },
    },
    { tag: 'form_rander', type: 'form_rander', nested: true },
];
function parseByPlugin(source, plugin) {
    const startTag = `<${plugin.tag}>`;
    const endTag = `</${plugin.tag}>`;
    if (!source.includes(startTag)) {
        return [{ type: 'md', content: source }];
    }
    const result = [];
    let cursor = 0;
    while (cursor < source.length) {
        const start = source.indexOf(startTag, cursor);
        if (start === -1) {
            result.push({
                type: 'md',
                content: source.slice(cursor),
            });
            break;
        }
        if (start > cursor) {
            result.push({
                type: 'md',
                content: source.slice(cursor, start),
            });
        }
        let end = source.indexOf(endTag, start);
        if (end === -1)
            break;
        // ProcessNested
        if (plugin.nested) {
            let depth = 1;
            let tempIndex = start + startTag.length;
            while (depth > 0) {
                const nextStart = source.indexOf(startTag, tempIndex);
                const nextEnd = source.indexOf(endTag, tempIndex);
                if (nextStart !== -1 && nextStart < nextEnd) {
                    depth++;
                    tempIndex = nextStart + startTag.length;
                }
                else {
                    depth--;
                    tempIndex = nextEnd + endTag.length;
                    end = nextEnd;
                }
            }
        }
        let content = source.slice(start + startTag.length, end);
        if (plugin.transform) {
            content = plugin.transform(content);
        }
        result.push({
            type: plugin.type,
            content,
        });
        cursor = end + endTag.length;
    }
    return result;
}
function parseContent(source) {
    let nodes = [{ type: 'md', content: source }];
    TAG_PLUGINS.forEach((plugin) => {
        nodes = nodes.flatMap((node) => {
            if (node.type !== 'md')
                return node;
            return parseByPlugin(node.content, plugin);
        });
    });
    return nodes;
}
const mdViewList = computed(() => {
    return parseContent(props.source || '');
});
const componentMap = {
    html_rander: HtmlRander,
    echarts_rander: EchartsRander,
    form_rander: FormRander,
    iframe_render: IframeRender,
    tool_calls_render: ToolCallsRender,
};
function getComponentProps(item) {
    switch (item.type) {
        case 'form_rander':
            return {
                chat_record_id: props.chat_record_id,
                runtime_node_id: props.runtime_node_id,
                child_node: props.child_node,
                disabled: props.disabled,
                sendMessage: props.sendMessage,
                form_setting: item.content,
            };
        case 'echarts_rander':
            return { option: item.content };
        case 'html_rander':
            return { source: item.content, sendMessage: props.sendMessage };
        case 'iframe_render':
            return { source: item.content, sendMessage: props.sendMessage };
        case 'tool_calls_render':
            return { content: item.content };
        default:
            return {};
    }
}
function handleQuestionClick(content) {
    if (!props.sendMessage)
        return;
    if (props.type === 'log')
        return;
    props.sendMessage(content, 'new');
}
const __VLS_defaults = {
    source: '',
    disabled: false,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.reasoning_content?.trim()) {
    const __VLS_0 = ReasoningRander;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        content: (__VLS_ctx.reasoning_content),
    }));
    const __VLS_2 = __VLS_1({
        content: (__VLS_ctx.reasoning_content),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.mdViewList))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    if (__VLS_ctx.componentMap[item.type]) {
        const __VLS_5 = (__VLS_ctx.componentMap[item.type]);
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            ...(__VLS_ctx.getComponentProps(item)),
        }));
        const __VLS_7 = __VLS_6({
            ...(__VLS_ctx.getComponentProps(item)),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    }
    else if (item.type === 'question') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onClick: (...[$event]) => {
                    if (!!(__VLS_ctx.componentMap[item.type]))
                        throw 0;
                    if (!(item.type === 'question'))
                        throw 0;
                    return __VLS_ctx.handleQuestionClick(item.content);
                    // @ts-ignore
                    [reasoning_content, reasoning_content, mdViewList, componentMap, componentMap, getComponentProps, handleQuestionClick,];
                } },
            ...{ class: "problem-button mt-4 mb-4" },
            ...{ class: (__VLS_ctx.sendMessage && __VLS_ctx.type !== 'log' ? 'cursor' : 'disabled') },
        });
        /** @type {__VLS_StyleScopedClasses['problem-button']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-4']} */ ;
        let __VLS_10;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
            size: (8),
            alignment: "flex-start",
        }));
        const __VLS_12 = __VLS_11({
            size: (8),
            alignment: "flex-start",
        }, ...__VLS_functionalComponentArgsRest(__VLS_11));
        const { default: __VLS_15 } = __VLS_13.slots;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            iconName: "app-edit",
            ...{ class: "color-primary" },
            ...{ style: {} },
        }));
        const __VLS_18 = __VLS_17({
            iconName: "app-edit",
            ...{ class: "color-primary" },
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
        (item.content);
        // @ts-ignore
        [sendMessage, type,];
        var __VLS_13;
    }
    else {
        let __VLS_21;
        /** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
        MdPreview;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
            editorId: "preview-only",
            modelValue: (item.content),
            ...{ class: "maxkb-md" },
        }));
        const __VLS_23 = __VLS_22({
            editorId: "preview-only",
            modelValue: (item.content),
            ...{ class: "maxkb-md" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        /** @type {__VLS_StyleScopedClasses['maxkb-md']} */ ;
    }
    // @ts-ignore
    [];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
