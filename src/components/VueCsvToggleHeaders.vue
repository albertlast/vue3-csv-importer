<script setup lang="ts">
import { useCsvImport } from '@/composables/csvImport'

const { VueCsvImportData } = useCsvImport()

const labels = VueCsvImportData.value.language

const toggleHasHeaders = function () {
  VueCsvImportData.value.fileHasHeaders = !VueCsvImportData.value.fileHasHeaders
}
</script>
<template>
  <slot :hasHeaders="VueCsvImportData.fileHasHeaders" :toggle="toggleHasHeaders">
    <label v-bind="labelAttributes">
      <input
        type="checkbox"
        v-bind="checkboxAttributes"
        :value="VueCsvImportData.fileHasHeaders"
        @change="toggleHasHeaders"
      />
      {{ labels.toggleHeaders }}
    </label>
  </slot>
</template>
