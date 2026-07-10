/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, onMounted, nextTick } from 'vue';
defineOptions({ name: 'AutoTooltip' });
const props = defineProps({ className: String, style: Object });
const tagLabel = ref();
const containerWeight = ref(0);
const contentWeight = ref(0);
onMounted(() => {
    nextTick(() => {
        containerWeight.value = tagLabel.value?.scrollWidth;
        contentWeight.value = tagLabel.value?.clientWidth;
    });
    window.addEventListener('resize', function () {
        containerWeight.value = tagLabel.value?.scrollWidth;
        contentWeight.value = tagLabel.value?.clientWidth;
    });
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    disabled: (!(__VLS_ctx.containerWeight > __VLS_ctx.contentWeight)),
    effect: "dark",
    placement: "bottom",
    popperClass: "auto-tooltip-popper",
}));
const __VLS_2 = __VLS_1({
    disabled: (!(__VLS_ctx.containerWeight > __VLS_ctx.contentWeight)),
    effect: "dark",
    placement: "bottom",
    popperClass: "auto-tooltip-popper",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
(__VLS_ctx.$attrs);
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "tagLabel",
    ...{ class: (['auto-tooltip', __VLS_ctx.className]) },
    ...{ style: (__VLS_ctx.style) },
});
/** @type {__VLS_StyleScopedClasses['auto-tooltip']} */ ;
var __VLS_7 = {};
// @ts-ignore
[containerWeight, contentWeight, $attrs, className, style,];
var __VLS_3;
// @ts-ignore
var __VLS_8 = __VLS_7;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    props: { className: String, style: Object },
});
const __VLS_export = {};
export default {};
