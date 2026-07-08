<template>
  <el-dialog
    align-center
    :title="$t('views.application.generateDialog.generatePrompt')"
    v-model="dialogVisible"
    style="width: 600px"
    append-to-body
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :before-close="handleDialogClose"
  >
    <div class="generate-prompt-dialog-bg border-r-8">
      <div class="scrollbar-height">
        <!-- GenerateContent -->
        <div class="p-16 pb-0 lighter">
          <el-scrollbar ref="scrollDiv">
            <div
              ref="dialogScrollbar"
              v-if="answer"
              class="pre-wrap lighter"
              style="max-height: calc(100vh - 400px)"
            >
              {{ answer }}
            </div>
            <p v-else-if="loading" shadow="always" style="margin: 0.5rem 0">
              <el-icon class="is-loading color-primary mr-4"><Loading /></el-icon>
              {{ $t('views.application.generateDialog.loading') }}
              <span class="dotting"></span>
            </p>
            <p v-else class="flex align-center">
              <AppIcon iconName="app-generate-star" class="color-primary mr-4"></AppIcon>
              {{ $t('views.application.generateDialog.title') }}
            </p>
          </el-scrollbar>

          <div v-if="answer && !loading && !isStreaming && !showContinueButton" class="mt-8">
            <el-button type="primary" @click="() => emit('replace', answer)">
              {{ $t('views.application.generateDialog.replace') }}
            </el-button>
            <el-button @click="copyClick(answer)">
              {{ $t('common.copy') }}
            </el-button>
            <el-button @click="reAnswerClick" :disabled="!answer || loading" :loading="loading">
              {{ $t('views.application.generateDialog.remake') }}
            </el-button>
          </div>
          <div class="mt-8" v-else>
            <el-button type="primary" v-if="showContinueButton" @click="continueStreaming" link>
              {{ $t('views.application.generateDialog.continue') }}
            </el-button>
          </div>
        </div>

        <!-- TextInputDialog -->

        <div class="generate-prompt-operate p-16">
          <div v-if="showStopButton" class="text-center mb-8">
            <el-button class="border-primary video-stop-button" @click="pauseStreaming">
              <app-icon iconName="app-video-stop" class="mr-8"></app-icon>
              {{ $t('views.application.generateDialog.stop') }}
            </el-button>
          </div>

          <div class="operate-textarea">
            <el-input
              ref="quickInputRef"
              v-model="inputValue"
              :autosize="{ minRows: 1, maxRows: 10 }"
              type="textarea"
              :placeholder="$t('views.application.generateDialog.placeholder')"
              :maxlength="100000"
              class="chat-operate-textarea"
              @keydown.enter="handleSubmit($event)"
            />

            <div class="operate">
              <div class="text-right">
                <el-button
                  text
                  class="sent-button"
                  :disabled="!inputValue.trim() || loading || isStreaming"
                  @click="handleSubmit"
                >
                  <img
                    v-show="!inputValue.trim() || loading || isStreaming"
                    src="@/assets/chat/icon_send.svg"
                    alt=""
                  />
                  <SendIcon v-show="inputValue.trim() && !loading && !isStreaming" />
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MsgConfirm } from '@/utils/message'
import { t } from '@/locales'
import systemGeneratePromptAPI from '@/api/system-resource-management/application'
import generatePromptAPI from '@/api/application/application'
import useStore from '@/stores'
import { copyClick } from '@/utils/clipboard'
const emit = defineEmits(['replace'])
const { user } = useStore()
const route = useRoute()

const chatMessages = ref<Array<any>>([])

const apiType = computed(() => {
  if (route.path.includes('resource-management')) {
    return 'systemManage'
  } else {
    return 'workspace'
  }
})
// OriginalInput
const originalUserInput = ref<string>('')
const modelID = ref('')
const applicationID = ref('')
const dialogVisible = ref(false)
const inputValue = ref<string>('')
const loading = ref<boolean>(false)

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
}

const isStreaming = ref<boolean>(false) // Whether currently streaming output
const isPaused = ref<boolean>(false) // Whether paused
const fullContent = ref<string>('') // Complete content cache
const currentDisplayIndex = ref<number>(0) // Current display character position
let streamTimer: number | null = null // Timer reference
const isOutputComplete = ref<boolean>(false)

// Timer function simulating streaming output
const startStreamingOutput = () => {
  if (streamTimer) {
    clearInterval(streamTimer)
  }

  isStreaming.value = true
  isPaused.value = false

  streamTimer = setInterval(() => {
    if (isApiComplete.value && !isPaused.value) {
      // Update display content
      const currentAnswer = chatMessages.value[chatMessages.value.length - 1]
      if (currentAnswer && currentAnswer.role === 'ai') {
        currentAnswer.content = fullContent.value
      }
      stopStreaming()
      return
    }
    if (!isPaused.value && currentDisplayIndex.value < fullContent.value.length) {
      // Output 1-3 characters each time, simulating real streaming output
      const step = Math.min(3, fullContent.value.length - currentDisplayIndex.value)
      currentDisplayIndex.value += step

      // Update display content
      const currentAnswer = chatMessages.value[chatMessages.value.length - 1]
      if (currentAnswer && currentAnswer.role === 'ai') {
        currentAnswer.content = fullContent.value.substring(0, currentDisplayIndex.value)
      }
    } else if (loading.value === false && currentDisplayIndex.value >= fullContent.value.length) {
      stopStreaming()
    }
  }, 50) as any
}

// Stop streaming output
const stopStreaming = () => {
  if (streamTimer) {
    clearInterval(streamTimer)
    streamTimer = null
  }
  isStreaming.value = false
  isPaused.value = false
  loading.value = false
  isOutputComplete.value = true
}

const showStopButton = computed(() => {
  return isStreaming.value
})

// Pause streaming output
const pauseStreaming = () => {
  isPaused.value = true
  isStreaming.value = false
}

// Continue streaming output
const continueStreaming = () => {
  if (currentDisplayIndex.value < fullContent.value.length) {
    startStreamingOutput()
  }
}

/**
 * Get a recursive function to process streaming data
 * @param chat    Each conversation record
 * @param reader  Stream data
 * @param stream  Whether it is streaming data
 */
const getWrite = (reader: any) => {
  let tempResult = ''
  const middleAnswer = reactive({ content: '', role: 'ai' })
  chatMessages.value.push(middleAnswer)

  // Initialize state and
  fullContent.value = ''
  currentDisplayIndex.value = 0
  isOutputComplete.value = false

  let streamingStarted = false

  /**
   *
   * @param done  Whether ended
   * @param value Value
   */
  const write_stream = ({ done, value }: { done: boolean; value: any }) => {
    try {
      if (done) {
        // Stream data received completely, but timer continues running until all content is displayed
        loading.value = false
        isApiComplete.value = true
        return
      }
      const decoder = new TextDecoder('utf-8')
      let str = decoder.decode(value, { stream: true })
      // Explanation start Because the data stream return is not aligned with backend chunks. We expect chunks as data:{xxx}\n\n but may receive partial chunks like data:{ -> xxx}\n\n. In summary, fetch cannot guarantee each chunk starts with data: and ends with \n\n
      tempResult += str
      const split = tempResult.match(/data:.*}\n\n/g)
      if (split) {
        str = split.join('')
        tempResult = tempResult.replace(str, '')
      } else {
        return reader.read().then(write_stream)
      }
      // Explanation end
      if (str && str.startsWith('data:')) {
        if (split) {
          for (const index in split) {
            const chunk = JSON?.parse(split[index].replace('data:', ''))
            if (chunk.error) {
              loading.value = false
              stopStreaming()
              middleAnswer.content = chunk.error
              return Promise.reject(new Error(chunk.error))
            }
            if (!chunk.is_end) {
              // Add newly received content to the complete content in real time
              fullContent.value += chunk.content
              if (!streamingStarted) {
                streamingStarted = true
                startStreamingOutput()
              }
            }
            if (chunk.is_end) {
              return Promise.resolve()
            }
          }
        }
      }
    } catch (e) {
      loading.value = false
      stopStreaming()
      return Promise.reject(e)
    }
    return reader.read().then(write_stream)
  }

  return write_stream
}
const isApiComplete = ref<boolean>(false)
const answer = computed(() => {
  const result = chatMessages.value[chatMessages.value.length - 1]

  if (result && result.role == 'ai') {
    return result.content
  }
  return ''
})

// Calculate button state
const showContinueButton = computed(() => {
  return (
    !isStreaming.value && isPaused.value && currentDisplayIndex.value < fullContent.value.length
  )
})

function generatePrompt(inputValue: any) {
  isApiComplete.value = false
  loading.value = true
  const workspaceId = user.getWorkspaceId() || 'default'
  chatMessages.value.push({ content: inputValue, role: 'user' })
  const requestData = {
    messages: chatMessages.value,
    prompt: promptTemplates.INIT_TEMPLATE,
  }
  if (apiType.value === 'workspace') {
    generatePromptAPI
      .generate_prompt(workspaceId, modelID.value, applicationID.value, requestData)
      .then((response) => {
        nextTick(() => {
          if (dialogScrollbar.value) {
            // Scroll to the bottom
            scrollDiv.value.setScrollTop(getMaxHeight())
          }
        })
        const reader = response.body.getReader()
        reader.read().then(getWrite(reader))
      })
  } else if (apiType.value === 'systemManage') {
    systemGeneratePromptAPI
      .generate_prompt(applicationID.value, modelID.value, requestData)
      .then((response) => {
        nextTick(() => {
          if (dialogScrollbar.value) {
            // Scroll to the bottom
            scrollDiv.value.setScrollTop(getMaxHeight())
          }
        })
        const reader = response.body.getReader()
        reader.read().then(getWrite(reader))
      })
  }
}

// Re-generate click
const reAnswerClick = () => {
  if (originalUserInput.value) {
    generatePrompt(
      `The previous answer was unsatisfactory. Regarding the original question "${originalUserInput.value}" and based on the conversation record, strictly re-generate following the format standard.`,
    )
  }
}

const quickInputRef = ref()

const handleSubmit = (event?: any) => {
  if (!event?.ctrlKey && !event?.shiftKey && !event?.altKey && !event?.metaKey) {
    // If no modifier key is pressed, block the default event
    event?.preventDefault()
    if (!inputValue.value.trim() || loading.value || isStreaming.value) {
      return
    }
    if (!originalUserInput.value) {
      originalUserInput.value = inputValue.value
    }
    if (isPaused.value || isStreaming.value) {
      return
    }
    if (inputValue.value) {
      generatePrompt(inputValue.value)
      inputValue.value = ''
    }
  } else {
    // If ctrl/shift/cmd/opt + enter is pressed simultaneously, insert a newline
    insertNewlineAtCursor(event)
  }
}
const insertNewlineAtCursor = (event?: any) => {
  const textarea = quickInputRef.value.$el.querySelector(
    '.el-textarea__inner',
  ) as HTMLTextAreaElement
  const startPos = textarea.selectionStart
  const endPos = textarea.selectionEnd
  // Block default behavior (avoid extra newlines)
  event.preventDefault()
  // At cursor, insert newline
  inputValue.value = inputValue.value.slice(0, startPos) + '\n' + inputValue.value.slice(endPos)
  nextTick(() => {
    textarea.setSelectionRange(startPos + 1, startPos + 1) // Position cursor after newline
  })
}

const open = (modelId: string, applicationId: string) => {
  modelID.value = modelId
  applicationID.value = applicationId
  dialogVisible.value = true
  originalUserInput.value = ''
  chatMessages.value = []
}

const scrollDiv = ref()
const dialogScrollbar = ref()

const getMaxHeight = () => {
  return dialogScrollbar.value!.scrollHeight
}

/**
 * Handle scroll following
 */
const handleScroll = () => {
  if (scrollDiv.value) {
    // Scrollbar needed when inner height exceeds outer height
    if (scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value?.scrollHeight) {
      // If the current scrollbar distance from the bottom is within the specified range, make the scrollbar follow
      scrollDiv.value.setScrollTop(getMaxHeight())
    }
  }
}

const handleDialogClose = (done: () => void) => {
  if (answer.value) {
    // Show popup message
    MsgConfirm(t('common.tip'), t('views.application.generateDialog.exit'), {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      distinguishCancelAndClose: true,
    })
      .then(() => {
        // Click confirm, clear state
        stopStreaming()
        chatMessages.value = []
        fullContent.value = ''
        currentDisplayIndex.value = 0
        isOutputComplete.value = false
        done() // Actually close
      })
      .catch(() => {
        // Click cancel
      })
  } else {
    done()
  }
}

// Clean up timer when component unmounts
onUnmounted(() => {
  stopStreaming()
})

watch(
  answer,
  () => {
    handleScroll()
  },
  { deep: true, immediate: true },
)

defineExpose({
  open,
})
</script>

<style lang="scss" scoped>
.generate-prompt-dialog-bg {
  background: var(--dialog-bg-gradient-color);
  overflow: hidden;
  box-sizing: border-box;
}

.generate-prompt-operate {
  position: relative;
  width: 100%;
  box-sizing: border-box;
  z-index: 10;

  :deep(.operate-textarea) {
    box-shadow: 0px 6px 24px 0px rgba(var(--el-text-color-primary-rgb), 0.08);
    background-color: #ffffff;
    border-radius: var(--app-border-radius-large);
    border: 1px solid #ffffff;
    box-sizing: border-box;

    &:has(.el-textarea__inner:focus) {
      border: 1px solid var(--el-color-primary);
    }

    .el-textarea__inner {
      border-radius: var(--app-border-radius-large) !important;
      box-shadow: none;
      resize: none;
      padding: 13px 16px;
      box-sizing: border-box;
      min-height: 47px !important;
      height: 0;
    }

    .operate {
      padding: 6px 10px;

      .el-icon {
        font-size: 20px;
      }

      .sent-button {
        max-height: none;

        .el-icon {
          font-size: 24px;
        }
      }

      .el-loading-spinner {
        margin-top: -15px;

        .circular {
          width: 31px;
          height: 31px;
        }
      }
    }
  }
  .video-stop-button {
    box-shadow: 0px 6px 24px 0px rgba(var(--el-text-color-primary-rgb), 0.08);

    &:hover {
      background: #ffffff;
    }
  }
}
</style>
