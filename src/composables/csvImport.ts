import { ref, computed } from 'vue'
import { get, set } from 'lodash'
import type { VueCsvImportDataType, LanguageType, fieldsType } from '@/type'

export function useCsvImport() {
  const VueCsvImportData = ref<VueCsvImportDataType>({
    errors: [],
    inputName: 'csv',
    file: null,
    map: {},
    values: {},
    fields: {} as fieldsType[],
    fileHasHeaders: null,
    csvSample: null,
    rawCsv: null,
    language: {} as LanguageType
  })

  const firstSampleRow = computed(() =>
    Array.isArray(VueCsvImportData.value.csvSample) &&
    Array.isArray(VueCsvImportData.value.csvSample[0])
      ? VueCsvImportData.value.csvSample[0]
      : null
  )
  const allFieldsAreMapped = computed(
    () =>
      VueCsvImportData.value.fields?.every(function (field) {
        return typeof VueCsvImportData.value.map[field.key] !== 'undefined' || !field.required
      })
  )

  const buildMappedCsv = function () {
    const newCsv = VueCsvImportData.value.fileHasHeaders
      ? VueCsvImportData.value.rawCsv
      : VueCsvImportData.value.rawCsv.slice(1)

    VueCsvImportData.value.values = newCsv.map((row) => {
      let newRow = {}
      Object.keys(VueCsvImportData.value.map).forEach((column, field) => {
        newRow = set(newRow, field, get(row, column))
      })

      return newRow
    })

    emit('update:modelValue', VueCsvImportData)
  }

  return { VueCsvImportData, firstSampleRow, allFieldsAreMapped, buildMappedCsv }
}
