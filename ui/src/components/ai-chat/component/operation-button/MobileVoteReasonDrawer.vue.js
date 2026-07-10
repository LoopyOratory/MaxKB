/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed } from 'vue';
import { t } from '@/locales';
import chatAPI from '@/api/chat/chat';
const props = defineProps();
const visible = ref(false);
const voteType = ref(''); // '0' like, '1' oppose
const selectedReason = ref('');
const feedBack = ref('');
const loading = ref(false);
const selectReason = (value) => {
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
    return voteType.value === '0' ? t('aiChat.vote.likeTitle') : t('aiChat.vote.opposeTitle');
});
const reasons = computed(() => {
    return voteType.value === '0' ? LIKE_REASONS : OPPOSE_REASONS;
});
function voteHandle() {
    chatAPI
        .vote(props.chatId, props.recordId, voteType.value, selectedReason.value, feedBack.value, loading)
        .then(() => {
        emit('success', voteType.value);
        visible.value = false;
    });
}
const emit = defineEmits();
const open = (voteStatus) => {
    selectedReason.value = '';
    feedBack.value = '';
    voteType.value = voteStatus;
    visible.value = true;
};
const __VLS_exposed = { open };
defineExpose(__VLS_exposed);
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
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
elDrawer;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    modelValue: (__VLS_ctx.visible),
    direction: "btt",
    size: "-",
    footerClass: "mobile-vote-drawer-footer",
    modal: (true),
}));
const __VLS_2 = __VLS_1({
    modelValue: (__VLS_ctx.visible),
    direction: "btt",
    size: "-",
    footerClass: "mobile-vote-drawer-footer",
    modal: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { header: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "text-center" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    (__VLS_ctx.title);
    // @ts-ignore
    [visible, title,];
}
{
    const { default: __VLS_8 } = __VLS_3.slots;
    let __VLS_9;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent1(__VLS_9, new __VLS_9({
        wrap: true,
        size: (12),
    }));
    const __VLS_11 = __VLS_10({
        wrap: true,
        size: (12),
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    const { default: __VLS_14 } = __VLS_12.slots;
    for (const [reason] of __VLS_vFor((__VLS_ctx.reasons))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (reason.value),
        });
        let __VLS_15;
        /** @ts-ignore @type { | typeof __VLS_components.elCheckTag | typeof __VLS_components.ElCheckTag | typeof __VLS_components['el-check-tag'] | typeof __VLS_components.elCheckTag | typeof __VLS_components.ElCheckTag | typeof __VLS_components['el-check-tag']} */
        elCheckTag;
        // @ts-ignore
        const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
            ...{ 'onChange': {} },
            type: "primary",
            checked: (__VLS_ctx.selectedReason === reason.value),
        }));
        const __VLS_17 = __VLS_16({
            ...{ 'onChange': {} },
            type: "primary",
            checked: (__VLS_ctx.selectedReason === reason.value),
        }, ...__VLS_functionalComponentArgsRest(__VLS_16));
        let __VLS_20;
        const __VLS_21 = {
            /** @type {typeof __VLS_20.change} */
            onChange: (...[$event]) => {
                return __VLS_ctx.selectReason(reason.value);
                // @ts-ignore
                [reasons, selectedReason, selectReason,];
            },
        };
        const { default: __VLS_22 } = __VLS_18.slots;
        (reason.label);
        // @ts-ignore
        [];
        var __VLS_18;
        var __VLS_19;
        // @ts-ignore
        [];
    }
    // @ts-ignore
    [];
    var __VLS_12;
    if (__VLS_ctx.selectedReason === 'other') {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "mt-16" },
        });
        /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
        let __VLS_23;
        /** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input'] | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
        elInput;
        // @ts-ignore
        const __VLS_24 = __VLS_asFunctionalComponent1(__VLS_23, new __VLS_23({
            modelValue: (__VLS_ctx.feedBack),
            type: "textarea",
            autosize: ({ minRows: 4, maxRows: 20 }),
            placeholder: (__VLS_ctx.$t('aiChat.vote.placeholder')),
        }));
        const __VLS_25 = __VLS_24({
            modelValue: (__VLS_ctx.feedBack),
            type: "textarea",
            autosize: ({ minRows: 4, maxRows: 20 }),
            placeholder: (__VLS_ctx.$t('aiChat.vote.placeholder')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_24));
    }
    // @ts-ignore
    [selectedReason, feedBack, $t,];
}
{
    const { footer: __VLS_28 } = __VLS_3.slots;
    let __VLS_29;
    /** @ts-ignore @type { | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space'] | typeof __VLS_components.elSpace | typeof __VLS_components.ElSpace | typeof __VLS_components['el-space']} */
    elSpace;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent1(__VLS_29, new __VLS_29({
        fill: true,
        wrap: true,
        fillRatio: (40),
        ...{ style: {} },
    }));
    const __VLS_31 = __VLS_30({
        fill: true,
        wrap: true,
        fillRatio: (40),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    const { default: __VLS_34 } = __VLS_32.slots;
    let __VLS_35;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
        ...{ 'onClick': {} },
        size: "large",
    }));
    const __VLS_37 = __VLS_36({
        ...{ 'onClick': {} },
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_36));
    let __VLS_40;
    const __VLS_41 = {
        /** @type {typeof __VLS_40.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.visible = false;
            // @ts-ignore
            [visible,];
        },
    };
    const { default: __VLS_42 } = __VLS_38.slots;
    (__VLS_ctx.$t('common.cancel'));
    // @ts-ignore
    [$t,];
    var __VLS_38;
    var __VLS_39;
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.isSubmitDisabled),
        type: "primary",
        size: "large",
    }));
    const __VLS_45 = __VLS_44({
        ...{ 'onClick': {} },
        disabled: (__VLS_ctx.isSubmitDisabled),
        type: "primary",
        size: "large",
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    let __VLS_48;
    const __VLS_49 = {
        /** @type {typeof __VLS_48.click} */
        onClick: (...[$event]) => {
            return __VLS_ctx.voteHandle();
            // @ts-ignore
            [isSubmitDisabled, voteHandle,];
        },
    };
    const { default: __VLS_50 } = __VLS_46.slots;
    (__VLS_ctx.$t('common.submit'));
    // @ts-ignore
    [$t,];
    var __VLS_46;
    var __VLS_47;
    // @ts-ignore
    [];
    var __VLS_32;
    // @ts-ignore
    [];
}
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    __typeEmits: {},
    __typeProps: {},
});
export default {};
