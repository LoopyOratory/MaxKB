/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { i18n_name } from '@/utils/common';
const props = defineProps();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-popper']} */ ;
/** @type {__VLS_StyleScopedClasses['is-customized']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "tag-group" },
});
/** @type {__VLS_StyleScopedClasses['tag-group']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
elTag;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    size: (props.size),
    ...{ class: "default-tag tag-ellipsis" },
    title: (props.tags?.[0]),
}));
const __VLS_2 = __VLS_1({
    size: (props.size),
    ...{ class: "default-tag tag-ellipsis" },
    title: (props.tags?.[0]),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
/** @type {__VLS_StyleScopedClasses['default-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['tag-ellipsis']} */ ;
const { default: __VLS_5 } = __VLS_3.slots;
(__VLS_ctx.i18n_name(props.tags?.[0]));
// @ts-ignore
[i18n_name,];
var __VLS_3;
let __VLS_6;
/** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
elPopover;
// @ts-ignore
const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
    placement: "bottom",
    disabled: (__VLS_ctx.tooltipDisabled),
    popperStyle: ({ width: 'auto', maxWidth: '300px' }),
    persistent: (false),
}));
const __VLS_8 = __VLS_7({
    placement: "bottom",
    disabled: (__VLS_ctx.tooltipDisabled),
    popperStyle: ({ width: 'auto', maxWidth: '300px' }),
    persistent: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_7));
const { default: __VLS_11 } = __VLS_9.slots;
{
    const { reference: __VLS_12 } = __VLS_9.slots;
    if (props.tags?.length > 1) {
        let __VLS_13;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
            size: (props.size),
            ...{ class: "info-tag ml-4 cursor" },
        }));
        const __VLS_15 = __VLS_14({
            size: (props.size),
            ...{ class: "info-tag ml-4 cursor" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_14));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        const { default: __VLS_18 } = __VLS_16.slots;
        (props.tags?.length - 1);
        // @ts-ignore
        [tooltipDisabled,];
        var __VLS_16;
    }
    // @ts-ignore
    [];
}
let __VLS_19;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({}));
const __VLS_21 = __VLS_20({}, ...__VLS_functionalComponentArgsRest(__VLS_20));
const { default: __VLS_24 } = __VLS_22.slots;
for (const [item] of __VLS_vFor((props.tags.slice(1)))) {
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
    elTag;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        size: (props.size),
        key: (item),
        ...{ class: "default-tag mr-4" },
    }));
    const __VLS_27 = __VLS_26({
        size: (props.size),
        key: (item),
        ...{ class: "default-tag mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    /** @type {__VLS_StyleScopedClasses['default-tag']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_30 } = __VLS_28.slots;
    (item);
    // @ts-ignore
    [];
    var __VLS_28;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_22;
// @ts-ignore
[];
var __VLS_9;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
