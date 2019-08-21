import { timeFormat } from '@/components'

export const RECURRENCE_PATTERN = {
  DAILY: 1,
  WEEKLY: 2,
  MONTHLY: 3,
}

export const recurrencePattern = [
  { name: 'Daily', value: RECURRENCE_PATTERN.DAILY },
  { name: 'Weekly', value: RECURRENCE_PATTERN.WEEKLY },
  { name: 'Monthly', value: RECURRENCE_PATTERN.MONTHLY },
]

export const RECURRENCE_RANGE = {
  AFTER: 'after',
  BY: 'by',
}

export const DAYS_OF_WEEK = {
  0: 'Monday',
  1: 'Tuesday',
  2: 'Wednesday',
  3: 'Thursday',
  4: 'Friday',
  5: 'Saturday',
  6: 'Sunday',
}

export const days = [
  { value: 0, name: 'Monday' },
  { value: 1, name: 'Tuesday' },
  { value: 2, name: 'Wednesday' },
  { value: 3, name: 'Thursday' },
  { value: 4, name: 'Friday' },
  { value: 5, name: 'Saturday' },
  { value: 6, name: 'Sunday' },
]

export const AppointmentDataColumn = [
  // { name: 'conflict', title: ' ' },
  { name: 'clinicianFK', title: 'Doctor' },
  { name: 'appointmentTypeFK', title: 'Appointment Type' },
  { name: 'startTime', title: 'Time From' },
  { name: 'endTime', title: 'Time To' },
  { name: 'roomFk', title: 'Room' },
  { name: 'isPrimaryClinician', title: 'Primary Doctor' },
]

export const AppointmentDataColExtensions = [
  {
    columnName: 'conflict',
    type: 'error',
    editingEnabled: false,
    disabled: true,
    width: 60,
  },
  {
    columnName: 'clinicianFK',
    type: 'select',
    labelField: 'name',
    valueField: 'id',
    width: 200,
  },
  {
    columnName: 'appointmentTypeFK',
    type: 'codeSelect',
    code: 'ctappointmenttype',
    mode: 'multiple',
  },
  {
    columnName: 'startTime',
    type: 'time',
    width: 140,
    format: timeFormat,
  },
  { columnName: 'endTime', type: 'time', width: 140, format: timeFormat },
  {
    columnName: 'roomFk',
    width: 110,
    type: 'codeSelect',
    code: 'ctroom',
  },
  {
    columnName: 'isPrimaryClinician',
    width: 110,
    type: 'radio',
  },
]

export const initialAptInfo = {
  patientName: '',
  patientContactNo: '',
  isEnableRecurrence: false,
}
