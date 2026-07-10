/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { onUnmounted, ref, computed, watch } from 'vue';
import { arraySort } from '@/utils/array';
import ExecutionDetailCard from '@/components/execution-detail-card/index.vue';
import { useRoute } from 'vue-router';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
const route = useRoute();
const props = defineProps();
const detail = computed(() => {
    if (knowledge_action.value) {
        return Object.values(knowledge_action.value.details);
    }
    return [];
});
const state = computed(() => {
    if (knowledge_action.value) {
        return knowledge_action.value.state;
    }
    return 'PADDING';
});
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
const knowledge_action = ref();
let pollingTimer = null;
const getKnowledgeWorkflowAction = () => {
    if (pollingTimer == null) {
        return;
    }
    loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .getWorkflowAction(props.knowledge_id, props.id)
        .then((ok) => {
        knowledge_action.value = ok.data;
    })
        .finally(() => {
        if (['SUCCESS', 'FAILURE', 'REVOKED'].includes(state.value)) {
            stopPolling();
        }
        else {
            // RequestCompleteThen afterSettingsNext timePoll
            pollingTimer = setTimeout(getKnowledgeWorkflowAction, 2000);
        }
    });
};
const stopPolling = () => {
    if (pollingTimer) {
        clearTimeout(pollingTimer);
        pollingTimer = null;
    }
};
// StartPoll
pollingTimer = setTimeout(getKnowledgeWorkflowAction, 0);
watch(() => props.id, () => {
    stopPolling();
    pollingTimer = setTimeout(getKnowledgeWorkflowAction, 0);
});
onUnmounted(() => {
    stopPolling();
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
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
    ...{ class: "title-decoration-1 mb-16 mt-4" },
});
/** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
/** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-4']} */ ;
(__VLS_ctx.$t('aiChat.executionDetails.title'));
if (!__VLS_ctx.isRecord) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mb-16" },
    });
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    if (__VLS_ctx.state == 'SUCCESS') {
        let __VLS_0;
        /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
        elAlert;
        // @ts-ignore
        const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
            title: (__VLS_ctx.$t('common.status.success')),
            type: "success",
            showIcon: true,
            closable: (false),
        }));
        const __VLS_2 = __VLS_1({
            title: (__VLS_ctx.$t('common.status.success')),
            type: "success",
            showIcon: true,
            closable: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    }
    if (__VLS_ctx.state == 'FAILURE') {
        let __VLS_5;
        /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
        elAlert;
        // @ts-ignore
        const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
            title: (__VLS_ctx.$t('common.status.fail')),
            type: "error",
            showIcon: true,
            closable: (false),
        }));
        const __VLS_7 = __VLS_6({
            title: (__VLS_ctx.$t('common.status.fail')),
            type: "error",
            showIcon: true,
            closable: (false),
        }, ...__VLS_functionalComponentArgsRest(__VLS_6));
    }
}
for (const [item, index] of __VLS_vFor((__VLS_ctx.arraySort(__VLS_ctx.detail ?? [], 'index')))) {
    __VLS_asFunctionalElement(__VLS_intrinsics.template)({
        key: (index),
    });
    const __VLS_10 = ExecutionDetailCard || ExecutionDetailCard;
    // @ts-ignore
    const __VLS_11 = __VLS_asFunctionalComponent1(__VLS_10, new __VLS_10({
        data: (item),
        type: "knowledge",
    }));
    const __VLS_12 = __VLS_11({
        data: (item),
        type: "knowledge",
    }, ...__VLS_functionalComponentArgsRest(__VLS_11));
    // @ts-ignore
    [$t, $t, $t, isRecord, state, state, arraySort, detail,];
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
