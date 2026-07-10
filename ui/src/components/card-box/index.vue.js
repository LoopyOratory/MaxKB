/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { t } from '@/locales';
defineOptions({ name: 'CardBox' });
const props = withDefaults(defineProps(), { title: t('common.title'), description: '', showIcon: true, border: true, disabled: false });
watch(() => props.disabled, (val) => {
    if (val) {
        show.value = false;
        subHovered.value = false;
    }
});
const show = ref(false);
// cardAboveExistsdropdownMenu
const subHovered = ref(false);
function cardEnter() {
    if (props.disabled)
        return;
    show.value = true;
    subHovered.value = false;
}
function cardLeave() {
    show.value = subHovered.value;
}
function subHoveredEnter() {
    subHovered.value = true;
}
const __VLS_defaults = { title: t('common.title'), description: '', showIcon: true, border: true, disabled: false };
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
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    shadow: "hover",
    ...{ class: "card-box" },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onMouseenter': {} },
    ...{ 'onMouseleave': {} },
    shadow: "hover",
    ...{ class: "card-box" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.mouseenter} */
    onMouseenter: (...[$event]) => {
        return __VLS_ctx.cardEnter();
        // @ts-ignore
        [cardEnter,];
    },
};
const __VLS_7 = {
    /** @type {typeof __VLS_5.mouseleave} */
    onMouseleave: (...[$event]) => {
        return __VLS_ctx.cardLeave();
        // @ts-ignore
        [cardLeave,];
    },
};
var __VLS_8;
/** @type {__VLS_StyleScopedClasses['card-box']} */ ;
const { default: __VLS_9 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "card-header" },
});
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
var __VLS_10 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "title flex align-center" },
});
/** @type {__VLS_StyleScopedClasses['title']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['align-center']} */ ;
if (__VLS_ctx.showIcon) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-12 flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    var __VLS_12 = {};
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        shape: "square",
        size: (32),
        ...{ class: "avatar-blue" },
    }));
    const __VLS_16 = __VLS_15({
        shape: "square",
        size: (32),
        ...{ class: "avatar-blue" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    /** @type {__VLS_StyleScopedClasses['avatar-blue']} */ ;
    const { default: __VLS_19 } = __VLS_17.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/icon_document.svg",
        ...{ style: {} },
        alt: "",
    });
    // @ts-ignore
    [showIcon,];
    var __VLS_17;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ style: {} },
    ...{ class: "mt-4" },
});
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
var __VLS_20 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ellipsis-1" },
    title: (__VLS_ctx.title),
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
(__VLS_ctx.title);
var __VLS_22 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "status-tag" },
});
/** @type {__VLS_StyleScopedClasses['status-tag']} */ ;
var __VLS_24 = {
    hoverShow: (__VLS_ctx.show),
};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "description break-all mt-12" },
});
/** @type {__VLS_StyleScopedClasses['description']} */ ;
/** @type {__VLS_StyleScopedClasses['break-all']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
var __VLS_26 = {};
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "content color-secondary" },
});
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
(__VLS_ctx.description);
if (__VLS_ctx.$slots.footer || __VLS_ctx.$slots.mouseEnter) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-footer flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['card-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ style: {} },
    });
    var __VLS_28 = {};
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseenter: (__VLS_ctx.subHoveredEnter) },
    });
    if (__VLS_ctx.$slots.mouseEnter && __VLS_ctx.show) {
        var __VLS_30 = {};
    }
}
// @ts-ignore
[title, title, show, show, description, $slots, $slots, $slots, subHoveredEnter,];
var __VLS_3;
var __VLS_4;
// @ts-ignore
var __VLS_11 = __VLS_10, __VLS_13 = __VLS_12, __VLS_21 = __VLS_20, __VLS_23 = __VLS_22, __VLS_25 = __VLS_24, __VLS_27 = __VLS_26, __VLS_29 = __VLS_28, __VLS_31 = __VLS_30;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    __defaults: __VLS_defaults,
    __typeProps: {},
});
const __VLS_export = {};
export default {};
