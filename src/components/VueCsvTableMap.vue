<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useCsvImport } from '@/composables/csvImport'

const { VueCsvImportData, buildMappedCsv, firstSampleRow, allFieldsAreMapped } = useCsvImport()

interface Props {
  tableAttributes: any
  autoMatch: boolean
  autoMatchIgnoreCase: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tableAttributes: {},
  autoMatch: true,
  autoMatchIgnoreCase: true
})

const labels = VueCsvImportData?.value.language
const csvMap = ref({})

const availableFields = computed(() => {
  return VueCsvImportData?.value.fields.map((f) => {
    f.selected = Object.values(csvMap.value).includes(f.label)
    return f
  })
})

watch(
  () => csvMap,
  function () {
    VueCsvImportData.value.map = {}
    for (const [key, value] of Object.entries(csvMap.value)) {
      if (value === '') {
        continue
      }
      VueCsvImportData.value.map[value.toLowerCase()] = key
    }

    if (allFieldsAreMapped) {
      buildMappedCsv()
    }
  },
  { deep: true }
)

const csvSample = computed(() => {
  return VueCsvImportData.value.fileHasHeaders
    ? VueCsvImportData.value.csvSample
    : VueCsvImportData.value.csvSample.slice(1)
})

const headers = computed(() => {
  if (VueCsvImportData.value.fileHasHeaders) {
    return [...Array(firstSampleRow.value?.length).keys()].map((i) => `${labels.csvColumn} ${i}`)
  } else {
    return firstSampleRow
  }
})

if (props.autoMatch) {
  watch(
    () => VueCsvImportData.value.csvSample,
    function (newVal) {
      if (newVal) {
        VueCsvImportData.value.fields.forEach((field) => {
          newVal[0].forEach((columnName, index) => {
            let fieldName = props.autoMatchIgnoreCase
              ? field.label.toLowerCase().trim()
              : field.label.trim()
            let colName = props.autoMatchIgnoreCase
              ? columnName.toLowerCase().trim()
              : columnName.trim()
            if (fieldName === colName) {
              csvMap.value[index] = field.label
            }
          })
        })
      }
    }
  )
}
</script>
<template>
  <slot :sample="firstSampleRow" :map="VueCsvImportData.map" :fields="VueCsvImportData.fields">
    <template v-if="firstSampleRow">
      <table v-bind="tableAttributes">
        <thead>
          <tr>
            <td v-for="(field, key) in headers" :key="field">
              {{ field }}
              <select v-model="csvMap[key]" :name="`csv_uploader_map_${key}`" required>
                <option value>{{ labels.excludeField }}</option>
                <option
                  v-for="option in availableFields"
                  :value="option.label"
                  :key="option.key"
                  :disabled="option.selected"
                >
                  {{ option.label }}{{ option.required ? labels.requiredField : '' }}
                </option>
                <option
                  v-if="!VueCsvImportData.fields.map((f) => f.label).includes(field)"
                  :value="field"
                  :key="field"
                >
                  {{ field }}
                </option>
              </select>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in csvSample" :key="row.index">
            <td v-for="item in row" :key="item.index">{{ item }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </slot>
</template>
