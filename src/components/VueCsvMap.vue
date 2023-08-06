<script setup lang="ts">
import { watch } from 'vue'
import { useCsvImport } from '@/composables/csvImport'

const { VueCsvImportData, buildMappedCsv, firstSampleRow, allFieldsAreMapped } = useCsvImport()

interface Props {
  noThead: boolean
  selectAttributes: any
  autoMatch: boolean
  autoMatchIgnoreCase: boolean
}

const props = withDefaults(defineProps<Props>(), {
  noThead: false,
  selectAttributes: {},
  autoMatch: true,
  autoMatchIgnoreCase: true
})

const labels = VueCsvImportData.value.language

watch(
  () => VueCsvImportData.value.map,
  function () {
    if (allFieldsAreMapped.value) {
      buildMappedCsv()
    }
  },
  { deep: true }
)

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
              VueCsvImportData.value.map[field.key] = index
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
      <table v-bind="$attrs">
        <thead v-if="!noThead">
          <tr>
            <th>{{ labels.fieldColumn }}</th>
            <th>{{ labels.csvColumn }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(field, key) in VueCsvImportData.fields" :key="key">
            <td>{{ field.label }}</td>
            <td>
              <select
                v-bind="selectAttributes"
                :name="`csv_uploader_map_${key}`"
                v-model="VueCsvImportData.map[field.key]"
              >
                <option v-if="!field.required" :value="null">&nbsp;</option>
                <option v-for="(column, key) in firstSampleRow" :key="key" :value="key">
                  {{ column }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </slot>
</template>
