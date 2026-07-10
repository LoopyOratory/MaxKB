/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import line from './components/LineCharts.vue';
import bar from './components/BarCharts.vue';
defineOptions({ name: 'AppCharts' });
const __VLS_props = defineProps({
    type: {
        type: String,
        default: 'line',
    },
    height: {
        type: String,
        default: '200px',
    },
    dataZoom: Boolean,
    option: {
        type: Object,
        required: true,
    }, // { title , xData, yData, formatStr  }
});
const typeComponentMap = { line, bar };
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
const __VLS_0 = (__VLS_ctx.typeComponentMap[__VLS_ctx.type]);
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    height: (__VLS_ctx.height),
    option: (__VLS_ctx.option),
    dataZoom: (__VLS_ctx.dataZoom),
    ...{ class: "v-charts" },
}));
const __VLS_2 = __VLS_1({
    height: (__VLS_ctx.height),
    option: (__VLS_ctx.option),
    dataZoom: (__VLS_ctx.dataZoom),
    ...{ class: "v-charts" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['v-charts']} */ ;
var __VLS_3;
// @ts-ignore
[typeComponentMap, type, height, option, dataZoom,];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        type: {
            type: String,
            default: 'line',
        },
        height: {
            type: String,
            default: '200px',
        },
        dataZoom: Boolean,
        option: {
            type: Object,
            required: true,
        }, // { title , xData, yData, formatStr  }
    },
});
export default {};
