/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { numberFormat } from '@/utils/common';
const props = defineProps();
const emit = defineEmits();
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-footer-operation']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
CardBox;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: (props.tool.name),
    description: (props.tool.desc),
    ...{ class: "cursor tool-card" },
}));
const __VLS_2 = __VLS_1({
    title: (props.tool.name),
    description: (props.tool.desc),
    ...{ class: "cursor tool-card" },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['tool-card']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { icon: __VLS_7 } = __VLS_3.slots;
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }));
    const __VLS_10 = __VLS_9({
        shape: "square",
        size: (32),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    const { default: __VLS_13 } = __VLS_11.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/knowledge/icon_basic_template.svg",
        alt: "",
    });
    var __VLS_11;
}
{
    const { title: __VLS_14 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (props.tool?.name),
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (props.tool?.name);
}
{
    const { footer: __VLS_15 } = __VLS_3.slots;
    if (props.tool?.downloads != undefined) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "card-footer-left color-secondary flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['card-footer-left']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            iconName: "app-download",
            ...{ class: "mr-4" },
        }));
        const __VLS_18 = __VLS_17({
            iconName: "app-download",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.numberFormat(props.tool.downloads || 0));
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onClick: () => { } },
        ...{ class: "card-footer-operation mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['card-footer-operation']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        ...{ 'onClick': {} },
    }));
    const __VLS_23 = __VLS_22({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    let __VLS_26;
    const __VLS_27 = {
        /** @type {typeof __VLS_26.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.emit('handleDetail');
            // @ts-ignore
            [numberFormat, emit,];
        },
    };
    const { default: __VLS_28 } = __VLS_24.slots;
    (__VLS_ctx.$t('common.detail'));
    // @ts-ignore
    [$t,];
    var __VLS_24;
    var __VLS_25;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (props.addLoading),
    }));
    const __VLS_31 = __VLS_30({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (props.addLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    let __VLS_34;
    const __VLS_35 = {
        /** @type {typeof __VLS_34.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.emit('handleAdd');
            // @ts-ignore
            [emit,];
        },
    };
    const { default: __VLS_36 } = __VLS_32.slots;
    (__VLS_ctx.$t('common.use'));
    // @ts-ignore
    [$t,];
    var __VLS_32;
    var __VLS_33;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
