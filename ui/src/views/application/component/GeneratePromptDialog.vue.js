/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/template-helpers.d.ts" />
/// <reference types="../../../../../../../.npm/_npx/2db181330ea4b15b/node_modules/@vue/language-core/types/props-fallback.d.ts" />
import { computed, onUnmounted, reactive, ref, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MsgConfirm } from '@/utils/message';
import { t } from '@/locales';
import systemGeneratePromptAPI from '@/api/system-resource-management/application';
import generatePromptAPI from '@/api/application/application';
import useStore from '@/stores';
import { copyClick } from '@/utils/clipboard';
const emit = defineEmits(['replace']);
const { user } = useStore();
const route = useRoute();
const chatMessages = ref([]);
const apiType = computed(() => {
    if (route.path.includes('resource-management')) {
        return 'systemManage';
    }
    else {
        return 'workspace';
    }
});
// OriginalInput
const originalUserInput = ref('');
const modelID = ref('');
const applicationID = ref('');
const dialogVisible = ref(false);
const inputValue = ref('');
const loading = ref(false);
const promptTemplates = {
    INIT_TEMPLATE: `
Please generate a complete AI role persona template based on user description:

User requirements: {userInput}

Important notes:
1. Role must serve the application core functionality described in "{userInput}"
2. Allow users to adjust and optimize specific parts of the role definition
3. If the user requests modification to a skill or part, make adjustments while maintaining the application theme

Please generate using the format below:

Must strictly follow these rules:
1. **Strictly forbidden to output explanations, prefaces, or extra notes**，Only output the final result.
2. **Strictly use the format below**, Do not omit titles or add extra paragraphs.
3. **If user requests modification to a role part, adjust while maintaining core application functionality**。
4. **If user request is completely unrelated to role generation (e.g., chitchat, other topics), generate a standard role based primarily on application info, but do not completely ignore user input - extract valuable auxiliary info (e.g., domain background, tone style, etc.) as secondary reference**。

# Role:
One-sentence description of the role overview and main responsibilities

## Target：
Work targets of the role; if multiple, list by point, but focus on 1-2 targets

## Core Skills:
### Skills 1: [Skill name, e.g., work recommendation/info query/professional analysis, etc.]
1. [Step 1 - Describe the first specific action step for this skill, including condition checks and process methods]
2. [Step 2 - Describe the second specific action step, including how to get or process information]
3. [Step 3 - Describe the final output step, noting how to present results]

===Reply Example===
- 📋 [Identifier]: <Specific content format notes>
- 🎯 [Identifier]: <Specific content format notes>
- 💡 [Identifier]: <Specific content format notes>
===Example End===

### Skills 2: [SkillsName]
1. [Step 1 - Describe trigger conditions and initial process method]
2. [Step 2 - Describe specific methods for information gathering and deepening process]
3. [Step 3 - Describe specific requirements and format for final output]

### Skills 3: [SkillsName]
- [Core capability description - Note the main function and knowledge basics of this skill]
- [Application method - Describe how to use this skill to provide service, including specific implementation methods]

## Workflow：
1. Describe the first step of the role workflow
2. Describe the second step of the role workflow
3. Describe the third step of the role workflow

## OutputFormat：
If there are specific requirements for the role output format, emphasize and give examples of the desired format here


## Limit：
1. **Strictly Limit Answer Scope**：Only answer questions related to the role definition.
   - If user asks something unrelated to the role, must use the following fixed format reply:
     “Sorry, I can only answer questions related to [Role]. Your question is outside my service scope.”
   - Do not provide any answers unrelated to the role definition.
2. Describe limitation condition 2 that the role must follow during interaction
3. Describe limitation condition 3 that the role must follow during interaction

Output must not contain any explanations or additional notes; only return content matching the above format.
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
    };
    if (apiType.value === 'workspace') {
        generatePromptAPI
            .generate_prompt(workspaceId, modelID.value, applicationID.value, requestData)
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
    else if (apiType.value === 'systemManage') {
        systemGeneratePromptAPI
            .generate_prompt(applicationID.value, modelID.value, requestData)
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
        if (!inputValue.value.trim() || loading.value || isStreaming.value) {
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
const open = (modelId, applicationId) => {
    modelID.value = modelId;
    applicationID.value = applicationId;
    dialogVisible.value = true;
    originalUserInput.value = '';
    chatMessages.value = [];
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
    title: (__VLS_ctx.$t('views.application.generateDialog.generatePrompt')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (true),
    closeOnPressEscape: (true),
    beforeClose: (__VLS_ctx.handleDialogClose),
}));
const __VLS_2 = __VLS_1({
    alignCenter: true,
    title: (__VLS_ctx.$t('views.application.generateDialog.generatePrompt')),
    modelValue: (__VLS_ctx.dialogVisible),
    ...{ style: {} },
    appendToBody: true,
    closeOnClickModal: (true),
    closeOnPressEscape: (true),
    beforeClose: (__VLS_ctx.handleDialogClose),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_5;
const { default: __VLS_6 } = __VLS_3.slots;
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
let __VLS_7;
/** @ts-ignore @type { | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar'] | typeof __VLS_components.elScrollbar | typeof __VLS_components.ElScrollbar | typeof __VLS_components['el-scrollbar']} */
elScrollbar;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent1(__VLS_7, new __VLS_7({
    ref: "scrollDiv",
}));
const __VLS_9 = __VLS_8({
    ref: "scrollDiv",
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
var __VLS_12;
const { default: __VLS_14 } = __VLS_10.slots;
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
    let __VLS_15;
    /** @ts-ignore @type { | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon'] | typeof __VLS_components.elIcon | typeof __VLS_components.ElIcon | typeof __VLS_components['el-icon']} */
    elIcon;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent1(__VLS_15, new __VLS_15({
        ...{ class: "is-loading color-primary mr-4" },
    }));
    const __VLS_17 = __VLS_16({
        ...{ class: "is-loading color-primary mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    /** @type {__VLS_StyleScopedClasses['is-loading']} */ ;
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    const { default: __VLS_20 } = __VLS_18.slots;
    let __VLS_21;
    /** @ts-ignore @type { | typeof __VLS_components.Loading} */
    Loading;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent1(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    // @ts-ignore
    [$t, dialogVisible, handleDialogClose, answer, answer, loading,];
    var __VLS_18;
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
    let __VLS_26;
    /** @ts-ignore @type { | typeof __VLS_components.AppIcon | typeof __VLS_components.AppIcon} */
    AppIcon;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent1(__VLS_26, new __VLS_26({
        iconName: "app-generate-star",
        ...{ class: "color-primary mr-4" },
    }));
    const __VLS_28 = __VLS_27({
        iconName: "app-generate-star",
        ...{ class: "color-primary mr-4" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    /** @type {__VLS_StyleScopedClasses['color-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['mr-4']} */ ;
    (__VLS_ctx.$t('views.application.generateDialog.title'));
}
// @ts-ignore
[$t, $t,];
var __VLS_10;
if (__VLS_ctx.answer && !__VLS_ctx.loading && !__VLS_ctx.isStreaming && !__VLS_ctx.showContinueButton) {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    let __VLS_31;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_32 = __VLS_asFunctionalComponent1(__VLS_31, new __VLS_31({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_33 = __VLS_32({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_32));
    let __VLS_36;
    const __VLS_37 = {
        /** @type {typeof __VLS_36.click} */
        onClick: (() => __VLS_ctx.emit('replace', __VLS_ctx.answer)),
    };
    const { default: __VLS_38 } = __VLS_34.slots;
    (__VLS_ctx.$t('views.application.generateDialog.replace'));
    // @ts-ignore
    [$t, answer, answer, loading, isStreaming, showContinueButton, emit,];
    var __VLS_34;
    var __VLS_35;
    let __VLS_39;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_40 = __VLS_asFunctionalComponent1(__VLS_39, new __VLS_39({
        ...{ 'onClick': {} },
    }));
    const __VLS_41 = __VLS_40({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_40));
    let __VLS_44;
    const __VLS_45 = {
        /** @type {typeof __VLS_44.click} */
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.answer && !__VLS_ctx.loading && !__VLS_ctx.isStreaming && !__VLS_ctx.showContinueButton))
                throw 0;
            return __VLS_ctx.copyClick(__VLS_ctx.answer);
            // @ts-ignore
            [answer, copyClick,];
        },
    };
    const { default: __VLS_46 } = __VLS_42.slots;
    (__VLS_ctx.$t('common.copy'));
    // @ts-ignore
    [$t,];
    var __VLS_42;
    var __VLS_43;
    let __VLS_47;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_48 = __VLS_asFunctionalComponent1(__VLS_47, new __VLS_47({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.answer || __VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }));
    const __VLS_49 = __VLS_48({
        ...{ 'onClick': {} },
        disabled: (!__VLS_ctx.answer || __VLS_ctx.loading),
        loading: (__VLS_ctx.loading),
    }, ...__VLS_functionalComponentArgsRest(__VLS_48));
    let __VLS_52;
    const __VLS_53 = {
        /** @type {typeof __VLS_52.click} */
        onClick: (__VLS_ctx.reAnswerClick),
    };
    const { default: __VLS_54 } = __VLS_50.slots;
    (__VLS_ctx.$t('views.application.generateDialog.remake'));
    // @ts-ignore
    [$t, answer, loading, loading, reAnswerClick,];
    var __VLS_50;
    var __VLS_51;
}
else {
    __VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
        ...{ class: "mt-8" },
    });
    /** @type {__VLS_StyleScopedClasses['mt-8']} */ ;
    if (__VLS_ctx.showContinueButton) {
        let __VLS_55;
        /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
        elButton;
        // @ts-ignore
        const __VLS_56 = __VLS_asFunctionalComponent1(__VLS_55, new __VLS_55({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }));
        const __VLS_57 = __VLS_56({
            ...{ 'onClick': {} },
            type: "primary",
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_56));
        let __VLS_60;
        const __VLS_61 = {
            /** @type {typeof __VLS_60.click} */
            onClick: (__VLS_ctx.continueStreaming),
        };
        const { default: __VLS_62 } = __VLS_58.slots;
        (__VLS_ctx.$t('views.application.generateDialog.continue'));
        // @ts-ignore
        [$t, showContinueButton, continueStreaming,];
        var __VLS_58;
        var __VLS_59;
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
    let __VLS_63;
    /** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
    elButton;
    // @ts-ignore
    const __VLS_64 = __VLS_asFunctionalComponent1(__VLS_63, new __VLS_63({
        ...{ 'onClick': {} },
        ...{ class: "border-primary video-stop-button" },
    }));
    const __VLS_65 = __VLS_64({
        ...{ 'onClick': {} },
        ...{ class: "border-primary video-stop-button" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_64));
    let __VLS_68;
    const __VLS_69 = {
        /** @type {typeof __VLS_68.click} */
        onClick: (__VLS_ctx.pauseStreaming),
    };
    /** @type {__VLS_StyleScopedClasses['border-primary']} */ ;
    /** @type {__VLS_StyleScopedClasses['video-stop-button']} */ ;
    const { default: __VLS_70 } = __VLS_66.slots;
    let __VLS_71;
    /** @ts-ignore @type { | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon | typeof __VLS_components['app-icon'] | typeof __VLS_components.appIcon | typeof __VLS_components.AppIcon | typeof __VLS_components['app-icon']} */
    appIcon;
    // @ts-ignore
    const __VLS_72 = __VLS_asFunctionalComponent1(__VLS_71, new __VLS_71({
        iconName: "app-video-stop",
        ...{ class: "mr-8" },
    }));
    const __VLS_73 = __VLS_72({
        iconName: "app-video-stop",
        ...{ class: "mr-8" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_72));
    /** @type {__VLS_StyleScopedClasses['mr-8']} */ ;
    (__VLS_ctx.$t('views.application.generateDialog.stop'));
    // @ts-ignore
    [$t, showStopButton, pauseStreaming,];
    var __VLS_66;
    var __VLS_67;
}
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate-textarea" },
});
/** @type {__VLS_StyleScopedClasses['operate-textarea']} */ ;
let __VLS_76;
/** @ts-ignore @type { | typeof __VLS_components.elInput | typeof __VLS_components.ElInput | typeof __VLS_components['el-input']} */
elInput;
// @ts-ignore
const __VLS_77 = __VLS_asFunctionalComponent1(__VLS_76, new __VLS_76({
    ...{ 'onKeydown': {} },
    ref: "quickInputRef",
    modelValue: (__VLS_ctx.inputValue),
    autosize: ({ minRows: 1, maxRows: 10 }),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.generateDialog.placeholder')),
    maxlength: (100000),
    ...{ class: "chat-operate-textarea" },
}));
const __VLS_78 = __VLS_77({
    ...{ 'onKeydown': {} },
    ref: "quickInputRef",
    modelValue: (__VLS_ctx.inputValue),
    autosize: ({ minRows: 1, maxRows: 10 }),
    type: "textarea",
    placeholder: (__VLS_ctx.$t('views.application.generateDialog.placeholder')),
    maxlength: (100000),
    ...{ class: "chat-operate-textarea" },
}, ...__VLS_functionalComponentArgsRest(__VLS_77));
let __VLS_81;
const __VLS_82 = {
    /** @type {typeof __VLS_81.keydown} */
    onKeydown: (...[$event]) => {
        return __VLS_ctx.handleSubmit($event);
        // @ts-ignore
        [$t, inputValue, handleSubmit,];
    },
};
var __VLS_83;
/** @type {__VLS_StyleScopedClasses['chat-operate-textarea']} */ ;
var __VLS_79;
var __VLS_80;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "operate" },
});
/** @type {__VLS_StyleScopedClasses['operate']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "text-right" },
});
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
let __VLS_85;
/** @ts-ignore @type { | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button'] | typeof __VLS_components.elButton | typeof __VLS_components.ElButton | typeof __VLS_components['el-button']} */
elButton;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent1(__VLS_85, new __VLS_85({
    ...{ 'onClick': {} },
    text: true,
    ...{ class: "sent-button" },
    disabled: (!__VLS_ctx.inputValue.trim() || __VLS_ctx.loading || __VLS_ctx.isStreaming),
}));
const __VLS_87 = __VLS_86({
    ...{ 'onClick': {} },
    text: true,
    ...{ class: "sent-button" },
    disabled: (!__VLS_ctx.inputValue.trim() || __VLS_ctx.loading || __VLS_ctx.isStreaming),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
let __VLS_90;
const __VLS_91 = {
    /** @type {typeof __VLS_90.click} */
    onClick: (__VLS_ctx.handleSubmit),
};
/** @type {__VLS_StyleScopedClasses['sent-button']} */ ;
const { default: __VLS_92 } = __VLS_88.slots;
__VLS_asFunctionalElement1(__VLS_intrinsics.img)({
    src: "@/assets/chat/icon_send.svg",
    alt: "",
});
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (!__VLS_ctx.inputValue.trim() || __VLS_ctx.loading || __VLS_ctx.isStreaming) }, null, null);
let __VLS_93;
/** @ts-ignore @type { | typeof __VLS_components.SendIcon} */
SendIcon;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent1(__VLS_93, new __VLS_93({}));
const __VLS_95 = __VLS_94({}, ...__VLS_functionalComponentArgsRest(__VLS_94));
__VLS_asFunctionalDirective(__VLS_directives.vShow, {})(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.inputValue.trim() && !__VLS_ctx.loading && !__VLS_ctx.isStreaming) }, null, null);
// @ts-ignore
[loading, loading, loading, isStreaming, isStreaming, isStreaming, inputValue, inputValue, inputValue, handleSubmit,];
var __VLS_88;
var __VLS_89;
// @ts-ignore
[];
var __VLS_3;
// @ts-ignore
var __VLS_13 = __VLS_12, __VLS_84 = __VLS_83;
// @ts-ignore
[];
const __VLS_export = (await import('vue')).defineComponent({
    setup: () => __VLS_exposed,
    emits: {},
});
export default {};
