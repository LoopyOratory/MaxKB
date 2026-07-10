/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref } from 'vue';
const props = defineProps();
const showThink = ref(true);
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
elCard;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shadow: "never",
    ...{ class: "reasoning mt-8" },
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "reasoning mt-8" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['reasoning']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.showThink = !__VLS_ctx.showThink;
            // @ts-ignore
            [showThink, showThink,];
        } },
    ...{ class: "flex-between cursor" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex align-center" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/chat/icon_reasoning.svg",
    alt: "",
});
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.$t('workflow.nodes.aiChatNode.think'));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ...{ class: "arrow-icon" },
    ...{ class: (__VLS_ctx.showThink ? 'rotate-180' : '') },
}));
const __VLS_9 = __VLS_8({
    ...{ class: "arrow-icon" },
    ...{ class: (__VLS_ctx.showThink ? 'rotate-180' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_12 } = __VLS_10.slots;
let __VLS_13;
/** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
ArrowDown;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({}));
const __VLS_15 = __VLS_14({}, ...__VLS_functionalComponentArgsRest(__VLS_14));
// @ts-ignore
[showThink, $t,];
var __VLS_10;
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
const { default: __VLS_23 } = __VLS_21.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showThink) }, null, null);
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
MdPreview;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.content),
    ...{ class: "reasoning-md" },
}));
const __VLS_26 = __VLS_25({
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.content),
    ...{ class: "reasoning-md" },
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
var __VLS_29;
/** @type {__VLS_StyleScopedClasses['reasoning-md']} */ ;
var __VLS_27;
// @ts-ignore
[showThink, content,];
var __VLS_21;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_30 = __VLS_29;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
