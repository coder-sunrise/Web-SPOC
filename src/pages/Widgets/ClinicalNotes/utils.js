import { CLINIC_SPECIALIST } from '@/utils/constants'
import defaultConfigs, { dentalConfigs } from './config'

export const getConfig = (clinicInfo) => {
  const { clinicSpecialist = CLINIC_SPECIALIST.GP } = clinicInfo
  switch (clinicSpecialist) {
    case CLINIC_SPECIALIST.GP:
      return defaultConfigs
    case CLINIC_SPECIALIST.DENTAL:
      return defaultConfigs
    default:
      return defaultConfigs
  }
}

export const getContent = (config) => {
  const { fields } = config
  return fields.map((field) => ({
    title: field.fieldTitle,
    name: field.fieldName,
    categoryIndex: field.scribbleNoteTypeFK,
    ...field,
  }))
}

export const getDefaultActivePanel = (entity, config) => {
  try {
    const { fields } = config

    const { corDoctorNote = [], corScribbleNotes = [] } = entity
    let defaultActive = fields.map((field) => field.index)

    if (corDoctorNote.length === 0 && corScribbleNotes.length === 0) return []

    // check if panel contains doctor notes
    if (corDoctorNote.length > 0) {
      const doctorNote = { ...corDoctorNote[0] }
      const panelWithData = fields.filter((field) => {
        if (doctorNote[field.fieldName]) return true
        return false
      })
      defaultActive = panelWithData.map((i) => i.index)
    }

    // check if panel contains scribble notes
    if (corScribbleNotes.length > 0) {
      const panelWithScribble = fields.filter((field) => {
        const data = corScribbleNotes.filter(
          (sn) => sn.scribbleNoteTypeFK === field.scribbleNoteTypeFK,
        )
        return data.length > 0
      })
      defaultActive = [
        ...defaultActive,
        ...panelWithScribble.map((i) => i.index),
      ]
    }

    // to get rid of duplicate elements
    const result = [
      ...new Set(defaultActive),
    ]

    return result
  } catch (error) {
    console.error(error)
    return []
  }
}

export const CannedTextColumns = [
  { name: 'drag', title: ' ' },
  { name: 'title', title: 'Title' },
  { name: 'cannedText', title: 'Canned Text' },
  { name: 'actions', title: 'Action' },
]

export const CannedTextColumnExtensions = [
  {
    columnName: 'drag',
    width: 100,
  },
  {
    columnName: 'title',
    width: '25%',
  },
]

export const generateData = () => {
  let data = []
  for (let i = 0; i < 3; i++) {
    data.push({
      id: i,
      title: `Test ${i}`,
      cannedText: `Test canned text ${i}`,
      htmlCannedText: `Test canned text ${i}`,
      isSelected: false,
    })
  }
  return data
}

export const applyFilter = (filter, rows) => {
  let returnData = [
    ...rows,
  ]
  if (filter !== '') {
    returnData = returnData.filter((each) => {
      const { title, cannedText } = each
      return (
        title.toLowerCase().indexOf(filter) >= 0 ||
        cannedText.toLowerCase().indexOf(filter) >= 0
      )
    })
  }
  return returnData
}
