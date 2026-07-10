/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, watch } from 'vue';
import { t } from '@/locales';
const props = defineProps({
    time: {
        type: Number,
        default: 0,
    },
    start: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});
const emit = defineEmits(['TouchStart', 'TouchEnd']);
// Mobile voice input
const startY = ref(0);
const isTouching = ref(false);
const dialogVisible = ref(false);
const message = ref(t('aiChat.inputPlaceholder.holdToTalk'));
watch(() => [props.time, props.start], ([time, start]) => {
    if (start) {
        isTouching.value = true;
        dialogVisible.value = true;
        message.value = t('aiChat.inputPlaceholder.touchChatMessage');
        if (time === 60) {
            dialogVisible.value = false;
            emit('TouchEnd', isTouching.value);
            isTouching.value = false;
        }
    }
    else {
        dialogVisible.value = false;
        isTouching.value = false;
    }
});
watch(() => props.start, (val) => {
    if (val) {
        isTouching.value = true;
        dialogVisible.value = true;
        message.value = t('aiChat.inputPlaceholder.touchChatMessage');
    }
    else {
        dialogVisible.value = false;
        isTouching.value = false;
    }
});
function onTouchStart(event) {
    // Prevent default scroll behavior
    event.preventDefault();
    if (props.disabled) {
        return;
    }
    emit('TouchStart');
    startY.value = event.touches[0].clientY;
}
function onTouchMove(event) {
    if (!isTouching.value)
        return;
    // Prevent default scroll behavior
    event.preventDefault();
    const currentY = event.touches[0].clientY;
    const deltaY = currentY - startY.value;
    // Detect if swiping up
    if (deltaY < -50) {
        // -50 is a threshold, adjust as needed
        message.value = t('aiChat.inputPlaceholder.cancelTouchChat');
        isTouching.value = false;
    }
}
function onTouchEnd() {
    emit('TouchEnd', isTouching.value);
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
/** @type {__VLS_StyleScopedClasses['close']} */ ;
/** @type {__VLS_StyleScopedClasses['speech-img']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "touch-chat p-8 pb-0" },
});
/** @type {__VLS_StyleScopedClasses['touch-chat']} */ ;
/** @type {__VLS_StyleScopedClasses['p-8']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    ...{ 'onTouchstart': {} },
    ...{ 'onTouchmove': {} },
    ...{ 'onTouchend': {} },
    text: true,
    bg: true,
    ...{ class: "microphone-button w-full" },
    ...{ style: {} },
    disabled: (__VLS_ctx.disabled),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onTouchstart': {} },
    ...{ 'onTouchmove': {} },
    ...{ 'onTouchend': {} },
    text: true,
    bg: true,
    ...{ class: "microphone-button w-full" },
    ...{ style: {} },
    disabled: (__VLS_ctx.disabled),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_5;
const __VLS_6 = {
    /** @type {typeof __VLS_5.touchstart} */
    onTouchstart: (__VLS_ctx.onTouchStart),
};
const __VLS_7 = {
    /** @type {typeof __VLS_5.touchmove} */
    onTouchmove: (__VLS_ctx.onTouchMove),
};
const __VLS_8 = {
    /** @type {typeof __VLS_5.touchend} */
    onTouchend: (__VLS_ctx.onTouchEnd),
};
/** @type {__VLS_StyleScopedClasses['microphone-button']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
const { default: __VLS_9 } = __VLS_3.slots;
(__VLS_ctx.disabled ? __VLS_ctx.$t('aiChat.inputPlaceholder.chatting') : __VLS_ctx.$t('aiChat.inputPlaceholder.holdToTalk'));
// @ts-ignore
[disabled, disabled, onTouchStart, onTouchMove, onTouchEnd, $t, $t,];
var __VLS_3;
var __VLS_4;
let __VLS_10;
/** @ts-ignore @type { | typeof __VLS_components.transition | typeof __VLS_components.Transition | typeof __VLS_components.transition | typeof __VLS_components.Transition} */
transition;
// @ts-ignore
const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
    name: "el-fade-in-linear",
}));
const __VLS_12 = __VLS_11({
    name: "el-fade-in-linear",
}, ...__VLS_functionalComponentArgsRest(__VLS_11));
const { default: __VLS_15 } = __VLS_13.slots;
if (__VLS_ctx.dialogVisible) {
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
    elCard;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        ...{ class: "custom-speech-card white-bg" },
        ...{ class: (__VLS_ctx.isTouching ? '' : 'active') },
    }));
    const __VLS_18 = __VLS_17({
        ...{ class: "custom-speech-card white-bg" },
        ...{ class: (__VLS_ctx.isTouching ? '' : 'active') },
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    /** @type {__VLS_StyleScopedClasses['custom-speech-card']} */ ;
    /** @type {__VLS_StyleScopedClasses['white-bg']} */ ;
    const { default: __VLS_21 } = __VLS_19.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
    if (__VLS_ctx.isTouching) {
        let __VLS_22;
        /** @ts-ignore @type { | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text'] | typeof __VLS_components.elText | typeof __VLS_components.ElText | typeof __VLS_components['el-text']} */
        elText;
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({
            type: "info",
        }));
        const __VLS_24 = __VLS_23({
            type: "info",
        }, ...__VLS_functionalComponentArgsRest(__VLS_23));
        const { default: __VLS_27 } = __VLS_25.slots;
        (props.time < 10 ? `0${props.time}` : props.time);
        // @ts-ignore
        [dialogVisible, isTouching, isTouching,];
        var __VLS_25;
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        (__VLS_ctx.message);
    }
    let __VLS_28;
    /** @ts-ignore @type { | typeof __VLS_components.elAvatar | typeof __VLS_components.ElAvatar | typeof __VLS_components['el-avatar']} */
    elAvatar;
    // @ts-ignore
    const __VLS_29 = __VLS_asFunctionalComponent1(__VLS_28, new __VLS_28({
        size: (__VLS_ctx.isTouching ? 43 : 50),
        icon: "Close",
        ...{ class: "close" },
    }));
    const __VLS_30 = __VLS_29({
        size: (__VLS_ctx.isTouching ? 43 : 50),
        icon: "Close",
        ...{ class: "close" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_29));
    /** @type {__VLS_StyleScopedClasses['close']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "lighter" },
        ...{ style: ({ visibility: __VLS_ctx.isTouching ? 'visible' : 'hidden' }) },
    });
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.message);
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "speech-img flex-center border-r-6 mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['speech-img']} */ ;
    /** @type {__VLS_StyleScopedClasses['flex-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    if (__VLS_ctx.isTouching) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/chat/acoustic-color.svg",
            alt: "",
        });
    }
    else {
        __VLS_asFunctionalElement1(__VLS_intrinsics.img)({
            src: "@/assets/chat/acoustic.svg",
            alt: "",
        });
    }
    // @ts-ignore
    [isTouching, isTouching, isTouching, message, message,];
    var __VLS_19;
}
// @ts-ignore
[];
var __VLS_13;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    emits: {},
    props: {
        time: {
            type: Number,
            default: 0,
        },
        start: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
});
export default {};
