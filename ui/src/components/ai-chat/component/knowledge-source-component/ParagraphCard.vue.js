/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { getImgUrl, getFileUrl } from '@/utils/common';
import { computed } from 'vue';
import { MsgInfo } from '@/utils/message';
import { t } from '@/locales';
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    },
    content: {
        type: String,
        default: '',
    },
    index: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default: null,
    },
});
const isMetaObject = computed(() => typeof props.data.meta === 'object');
const parsedMeta = computed(() => {
    try {
        return JSON.parse(props.data.meta);
    }
    catch (e) {
        return {};
    }
});
const meta = computed(() => (isMetaObject.value ? props.data.meta : parsedMeta.value));
function infoMessage(data) {
    if (data?.meta?.allow_download === false) {
        MsgInfo(t('aiChat.noPermissionDownload'));
    }
    else {
        MsgInfo(t('aiChat.noDocument'));
    }
}
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
/** @ts-ignore @type { | typeof __VLS_components.CardBox | typeof __VLS_components.CardBox} */
CardBox;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    shadow: "never",
    title: (__VLS_ctx.index + 1 + '.' + __VLS_ctx.data.title || '-'),
    ...{ class: "paragraph-source-card cursor mb-8 paragraph-source-card-height" },
    ...{ style: ({ height: __VLS_ctx.data?.document_name?.trim() ? '300px' : '260px' }) },
    ...{ class: (__VLS_ctx.data.is_active ? '' : 'disabled') },
    showIcon: (false),
}));
const __VLS_2 = __VLS_1({
    shadow: "never",
    title: (__VLS_ctx.index + 1 + '.' + __VLS_ctx.data.title || '-'),
    ...{ class: "paragraph-source-card cursor mb-8 paragraph-source-card-height" },
    ...{ style: ({ height: __VLS_ctx.data?.document_name?.trim() ? '300px' : '260px' }) },
    ...{ class: (__VLS_ctx.data.is_active ? '' : 'disabled') },
    showIcon: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
/** @type {__VLS_StyleScopedClasses['paragraph-source-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cursor']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['paragraph-source-card-height']} */ ;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { tag: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "color-primary" },
    });
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    (__VLS_ctx.score?.toFixed(3) || __VLS_ctx.data.similarity?.toFixed(3));
    // @ts-ignore
    [index, data, data, data, data, score,];
}
let __VLS_8;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
    height: "150",
}));
const __VLS_10 = __VLS_9({
    height: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
const { default: __VLS_13 } = __VLS_11.slots;
let __VLS_14;
/** @ts-ignore @type { | typeof __VLS_components.MdPreview} */
MdPreview;
// @ts-ignore
const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.content),
    noImgZoomIn: true,
}));
const __VLS_16 = __VLS_15({
    ref: "editorRef",
    editorId: "preview-only",
    modelValue: (__VLS_ctx.content),
    noImgZoomIn: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_15));
var __VLS_19;
var __VLS_17;
// @ts-ignore
[content,];
var __VLS_11;
{
    const { footer: __VLS_21 } = __VLS_3.slots;
    var __VLS_22 = {};
    if (__VLS_ctx.data?.document_name?.trim()) {
        let __VLS_24;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "w-full mb-12" },
        }));
        const __VLS_26 = __VLS_25({
            shadow: "never",
            ...{ style: {} },
            ...{ class: "w-full mb-12" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
        const { default: __VLS_29 } = __VLS_27.slots;
        let __VLS_30;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
            ...{ class: "flex align-center item" },
        }));
        const __VLS_32 = __VLS_31({
            ...{ class: "flex align-center item" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_31));
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        /** @type {__VLS_StyleScopedClasses['item']} */ ;
        const { default: __VLS_35 } = __VLS_33.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: (__VLS_ctx.getImgUrl(__VLS_ctx.data?.document_name?.trim())),
            alt: "",
            width: "20",
            ...{ class: "mr-4" },
        });
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        if (__VLS_ctx.data?.meta?.source_file_id || __VLS_ctx.data?.meta?.source_url) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ml-4" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
                href: (__VLS_ctx.getFileUrl(__VLS_ctx.data?.meta?.source_file_id) || __VLS_ctx.data?.meta?.source_url),
                target: "_blank",
                ...{ class: "ellipsis-1" },
                title: (__VLS_ctx.data?.document_name?.trim()),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                title: (__VLS_ctx.data?.document_name?.trim()),
            });
            (__VLS_ctx.data?.document_name);
        }
        else {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.data?.document_name?.trim()))
                            throw 0;
                        if (!!(__VLS_ctx.data?.meta?.source_file_id || __VLS_ctx.data?.meta?.source_url))
                            throw 0;
                        return __VLS_ctx.infoMessage(__VLS_ctx.data);
                        // @ts-ignore
                        [data, data, data, data, data, data, data, data, data, data, getImgUrl, getFileUrl, infoMessage,];
                    } },
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ellipsis-1 break-all" },
                title: (__VLS_ctx.data?.document_name?.trim()),
            });
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
            (__VLS_ctx.data?.document_name?.trim());
        }
        // @ts-ignore
        [data, data,];
        var __VLS_33;
        // @ts-ignore
        [];
        var __VLS_27;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center border-t" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.KnowledgeIcon} */
    KnowledgeIcon;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        type: (__VLS_ctx.data?.knowledge_type),
        size: (18),
        ...{ class: "mr-8" },
    }));
    const __VLS_38 = __VLS_37({
        type: (__VLS_ctx.data?.knowledge_type),
        size: (18),
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ellipsis-1 break-all" },
        title: (__VLS_ctx.data?.knowledge_name),
    });
    /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    (__VLS_ctx.data?.knowledge_name || '-');
    // @ts-ignore
    [data, data, data,];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_20 = __VLS_19, __VLS_23 = __VLS_22;
// @ts-ignore
[];
const __VLS_base = (await import('vue')).defineComponent({
    props: {
        data: {
            type: Object,
            default: () => { },
        },
        content: {
            type: String,
            default: '',
        },
        index: {
            type: Number,
            default: 0,
        },
        score: {
            type: Number,
            default: null,
        },
    },
});
const __VLS_export = {};
export default {};
