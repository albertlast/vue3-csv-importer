<script setup lang="ts">
import { useCsvImport } from '@/composables/csvImport'

const { VueCsvImportData } = useCsvImport()
</script>
<template>
  <slot :errors="VueCsvImportData.errors.value">
    <span v-bind="$attrs" v-for="error in VueCsvImportData.errors" :key="error.index">
      {{ error }}
    </span>
  </slot>
</template>
