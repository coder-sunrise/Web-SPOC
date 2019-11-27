import moment from 'moment'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import {
  timeFormat,
  TextField,
  Field,
  FastField,
  GridContainer,
  GridItem,
  CodeSelect,
  Select,
  Button,
  Tabs,
  CommonTableGrid,
  Popconfirm,
  Tooltip,
} from '@/components'
import { DoctorLabel } from '@/components/_medisys'
import ErrorPopover from './ErrorPopover'

export const AppointmentDataColumn = [
  { name: 'conflicts', title: ' ' },
  { name: 'clinicianFK', title: 'Doctor' },
  { name: 'appointmentTypeFK', title: 'Appointment Type' },
  { name: 'startTime', title: 'Time From' },
  { name: 'endTime', title: 'Appt Duration' },
  // { name: 'endTime', title: 'Time To' },
  { name: 'roomFk', title: 'Room' },
  { name: 'isPrimaryClinician', title: 'Primary Doctor' },
]

const hourOptions = [
  { name: '0 HR', value: 0 },
  { name: '1 HR', value: 1 },
  { name: '2 HR', value: 2 },
  { name: '3 HR', value: 3 },
  { name: '4 HR', value: 4 },
  { name: '5 HR', value: 5 },
  { name: '6 HR', value: 6 },
  { name: '7 HR', value: 7 },
  { name: '8 HR', value: 8 },
]
const minuteOptions = [
  { name: '0 MINS', value: 0 },
  { name: '5 MINS', value: 5 },
  { name: '10 MINS', value: 10 },
  { name: '15 MINS', value: 15 },
  { name: '20 MINS', value: 20 },
  { name: '25 MINS', value: 25 },
  { name: '30 MINS', value: 30 },
  { name: '35 MINS', value: 35 },
  { name: '40 MINS', value: 40 },
  { name: '45 MINS', value: 45 },
  { name: '50 MINS', value: 50 },
  { name: '55 MINS', value: 55 },
]
const setEndTime = (row) => {
  console.log('setEndTime')
  const { startTime, apptDurationHour = 0, apptDurationMinute = 0 } = row
  if (startTime) {
    const startMoment = moment(startTime, 'HH:mm:ss')
    row.endTime = startMoment
      .add(apptDurationHour, 'hour')
      .add(apptDurationMinute, 'minute')
      .format('HH:mm:ss')
  } else row.endTime = undefined

  console.log(row)
}

export const AppointmentDataColExtensions = [
  // {
  //   columnName: 'conflicts',
  //   // type: 'error',
  //   editingEnabled: false,
  //   sortingEnabled: false,
  //   disabled: true,
  //   width: 60,
  //   render: (row) => {
  //     if (row.conflicts && row.conflicts.length > 0)
  //       return <ErrorPopover errors={row.conflicts} />
  //     return null
  //   },
  // },
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
    width: 150,
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
    width: 130,
    code: 'ctappointmenttype',
    labelField: 'displayValue',
    valueField: 'id',
  },
  {
    columnName: 'endTime',
    customEditor: true,
    width: 220,
    render: (
      row,
      { value, control, validSchema, ...restProps },
      { onBlur, onFocus, autoFocus, ...props },
    ) => {
      return (
        <ClickAwayListener
          onClickAway={() => {
            if (onBlur) onBlur()
          }}
        >
          <GridContainer>
            <GridItem xs md={6}>
              <FastField
                name='apptDurationHour'
                render={(arg) => {
                  return (
                    <Select
                      value={row.apptDurationHour}
                      options={hourOptions}
                      {...restProps}
                      onChange={(e) => {
                        const { commitChanges } = control
                        row.apptDurationHour = e
                        setEndTime(row)
                        validSchema(row)
                        commitChanges({
                          changed: {
                            [row.id]: {
                              endTime: row.endTime,
                            },
                          },
                        })
                      }}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs md={6}>
              <FastField
                name='apptDurationMinute'
                render={(arg) => {
                  return (
                    <Select
                      value={row.apptDurationMinute}
                      options={minuteOptions}
                      {...restProps}
                      onChange={(e) => {
                        const { commitChanges } = control
                        row.apptDurationMinute = e
                        setEndTime(row)
                        validSchema(row)
                        commitChanges({
                          changed: {
                            [row.id]: {
                              endTime: row.endTime,
                            },
                          },
                        })
                      }}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </ClickAwayListener>
      )
    },
  },
  {
    columnName: 'startTime',
    type: 'time',
    width: 110,
    format: timeFormat,
    allowClear: false,
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
