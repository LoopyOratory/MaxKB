/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { t } from '@/locales';
import chatAPI from '@/api/chat/chat';
const props = defineProps();
const selectedReason = ref(props.readonly ? props.defaultReason || '' : '');
const feedBack = ref(props.readonly ? props.defaultOtherContent || '' : '');
const loading = ref(false);
const selectReason = (value) => {
    if (props.readonly) {
        return;
    }
    selectedReason.value = value;
};
const isSubmitDisabled = computed(() => {
    if (!selectedReason.value) {
        return true;
    }
    if (selectedReason.value === 'other' && !feedBack.value.trim()) {
        return true;
    }
    return false;
});
const LIKE_REASONS = [
    { label: t('aiChat.vote.accurate'), value: 'accurate' },
    { label: t('aiChat.vote.complete'), value: 'complete' },
    { label: t('common.other'), value: 'other' },
];
const OPPOSE_REASONS = [
    { label: t('aiChat.vote.inaccurate'), value: 'inaccurate' },
    { label: t('aiChat.vote.irrelevantAnswer'), value: 'incomplete' },
    { label: t('common.other'), value: 'other' },
];
const title = computed(() => {
    return props.voteType === '0' ? t('aiChat.vote.likeTitle') : t('aiChat.vote.opposeTitle');
});
const reasons = computed(() => {
    return props.voteType === '0' ? LIKE_REASONS : OPPOSE_REASONS;
});
function voteHandle() {
    chatAPI
        .vote(props.chatId, props.recordId, props.voteType, selectedReason.value, feedBack.value, loading)
        .then(() => {
        emit('success', props.voteType);
        emit('close');
    });
}
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
(__VLS_ctx.title);
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "mt-16" },
});
/** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
elSpace;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    wrap: true,
    size: (12),
}));
const __VLS_2 = __VLS_1({
    wrap: true,
    size: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const { default: __VLS_5 } = __VLS_3.slots;
for (const [reason] of __VLS_vFor((__VLS_ctx.reasons))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (reason.value),
    });
    let __VLS_6;
    /** @ts-ignore @type { | typeof __VLS_components.elCheckTag | typeof __VLS_components.ElCheckTag | typeof __VLS_components['el-check-tag'] | typeof __VLS_components.elCheckTag | typeof __VLS_components.ElCheckTag | typeof __VLS_components['el-check-tag']} */
    elCheckTag;
    // @ts-ignore
    const __VLS_7 = __VLS_asFunctionalComponent1(__VLS_6, new __VLS_6({
        ...{ 'onChange': {} },
        type: "primary",
        checked: (__VLS_ctx.selectedReason === reason.value),
    }));
    const __VLS_8 = __VLS_7({
        ...{ 'onChange': {} },
        type: "primary",
        checked: (__VLS_ctx.selectedReason === reason.value),
    }, ...__VLS_functionalComponentArgsRest(__VLS_7));
    let __VLS_11;
    const __VLS_12 = {
        /** @type {typeof __VLS_11.change} */
        onChange: (...[$event]) => {
            return __VLS_ctx.selectReason(reason.value);
            // @ts-ignore
            [title, reasons, selectedReason, selectReason,];
        },
    };
    const { default: __VLS_13 } = __VLS_9.slots;
    (reason.label);
    // @ts-ignore
    [];
    var __VLS_9;
    var __VLS_10;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
if (__VLS_ctx.selectedReason === 'other') {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
    let __VLS_14;
    /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
    elInput;
    // @ts-ignore
    const __VLS_15 = __VLS_asFunctionalComponent1(__VLS_14, new __VLS_14({
        modelValue: (__VLS_ctx.feedBack),
        type: "textarea",
        autosize: ({ minRows: 4, maxRows: 20 }),
        placeholder: (__VLS_ctx.$t('aiChat.vote.placeholder')),
        readonly: (__VLS_ctx.readonly),
    }));
    const __VLS_16 = __VLS_15({
        modelValue: (__VLS_ctx.feedBack),
        type: "textarea",
        autosize: ({ minRows: 4, maxRows: 20 }),
        placeholder: (__VLS_ctx.$t('aiChat.vote.placeholder')),
        readonly: (__VLS_ctx.readonly),
    }, ...__VLS_functionalComponentArgsRest(__VLS_15));
}
if (!__VLS_ctx.readonly) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "dialog-footer mt-24 text-right" },
    });
    /** @type {__VLS_StyleScopedClasses['dialog-footer']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-24']} */ ;
    /** @type {__VLS_StyleScopedClasses['text-right']} */ ;
    let __VLS_19;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_20 = __VLS_asFunctionalComponent1(__VLS_19, new __VLS_19({
        ...{ 'onClick': {} },
    }));
    const __VLS_21 = __VLS_20({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_20));
    let __VLS_24;
    const __VLS_25 = {
        /** @type {typeof __VLS_24.click} */
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.readonly))
                throw 0;
            return __VLS_ctx.emit('close');
            // @ts-ignore
            [selectedReason, feedBack, $t, readonly, readonly, emit,];
        },
    };
    const { default: __VLS_26 } = __VLS_22.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_22;
    var __VLS_23;
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.isSubmitDisabled),
        type: "primary",
    }));
    const __VLS_29 = __VLS_28({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.isSubmitDisabled),
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    let __VLS_32;
    const __VLS_33 = {
        /** @type {typeof __VLS_32.click} */
        onClick: (...[$event]) => {
            if (!(!__VLS_ctx.readonly))
                throw 0;
            return __VLS_ctx.voteHandle();
            // @ts-ignore
            [isSubmitDisabled, voteHandle,];
        },
    };
    const { default: __VLS_34 } = __VLS_30.slots;
    (__VLS_ctx.$t('common.submit'));
    // @ts-ignore
    [$t,];
    var __VLS_30;
    var __VLS_31;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
export default {};
