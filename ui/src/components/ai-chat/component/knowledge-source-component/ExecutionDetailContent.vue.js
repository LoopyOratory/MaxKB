/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed } from 'vue';
import ExecutionDetailCard from '@/components/execution-detail-card/index.vue';
import { arraySort } from '@/utils/array';
import { isWorkFlow } from '@/utils/application';
import MdRenderer from '@/components/markdown/MdRenderer.vue';
const props = defineProps();
const errStepMsg = computed(() => {
    const err_step = props.detail?.find((item) => item.status === 500);
    if (err_step) {
        return `${err_step.step_type}: ${err_step.err_message}`;
    }
    return undefined;
});
const messageList = computed(() => {
    const chat_step = props.detail?.find((item) => item.step_type == 'chat_step');
    if (chat_step) {
        return chat_step.message_list;
    }
    return [];
});
const get_padding_problem = () => {
    return props.detail?.find((item) => item.step_type == 'problem_padding');
};
const get_padded_problem = () => {
    return props.detail?.find((item) => item.step_type == 'problem_padding');
};
const paddedProblem = computed(() => {
    const problem_padded = get_padded_problem();
    if (problem_padded) {
        return problem_padded.padding_problem_text;
    }
    else {
        return '';
    }
});
const problem = computed(() => {
    const problem_padding = get_padding_problem();
    if (problem_padding) {
        return problem_padding.problem_text;
    }
    const user_list = messageList.value.filter((item) => item.role == 'user');
    if (user_list.length > 0) {
        return user_list[user_list.length - 1].content;
    }
    else {
        return '';
    }
});
const system = computed(() => {
    const user_list = messageList.value.filter((item) => item.role == 'system');
    if (user_list.length > 0) {
        return user_list[user_list.length - 1].content;
    }
    else {
        return '';
    }
});
const historyRecord = computed(() => {
    const messages = messageList.value.filter((item) => item.role != 'system');
    if (messages.length > 2) {
        return messages.slice(0, messages.length - 2);
    }
    return [];
});
const currentChat = computed(() => {
    const messages = messageList.value.filter((item) => item.role != 'system');
    return messages.slice(messages.length - 2, messages.length - 1);
});
const AiResponse = computed(() => {
    const messages = messageList.value?.filter((item) => item.role != 'system');
    return messages.slice(messages.length - 1, messages.length);
});
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "execution-details" },
});
/** @type {__VLS_StyleScopedClasses['execution-details']} */ ;
if (__VLS_ctx.isWorkFlow(props.appType)) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
    for (const [item, index] of __VLS_vFor((__VLS_ctx.arraySort(props.detail ?? [], 'index')))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        const __VLS_0 = ExecutionDetailCard || ExecutionDetailCard;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            data: (item),
        }));
        const __VLS_2 = __VLS_1({
            data: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
        // @ts-ignore
        [isWorkFlow, arraySort,];
    }
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-never border-r-6 mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "p-8-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    (__VLS_ctx.$t('aiChat.paragraphSource.question'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12 border-t-dashed lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.problem);
    if (__VLS_ctx.paddedProblem) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6 mb-12" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('aiChat.paragraphSource.questionPadded'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        (__VLS_ctx.paddedProblem);
    }
    if (__VLS_ctx.system) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6 mb-12" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('views.application.form.roleSettings.label'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
            ...{ class: "mb-8" },
        });
        /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
        (__VLS_ctx.system);
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-never border-r-6 mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "p-8-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    (__VLS_ctx.$t('aiChat.history'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12 border-t-dashed lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    for (const [msg, index] of __VLS_vFor((__VLS_ctx.historyRecord))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (msg.role);
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (msg.content);
        // @ts-ignore
        [$t, $t, $t, $t, problem, paddedProblem, paddedProblem, system, system, historyRecord,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-never border-r-6 mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "p-8-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    (__VLS_ctx.$t('aiChat.executionDetails.currentChat'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12 border-t-dashed lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    (__VLS_ctx.$t('aiChat.executionDetails.knowedMessage'));
    for (const [msg, index] of __VLS_vFor((__VLS_ctx.currentChat))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (index),
        });
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (msg.content);
        // @ts-ignore
        [$t, $t, currentChat,];
    }
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "card-never border-r-6 mb-12" },
    });
    /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
        ...{ class: "p-8-12" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    (__VLS_ctx.$t('aiChat.executionDetails.answer'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "p-8-12 border-t-dashed lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
    /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    for (const [msg, index] of __VLS_vFor((__VLS_ctx.AiResponse))) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            key: (index),
        });
        if (msg.content) {
            const __VLS_5 = MdRenderer || MdRenderer;
            // @ts-ignore
            const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
                source: (msg.content),
                noImgZoomIn: true,
            }));
            const __VLS_7 = __VLS_6({
                source: (msg.content),
                noImgZoomIn: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_6));
        }
        else {
        }
        // @ts-ignore
        [$t, AiResponse,];
    }
    if (__VLS_ctx.errStepMsg) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "card-never border-r-6 mb-12" },
        });
        /** @type {__VLS_StyleScopedClasses['card-never']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-r-6']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-12']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h5, __VLS_intrinsics.h5)({
            ...{ class: "p-8-12" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        (__VLS_ctx.$t('aiChat.executionDetails.errLog'));
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "p-8-12 border-t-dashed lighter" },
        });
        /** @type {__VLS_StyleScopedClasses['p-8-12']} */ ;
        /** @type {__VLS_StyleScopedClasses['border-t-dashed']} */ ;
        /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
        (__VLS_ctx.errStepMsg);
    }
}
// @ts-ignore
[$t, errStepMsg, errStepMsg,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
