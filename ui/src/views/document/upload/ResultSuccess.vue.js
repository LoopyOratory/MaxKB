/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getImgUrl, filesize, numberFormat } from '@/utils/common';
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    },
});
const router = useRouter();
const route = useRoute();
const { params: { id, folderId, type }, // id is knowledgeID
 } = route;
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const paragraph_count = computed(() => props.data?.document_list.reduce((sum, obj) => (sum += obj.paragraph_count), 0));
const char_length = computed(() => props.data?.document_list.reduce((sum, obj) => (sum += obj.char_length), 0) || 0);
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
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elResult | typeof __VLS_components.ElResult | typeof __VLS_components['el-result'] | typeof __VLS_components.elResult | typeof __VLS_components.ElResult | typeof __VLS_components['el-result']} */
elResult;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    icon: "color-success",
    title: (`🎉 ${__VLS_ctx.$t('views.knowledge.ResultSuccess.title')} 🎉`),
}));
const __VLS_9 = __VLS_8({
    icon: "color-success",
    title: (`🎉 ${__VLS_ctx.$t('views.knowledge.ResultSuccess.title')} 🎉`),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
const { default: __VLS_12 } = __VLS_10.slots;
{
    const { 'sub-title': __VLS_13 } = __VLS_10.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "bold" },
    });
    /** @type {__VLS_StyleScopedClasses['bold']} */ ;
    (__VLS_ctx.data?.document_list.length || 0);
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        type: "info",
        ...{ class: "ml-4" },
    }));
    const __VLS_16 = __VLS_15({
        type: "info",
        ...{ class: "ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    const { default: __VLS_19 } = __VLS_17.slots;
    (__VLS_ctx.$t('common.fileUpload.document'));
    // @ts-ignore
    [$t, $t, data,];
    var __VLS_17;
    let __VLS_20;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
        direction: "vertical",
    }));
    const __VLS_22 = __VLS_21({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "bold" },
    });
    /** @type {__VLS_StyleScopedClasses['bold']} */ ;
    (__VLS_ctx.paragraph_count || 0);
    let __VLS_25;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
        type: "info",
        ...{ class: "ml-4" },
    }));
    const __VLS_27 = __VLS_26({
        type: "info",
        ...{ class: "ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    const { default: __VLS_30 } = __VLS_28.slots;
    (__VLS_ctx.$t('views.knowledge.ResultSuccess.paragraph'));
    // @ts-ignore
    [$t, paragraph_count,];
    var __VLS_28;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        direction: "vertical",
    }));
    const __VLS_33 = __VLS_32({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "bold" },
    });
    /** @type {__VLS_StyleScopedClasses['bold']} */ ;
    (__VLS_ctx.numberFormat(__VLS_ctx.char_length) || 0);
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        type: "info",
        ...{ class: "ml-4" },
    }));
    const __VLS_38 = __VLS_37({
        type: "info",
        ...{ class: "ml-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    const { default: __VLS_41 } = __VLS_39.slots;
    (__VLS_ctx.$t('common.character'));
    // @ts-ignore
    [$t, numberFormat, char_length,];
    var __VLS_39;
    // @ts-ignore
    [];
}
{
    const { extra: __VLS_42 } = __VLS_10.slots;
    if (__VLS_ctx.apiType === 'workspace') {
        let __VLS_43;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
            ...{ 'onClick': {} },
        }));
        const __VLS_45 = __VLS_44({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_44));
        let __VLS_48;
        const __VLS_49 = {
            /** @type {typeof __VLS_48.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.apiType === 'workspace'))
                    throw 0;
                return;
                __VLS_ctx.router.push({
                    path: `/knowledge`,
                });
                // @ts-ignore
                [apiType, router,];
            },
        };
        const { default: __VLS_50 } = __VLS_46.slots;
        (__VLS_ctx.$t('views.knowledge.ResultSuccess.buttons.toknowledge'));
        // @ts-ignore
        [$t,];
        var __VLS_46;
        var __VLS_47;
    }
    else {
        let __VLS_51;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_52 = __VLS_asFunctionalComponent1(__VLS_51, new __VLS_51({
            ...{ 'onClick': {} },
        }));
        const __VLS_53 = __VLS_52({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_52));
        let __VLS_56;
        const __VLS_57 = {
            /** @type {typeof __VLS_56.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.apiType === 'workspace'))
                    throw 0;
                return;
                __VLS_ctx.router.push({
                    path: `/system/${__VLS_ctx.folderId}/knowledge`,
                });
                // @ts-ignore
                [router, folderId,];
            },
        };
        const { default: __VLS_58 } = __VLS_54.slots;
        (__VLS_ctx.$t('views.knowledge.ResultSuccess.buttons.toknowledge'));
        // @ts-ignore
        [$t,];
        var __VLS_54;
        var __VLS_55;
    }
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (...[$event]) => {
            return;
            __VLS_ctx.router.push({
                path: `/knowledge/${__VLS_ctx.data?.id}/${__VLS_ctx.folderId}/${__VLS_ctx.type}/document`,
            });
            // @ts-ignore
            [data, router, folderId, type,];
        },
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('views.knowledge.ResultSuccess.buttons.toDocument'));
    // @ts-ignore
    [$t,];
    var __VLS_62;
    var __VLS_63;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_10;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "result-success" },
});
/** @type {__VLS_StyleScopedClasses['result-success']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
    ...{ class: "bolder" },
});
/** @type {__VLS_StyleScopedClasses['bolder']} */ ;
(__VLS_ctx.$t('views.knowledge.ResultSuccess.documentList'));
for (const [item, index] of __VLS_vFor((__VLS_ctx.data?.document_list))) {
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        shadow: "never",
        ...{ class: "mt-8" },
        ...{ style: {} },
        key: (index),
    }));
    const __VLS_69 = __VLS_68({
        shadow: "never",
        ...{ class: "mt-8" },
        ...{ style: {} },
        key: (index),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const { default: __VLS_72 } = __VLS_70.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: (__VLS_ctx.getImgUrl(item && item?.name)),
        alt: "",
        width: "40",
    });
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    (item && item?.name);
    let __VLS_73;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_74 = __VLS_asFunctionalComponent1(__VLS_73, new __VLS_73({
        type: "info",
        size: "small",
    }));
    const __VLS_75 = __VLS_74({
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_74));
    const { default: __VLS_78 } = __VLS_76.slots;
    (__VLS_ctx.filesize(item && item?.char_length));
    // @ts-ignore
    [$t, data, getImgUrl, filesize,];
    var __VLS_76;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    let __VLS_79;
    /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
    elText;
    // @ts-ignore
    const __VLS_80 = __VLS_asFunctionalComponent1(__VLS_79, new __VLS_79({
        type: "info",
        ...{ class: "mr-16" },
    }));
    const __VLS_81 = __VLS_80({
        type: "info",
        ...{ class: "mr-16" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_80));
    /** @type {__VLS_StyleScopedClasses['mr-16']} */ ;
    const { default: __VLS_84 } = __VLS_82.slots;
    (item && item?.paragraph_count);
    (__VLS_ctx.$t('views.knowledge.ResultSuccess.paragraph_count'));
    // @ts-ignore
    [$t,];
    var __VLS_82;
    if (item.status === '1') {
        let __VLS_85;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({}));
        const __VLS_87 = __VLS_86({}, ...__VLS_functionalComponentArgsRest(__VLS_86));
        const { default: __VLS_90 } = __VLS_88.slots;
        let __VLS_91;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
            ...{ class: "color-success" },
        }));
        const __VLS_93 = __VLS_92({
            ...{ class: "color-success" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_92));
        /** @type {__VLS_StyleScopedClasses['color-success']} */ ;
        const { default: __VLS_96 } = __VLS_94.slots;
        let __VLS_97;
        /** @ts-ignore @type { | typeof __VLS_components.SuccessFilled} */
        SuccessFilled;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({}));
        const __VLS_99 = __VLS_98({}, ...__VLS_functionalComponentArgsRest(__VLS_98));
        // @ts-ignore
        [];
        var __VLS_94;
        // @ts-ignore
        [];
        var __VLS_88;
    }
    else if (item.status === '2') {
        let __VLS_102;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({}));
        const __VLS_104 = __VLS_103({}, ...__VLS_functionalComponentArgsRest(__VLS_103));
        const { default: __VLS_107 } = __VLS_105.slots;
        let __VLS_108;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent1(__VLS_108, new __VLS_108({
            ...{ class: "color-danger" },
        }));
        const __VLS_110 = __VLS_109({
            ...{ class: "color-danger" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        /** @type {__VLS_StyleScopedClasses['color-danger']} */ ;
        const { default: __VLS_113 } = __VLS_111.slots;
        let __VLS_114;
        /** @ts-ignore @type { | typeof __VLS_components.CircleCloseFilled} */
        CircleCloseFilled;
        // @ts-ignore
        const __VLS_115 = __VLS_asFunctionalComponent1(__VLS_114, new __VLS_114({}));
        const __VLS_116 = __VLS_115({}, ...__VLS_functionalComponentArgsRest(__VLS_115));
        // @ts-ignore
        [];
        var __VLS_111;
        // @ts-ignore
        [];
        var __VLS_105;
    }
    else if (item.status === '0') {
        let __VLS_119;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_120 = __VLS_asFunctionalComponent1(__VLS_119, new __VLS_119({}));
        const __VLS_121 = __VLS_120({}, ...__VLS_functionalComponentArgsRest(__VLS_120));
        const { default: __VLS_124 } = __VLS_122.slots;
        let __VLS_125;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent1(__VLS_125, new __VLS_125({
            ...{ class: "is-loading primary" },
        }));
        const __VLS_127 = __VLS_126({
            ...{ class: "is-loading primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
        /** @type {__VLS_StyleScopedClasses['primary']} */ ;
        const { default: __VLS_130 } = __VLS_128.slots;
        let __VLS_131;
        /** @ts-ignore @type { | typeof __VLS_components.Loading} */
        Loading;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent1(__VLS_131, new __VLS_131({}));
        const __VLS_133 = __VLS_132({}, ...__VLS_functionalComponentArgsRest(__VLS_132));
        // @ts-ignore
        [];
        var __VLS_128;
        (__VLS_ctx.$t('views.knowledge.ResultSuccess.loading'));
        // @ts-ignore
        [$t,];
        var __VLS_122;
    }
    // @ts-ignore
    [];
    var __VLS_70;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    props: {
        data: {
            type: Object,
            default: () => { },
        },
    },
});
export default {};
