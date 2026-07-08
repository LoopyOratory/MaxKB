<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t('views.document.setting.exportKnowledge')"
    :before-close="close"
    width="450"
  >
    <el-checkbox v-model="with_source_file" style="align-items: start; min-height: 60px;">
      <p class="bold mb-8">Simultaneously export source files</p>
      <p class="color-secondary pre-wrap line-height-22">After checking, OriginalFilePackage together toZIP，ImportWhen canAutomaticRestoreFileAssociation; if unchecked, onlyExportTextContent。</p>
    </el-checkbox>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">{{ $t('common.cancel') }} </el-button>
        <el-button type="primary" @click="submit"> {{ $t('common.confirm') }} </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const dialogVisible = ref<boolean>(false)
const with_source_file = ref<boolean>(false)
const submit_handle = ref<(with_source_file: boolean) => void>()

const submit = () => {
  if (submit_handle.value) {
    submit_handle.value(with_source_file.value)
  }
  close()
}

const open = (handle: (with_source_file: boolean) => void) => {
  submit_handle.value = handle
  dialogVisible.value = true
}
const close = () => {
  submit_handle.value = undefined
  dialogVisible.value = false
}
defineExpose({ open, close })
</script>
<style lang="scss" scoped></style>
