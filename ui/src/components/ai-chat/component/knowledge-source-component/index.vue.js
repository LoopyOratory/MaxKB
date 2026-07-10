/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref, shallowRef } from 'vue';
import { cloneDeep } from 'lodash';
import ExecutionDetailContent from './ExecutionDetailContent.vue';
import ParagraphDocumentContent from './ParagraphDocumentContent.vue';
import ParagraphSourceContent from './ParagraphSourceContent.vue';
import { arraySort } from '@/utils/array';
import { getImgUrl, getFileUrl } from '@/utils/common';
import { t } from '@/locales';
import { MsgInfo } from '@/utils/message';
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    },
    type: {
        type: String,
        default: '',
    },
    appType: {
        type: String,
        default: '',
    },
    executionIsRightPanel: {
        type: Boolean,
        required: false,
    },
    application: {
        type: Object,
        default: () => { },
    },
});
const emit = defineEmits(['openExecutionDetail', 'openParagraph', 'openParagraphDocument']);
const showPDF = (item) => {
    return (item.document_name.toLocaleLowerCase().endsWith('.pdf') &&
        item.meta?.source_file_id &&
        props.executionIsRightPanel);
};
const dialogVisible = ref(false);
const dialogTitle = ref('');
const currentComponent = shallowRef(null);
const currentChatDetail = ref(null);
const dialogType = ref('');
function infoMessage(data) {
    if (data?.meta?.allow_download === false) {
        MsgInfo(t('aiChat.noPermissionDownload'));
    }
    else {
        MsgInfo(t('aiChat.noDocument'));
    }
}
function openParagraph(row, id) {
    dialogTitle.value = t('aiChat.KnowledgeSource.title');
    const obj = cloneDeep(row);
    obj.paragraph_list = id
        ? obj.paragraph_list.filter((v) => v.knowledge_id === id)
        : obj.paragraph_list;
    obj.paragraph_list = arraySort(obj.paragraph_list, 'similarity', true);
    if (props.executionIsRightPanel) {
        emit('openParagraph');
        return;
    }
    dialogType.value = '';
    currentComponent.value = ParagraphSourceContent;
    currentChatDetail.value = obj;
    dialogVisible.value = true;
}
function openExecutionDetail(row) {
    dialogTitle.value = t('aiChat.executionDetails.title');
    if (props.executionIsRightPanel) {
        emit('openExecutionDetail');
        return;
    }
    dialogType.value = '';
    currentComponent.value = ExecutionDetailContent;
    currentChatDetail.value = row;
    dialogVisible.value = true;
}
function openParagraphDocument(row) {
    if (props.executionIsRightPanel) {
        emit('openParagraphDocument', row);
        return;
    }
    dialogType.value = 'pdfDocument';
    currentComponent.value = ParagraphDocumentContent;
    dialogTitle.value = row.document_name;
    currentChatDetail.value = row;
    dialogVisible.value = true;
}
const uniqueParagraphList = computed(() => {
    const seen = new Set();
    return (props.data.paragraph_list?.filter((paragraph) => {
        const key = paragraph.document_name.trim();
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        // Determine if meta property is not {}, needs JSON parse to object
        if (paragraph.meta && typeof paragraph.meta === 'string') {
            paragraph.meta = JSON.parse(paragraph.meta);
            paragraph.source_url = paragraph.meta.source_url;
        }
        return true;
    }) || []);
});
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "chat-knowledge-source" },
});
/** @type {__VLS_StyleScopedClasses['chat-knowledge-source']} */ ;
if (__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_source) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-4 color-secondary" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    (__VLS_ctx.$t('aiChat.KnowledgeSource.title'));
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        direction: "vertical",
    }));
    const __VLS_2 = __VLS_1({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_5;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        ...{ 'onClick': {} },
        type: "primary",
        ...{ class: "mr-8" },
        link: true,
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onClick': {} },
        type: "primary",
        ...{ class: "mr-8" },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_10;
    const __VLS_11 = {
        /** @type {typeof __VLS_10.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_source))
                throw 0;
            return __VLS_ctx.openParagraph(__VLS_ctx.data);
            // @ts-ignore
            [type, type, application, $t, openParagraph, data,];
        },
    };
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    const { default: __VLS_12 } = __VLS_8.slots;
    let __VLS_13;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_14 = __VLS_asFunctionalComponent1(__VLS_13, new __VLS_13({
        iconName: "app-reference-outlined",
        ...{ class: "mr-4" },
    }));
    const __VLS_15 = __VLS_14({
        iconName: "app-reference-outlined",
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_14));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('aiChat.KnowledgeSource.referenceParagraph'));
    (__VLS_ctx.data.paragraph_list?.length || 0);
    // @ts-ignore
    [$t, data,];
    var __VLS_8;
    var __VLS_9;
}
if (__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_source) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    if (__VLS_ctx.uniqueParagraphList?.length) {
        let __VLS_18;
        /** @ts-ignore @type { | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row'] | typeof __VLS_components.elRow | typeof __VLS_components.ElRow | typeof __VLS_components['el-row']} */
        elRow;
        // @ts-ignore
        const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({
            gutter: (8),
        }));
        const __VLS_20 = __VLS_19({
            gutter: (8),
        }, ...__VLS_functionalComponentArgsRest(__VLS_19));
        const { default: __VLS_23 } = __VLS_21.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.uniqueParagraphList))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            let __VLS_24;
            /** @ts-ignore @type { | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col'] | typeof __VLS_components.elCol | typeof __VLS_components.ElCol | typeof __VLS_components['el-col']} */
            elCol;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({
                span: (12),
                ...{ class: "mb-8" },
            }));
            const __VLS_26 = __VLS_25({
                span: (12),
                ...{ class: "mb-8" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            const { default: __VLS_29 } = __VLS_27.slots;
            let __VLS_30;
            /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
            elCard;
            // @ts-ignore
            const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({
                shadow: "never",
                ...{ style: {} },
            }));
            const __VLS_32 = __VLS_31({
                shadow: "never",
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_31));
            const { default: __VLS_35 } = __VLS_33.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex-between" },
            });
            /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            if (item?.meta?.source_file_id || item?.meta?.source_url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: "@/assets/fileType/web-link-icon.svg",
                    alt: "",
                    width: "24",
                });
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                    src: (__VLS_ctx.getImgUrl(item && item?.document_name)),
                    alt: "",
                    width: "24",
                });
            }
            if (__VLS_ctx.showPDF(item)) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_source))
                                throw 0;
                            if (!(__VLS_ctx.uniqueParagraphList?.length))
                                throw 0;
                            if (!(__VLS_ctx.showPDF(item)))
                                throw 0;
                            return __VLS_ctx.openParagraphDocument(item);
                            // @ts-ignore
                            [type, type, application, uniqueParagraphList, uniqueParagraphList, getImgUrl, showPDF, openParagraphDocument,];
                        } },
                    ...{ class: "ml-4 ellipsis-1" },
                    title: (item?.document_name),
                });
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
                (item && item?.document_name);
            }
            else if (item?.meta?.source_file_id || item?.meta?.source_url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "ml-4" },
                });
                /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.a, __VLS_intrinsics.a)({
                    href: (__VLS_ctx.getFileUrl(item?.meta?.source_file_id) || item?.meta?.source_url),
                    target: "_blank",
                    ...{ class: "ellipsis-1" },
                    title: (item?.document_name?.trim()),
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    title: (item?.document_name?.trim()),
                });
                (item?.document_name);
            }
            else {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ onClick: (...[$event]) => {
                            if (!(__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_source))
                                throw 0;
                            if (!(__VLS_ctx.uniqueParagraphList?.length))
                                throw 0;
                            if (!!(__VLS_ctx.showPDF(item)))
                                throw 0;
                            if (!!(item?.meta?.source_file_id || item?.meta?.source_url))
                                throw 0;
                            return __VLS_ctx.infoMessage(item);
                            // @ts-ignore
                            [getFileUrl, infoMessage,];
                        } },
                });
                __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                    ...{ class: "ellipsis-1 break-all" },
                    title: (item?.document_name?.trim()),
                });
                /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
                /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
                (item?.document_name?.trim());
            }
            // @ts-ignore
            [];
            var __VLS_33;
            // @ts-ignore
            [];
            var __VLS_27;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_21;
    }
}
if (__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_exec) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "execution-details border-t color-secondary flex-between mt-12" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['execution-details']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mr-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('aiChat.KnowledgeSource.consume'));
    (__VLS_ctx.data?.message_tokens + __VLS_ctx.data?.answer_tokens);
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.$t('aiChat.KnowledgeSource.consumeTime'));
    (__VLS_ctx.data?.run_time?.toFixed(2));
    let __VLS_36;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent1(__VLS_36, new __VLS_36({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        ...{ style: {} },
    }));
    const __VLS_38 = __VLS_37({
        ...{ 'onClick': {} },
        type: "primary",
        link: true,
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    let __VLS_41;
    const __VLS_42 = {
        /** @type {typeof __VLS_41.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.type === 'log' || __VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_exec))
                throw 0;
            return __VLS_ctx.openExecutionDetail(__VLS_ctx.data.execution_details);
            // @ts-ignore
            [type, type, application, $t, $t, data, data, data, data, openExecutionDetail,];
        },
    };
    const { default: __VLS_43 } = __VLS_39.slots;
    let __VLS_44;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
        ...{ class: "mr-4" },
    }));
    const __VLS_46 = __VLS_45({
        ...{ class: "mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_45));
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_49 } = __VLS_47.slots;
    let __VLS_50;
    /** @ts-ignore @type { | typeof __VLS_components.Document} */
    Document;
    // @ts-ignore
    const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({}));
    const __VLS_52 = __VLS_51({}, ...__VLS_functionalComponentArgsRest(__VLS_51));
    // @ts-ignore
    [];
    var __VLS_47;
    (__VLS_ctx.$t('aiChat.executionDetails.title'));
    // @ts-ignore
    [$t,];
    var __VLS_39;
    var __VLS_40;
}
let __VLS_55;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
    ...{ class: "scrollbar-dialog" },
    title: (__VLS_ctx.dialogTitle),
    modelValue: (__VLS_ctx.dialogVisible),
    destroyOnClose: true,
    appendToBody: true,
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}));
const __VLS_57 = __VLS_56({
    ...{ class: "scrollbar-dialog" },
    title: (__VLS_ctx.dialogTitle),
    modelValue: (__VLS_ctx.dialogVisible),
    destroyOnClose: true,
    appendToBody: true,
    alignCenter: true,
    closeOnClickModal: (false),
    closeOnPressEscape: (false),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
/** @type {__VLS_StyleScopedClasses['scrollbar-dialog']} */ ;
const { default: __VLS_60 } = __VLS_58.slots;
{
    const { header: __VLS_61 } = __VLS_58.slots;
    const [{ titleId, titleClass }] = __VLS_vSlot(__VLS_61);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "medium ellipsis" },
        ...{ style: {} },
        title: (__VLS_ctx.dialogTitle),
        id: (titleId),
        ...{ class: (titleClass) },
    });
    /** @type {__VLS_StyleScopedClasses['medium']} */ ;
    /** @type {__VLS_StyleScopedClasses['ellipsis']} */ ;
    (__VLS_ctx.dialogTitle);
    // @ts-ignore
    [dialogTitle, dialogTitle, dialogTitle, dialogVisible,];
}
let __VLS_62;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent1(__VLS_62, new __VLS_62({}));
const __VLS_64 = __VLS_63({}, ...__VLS_functionalComponentArgsRest(__VLS_63));
const { default: __VLS_67 } = __VLS_65.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mb-8 p-8" },
    ...{ style: {} },
});
/** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
const __VLS_68 = (__VLS_ctx.currentComponent);
// @ts-ignore
const __VLS_69 = __VLS_asFunctionalComponent1(__VLS_68, new __VLS_68({
    detail: (__VLS_ctx.currentChatDetail),
    appType: (__VLS_ctx.appType),
}));
const __VLS_70 = __VLS_69({
    detail: (__VLS_ctx.currentChatDetail),
    appType: (__VLS_ctx.appType),
}, ...__VLS_functionalComponentArgsRest(__VLS_69));
// @ts-ignore
[currentComponent, currentChatDetail, appType,];
var __VLS_65;
// @ts-ignore
[];
var __VLS_58;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        data: {
            type: Object,
            default: () => { },
        },
        type: {
            type: String,
            default: '',
        },
        appType: {
            type: String,
            default: '',
        },
        executionIsRightPanel: {
            type: Boolean,
            required: false,
        },
        application: {
            type: Object,
            default: () => { },
        },
    },
});
export default {};
