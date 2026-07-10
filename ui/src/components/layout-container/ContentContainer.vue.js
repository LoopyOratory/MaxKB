/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, useSlots } from 'vue';
defineOptions({ name: 'ContentContainer' });
const slots = useSlots();
const props = defineProps({
    header: String || null,
    backTo: String,
});
const showBack = computed(() => {
    const { backTo } = props;
    return backTo;
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-container" },
});
/** @type {__VLS_StyleScopedClasses['content-container']} */ ;
if (__VLS_ctx.slots.header || __VLS_ctx.header) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "content-container__header flex align-center w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['content-container__header']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_0 = {};
    if (__VLS_ctx.showBack) {
        let __VLS_2;
        /** @ts-ignore @type { | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button'] | typeof __VLS_components.backButton | typeof __VLS_components.BackButton | typeof __VLS_components['back-button']} */
        backButton;
        // @ts-ignore
        const __VLS_3 = __VLS_asFunctionalComponent1(__VLS_2, new __VLS_2({
            to: (__VLS_ctx.backTo),
        }));
        const __VLS_4 = __VLS_3({
            to: (__VLS_ctx.backTo),
        }, ...__VLS_functionalComponentArgsRest(__VLS_3));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between w-full" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    var __VLS_7 = {};
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.header);
    var __VLS_9 = {};
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content-container__main" },
});
/** @type {__VLS_StyleScopedClasses['content-container__main']} */ ;
let __VLS_11;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
    ...{ class: "p-16" },
    ...{ style: {} },
}));
const __VLS_13 = __VLS_12({
    ...{ class: "p-16" },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
const { default: __VLS_16 } = __VLS_14.slots;
var __VLS_17 = {};
// @ts-ignore
[slots, header, header, showBack, backTo,];
var __VLS_14;
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_8 = __VLS_7, __VLS_10 = __VLS_9, __VLS_18 = __VLS_17;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    props: {
        header: String || null,
        backTo: String,
    },
});
const __VLS_export = {};
export default {};
