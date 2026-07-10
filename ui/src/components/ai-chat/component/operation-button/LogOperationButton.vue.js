/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, ref } from 'vue';
import { copyClick } from '@/utils/clipboard';
import EditContentDialog from '@/views/chat-log/component/EditContentDialog.vue';
import EditMarkDialog from '@/views/chat-log/component/EditMarkDialog.vue';
import { datetimeFormat } from '@/utils/time';
import applicationApi from '@/api/application/application';
import { useRoute } from 'vue-router';
import permissionMap from '@/permission';
import { MsgError } from '@/utils/message';
import { t } from '@/locales';
import VoteReasonContent from '@/components/ai-chat/component/operation-button/VoteReasonContent.vue';
const route = useRoute();
const { params: { id }, } = route;
const props = defineProps({
    data: {
        type: Object,
        default: () => { },
    },
    applicationId: {
        type: String,
        default: '',
    },
    tts: Boolean,
    tts_type: String,
});
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const permissionPrecise = computed(() => {
    return permissionMap['application'][apiType.value];
});
const emit = defineEmits(['update:data']);
const audioPlayer = ref(null);
const EditContentDialogRef = ref();
const EditMarkDialogRef = ref();
const buttonData = ref(props.data);
const loading = ref(false);
const utterance = ref(null);
const audioList = ref([]);
const currentAudioIndex = ref(0);
function editContent(data) {
    EditContentDialogRef.value.open(data);
}
function editMark(data) {
    EditMarkDialogRef.value.open(data);
}
const audioPlayerStatus = ref(false);
function markdownToPlainText(md) {
    return (md
        // RemoveImage ![alt](url)
        .replace(/!\[.*?\]\(.*?\)/g, '')
        // RemoveLink [text](url)
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Remove Markdown TitleSymbol (#, ##, ###)
        .replace(/^#{1,6}\s+/gm, '')
        // RemoveBold **text** or __text__
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        // RemoveItalic *text* or _text_
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        // RemoveInlineCode `code`
        .replace(/`(.*?)`/g, '$1')
        // Remove code block ```code```
        .replace(/```.*?```/gs, '')
        // RemoveExtraNewline
        .replace(/\n{2,}/g, '\n')
        .trim());
}
function removeFormRander(text) {
    return text.replace(/<form_rander>.*?<\/form_rander>/gs, '').trim();
}
const playAnswerText = (text) => {
    if (!text) {
        text = t('aiChat.tip.answerMessage');
    }
    // Remove form renderer
    text = removeFormRander(text);
    // text ProcessTo pureText
    text = markdownToPlainText(text);
    // console.log(text)
    audioPlayerStatus.value = true;
    // SplitInto multiple parts
    audioList.value = text.split(/(<audio[^>]*><\/audio>)/);
    playAnswerTextPart();
};
const playAnswerTextPart = () => {
    // console.log(audioList.value, currentAudioIndex.value)
    if (currentAudioIndex.value === audioList.value.length) {
        audioPlayerStatus.value = false;
        currentAudioIndex.value = 0;
        return;
    }
    if (audioList.value[currentAudioIndex.value].includes('<audio')) {
        if (audioPlayer.value) {
            audioPlayer.value[currentAudioIndex.value].src =
                audioList.value[currentAudioIndex.value].match(/src="([^"]*)"/)?.[1] || '';
            audioPlayer.value[currentAudioIndex.value].play(); // AutomaticPlayAudio
            audioPlayer.value[currentAudioIndex.value].onended = () => {
                currentAudioIndex.value += 1;
                playAnswerTextPart();
            };
        }
    }
    else if (props.tts_type === 'BROWSER') {
        if (audioList.value[currentAudioIndex.value] !== utterance.value?.text) {
            window.speechSynthesis.cancel();
        }
        if (window.speechSynthesis.paused &&
            audioList.value[currentAudioIndex.value] === utterance.value?.text) {
            window.speechSynthesis.resume();
            return;
        }
        // CreationOneNew SpeechSynthesisUtterance Instance
        utterance.value = new SpeechSynthesisUtterance(audioList.value[currentAudioIndex.value]);
        utterance.value.onend = () => {
            utterance.value = null;
            currentAudioIndex.value += 1;
            playAnswerTextPart();
        };
        utterance.value.onerror = () => {
            audioPlayerStatus.value = false;
            utterance.value = null;
        };
        // CallBrowserRead aloudFunction
        window.speechSynthesis.speak(utterance.value);
    }
    else if (props.tts_type === 'TTS') {
        // RestoreLast timePausePlay
        if (audioPlayer.value && audioPlayer.value[currentAudioIndex.value]?.src) {
            audioPlayer.value[currentAudioIndex.value].play();
            return;
        }
        applicationApi
            .postTextToSpeech(props.applicationId || id, { text: audioList.value[currentAudioIndex.value] }, loading)
            .then(async (res) => {
            if (res.type === 'application/json') {
                const text = await res.text();
                MsgError(text);
                return;
            }
            // Suppose we haveOne MP3 File bytesArray
            // Creation Blob Object
            const blob = new Blob([res], { type: 'audio/mp3' });
            // CreationObject URL
            const url = URL.createObjectURL(blob);
            // TestblobWhetherCan normallyPlay
            // const link = document.createElement('a')
            // link.href = window.URL.createObjectURL(blob)
            // link.download = "abc.mp3"
            // link.click()
            // Check audioPlayer WhetherAlreadyReference DOM Element
            if (audioPlayer.value) {
                audioPlayer.value[currentAudioIndex.value].src = url;
                audioPlayer.value[currentAudioIndex.value].play(); // AutomaticPlayAudio
                audioPlayer.value[currentAudioIndex.value].onended = () => {
                    currentAudioIndex.value += 1;
                    playAnswerTextPart();
                };
            }
            else {
                console.error('audioPlayer.value is not an instance of HTMLAudioElement');
            }
        })
            .catch((err) => {
            console.log('err: ', err);
        });
    }
};
const pausePlayAnswerText = () => {
    audioPlayerStatus.value = false;
    if (props.tts_type === 'TTS') {
        if (audioPlayer.value) {
            audioPlayer.value?.forEach((item) => {
                item.pause();
            });
        }
    }
    if (props.tts_type === 'BROWSER') {
        window.speechSynthesis.pause();
    }
};
function refreshMark() {
    buttonData.value.improve_paragraph_id_list = [];
    emit('update:data', buttonData.value);
}
function refreshContent(data) {
    buttonData.value = data;
    emit('update:data', buttonData.value);
}
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "flex-between mt-8" },
});
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
elText;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    type: "info",
}));
const __VLS_2 = __VLS_1({
    type: "info",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-4" },
});
/** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
(__VLS_ctx.datetimeFormat(__VLS_ctx.data.create_time));
// @ts-ignore
[datetimeFormat, data,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.tts) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    if (!__VLS_ctx.audioPlayerStatus) {
        let __VLS_6;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.play')),
            placement: "top",
        }));
        const __VLS_8 = __VLS_7({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.play')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        const { default: __VLS_11 } = __VLS_9.slots;
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_17;
        const __VLS_18 = {
            /** @type {typeof __VLS_17.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.tts))
                    throw 0;
                if (!(!__VLS_ctx.audioPlayerStatus))
                    throw 0;
                return __VLS_ctx.playAnswerText(__VLS_ctx.data?.answer_text);
                // @ts-ignore
                [data, tts, audioPlayerStatus, $t, playAnswerText,];
            },
        };
        const { default: __VLS_19 } = __VLS_15.slots;
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            iconName: "app-video-play",
            ...{ class: "color-secondary" },
        }));
        const __VLS_22 = __VLS_21({
            iconName: "app-video-play",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_15;
        var __VLS_16;
        // @ts-ignore
        [];
        var __VLS_9;
    }
    else {
        let __VLS_25;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent1(__VLS_25, new __VLS_25({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.pause')),
            placement: "top",
        }));
        const __VLS_27 = __VLS_26({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.pause')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        const { default: __VLS_30 } = __VLS_28.slots;
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }));
        const __VLS_33 = __VLS_32({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        let __VLS_36;
        const __VLS_37 = {
            /** @type {typeof __VLS_36.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.tts))
                    throw 0;
                if (!!(!__VLS_ctx.audioPlayerStatus))
                    throw 0;
                return __VLS_ctx.pausePlayAnswerText();
                // @ts-ignore
                [$t, pausePlayAnswerText,];
            },
        };
        const { default: __VLS_38 } = __VLS_34.slots;
        let __VLS_39;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            iconName: "app-video-pause",
            ...{ class: "color-secondary" },
        }));
        const __VLS_41 = __VLS_40({
            iconName: "app-video-pause",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_34;
        var __VLS_35;
        // @ts-ignore
        [];
        var __VLS_28;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "ml-8" },
});
/** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
let __VLS_44;
/** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
elTooltip;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent1(__VLS_44, new __VLS_44({
    effect: "dark",
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}));
const __VLS_46 = __VLS_45({
    effect: "dark",
    content: (__VLS_ctx.$t('common.copy')),
    placement: "top",
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
const { default: __VLS_49 } = __VLS_47.slots;
let __VLS_50;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent1(__VLS_50, new __VLS_50({
    ...{ 'onClick': {} },
    text: true,
}));
const __VLS_52 = __VLS_51({
    ...{ 'onClick': {} },
    text: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
let __VLS_55;
const __VLS_56 = {
    /** @type {typeof __VLS_55.click} */
    onClick: (...[$event]) => {
        return __VLS_ctx.copyClick(__VLS_ctx.data?.answer_text);
        // @ts-ignore
        [data, $t, copyClick,];
    },
};
const { default: __VLS_57 } = __VLS_53.slots;
let __VLS_58;
/** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
AppIcon;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
    iconName: "app-copy",
    ...{ class: "color-secondary" },
}));
const __VLS_60 = __VLS_59({
    iconName: "app-copy",
    ...{ class: "color-secondary" },
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
/** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
// @ts-ignore
[];
var __VLS_53;
var __VLS_54;
// @ts-ignore
[];
var __VLS_47;
if (__VLS_ctx.permissionPrecise.chat_log_add_knowledge(__VLS_ctx.id)) {
    if (__VLS_ctx.buttonData.improve_paragraph_id_list.length === 0) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        let __VLS_63;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
            effect: "dark",
            content: (__VLS_ctx.$t('views.chatLog.editContent')),
            placement: "top",
        }));
        const __VLS_65 = __VLS_64({
            effect: "dark",
            content: (__VLS_ctx.$t('views.chatLog.editContent')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_64));
        const { default: __VLS_68 } = __VLS_66.slots;
        let __VLS_69;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_71 = __VLS_70({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        let __VLS_74;
        const __VLS_75 = {
            /** @type {typeof __VLS_74.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.chat_log_add_knowledge(__VLS_ctx.id)))
                    throw 0;
                if (!(__VLS_ctx.buttonData.improve_paragraph_id_list.length === 0))
                    throw 0;
                return __VLS_ctx.editContent(__VLS_ctx.data);
                // @ts-ignore
                [data, $t, permissionPrecise, id, buttonData, editContent,];
            },
        };
        const { default: __VLS_76 } = __VLS_72.slots;
        let __VLS_77;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
            iconName: "app-edit",
            ...{ class: "color-secondary" },
        }));
        const __VLS_79 = __VLS_78({
            iconName: "app-edit",
            ...{ class: "color-secondary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_78));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_72;
        var __VLS_73;
        // @ts-ignore
        [];
        var __VLS_66;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        let __VLS_82;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_83 = __VLS_asFunctionalComponent1(__VLS_82, new __VLS_82({
            effect: "dark",
            content: (__VLS_ctx.$t('views.chatLog.editMark')),
            placement: "top",
        }));
        const __VLS_84 = __VLS_83({
            effect: "dark",
            content: (__VLS_ctx.$t('views.chatLog.editMark')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_83));
        const { default: __VLS_87 } = __VLS_85.slots;
        let __VLS_88;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent1(__VLS_88, new __VLS_88({
            ...{ 'onClick': {} },
            text: true,
        }));
        const __VLS_90 = __VLS_89({
            ...{ 'onClick': {} },
            text: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        let __VLS_93;
        const __VLS_94 = {
            /** @type {typeof __VLS_93.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.permissionPrecise.chat_log_add_knowledge(__VLS_ctx.id)))
                    throw 0;
                if (!!(__VLS_ctx.buttonData.improve_paragraph_id_list.length === 0))
                    throw 0;
                return __VLS_ctx.editMark(__VLS_ctx.data);
                // @ts-ignore
                [data, $t, editMark,];
            },
        };
        const { default: __VLS_95 } = __VLS_91.slots;
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            iconName: "app-document-active",
            ...{ class: "primary" },
        }));
        const __VLS_98 = __VLS_97({
            iconName: "app-document-active",
            ...{ class: "primary" },
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        /** @type {__VLS_StyleScopedClasses['primary']} */ ;
        // @ts-ignore
        [];
        var __VLS_91;
        var __VLS_92;
        // @ts-ignore
        [];
        var __VLS_85;
    }
}
if (__VLS_ctx.buttonData?.vote_status === '0') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    let __VLS_101;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
        text: true,
        disabled: true,
    }));
    const __VLS_103 = __VLS_102({
        text: true,
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_102));
    const { default: __VLS_106 } = __VLS_104.slots;
    let __VLS_107;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_108 = __VLS_asFunctionalComponent1(__VLS_107, new __VLS_107({
        iconName: "app-like-color",
    }));
    const __VLS_109 = __VLS_108({
        iconName: "app-like-color",
    }, ...__VLS_functionalComponentArgsRest(__VLS_108));
    // @ts-ignore
    [buttonData,];
    var __VLS_104;
}
if (__VLS_ctx.buttonData?.vote_status === '1') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-8" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    let __VLS_112;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_113 = __VLS_asFunctionalComponent1(__VLS_112, new __VLS_112({
        text: true,
        disabled: true,
    }));
    const __VLS_114 = __VLS_113({
        text: true,
        disabled: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_113));
    const { default: __VLS_117 } = __VLS_115.slots;
    let __VLS_118;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
        iconName: "app-oppose-color",
    }));
    const __VLS_120 = __VLS_119({
        iconName: "app-oppose-color",
    }, ...__VLS_functionalComponentArgsRest(__VLS_119));
    // @ts-ignore
    [buttonData,];
    var __VLS_115;
}
const __VLS_123 = EditContentDialog;
// @ts-ignore
const __VLS_124 = __VLS_asFunctionalComponent1(__VLS_123, new __VLS_123({
    ...{ 'onRefresh': {} },
    ref: "EditContentDialogRef",
}));
const __VLS_125 = __VLS_124({
    ...{ 'onRefresh': {} },
    ref: "EditContentDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_124));
let __VLS_128;
const __VLS_129 = {
    /** @type {typeof __VLS_128.refresh} */
    onRefresh: (__VLS_ctx.refreshContent),
};
var __VLS_130;
var __VLS_126;
var __VLS_127;
const __VLS_132 = EditMarkDialog;
// @ts-ignore
const __VLS_133 = __VLS_asFunctionalComponent1(__VLS_132, new __VLS_132({
    ...{ 'onRefresh': {} },
    ref: "EditMarkDialogRef",
}));
const __VLS_134 = __VLS_133({
    ...{ 'onRefresh': {} },
    ref: "EditMarkDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_133));
let __VLS_137;
const __VLS_138 = {
    /** @type {typeof __VLS_137.refresh} */
    onRefresh: (__VLS_ctx.refreshMark),
};
var __VLS_139;
var __VLS_135;
var __VLS_136;
for (const [item] of __VLS_vFor((__VLS_ctx.audioList))) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.audio, __VLS_intrinsics.audio)({
        ref: "audioPlayer",
        key: (item),
        controls: true,
        hidden: "hidden",
    });
    // @ts-ignore
    [refreshContent, refreshMark, audioList,];
}
if (__VLS_ctx.buttonData?.vote_status !== '-1' && __VLS_ctx.data.vote_reason) {
    let __VLS_141;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
        ...{ class: "mt-16 layout-bg" },
        shadow: "always",
    }));
    const __VLS_143 = __VLS_142({
        ...{ class: "mt-16 layout-bg" },
        shadow: "always",
    }, ...__VLS_functionalComponentArgsRest(__VLS_142));
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['layout-bg']} */ ;
    const { default: __VLS_146 } = __VLS_144.slots;
    if (__VLS_ctx.buttonData?.id) {
        const __VLS_147 = VoteReasonContent || VoteReasonContent;
        // @ts-ignore
        const __VLS_148 = __VLS_asFunctionalComponent1(__VLS_147, new __VLS_147({
            voteType: (__VLS_ctx.buttonData?.vote_status),
            chatId: (__VLS_ctx.buttonData?.chat_id),
            recordId: (__VLS_ctx.buttonData?.id),
            readonly: true,
            defaultReason: (__VLS_ctx.data.vote_reason),
            defaultOtherContent: (__VLS_ctx.data.vote_other_content),
        }));
        const __VLS_149 = __VLS_148({
            voteType: (__VLS_ctx.buttonData?.vote_status),
            chatId: (__VLS_ctx.buttonData?.chat_id),
            recordId: (__VLS_ctx.buttonData?.id),
            readonly: true,
            defaultReason: (__VLS_ctx.data.vote_reason),
            defaultOtherContent: (__VLS_ctx.data.vote_other_content),
        }, ...__VLS_functionalComponentArgsRest(__VLS_148));
    }
    // @ts-ignore
    [data, data, data, buttonData, buttonData, buttonData, buttonData, buttonData,];
    var __VLS_144;
}
// @ts-ignore
var __VLS_131 = __VLS_130, __VLS_140 = __VLS_139;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        data: {
            type: Object,
            default: () => { },
        },
        applicationId: {
            type: String,
            default: '',
        },
        tts: Boolean,
        tts_type: String,
    },
});
export default {};
