/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { inject } from 'vue';
import { WorkflowMode } from '@/enums/application';
import ApplicationDropdownMenu from '@/components/workflow-dropdown-menu/application/index.vue';
import KnowledgeDropdownMenu from '@/components/workflow-dropdown-menu/knowledge/index.vue';
import KnowledgeDropdownInnerMenu from '@/components/workflow-dropdown-menu/knowledge-inner/index.vue';
import ToolDropdownMenu from '@/components/workflow-dropdown-menu/tool/index.vue';
const workflow_mode = inject('workflowMode') || WorkflowMode.Application;
const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: '',
    },
    workflowRef: Object,
    inner: {
        type: Boolean,
        default: false,
    },
});
const kw = {
    [WorkflowMode.Application]: ApplicationDropdownMenu,
    [WorkflowMode.ApplicationLoop]: ApplicationDropdownMenu,
    [WorkflowMode.Knowledge]: props.inner ? KnowledgeDropdownInnerMenu : KnowledgeDropdownMenu,
    [WorkflowMode.KnowledgeLoop]: props.inner ? KnowledgeDropdownInnerMenu : KnowledgeDropdownMenu,
    [WorkflowMode.Tool]: ToolDropdownMenu,
    [WorkflowMode.ToolLoop]: ToolDropdownMenu,
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
const __VLS_0 = (__VLS_ctx.kw[__VLS_ctx.workflow_mode]);
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    show: (__VLS_ctx.show),
    id: (__VLS_ctx.id),
    workflowRef: (__VLS_ctx.workflowRef),
}));
const __VLS_2 = __VLS_1({
    show: (__VLS_ctx.show),
    id: (__VLS_ctx.id),
    workflowRef: (__VLS_ctx.workflowRef),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
// @ts-ignore
[kw, workflow_mode, show, id, workflowRef,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        id: {
            type: String,
            default: '',
        },
        workflowRef: Object,
        inner: {
            type: Boolean,
            default: false,
        },
    },
});
export default {};
