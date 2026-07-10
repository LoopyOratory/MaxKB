/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import Content from './content/index.vue';
import { ref, computed } from 'vue';
const props = defineProps();
const toolCallsContent = computed(() => {
    try {
        return JSON.parse(props.content ? props.content : '{}');
    }
    catch (error) {
        return { type: 'simple-tool-calls', icon: '', title: '', content: {} };
    }
});
const showContent = ref(false);
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
    ...{ class: "layout-bg mt-8" },
    ...{ style: {} },
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    ...{ class: "layout-bg mt-8" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onClick: (...[$event]) => {
            return __VLS_ctx.showContent = !__VLS_ctx.showContent;
            // @ts-ignore
            [showContent, showContent,];
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
if (__VLS_ctx.toolCallsContent.icon) {
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-4" },
    }));
    const __VLS_9 = __VLS_8({
        shape: "square",
        size: (24),
        ...{ style: {} },
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_12 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.toolCallsContent.icon),
        alt: "",
    });
    // @ts-ignore
    [toolCallsContent, toolCallsContent,];
    var __VLS_10;
}
else {
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.ToolIcon} */
    ToolIcon;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        size: (24),
        ...{ class: "mr-4" },
    }));
    const __VLS_15 = __VLS_14({
        size: (24),
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.toolCallsContent.title || '-');
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_18;
/** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
elIcon;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
    ...{ class: "arrow-icon" },
    ...{ class: (__VLS_ctx.showContent ? 'rotate-180' : '') },
}));
const __VLS_20 = __VLS_19({
    ...{ class: "arrow-icon" },
    ...{ class: (__VLS_ctx.showContent ? 'rotate-180' : '') },
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
/** @type {__VLS_StyleScopedClasses['arrow-icon']} */ ;
const { default: __VLS_23 } = __VLS_21.slots;
let __VLS_24;
/** @ts-ignore @type { | typeof __VLS_components.ArrowDown} */
ArrowDown;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
// @ts-ignore
[showContent, toolCallsContent,];
var __VLS_21;
let __VLS_29;
/** @ts-ignore @type { | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition'] | typeof __VLS_components.elCollapseTransition | typeof __VLS_components.ElCollapseTransition | typeof __VLS_components['el-collapse-transition']} */
elCollapseTransition;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({}));
const __VLS_31 = __VLS_30({}, ...__VLS_functionalComponentArgsRest(__VLS_30));
const { default: __VLS_34 } = __VLS_32.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.showContent) }, null, null);
const __VLS_35 = Content || Content;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    content: (__VLS_ctx.toolCallsContent),
}));
const __VLS_37 = __VLS_36({
    content: (__VLS_ctx.toolCallsContent),
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
// @ts-ignore
[showContent, toolCallsContent,];
var __VLS_32;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
