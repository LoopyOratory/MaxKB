/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import useStore from '@/stores';
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts';
import { groupBy } from 'lodash';
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue';
import SendIcon from '@/components/logo/SendIcon.vue';
const emit = defineEmits(['replace']);
const { user } = useStore();
const route = useRoute();
const chatMessages = ref([]);
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
// OriginalInput
const originalUserInput = ref('');
const dialogVisible = ref(false);
const inputValue = ref('');
const loading = ref(false);
const modelOptions = ref(null);
const inputFieldList = ref([]);
const initFieldList = ref([]);
const AIModeParamSettingDialogRef = ref();
const model_id = ref('');
const model_params_setting = ref({});
const promptTemplates = {
    INIT_TEMPLATE: `You are a senior Python Engineer, focused on MaxKB PlatformTools / Data sourceScenarioGeneratecanDirectRun Python Code。StrictFollowBelowRule：

- Only output pure Python code block, without any extra text beyond explanations and comment notes;
- CodeCompatible Python 3.8 And aboveVersion，Matches PEP8 EncodingStandard, keyLogicAddConcise Chinese comments;
- Only use MaxKB built-in dependencies (e.g., requests, pymysql, pandas, json, etc.), do not introduce undeclared third-party libraries.

{userInput}

Please for MaxKB Tools Generate Python Code, requirements as follows:

- Core functionality:User inputTheme / Functional requirements
- Start parameters: Platform configuration init parameters, such as API secret key, database address, account password, etc. Declared parameters: {initFieldList}
- InputParameters：PlatformConfigurationInputParameters, already declaredParameters：{inputFieldList}
- Function definition: List all start parameters and input parameters in order and declare return type
- OutputRequires：CodeNeedsReceiveInputParameters，StartParametersCompleteBusinessLogic, onlyOutputFunctionDefinition
`,
};
const isStreaming = ref(false); // Whether currently streaming output
const isPaused = ref(false); // Whether paused
const fullContent = ref(''); // Complete content cache
const currentDisplayIndex = ref(0); // Current display character position
let streamTimer = null; // Timer reference
const isOutputComplete = ref(false);
// Timer function simulating streaming output
const startStreamingOutput = () => {
    if (streamTimer) {
        clearInterval(streamTimer);
    }
    isStreaming.value = true;
    isPaused.value = false;
    streamTimer = setInterval(() => {
        if (isApiComplete.value && !isPaused.value) {
            // Update display content
            const currentAnswer = chatMessages.value[chatMessages.value.length - 1];
            if (currentAnswer && currentAnswer.role === 'ai') {
                currentAnswer.content = fullContent.value;
            }
            stopStreaming();
            return;
        }
        if (!isPaused.value && currentDisplayIndex.value < fullContent.value.length) {
            // Output 1-3 characters each time, simulating real streaming output
            const step = Math.min(3, fullContent.value.length - currentDisplayIndex.value);
            currentDisplayIndex.value += step;
            // Update display content
            const currentAnswer = chatMessages.value[chatMessages.value.length - 1];
            if (currentAnswer && currentAnswer.role === 'ai') {
                currentAnswer.content = fullContent.value.substring(0, currentDisplayIndex.value);
            }
        }
        else if (loading.value === false && currentDisplayIndex.value >= fullContent.value.length) {
            stopStreaming();
        }
    }, 50);
};
// Stop streaming output
const stopStreaming = () => {
    if (streamTimer) {
        clearInterval(streamTimer);
        streamTimer = null;
    }
    isStreaming.value = false;
    isPaused.value = false;
    loading.value = false;
    isOutputComplete.value = true;
};
const showStopButton = computed(() => {
    return isStreaming.value;
});
// Pause streaming output
const pauseStreaming = () => {
    isPaused.value = true;
    isStreaming.value = false;
};
// Continue streaming output
const continueStreaming = () => {
    if (currentDisplayIndex.value < fullContent.value.length) {
        startStreamingOutput();
    }
};
/**
 * Get a recursive function to process streaming data
 * @param chat    Each conversation record
 * @param reader  Stream data
 * @param stream  Whether it is streaming data
 */
const getWrite = (reader) => {
    let tempResult = '';
    const middleAnswer = reactive({ content: '', role: 'ai' });
    chatMessages.value.push(middleAnswer);
    // Initialize state and
    fullContent.value = '';
    currentDisplayIndex.value = 0;
    isOutputComplete.value = false;
    let streamingStarted = false;
    /**
     *
     * @param done  Whether ended
     * @param value Value
     */
    const write_stream = ({ done, value }) => {
        try {
            if (done) {
                // Stream data received completely, but timer continues running until all content is displayed
                loading.value = false;
                isApiComplete.value = true;
                return;
            }
            const decoder = new TextDecoder('utf-8');
            let str = decoder.decode(value, { stream: true });
            // Explanation start Because the data stream return is not aligned with backend chunks. We expect chunks as data:{xxx}\n\n but may receive partial chunks like data:{ -> xxx}\n\n. In summary, fetch cannot guarantee each chunk starts with data: and ends with \n\n
            tempResult += str;
            const split = tempResult.match(/data:.*}\n\n/g);
            if (split) {
                str = split.join('');
                tempResult = tempResult.replace(str, '');
            }
            else {
                return reader.read().then(write_stream);
            }
            // Explanation end
            if (str && str.startsWith('data:')) {
                if (split) {
                    for (const index in split) {
                        const chunk = JSON?.parse(split[index].replace('data:', ''));
                        if (chunk.error) {
                            loading.value = false;
                            stopStreaming();
                            middleAnswer.content = chunk.error;
                            return Promise.reject(new Error(chunk.error));
                        }
                        if (!chunk.is_end) {
                            // Add newly received content to the complete content in real time
                            fullContent.value += chunk.content;
                            if (!streamingStarted) {
                                streamingStarted = true;
                                startStreamingOutput();
                            }
                        }
                        if (chunk.is_end) {
                            return Promise.resolve();
                        }
                    }
                }
            }
        }
        catch (e) {
            loading.value = false;
            stopStreaming();
            return Promise.reject(e);
        }
        return reader.read().then(write_stream);
    };
    return write_stream;
};
const isApiComplete = ref(false);
const answer = computed(() => {
    const result = chatMessages.value[chatMessages.value.length - 1];
    if (result && result.role == 'ai') {
        return result.content;
    }
    return '';
});
// Calculate button state
const showContinueButton = computed(() => {
    return (!isStreaming.value && isPaused.value && currentDisplayIndex.value < fullContent.value.length);
});
function generatePrompt(inputValue) {
    isApiComplete.value = false;
    loading.value = true;
    const workspaceId = user.getWorkspaceId() || 'default';
    chatMessages.value.push({ content: inputValue, role: 'user' });
    const requestData = {
        messages: chatMessages.value,
        prompt: promptTemplates.INIT_TEMPLATE,
        init_field_list: initFieldList.value,
        input_field_list: inputFieldList.value,
        model_id: model_id.value,
        model_params_setting: model_params_setting.value,
    };
    loadSharedApi({ type: 'tool', systemType: apiType.value })
        .generateCode(requestData)
        .then((response) => {
        nextTick(() => {
            if (dialogScrollbar.value) {
                // Scroll to the bottom
                scrollDiv.value.setScrollTop(getMaxHeight());
            }
        });
        const reader = response.body.getReader();
        reader.read().then(getWrite(reader));
    });
}
// Re-generate click
const reAnswerClick = () => {
    if (originalUserInput.value) {
        generatePrompt(`The previous answer was unsatisfactory. Regarding the original question "${originalUserInput.value}" and based on the conversation record, strictly re-generate following the format standard.`);
    }
};
const quickInputRef = ref();
const handleSubmit = (event) => {
    if (!event?.ctrlKey && !event?.shiftKey && !event?.altKey && !event?.metaKey) {
        // If no modifier key is pressed, block the default event
        event?.preventDefault();
        if (!inputValue.value.trim() || loading.value || isStreaming.value || !model_id.value) {
            return;
        }
        if (!originalUserInput.value) {
            originalUserInput.value = inputValue.value;
        }
        if (isPaused.value || isStreaming.value) {
            return;
        }
        if (inputValue.value) {
            generatePrompt(inputValue.value);
            inputValue.value = '';
        }
    }
    else {
        // If ctrl/shift/cmd/opt + enter is pressed simultaneously, insert a newline
        insertNewlineAtCursor(event);
    }
};
const insertNewlineAtCursor = (event) => {
    const textarea = quickInputRef.value.$el.querySelector('.el-textarea__inner');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    // Block default behavior (avoid extra newlines)
    event.preventDefault();
    // At cursor, insert newline
    inputValue.value = inputValue.value.slice(0, startPos) + '\n' + inputValue.value.slice(endPos);
    nextTick(() => {
        textarea.setSelectionRange(startPos + 1, startPos + 1); // Position cursor after newline
    });
};
function getSelectModel() {
    loading.value = true;
    const obj = apiType.value === 'systemManage'
        ? {
            model_type: 'LLM',
            // todo workspace_id
            workspace_id: '',
        }
        : {
            model_type: 'LLM',
        };
    loadSharedApi({ type: 'model', systemType: apiType.value })
        .getSelectModelList(obj)
        .then((res) => {
        modelOptions.value = groupBy(res?.data, 'provider');
        loading.value = false;
    })
        .catch(() => {
        loading.value = false;
    });
}
const model_change = (modelId) => {
    model_id.value = modelId;
    if (modelId) {
        AIModeParamSettingDialogRef.value?.reset_default(modelId);
    }
    else {
        refreshForm({});
    }
};
const openAIParamSettingDialog = () => {
    if (model_id.value) {
        AIModeParamSettingDialogRef.value?.open(model_id.value, '', model_params_setting.value);
    }
};
function refreshForm(data) {
    model_params_setting.value = data;
}
const open = (init_field_list, input_field_list) => {
    dialogVisible.value = true;
    originalUserInput.value = '';
    chatMessages.value = [];
    initFieldList.value = init_field_list || [];
    inputFieldList.value = input_field_list || [];
};
const scrollDiv = ref();
const dialogScrollbar = ref();
const getMaxHeight = () => {
    return dialogScrollbar.value.scrollHeight;
};
/**
 * Handle scroll following
 */
const handleScroll = () => {
    if (scrollDiv.value) {
        // Scrollbar needed when inner height exceeds outer height
        if (scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value?.scrollHeight) {
            // If the current scrollbar distance from the bottom is within the specified range, make the scrollbar follow
            scrollDiv.value.setScrollTop(getMaxHeight());
        }
    }
};
const handleDialogClose = (done) => {
    if (answer.value) {
        // Show popup message
        MsgConfirm(t('common.tip'), t('views.application.generateDialog.exit'), {
            confirmButtonText: t('common.confirm'),
            cancelButtonText: t('common.cancel'),
            distinguishCancelAndClose: true,
        })
            .then(() => {
            // Click confirm, clear state
            stopStreaming();
            chatMessages.value = [];
            fullContent.value = '';
            currentDisplayIndex.value = 0;
            isOutputComplete.value = false;
            done(); // Actually close
        })
            .catch(() => {
            // Click cancel
        });
    }
    else {
        done();
    }
};
// Clean up timer when component unmounts
onUnmounted(() => {
    stopStreaming();
});
watch(answer, () => {
    handleScroll();
}, { deep: true, immediate: true });
onMounted(() => {
    getSelectModel();
});
const __VLS_exposed = {
    open,
};
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
/** @type {__VLS_StyleScopedClasses['el-textarea__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['el-icon']} */ ;
let __VLS_0;
/** @ts-ignore @type { | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog'] | typeof __VLS_components.elDialog | typeof __VLS_components.ElDialog | typeof __VLS_components['el-dialog']} */
elDialog;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    alignCenter: true,
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (true),
    closeOnPressEscape: (true),
    beforeClose: (__VLS_ctx.handleDialogClose),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (true),
    closeOnPressEscape: (true),
    beforeClose: (__VLS_ctx.handleDialogClose),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
{
    const { title: __VLS_7 } = __VLS_3.slots;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex-between" },
    });
    /** @type {__VLS_StyleScopedClasses['flex-between']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.h4, __VLS_intrinsics.h4)({});
    (__VLS_ctx.$t('views.tool.generateCodeDialog.generatePrompt'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mr-4 lighter" },
    });
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.$t('views.application.form.aiModel.label'));
    let __VLS_8;
    /** @ts-ignore @type { | typeof __VLS_components.ModelSelect | typeof __VLS_components.ModelSelect} */
    ModelSelect;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent1(__VLS_8, new __VLS_8({
        ...{ 'onChange': {} },
        ...{ 'onSubmitModel': {} },
        modelValue: (__VLS_ctx.model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
        ...{ style: {} },
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onChange': {} },
        ...{ 'onSubmitModel': {} },
        modelValue: (__VLS_ctx.model_id),
        placeholder: (__VLS_ctx.$t('views.application.form.aiModel.placeholder')),
        options: (__VLS_ctx.modelOptions),
        showFooter: true,
        modelType: ('LLM'),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_13;
    const __VLS_14 = {
        /** @type {typeof __VLS_13.change} */
        onChange: (__VLS_ctx.model_change),
    };
    const __VLS_15 = {
        /** @type {typeof __VLS_13.submitModel} */
        onSubmitModel: (__VLS_ctx.getSelectModel),
    };
    var __VLS_11;
    var __VLS_12;
    let __VLS_16;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent1(__VLS_16, new __VLS_16({
        ...{ 'onClick': {} },
        ...{ class: "ml-8" },
        disabled: (!__VLS_ctx.model_id),
    }));
    const __VLS_18 = __VLS_17({
        ...{ 'onClick': {} },
        ...{ class: "ml-8" },
        disabled: (!__VLS_ctx.model_id),
    }, ...__VLS_functionalComponentArgsRest(__VLS_17));
    let __VLS_21;
    const __VLS_22 = {
        /** @type {typeof __VLS_21.click} */
        onClick: (__VLS_ctx.openAIParamSettingDialog),
    };
    /** @type {__VLS_StyleScopedClasses['ml-8']} */ ;
    const { default: __VLS_23 } = __VLS_19.slots;
    let __VLS_24;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_25 = __VLS_asFunctionalComponent1(__VLS_24, new __VLS_24({}));
    const __VLS_26 = __VLS_25({}, ...__VLS_functionalComponentArgsRest(__VLS_25));
    const { default: __VLS_29 } = __VLS_27.slots;
    let __VLS_30;
    /** @ts-ignore @type { | typeof __VLS_components.Operation} */
    Operation;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent1(__VLS_30, new __VLS_30({}));
    const __VLS_32 = __VLS_31({}, ...__VLS_functionalComponentArgsRest(__VLS_31));
    // @ts-ignore
    [dialogVisible, handleDialogClose, $t, $t, $t, model_id, model_id, modelOptions, model_change, getSelectModel, openAIParamSettingDialog,];
    var __VLS_27;
    // @ts-ignore
    [];
    var __VLS_19;
    var __VLS_20;
    // @ts-ignore
    [];
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "generate-prompt-dialog-bg border-r-8" },
});
/** @type {__VLS_StyleScopedClasses['generate-prompt-dialog-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['border-r-8']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "scrollbar-height" },
});
/** @type {__VLS_StyleScopedClasses['scrollbar-height']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "p-16 pb-0 lighter" },
});
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
/** @type {__VLS_StyleScopedClasses['pb-0']} */ ;
/** @type {__VLS_StyleScopedClasses['lighter']} */ ;
let __VLS_35;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_36 = __VLS_asFunctionalComponent1(__VLS_35, new __VLS_35({
    ref: "scrollDiv",
}));
const __VLS_37 = __VLS_36({
    ref: "scrollDiv",
}, ...__VLS_functionalComponentArgsRest(__VLS_36));
var __VLS_40;
const { default: __VLS_42 } = __VLS_38.slots;
if (__VLS_ctx.answer) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ref: "dialogScrollbar",
        ...{ class: "pre-wrap lighter" },
        ...{ style: {} },
    });
    /** @type {__VLS_StyleScopedClasses['pre-wrap']} */ ;
    /** @type {__VLS_StyleScopedClasses['lighter']} */ ;
    (__VLS_ctx.answer);
}
else if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        shadow: "always",
        ...{ style: {} },
    });
    let __VLS_43;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent1(__VLS_43, new __VLS_43({
        ...{ class: "is-loading color-primary mr-4" },
    }));
    const __VLS_45 = __VLS_44({
        ...{ class: "is-loading color-primary mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_44));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_48 } = __VLS_46.slots;
    let __VLS_49;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent1(__VLS_49, new __VLS_49({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
    // @ts-ignore
    [answer, answer, loading,];
    var __VLS_46;
    (__VLS_ctx.$t('views.application.generateDialog.loading'));
    __VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "dotting" },
    });
    /** @type {__VLS_StyleScopedClasses['dotting']} */ ;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.p, __VLS_intrinsics.p)({
        ...{ class: "flex align-center" },
    });
    /** @type {__VLS_StyleScopedClasses['flex']} */ ;
    /** @type {__VLS_StyleScopedClasses['align-center']} */ ;
    let __VLS_54;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_55 = __VLS_asFunctionalComponent1(__VLS_54, new __VLS_54({
        iconName: "app-generate-star",
        ...{ class: "color-primary mr-4" },
    }));
    const __VLS_56 = __VLS_55({
        iconName: "app-generate-star",
        ...{ class: "color-primary mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_55));
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.tool.generateCodeDialog.title'));
}
// @ts-ignore
[$t, $t,];
var __VLS_38;
if (__VLS_ctx.answer && !__VLS_ctx.loading && !__VLS_ctx.isStreaming && !__VLS_ctx.showContinueButton) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    let __VLS_59;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_60 = __VLS_asFunctionalComponent1(__VLS_59, new __VLS_59({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_61 = __VLS_60({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_60));
    let __VLS_64;
    const __VLS_65 = {
        /** @type {typeof __VLS_64.click} */
        onClick: (() => __VLS_ctx.emit('replace', __VLS_ctx.answer)),
    };
    const { default: __VLS_66 } = __VLS_62.slots;
    (__VLS_ctx.$t('views.application.generateDialog.replace'));
    // @ts-ignore
    [$t, answer, answer, loading, isStreaming, showContinueButton, emit,];
    var __VLS_62;
    var __VLS_63;
    let __VLS_67;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_68 = __VLS_asFunctionalComponent1(__VLS_67, new __VLS_67({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.answer || __VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_69 = __VLS_68({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.answer || __VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_68));
    let __VLS_72;
    const __VLS_73 = {
        /** @type {typeof __VLS_72.click} */
        onClick: (__VLS_ctx.reAnswerClick),
    };
    const { default: __VLS_74 } = __VLS_70.slots;
    (__VLS_ctx.$t('views.application.generateDialog.remake'));
    // @ts-ignore
    [$t, answer, loading, loading, reAnswerClick,];
    var __VLS_70;
    var __VLS_71;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    if (__VLS_ctx.showContinueButton) {
        let __VLS_75;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_76 = __VLS_asFunctionalComponent1(__VLS_75, new __VLS_75({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_77 = __VLS_76({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_76));
        let __VLS_80;
        const __VLS_81 = {
            /** @type {typeof __VLS_80.click} */
            onClick: (__VLS_ctx.continueStreaming),
        };
        const { default: __VLS_82 } = __VLS_78.slots;
        (__VLS_ctx.$t('views.application.generateDialog.continue'));
        // @ts-ignore
        [$t, showContinueButton, continueStreaming,];
        var __VLS_78;
        var __VLS_79;
    }
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "generate-prompt-operate p-16" },
});
/** @type {__VLS_StyleScopedClasses['generate-prompt-operate']} */ ;
/** @type {__VLS_StyleScopedClasses['p-16']} */ ;
if (__VLS_ctx.showStopButton) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "text-center mb-8" },
    });
    /** @type {__VLS_StyleScopedClasses['text-center']} */ ;
    /** @type {__VLS_StyleScopedClasses['mb-8']} */ ;
    let __VLS_83;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_84 = __VLS_asFunctionalComponent1(__VLS_83, new __VLS_83({
        ...{ 'onClick': {} },
        ...{ class: "border-primary video-stop-button" },
    }));
    const __VLS_85 = __VLS_84({
        ...{ 'onClick': {} },
        ...{ class: "border-primary video-stop-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_84));
    let __VLS_88;
    const __VLS_89 = {
        /** @type {typeof __VLS_88.click} */
        onClick: (__VLS_ctx.pauseStreaming),
    };
    /** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['video-stop-button']} */ ;
    const { default: __VLS_90 } = __VLS_86.slots;
    let __VLS_91;
    /** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon | typeof __VLS_components['app-icon'] | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon | typeof __VLS_components['app-icon']} */
    appIcon;
    // @ts-ignore
    const __VLS_92 = __VLS_asFunctionalComponent1(__VLS_91, new __VLS_91({
        iconName: "app-video-stop",
        ...{ class: "mr-8" },
    }));
    const __VLS_93 = __VLS_92({
        iconName: "app-video-stop",
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_92));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.application.generateDialog.stop'));
    // @ts-ignore
    [$t, showStopButton, pauseStreaming,];
    var __VLS_86;
    var __VLS_87;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate-textarea" },
});
/** @type {__VLS_StyleScopedClasses['operate-textarea']} */ ;
let __VLS_96;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_97 = __VLS_asFunctionalComponent1(__VLS_96, new __VLS_96({
    ...{ 'onKeydown': {} },
    ref: "quickInputRef",
    modelValue: (__VLS_ctx.inputValue),
    autosize: ({ minRows: 1, maxRows: 10 }),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.tool.generateCodeDialog.placeholder')),
    maxlength: (100000),
    ...{ class: "chat-operate-textarea" },
}));
const __VLS_98 = __VLS_97({
    ...{ 'onKeydown': {} },
    ref: "quickInputRef",
    modelValue: (__VLS_ctx.inputValue),
    autosize: ({ minRows: 1, maxRows: 10 }),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.tool.generateCodeDialog.placeholder')),
    maxlength: (100000),
    ...{ class: "chat-operate-textarea" },
}, ...__VLS_functionalComponentArgsRest(__VLS_97));
let __VLS_101;
const __VLS_102 = {
    /** @type {typeof __VLS_101.keydown} */
    onKeydown: (...[$event]) => {
        return __VLS_ctx.handleSubmit($event);
        // @ts-ignore
        [$t, inputValue, handleSubmit,];
    },
};
var __VLS_103;
/** @type {__VLS_StyleScopedClasses['chat-operate-textarea']} */ ;
var __VLS_99;
var __VLS_100;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate" },
});
/** @type {__VLS_StyleScopedClasses['operate']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-right" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
let __VLS_105;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent1(__VLS_105, new __VLS_105({
    ...{ 'onClick': {} },
    text: true,
    ...{ class: "sent-button" },
    disabled: (!__VLS_ctx.inputValue.trim() || __VLS_ctx.loading || __VLS_ctx.isStreaming || !__VLS_ctx.model_id),
}));
const __VLS_107 = __VLS_106({
    ...{ 'onClick': {} },
    text: true,
    ...{ class: "sent-button" },
    disabled: (!__VLS_ctx.inputValue.trim() || __VLS_ctx.loading || __VLS_ctx.isStreaming || !__VLS_ctx.model_id),
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
let __VLS_110;
const __VLS_111 = {
    /** @type {typeof __VLS_110.click} */
    onClick: (__VLS_ctx.handleSubmit),
};
/** @type {__VLS_StyleScopedClasses['sent-button']} */ ;
const { default: __VLS_112 } = __VLS_108.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/chat/icon_send.svg",
    alt: "",
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.inputValue.trim() || __VLS_ctx.loading || __VLS_ctx.isStreaming || !__VLS_ctx.model_id) }, null, null);
const __VLS_113 = SendIcon;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent1(__VLS_113, new __VLS_113({}));
const __VLS_115 = __VLS_114({}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.inputValue.trim() && !__VLS_ctx.loading && !__VLS_ctx.isStreaming && __VLS_ctx.model_id) }, null, null);
// @ts-ignore
[model_id, model_id, model_id, loading, loading, loading, isStreaming, isStreaming, isStreaming, inputValue, inputValue, inputValue, handleSubmit,];
var __VLS_108;
var __VLS_109;
const __VLS_118 = AIModeParamSettingDialog;
// @ts-ignore
const __VLS_119 = __VLS_asFunctionalComponent1(__VLS_118, new __VLS_118({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}));
const __VLS_120 = __VLS_119({
    ...{ 'onRefresh': {} },
    ref: "AIModeParamSettingDialogRef",
}, ...__VLS_functionalComponentArgsRest(__VLS_119));
let __VLS_123;
const __VLS_124 = {
    /** @type {typeof __VLS_123.refresh} */
    onRefresh: (__VLS_ctx.refreshForm),
};
var __VLS_125;
var __VLS_121;
var __VLS_122;
// @ts-ignore
[refreshForm,];
var __VLS_3;
// @ts-ignore
var __VLS_41 = __VLS_40, __VLS_104 = __VLS_103, __VLS_126 = __VLS_125;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
