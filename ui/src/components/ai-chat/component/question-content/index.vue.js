/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { getImgUrl, downloadByURL } from '@/utils/common';
import { useRoute } from 'vue-router';
import { onMounted, computed, ref, nextTick } from 'vue';
import { getAttrsArray } from '@/utils/array';
import { copyClick } from '@/utils/clipboard';
const route = useRoute();
const { query: { mode }, } = route;
const props = defineProps();
const showIcon = ref(false);
const isReQuestion = ref(false);
const editText = ref('');
const direction = ref('horizontal');
const showAvatar = computed(() => {
    return props.application.show_user_avatar == undefined ? true : props.application.show_user_avatar;
});
const document_list = computed(() => {
    if (props.chatRecord?.upload_meta) {
        return props.chatRecord.upload_meta?.document_list || [];
    }
    const startNode = props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
    return startNode?.document_list || [];
});
const image_list = computed(() => {
    if (props.chatRecord?.upload_meta) {
        return props.chatRecord.upload_meta?.image_list || [];
    }
    const startNode = props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
    return startNode?.image_list || [];
});
const video_list = computed(() => {
    if (props.chatRecord?.upload_meta) {
        return props.chatRecord.upload_meta?.video_list || [];
    }
    const startNode = props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
    return startNode?.video_list || [];
});
const audio_list = computed(() => {
    if (props.chatRecord?.upload_meta) {
        return props.chatRecord.upload_meta?.audio_list || [];
    }
    const startNode = props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
    return startNode?.audio_list || [];
});
const other_list = computed(() => {
    if (props.chatRecord?.upload_meta) {
        return props.chatRecord.upload_meta?.other_list || [];
    }
    const startNode = props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
    return startNode?.other_list || [];
});
const getClassName = computed(() => {
    return document_list.value.length >= 2 || other_list.value.length >= 2
        ? 'media_2'
        : document_list.value.length
            ? `media_${document_list.value.length}`
            : other_list.value.length
                ? `media_${other_list.value.length}`
                : `media_0`;
});
function downloadFile(item) {
    downloadByURL(item.url, item.name);
}
function handleEdit(chatRecord) {
    isReQuestion.value = true;
    editText.value = chatRecord.problem_text;
}
const cancelReQuestion = () => {
    isReQuestion.value = false;
};
const emit = defineEmits(['reQuestion']);
const quickInputRef = ref();
function sendReQuestionMessage(event) {
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // IfMoveEnd, andPressEnter key, notDirectSend
    if ((isMobile || mode === 'mobile') && event?.key === 'Enter') {
        // BlockDefaultEvent
        return;
    }
    if (!event?.ctrlKey && !event?.shiftKey && !event?.altKey && !event?.metaKey) {
        // If no modifier key is pressed, block the default event
        event?.preventDefault();
        if (editText.value.trim() && editText.value.trim() !== props.chatRecord.problem_text.trim()) {
            const container = props.chatRecord?.upload_meta
                ? props.chatRecord.upload_meta
                : props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
            props.chatRecord.problem_text = editText.value;
            reset_answer_text_list(props.chatRecord.answer_text_list);
            props.chatRecord.write_ed = false;
            isReQuestion.value = false;
            props.sendMessage(editText.value, {
                re_chat: true,
                image_list: container?.image_list || [],
                document_list: container?.document_list || [],
                audio_list: container?.audio_list || [],
                video_list: container?.video_list || [],
                other_list: container?.other_list || [],
                chat_record_id: props.chatRecord.record_id
                    ? props.chatRecord.record_id
                    : props.chatRecord.id,
            }, props.chatRecord);
        }
    }
    else {
        // If ctrl/shift/cmd/opt + enter is pressed simultaneously, insert a newline
        insertNewlineAtCursor(event);
    }
}
const insertNewlineAtCursor = (event) => {
    const textarea = quickInputRef.value.$el.querySelector('.el-textarea__inner');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    // Block default behavior (avoid extra newlines)
    event.preventDefault();
    // At cursor, insert newline
    editText.value =
        editText.value.trim().slice(0, startPos) + '\n' + editText.value.trim().slice(endPos);
    nextTick(() => {
        textarea.setSelectionRange(startPos + 1, startPos + 1); // Position cursor after newline
    });
};
const reset_answer_text_list = (answer_text_list) => {
    answer_text_list.splice(0, answer_text_list.length);
    answer_text_list.push([]);
};
onMounted(() => { });
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
/** @type {__VLS_StyleScopedClasses['download-button']} */ ;
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
/** @type {__VLS_StyleScopedClasses['media_1']} */ ;
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
/** @type {__VLS_StyleScopedClasses['el-space__item']} */ ;
/** @type {__VLS_StyleScopedClasses['media_1']} */ ;
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['el-textarea__inner']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ onMouseenter: (...[$event]) => {
            return __VLS_ctx.showIcon = true;
            // @ts-ignore
            [showIcon,];
        } },
    ...{ onMouseleave: (...[$event]) => {
            return __VLS_ctx.showIcon = false;
            // @ts-ignore
            [showIcon,];
        } },
});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "question-content item-content lighter" },
});
/** @type {__VLS_StyleScopedClasses['question-content']} */ ;
/** @type {__VLS_StyleScopedClasses['item-content']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
if (!__VLS_ctx.isReQuestion) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "content p-12-16 border-r-8" },
        ...{ class: (__VLS_ctx.getClassName) },
    });
    /** @type {__VLS_StyleScopedClasses['content']} */ ;
    /** @type {__VLS_StyleScopedClasses['p-12-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text break-all pre-wrap" },
    });
    /** @type {__VLS_StyleScopedClasses['text']} */ ;
    /** @type {__VLS_StyleScopedClasses['break-all']} */ ;
    /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
    if (__VLS_ctx.document_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            wrap: true,
            ...{ class: "w-full media-file-width" },
        }));
        const __VLS_2 = __VLS_1({
            wrap: true,
            ...{ class: "w-full media-file-width" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
        const { default: __VLS_5 } = __VLS_3.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.document_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            let __VLS_6;
            /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
            elCard;
            // @ts-ignore
            const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
                shadow: "never",
                ...{ style: {} },
                ...{ class: "download-file cursor" },
            }));
            const __VLS_8 = __VLS_7({
                shadow: "never",
                ...{ style: {} },
                ...{ class: "download-file cursor" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_7));
            /** @type {__VLS_StyleScopedClasses['download-file']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            const { default: __VLS_11 } = __VLS_9.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.isReQuestion))
                            throw 0;
                        if (!(__VLS_ctx.document_list.length))
                            throw 0;
                        return __VLS_ctx.downloadFile(item);
                        // @ts-ignore
                        [isReQuestion, getClassName, document_list, document_list, downloadFile,];
                    } },
                ...{ class: "download-button flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['download-button']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_12;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
                ...{ class: "mr-4" },
            }));
            const __VLS_14 = __VLS_13({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_13));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            const { default: __VLS_17 } = __VLS_15.slots;
            let __VLS_18;
            /** @ts-ignore @type { | typeof __VLS_components.Download} */
            Download;
            // @ts-ignore
            const __VLS_19 = __VLS_asFunctionalComponent1(__VLS_18, new __VLS_18({}));
            const __VLS_20 = __VLS_19({}, ...__VLS_functionalComponentArgsRest(__VLS_19));
            // @ts-ignore
            [];
            var __VLS_15;
            (__VLS_ctx.$t('aiChat.download'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "show flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['show']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.getImgUrl(item && item?.name)),
                alt: "",
                width: "24",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ml-4 ellipsis-1" },
                title: (item && item?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (item && item?.name);
            // @ts-ignore
            [$t, getImgUrl,];
            var __VLS_9;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_3;
    }
    if (__VLS_ctx.image_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            wrap: true,
        }));
        const __VLS_25 = __VLS_24({
            wrap: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
        const { default: __VLS_28 } = __VLS_26.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.image_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (item.url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "file cursor border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['file']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                let __VLS_29;
                /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
                elImage;
                // @ts-ignore
                const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
                    src: (item.url),
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                    previewSrcList: (__VLS_ctx.getAttrsArray(__VLS_ctx.image_list, 'url')),
                    initialIndex: (index),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                }));
                const __VLS_31 = __VLS_30({
                    src: (item.url),
                    zoomRate: (1.2),
                    maxScale: (7),
                    minScale: (0.2),
                    previewSrcList: (__VLS_ctx.getAttrsArray(__VLS_ctx.image_list, 'url')),
                    initialIndex: (index),
                    alt: "",
                    fit: "cover",
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                }, ...__VLS_functionalComponentArgsRest(__VLS_30));
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            // @ts-ignore
            [image_list, image_list, image_list, getAttrsArray,];
        }
        // @ts-ignore
        [];
        var __VLS_26;
    }
    if (__VLS_ctx.audio_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_34;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_35 = __VLS_asFunctionalComponent1(__VLS_34, new __VLS_34({
            wrap: true,
        }));
        const __VLS_36 = __VLS_35({
            wrap: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_35));
        const { default: __VLS_39 } = __VLS_37.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.audio_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (item.url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "file cursor border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['file']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.audio)({
                    src: (item.url),
                    controls: true,
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            // @ts-ignore
            [audio_list, audio_list,];
        }
        // @ts-ignore
        [];
        var __VLS_37;
    }
    if (__VLS_ctx.video_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_40;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent1(__VLS_40, new __VLS_40({
            wrap: true,
        }));
        const __VLS_42 = __VLS_41({
            wrap: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        const { default: __VLS_45 } = __VLS_43.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.video_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            if (item.url) {
                __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                    ...{ class: "file cursor border-r-6" },
                });
                /** @type {__VLS_StyleScopedClasses['file']} */ ;
                /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
                __VLS_asFunctionalElement1(__VLS_intrinsics.video)({
                    src: (item.url),
                    ...{ style: {} },
                    ...{ class: "border-r-6" },
                    controls: true,
                    autoplay: true,
                });
                /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
            }
            // @ts-ignore
            [video_list, video_list,];
        }
        // @ts-ignore
        [];
        var __VLS_43;
    }
    if (__VLS_ctx.other_list.length) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        let __VLS_46;
        /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
        elSpace;
        // @ts-ignore
        const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
            wrap: true,
            ...{ class: "w-full media-file-width" },
        }));
        const __VLS_48 = __VLS_47({
            wrap: true,
            ...{ class: "w-full media-file-width" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_47));
        /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
        /** @type {__VLS_StyleScopedClasses['media-file-width']} */ ;
        const { default: __VLS_51 } = __VLS_49.slots;
        for (const [item, index] of __VLS_vFor((__VLS_ctx.other_list))) {
            __VLS_asFunctionalElement(__VLS_intrinsics.template)({
                key: (index),
            });
            let __VLS_52;
            /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
            elCard;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent1(__VLS_52, new __VLS_52({
                shadow: "never",
                ...{ style: {} },
                ...{ class: "download-file cursor" },
            }));
            const __VLS_54 = __VLS_53({
                shadow: "never",
                ...{ style: {} },
                ...{ class: "download-file cursor" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            /** @type {__VLS_StyleScopedClasses['download-file']} */ ;
            /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
            const { default: __VLS_57 } = __VLS_55.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ onClick: (...[$event]) => {
                        if (!(!__VLS_ctx.isReQuestion))
                            throw 0;
                        if (!(__VLS_ctx.other_list.length))
                            throw 0;
                        return __VLS_ctx.downloadFile(item);
                        // @ts-ignore
                        [downloadFile, other_list, other_list,];
                    } },
                ...{ class: "download-button flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['download-button']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            let __VLS_58;
            /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
            elIcon;
            // @ts-ignore
            const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
                ...{ class: "mr-4" },
            }));
            const __VLS_60 = __VLS_59({
                ...{ class: "mr-4" },
            }, ...__VLS_functionalComponentArgsRest(__VLS_59));
            /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
            const { default: __VLS_63 } = __VLS_61.slots;
            let __VLS_64;
            /** @ts-ignore @type { | typeof __VLS_components.Download} */
            Download;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({}));
            const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
            // @ts-ignore
            [];
            var __VLS_61;
            (__VLS_ctx.$t('aiChat.download'));
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "show flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['show']} */ ;
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.getImgUrl(item && item?.name)),
                alt: "",
                width: "24",
            });
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "ml-4 ellipsis-1" },
                title: (item && item?.name),
            });
            /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
            /** @type {__VLS_StyleScopedClasses['ellipsis-1']} */ ;
            (item && item?.name);
            // @ts-ignore
            [$t, getImgUrl,];
            var __VLS_55;
            // @ts-ignore
            [];
        }
        // @ts-ignore
        [];
        var __VLS_49;
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    (__VLS_ctx.chatRecord.problem_text);
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "question-content__operate" },
    });
    /** @type {__VLS_StyleScopedClasses['question-content__operate']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "operate-textarea" },
    });
    /** @type {__VLS_StyleScopedClasses['operate-textarea']} */ ;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ 'onKeydown': {} },
        ref: "quickInputRef",
        modelValue: (__VLS_ctx.editText),
        autosize: ({ minRows: 1, maxRows: 10 }),
        type: "textarea",
        placeholder: (__VLS_ctx.$t('aiChat.inputPlaceholder.default')),
        maxlength: (100000),
        ...{ class: "chat-operate-textarea" },
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onKeydown': {} },
        ref: "quickInputRef",
        modelValue: (__VLS_ctx.editText),
        autosize: ({ minRows: 1, maxRows: 10 }),
        type: "textarea",
        placeholder: (__VLS_ctx.$t('aiChat.inputPlaceholder.default')),
        maxlength: (100000),
        ...{ class: "chat-operate-textarea" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_74;
    const __VLS_75 = {
        /** @type {typeof __VLS_74.keydown} */
        onKeydown: (__VLS_ctx.sendReQuestionMessage),
    };
    var __VLS_76;
    /** @type {__VLS_StyleScopedClasses['chat-operate-textarea']} */ ;
    var __VLS_72;
    var __VLS_73;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "operate text-right" },
    });
    /** @type {__VLS_StyleScopedClasses['operate']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_78;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_79 = __VLS_asFunctionalComponent1(__VLS_78, new __VLS_78({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_80 = __VLS_79({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_79));
    let __VLS_83;
    const __VLS_84 = {
        /** @type {typeof __VLS_83.click} */
        onClick: (__VLS_ctx.cancelReQuestion),
    };
    const { default: __VLS_85 } = __VLS_81.slots;
    let __VLS_86;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_87 = __VLS_asFunctionalComponent1(__VLS_86, new __VLS_86({
        ...{ class: "color-secondary" },
    }));
    const __VLS_88 = __VLS_87({
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_87));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    const { default: __VLS_91 } = __VLS_89.slots;
    let __VLS_92;
    /** @ts-ignore @type { | typeof __VLS_components.Close} */
    Close;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent1(__VLS_92, new __VLS_92({}));
    const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
    // @ts-ignore
    [$t, chatRecord, editText, sendReQuestionMessage, cancelReQuestion,];
    var __VLS_89;
    // @ts-ignore
    [];
    var __VLS_81;
    var __VLS_82;
    let __VLS_97;
    /** @ts-ignore @type { | typeof __VLS_components.elDivider | typeof __VLS_components.ElDivider | typeof __VLS_components['el-divider']} */
    elDivider;
    // @ts-ignore
    const __VLS_98 = __VLS_asFunctionalComponent1(__VLS_97, new __VLS_97({
        direction: "vertical",
    }));
    const __VLS_99 = __VLS_98({
        direction: "vertical",
    }, ...__VLS_functionalComponentArgsRest(__VLS_98));
    let __VLS_102;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_103 = __VLS_asFunctionalComponent1(__VLS_102, new __VLS_102({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "sent-button" },
        disabled: (!__VLS_ctx.editText.trim() || __VLS_ctx.editText.trim() === __VLS_ctx.chatRecord.problem_text.trim()),
    }));
    const __VLS_104 = __VLS_103({
        ...{ 'onClick': {} },
        text: true,
        ...{ class: "sent-button" },
        disabled: (!__VLS_ctx.editText.trim() || __VLS_ctx.editText.trim() === __VLS_ctx.chatRecord.problem_text.trim()),
    }, ...__VLS_functionalComponentArgsRest(__VLS_103));
    let __VLS_107;
    const __VLS_108 = {
        /** @type {typeof __VLS_107.click} */
        onClick: (__VLS_ctx.sendReQuestionMessage),
    };
    /** @type {__VLS_StyleScopedClasses['sent-button']} */ ;
    const { default: __VLS_109 } = __VLS_105.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
        src: "@/assets/chat/icon_send.svg",
        alt: "",
    });
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.editText.trim() || __VLS_ctx.editText.trim() === __VLS_ctx.chatRecord.problem_text.trim()) }, null, null);
    let __VLS_110;
    /** @ts-ignore @type { | typeof __VLS_components.SendIcon} */
    SendIcon;
    // @ts-ignore
    const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({}));
    const __VLS_112 = __VLS_111({}, ...__VLS_functionalComponentArgsRest(__VLS_111));
    __VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.editText.trim() && __VLS_ctx.editText.trim() !== __VLS_ctx.chatRecord.problem_text.trim()) }, null, null);
    // @ts-ignore
    [chatRecord, chatRecord, chatRecord, editText, editText, editText, editText, editText, editText, sendReQuestionMessage,];
    var __VLS_105;
    var __VLS_106;
}
if (__VLS_ctx.showAvatar) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "avatar ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    if (__VLS_ctx.application.user_avatar) {
        let __VLS_115;
        /** @ts-ignore @type { | typeof __VLS_components.elImage | typeof __VLS_components.ElImage | typeof __VLS_components['el-image']} */
        elImage;
        // @ts-ignore
        const __VLS_116 = __VLS_asFunctionalComponent1(__VLS_115, new __VLS_115({
            src: (__VLS_ctx.application.user_avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }));
        const __VLS_117 = __VLS_116({
            src: (__VLS_ctx.application.user_avatar),
            alt: "",
            fit: "cover",
            ...{ style: {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_116));
    }
    else {
        let __VLS_120;
        /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar'] | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
        elAvatar;
        // @ts-ignore
        const __VLS_121 = __VLS_asFunctionalComponent1(__VLS_120, new __VLS_120({
            size: (28),
        }));
        const __VLS_122 = __VLS_121({
            size: (28),
        }, ...__VLS_functionalComponentArgsRest(__VLS_121));
        const { default: __VLS_125 } = __VLS_123.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/user-icon.svg",
            ...{ style: {} },
            alt: "",
        });
        // @ts-ignore
        [showAvatar, application, application,];
        var __VLS_123;
    }
}
if (!__VLS_ctx.selection) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "question-edit-button text-right mt-4" },
    });
    /** @type {__VLS_StyleScopedClasses['question-edit-button']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
    if (!__VLS_ctx.isReQuestion && __VLS_ctx.showIcon && props.type === 'ai-chat') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        if (props.isLast) {
            let __VLS_126;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_127 = __VLS_asFunctionalComponent1(__VLS_126, new __VLS_126({
                effect: "dark",
                content: (__VLS_ctx.$t('common.edit')),
                placement: "top",
            }));
            const __VLS_128 = __VLS_127({
                effect: "dark",
                content: (__VLS_ctx.$t('common.edit')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_127));
            const { default: __VLS_131 } = __VLS_129.slots;
            let __VLS_132;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
                ...{ 'onClick': {} },
                text: true,
            }));
            const __VLS_134 = __VLS_133({
                ...{ 'onClick': {} },
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_133));
            let __VLS_137;
            const __VLS_138 = {
                /** @type {typeof __VLS_137.click} */
                onClick: (...[$event]) => {
                    if (!(!__VLS_ctx.selection))
                        throw 0;
                    if (!(!__VLS_ctx.isReQuestion && __VLS_ctx.showIcon && props.type === 'ai-chat'))
                        throw 0;
                    if (!(props.isLast))
                        throw 0;
                    return __VLS_ctx.handleEdit(__VLS_ctx.chatRecord);
                    // @ts-ignore
                    [showIcon, isReQuestion, $t, chatRecord, selection, handleEdit,];
                },
            };
            const { default: __VLS_139 } = __VLS_135.slots;
            let __VLS_140;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_141 = __VLS_asFunctionalComponent1(__VLS_140, new __VLS_140({
                ...{ class: "color-secondary" },
                iconName: "app-edit",
            }));
            const __VLS_142 = __VLS_141({
                ...{ class: "color-secondary" },
                iconName: "app-edit",
            }, ...__VLS_functionalComponentArgsRest(__VLS_141));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [];
            var __VLS_135;
            var __VLS_136;
            // @ts-ignore
            [];
            var __VLS_129;
        }
        let __VLS_145;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent1(__VLS_145, new __VLS_145({
            effect: "dark",
            content: (__VLS_ctx.$t('common.copy')),
            placement: "top",
        }));
        const __VLS_147 = __VLS_146({
            effect: "dark",
            content: (__VLS_ctx.$t('common.copy')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        const { default: __VLS_150 } = __VLS_148.slots;
        let __VLS_151;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_152 = __VLS_asFunctionalComponent1(__VLS_151, new __VLS_151({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_153 = __VLS_152({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_152));
        let __VLS_156;
        const __VLS_157 = {
            /** @type {typeof __VLS_156.click} */
            onClick: (...[$event]) => {
                if (!(!__VLS_ctx.selection))
                    throw 0;
                if (!(!__VLS_ctx.isReQuestion && __VLS_ctx.showIcon && props.type === 'ai-chat'))
                    throw 0;
                return __VLS_ctx.copyClick(__VLS_ctx.chatRecord?.problem_text);
                // @ts-ignore
                [$t, chatRecord, copyClick,];
            },
        };
        const { default: __VLS_158 } = __VLS_154.slots;
        let __VLS_159;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_160 = __VLS_asFunctionalComponent1(__VLS_159, new __VLS_159({
            ...{ class: "color-secondary" },
            iconName: "app-copy",
        }));
        const __VLS_161 = __VLS_160({
            ...{ class: "color-secondary" },
            iconName: "app-copy",
        }, ...__VLS_functionalComponentArgsRest(__VLS_160));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_154;
        var __VLS_155;
        // @ts-ignore
        [];
        var __VLS_148;
    }
}
// @ts-ignore
var __VLS_77 = __VLS_76;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
