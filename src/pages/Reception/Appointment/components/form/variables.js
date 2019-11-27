import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { timeFormat, TextField, Select } from '@/components'
import { DoctorLabel } from '@/components/_medisys'

import ErrorPopover from './ErrorPopover'

export const AppointmentDataColumn = [
  { name: 'conflicts', title: ' ' },
  { name: 'clinicianFK', title: 'Doctor' },
  { name: 'appointmentTypeFK', title: 'Appointment Type' },
  { name: 'startTime', title: 'Time From' },
  { name: 'endTime', title: 'Time To' },
  // { name: 'appointmentDuration', title: 'Appt Duration' },
  { name: 'roomFk', title: 'Room' },
  { name: 'isPrimaryClinician', title: 'Primary Doctor' },
]

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
    columnName: 'appointmentDuration',
    customEditor: true,
    render: (
      row,
      { value, control, validSchema, ...restProps },
      { onBlur, onFocus, autoFocus, ...props },
    ) => {
      // console.log(restProps, props)
      return (
        <ClickAwayListener
          onClickAway={() => {
            // if (onBlur) onBlur()
          }}
        >
          <div>
            <span>Test:This is custom editor control</span>
            <TextField
              text
              autoFocus={autoFocus}
              {...restProps}
              defaultValue={row.endTime} // test value only
              // onChange={(e) => (row.appointmentDuration = e.target.value)}
              onBlur={(e) => {
                const { commitChanges } = control
                row.appointmentDuration = e.target.value
                validSchema(row)
                commitChanges({
                  changed: {
                    [row.id]: {
                      appointmentDuration: e.target.value,
                    },
                  },
                })
              }}
            />
            <Select
              value={row.clinicianFK}
              onChange={(v) => {
                const { commitChanges } = control

                row.clinicianFK = v
                validSchema(row)
                commitChanges({
                  changed: {
                    [row.id]: {
                      clinicianFK: row.clinicianFK,
                    },
                  },
                })
              }}
              options={[
                { value: 0, name: 'Monday' },
                { value: 1, name: 'Tuesday' },
                { value: 2, name: 'Wednesday' },
                { value: 3, name: 'Thursday' },
                { value: 4, name: 'Friday' },
                { value: 5, name: 'Saturday' },
                { value: 6, name: 'Sunday' },
              ]}
              {...restProps}
            />
          </div>
        </ClickAwayListener>
      )
    },
  },
  {
    columnName: 'startTime',
    type: 'time',
    width: 140,
    format: timeFormat,
    allowClear: false,
    // value: '00:00',
  },
  {
    columnName: 'endTime',
    type: 'time',
    width: 140,
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
