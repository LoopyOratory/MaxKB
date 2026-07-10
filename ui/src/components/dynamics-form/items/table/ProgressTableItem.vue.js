/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
const props = defineProps();
const rowRef = ref();
function evalF(text, row) {
    rowRef.value = row;
    return eval(text);
}
const props_info = computed(() => {
    return props.column.props_info ? props.column.props_info : {};
});
const text_field = computed(() => {
    return props.column.text_field ? props.column.text_field : 'key';
});
const value_field = computed(() => {
    return props.column.value_field ? props.column.value_field : 'value';
});
const value_html = (view_card_item) => {
    if (view_card_item.type === 'eval') {
        return evalF(view_card_item.value_field, props.row);
    }
    else {
        return props.row[view_card_item.value_field];
    }
};
const view_card = computed(() => {
    return props_info.value.view_card ? props_info.value.view_card : [];
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
    ...{ class: "progress-table-item" },
});
/** @type {__VLS_StyleScopedClasses['progress-table-item']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
elPopover;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    placement: "top-start",
    title: (__VLS_ctx.row[__VLS_ctx.text_field]),
    width: (200),
    trigger: "hover",
    persistent: (false),
}));
const __VLS_2 = __VLS_1({
    placement: "top-start",
    title: (__VLS_ctx.row[__VLS_ctx.text_field]),
    width: (200),
    trigger: "hover",
    persistent: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
{
    const { reference: __VLS_6 } = __VLS_3.slots;
    let __VLS_7;
    /** @ts-ignore @type { | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress'] | typeof __VLS_components.elProgress | typeof __VLS_components.ElProgress | typeof __VLS_components['el-progress']} */
    elProgress;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
        percentage: (__VLS_ctx.row[__VLS_ctx.value_field]),
    }));
    const __VLS_9 = __VLS_8({
        percentage: (__VLS_ctx.row[__VLS_ctx.value_field]),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    (__VLS_ctx.$attrs);
    // @ts-ignore
    [row, row, text_field, value_field, $attrs,];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
for (const [item, index] of __VLS_vFor((__VLS_ctx.view_card))) {
    let __VLS_12;
    /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
    elRow;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
        key: (index),
    }));
    const __VLS_14 = __VLS_13({
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
    const { default: __VLS_17 } = __VLS_15.slots;
    let __VLS_18;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
        span: (6),
    }));
    const __VLS_20 = __VLS_19({
        span: (6),
    }, ...__VLS_functionalComponentArgsRest(__VLS_19));
    const { default: __VLS_23 } = __VLS_21.slots;
    (item.title);
    // @ts-ignore
    [view_card,];
    var __VLS_21;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
    elCol;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
        span: (18),
    }));
    const __VLS_26 = __VLS_25({
        span: (18),
    }, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "value" },
        innerHTML: (__VLS_ctx.value_html(item)),
    });
    /** @type {__VLS_StyleScopedClasses['value']} */ ;
    // @ts-ignore
    [value_html,];
    var __VLS_27;
    // @ts-ignore
    [];
    var __VLS_15;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
