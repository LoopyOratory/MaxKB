<template>
  <div class="icon-uploader">
    <div class="icon-preview" @click="handleClick">
      <el-avatar :shape="shape" :size="56" style="background: none">
        <img v-if="modelValue" :src="resetUrl(modelValue, resetUrl(defaultIcon))" alt="" />
        <img v-else :src="resetUrl(defaultIcon)" alt="" />
      </el-avatar>
      <div class="icon-overlay">
        <AppIcon iconName="app-magnify" class="color-white" style="font-size: 16px"></AppIcon>
      </div>
    </div>
    <div class="icon-actions ml-12">
      <el-button size="small" @click="handleClick" :loading="uploading">
        {{ uploading ? 'Uploading...' : $t('common.EditAvatarDialog.upload') }}
      </el-button>
      <el-button
        v-if="modelValue"
        size="small"
        @click="handleReset"
        :disabled="uploading"
      >
        {{ $t('common.cancel') }}
      </el-button>
    </div>
    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      style="display: none"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { MsgError } from '@/utils/message'
import { t } from '@/locales'
import { resetUrl } from '@/utils/common'
import { postUploadFile } from '@/api/application/application'
import type { Ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    applicationId: string
    shape?: 'square' | 'circle'
    accept?: string
  }>(),
  {
    modelValue: '',
    shape: 'square',
    accept: 'image/jpeg,image/png,image/gif,image/svg+xml',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const defaultIcon = './favicon.ico'
const fileInputRef = ref<HTMLInputElement>()
const uploading: Ref<boolean> = ref(false)

const handleClick = () => {
  fileInputRef.value?.click()
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Validate file size (max 10MB)
  const isLimit = file.size / 1024 / 1024 < 10
  if (!isLimit) {
    MsgError(t('common.EditAvatarDialog.fileSizeExceeded'))
    input.value = ''
    return
  }

  uploading.value = true
  try {
    const result: any = await postUploadFile(file, props.applicationId, 'APPLICATION', uploading)
    const path = result?.data
    if (path && typeof path === 'string') {
      emit('update:modelValue', path)
    }
  } catch (e) {
    MsgError('Upload failed')
  } finally {
    uploading.value = false
    input.value = ''
  }
}

const handleReset = () => {
  emit('update:modelValue', '')
}
</script>

<style lang="scss" scoped>
.icon-uploader {
  display: flex;
  align-items: center;

  .icon-preview {
    position: relative;
    cursor: pointer;

    .icon-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.3);
      border-radius: var(--app-border-radius);
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .icon-overlay {
      opacity: 1;
    }

    :deep(.el-avatar) {
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .icon-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
