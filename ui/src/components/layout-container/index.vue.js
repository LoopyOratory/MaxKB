/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onUnmounted, ref } from 'vue';
defineOptions({ name: 'LayoutContainer' });
const props = defineProps({
    showCollapse: Boolean,
    resizable: Boolean,
    minLeftWidth: {
        type: Number,
        default: 240,
    },
    maxLeftWidth: {
        type: Number,
        default: 400,
    },
    showLeft: {
        type: Boolean,
        default: true,
    },
});
const isCollapse = ref(false);
const leftWidth = ref(props.minLeftWidth);
const isResizing = ref(false);
const onSplitterMouseDown = (e) => {
    if (!props.resizable)
        return;
    e.preventDefault();
    isResizing.value = true;
    document.body.style.userSelect = 'none';
    const startX = e.clientX;
    const startWidth = leftWidth.value;
    const onMouseMove = (moveEvent) => {
        if (!isResizing.value)
            return;
        const deltaX = moveEvent.clientX - startX;
        let newWidth = startWidth + deltaX;
        // LimitWidthBetween minimum andMaximumValueBetween
        newWidth = Math.max(props.minLeftWidth, Math.min(props.maxLeftWidth, newWidth));
        leftWidth.value = newWidth;
    };
    const onMouseUp = () => {
        isResizing.value = false;
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
};
onUnmounted(() => {
    document.removeEventListener('mousemove', () => { });
    document.removeEventListener('mouseup', () => { });
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
/** @type {__VLS_StyleScopedClasses['layout-container__left_content']} */ ;
/** @type {__VLS_StyleScopedClasses['collapse']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-container flex h-full" },
    ...{ class: (__VLS_ctx.isCollapse ? 'layout-container__collapse' : '') },
});
/** @type {__VLS_StyleScopedClasses['layout-container']} */ ;
/** @type {__VLS_StyleScopedClasses['flex']} */ ;
/** @type {__VLS_StyleScopedClasses['h-full']} */ ;
if (__VLS_ctx.showLeft) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: (`layout-container__left border-r ${__VLS_ctx.isCollapse ? 'hidden' : ''}`) },
        ...{ style: ({ width: __VLS_ctx.isCollapse ? 0 : `${__VLS_ctx.leftWidth}px` }) },
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "layout-container__left_content" },
    });
    /** @type {__VLS_StyleScopedClasses['layout-container__left_content']} */ ;
    var __VLS_0 = {};
    if (props.showCollapse) {
        let __VLS_2;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_3 = __VLS_asFunctionalComponent1(__VLS_2, new __VLS_2({
            content: (__VLS_ctx.isCollapse ? __VLS_ctx.$t('common.expand') : __VLS_ctx.$t('common.collapse')),
            placement: "right",
        }));
        const __VLS_4 = __VLS_3({
            content: (__VLS_ctx.isCollapse ? __VLS_ctx.$t('common.expand') : __VLS_ctx.$t('common.collapse')),
            placement: "right",
        }, ...__VLS_functionalComponentArgsRest(__VLS_3));
        const { default: __VLS_7 } = __VLS_5.slots;
        let __VLS_8;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
            ...{ class: "collapse" },
            size: "small",
            circle: true,
            icon: (__VLS_ctx.isCollapse ? 'ArrowRightBold' : 'ArrowLeftBold'),
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
            ...{ class: "collapse" },
            size: "small",
            circle: true,
            icon: (__VLS_ctx.isCollapse ? 'ArrowRightBold' : 'ArrowLeftBold'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_13;
        const __VLS_14 = {
            /** @type {typeof __VLS_13.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.showLeft))
                    throw 0;
                if (!(props.showCollapse))
                    throw 0;
                return __VLS_ctx.isCollapse = !__VLS_ctx.isCollapse;
                // @ts-ignore
                [isCollapse, isCollapse, isCollapse, isCollapse, isCollapse, isCollapse, isCollapse, showLeft, leftWidth, $t, $t,];
            },
        };
        /** @type {__VLS_StyleScopedClasses['collapse']} */ ;
        var __VLS_11;
        var __VLS_12;
        // @ts-ignore
        [];
        var __VLS_5;
    }
    if (props.resizable) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ onMousedown: (__VLS_ctx.onSplitterMouseDown) },
            ...{ class: "splitter-bar-line" },
            ...{ class: (__VLS_ctx.isResizing ? 'hover' : '') },
        });
        /** @type {__VLS_StyleScopedClasses['splitter-bar-line']} */ ;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "layout-container__right" },
});
/** @type {__VLS_StyleScopedClasses['layout-container__right']} */ ;
var __VLS_15 = {};
// @ts-ignore
var __VLS_1 = __VLS_0, __VLS_16 = __VLS_15;
// @ts-ignore
[onSplitterMouseDown, isResizing,];
const __VLS_base = (await import('vue')).defineComponent({
    props: {
        showCollapse: Boolean,
        resizable: Boolean,
        minLeftWidth: {
            type: Number,
            default: 240,
        },
        maxLeftWidth: {
            type: Number,
            default: 400,
        },
        showLeft: {
            type: Boolean,
            default: true,
        },
    },
});
const __VLS_export = {};
export default {};
