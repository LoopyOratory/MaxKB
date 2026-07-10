/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import ChatOperationButton from '@/components/ai-chat/component/operation-button/ChatOperationButton.vue';
import LogOperationButton from '@/components/ai-chat/component/operation-button/LogOperationButton.vue';
import ShareOperationButton from '@/components/ai-chat/component/operation-button/ShareOperationButton.vue';
const __VLS_props = defineProps();
const emit = defineEmits(['update:chatRecord']);
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
    ...{ class: "operation-button-container" },
});
/** @type {__VLS_StyleScopedClasses['operation-button-container']} */ ;
if (__VLS_ctx.type === 'share') {
    const __VLS_0 = ShareOperationButton;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        data: (__VLS_ctx.chatRecord),
    }));
    const __VLS_2 = __VLS_1({
        data: (__VLS_ctx.chatRecord),
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
}
else if (__VLS_ctx.type === 'log') {
    const __VLS_5 = LogOperationButton;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
        ...{ 'onUpdate:data': {} },
        data: (__VLS_ctx.chatRecord),
        applicationId: (__VLS_ctx.application.id),
        tts: (__VLS_ctx.application.tts_model_enable),
        tts_type: (__VLS_ctx.application.tts_type),
        type: (__VLS_ctx.type),
    }));
    const __VLS_7 = __VLS_6({
        ...{ 'onUpdate:data': {} },
        data: (__VLS_ctx.chatRecord),
        applicationId: (__VLS_ctx.application.id),
        tts: (__VLS_ctx.application.tts_model_enable),
        tts_type: (__VLS_ctx.application.tts_type),
        type: (__VLS_ctx.type),
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    let __VLS_10;
    const __VLS_11 = {
        /** @type {typeof __VLS_10.'update:data'} */
        'onUpdate:data': ((event) => __VLS_ctx.emit('update:chatRecord', event)),
    };
    var __VLS_8;
    var __VLS_9;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    if (__VLS_ctx.chatRecord.is_stop && !__VLS_ctx.chatRecord.write_ed) {
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_17;
        const __VLS_18 = {
            /** @type {typeof __VLS_17.click} */
            onClick: (...[$event]) => {
                if (!!(__VLS_ctx.type === 'share'))
                    throw 0;
                if (!!(__VLS_ctx.type === 'log'))
                    throw 0;
                if (!(__VLS_ctx.chatRecord.is_stop && !__VLS_ctx.chatRecord.write_ed))
                    throw 0;
                return __VLS_ctx.startChat(__VLS_ctx.chatRecord);
                // @ts-ignore
                [type, type, type, chatRecord, chatRecord, chatRecord, chatRecord, chatRecord, application, application, application, emit, startChat,];
            },
        };
        const { default: __VLS_19 } = __VLS_15.slots;
        (__VLS_ctx.$t('aiChat.operation.continue'));
        // @ts-ignore
        [$t,];
        var __VLS_15;
        var __VLS_16;
    }
}
const __VLS_20 = ChatOperationButton;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
    ...{ 'onRegeneration': {} },
    tts: (__VLS_ctx.application.tts_model_enable),
    tts_type: (__VLS_ctx.application.tts_type),
    tts_autoplay: (__VLS_ctx.application.tts_autoplay),
    data: (__VLS_ctx.chatRecord),
    type: (__VLS_ctx.type),
    applicationId: (__VLS_ctx.application.id),
    chatId: (__VLS_ctx.chatRecord.chat_id),
    chat_loading: (__VLS_ctx.loading),
    application: (__VLS_ctx.application),
}));
const __VLS_22 = __VLS_21({
    ...{ 'onRegeneration': {} },
    tts: (__VLS_ctx.application.tts_model_enable),
    tts_type: (__VLS_ctx.application.tts_type),
    tts_autoplay: (__VLS_ctx.application.tts_autoplay),
    data: (__VLS_ctx.chatRecord),
    type: (__VLS_ctx.type),
    applicationId: (__VLS_ctx.application.id),
    chatId: (__VLS_ctx.chatRecord.chat_id),
    chat_loading: (__VLS_ctx.loading),
    application: (__VLS_ctx.application),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
let __VLS_25;
const __VLS_26 = {
    /** @type {typeof __VLS_25.regeneration} */
    onRegeneration: (...[$event]) => {
        return __VLS_ctx.regenerationChart(__VLS_ctx.chatRecord);
        // @ts-ignore
        [type, chatRecord, chatRecord, chatRecord, application, application, application, application, application, loading, regenerationChart,];
    },
};
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.chatRecord.write_ed && 500 != __VLS_ctx.chatRecord.status) }, null, null);
var __VLS_23;
var __VLS_24;
// @ts-ignore
[chatRecord, chatRecord,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __typeProps: {},
});
export default {};
