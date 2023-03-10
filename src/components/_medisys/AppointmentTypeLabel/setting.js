import { primaryColor } from 'mui-pro-jss'

export const AppointmentTypeOptions = [
  {
    name: 'All Appointment Type',
    value: 'all',
    color: 'primary',
    colorValue: primaryColor,
    colorActive: primaryColor,
  },
  {
    name: 'Checkup',
    value: 'checkup',
    color: 'red',
    colorValue: '#ef5350',
    colorActive: '#e53935',
  },
  {
    name: 'Aesthetic',
    value: 'aesthetic',
    color: 'green',
    colorValue: '#66bb6a',
    colorActive: '#43a047',
  },
  {
    name: 'Dental',
    value: 'dental',
    color: 'blue',
    colorValue: '#42a5f5',
    colorActive: '#1976d2',
  },
  {
    name: 'Consultation',
    value: 'consultation',
    color: 'cyan',
    colorValue: '#26c6da',
    colorActive: '#00acc1',
  },
  {
    name: 'Pill Checks',
    value: 'pillChecks',
    color: 'pink',
    colorValue: '#ec407a',
    colorActive: '#d81b60',
  },
  {
    name: 'Urgent',
    value: 'urgent',
    color: 'indigo',
    colorValue: '#5c6bc0',
    colorActive: '#3949ab',
  },
]

// const colorOptions = [
//   defaultColorOpts,
//   { name: 'red', value: '#ef5350', active: '#e53935' },
//   { name: 'green', value: '#66bb6a', active: '#43a047' },
//   { name: 'blue', value: '#42a5f5', active: '#1976d2' },
//   { name: 'cyan', value: '#26c6da', active: '#00acc1' },
//   { name: 'pink', value: '#ec407a', active: '#d81b60' },
//   { name: 'indigo', value: '#5c6bc0', active: '#3949ab' },
//   { name: 'teal', value: '#26a69a', active: '#00897b' },
//   { name: 'brown', value: '#8d6e63', active: '#6d4c41' },
// ]

export const defaultColorOpts = {
  name: 'default',
  value: primaryColor,
  active: primaryColor,
}

export const doctorEventColorOpts = {
  name: 'doctorEvent',
  value: '#bfbfbf',
  active: '#8c8c8c',
}

export const reduceToColorClass = (acc, { value, colorValue, colorActive }) => {
  acc[`${value}Background`] = {
    backgroundColor: colorValue,
    '& button.edit-button': { backgroundColor: colorValue },
  }
  acc[`${value}Hover`] = { '&:hover': { backgroundColor: colorActive } }
  acc[`${value}Span`] = { color: colorActive }
  return acc
}

export const getColorClassByAppointmentType = (
  appointmentType,
  classes,
  { hover } = { hover: true },
) => {
  const result = [
    classes[`${appointmentType}Background`],
  ]

  if (hover) result.push(classes[`${appointmentType}Hover`])

  return result.join(' ')
}

export const getColorByAppointmentType = (appointmentType) => {
  const found = AppointmentTypeOptions.find(
    (appt) => appt.value === appointmentType,
  )
  if (found) return found.color

  return 'defaultColor'
}

const reduceAppointmentTypeToColor = (
  acc,
  { value: appointmentType, color: colorName, colorValue, colorActive },
) => {
  acc[`background-${appointmentType}`] = {
    backgroundColor: colorValue,
    '& button.edit-button': { backgroundColor: colorValue },
  }
  acc[`hover-${appointmentType}`] = {
    '&:hover': { backgroundColor: colorActive },
  }
  acc[`span-${appointmentType}`] = { color: colorActive }
  return acc
}

export const AppointmentTypeAsColor = AppointmentTypeOptions.reduce(
  reduceAppointmentTypeToColor,
  {},
)

export const AppointmentTypeAsStyles = AppointmentTypeOptions.reduce(
  reduceToColorClass,
  {},
)
