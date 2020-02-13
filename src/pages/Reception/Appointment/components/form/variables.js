import moment from 'moment'
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
    onChange: (props) => {
      const { row } = props
      const { apptDurationHour = 0, apptDurationMinute = 0 } = row
      let { startTime } = row
      let _endTime = row.endTime

      if (startTime) {
        const startMoment = moment(startTime, 'HH:mm A')
        _endTime = startMoment
          .add(apptDurationHour, 'hour')
          .add(apptDurationMinute, 'minute')
          .format('HH:mm')
        row.endTime = _endTime
      }
    },
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
