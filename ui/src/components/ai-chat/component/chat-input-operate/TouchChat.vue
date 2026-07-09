<template>
  <div class="touch-chat p-8 pb-0">
    <el-button
      text
      bg
      class="microphone-button w-full"
      style="font-size: 1rem; padding: 1.2rem 0 !important; background-color: var(--el-fill-color-light)"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      :disabled="disabled"
    >
      {{ disabled ? $t('aiChat.inputPlaceholder.chatting') : $t('aiChat.inputPlaceholder.holdToTalk') }}
    </el-button>
    <!-- Use custom-class for custom styling -->
    <transition name="el-fade-in-linear">
      <el-card
        class="custom-speech-card white-bg"
        :class="isTouching ? '' : 'active'"
        v-if="dialogVisible"
      >
        <p>
          <el-text type="info" v-if="isTouching"
            >00:{{ props.time < 10 ? `0${props.time}` : props.time }}</el-text
          >
          <span class="lighter" v-else>
            {{ message }}
          </span>
        </p>
        <el-avatar :size="isTouching ? 43 : 50" icon="Close" class="close" />
        <!-- <div class="close"></div> -->
        <p class="lighter" :style="{ visibility: isTouching ? 'visible' : 'hidden' }">
          {{ message }}
        </p>
        <div class="speech-img flex-center border-r-6 mt-16">
          <img v-if="isTouching" src="@/assets/chat/acoustic-color.svg" alt="" />
          <img v-else src="@/assets/chat/acoustic.svg" alt="" />
        </div>
      </el-card>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { t } from '@/locales'
const props = defineProps({
  time: {
    type: Number,
    default: 0,
  },
  start: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(['TouchStart', 'TouchEnd'])
// Mobile voice input
const startY = ref(0)
const isTouching = ref(false)
const dialogVisible = ref(false)
const message = ref(t('aiChat.inputPlaceholder.holdToTalk'))

watch(
  () => [props.time, props.start],
  ([time, start]) => {
    if (start) {
      isTouching.value = true
      dialogVisible.value = true
      message.value = t('aiChat.inputPlaceholder.touchChatMessage')
      if (time === 60) {
        dialogVisible.value = false
        emit('TouchEnd', isTouching.value)
        isTouching.value = false
      }
    } else {
      dialogVisible.value = false
      isTouching.value = false
    }
  },
)
watch(
  () => props.start,
  (val) => {
    if (val) {
      isTouching.value = true
      dialogVisible.value = true
      message.value = t('aiChat.inputPlaceholder.touchChatMessage')
    } else {
      dialogVisible.value = false
      isTouching.value = false
    }
  },
)

function onTouchStart(event: any) {
  // Prevent default scroll behavior
  event.preventDefault()
  if (props.disabled) {
    return
  }
  emit('TouchStart')
  startY.value = event.touches[0].clientY
}
function onTouchMove(event: any) {
  if (!isTouching.value) return
  // Prevent default scroll behavior
  event.preventDefault()
  const currentY = event.touches[0].clientY
  const deltaY = currentY - startY.value
  // Detect if swiping up
  if (deltaY < -50) {
    // -50 is a threshold, adjust as needed
    message.value = t('aiChat.inputPlaceholder.cancelTouchChat')
    isTouching.value = false
  }
}
function onTouchEnd() {
  emit('TouchEnd', isTouching.value)
}
</script>

<style lang="scss" scoped>
.custom-speech-card {
  position: fixed;
  bottom: 10px;
  left: 50%; /* Horizontal center */
  transform: translateX(-50%);
  width: 92%;
  background: var(--el-bg-color-overlay);
  border: 1px solid var(--el-border-color-light);
  box-shadow: 0px 6px 24px 0px rgba(var(--el-text-color-primary-rgb), 0.08);
  z-index: 999;
  text-align: center;
  color: var(--app-text-color-secondary);
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  .close {
    box-shadow: 0px 4px 8px 0px rgba(var(--el-text-color-primary-rgb), 0.1);
    border: 1px solid var(--el-border-color-light);
    background: var(--el-fill-color-blank);
    color: var(--app-text-color-secondary);
    font-size: 1.6rem;
    margin: 20px 0;
  }
  .speech-img {
    text-align: center;
    background: var(--el-color-primary-light-9);
    padding: 8px;
    img {
      height: 25px;
    }
  }
  &.active {
    .close {
      background: #f54a45;
      color: #ffffff;
      border: none;
      font-size: 2rem;
    }
    .speech-img {
      background: var(--el-fill-color-light);
    }
  }
}
</style>
