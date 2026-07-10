/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { copyClick } from '@/utils/clipboard';
import applicationApi from '@/api/application/application';
import chatAPI from '@/api/chat/chat';
import { datetimeFormat } from '@/utils/time';
import { MsgError } from '@/utils/message';
import VoteReasonContent from '@/components/ai-chat/component/operation-button/VoteReasonContent.vue';
import MobileVoteReasonDrawer from '@/components/ai-chat/component/operation-button/MobileVoteReasonDrawer.vue';
import bus from '@/bus';
const route = useRoute();
const { params: { id }, query: { mode }, } = route;
const props = withDefaults(defineProps(), {
    data: () => ({}),
    type: 'ai-chat',
});
const emit = defineEmits(['update:data', 'regeneration', 'clickShare']);
const clickShareHandle = (id) => {
    bus.emit('click:share', id);
};
const copy = (data) => {
    try {
        const text = data.answer_text_list
            .map((item) => item.map((i) => i.content).join('\n'))
            .join('\n\n');
        copyClick(removeFormRander(text));
    }
    catch (e) {
        copyClick(removeFormRander(data?.answer_text.trim()));
    }
};
const likePopoverRef = ref();
const opposePopoverRef = ref();
const closePopover = () => {
    likePopoverRef.value.hide();
    opposePopoverRef.value.hide();
};
const mobileVoteReasonDrawerRef = ref(null);
const mobileVoteReasonHandler = (voteStatus) => {
    if (mobileVoteReasonDrawerRef.value) {
        mobileVoteReasonDrawerRef.value.open(voteStatus);
    }
};
const audioPlayer = ref([]);
const audioCiontainer = ref();
const buttonData = ref(props.data);
const loading = ref(false);
const audioList = ref([]);
function regeneration() {
    emit('regeneration');
}
function handleVoteSuccess(voteStatus) {
    buttonData.value['vote_status'] = voteStatus;
    emit('update:data', buttonData.value);
    if (mode !== 'mobile') {
        closePopover();
    }
}
function cancelVoteHandle(val) {
    chatAPI.vote(props.chatId, props.data.record_id, val, undefined, '', loading).then(() => {
        buttonData.value['vote_status'] = val;
        emit('update:data', buttonData.value);
    });
}
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
        // RemovevideoTag
        .replace(/<video>.*?<\/video>/gs, '')
        // RemovehtmlTag
        .replace(/<[^>]+>/g, '')
        // RemoveExtraNewline
        .replace(/\n{2,}/g, '\n')
        .trim());
}
function removeFormRander(text) {
    return text.replace(/<form_rander>.*?<\/form_rander>/gs, '').trim();
}
function getKey(keys, index) {
    // Search from back to front forOneLess than or equal toindexKey of
    for (let i = keys.length - 1; i >= 0; i--) {
        if (keys[i] <= index) {
            return keys[i];
        }
    }
    return 0;
}
function smartSplit(str, minLengthConfig = {
    0: 10,
    1: 25,
    3: 50,
    5: 100,
}, is_end = false) {
    // MatchChinese comma/Period, and at least 20 characters (including any character, includingNewline)
    const regex = /([.?\n])|(<audio[^>]*><\/audio>)/g;
    // Split andRetainSeparator
    const parts = str.split(regex);
    const result = [];
    const keys = Object.keys(minLengthConfig).map(Number);
    let minLength = minLengthConfig[0];
    let temp_str = '';
    for (let i = 0; i < parts.length; i++) {
        const content = parts[i];
        if (content == undefined) {
            continue;
        }
        if (/^<audio[^>]*><\/audio>$/.test(content)) {
            if (temp_str.length > 0) {
                result.push(temp_str);
                temp_str = '';
            }
            result.push(content);
            continue;
        }
        temp_str += parts[i];
        if (temp_str.length > minLength && /[.?\n]$/.test(temp_str)) {
            minLength = minLengthConfig[getKey(keys, i)];
            result.push(temp_str);
            temp_str = '';
        }
    }
    if (temp_str.length > 0 && is_end) {
        result.push(temp_str);
    }
    return result;
}
var AudioStatus;
(function (AudioStatus) {
    /**
     * End
     */
    AudioStatus["END"] = "END";
    /**
     * Play in
     */
    AudioStatus["PLAY_INT"] = "PLAY_INT";
    /**
     * Just mounted
     */
    AudioStatus["MOUNTED"] = "MOUNTED";
    /**
     * Ready
     */
    AudioStatus["READY"] = "READY";
    /**
     * Error
     */
    AudioStatus["ERROR"] = "ERROR";
})(AudioStatus || (AudioStatus = {}));
const getTextToSpeechAPI = () => {
    if (props.type === 'ai-chat') {
        return (application_id, data, loading) => {
            return chatAPI.textToSpeech(data, loading);
        };
    }
    else {
        return applicationApi.postTextToSpeech;
    }
};
const textToSpeechAPI = getTextToSpeechAPI();
class AudioManage {
    textList;
    statusList;
    audioList;
    tryList;
    ttsType;
    root;
    is_end;
    constructor(ttsType, root) {
        this.textList = [];
        this.audioList = [];
        this.statusList = [];
        this.tryList = [];
        this.ttsType = ttsType;
        this.root = root;
        this.is_end = false;
    }
    appendTextList(textList) {
        const newTextList = textList.slice(this.textList.length);
        // NoneAddParagraph
        if (newTextList.length <= 0) {
            return 0;
        }
        newTextList.forEach((text, index) => {
            this.textList.push(text);
            this.statusList.push(AudioStatus.MOUNTED);
            this.tryList.push(1);
            index = this.textList.length - 1;
            if (this.ttsType === 'TTS') {
                const audioElement = document.createElement('audio');
                audioElement.controls = false;
                audioElement.hidden = true;
                /**
                 * PlayEndEvent
                 */
                audioElement.onended = () => {
                    this.statusList[index] = AudioStatus.END;
                    // If all nodes have finished playing
                    if (this.statusList.every((item) => item === AudioStatus.END) && this.is_end) {
                        this.statusList = this.statusList.map((item) => AudioStatus.READY);
                        this.is_end = false;
                    }
                    else {
                        // next
                        this.play();
                    }
                };
                this.root.appendChild(audioElement);
                if (/^<audio[^>]*><\/audio>$/.test(text)) {
                    audioElement.src = text.match(/src="([^"]*)"/)?.[1] || '';
                    this.statusList[index] = AudioStatus.READY;
                }
                else {
                    textToSpeechAPI(props.applicationId || id, { text: text }, loading)
                        .then(async (res) => {
                        if (res.type === 'application/json') {
                            const text = await res.text();
                            if (this.tryList[index] >= 3) {
                                MsgError(text);
                            }
                            this.statusList[index] = AudioStatus.ERROR;
                            throw '';
                        }
                        // Suppose we haveOne MP3 File bytesArray
                        // Creation Blob Object
                        const blob = new Blob([res], { type: 'audio/mp3' });
                        // CreationObject URL
                        const url = URL.createObjectURL(blob);
                        audioElement.src = url;
                        this.statusList[index] = AudioStatus.READY;
                        this.play();
                    })
                        .catch((err) => {
                        this.statusList[index] = AudioStatus.ERROR;
                        this.play();
                    });
                }
                this.audioList.push(audioElement);
            }
            else {
                const speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
                speechSynthesisUtterance.onend = () => {
                    this.statusList[index] = AudioStatus.END;
                    // If all nodes have finished playing
                    if (this.statusList.every((item) => item === AudioStatus.END)) {
                        this.statusList = this.statusList.map((item) => AudioStatus.READY);
                    }
                    else {
                        // next
                        this.play();
                    }
                };
                speechSynthesisUtterance.onerror = (e) => {
                    this.statusList[index] = AudioStatus.READY;
                };
                this.statusList[index] = AudioStatus.READY;
                this.audioList.push(speechSynthesisUtterance);
                this.play();
            }
        });
    }
    reTryError() {
        this.statusList.forEach((status, index) => {
            if (status === AudioStatus.ERROR && this.tryList[index] <= 3) {
                this.tryList[index]++;
                const audioElement = this.audioList[index];
                if (audioElement instanceof HTMLAudioElement) {
                    const text = this.textList[index];
                    this.statusList[index] = AudioStatus.MOUNTED;
                    textToSpeechAPI(props.applicationId || id, { text: text }, loading)
                        .then(async (res) => {
                        if (res.type === 'application/json') {
                            const text = await res.text();
                            if (this.tryList[index] >= 3) {
                                MsgError(text);
                            }
                            throw '';
                        }
                        // Suppose we haveOne MP3 File bytesArray
                        // Creation Blob Object
                        const blob = new Blob([res], { type: 'audio/mp3' });
                        // CreationObject URL
                        const url = URL.createObjectURL(blob);
                        audioElement.src = url;
                        this.statusList[index] = AudioStatus.READY;
                        this.play();
                    })
                        .catch((err) => {
                        console.log('err: ', err);
                        this.statusList[index] = AudioStatus.ERROR;
                        this.play();
                    });
                }
            }
        });
    }
    isPlaying() {
        return this.statusList.some((item) => [AudioStatus.PLAY_INT].includes(item));
    }
    play(text, is_end, self) {
        if (is_end) {
            this.is_end = true;
        }
        if (self) {
            this.tryList = this.tryList.map((item) => 0);
        }
        if (text) {
            const textList = this.getTextList(text, is_end ? true : false);
            if (this.appendTextList(textList) !== 0) {
                // NoneAddParagraph
                return;
            }
        }
        // If there is a currently reading element, return directly
        if (this.statusList.some((item) => [AudioStatus.PLAY_INT].includes(item))) {
            return;
        }
        this.reTryError();
        // NeedsPlayContent
        const index = this.statusList.findIndex((status) => [AudioStatus.MOUNTED, AudioStatus.READY].includes(status));
        if (index < 0 || this.statusList[index] === AudioStatus.MOUNTED) {
            return;
        }
        const audioElement = this.audioList[index];
        if (audioElement instanceof HTMLAudioElement) {
            // TagRead aloud
            try {
                this.statusList[index] = AudioStatus.PLAY_INT;
                const play = audioElement.play();
                if (play instanceof Promise) {
                    play.catch((e) => {
                        this.statusList[index] = AudioStatus.READY;
                    });
                }
            }
            catch (e) {
                this.statusList[index] = AudioStatus.ERROR;
            }
        }
        else {
            if (window.speechSynthesis.paused && self) {
                window.speechSynthesis.resume();
                this.statusList[index] = AudioStatus.PLAY_INT;
            }
            else {
                // If not in pause state, cancel current play and restart
                if (window.speechSynthesis.speaking) {
                    window.speechSynthesis.cancel();
                }
                // Wait for cancel to complete then replay
                setTimeout(() => {
                    if (speechSynthesis.speaking) {
                        return;
                    }
                    speechSynthesis.speak(audioElement);
                    this.statusList[index] = AudioStatus.PLAY_INT;
                }, 500);
            }
        }
    }
    pause(self) {
        const index = this.statusList.findIndex((status) => status === AudioStatus.PLAY_INT);
        if (index < 0) {
            return;
        }
        const audioElement = this.audioList[index];
        if (audioElement instanceof HTMLAudioElement) {
            if (this.statusList[index] === AudioStatus.PLAY_INT) {
                // TagRead aloud
                this.statusList[index] = AudioStatus.READY;
                audioElement.pause();
            }
        }
        else {
            this.statusList[index] = AudioStatus.READY;
            if (self) {
                window.speechSynthesis.pause();
            }
            else {
                window.speechSynthesis.cancel();
            }
        }
    }
    getTextList(text, is_end) {
        // Remove form renderer
        text = removeFormRander(text);
        // text ProcessTo pureText
        text = markdownToPlainText(text);
        const split = smartSplit(text, {
            0: 20,
            1: 50,
            5: 100,
        }, is_end);
        return split;
    }
}
const audioManage = ref();
onMounted(() => {
    if (audioCiontainer.value) {
        audioManage.value = new AudioManage(props.tts_type, audioCiontainer.value);
    }
    bus.on('play:pause', (record_id) => {
        if (record_id !== props.data.record_id) {
            if (audioManage.value) {
                audioManage.value?.pause();
            }
        }
    });
    bus.on('change:answer', (data) => {
        const record_id = data.record_id;
        bus.emit('play:pause', record_id);
        if (props.data.record_id == record_id) {
            if (props.tts && props.tts_autoplay) {
                if (audioManage.value) {
                    audioManage.value.play(props.data.answer_text, data.is_end);
                }
            }
        }
    });
});
onBeforeUnmount(() => {
    bus.off('change:answer');
    bus.off('play:pause');
    if (audioManage.value) {
        audioManage.value.pause();
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});
const __VLS_defaults = {
    data: () => ({}),
    type: 'ai-chat',
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
    ...{ class: "chat-operation-button flex-between" },
});
/** @type {__VLS_StyleScopedClasses['chat-operation-button']} */ ;
/** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
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
if (__VLS_ctx.data.create_time) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "ml-4" },
    });
    /** @type {__VLS_StyleScopedClasses['ml-4']} */ ;
    (__VLS_ctx.datetimeFormat(__VLS_ctx.data.create_time));
}
// @ts-ignore
[data, data, datetimeFormat,];
var __VLS_3;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
if (__VLS_ctx.tts) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
    if (__VLS_ctx.audioManage?.isPlaying()) {
        let __VLS_6;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.pause')),
            placement: "top",
        }));
        const __VLS_8 = __VLS_7({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.pause')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_7));
        const { default: __VLS_11 } = __VLS_9.slots;
        let __VLS_12;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_13 = __VLS_asFunctionalComponent1(__VLS_12, new __VLS_12({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            disabled: (!__VLS_ctx.data?.write_ed),
        }));
        const __VLS_14 = __VLS_13({
            ...{ 'onClick': {} },
            type: "primary",
            text: true,
            disabled: (!__VLS_ctx.data?.write_ed),
        }, ...__VLS_functionalComponentArgsRest(__VLS_13));
        let __VLS_17;
        const __VLS_18 = {
            /** @type {typeof __VLS_17.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.tts))
                    throw 0;
                if (!(__VLS_ctx.audioManage?.isPlaying()))
                    throw 0;
                return __VLS_ctx.audioManage?.pause(true);
                // @ts-ignore
                [data, tts, audioManage, audioManage, $t,];
            },
        };
        const { default: __VLS_19 } = __VLS_15.slots;
        let __VLS_20;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent1(__VLS_20, new __VLS_20({
            ...{ class: "color-secondary" },
            iconName: "app-video-pause",
        }));
        const __VLS_22 = __VLS_21({
            ...{ class: "color-secondary" },
            iconName: "app-video-pause",
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
            content: (__VLS_ctx.$t('aiChat.operation.play')),
            placement: "top",
        }));
        const __VLS_27 = __VLS_26({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.play')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        const { default: __VLS_30 } = __VLS_28.slots;
        let __VLS_31;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
            ...{ 'onClick': {} },
            text: true,
            disabled: (!__VLS_ctx.data?.write_ed),
        }));
        const __VLS_33 = __VLS_32({
            ...{ 'onClick': {} },
            text: true,
            disabled: (!__VLS_ctx.data?.write_ed),
        }, ...__VLS_functionalComponentArgsRest(__VLS_32));
        let __VLS_36;
        const __VLS_37 = {
            /** @type {typeof __VLS_36.click} */
            onClick: (() => {
                __VLS_ctx.bus.emit('play:pause', props.data.record_id);
                __VLS_ctx.audioManage?.play(props.data.answer_text, true, true);
            }),
        };
        const { default: __VLS_38 } = __VLS_34.slots;
        let __VLS_39;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
            ...{ class: "color-secondary" },
            iconName: "app-video-play",
        }));
        const __VLS_41 = __VLS_40({
            ...{ class: "color-secondary" },
            iconName: "app-video-play",
        }, ...__VLS_functionalComponentArgsRest(__VLS_40));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [data, audioManage, $t, bus,];
        var __VLS_34;
        var __VLS_35;
        // @ts-ignore
        [];
        var __VLS_28;
    }
}
if (__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
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
            if (!(__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log'))
                throw 0;
            return __VLS_ctx.copy(__VLS_ctx.data);
            // @ts-ignore
            [data, $t, type, type, copy,];
        },
    };
    const { default: __VLS_57 } = __VLS_53.slots;
    let __VLS_58;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
        ...{ class: "color-secondary" },
        iconName: "app-copy",
    }));
    const __VLS_60 = __VLS_59({
        ...{ class: "color-secondary" },
        iconName: "app-copy",
    }, ...__VLS_functionalComponentArgsRest(__VLS_59));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [];
    var __VLS_53;
    var __VLS_54;
    // @ts-ignore
    [];
    var __VLS_47;
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
        content: (__VLS_ctx.$t('aiChat.operation.regeneration')),
        placement: "top",
    }));
    const __VLS_65 = __VLS_64({
        effect: "dark",
        content: (__VLS_ctx.$t('aiChat.operation.regeneration')),
        placement: "top",
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    const { default: __VLS_68 } = __VLS_66.slots;
    let __VLS_69;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_70 = __VLS_asFunctionalComponent1(__VLS_69, new __VLS_69({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.chat_loading),
        text: true,
    }));
    const __VLS_71 = __VLS_70({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.chat_loading),
        text: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_70));
    let __VLS_74;
    const __VLS_75 = {
        /** @type {typeof __VLS_74.click} */
        onClick: (__VLS_ctx.regeneration),
    };
    const { default: __VLS_76 } = __VLS_72.slots;
    let __VLS_77;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_78 = __VLS_asFunctionalComponent1(__VLS_77, new __VLS_77({
        iconName: "app-refresh",
        ...{ class: "color-secondary" },
    }));
    const __VLS_79 = __VLS_78({
        iconName: "app-refresh",
        ...{ class: "color-secondary" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_78));
    /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
    // @ts-ignore
    [$t, chat_loading, regeneration,];
    var __VLS_72;
    var __VLS_73;
    // @ts-ignore
    [];
    var __VLS_66;
    if (__VLS_ctx.buttonData?.vote_status === '-1' && __VLS_ctx.mode === 'mobile') {
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
            content: (__VLS_ctx.$t('aiChat.operation.like')),
            placement: "top",
        }));
        const __VLS_84 = __VLS_83({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.like')),
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
            disabled: (__VLS_ctx.loading),
        }));
        const __VLS_90 = __VLS_89({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
        let __VLS_93;
        const __VLS_94 = {
            /** @type {typeof __VLS_93.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log'))
                    throw 0;
                if (!(__VLS_ctx.buttonData?.vote_status === '-1' && __VLS_ctx.mode === 'mobile'))
                    throw 0;
                return __VLS_ctx.mobileVoteReasonHandler('0');
                // @ts-ignore
                [$t, buttonData, mode, loading, mobileVoteReasonHandler,];
            },
        };
        const { default: __VLS_95 } = __VLS_91.slots;
        let __VLS_96;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
            ...{ class: "color-secondary" },
            iconName: "app-like",
        }));
        const __VLS_98 = __VLS_97({
            ...{ class: "color-secondary" },
            iconName: "app-like",
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_91;
        var __VLS_92;
        // @ts-ignore
        [];
        var __VLS_85;
    }
    if (__VLS_ctx.buttonData?.vote_status === '-1' && __VLS_ctx.mode !== 'mobile') {
        let __VLS_101;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent1(__VLS_101, new __VLS_101({
            ref: "likePopoverRef",
            trigger: "click",
            placement: "bottom-start",
            width: (360),
            popperClass: "vote-popover",
            persistent: (false),
        }));
        const __VLS_103 = __VLS_102({
            ref: "likePopoverRef",
            trigger: "click",
            placement: "bottom-start",
            width: (360),
            popperClass: "vote-popover",
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        var __VLS_106;
        const { default: __VLS_108 } = __VLS_104.slots;
        {
            const { reference: __VLS_109 } = __VLS_104.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            let __VLS_110;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_111 = __VLS_asFunctionalComponent1(__VLS_110, new __VLS_110({
                effect: "dark",
                content: (__VLS_ctx.$t('aiChat.operation.like')),
                placement: "top",
            }));
            const __VLS_112 = __VLS_111({
                effect: "dark",
                content: (__VLS_ctx.$t('aiChat.operation.like')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_111));
            const { default: __VLS_115 } = __VLS_113.slots;
            let __VLS_116;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_117 = __VLS_asFunctionalComponent1(__VLS_116, new __VLS_116({
                text: true,
                disabled: (__VLS_ctx.loading),
            }));
            const __VLS_118 = __VLS_117({
                text: true,
                disabled: (__VLS_ctx.loading),
            }, ...__VLS_functionalComponentArgsRest(__VLS_117));
            const { default: __VLS_121 } = __VLS_119.slots;
            let __VLS_122;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_123 = __VLS_asFunctionalComponent1(__VLS_122, new __VLS_122({
                ...{ class: "color-secondary" },
                iconName: "app-like",
            }));
            const __VLS_124 = __VLS_123({
                ...{ class: "color-secondary" },
                iconName: "app-like",
            }, ...__VLS_functionalComponentArgsRest(__VLS_123));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [$t, buttonData, mode, loading,];
            var __VLS_119;
            // @ts-ignore
            [];
            var __VLS_113;
            // @ts-ignore
            [];
        }
        const __VLS_127 = VoteReasonContent || VoteReasonContent;
        // @ts-ignore
        const __VLS_128 = __VLS_asFunctionalComponent1(__VLS_127, new __VLS_127({
            ...{ 'onSuccess': {} },
            ...{ 'onClose': {} },
            voteType: "0",
            chatId: (props.chatId),
            recordId: (props.data.record_id),
        }));
        const __VLS_129 = __VLS_128({
            ...{ 'onSuccess': {} },
            ...{ 'onClose': {} },
            voteType: "0",
            chatId: (props.chatId),
            recordId: (props.data.record_id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_128));
        let __VLS_132;
        const __VLS_133 = {
            /** @type {typeof __VLS_132.success} */
            onSuccess: (__VLS_ctx.handleVoteSuccess),
        };
        const __VLS_134 = {
            /** @type {typeof __VLS_132.close} */
            onClose: (__VLS_ctx.closePopover),
        };
        var __VLS_130;
        var __VLS_131;
        // @ts-ignore
        [handleVoteSuccess, closePopover,];
        var __VLS_104;
    }
    if (__VLS_ctx.buttonData?.vote_status === '0') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        let __VLS_135;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_136 = __VLS_asFunctionalComponent1(__VLS_135, new __VLS_135({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.cancelLike')),
            placement: "top",
        }));
        const __VLS_137 = __VLS_136({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.cancelLike')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_136));
        const { default: __VLS_140 } = __VLS_138.slots;
        let __VLS_141;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent1(__VLS_141, new __VLS_141({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }));
        const __VLS_143 = __VLS_142({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        let __VLS_146;
        const __VLS_147 = {
            /** @type {typeof __VLS_146.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log'))
                    throw 0;
                if (!(__VLS_ctx.buttonData?.vote_status === '0'))
                    throw 0;
                return __VLS_ctx.cancelVoteHandle('-1');
                // @ts-ignore
                [$t, buttonData, loading, cancelVoteHandle,];
            },
        };
        const { default: __VLS_148 } = __VLS_144.slots;
        let __VLS_149;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent1(__VLS_149, new __VLS_149({
            ...{ class: "color-secondary" },
            iconName: "app-like-color",
        }));
        const __VLS_151 = __VLS_150({
            ...{ class: "color-secondary" },
            iconName: "app-like-color",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_144;
        var __VLS_145;
        // @ts-ignore
        [];
        var __VLS_138;
    }
    if (__VLS_ctx.buttonData?.vote_status === '-1' && __VLS_ctx.mode === 'mobile') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        let __VLS_154;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_155 = __VLS_asFunctionalComponent1(__VLS_154, new __VLS_154({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.oppose')),
            placement: "top",
        }));
        const __VLS_156 = __VLS_155({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.oppose')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_155));
        const { default: __VLS_159 } = __VLS_157.slots;
        let __VLS_160;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_161 = __VLS_asFunctionalComponent1(__VLS_160, new __VLS_160({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }));
        const __VLS_162 = __VLS_161({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_161));
        let __VLS_165;
        const __VLS_166 = {
            /** @type {typeof __VLS_165.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log'))
                    throw 0;
                if (!(__VLS_ctx.buttonData?.vote_status === '-1' && __VLS_ctx.mode === 'mobile'))
                    throw 0;
                return __VLS_ctx.mobileVoteReasonHandler('1');
                // @ts-ignore
                [$t, buttonData, mode, loading, mobileVoteReasonHandler,];
            },
        };
        const { default: __VLS_167 } = __VLS_163.slots;
        let __VLS_168;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent1(__VLS_168, new __VLS_168({
            ...{ class: "color-secondary" },
            iconName: "app-oppose",
        }));
        const __VLS_170 = __VLS_169({
            ...{ class: "color-secondary" },
            iconName: "app-oppose",
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_163;
        var __VLS_164;
        // @ts-ignore
        [];
        var __VLS_157;
    }
    if (__VLS_ctx.buttonData?.vote_status === '-1' && __VLS_ctx.mode !== 'mobile') {
        let __VLS_173;
        /** @ts-ignore @type { | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover'] | typeof __VLS_components.elPopover | typeof __VLS_components.ElPopover | typeof __VLS_components['el-popover']} */
        elPopover;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent1(__VLS_173, new __VLS_173({
            ref: "opposePopoverRef",
            trigger: "click",
            placement: "bottom-start",
            width: (360),
            popperClass: "vote-popover",
            persistent: (false),
        }));
        const __VLS_175 = __VLS_174({
            ref: "opposePopoverRef",
            trigger: "click",
            placement: "bottom-start",
            width: (360),
            popperClass: "vote-popover",
            persistent: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        var __VLS_178;
        const { default: __VLS_180 } = __VLS_176.slots;
        {
            const { reference: __VLS_181 } = __VLS_176.slots;
            __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
                ...{ class: "ml-8" },
            });
            /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
            let __VLS_182;
            /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
            elTooltip;
            // @ts-ignore
            const __VLS_183 = __VLS_asFunctionalComponent1(__VLS_182, new __VLS_182({
                effect: "dark",
                content: (__VLS_ctx.$t('aiChat.operation.oppose')),
                placement: "top",
            }));
            const __VLS_184 = __VLS_183({
                effect: "dark",
                content: (__VLS_ctx.$t('aiChat.operation.oppose')),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_183));
            const { default: __VLS_187 } = __VLS_185.slots;
            let __VLS_188;
            /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
            elButton;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent1(__VLS_188, new __VLS_188({
                text: true,
                disabled: (__VLS_ctx.loading),
            }));
            const __VLS_190 = __VLS_189({
                text: true,
                disabled: (__VLS_ctx.loading),
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            const { default: __VLS_193 } = __VLS_191.slots;
            let __VLS_194;
            /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
            AppIcon;
            // @ts-ignore
            const __VLS_195 = __VLS_asFunctionalComponent1(__VLS_194, new __VLS_194({
                ...{ class: "color-secondary" },
                iconName: "app-oppose",
            }));
            const __VLS_196 = __VLS_195({
                ...{ class: "color-secondary" },
                iconName: "app-oppose",
            }, ...__VLS_functionalComponentArgsRest(__VLS_195));
            /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
            // @ts-ignore
            [$t, buttonData, mode, loading,];
            var __VLS_191;
            // @ts-ignore
            [];
            var __VLS_185;
            // @ts-ignore
            [];
        }
        const __VLS_199 = VoteReasonContent || VoteReasonContent;
        // @ts-ignore
        const __VLS_200 = __VLS_asFunctionalComponent1(__VLS_199, new __VLS_199({
            ...{ 'onSuccess': {} },
            ...{ 'onClose': {} },
            voteType: "1",
            chatId: (props.chatId),
            recordId: (props.data.record_id),
        }));
        const __VLS_201 = __VLS_200({
            ...{ 'onSuccess': {} },
            ...{ 'onClose': {} },
            voteType: "1",
            chatId: (props.chatId),
            recordId: (props.data.record_id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_200));
        let __VLS_204;
        const __VLS_205 = {
            /** @type {typeof __VLS_204.success} */
            onSuccess: (__VLS_ctx.handleVoteSuccess),
        };
        const __VLS_206 = {
            /** @type {typeof __VLS_204.close} */
            onClose: (__VLS_ctx.closePopover),
        };
        var __VLS_202;
        var __VLS_203;
        // @ts-ignore
        [handleVoteSuccess, closePopover,];
        var __VLS_176;
    }
    if (__VLS_ctx.buttonData?.vote_status === '1') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        let __VLS_207;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_208 = __VLS_asFunctionalComponent1(__VLS_207, new __VLS_207({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.cancelOppose')),
            placement: "top",
        }));
        const __VLS_209 = __VLS_208({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.operation.cancelOppose')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_208));
        const { default: __VLS_212 } = __VLS_210.slots;
        let __VLS_213;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent1(__VLS_213, new __VLS_213({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }));
        const __VLS_215 = __VLS_214({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        let __VLS_218;
        const __VLS_219 = {
            /** @type {typeof __VLS_218.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log'))
                    throw 0;
                if (!(__VLS_ctx.buttonData?.vote_status === '1'))
                    throw 0;
                return __VLS_ctx.cancelVoteHandle('-1');
                // @ts-ignore
                [$t, buttonData, loading, cancelVoteHandle,];
            },
        };
        const { default: __VLS_220 } = __VLS_216.slots;
        let __VLS_221;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_222 = __VLS_asFunctionalComponent1(__VLS_221, new __VLS_221({
            ...{ class: "color-secondary" },
            iconName: "app-oppose-color",
        }));
        const __VLS_223 = __VLS_222({
            ...{ class: "color-secondary" },
            iconName: "app-oppose-color",
        }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_216;
        var __VLS_217;
        // @ts-ignore
        [];
        var __VLS_210;
    }
    if (props.application.show_share) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "ml-8" },
        });
        /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
        let __VLS_226;
        /** @ts-ignore @type { | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip'] | typeof __VLS_components.elTooltip | typeof __VLS_components.ElTooltip | typeof __VLS_components['el-tooltip']} */
        elTooltip;
        // @ts-ignore
        const __VLS_227 = __VLS_asFunctionalComponent1(__VLS_226, new __VLS_226({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.share')),
            placement: "top",
        }));
        const __VLS_228 = __VLS_227({
            effect: "dark",
            content: (__VLS_ctx.$t('aiChat.share')),
            placement: "top",
        }, ...__VLS_functionalComponentArgsRest(__VLS_227));
        const { default: __VLS_231 } = __VLS_229.slots;
        let __VLS_232;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_233 = __VLS_asFunctionalComponent1(__VLS_232, new __VLS_232({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.chat_loading),
        }));
        const __VLS_234 = __VLS_233({
            ...{ 'onClick': {} },
            text: true,
            disabled: (__VLS_ctx.chat_loading),
        }, ...__VLS_functionalComponentArgsRest(__VLS_233));
        let __VLS_237;
        const __VLS_238 = {
            /** @type {typeof __VLS_237.click} */
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.type == 'ai-chat' || __VLS_ctx.type == 'log'))
                    throw 0;
                if (!(props.application.show_share))
                    throw 0;
                return __VLS_ctx.clickShareHandle(props.data.record_id);
                // @ts-ignore
                [$t, chat_loading, clickShareHandle,];
            },
        };
        const { default: __VLS_239 } = __VLS_235.slots;
        let __VLS_240;
        /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
        AppIcon;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent1(__VLS_240, new __VLS_240({
            ...{ class: "color-secondary" },
            iconName: "app-share",
        }));
        const __VLS_242 = __VLS_241({
            ...{ class: "color-secondary" },
            iconName: "app-share",
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        /** @type {__VLS_StyleScopedClasses['color-secondary']} */ ;
        // @ts-ignore
        [];
        var __VLS_235;
        var __VLS_236;
        // @ts-ignore
        [];
        var __VLS_229;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ref: "audioCiontainer",
});
const __VLS_245 = MobileVoteReasonDrawer;
// @ts-ignore
const __VLS_246 = __VLS_asFunctionalComponent1(__VLS_245, new __VLS_245({
    ...{ 'onSuccess': {} },
    ref: "mobileVoteReasonDrawerRef",
    chatId: (props.chatId),
    recordId: (props.data.record_id),
}));
const __VLS_247 = __VLS_246({
    ...{ 'onSuccess': {} },
    ref: "mobileVoteReasonDrawerRef",
    chatId: (props.chatId),
    recordId: (props.data.record_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_246));
let __VLS_250;
const __VLS_251 = {
    /** @type {typeof __VLS_250.success} */
    onSuccess: (__VLS_ctx.handleVoteSuccess),
};
var __VLS_252;
var __VLS_248;
var __VLS_249;
// @ts-ignore
var __VLS_107 = __VLS_106, __VLS_179 = __VLS_178, __VLS_253 = __VLS_252;
// @ts-ignore
[handleVoteSuccess,];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    __defaults: __VLS_defaults,
    __typeProps: {},
});
export default {};
