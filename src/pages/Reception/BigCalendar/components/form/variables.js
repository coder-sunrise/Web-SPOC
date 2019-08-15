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
  { name: 'timeFrom', title: 'Time From' },
  { name: 'timeTo', title: 'Time To' },
  { name: 'roomFK', title: 'Room' },
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
  { columnName: 'timeFrom', type: 'time', format: 'hh:mm a' },
  { columnName: 'timeTo', type: 'time', format: 'hh:mm a' },
  {
    columnName: 'isPrimaryClinician',
    type: 'radio',
  },
  {
    columnName: 'clinicianFK',
    type: 'select',
    labelField: 'name',
    valueField: 'id',
  },
  {
    columnName: 'roomFK',
    type: 'codeSelect',
    code: 'ctroom',
  },
  {
    columnName: 'appointmentTypeFK',
    type: 'codeSelect',
    code: 'ctappointmenttype',
    mode: 'multiple',
  },
]

export const initialAptInfo = {
  patientName: '',
  patientContactNo: '',
  isEnableRecurrence: false,
}
