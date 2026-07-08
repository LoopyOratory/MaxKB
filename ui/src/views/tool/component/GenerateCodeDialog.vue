<template>
  <el-dialog
    align-center
    v-model="dialogVisible"
    style="width: 800px"
    append-to-body
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :before-close="handleDialogClose"
  >
    <template #title>
      <div class="flex-between">
        <h4>{{ $t('views.tool.generateCodeDialog.generatePrompt') }}</h4>
        <div class="flex align-center">
          <div class="mr-4 lighter">{{ $t('views.application.form.aiModel.label') }}</div>
          <ModelSelect
            v-model="model_id"
            :placeholder="$t('views.application.form.aiModel.placeholder')"
            :options="modelOptions"
            @change="model_change"
            @submitModel="getSelectModel"
            showFooter
            :model-type="'LLM'"
            style="width: 200px"
          >
          </ModelSelect>
          <el-button class="ml-8" @click="openAIParamSettingDialog" :disabled="!model_id">
            <el-icon>
              <Operation />
            </el-icon>
          </el-button>
        </div>
      </div>
    </template>
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
              <el-icon class="is-loading color-primary mr-4">
                <Loading />
              </el-icon>
              {{ $t('views.application.generateDialog.loading') }}
              <span class="dotting"></span>
            </p>
            <p v-else class="flex align-center">
              <AppIcon iconName="app-generate-star" class="color-primary mr-4"></AppIcon>
              {{ $t('views.tool.generateCodeDialog.title') }}
            </p>
          </el-scrollbar>

          <div v-if="answer && !loading && !isStreaming && !showContinueButton" class="mt-8">
            <el-button type="primary" @click="() => emit('replace', answer)">
              {{ $t('views.application.generateDialog.replace') }}
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
              :placeholder="$t('views.tool.generateCodeDialog.placeholder')"
              :maxlength="100000"
              class="chat-operate-textarea"
              @keydown.enter="handleSubmit($event)"
            />

            <div class="operate">
              <div class="text-right">
                <el-button
                  text
                  class="sent-button"
                  :disabled="!inputValue.trim() || loading || isStreaming || !model_id"
                  @click="handleSubmit"
                >
                  <img
                    v-show="!inputValue.trim() || loading || isStreaming || !model_id"
                    src="@/assets/chat/icon_send.svg"
                    alt=""
                  />
                  <SendIcon v-show="inputValue.trim() && !loading && !isStreaming && model_id" />
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AIModeParamSettingDialog ref="AIModeParamSettingDialogRef" @refresh="refreshForm" />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MsgConfirm } from '@/utils/message'
import { t } from '@/locales'
import useStore from '@/stores'
import { copyClick } from '@/utils/clipboard'
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts'
import { groupBy } from 'lodash'
import AIModeParamSettingDialog from '@/views/application/component/AIModeParamSettingDialog.vue'
import SendIcon from '@/components/logo/SendIcon.vue'

const emit = defineEmits(['replace'])
const { user } = useStore()
const route = useRoute()

const chatMessages = ref<Array<any>>([])

const apiType = computed(() => {
  if (route.path.includes('shared')) {
    return 'systemShare'
  } else if (route.path.includes('resource-management')) {
    return 'systemManage'
  } else {
    return 'workspace'
  }
})
// OriginalInput
const originalUserInput = ref<string>('')
const dialogVisible = ref(false)
const inputValue = ref<string>('')
const loading = ref<boolean>(false)
const modelOptions = ref<any>(null)
const inputFieldList = ref<Array<any>>([])
const initFieldList = ref<Array<any>>([])
const AIModeParamSettingDialogRef = ref<InstanceType<typeof AIModeParamSettingDialog>>()
const model_id = ref('')
const model_params_setting = ref({})

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
    init_field_list: initFieldList.value,
    input_field_list: inputFieldList.value,
    model_id: model_id.value,
    model_params_setting: model_params_setting.value,
  }

  loadSharedApi({ type: 'tool', systemType: apiType.value })
    .generateCode(requestData)
    .then((response: any) => {
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
    if (!inputValue.value.trim() || loading.value || isStreaming.value || !model_id.value) {
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

function getSelectModel() {
  loading.value = true

  const obj =
    apiType.value === 'systemManage'
      ? {
          model_type: 'LLM',
          // todo workspace_id
          workspace_id: '',
        }
      : {
          model_type: 'LLM',
        }
  loadSharedApi({ type: 'model', systemType: apiType.value })
    .getSelectModelList(obj)
    .then((res: any) => {
      modelOptions.value = groupBy(res?.data, 'provider')
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

const model_change = (modelId: string) => {
  model_id.value = modelId
  if (modelId) {
    AIModeParamSettingDialogRef.value?.reset_default(modelId)
  } else {
    refreshForm({})
  }
}

const openAIParamSettingDialog = () => {
  if (model_id.value) {
    AIModeParamSettingDialogRef.value?.open(model_id.value, '', model_params_setting.value)
  }
}

function refreshForm(data: any) {
  model_params_setting.value = data
}

const open = (init_field_list: any, input_field_list: any) => {
  dialogVisible.value = true
  originalUserInput.value = ''
  chatMessages.value = []
  initFieldList.value = init_field_list || []
  inputFieldList.value = input_field_list || []
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

onMounted(() => {
  getSelectModel()
})

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
