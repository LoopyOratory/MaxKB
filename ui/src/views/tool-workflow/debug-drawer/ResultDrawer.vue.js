/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { ref, computed, reactive } from 'vue';
import { useRoute } from 'vue-router';
import { randomId } from '@/utils/common';
import { ChatManagement } from '@/api/type/application';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api';
import { t } from '@/locales';
import AnswerContent from '@/components/ai-chat/component/answer-content/index.vue';
import ExecutionDetailCard from '@/components/execution-detail-card/index.vue';
import { arraySort } from '@/utils/array';
import { getWrite } from '@/utils/chat';
const route = useRoute();
const { params: { folderId },
/*
folderId Can distinguish resource-management sharedOr workspace
*/
 } = route;
const isShared = computed(() => {
    return folderId === 'share';
});
const apiType = computed(() => {
    if (route.path.includes('shared')) {
        return 'systemShare';
    }
    else if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else if (route.path.includes('share/')) {
        return 'workspaceShare';
    }
    else {
        return 'workspace';
    }
});
const details = {
    show_avatar: false,
    show_user_avatar: false,
};
const activeName = ref('result');
const currentToolId = ref();
const currentData = ref({});
const emit = defineEmits(['close']);
const output = computed(() => {
    if (toolRecord.value) {
        return toolRecord.value.meta.output;
    }
    return {};
});
const executionDetails = computed(() => {
    if (toolRecord.value) {
        return Object.values(toolRecord.value.meta.details);
    }
    return [];
});
const isSuccess = computed(() => {
    if (toolRecord.value) {
        return toolRecord.value.state == 'FAILURE' ? false : true;
    }
    return undefined;
});
const toolRecord = ref();
const execute = (toolId, data) => {
    currentToolId.value = toolId;
    currentData.value = data;
    ChatManagement.addChatRecord(currentChat, 50, loading);
    ChatManagement.write(currentChat.id);
    return loadSharedApi({ type: 'tool', isShared: isShared.value, systemType: apiType.value })
        .debugToolWorkflow(toolId, data)
        .then((response) => {
        if (response.status === 460) {
            return Promise.reject(t('aiChat.tip.errorIdentifyMessage'));
        }
        else if (response.status === 461) {
            return Promise.reject(t('aiChat.tip.errorLimitMessage'));
        }
        else {
            const reader = response.body.getReader();
            // Process stream data
            const write = getWrite(currentChat, reader, response.headers.get('Content-Type') !== 'application/json');
            return write();
        }
    })
        .finally(() => {
        getToolRecord();
        ChatManagement.close(currentChat.id);
    })
        .catch((e) => {
        console.log(e);
    });
};
const loading = ref(false);
const currentChat = reactive({
    id: randomId(),
    answer_text_list: [[]],
    buffer: [],
    reasoning_content: '',
    reasoning_content_buffer: [],
    write_ed: false,
    is_stop: false,
    record_id: '',
    chat_id: '',
    vote_status: '-1',
    status: undefined,
});
const sendMessage = (val, other_params_data, chat) => {
    loadSharedApi({ type: 'tool', isShared: isShared.value, systemType: apiType.value })
        .debugToolWorkflow(currentToolId.value, { ...other_params_data, ...currentData.value })
        .then((response) => {
        if (response.status === 460) {
            return Promise.reject(t('aiChat.tip.errorIdentifyMessage'));
        }
        else if (response.status === 461) {
            return Promise.reject(t('aiChat.tip.errorLimitMessage'));
        }
        else {
            const reader = response.body.getReader();
            // Process stream data
            const write = getWrite(currentChat, reader, response.headers.get('Content-Type') !== 'application/json');
            return write();
        }
    })
        .finally(() => {
        ChatManagement.close(currentChat.id);
        getToolRecord();
    })
        .catch((e) => {
        console.log(e);
    });
    return Promise.resolve(true);
};
const getToolRecord = () => {
    loadSharedApi({
        type: 'tool',
        isShared: isShared.value,
        systemType: apiType.value,
    })
        .getToolRecordDetail(currentToolId.value, currentChat.record_id)
        .then((ok) => {
        toolRecord.value = ok.data;
    });
};
const resultDrawer = ref(false);
const open = (toolId, data) => {
    resultDrawer.value = true;
    execute(toolId, data);
};
const close = () => {
    ChatManagement.close(currentChat.id);
    emit('close');
    resultDrawer.value = false;
    toolRecord.value = null;
    currentChat.value = {
        id: randomId(),
        answer_text_list: [[]],
        buffer: [],
        reasoning_content: '',
        reasoning_content_buffer: [],
        write_ed: false,
        is_stop: false,
        record_id: '',
        chat_id: '',
        vote_status: '-1',
        status: undefined,
    };
};
const __VLS_exposed = { open, close };
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
if (__VLS_ctx.resultDrawer) {
    let __VLS_0;
    /** @ts-ignore @type { | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer'] | typeof __VLS_components.elDrawer | typeof __VLS_components.ElDrawer | typeof __VLS_components['el-drawer']} */
    elDrawer;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
        modelValue: (__VLS_ctx.resultDrawer),
        title: (__VLS_ctx.$t('common.debug')),
        direction: "rtl",
        beforeClose: (__VLS_ctx.close),
        destroyOnClose: (true),
        modal: (false),
        size: "800px",
        ...{ class: "tool-debug-result-drawer" },
    }));
    const __VLS_2 = __VLS_1({
        modelValue: (__VLS_ctx.resultDrawer),
        title: (__VLS_ctx.$t('common.debug')),
        direction: "rtl",
        beforeClose: (__VLS_ctx.close),
        destroyOnClose: (true),
        modal: (false),
        size: "800px",
        ...{ class: "tool-debug-result-drawer" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    var __VLS_5;
    /** @type {__VLS_StyleScopedClasses['tool-debug-result-drawer']} */ ;
    const { default: __VLS_6 } = __VLS_3.slots;
    {
        const { header: __VLS_7 } = __VLS_3.slots;
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
            ...{ class: "flex align-center" },
            ...{ style: {} },
        });
        /** @type {__VLS_StyleScopedClasses['flex']} */ ;
        /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
        let __VLS_8;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
            ...{ 'onClick': {} },
            ...{ class: "cursor mr-4" },
            link: true,
        }));
        const __VLS_10 = __VLS_9({
            ...{ 'onClick': {} },
            ...{ class: "cursor mr-4" },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_9));
        let __VLS_13;
        const __VLS_14 = {
            /** @type {typeof __VLS_13.click} */
            onClick: (__VLS_ctx.close),
        };
        /** @type {__VLS_StyleScopedClasses['cursor']} */ ;
        /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
        const { default: __VLS_15 } = __VLS_11.slots;
        let __VLS_16;
        /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
        elIcon;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
            size: (20),
        }));
        const __VLS_18 = __VLS_17({
            size: (20),
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        const { default: __VLS_21 } = __VLS_19.slots;
        let __VLS_22;
        /** @ts-ignore @type { | typeof __VLS_components.Back} */
        Back;
        // @ts-ignore
        const __VLS_23 = __VLS_asFunctionalComponent1(__VLS_22, new __VLS_22({}));
        const __VLS_24 = __VLS_23({}, ...__VLS_functionalComponentArgsRest(__VLS_23));
        // @ts-ignore
        [resultDrawer, resultDrawer, $t, close, close,];
        var __VLS_19;
        // @ts-ignore
        [];
        var __VLS_11;
        var __VLS_12;
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
        (__VLS_ctx.$t('views.tool.toolWorkflow.debugResult'));
        // @ts-ignore
        [$t,];
    }
    let __VLS_27;
    /** @ts-ignore @type { | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs'] | typeof __VLS_components.elTabs | typeof __VLS_components.ElTabs | typeof __VLS_components['el-tabs']} */
    elTabs;
    // @ts-ignore
    const __VLS_28 = __VLS_asFunctionalComponent1(__VLS_27, new __VLS_27({
        modelValue: (__VLS_ctx.activeName),
        ...{ style: {} },
    }));
    const __VLS_29 = __VLS_28({
        modelValue: (__VLS_ctx.activeName),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_28));
    const { default: __VLS_32 } = __VLS_30.slots;
    let __VLS_33;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent1(__VLS_33, new __VLS_33({
        label: "Output",
        name: "result",
    }));
    const __VLS_35 = __VLS_34({
        label: "Output",
        name: "result",
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    const { default: __VLS_38 } = __VLS_36.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "scrollbar-height" },
    });
    /** @type {__VLS_StyleScopedClasses['scrollbar-height']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
        ...{ class: "title-decoration-1 mb-16 mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    const __VLS_39 = AnswerContent || AnswerContent;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onOpenExecutionDetail': {} },
        ...{ 'onOpenParagraph': {} },
        ...{ 'onOpenParagraphDocument': {} },
        application: (__VLS_ctx.details),
        loading: (__VLS_ctx.loading),
        chatRecord: (__VLS_ctx.currentChat),
        type: "ai-chat",
        sendMessage: (__VLS_ctx.sendMessage),
        chatManagement: (__VLS_ctx.ChatManagement),
        executionIsRightPanel: (false),
        selection: (true),
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onOpenExecutionDetail': {} },
        ...{ 'onOpenParagraph': {} },
        ...{ 'onOpenParagraphDocument': {} },
        application: (__VLS_ctx.details),
        loading: (__VLS_ctx.loading),
        chatRecord: (__VLS_ctx.currentChat),
        type: "ai-chat",
        sendMessage: (__VLS_ctx.sendMessage),
        chatManagement: (__VLS_ctx.ChatManagement),
        executionIsRightPanel: (false),
        selection: (true),
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        /** @type {typeof __VLS_44.openExecutionDetail} */
        onOpenExecutionDetail: (() => { }),
    };
    const __VLS_46 = {
        /** @type {typeof __VLS_44.openParagraph} */
        onOpenParagraph: (() => { }),
    };
    const __VLS_47 = {
        /** @type {typeof __VLS_44.openParagraphDocument} */
        onOpenParagraphDocument: (() => { }),
    };
    var __VLS_42;
    var __VLS_43;
    if (__VLS_ctx.toolRecord) {
        __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({});
        __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({
            ...{ class: "title-decoration-1 mb-16 mt-16" },
        });
        /** @type {__VLS_StyleScopedClasses['title-decoration-1']} */ ;
        /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
        /** @type {__VLS_StyleScopedClasses['mt-16']} */ ;
        if (__VLS_ctx.isSuccess !== undefined) {
            __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
                ...{ class: "mb-16" },
            });
            /** @type {__VLS_StyleScopedClasses['mb-16']} */ ;
            if (__VLS_ctx.isSuccess) {
                let __VLS_48;
                /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
                elAlert;
                // @ts-ignore
                const __VLS_49 = __VLS_asFunctionalComponent1(__VLS_48, new __VLS_48({
                    title: (__VLS_ctx.$t('views.tool.form.debug.runSuccess')),
                    type: "success",
                    showIcon: true,
                    closable: (false),
                }));
                const __VLS_50 = __VLS_49({
                    title: (__VLS_ctx.$t('views.tool.form.debug.runSuccess')),
                    type: "success",
                    showIcon: true,
                    closable: (false),
                }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            }
            else {
                let __VLS_53;
                /** @ts-ignore @type { | typeof __VLS_components.elAlert | typeof __VLS_components.ElAlert | typeof __VLS_components['el-alert']} */
                elAlert;
                // @ts-ignore
                const __VLS_54 = __VLS_asFunctionalComponent1(__VLS_53, new __VLS_53({
                    title: (__VLS_ctx.$t('views.tool.form.debug.runFailed')),
                    type: "error",
                    showIcon: true,
                    closable: (false),
                }));
                const __VLS_55 = __VLS_54({
                    title: (__VLS_ctx.$t('views.tool.form.debug.runFailed')),
                    type: "error",
                    showIcon: true,
                    closable: (false),
                }, ...__VLS_functionalComponentArgsRest(__VLS_54));
            }
        }
        let __VLS_58;
        /** @ts-ignore @type { | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card'] | typeof __VLS_components.elCard | typeof __VLS_components.ElCard | typeof __VLS_components['el-card']} */
        elCard;
        // @ts-ignore
        const __VLS_59 = __VLS_asFunctionalComponent1(__VLS_58, new __VLS_58({
            ...{ style: {} },
            ...{ class: (__VLS_ctx.isSuccess ? '' : 'color-danger') },
            ...{ class: "pre-wrap" },
            shadow: "never",
        }));
        const __VLS_60 = __VLS_59({
            ...{ style: {} },
            ...{ class: (__VLS_ctx.isSuccess ? '' : 'color-danger') },
            ...{ class: "pre-wrap" },
            shadow: "never",
        }, ...__VLS_functionalComponentArgsRest(__VLS_59));
        /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
        const { default: __VLS_63 } = __VLS_61.slots;
        (__VLS_ctx.output);
        // @ts-ignore
        [$t, $t, activeName, details, loading, currentChat, sendMessage, ChatManagement, toolRecord, isSuccess, isSuccess, isSuccess, output,];
        var __VLS_61;
    }
    // @ts-ignore
    [];
    var __VLS_36;
    let __VLS_64;
    /** @ts-ignore @type { | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane'] | typeof __VLS_components.elTabPane | typeof __VLS_components.ElTabPane | typeof __VLS_components['el-tab-pane']} */
    elTabPane;
    // @ts-ignore
    const __VLS_65 = __VLS_asFunctionalComponent1(__VLS_64, new __VLS_64({
        label: "ExecuteDetails",
        name: "executionDetails",
    }));
    const __VLS_66 = __VLS_65({
        label: "ExecuteDetails",
        name: "executionDetails",
    }, ...__VLS_functionalComponentArgsRest(__VLS_65));
    const { default: __VLS_69 } = __VLS_67.slots;
    let __VLS_70;
    /** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
    elScrollbar;
    // @ts-ignore
    const __VLS_71 = __VLS_asFunctionalComponent1(__VLS_70, new __VLS_70({}));
    const __VLS_72 = __VLS_71({}, ...__VLS_functionalComponentArgsRest(__VLS_71));
    const { default: __VLS_75 } = __VLS_73.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "scrollbar-height" },
    });
    /** @type {__VLS_StyleScopedClasses['scrollbar-height']} */ ;
    for (const [item, index] of __VLS_vFor((__VLS_ctx.arraySort(__VLS_ctx.executionDetails ?? [], 'index')))) {
        __VLS_asFunctionalElement(__VLS_intrinsics.template)({
            key: (index),
        });
        const __VLS_76 = ExecutionDetailCard || ExecutionDetailCard;
        // @ts-ignore
        const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
            data: (item),
        }));
        const __VLS_78 = __VLS_77({
            data: (item),
        }, ...__VLS_functionalComponentArgsRest(__VLS_77));
        // @ts-ignore
        [arraySort, executionDetails,];
    }
    // @ts-ignore
    [];
    var __VLS_73;
    // @ts-ignore
    [];
    var __VLS_67;
    // @ts-ignore
    [];
    var __VLS_30;
    // @ts-ignore
    [];
    var __VLS_3;
}
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
