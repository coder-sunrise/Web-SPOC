import { timeFormat } from '@/components'
import { DoctorLabel } from '@/components/_medisys'

import ErrorPopover from './ErrorPopover'
import ApptDuration from './ApptDuration'

export const AppointmentDataColumn = [
  { name: 'conflicts', title: ' ' },
  { name: 'clinicianFK', title: 'Doctor' },
  { name: 'appointmentTypeFK', title: 'Appointment Type' },
  { name: 'startTime', title: 'Time From' },
  { name: 'endTime', title: 'Appt Duration' },
  { name: 'roomFk', title: 'Room' },
  { name: 'isPrimaryClinician', title: 'Primary Doctor' },
]

export const AppointmentDataColExtensions = [
  {
    columnName: 'clinicianFK',
    width: 150,
    type: 'codeSelect',
    code: 'doctorprofile',
    labelField: 'clinicianProfile.name',
    valueField: 'clinicianProfile.id',
    remoteFilter: {
      'clinicianProfile.isActive': false,
    },
    renderDropdown: (option) => <DoctorLabel doctor={option} />,
  },
  {
    columnName: 'appointmentTypeFK',
    type: 'codeSelect',
    width: 130,
    code: 'ctappointmenttype',
    labelField: 'displayValue',
    valueField: 'id',
  },
  {
    columnName: 'endTime',
    isReactComponent: true,
    width: 220,
    render: ApptDuration,
  },
  {
    columnName: 'startTime',
    type: 'time',
    width: 110,
    format: timeFormat,
    allowClear: false,
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
