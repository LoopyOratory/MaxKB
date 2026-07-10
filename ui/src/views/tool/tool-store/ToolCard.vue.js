/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { isAppIcon, resetUrl, numberFormat } from '@/utils/common';
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
    if (__VLS_ctx.isAppIcon(props.tool?.icon)) {
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
            src: (__VLS_ctx.resetUrl(props.tool?.icon)),
            alt: "",
        });
        // @ts-ignore
        [isAppIcon, resetUrl,];
        var __VLS_11;
    }
    else if (props.tool?.name) {
        let __VLS_14;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
            name: (props.tool?.name),
            pinyinColor: true,
            shape: "square",
            size: (32),
        }));
        const __VLS_16 = __VLS_15({
            name: (props.tool?.name),
            pinyinColor: true,
            shape: "square",
            size: (32),
        }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    }
    // @ts-ignore
    [];
}
{
    const { title: __VLS_19 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        title: (props.tool?.name),
        ...{ class: "ellipsis" },
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (props.tool?.name);
    if (props.tool?.version) {
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            size: "small",
            ...{ class: "ml-4" },
            type: "info",
            effect: "plain",
        }));
        const __VLS_22 = __VLS_21({
            size: "small",
            ...{ class: "ml-4" },
            type: "info",
            effect: "plain",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
        const { default: __VLS_25 } = __VLS_23.slots;
        (props.tool?.version);
        // @ts-ignore
        [];
        var __VLS_23;
    }
    // @ts-ignore
    [];
}
{
    const { tag: __VLS_26 } = __VLS_3.slots;
    if (props.tool?.label === 'data_source') {
        let __VLS_27;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_29 = __VLS_28({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_28));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_32 } = __VLS_30.slots;
        (__VLS_ctx.$t('views.tool.dataSource.title'));
        // @ts-ignore
        [$t,];
        var __VLS_30;
    }
    else if (props.tool?.label === 'skill') {
        let __VLS_33;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_35 = __VLS_34({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_38 } = __VLS_36.slots;
        // @ts-ignore
        [];
        var __VLS_36;
    }
    else if (props.tool?.label === 'workflow_template') {
        let __VLS_39;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_41 = __VLS_40({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_44 } = __VLS_42.slots;
        (__VLS_ctx.$t('views.tool.toolWorkflow.title'));
        // @ts-ignore
        [$t,];
        var __VLS_42;
    }
    else {
        let __VLS_45;
        /** @ts-ignore @type { | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag'] | typeof __VLS_components.elTag | typeof __VLS_components.ElTag | typeof __VLS_components['el-tag']} */
        elTag;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent1(__VLS_45, new __VLS_45({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }));
        const __VLS_47 = __VLS_46({
            size: "small",
            type: "info",
            ...{ class: "info-tag" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        /** @type {__VLS_StyleScopedClasses['info-tag']} */ ;
        const { default: __VLS_50 } = __VLS_48.slots;
        (__VLS_ctx.$t('views.tool.title'));
        // @ts-ignore
        [$t,];
        var __VLS_48;
    }
    // @ts-ignore
    [];
}
{
    const { subTitle: __VLS_51 } = __VLS_3.slots;
    let __VLS_52;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
        ...{ class: "color-secondary lighter" },
        size: "small",
    }));
    const __VLS_54 = __VLS_53({
        ...{ class: "color-secondary lighter" },
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_53));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    const { default: __VLS_57 } = __VLS_55.slots;
    (__VLS_ctx.getSubTitle(props.tool));
    // @ts-ignore
    [getSubTitle,];
    var __VLS_55;
    // @ts-ignore
    [];
}
{
    const { footer: __VLS_58 } = __VLS_3.slots;
    if (props.tool?.downloads != undefined) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "card-footer-left color-secondary flex align-center" },
        });
        /** @type {__VLS_StyleScopedClasses['card-footer-left']} */ ;
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_59;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
            iconName: "app-download",
            ...{ class: "mr-4" },
        }));
        const __VLS_61 = __VLS_60({
            iconName: "app-download",
            ...{ class: "mr-4" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_60));
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
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        ...{ 'onClick': {} },
    }));
    const __VLS_66 = __VLS_65({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    let __VLS_69;
    const __VLS_70 = {
        /** @type {typeof __VLS_69.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.emit('handleDetail');
            // @ts-ignore
            [numberFormat, emit,];
        },
    };
    const { default: __VLS_71 } = __VLS_67.slots;
    (__VLS_ctx.$t('common.detail'));
    // @ts-ignore
    [$t,];
    var __VLS_67;
    var __VLS_68;
    let __VLS_72;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_73 = __VLS_asFunctionalComponent1(__VLS_72, new __VLS_72({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (props.addLoading),
    }));
    const __VLS_74 = __VLS_73({
        ...{ 'onClick': {} },
        type: "primary",
        loading: (props.addLoading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_73));
    let __VLS_77;
    const __VLS_78 = {
        /** @type {typeof __VLS_77.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.emit('handleAdd');
            // @ts-ignore
            [emit,];
        },
    };
    const { default: __VLS_79 } = __VLS_75.slots;
    (__VLS_ctx.$t('common.add'));
    // @ts-ignore
    [$t,];
    var __VLS_75;
    var __VLS_76;
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
