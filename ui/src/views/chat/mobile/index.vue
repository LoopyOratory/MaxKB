<template>
  <div
    ref="chatRootRef"
    class="chat-mobile layout-bg chat-background"
    :style="{
      backgroundImage: `url(${applicationDetail?.chat_background})`,
    }"
  >
    <div class="chat-mobile__header" :style="customStyle">
      <div class="flex-between">
        <div class="flex align-center">
          <AppIcon
            iconName="app-mobile-open-history"
            style="font-size: 20px"
            class="ml-16 cursor"
            @click.prevent.stop="show = true"
          />
          <div class="mr-12 ml-16 flex">
            <el-avatar
              v-if="isAppIcon(applicationDetail?.icon)"
              shape="square"
              :size="32"
              style="background: none"
            >
              <img :src="applicationDetail?.icon" alt="" />
            </el-avatar>
            <LogoIcon v-else height="32px" />
          </div>

          <h4 class="ellipsis" style="max-width: 270px" :title="applicationDetail?.name">
            {{ applicationDetail?.name }}
          </h4>
        </div>
        <div>
          <el-button
            text
            @click="newChat"
            :class="currentChatId === 'new' ? 'mr-16' : ''"
            v-if="!showSelection"
            :style="{ color: applicationDetail?.custom_theme?.header_font_color }"
          >
            <AppIcon iconName="app-create-chat" style="font-size: 20px"></AppIcon>
          </el-button>
          <el-tooltip
            effect="dark"
            :content="$t('aiChat.share')"
            placement="top"
            v-if="!showSelection && currentChatId !== 'new' && applicationDetail.show_share"
          >
            <el-button class="mr-16" text @click="clickShareHandle" :disabled="AiChatRef?.loading">
              <AppIcon iconName="app-share"></AppIcon>
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div>
      <div class="chat-mobile__main">
        <AiChat
          ref="AiChatRef"
          v-model:applicationDetails="applicationDetail"
          :available="applicationAvailable"
          :appId="applicationDetail?.id"
          :record="currentRecordList"
          :chatId="currentChatId"
          type="ai-chat"
          @refresh="refresh"
          @openChat="refresh"
          @scroll="handleScroll"
          v-model:selection="showSelection"
        >
        </AiChat>
      </div>
    </div>
    <ChatHistoryDrawer
      v-model:show="show"
      :application-detail="applicationDetail"
      :chat-log-data="chatLogData"
      :left-loading="left_loading"
      :currentChatId="currentChatId"
      @new-chat="newChat"
      @clickLog="clickListHandle"
      @delete-log="deleteLog"
      @refreshFieldTitle="refreshFieldTitle"
      @clear-chat="clearChat"
      @clickShare="clickShareHandle"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, reactive, nextTick, computed, provide, watch } from 'vue'
import { isAppIcon } from '@/utils/common'
import { applyAgentTheme, applyThemeColor } from '@/utils/theme'
import useStore from '@/stores'
import { t } from '@/locales'
import ChatHistoryDrawer from './component/ChatHistoryDrawer.vue'
import chatAPI from '@/api/chat/chat'
import { ChatManagement } from '@/api/type/application'

provide('scrollData', loadInfiniteScroll)
provide('chatLogPagination', () => chatLogPagination)

const { common } = useStore()

const AiChatRef = ref()
const chatRootRef = ref<HTMLElement>()
const loading = ref(false)
const left_loading = ref(false)
const chatLogData = ref<any[]>([])
const show = ref(false)
const props = defineProps<{
  application_profile: any
  applicationAvailable: boolean
}>()
const applicationDetail = computed({
  get: () => {
    return props.application_profile
  },
  set: (v) => {},
})
const paginationConfig = reactive({
  current_page: 1,
  page_size: 20,
  total: 0,
})

const currentRecordList = ref<any>([])
const currentChatId = ref('new') // CurrentHistoryRecordId Defaultis'new'

const customStyle = computed(() => {
  return {
    background: 'var(--chat-header-gradient)',
    color: applicationDetail.value?.custom_theme?.header_font_color || 'var(--chat-header-text)',
  }
})

// Apply theme color ramp to chat root element on mount and when applicationDetail changes
watch(
  () => applicationDetail.value,
  (detail) => {
    const el = chatRootRef.value
    if (!el) return
    // EE custom_theme.theme_color wins over community preset
    if (detail?.custom_theme?.theme_color) {
      applyThemeColor(el, detail.custom_theme.theme_color)
    } else {
      const themeKey = detail?.theme || 'blue'
      applyAgentTheme(el, themeKey)
    }
  },
  { immediate: true },
)

onMounted(() => {
  const el = chatRootRef.value
  if (!el) return
  const detail = applicationDetail.value
  if (detail?.custom_theme?.theme_color) {
    applyThemeColor(el, detail.custom_theme.theme_color)
  } else {
    const themeKey = detail?.theme || 'blue'
    applyAgentTheme(el, themeKey)
  }
})

const showSelection = ref(false)
const clickShareHandle = () => {
  showSelection.value = true
  show.value = false
}

function clearChat() {
  chatAPI.clearChat(left_loading).then(() => {
    currentChatId.value = 'new'
    paginationConfig.current_page = 1
    paginationConfig.total = 0
    currentRecordList.value = []
    chatLogPagination.value.current_page = 1
    chatLogData.value = []
    getChatLog()
  })
}

function deleteLog(row: any) {
  chatAPI.deleteChat(row.id).then(() => {
    if (currentChatId.value === row.id) {
      currentChatId.value = 'new'
      paginationConfig.current_page = 1
      paginationConfig.total = 0
      currentRecordList.value = []
    }
    chatLogData.value = chatLogData.value.filter((item) => item.id !== row.id)
  })
}

function handleScroll(event: any) {
  if (
    currentChatId.value !== 'new' &&
    event.scrollTop === 0 &&
    paginationConfig.total > currentRecordList.value.length
  ) {
    const history_height = event.dialogScrollbar.offsetHeight
    paginationConfig.current_page += 1
    getChatRecord().then(() => {
      event.scrollDiv.setScrollTop(event.dialogScrollbar.offsetHeight - history_height)
    })
  }
}

const newObj = {
  id: 'new',
  abstract: t('aiChat.createChat'),
}

function newChat() {
  paginationConfig.current_page = 1
  currentRecordList.value = []
  if (!chatLogData.value.some((v) => v.id === 'new')) {
    chatLogData.value.unshift(newObj)
  }
  currentChatId.value = 'new'
  show.value = false
}

const chatLogPagination = ref({
  total: 0,
  page_size: 20,
  current_page: 1,
})

function getChatLog(refresh?: boolean) {
  chatAPI
    .pageChat(chatLogPagination.value.current_page, chatLogPagination.value.page_size, left_loading)
    .then((res: any) => {
      chatLogPagination.value.total = res.data.total
      chatLogData.value = [...chatLogData.value, ...res.data.records]
      if (!refresh) {
        paginationConfig.current_page = 1
        paginationConfig.total = 0
        currentRecordList.value = []
        currentChatId.value = 'new'
      }
    })
}

function loadInfiniteScroll() {
  getChatLog(true)
}

/**
 * Switch backSessionWhen, MemoryBelongs to thisSession, still in backgroundStreaming output in-flightMessageReconnectList,
 * So streams not interrupted during switch-away, Switch backCan continue real-timeShow。
 * - and DB record record_id same, override with live object (otherwise will show empty answer from database)
 * - DB Still inNone(Not yetDatabase), AppendTo end
 */
function attachActiveStreams() {
  const activeChats = ChatManagement.getActiveByChatId(currentChatId.value)
  if (!activeChats.length) {
    return
  }
  const activeMap = new Map(activeChats.map((chat) => [chat.record_id, chat]))
  const existIds = new Set(currentRecordList.value.map((v: any) => v.record_id))
  const merged = currentRecordList.value.map((v: any) =>
    activeMap.has(v.record_id) ? activeMap.get(v.record_id) : v,
  )
  const appendList = activeChats.filter((chat) => !existIds.has(chat.record_id))
  currentRecordList.value = [...merged, ...appendList]
}

function getChatRecord() {
  return chatAPI
    .pageChatRecord(
      currentChatId.value,
      paginationConfig.current_page,
      paginationConfig.page_size,
      loading,
    )
    .then((res: any) => {
      paginationConfig.total = res.data.total
      const list = res.data.records
      list.map((v: any) => {
        v['write_ed'] = true
        v['record_id'] = v.id
      })
      currentRecordList.value = [...list, ...currentRecordList.value].sort((a, b) =>
        a.create_time.localeCompare(b.create_time),
      )
      if (paginationConfig.current_page === 1) {
        attachActiveStreams()
        nextTick(() => {
          // Scroll to the bottom
          AiChatRef.value.setScrollBottom()
        })
      }
    })
}

const clickListHandle = (item: any) => {
  if (item.id !== currentChatId.value) {
    showSelection.value = false
    paginationConfig.current_page = 1
    currentRecordList.value = []
    currentChatId.value = item.id
    if (currentChatId.value !== 'new') {
      getChatRecord()
    }
    show.value = false
  }
}

function refreshFieldTitle(chatId: string, abstract: string) {
  const find = chatLogData.value.find((item: any) => item.id == chatId)
  if (find) {
    find.abstract = abstract
  }
}

function refresh(id: string) {
  currentChatId.value = id
  chatLogPagination.value.current_page = 1
  chatLogData.value = []
  getChatLog(true)
}

/**
 *InitializeHistoryConversationRecord
 */
const init = () => {
  getChatLog()
}

onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
.chat-mobile {
  overflow: hidden;

  &__header {
    background: var(--app-header-bg-color);
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 100;
    height: var(--app-header-height);
    line-height: var(--app-header-height);
    box-sizing: border-box;
    box-shadow: var(--chat-header-shadow);
    transition: background 0.2s ease;
  }

  &__main {
    padding-top: calc(var(--app-header-height) + 16px);
    height: calc(100vh - var(--app-header-height) - 16px);
    overflow: hidden;
  }
}
</style>
<style lang="scss" scoped></style>
