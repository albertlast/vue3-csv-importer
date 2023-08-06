import type { ParseResult } from '@types/papaparse'

interface LanguageType {
  errors: {
    fileRequired: string
    invalidMimeType: string
  }
  toggleHeaders: string
  submitBtn: string
  fieldColumn: string
  csvColumn: string
  requiredField: string
  excludeField: string
}

interface fieldsType {
  key: string
  label: string
  required: boolean
  selected: boolean
}

interface mapType {
  [key: string]: string
}

interface VueCsvImportDataType {
  errors: string[]
  inputName: string
  file: File | null
  map: mapType
  values: any
  fields: fieldsType[] | null
  fileHasHeaders: boolean | null
  csvSample: string[][] | Record<string, string>[] | null
  rawCsv: string[][] | Record<string, string>[] | null
  language: LanguageType
}
