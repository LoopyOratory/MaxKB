<template>
  <el-dialog
    :title="$t('views.applicationOverview.appInfo.embedInWebsite')"
    v-model="dialogVisible"
    width="900"
    class="embed-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <!-- Theme picker section -->
    <div class="embed-dialog__theme-section mb-16">
      <div class="flex-between mb-8">
        <span class="bold">{{ $t('theme.widgetTheme') }}</span>
        <el-button type="primary" size="small" @click="handleSave" :loading="saving">
          {{ $t('common.save') }}
        </el-button>
      </div>
      <ThemePreview v-model="selectedTheme" />
    </div>

    <el-divider />

    <el-row :gutter="12">
      <el-col :span="8">
        <div class="border">
          <p class="title p-16 bold">
            {{ $t('views.applicationOverview.appInfo.EmbedDialog.fullscreenModeTitle') }}
          </p>
          <img src="@/assets/application/window1.png" alt="" class="ml-8" height="150" />
          <div class="code layout-bg border-t p-8">
            <div class="flex-between p-8">
              <span class="bold">{{
                $t('views.applicationOverview.appInfo.EmbedDialog.copyInstructions')
              }}</span>
              <el-button text @click="copyClick(source1)">
                <AppIcon iconName="app-copy"></AppIcon>
              </el-button>
            </div>
            <el-scrollbar height="180" always>
              <div class="pre-wrap p-8 pt-0">
                {{ source1 }}
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="border">
          <p class="title p-16 bold">
            {{ $t('views.applicationOverview.appInfo.EmbedDialog.mobileModeTitle') }}
          </p>
          <img src="@/assets/application/window3.png" alt="" class="ml-8" height="150" />
          <div class="code layout-bg border-t p-8">
            <div class="flex-between p-8">
              <span class="bold">{{
                $t('views.applicationOverview.appInfo.EmbedDialog.copyInstructions')
              }}</span>
              <el-button text @click="copyClick(source3)">
                <AppIcon iconName="app-copy"></AppIcon>
              </el-button>
            </div>
            <el-scrollbar height="180" always>
              <div class="pre-wrap p-8 pt-0">
                {{ source3 }}
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="border">
          <p class="title p-16 bold">
            {{ $t('views.applicationOverview.appInfo.EmbedDialog.floatingModeTitle') }}
          </p>
          <img src="@/assets/application/window2.png" alt="" class="ml-8" height="150" />
          <div class="code layout-bg border-t p-8">
            <div class="flex-between p-8">
              <span class="bold">{{
                $t('views.applicationOverview.appInfo.EmbedDialog.copyInstructions')
              }}</span>
              <el-button text @click="copyClick(source2)">
                <AppIcon iconName="app-copy"></AppIcon>
              </el-button>
            </div>
            <el-scrollbar height="180" always>
              <div class="pre-wrap p-8 pt-0">
                {{ source2 }}
              </div>
            </el-scrollbar>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { copyClick } from '@/utils/clipboard'
import { MsgSuccess } from '@/utils/message'
import { t } from '@/locales'
import useStore from '@/stores'
import ThemePreview from './ThemePreview.vue'
import { loadSharedApi } from '@/utils/dynamics-api/shared-api'

const { application } = useStore()

const props = defineProps({
  data: Object,
  apiInputParams: String,
  apiType: {
    type: String,
    default: 'workspace',
  },
})

const emit = defineEmits(['addData', 'themeSaved'])

const dialogVisible = ref<boolean>(false)
const saving = ref(false)

const source1 = ref('')
const source2 = ref('')
const source3 = ref('')

const selectedTheme = ref('blue')

const urlParams1 = computed(() => (props.apiInputParams ? '?' + props.apiInputParams : ''))
const urlParams2 = computed(() => (props.apiInputParams ? '&' + props.apiInputParams : ''))
const urlParams3 = computed(() =>
  props.apiInputParams ? '?mode=mobile&' + props.apiInputParams : '?mode=mobile',
)
watch(dialogVisible, (bool) => {
  if (!bool) {
    source1.value = ''
    source2.value = ''
    source3.value = ''
  }
})

const open = (val: string) => {
  // Sync selected theme from application data
  selectedTheme.value = props.data?.theme || 'blue'

  source1.value = `<iframe
src="${application.location + val + urlParams1.value}"
style="width: 100%; height: 100%;"
frameborder="0"
allow="microphone">
</iframe>
`

  source2.value = `<script
async
defer
src="${application.location}api/embed?protocol=${window.location.protocol.replace(
    ':',
    '',
  )}&host=${window.location.host}&token=${val}${urlParams2.value}">
<\/script>
`

  source3.value = `<iframe
src="${application.location + val + urlParams3.value}"
style="width: 100%; height: 100%;"
frameborder="0"
allow="microphone">
</iframe>
`

  dialogVisible.value = true
}

const handleSave = async () => {
  if (!props.data?.id) return
  saving.value = true
  try {
    const api = loadSharedApi({ type: 'application', systemType: props.apiType })
    await api.putApplication(props.data.id, { theme: selectedTheme.value })
    MsgSuccess(t('common.saveSuccess'))
    emit('themeSaved', selectedTheme.value)
  } catch {
    // Error handled by API interceptor
  } finally {
    saving.value = false
  }
}

defineExpose({ open })
</script>
<style lang="scss" scoped>
.embed-dialog {
  .title {
    color: var(--app-text-color) !important;
  }

  .code {
    color: var(--app-text-color) !important;

    font-weight: 400;
    font-size: 13px;
    white-space: pre;
    height: 210px;
  }

  &__theme-section {
    .bold {
      font-weight: 600;
      font-size: 14px;
      color: var(--app-text-color);
    }
  }
}
</style>
