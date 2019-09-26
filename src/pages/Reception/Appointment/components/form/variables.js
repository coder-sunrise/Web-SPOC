import { timeFormat, timeFormat24Hour } from '@/components'
import { DoctorLabel } from '@/components/_medisys'
import { primaryColor } from '@/assets/jss'

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

export const AppointmentTypeOptions = [
  {
    name: 'All Appointment Type',
    code: 'all',
    color: 'primary',
    colorValue: primaryColor,
    colorActive: primaryColor,
  },
  {
    name: 'Checkup',
    code: 'checkup',
    color: 'red',
    colorValue: '#ef5350',
    colorActive: '#e53935',
  },
  {
    name: 'Aesthetic',
    code: 'aesthetic',
    color: 'green',
    colorValue: '#66bb6a',
    colorActive: '#43a047',
  },
  {
    name: 'Dental',
    code: 'dental',
    color: 'blue',
    colorValue: '#42a5f5',
    colorActive: '#1976d2',
  },
  {
    name: 'Consultation',
    code: 'consultation',
    color: 'cyan',
    colorValue: '#26c6da',
    colorActive: '#00acc1',
  },
  {
    name: 'Pill Checks',
    code: 'pillChecks',
    color: 'pink',
    colorValue: '#ec407a',
    colorActive: '#d81b60',
  },
  {
    name: 'Urgent',
    code: 'urgent',
    color: 'indigo',
    colorValue: '#5c6bc0',
    colorActive: '#3949ab',
  },
]

export const AppointmentDataColExtensions = [
  {
    columnName: 'conflict',
    type: 'error',
    editingEnabled: false,
    disabled: true,
    width: 60,
  },
  // {
  //   columnName: 'clinicianFK',
  //   width: 200,
  //   type: 'codeSelect',
  //   code: 'clinicianprofile',
  //   labelField: 'name',
  //   valueField: 'id',
  //   renderDropdown: (option) => <DoctorLabel doctor={option} />,
  // },
  {
    columnName: 'clinicianFK',
    width: 200,
    type: 'codeSelect',
    code: 'doctorprofile',
    labelField: 'clinicianProfile.name',
    valueField: 'clinicianProfile.id',
    renderDropdown: (option) => <DoctorLabel doctor={option} />,
  },
  {
    columnName: 'appointmentTypeFK',
    type: 'codeSelect',
    code: 'ctappointmenttype',
    labelField: 'displayValue',
    valueField: 'id',
  },
  {
    columnName: 'startTime',
    type: 'time',
    width: 140,
    format: timeFormat,
    // value: '00:00',
  },
  {
    columnName: 'endTime',
    type: 'time',
    width: 140,
    format: timeFormat,
    // value: '00:00',
  },
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
