<script setup lang="ts">
import { onMounted } from 'vue'
import { useCsvImport } from '@/composables/csvImport'
import type { LanguageType, fieldsType } from '@/type'

const { VueCsvImportData } = useCsvImport()

interface Props {
  modelValue: string[]
  fields: string[]
  text: LanguageType
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const defaultLanguage = {
  errors: {
    fileRequired: 'A file is required',
    invalidMimeType: 'Invalid file type'
  },
  toggleHeaders: 'File has headers',
  submitBtn: 'Submit',
  fieldColumn: 'Field',
  csvColumn: 'Column',
  requiredField: '*',
  excludeField: 'Exclude field'
}

const mapFields = function (fields: string[]): fieldsType[] | void {
  if (Array.isArray(fields)) {
    return fields.map((item) => {
      return {
        key: item,
        label: item,
        required: true,
        selected: false
      }
    })
  }
}

onMounted(() => {
  VueCsvImportData.value.language = { ...defaultLanguage, ...props.text }
  VueCsvImportData.value.fields = mapFields(props.fields) ?? null
})
</script>

<template>
  <slot
    :errors="VueCsvImportData.errors"
    :fields="VueCsvImportData.fields"
    :file="VueCsvImportData.file"
  ></slot>
</template>
