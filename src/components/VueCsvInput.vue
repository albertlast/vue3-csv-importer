<script setup lang="ts">
import { ref, watch } from 'vue'
import Papa from 'papaparse'
import guessMimeType from '../util/mimeDictionary'
import type { ParseLocalConfig, ParseResult, ParseConfig } from '@types/papaparse'

import { useCsvImport } from '@/composables/csvImport'

const { VueCsvImportData, buildMappedCsv, allFieldsAreMapped } = useCsvImport()

type ParseOverload = {
  (csvString: string, config?: ParseConfig): ParseResult<string[]>
  (csvString: string, config?: ParseConfig): Record<string, string>
}

const parse: ParseOverload = (csvString, config) => {
  return Papa.parse(csvString, config)
}

interface Props {
  name: string
  headers: boolean | null
  parseConfig: ParseLocalConfig
  validation: boolean
  fileMimeTypes: string[]
}

const props = withDefaults(defineProps<Props>(), {
  name: 'csv',
  headers: true,
  parseConfig: {},
  validation: true,
  fileMimeTypes: () => ['text/csv', 'text/x-csv', 'application/vnd.ms-excel', 'text/plain']
})

const csvRef = ref<HTMLInputElement | null>(null)
const labels = VueCsvImportData.value.language

VueCsvImportData.value.inputName = 'CsvFile'
VueCsvImportData.value.fileHasHeaders = props.headers !== null ? !!props.headers : null

const validate = function (file: File | null) {
  VueCsvImportData.value.errors = []

  if (!file) {
    VueCsvImportData.value.errors.push(labels.errors.fileRequired)
  }

  if (file && props.validation) {
    const mimeType = file.type === '' ? guessMimeType(file.name) : file.type

    if (typeof mimeType === 'string' && !props.fileMimeTypes.includes(mimeType)) {
      VueCsvImportData.value.errors.push(labels.errors.invalidMimeType)
    }

    return VueCsvImportData.value.errors.length === 0
  }

  return true
}

const change = function () {
  let tmpFile = csvRef.value?.files ? csvRef.value.files[0] : null

  if (validate(tmpFile)) {
    VueCsvImportData.value.file = tmpFile
  }
}

watch(
  () => VueCsvImportData.value.file,
  (newCurrentFile) => {
    if (!newCurrentFile) {
      VueCsvImportData.value.csvSample = null
      VueCsvImportData.value.rawCsv = null
    }
    let reader = new FileReader()
    if (!VueCsvImportData.value.file) return
    reader.readAsText(VueCsvImportData.value.file, props.parseConfig.encoding || 'UTF-8')
    reader.onload = function (evt) {
      if (!evt.target?.result || typeof evt.target.result !== 'string') return
      VueCsvImportData.value.csvSample = parse(evt.target.result, {
        ...{
          preview: 10,
          skipEmptyLines: true
        },
        ...props.parseConfig
      }).data
      VueCsvImportData.value.rawCsv = parse(evt.target.result, {
        ...{ skipEmptyLines: true },
        ...props.parseConfig
      }).data
    }
    reader.onerror = function (err) {
      console.log(err)
    }
  },
  { deep: true }
)

watch(
  () => VueCsvImportData.value.fileHasHeaders,
  () => {
    if (allFieldsAreMapped.value) {
      buildMappedCsv()
    }
  }
)
</script>

<template>
  <slot :file="VueCsvImportData.file" :change="change">
    <input ref="csvRef" type="file" @change="change" :name="name" v-bind="$attrs" />
  </slot>
</template>
