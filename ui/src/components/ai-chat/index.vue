<template>
  <div
    ref="aiChatRef"
    class="ai-chat"
    :class="type"
    :style="{
      height: firsUserInput ? '100%' : undefined,
    }"
  >
    <div v-if="showUserInputContent && firsUserInput" class="firstUserInput">
      <UserForm
        v-model:api_form_data="api_form_data"
        v-model:form_data="form_data"
        :excludeFields="inlineExposedFields"
        :title="
          applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
          applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
            ?.user_input_config?.title
        "
        :application="applicationDetails"
        :type="type"
        :first="firsUserInput"
        @confirm="UserFormConfirm"
        @cancel="UserFormCancel"
        ref="userFormRef"
      />
    </div>
    <div v-if="!firsUserInput && isNarrow" v-show="showUserInputContent" class="popperUserInput">
      <UserForm
        v-model:api_form_data="api_form_data"
        v-model:form_data="form_data"
        :excludeFields="inlineExposedFields"
        :title="
          applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
          applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
            ?.user_input_config?.title
        "
        :application="applicationDetails"
        :type="type"
        :first="firsUserInput"
        @confirm="UserFormConfirm"
        @cancel="UserFormCancel"
        ref="userFormRef"
      />
    </div>
    <el-popover
      v-if="!firsUserInput && !isNarrow"
      :visible="showUserInput"
      @update:visible="
        (v: boolean) => {
          if (v) showUserInput = true
        }
      "
      :virtual-ref="triggerEl"
      virtual-triggering
      trigger="manual"
      placement="top-start"
      :width="400"
      :show-arrow="false"
      popper-class="bare-popper"
      :popper-options="{
        modifiers: [{ name: 'offset', options: { offset: [-24, -8] } }],
      }"
      :popper-style="{
        background: 'transparent',
        border: 'none',
        padding: '0',
        boxShadow: 'none',
      }"
    >
      <UserForm
        v-model:api_form_data="api_form_data"
        v-model:form_data="form_data"
        :excludeFields="inlineExposedFields"
        :title="
          applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
            ?.user_input_field_list_setting?.menu_title ||
          applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
            ?.user_input_config?.title
        "
        :application="applicationDetails"
        :type="type"
        :first="firsUserInput"
        @confirm="UserFormConfirm"
        @cancel="UserFormCancel"
        ref="userFormRef"
      />
    </el-popover>
    <template v-if="!(isUserInput || isAPIInput) || !firsUserInput || type === 'log'">
      <el-scrollbar ref="scrollDiv" @scroll="handleScrollTop">
        <div
          ref="dialogScrollbar"
          class="ai-chat__content p-16"
          id="chatListId"
          :style="{ marginBottom: selection ? '65px' : '' }"
        >
          <PrologueContent
            :type="type"
            :application="applicationDetails"
            :available="available"
            :send-message="sendMessage"
            v-if="!selection"
          ></PrologueContent>
          <el-checkbox-group v-model="multipleSelectionChat" @change="handleCheckedChatChange">
            <template v-for="(item, index) in chatList" :key="index">
              <div class="flex-between w-full">
                <el-checkbox :value="item.record_id" v-if="selection" />
                <div
                  class="w-full border-r-8"
                  :class="[
                    selection ? 'p-12 mt-8 mb-8 cursor' : 'mt-24',
                    multipleSelectionChat.includes(item.record_id) ? 'is-selected' : '',
                  ]"
                  @click="toggleSelect(item.record_id)"
                >
                  <!-- Question -->
                  <QuestionContent
                    :chat-management="ChatManagement"
                    :type="type"
                    :application="applicationDetails"
                    :send-message="sendMessage"
                    :chat-record="item"
                    :is-last="index >= chatList.length - 1"
                    :selection="selection"
                  ></QuestionContent>
                </div>
              </div>
              <div class="flex align-center w-full">
                <el-checkbox :value="item.record_id" v-if="selection" />
                <div
                  class="w-full border-r-8"
                  :class="[
                    selection ? 'p-12 cursor' : '',
                    multipleSelectionChat.includes(item.record_id) ? 'is-selected' : '',
                  ]"
                  @click="toggleSelect(item.record_id)"
                >
                  <!-- Answer -->
                  <AnswerContent
                    :application="applicationDetails"
                    :loading="currentChatGenerating"
                    v-model:chat-record="chatList[index]"
                    :type="type"
                    :send-message="sendMessage"
                    :chat-management="ChatManagement"
                    :executionIsRightPanel="props.executionIsRightPanel"
                    @open-execution-detail="emit('openExecutionDetail', chatList[index])"
                    @openParagraph="emit('openParagraph', chatList[index])"
                    @openParagraphDocument="
                      (val: any) => emit('openParagraphDocument', chatList[index], val)
                    "
                    :selection="selection"
                  ></AnswerContent>
                </div>
              </div>
            </template>
          </el-checkbox-group>
          <TransitionContent
            v-if="transcribing"
            :text="t('aiChat.inputPlaceholder.recorderLoading')"
            :type="type"
            :application="applicationDetails"
          >
          </TransitionContent>
        </div>
      </el-scrollbar>
      <div style="position: relative">
        <!-- Scroll to bottom button -->
        <el-button v-if="isBottom" circle class="back-bottom-button" @click="setScrollBottom">
          <el-icon>
            <ArrowDownBold />
          </el-icon>
        </el-button>
        <div class="mul-operation border-t w-full" v-if="selection === true">
          <div class="flex-between chat-width">
            <el-checkbox v-model="checkAll" @change="handleCheckAllChange">
              {{ $t('common.allCheck') }}
            </el-checkbox>
            <div>
              <el-button @click="cancelCheckHandle">
                {{ $t('common.cancel') }}
              </el-button>
              <el-button
                type="primary"
                @click="shareChatHandle"
                :disabled="shareLoading || multipleSelectionChat.length === 0"
              >
                {{ $t('aiChat.copyLinkText') }}
              </el-button>
            </div>
          </div>
        </div>
        <ChatInputOperate
          :app-id="appId"
          :application-details="applicationDetails"
          :is-mobile="isMobile"
          :type="type"
          :send-message="sendMessage"
          :open-chat-id="openChatId"
          :validate="validate"
          :chat-management="ChatManagement"
          v-model:chat-id="chartOpenId"
          :loading="currentChatGenerating"
          v-model:show-user-input="showUserInput"
          v-else-if="type !== 'log' && type !== 'share'"
        >
          <template #inlineParams>
            <InlineParams
              ref="inlineParamsRef"
              :application="applicationDetails"
              :maxExposed="maxExposed"
              v-model:form-data="form_data"
              :apiInput="isAPIInput"
              @openDialog="handleOpenDialog"
            >
            </InlineParams>
          </template>
        </ChatInputOperate>
      </div>
      <Control></Control>
    </template>
  </div>
</template>
<script setup lang="ts">
import {
  type Ref,
  ref,
  nextTick,
  computed,
  watch,
  reactive,
  onMounted,
  onBeforeUnmount,
  provide,
  onBeforeMount,
} from 'vue'
import { useRoute } from 'vue-router'
import applicationApi from '@/api/application/application'
import chatAPI from '@/api/chat/chat'
import SystemResourceManagementApplicationAPI from '@/api/system-resource-management/application.ts'
import syetrmResourceManagementChatLogApi from '@/api/system-resource-management/chat-log'
import chatLogApi from '@/api/application/chat-log'
import { ChatManagement, type chatType } from '@/api/type/application'
import { randomId } from '@/utils/common'
import useStore from '@/stores'
import { debounce } from 'lodash'
import { useElementSize } from '@vueuse/core'
import AnswerContent from '@/components/ai-chat/component/answer-content/index.vue'
import QuestionContent from '@/components/ai-chat/component/question-content/index.vue'
import TransitionContent from '@/components/ai-chat/component/transition-content/index.vue'
import ChatInputOperate from '@/components/ai-chat/component/chat-input-operate/index.vue'
import PrologueContent from '@/components/ai-chat/component/prologue-content/index.vue'
import UserForm from '@/components/ai-chat/component/user-form/index.vue'
import Control from '@/components/ai-chat/component/control/index.vue'
import type { CheckboxValueType } from 'element-plus'
import { t } from '@/locales'
import bus from '@/bus'
import { throttle } from 'lodash-es'
import { copyClick } from '@/utils/clipboard'
import { loadSharedApi } from '@/utils/dynamics-api/shared-api'
import { getWrite } from '@/utils/chat'
import InlineParams from '@/components/ai-chat/component/inline-params/index.vue'

provide('upload', (file: any, loading?: Ref<boolean>) => {
  return props.type === 'debug-ai-chat'
    ? applicationApi.postUploadFile(file, 'TEMPORARY_120_MINUTE', 'TEMPORARY_120_MINUTE', loading)
    : chatAPI.postUploadFile(file, chartOpenId.value, 'CHAT', loading)
})
provide('getSelectModelList', (params: any) => {
  if (route.path.includes('resource-management')) {
    return loadSharedApi({ type: 'model', systemType: 'systemManage' }).getSelectModelList(params)
  } else {
    return loadSharedApi({ type: 'model', systemType: 'workspace' }).getSelectModelList(params)
  }
})
provide('chatUserProfile', () => {
  if (props.type === 'ai-chat') {
    if (chatUser.chat_profile?.authentication_type === 'login') {
      return chatUser.getChatUserProfile()
    }
  }
  return Promise.resolve(null)
})

const transcribing = ref<boolean>(false)
defineOptions({ name: 'AiChat' })
const route = useRoute()
const {
  params: { accessToken, id },
  query: { mode },
} = route as any
const props = withDefaults(
  defineProps<{
    applicationDetails: any
    type?: 'log' | 'ai-chat' | 'debug-ai-chat' | 'share'
    appId?: string
    record?: Array<chatType>
    available?: boolean
    chatId?: string
    executionIsRightPanel?: boolean
    chatRecord: chatType
    selection?: boolean
  }>(),
  {
    applicationDetails: () => ({}),
    available: true,
    type: 'ai-chat',
  },
)
const emit = defineEmits([
  'refresh',
  'openChat',
  'scroll',
  'openExecutionDetail',
  'openParagraph',
  'openParagraphDocument',
  'update:selection',
])
const { application, common, chatUser } = useStore()

const aiChatRef = ref()
const { width: rootWidth } = useElementSize(aiChatRef)

const isMobile = computed(() => {
  return common.isMobile() || mode === 'embed' || mode === 'mobile'
})

const isNarrow = computed(() => rootWidth.value > 0 && rootWidth.value < 768)

const maxExposed = computed(() => (isNarrow.value ? 1 : 3))
const inlineExposedFields = computed<string[]>(() =>
  (
    props.applicationDetails?.work_flow?.nodes?.find((v: any) => v.id === 'base-node')?.properties
      ?.user_input_field_list_setting?.exposed_fields || []
  ).slice(0, maxExposed.value),
)

const triggerEl = computed<HTMLElement | undefined>(() => {
  const btn = inlineParamsRef.value?.triggerBtnRef as any
  return btn?.$el ?? btn
})

const scrollDiv = ref()
const dialogScrollbar = ref()
const loading = ref(false)
const inputValue = ref<string>('')
const chartOpenId = ref<string>('')
const chatList = ref<any[]>([])
// Whether the currently viewed conversation has in-flight messages (still streaming)。
// Use it to drive "Stop Answer" button, input disable, send intercept, replacing component-level global loading,
// So other background conversations streaming won't lock the current conversation's input bar。
const currentChatGenerating = computed(() =>
  chatList.value.some((c) => c && c.write_ed === false && c.is_stop !== true),
)
const form_data = ref<any>({})
const api_form_data = ref<any>({})
const userFormRef = ref<InstanceType<typeof UserForm>>()
// User input
const firsUserInput = ref(false)
const showUserInput = ref(false)

// Initial form data (for recovery)
const initialFormData = ref({})
const initialApiFormData = ref({})

const inlineParamsRef = ref<InstanceType<typeof InlineParams>>()

const isUserInput = computed(
  () =>
    props.applicationDetails?.work_flow?.nodes?.filter((v: any) => v.id === 'base-node')[0]
      ?.properties.user_input_field_list.length > 0,
)

const userInputTitle = computed(
  () =>
    props.applicationDetails.work_flow?.nodes?.filter((v: any) => v.id === 'base-node')[0]
      ?.properties?.user_input_config?.title,
)
const isAPIInput = computed(
  () =>
    props.type === 'debug-ai-chat' &&
    props.applicationDetails.work_flow?.nodes?.filter((v: any) => v.id === 'base-node')[0]
      .properties.api_input_field_list.length > 0,
)
const showUserInputContent = computed(() => {
  return (
    (((isUserInput.value || isAPIInput.value) && firsUserInput.value) || showUserInput.value) &&
    props.type !== 'log'
  )
})
watch(
  () => props.chatId,
  (val) => {
    if (val && val !== 'new') {
      chartOpenId.value = val
      firsUserInput.value = false
    } else {
      chartOpenId.value = ''
    }
  },
  { deep: true, immediate: true },
)

watch(
  () => props.applicationDetails,
  () => {
    chartOpenId.value = ''
  },
  { deep: true },
)

watch(
  () => props.record,
  (value) => {
    chatList.value = value ? value : []
  },
  {
    immediate: true,
  },
)

// Select conversation share
const checkAll = ref(false)
const multipleSelectionChat = ref<any[]>([])
const shareLoading = ref(false)

watch(
  () => props.selection,
  (value) => {
    if (value) {
      if (value && multipleSelectionChat.value.length === 0) {
        multipleSelectionChat.value = chatList.value.map((v) => v.record_id)
        checkAll.value = true
      }
    } else {
      checkAll.value = false
      multipleSelectionChat.value = []
    }
  },
  {
    immediate: true,
  },
)

function shareChatHandle() {
  const validIds = new Set(chatList.value.map((v) => v.record_id))
  const selectedIds = multipleSelectionChat.value.filter((id) => validIds.has(id))

  const obj = {
    chat_record_ids: selectedIds,
    is_current_all: checkAll.value,
  }
  chatAPI.postShareChat(id || props.appId, chartOpenId.value, obj, shareLoading).then((res) => {
    if (res.data?.link) {
      copyClick(window.location.origin + '/chat/share/' + res.data.link)
    }
  })
}

const handleCheckAllChange = (val: CheckboxValueType) => {
  multipleSelectionChat.value = val ? chatList.value.map((v) => v.record_id) : []
  checkAll.value = val as boolean
}
const handleCheckedChatChange = (value: CheckboxValueType[]) => {
  const checkedCount = value.length
  checkAll.value = checkedCount === chatList.value.length
}

function toggleSelect(id: number) {
  if (props.selection) {
    const index = multipleSelectionChat.value.indexOf(id)
    if (index === -1) {
      multipleSelectionChat.value.push(id)
    } else {
      multipleSelectionChat.value.splice(index, 1)
    }
    checkAll.value = multipleSelectionChat.value.length === chatList.value.length
  }
}

const handleOpenDialog = () => {
  showUserInput.value = true
  initialFormData.value = JSON.parse(JSON.stringify(form_data.value))
  initialApiFormData.value = JSON.parse(JSON.stringify(api_form_data.value))
}

function cancelCheckHandle() {
  checkAll.value = false
  multipleSelectionChat.value = []
  emit('update:selection', false)
}

const toggleUserInput = () => {
  showUserInput.value = !showUserInput.value
  if (showUserInput.value) {
    // Save current data as initial data (for potential recovery)
    initialFormData.value = JSON.parse(JSON.stringify(form_data.value))
    initialApiFormData.value = JSON.parse(JSON.stringify(api_form_data.value))
  }
}

function UserFormConfirm() {
  firsUserInput.value = false
  showUserInput.value = false
}

function UserFormCancel() {
  // Restore initial data
  form_data.value = JSON.parse(JSON.stringify(initialFormData.value))
  api_form_data.value = JSON.parse(JSON.stringify(initialApiFormData.value))
  userFormRef.value?.render(form_data.value)
  showUserInput.value = false
}

const validate = () => {
  return inlineParamsRef.value?.validate() || Promise.resolve(true)
}

function sendMessage(val: string, other_params_data?: any, chat?: chatType): Promise<boolean> {
  if (isUserInput.value) {
    if (userFormRef.value) {
      return userFormRef.value
        ?.validate()
        .then((ok) => {
          const userFormData = accessToken
            ? JSON.parse(localStorage.getItem(`${accessToken}userForm`) || '{}')
            : {}
          const newData = Object.keys(form_data.value).reduce((result: any, key: string) => {
            result[key] = Object.prototype.hasOwnProperty.call(userFormData, key)
              ? userFormData[key]
              : form_data.value[key]
            return result
          }, {})
          if (accessToken) {
            localStorage.setItem(`${accessToken}userForm`, JSON.stringify(newData))
          }

          showUserInput.value = false

          if (!currentChatGenerating.value && props.applicationDetails?.name) {
            handleDebounceClick(val, other_params_data, chat)
            return true
          }
          throw 'err: no send'
        })
        .catch((e) => {
          if (isAPIInput.value && props.type !== 'debug-ai-chat') {
            showUserInput.value = false
          } else {
            showUserInput.value = true
          }

          return false
        })
    } else {
      return Promise.reject(false)
    }
  } else {
    showUserInput.value = false
    if (!currentChatGenerating.value && props.applicationDetails?.name) {
      handleDebounceClick(val, other_params_data, chat)
      return Promise.resolve(true)
    }
    return Promise.reject(false)
  }
}

const handleDebounceClick = debounce((val, other_params_data?: any, chat?: chatType) => {
  chatMessage(chat, val, false, other_params_data)
}, 200)

/**
 * Open conversation id
 */
const openChatId: () => Promise<string> = () => {
  const obj = props.applicationDetails
  return getOpenChatAPI()(obj.id)
    .then((res) => {
      chartOpenId.value = res.data
      return res.data
    })
    .catch((res) => {
      return Promise.reject(res)
    })
}

const getChatMessageAPI = () => {
  if (props.type === 'debug-ai-chat') {
    return applicationApi.chat
  } else {
    return chatAPI.chat
  }
}
const getOpenChatAPI = () => {
  if (props.type === 'debug-ai-chat') {
    if (route.path.includes('resource-management')) {
      return SystemResourceManagementApplicationAPI.open
    } else {
      return applicationApi.open
    }
  } else {
    return (a?: string, loading?: Ref<boolean>) => {
      return chatAPI.open(loading)
    }
  }
}

const getChatRecordDetailsAPI = (row: any) => {
  if (row.record_id) {
    if (props.type === 'debug-ai-chat') {
      if (route.path.includes('resource-management')) {
        return syetrmResourceManagementChatLogApi.getChatRecordDetails(
          id || props.appId,
          row.chat_id,
          row.record_id,
          loading,
        )
      } else {
        return chatLogApi.getChatRecordDetails(
          id || props.appId,
          row.chat_id,
          row.record_id,
          loading,
        )
      }
    } else {
      return chatAPI.getChatRecord(row.chat_id, row.record_id, loading)
    }
  }
  return Promise.reject('404')
}

/**
 * Get conversation details
 * @param row
 */
function getSourceDetail(row: any) {
  return getChatRecordDetailsAPI(row).then((res) => {
    const exclude_keys = ['answer_text', 'id', 'answer_text_list']
    Object.keys(res.data).forEach((key) => {
      if (!exclude_keys.includes(key)) {
        row[key] = res.data[key]
      }
    })
  })
}

/**
 * Conversation
 */
function getChartOpenId(chat?: any, problem?: string, re_chat?: boolean, other_params_data?: any) {
  return openChatId().then(() => {
    chatMessage(chat, problem, re_chat, other_params_data)
  })
}

const errorWrite = (chat: any, message?: string) => {
  ChatManagement.addChatRecord(chat, 50, loading)
  ChatManagement.write(chat.id)
  ChatManagement.append(chat.id, message || t('aiChat.tip.error500Message'))
  ChatManagement.updateStatus(chat.id, 500)
  ChatManagement.close(chat.id)
}

// Stop"CurrentCurrently viewingSession"In-flightMessage。
// Only affects chatList (current conversation); won't impact other running conversations in the background。
const stopGenerating = () => {
  chatList.value.forEach((c) => {
    if (c && c.write_ed === false && c.is_stop !== true) {
      ChatManagement.stop(c.id)
    }
  })
}

// Save uploaded file list

function chatMessage(chat?: any, problem?: string, re_chat?: boolean, other_params_data?: any) {
  loading.value = true
  if (!chat) {
    chat = reactive({
      id: randomId(),
      problem_text: problem ? problem : inputValue.value.trim(),
      answer_text: '',
      answer_text_list: [[]],
      currentNodeName: '',
      buffer: [],
      reasoning_content: '',
      reasoning_content_buffer: [],
      write_ed: false,
      is_stop: false,
      record_id: '',
      chat_id: '',
      vote_status: '-1',
      status: undefined,
      upload_meta: {
        image_list:
          other_params_data && other_params_data.image_list ? other_params_data.image_list : [],
        document_list:
          other_params_data && other_params_data.document_list
            ? other_params_data.document_list
            : [],
        audio_list:
          other_params_data && other_params_data.audio_list ? other_params_data.audio_list : [],
        video_list:
          other_params_data && other_params_data.video_list ? other_params_data.video_list : [],
        other_list:
          other_params_data && other_params_data.other_list ? other_params_data.other_list : [],
      },
    })
    chatList.value.push(chat)
    ChatManagement.addChatRecord(chat, 50, loading)
    ChatManagement.write(chat.id)
    inputValue.value = ''
    nextTick(() => {
      // Scroll to the bottom
      scrollDiv.value.setScrollTop(getMaxHeight())
    })
  }
  if (chat.run_time) {
    ChatManagement.addChatRecord(chat, 50, loading)
    ChatManagement.write(chat.id)
  }
  if (!chartOpenId.value) {
    getChartOpenId(chat, problem, re_chat, other_params_data).catch(() => {
      errorWrite(chat)
    })
  } else {
    const obj = {
      message: chat.problem_text,
      stream: true,
      re_chat: re_chat || false,
      ...other_params_data,
      form_data: {
        ...form_data.value,
        ...api_form_data.value,
      },
    }

    if (other_params_data && other_params_data.form_data) {
      obj.form_data = { ...obj.form_data, ...other_params_data.form_data }
    }
    // Conversation
    getChatMessageAPI()(chartOpenId.value, obj)
      .then((response) => {
        if (response.status === 460) {
          return Promise.reject(t('aiChat.tip.errorIdentifyMessage'))
        } else if (response.status === 461) {
          return Promise.reject(t('aiChat.tip.errorLimitMessage'))
        } else {
          // New conversation: backend has already executed set_chat to create Chat row (before streaming),
          // Notify parent to add new conversation to history list, so you can switch away during a long streaming answer and come back to continue
          if (props.chatId === 'new') {
            emit('openChat', chartOpenId.value)
          }
          nextTick(() => {
            // Scroll to the bottom
            scrollDiv.value.setScrollTop(getMaxHeight())
          })
          const reader = response.body.getReader()
          // Process stream data
          const write = getWrite(
            chat,
            reader,
            response.headers.get('Content-Type') !== 'application/json',
          )
          return write()
        }
      })
      .then(() => {
        if (props.chatId === 'new') {
          emit('refresh', chartOpenId.value)
        }
        getSourceDetail(chat)
        // if (props.type === 'debug-ai-chat') {
        //   getSourceDetail(chat)
        // } else {
        //   if (
        //     props.applicationDetails &&
        //     (props.applicationDetails.show_exec || props.applicationDetails.show_source)
        //   ) {
        //     getSourceDetail(chat)
        //   }
        // }
      })
      .finally(() => {
        ChatManagement.close(chat.id)
      })
      .catch((e: any) => {
        errorWrite(chat, e + '')
      })
  }
}

/**
 * Scrollbar distance from top
 */
const scrollTop = ref(0)

const scorll = ref(true)
const isBottom = ref(false)

const getMaxHeight = () => {
  return dialogScrollbar.value!.scrollHeight
}

/**
 * Scroll to the top
 * @param $event
 */
const handleScrollTop = ($event: any) => {
  scrollTop.value = $event.scrollTop
  if (
    dialogScrollbar.value.scrollHeight - (scrollTop.value + scrollDiv.value.wrapRef.offsetHeight) <=
    40
  ) {
    scorll.value = true
  } else {
    scorll.value = false
  }
  isBottom.value =
    scrollTop.value + scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value!.scrollHeight
  emit('scroll', { ...$event, dialogScrollbar: dialogScrollbar.value, scrollDiv: scrollDiv.value })
}
/**
 * Handle scroll following
 */
const handleScroll = () => {
  if (props.type !== 'log' && scrollDiv.value) {
    // Scrollbar needed when inner height exceeds outer height
    if (scrollDiv.value.wrapRef.offsetHeight < dialogScrollbar.value.scrollHeight) {
      // Only auto-scroll to bottom when user is near the bottom
      const isNearBottom =
        dialogScrollbar.value.scrollHeight -
          (scrollTop.value + scrollDiv.value.wrapRef.offsetHeight) <=
        40
      if (scorll.value || isNearBottom) {
        // Scroll to bottom
        scrollDiv.value.setScrollTop(dialogScrollbar.value.scrollHeight)
      }
    }
  }
}

function parseTransform(transformStr: string) {
  const result = { scale: 1, translateX: 0, translateY: 0, translateZ: 0 }

  if (!transformStr || transformStr === 'none') return result

  // Use regex to match scale and translate3d values
  const scaleMatch = transformStr.match(/scale\(([^)]+)\)/)
  const translateMatch = transformStr.match(/translate3d\(([^)]+)\)/)

  if (scaleMatch) {
    // Scale may be one value or two values (scaleX, scaleY)
    const scaleValues = scaleMatch[1].split(',').map((v) => parseFloat(v.trim()))
    result.scale = scaleValues[0]
  }

  if (translateMatch) {
    const translateValues = translateMatch[1].split(',').map((v) => parseFloat(v.trim()))
    ;[result.translateX, result.translateY, result.translateZ] = translateValues
  }

  return result
}

onMounted(() => {
  if (isUserInput.value && localStorage.getItem(`${accessToken}userForm`)) {
    const userFormData = JSON.parse(localStorage.getItem(`${accessToken}userForm`) || '{}')
    form_data.value = userFormData
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }

  const handleZoom = throttle((event: WheelEvent, target: HTMLElement) => {
    // 2. Parse current transform state
    const currentTransform = target.style.transform
    const transformValues = parseTransform(currentTransform)
    const { scale, translateX, translateY } = transformValues
    // Ensure scale is numeric type
    const currentScale = Array.isArray(scale) ? scale[0] : scale

    // 3. Calculate zoom direction and new zoom ratio
    const zoomIntensity = 0.05 // Zoom step per scroll wheel event
    const zoomFactor = event.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity
    const newScale = Math.max(0.1, currentScale * zoomFactor) // Set minimum zoom limit
    // 4. Calculate new translate value
    const newTranslateX = (translateX * currentScale) / newScale
    const newTranslateY = (translateY * currentScale) / newScale
    // 5. Apply new transform
    target.style.transform = `scale(${newScale}) translate3d(${newTranslateX}px, ${newTranslateY}px, 0px)`
  }, 50) // Execute at most once per 50ms

  document.body.addEventListener(
    'wheel',
    (event) => {
      // 1. Locate target element
      if (event.target) {
        const target = event.target as HTMLElement
        // Assume opened images have a specific class name
        if (target.classList && target.classList.contains('medium-zoom-overlay')) {
          event.preventDefault()
          event.stopPropagation()
        }
        if (target.classList && target.classList.contains('medium-zoom-image--opened')) {
          event.preventDefault()
          event.stopPropagation()

          handleZoom(event, target)
        }
      }
    },
    { passive: false },
  )

  window.sendMessage = sendMessage
  bus.on('on:transcribing', (status: boolean) => {
    transcribing.value = status
    nextTick(() => {
      if (scorll.value) {
        scrollDiv.value.setScrollTop(getMaxHeight())
      }
    })
  })
  bus.on('click:share', (id: string) => {
    multipleSelectionChat.value.push(id)
    checkAll.value = multipleSelectionChat.value.length === chatList.value.length
    emit('update:selection', true)
  })
  bus.on('chat:stop', stopGenerating)
})

onBeforeUnmount(() => {
  window.sendMessage = null
  window.chatUserProfile = null
  bus.off('chat:stop', stopGenerating)
})

function setScrollBottom() {
  // Scroll to the bottom
  scrollDiv.value.setScrollTop(getMaxHeight())
}

watch(
  chatList,
  () => {
    nextTick(() => {
      handleScroll() // Ensure scroll after DOM update
    })
  },
  { deep: true, immediate: true },
)

defineExpose({
  setScrollBottom,
  loading,
})
</script>
<style lang="scss">
@use './index.scss';

.firstUserInput {
  height: 100%;
  display: flex;
  justify-content: center;
  overflow: auto;

  .user-form-container {
    max-width: 70%;
  }
}

.debug-ai-chat {
  .user-form-container {
    max-width: 100%;
  }
}

.popperUserInput {
  position: absolute;
  z-index: 999;
  left: 0;
  bottom: 50px;
  width: calc(100% - 50px);
  max-width: 400px;
}

@media only screen and (max-width: 768px) {
  .firstUserInput {
    .user-form-container {
      max-width: 100%;
    }
  }
}
</style>
