<template>
  <el-drawer v-model="debugVisible" size="60%" :append-to-body="true">
    <template #header>
      <h4>{{ $t('views.document.tag.label') }}</h4>
    </template>
    <div class="flex-between mb-16">
      <div>
        <el-button
          type="primary"
          @click="openCreateTagDialog()"
          v-if="permissionPrecise.tag_create(id)"
          >{{ $t('views.document.tag.create') }}
        </el-button>
        <el-button
          :disabled="multipleSelection.length === 0"
          @click="batchDelete"
          v-if="permissionPrecise.tag_delete(id)"
        >
          {{ $t('common.delete') }}
        </el-button>
      </div>
      <el-input
        v-model="filterText"
        prefix-icon="Search"
        class="w-240"
        @change="getList"
        clearable
        :placeholder="$t('common.search')"
      />
    </div>
    <el-table
      ref="tableRef"
      :data="pagedGroups"
      :span-method="spanMethod"
      v-loading="loading"
      :max-height="tableMaxHeight"
      @selection-change="handleSelectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="key" :label="$t('views.document.tag.key')">
        <template #default="{ row }">
          <div class="flex-between">
            {{ row.key }}
            <div v-if="currentMouseId === row.id">
              <span class="mr-4">
                <el-tooltip effect="dark" :content="$t('views.document.tag.addValue')">
                  <el-button
                    type="primary"
                    text
                    @click.stop="openCreateTagDialog(row)"
                    v-if="permissionPrecise.tag_create(id)"
                  >
                    <AppIcon iconName="app-add-outlined" />
                  </el-button>
                </el-tooltip>
              </span>
              <span class="mr-4">
                <el-tooltip effect="dark" :content="$t('views.document.tag.edit')">
                  <el-button
                    type="primary"
                    text
                    @click.stop="editTagKey(row)"
                    v-if="permissionPrecise.tag_edit(id)"
                  >
                    <AppIcon iconName="app-edit" />
                  </el-button>
                </el-tooltip>
              </span>
              <el-tooltip effect="dark" :content="$t('common.delete')">
                <el-button
                  type="primary"
                  text
                  @click.stop="delTag(row)"
                  v-if="permissionPrecise.tag_delete(id)"
                >
                  <AppIcon iconName="app-delete" />
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('views.document.tag.value')" class-name="border-l">
        <template #default="{ row }">
          <div class="flex-between">
            {{ row.value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('views.document.tag.relatedDoc')" align="right">
        <template #default="{ row }">
          <el-link type="primary" underline @click="openTagLinkedDocumentDialog(row)">
            {{ row.doc_count }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column :label="$t('common.operation')" align="left" width="100" fixed="right">
        <template #default="{ row }">
          <span class="mr-4">
            <el-tooltip effect="dark" :content="$t('views.document.tag.editValue')">
              <el-button
                type="primary"
                text
                @click.stop="editTagValue(row)"
                v-if="permissionPrecise.tag_edit(id)"
              >
                <AppIcon iconName="app-edit" />
              </el-button>
            </el-tooltip>
          </span>
          <el-tooltip effect="dark" :content="$t('common.delete')">
            <el-button
              type="primary"
              text
              @click.stop="delTagValue(row)"
              v-if="permissionPrecise.tag_delete(id)"
            >
              <AppIcon iconName="app-delete" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div class="mt-16 flex justify-end">
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="tableData.length"
        layout="prev, pager, next, sizes"
        :page-sizes="[10, 20, 50, 100]"
      />
    </div>
  </el-drawer>
  <CreateTagDialog ref="createTagDialogRef" @refresh="handleDialogRefresh" />
  <EditTagDialog ref="editTagDialogRef" @refresh="handleDialogRefresh" />
  <TaglinkedDocumentDialog ref="taglinkedDocumentDialogRef" @refresh="handleDialogRefresh" />
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { loadSharedApi } from '@/utils/dynamics-api/shared-api.ts'
import CreateTagDialog from './CreateTagDialog.vue'
import TaglinkedDocumentDialog from './TaglinkedDocumentDialog.vue'
import { MsgConfirm } from '@/utils/message.ts'
import { t } from '@/locales'
import EditTagDialog from '@/views/document/tag/EditTagDialog.vue'
import permissionMap from '@/permission'

const emit = defineEmits(['refresh', 'tag-changed'])

function notifyTagChanged() {
  emit('tag-changed')
}

function handleDialogRefresh() {
  getList()
  notifyTagChanged()
}

const route = useRoute()
const {
  params: { id, folderId }, // id is knowledgeID
} = route as any

const isShared = computed(() => {
  return folderId === 'share'
})

const apiType = computed(() => {
  if (route.path.includes('shared')) {
    return 'systemShare'
  } else if (route.path.includes('resource-management')) {
    return 'systemManage'
  } else {
    return 'workspace'
  }
})

const permissionPrecise = computed(() => {
  return permissionMap['knowledge'][apiType.value]
})

const loading = ref(false)
const debugVisible = ref(false)
const filterText = ref('')
const tags = ref<Array<any>>([])
const currentMouseId = ref<number | null>(null)
const pageNum = ref(1)
const pageSize = ref(20)
const tableMaxHeight = computed(() => `calc(100vh - 200px)`)

function cellMouseEnter(row: any, column: any) {
  if (column && column.property === 'key') {
    currentMouseId.value = row.id
  }
}

function cellMouseLeave() {
  currentMouseId.value = null
}

// 1) Still send full backend data tags Convert to“Flatten row”, each row with keyIndex
const tableData = computed(() => {
  const result: any[] = []
  tags.value.forEach((tag: any) => {
    if (tag.values && tag.values.length > 0) {
      tag.values.forEach((value: any, index: number) => {
        result.push({
          id: value.id,
          key: tag.key,
          value: value.value,
          doc_count: value.doc_count,
          keyIndex: index, // SameOne key Which row below
        })
      })
    }
  })
  return result
})

// 2) Paginate by "key group": per page pageSize keys
const pagedGroups = computed(() => {
  const start = (pageNum.value - 1) * pageSize.value
  const end = start + pageSize.value
  return tableData.value.slice(start, end)
})

// 5) Merge cells: only merge within current page; same key first row rowspan = count of this key in current page
const spanMethod = ({ row, columnIndex }: any) => {
  // Note: You currently have a selection column, so key column index is 1; adjust on-demand if also merging value columns
  if (columnIndex === 0 || columnIndex === 1) {
    const sameKeyItems = pagedGroups.value.filter((item) => item.key === row.key)
    const isFirstItem = sameKeyItems.length > 0 && sameKeyItems[0].id === row.id
    if (isFirstItem) {
      return { rowspan: sameKeyItems.length, colspan: 1 }
    }
    return { rowspan: 0, colspan: 0 }
  }
}

const multipleSelection = ref<any[]>([])
const tableRef = ref<any>(null)
const syncingSelection = ref(false)

const handleSelectionChange = async (val: any[]) => {
  if (syncingSelection.value) return

  // CurrentSelected in  id Set (Used forDetermineWhich lines were justCancel）
  const selectedIds = new Set(val.map((r) => r.id))

  // Find rows that were just deselected
  const deselectedRows = multipleSelection.value.filter((r) => !selectedIds.has(r.id))
  if (deselectedRows.length === 0) {
    multipleSelection.value = val
    return
  }

  // CancelSelectWhen: same key GroupOther lines here are alsoCancel
  syncingSelection.value = true
  await nextTick()

  for (const dr of deselectedRows) {
    const sameGroupRows = pagedGroups.value.filter((r) => r.key === dr.key)
    for (const r of sameGroupRows) {
      if (!selectedIds.has(r.id)) continue
      tableRef.value?.toggleRowSelection?.(r, false)
    }
  }

  await nextTick()
  syncingSelection.value = false

  // Use table final state as standard to update cache (val passed in here may be expired)
  // Simplified: Re-derive from table selection (Element Plus has internal store, no need to expose via val + patch)
  multipleSelection.value = pagedGroups.value.filter((r) =>
    tableRef.value?.getSelectionRows
      ? tableRef.value.getSelectionRows().some((s: any) => s.id === r.id)
      : selectedIds.has(r.id),
  )
}

const createTagDialogRef = ref()

function openCreateTagDialog(row?: any) {
  createTagDialogRef.value?.open(row)
}

function batchDelete() {
  MsgConfirm(t('views.document.tag.deleteConfirm'), t('views.document.tag.deleteTip'), {
    confirmButtonText: t('common.delete'),
    confirmButtonClass: 'danger',
  })
    .then(() => {
      const tagsToDelete = multipleSelection.value.map((item) => item.id)
      loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .delMulTag(id, tagsToDelete)
        .then(() => {
          getList()
          notifyTagChanged()
        })
    })
    .catch(() => {})
}

const editTagDialogRef = ref()

function editTagKey(row: any) {
  editTagDialogRef.value?.open(row, true)
}

function delTag(row: any) {
  MsgConfirm(t('views.document.tag.deleteConfirm') + row.key, t('views.document.tag.deleteTip'), {
    confirmButtonText: t('common.delete'),
    confirmButtonClass: 'danger',
  })
    .then(() => {
      loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .delTag(id, row.id, 'key')
        .then(() => {
          getList()
          notifyTagChanged()
        })
    })
    .catch(() => {})
}

const taglinkedDocumentDialogRef = ref()

const openTagLinkedDocumentDialog = (row: any) => {
  taglinkedDocumentDialogRef.value?.open(row)
}

function editTagValue(row: any) {
  editTagDialogRef.value?.open(row, false)
}

function delTagValue(row: any) {
  MsgConfirm(t('views.document.tag.deleteConfirm') + row.value, t('views.document.tag.deleteTip'), {
    confirmButtonText: t('common.delete'),
    confirmButtonClass: 'danger',
  })
    .then(() => {
      loadSharedApi({ type: 'knowledge', systemType: apiType.value })
        .delTag(id, row.id, 'one')
        .then(() => {
          getList()
          notifyTagChanged()
        })
    })
    .catch(() => {})
}

function getList() {
  const params = {
    ...(filterText.value && { name: filterText.value }),
  }
  loadSharedApi({ type: 'knowledge', systemType: apiType.value, isShared: isShared.value })
    .getTags(id, params, loading)
    .then((res: any) => {
      tags.value = res.data
      pageNum.value = 1
    })
}

const open = () => {
  filterText.value = ''
  debugVisible.value = true
  pageNum.value = 1
  getList()
}

defineExpose({
  open,
})
</script>
<style lang="scss"></style>
