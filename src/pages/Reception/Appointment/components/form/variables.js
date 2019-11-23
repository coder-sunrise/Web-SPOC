import { timeFormat } from '@/components'
import { DoctorLabel } from '@/components/_medisys'
import ErrorPopover from './ErrorPopover'

export const AppointmentDataColumn = [
  { name: 'conflicts', title: ' ' },
  { name: 'clinicianFK', title: 'Doctor' },
  { name: 'appointmentTypeFK', title: 'Appointment Type' },
  { name: 'startTime', title: 'Time From' },
  { name: 'endTime', title: 'Time To' },
  { name: 'roomFk', title: 'Room' },
  { name: 'isPrimaryClinician', title: 'Primary Doctor' },
]

export const AppointmentDataColExtensions = [
  {
    columnName: 'conflicts',
    // type: 'error',
    editingEnabled: false,
    sortingEnabled: false,
    disabled: true,
    width: 60,
    render: (row) => {
      if (row.conflicts && row.conflicts.length > 0)
        return <ErrorPopover errors={row.conflicts} />
      return null
    },
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
    remoteFilter: {
      'clinicianProfile.isActive': true,
    },
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
