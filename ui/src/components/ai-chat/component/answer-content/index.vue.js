/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import KnowledgeSourceComponent from '@/components/ai-chat/component/knowledge-source-component/index.vue';
import MdRenderer from '@/components/markdown/MdRenderer.vue';
import OperationButton from '@/components/ai-chat/component/operation-button/index.vue';
import bus from '@/bus';
import { iconComponent } from '@/workflow/icons/utils';
import { t } from '@/locales';
const props = defineProps();
const emit = defineEmits([
    'update:chatRecord',
    'openExecutionDetail',
    'openParagraph',
    'openParagraphDocument',
]);
const showAvatar = computed(() => {
    return props.application.show_avatar == undefined ? true : props.application.show_avatar;
});
const progress = computed(() => {
    if (props.chatRecord.currentChunk) {
        return {
            content: `${t('aiChat.executing')} ${props.chatRecord.currentChunk.node_name}`,
            node_type: props.chatRecord.currentChunk.node_type,
        };
    }
    return null;
});
const showUserAvatar = computed(() => {
    return props.application.show_user_avatar == undefined ? true : props.application.show_user_avatar;
});
const chatMessage = (question, type, other_params_data) => {
    if (type === 'old') {
        add_answer_text_list(props.chatRecord.answer_text_list);
        props.sendMessage(question, other_params_data, props.chatRecord).then(() => {
            props.chatManagement.open(props.chatRecord.id);
            props.chatManagement.write(props.chatRecord.id);
        });
    }
    else {
        props.sendMessage(question, other_params_data);
    }
};
const add_answer_text_list = (answer_text_list) => {
    answer_text_list.push([]);
};
const openControl = (event) => {
    if (props.type !== 'log') {
        bus.emit('open-control', event);
    }
};
const answer_text_list = computed(() => {
    return props.chatRecord.answer_text_list.map((item) => {
        if (typeof item == 'string') {
            return [
                {
                    content: item,
                    chat_record_id: undefined,
                    child_node: undefined,
                    runtime_node_id: undefined,
                    reasoning_content: undefined,
                },
            ];
        }
        else if (item instanceof Array) {
            return item;
        }
        else {
            return [item];
        }
    });
});
function showSource(row) {
    if (props.type === 'log') {
        return true;
    }
    else if (row.write_ed && 500 !== row.status) {
        return true;
    }
    return false;
}
const regenerationChart = (chat) => {
    const container = props.chatRecord?.upload_meta
        ? props.chatRecord.upload_meta
        : props.chatRecord.execution_details?.find((detail) => detail.type === 'start-node');
    props.sendMessage(chat.problem_text, {
        re_chat: true,
        image_list: container?.image_list || [],
        document_list: container?.document_list || [],
        audio_list: container?.audio_list || [],
        video_list: container?.video_list || [],
        other_list: container?.other_list || [],
    });
};
const stopChat = (chat) => {
    props.chatManagement.stop(chat.id);
};
const startChat = (chat) => {
    props.chatManagement.write(chat.id);
};
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
    ...{ class: "item-content lighter" },
});
/** @type {__VLS_StyleScopedClasses['item-content']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
for (const [answer_text, index] of __VLS_vFor((__VLS_ctx.answer_text_list))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        key: (index),
        ...{ class: "mb-8 flex" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    if (__VLS_ctx.showAvatar) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "avatar mr-8" },
        });
        /** @type {__VLS_StyleScopedClasses['avatar']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
        if (__VLS_ctx.application.avatar) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
                src: (__VLS_ctx.application.avatar),
                height: "28px",
                width: "28px",
            });
        }
        else {
            let __VLS_0;
            /** @ts-ignore @type { | typeof __VLS_components.LogoIcon} */
            LogoIcon;
            // @ts-ignore
            const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
                height: "28px",
                width: "28px",
            }));
            const __VLS_2 = __VLS_1({
                height: "28px",
                width: "28px",
            }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        }
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ onMouseup: (__VLS_ctx.openControl) },
        ...{ class: "content w-full" },
        ...{ style: ({
                'padding-right': __VLS_ctx.showUserAvatar ? 'var(--padding-left)' : '0',
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['content']} */ ;
    /** @type {__VLS_StyleScopedClasses['w-full']} */ ;
    if (__VLS_ctx.type === 'debug-ai-chat' ? true : __VLS_ctx.application.show_exec) {
        if (!__VLS_ctx.chatRecord.write_ed && __VLS_ctx.progress && index >= __VLS_ctx.answer_text_list.length - 1 && !__VLS_ctx.chatRecord.is_stop) {
            let __VLS_5;
            /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
            elCard;
            // @ts-ignore
            const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
                shadow: "always",
                ...{ class: "border-r-8 mb-8" },
                ...{ style: {} },
            }));
            const __VLS_7 = __VLS_6({
                shadow: "always",
                ...{ class: "border-r-8 mb-8" },
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_6));
            /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
            /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
            const { default: __VLS_10 } = __VLS_8.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "flex align-center" },
            });
            /** @type {__VLS_StyleScopedClasses['flex']} */ ;
            /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
            const __VLS_11 = (__VLS_ctx.iconComponent(`${__VLS_ctx.progress.node_type}-icon`));
            // @ts-ignore
            const __VLS_12 = __VLS_asFunctionalComponent1(__VLS_11, new __VLS_11({
                ...{ class: "mr-8" },
                size: (16),
                ...{ style: {} },
            }));
            const __VLS_13 = __VLS_12({
                ...{ class: "mr-8" },
                size: (16),
                ...{ style: {} },
            }, ...__VLS_functionalComponentArgsRest(__VLS_12));
            /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
            const __VLS_16 = MdRenderer || MdRenderer;
            // @ts-ignore
            const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
                source: (__VLS_ctx.progress.content),
            }));
            const __VLS_18 = __VLS_17({
                source: (__VLS_ctx.progress.content),
            }, ...__VLS_functionalComponentArgsRest(__VLS_17));
            // @ts-ignore
            [answer_text_list, answer_text_list, showAvatar, application, application, application, openControl, showUserAvatar, type, chatRecord, chatRecord, progress, progress, progress, iconComponent,];
            var __VLS_8;
        }
    }
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({
        shadow: "always",
        ...{ class: "border-r-8" },
        ...{ style: {} },
    }));
    const __VLS_23 = __VLS_22({
        shadow: "always",
        ...{ class: "border-r-8" },
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
    /** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
    const { default: __VLS_26 } = __VLS_24.slots;
    if ((__VLS_ctx.chatRecord.write_ed === undefined || __VLS_ctx.chatRecord.write_ed === true) &&
        answer_text.length == 0 &&
        answer_text
            .map((item) => item.content)
            .join('')
            .trim().length == 0) {
        const __VLS_27 = MdRenderer || MdRenderer;
        // @ts-ignore
        const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
            source: (__VLS_ctx.$t('aiChat.tip.answerMessage')),
        }));
        const __VLS_29 = __VLS_28({
            source: (__VLS_ctx.$t('aiChat.tip.answerMessage')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    }
    else if (answer_text.length > 0) {
        for (const [answer, index] of __VLS_vFor((answer_text))) {
            const __VLS_32 = MdRenderer || MdRenderer;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent1(__VLS_32, new __VLS_32({
                key: (index),
                chat_record_id: (answer.chat_record_id),
                child_node: (answer.child_node),
                runtime_node_id: (answer.runtime_node_id),
                reasoning_content: (answer.reasoning_content),
                disabled: (__VLS_ctx.loading || __VLS_ctx.type == 'log'),
                source: (answer.content),
                sendMessage: (__VLS_ctx.chatMessage),
            }));
            const __VLS_34 = __VLS_33({
                key: (index),
                chat_record_id: (answer.chat_record_id),
                child_node: (answer.child_node),
                runtime_node_id: (answer.runtime_node_id),
                reasoning_content: (answer.reasoning_content),
                disabled: (__VLS_ctx.loading || __VLS_ctx.type == 'log'),
                source: (answer.content),
                sendMessage: (__VLS_ctx.chatMessage),
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            // @ts-ignore
            [type, chatRecord, chatRecord, $t, loading, chatMessage,];
        }
    }
    else if (__VLS_ctx.chatRecord.is_stop) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            shadow: "always",
            ...{ style: {} },
        });
        (__VLS_ctx.$t('aiChat.tip.stopAnswer'));
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
            shadow: "always",
            ...{ style: {} },
        });
        (__VLS_ctx.$t('aiChat.tip.answerLoading'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "dotting" },
        });
        /** @type {__VLS_StyleScopedClasses['dotting']} */ ;
    }
    if (__VLS_ctx.showSource(__VLS_ctx.chatRecord) && index === __VLS_ctx.chatRecord.answer_text_list.length - 1) {
        const __VLS_37 = KnowledgeSourceComponent;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent1(__VLS_37, new __VLS_37({
            ...{ 'onOpenExecutionDetail': {} },
            ...{ 'onOpenParagraph': {} },
            ...{ 'onOpenParagraphDocument': {} },
            data: (__VLS_ctx.chatRecord),
            application: (__VLS_ctx.application),
            type: (__VLS_ctx.type),
            appType: (__VLS_ctx.application.type),
            executionIsRightPanel: (props.executionIsRightPanel),
        }));
        const __VLS_39 = __VLS_38({
            ...{ 'onOpenExecutionDetail': {} },
            ...{ 'onOpenParagraph': {} },
            ...{ 'onOpenParagraphDocument': {} },
            data: (__VLS_ctx.chatRecord),
            application: (__VLS_ctx.application),
            type: (__VLS_ctx.type),
            appType: (__VLS_ctx.application.type),
            executionIsRightPanel: (props.executionIsRightPanel),
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
        let __VLS_42;
        const __VLS_43 = {
            /** @type {typeof __VLS_42.openExecutionDetail} */
            onOpenExecutionDetail: (...[$event]) => {
                if (!(__VLS_ctx.showSource(__VLS_ctx.chatRecord) && index === __VLS_ctx.chatRecord.answer_text_list.length - 1))
                    throw 0;
                return __VLS_ctx.emit('openExecutionDetail');
                // @ts-ignore
                [application, application, type, chatRecord, chatRecord, chatRecord, chatRecord, $t, $t, showSource, emit,];
            },
        };
        const __VLS_44 = {
            /** @type {typeof __VLS_42.openParagraph} */
            onOpenParagraph: (...[$event]) => {
                if (!(__VLS_ctx.showSource(__VLS_ctx.chatRecord) && index === __VLS_ctx.chatRecord.answer_text_list.length - 1))
                    throw 0;
                return __VLS_ctx.emit('openParagraph');
                // @ts-ignore
                [emit,];
            },
        };
        const __VLS_45 = {
            /** @type {typeof __VLS_42.openParagraphDocument} */
            onOpenParagraphDocument: ((val) => __VLS_ctx.emit('openParagraphDocument', val)),
        };
        var __VLS_40;
        var __VLS_41;
    }
    // @ts-ignore
    [emit,];
    var __VLS_24;
    // @ts-ignore
    [];
}
if (!__VLS_ctx.selection) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "content" },
        ...{ style: ({
                'padding-left': __VLS_ctx.showAvatar ? 'var(--padding-left)' : '0',
                'padding-right': __VLS_ctx.showUserAvatar ? 'var(--padding-left)' : '0',
            }) },
    });
    /** @type {__VLS_StyleScopedClasses['content']} */ ;
    const __VLS_46 = OperationButton || OperationButton;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent1(__VLS_46, new __VLS_46({
        ...{ 'onUpdate:chatRecord': {} },
        type: (__VLS_ctx.type),
        application: (__VLS_ctx.application),
        chatRecord: (__VLS_ctx.chatRecord),
        loading: (__VLS_ctx.loading),
        startChat: (__VLS_ctx.startChat),
        stopChat: (__VLS_ctx.stopChat),
        regenerationChart: (__VLS_ctx.regenerationChart),
    }));
    const __VLS_48 = __VLS_47({
        ...{ 'onUpdate:chatRecord': {} },
        type: (__VLS_ctx.type),
        application: (__VLS_ctx.application),
        chatRecord: (__VLS_ctx.chatRecord),
        loading: (__VLS_ctx.loading),
        startChat: (__VLS_ctx.startChat),
        stopChat: (__VLS_ctx.stopChat),
        regenerationChart: (__VLS_ctx.regenerationChart),
    }, ...__VLS_functionalComponentArgsRest(__VLS_47));
    let __VLS_51;
    const __VLS_52 = {
        /** @type {typeof __VLS_51.'update:chatRecord'} */
        'onUpdate:chatRecord': ((event) => __VLS_ctx.emit('update:chatRecord', event)),
    };
    var __VLS_49;
    var __VLS_50;
}
// @ts-ignore
[showAvatar, application, showUserAvatar, type, chatRecord, loading, emit, selection, startChat, stopChat, regenerationChart,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
