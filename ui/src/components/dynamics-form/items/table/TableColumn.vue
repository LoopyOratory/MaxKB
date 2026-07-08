<template>
  <component :is="column.property" v-bind="attrs" :column="column" :row="row"></component>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import _ from 'lodash'
const props = defineProps<{
  /**
   *FormRenderItem column
   */
  column: any
  /**
   * This rowData
   */
  row: any
}>()

const attrs = computed(() => {
  return props.column.attrs ? props.column.attrs : {}
})
</script>
<style lang="scss" scoped></style>
