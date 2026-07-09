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
        :style="{ backgroundColor: preset.base }"
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
        <div class="theme-preview__header-icon">🤖</div>
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
        <span class="theme-preview__input-btn" :style="sendBtnStyle">➤</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  AGENT_THEME_PRESETS,
  getContrastText,
  generateColorRamp,
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

const headerStyle = computed(() => {
  const bg = currentPreset.value.base
  return {
    background: bg,
    color: getContrastText(bg),
  }
})

const userBubbleStyle = computed(() => {
  const ramp = generateColorRamp(currentPreset.value.base)
  return {
    backgroundColor: ramp['--el-color-primary-light-9'],
    color: currentPreset.value.base,
  }
})

const agentBubbleStyle = computed(() => {
  if (!isDark.value) return {}
  return {
    backgroundColor: '#2A2B30',
    color: '#F5F5F5',
    boxShadow: 'none',
  }
})

const sendBtnStyle = computed(() => {
  return {
    backgroundColor: currentPreset.value.base,
    color: getContrastText(currentPreset.value.base),
  }
})

const previewStyle = computed(() => {
  if (!isDark.value) return {}
  const style: Record<string, string> = {
    backgroundColor: '#202225',
    color: '#F5F5F5',
  }
  return style
})

const inputStyle = computed(() => {
  if (!isDark.value) return {}
  return {
    backgroundColor: '#1B1C1F',
    borderTopColor: 'rgba(255,255,255,.08)',
  }
})
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
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid transparent;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;

    &:hover {
      box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
    }

    &--selected {
      border-color: #fff;
      box-shadow: 0 0 0 2px var(--el-color-primary, #3370FF);
    }

    &--dark {
      border: 3px solid #555;

      &.theme-preview__swatch--selected {
        border-color: #fff;
        box-shadow: 0 0 0 2px #8B93A7;
      }
    }

    &-icon {
      font-size: 16px;
      color: #ccc;
      pointer-events: none;
    }

    &-check {
      font-size: 14px;
      color: #fff;
      font-weight: bold;
      pointer-events: none;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
  }

  &__chat {
    border: 1px solid var(--el-border-color, #e5e6eb);
    border-radius: 8px;
    overflow: hidden;
    background: #f5f6f7;

    &--dark {
      border-color: rgba(255, 255, 255, 0.08);
    }
  }

  &__header {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    gap: 8px;
    font-size: 13px;

    &-icon {
      font-size: 16px;
    }

    &-title {
      flex: 1;
      font-weight: 500;
    }

    &-close {
      cursor: default;
      opacity: 0.6;
      font-size: 14px;
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

    &--user {
      align-self: flex-end;
      background: var(--el-color-primary-light-9, #e8f0ff);
      border-bottom-right-radius: 4px;
    }

    &--agent {
      align-self: flex-start;
      background: #fff;
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
    background: #fff;

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
      font-size: 12px;
      color: #fff;
    }
  }
}
</style>
