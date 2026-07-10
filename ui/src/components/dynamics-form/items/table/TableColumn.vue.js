/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
const props = defineProps();
const attrs = computed(() => {
    return props.column.attrs ? props.column.attrs : {};
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
const __VLS_0 = (__VLS_ctx.column.property);
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...(__VLS_ctx.attrs),
    column: (__VLS_ctx.column),
    row: (__VLS_ctx.row),
}));
const __VLS_2 = __VLS_1({
    ...(__VLS_ctx.attrs),
    column: (__VLS_ctx.column),
    row: (__VLS_ctx.row),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
var __VLS_3;
// @ts-ignore
[column, column, attrs, row,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
