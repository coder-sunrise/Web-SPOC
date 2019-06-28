import moment from 'moment'

export const RECURRENCE_PATTERN = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
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

export const days = [
  { value: 'monday', name: 'Monday' },
  { value: 'tuesday', name: 'Tuesday' },
  { value: 'wednesday', name: 'Wednesday' },
  { value: 'thursday', name: 'Thursday' },
  { value: 'friday', name: 'Friday' },
  { value: 'saturday', name: 'Saturday' },
  { value: 'sunday', name: 'Sunday' },
]

export const AppointmentDataColumn = [
  { name: 'doctor', title: 'Doctor' },
  { name: 'appointmentType', title: 'Appointment Type' },
  { name: 'timeFrom', title: 'Time From' },
  { name: 'timeTo', title: 'Time To' },
  { name: 'room', title: 'Room' },
  { name: 'primaryDoctor', title: 'Primary Doctor' },
]

export const AppointmentDataColExtensions = [
  { columnName: 'timeFrom', type: 'time', format: 'hh:mm a' },
  { columnName: 'timeTo', type: 'time', format: 'hh:mm a' },
  {
    columnName: 'primaryDoctor',
    type: 'radio',
  },
  {
    columnName: 'doctor',
    type: 'select',
    options: [
      { name: 'Medisys', value: 'medisys' },
    ],
  },
  {
    columnName: 'room',
    type: 'select',
    options: [
      { name: 'Room 1', value: 'room1' },
      { name: 'Room 2', value: 'room2' },
      { name: 'Room 3', value: 'room3' },
    ],
  },
  { columnName: 'appointmentType', type: 'select' },
]

const generateDummyAppointmentData = () => {
  let data = []
  for (let i = 0; i < 5; i++) {
    data.push({
      id: i,
      doctor: 'cheah',
      appointmentType: 'Check up',
      timeFrom: moment().format('hh:mm a'),
      timeTo: moment().format('hh:mm a'),
      room: `Room ${i}`,
    })
  }
  return data
}

export const DummyAppointmentData = generateDummyAppointmentData()

export const _dateFormat = 'DD MMM YYYY'

export const initialAptInfo = {
  patientName: '',
  contactNo: '',
  doctor: '',
  bookBy: '',
  bookDate: '',
  remarks: '',
  enableRecurrence: false,
  recurrencePattern: 'daily',
  recurrenceRange: RECURRENCE_RANGE.AFTER,
  occurence: 1,
}
