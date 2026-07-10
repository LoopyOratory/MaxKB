/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import NodeContainer from '@/workflow/common/NodeContainer.vue';
const props = defineProps();
import InputFieldTable from './component/input/InputFieldTable.vue';
import OutFieldTable from './component/output/OutputFieldTable.vue';
const __VLS_ctx = {
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
const __VLS_7 = InputFieldTable || InputFieldTable;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_9 = __VLS_8({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const __VLS_12 = OutFieldTable || OutFieldTable;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
    nodeModel: (__VLS_ctx.nodeModel),
}));
const __VLS_14 = __VLS_13({
    nodeModel: (__VLS_ctx.nodeModel),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
// @ts-ignore
[nodeModel, nodeModel, nodeModel, $t,];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
