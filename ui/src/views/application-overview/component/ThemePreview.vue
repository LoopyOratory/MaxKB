<template>
  <div class="theme-preview">
    <!-- Swatch row -->
    <div class="theme-preview__swatches">
      <div
        v-for="preset in presets"
        :key="preset.key"
        class="theme-preview__swatch"
        :class="{
          'theme-preview__swatch--selected': modelValue === preset.key,
          'theme-preview__swatch--dark': preset.isDark,
        }"
        :style="{ backgroundColor: preset.base, color: preset.base }"
        :title="preset.label"
        @click="$emit('update:modelValue', preset.key)"
      >
        <span v-if="preset.isDark" class="theme-preview__swatch-icon">☾</span>
        <span
          v-else
          class="theme-preview__swatch-check"
          v-show="modelValue === preset.key"
        >✓</span>
      </div>
    </div>

    <!-- Mini chat preview -->
    <div
      class="theme-preview__chat"
      :class="{ 'theme-preview__chat--dark': isDark }"
      :style="previewStyle"
    >
      <!-- Header bar -->
      <div class="theme-preview__header" :style="headerStyle">
        <div class="theme-preview__header-icon" :style="iconBadgeStyle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 3a1 1 0 0 1 1 1v1.06A6.5 6.5 0 0 1 18.94 11H20a1 1 0 1 1 0 2h-1.06A6.5 6.5 0 0 1 13 18.94V20a1 1 0 1 1-2 0v-1.06A6.5 6.5 0 0 1 5.06 13H4a1 1 0 1 1 0-2h1.06A6.5 6.5 0 0 1 11 5.06V4a1 1 0 0 1 1-1Zm0 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0 2.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span class="theme-preview__header-title">Agent Name</span>
        <span class="theme-preview__header-close">✕</span>
      </div>

      <!-- Chat body -->
      <div class="theme-preview__body">
        <!-- User bubble -->
        <div class="theme-preview__bubble theme-preview__bubble--user" :style="userBubbleStyle">
          Hello, how can you help me?
        </div>
        <!-- Agent bubble -->
        <div class="theme-preview__bubble theme-preview__bubble--agent" :style="agentBubbleStyle">
          I'm here to assist you! Feel free to ask me anything.
        </div>
      </div>

      <!-- Input area -->
      <div class="theme-preview__input" :style="inputStyle">
        <span class="theme-preview__input-text">Send a message...</span>
        <span class="theme-preview__input-btn" :style="sendBtnStyle">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.4 20.4 22 12 3.4 3.6 3.39 10l13.19 2-13.19 2 .01 6.4Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  AGENT_THEME_PRESETS,
  getContrastText,
  generateChatSurfaceTokens,
} from '@/utils/theme'
import { t } from '@/locales'

const props = defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

interface PresetItem {
  key: string
  base: string
  isDark: boolean
  label: string
}

const presets = computed<PresetItem[]>(() => {
  const labelKeys: Record<string, string> = {
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    blue: 'Blue',
    indigo: 'Indigo',
    violet: 'Violet',
    dark: 'Dark',
  }
  return Object.values(AGENT_THEME_PRESETS).map((p) => ({
    ...p,
    label: t(`theme.presets.${p.key}`) || labelKeys[p.key],
  }))
})

const currentPreset = computed(() => {
  return AGENT_THEME_PRESETS[props.modelValue] || AGENT_THEME_PRESETS['blue']
})

const isDark = computed(() => currentPreset.value.isDark)

const tokens = computed(() => generateChatSurfaceTokens(currentPreset.value.base, isDark.value))

const headerStyle = computed(() => ({
  background: tokens.value['--chat-header-gradient'],
  color: tokens.value['--chat-header-text'],
  boxShadow: tokens.value['--chat-header-shadow'],
}))

const iconBadgeStyle = computed(() => ({
  background: 'rgba(255, 255, 255, 0.18)',
  color: tokens.value['--chat-header-text'],
}))

const userBubbleStyle = computed(() => ({
  background: tokens.value['--chat-question-bubble-bg'],
  color: tokens.value['--chat-question-bubble-text'],
}))

const agentBubbleStyle = computed(() => ({
  background: tokens.value['--chat-answer-bubble-bg'],
  borderColor: tokens.value['--chat-answer-bubble-border'],
  color: isDark.value ? '#F5F5F5' : undefined,
  backdropFilter: tokens.value['--chat-glass-blur'],
}))

const sendBtnStyle = computed(() => ({
  background: tokens.value['--chat-question-bubble-bg'],
  color: getContrastText(currentPreset.value.base),
  boxShadow: `0 4px 12px ${tokens.value['--chat-accent-glow']}`,
}))

const previewStyle = computed(() => {
  if (!isDark.value) return {}
  return {
    backgroundColor: '#202225',
    color: '#F5F5F5',
  }
})

const inputStyle = computed(() => ({
  background: tokens.value['--chat-input-bg'],
  borderTopColor: tokens.value['--chat-input-border'],
  backdropFilter: tokens.value['--chat-glass-blur'],
}))
</script>

<style lang="scss" scoped>
.theme-preview {
  &__swatches {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    align-items: center;
  }

  &__swatch {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--el-bg-color, #fff);
    box-shadow: 0 0 0 1px rgba(31, 35, 41, 0.08);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    box-sizing: border-box;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 0 1px rgba(31, 35, 41, 0.14), 0 4px 10px rgba(31, 35, 41, 0.12);
    }

    &--selected {
      box-shadow:
        0 0 0 2px var(--el-bg-color, #fff),
        0 0 0 4px currentColor;
    }

    &--dark {
      background: linear-gradient(135deg, #3a3d44 0%, #17181b 100%) !important;

      &.theme-preview__swatch--selected {
        box-shadow:
          0 0 0 2px var(--el-bg-color, #fff),
          0 0 0 4px #8b93a7;
      }
    }

    &-icon {
      font-size: 14px;
      color: #e8eaed;
      pointer-events: none;
    }

    &-check {
      font-size: 13px;
      color: #fff;
      font-weight: bold;
      pointer-events: none;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    }
  }

  &__chat {
    border: 1px solid var(--el-border-color, #e5e6eb);
    border-radius: 12px;
    overflow: hidden;
    background: #eef0f2;
    box-shadow: 0 8px 24px rgba(31, 35, 41, 0.08);

    &--dark {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    gap: 8px;
    font-size: 13px;
    transition: background 0.2s ease;

    &-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      svg {
        width: 13px;
        height: 13px;
      }
    }

    &-title {
      flex: 1;
      font-weight: 600;
    }

    &-close {
      cursor: default;
      opacity: 0.7;
      font-size: 13px;
    }
  }

  &__body {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__bubble {
    max-width: 80%;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 12px;
    line-height: 1.4;
    border: 1px solid transparent;
    box-sizing: border-box;

    &--user {
      align-self: flex-end;
      border-bottom-right-radius: 4px;
      font-weight: 500;
    }

    &--agent {
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }
  }

  &__input {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-top: 1px solid var(--el-border-color, #e5e6eb);
    gap: 8px;
    transition: background 0.2s ease;

    &-text {
      flex: 1;
      font-size: 12px;
      color: #8f959e;
    }

    &-btn {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;

      svg {
        width: 13px;
        height: 13px;
      }
    }
  }
}
</style>
