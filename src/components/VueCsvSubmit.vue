<script setup lang="ts">
import { useCsvImport } from '@/composables/csvImport'

const { VueCsvImportData, buildMappedCsv } = useCsvImport()

const labels = VueCsvImportData.value.language

const submit = function () {
  buildMappedCsv()

  //   axios
  //     .post(props.url, { [VueCsvImportData.inputName]: VueCsvImportData.value }, props.config)
  //     .then((response) => {
  //       emit('send-success', response)
  //     })
  //     .catch((response) => {
  //       emit('send-error', response)
  //     })
  //     .finally((response) => {
  //       emit('send-complete', response)
  //     })
}
</script>
<template>
  <slot name="submit" :submit="submit" :mapped-csv="VueCsvImportData.values">
    <button type="submit" v-bind="$attrs" @click.prevent="submit">
      {{ labels.submitBtn }}
    </button>
  </slot>
</template>
