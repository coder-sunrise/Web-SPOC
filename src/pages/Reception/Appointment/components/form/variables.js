import moment from 'moment'
import {
  timeFormat24Hour,
  CodeSelect,
  Tooltip,
  Button,
  SyncfusionTimePicker,
} from '@/components'
import Warning from '@material-ui/icons/Error'
import { DoctorLabel, AppointmentTypeLabel } from '@/components/_medisys'
import { dateFormatLong } from '@/utils/format'
import {
  APPOINTMENT_STATUS,
  mapApptStatus,
  INVALID_APPOINTMENT_STATUS,
  CALENDAR_RESOURCE,
} from '@/utils/constants'
import { FileAddTwoTone } from '@ant-design/icons'
import Authorized from '@/utils/Authorized'
import ErrorPopover from './ErrorPopover'
import ApptDuration from './ApptDuration'

const isTimeChange = (from, to) => {
  if (from && to) {
    if (
      moment(from, timeFormat24Hour).format(timeFormat24Hour) ===
      moment(to, timeFormat24Hour).format(timeFormat24Hour)
    ) {
      return false
    }
    return true
  }

  if (!from && !to) {
    return false
  }
  return true
}

export const AppointmentDataColumn = [
  { name: 'conflicts', title: ' ' },
  { name: 'calendarResourceFK', title: 'Resource' },
  { name: 'appointmentTypeFK', title: 'Appointment Type' },
  { name: 'startTime', title: 'Time From' },
  { name: 'endTime', title: 'Appt Duration' },
  { name: 'roomFk', title: 'Room' },
  { name: 'isPrimaryClinician', title: 'Primary Doctor' },
]

export const AppointmentDataColExtensions = (apptTimeIntervel, disabled) => [
  {
    columnName: 'calendarResourceFK',
    width: 150,
    type: 'codeSelect',
    code: 'ctcalendarresource',
    valueField: 'id',
    localFilter: o => o.isActive,
    renderDropdown: option => {
      if (option.resourceType === CALENDAR_RESOURCE.DOCTOR)
        return (
          <DoctorLabel
            doctor={{ clinicianProfile: option.clinicianProfileDto }}
          />
        )
      return option.name
    },
  },
  {
    columnName: 'appointmentTypeFK',
    type: 'codeSelect',
    width: 150,
    code: 'ctappointmenttype',
    labelField: 'displayValue',
    valueField: 'id',
  },
  {
    columnName: 'endTime',
    isReactComponent: true,
    width: 135,
    render: ApptDuration,
  },
  {
    columnName: 'startTime',
    isReactComponent: true,
    width: 130,
    render: e => {
      const { row, columnConfig, cellProps } = e
      const { control, error, validSchema } = columnConfig
      const { apptDurationHour = 0, apptDurationMinute = 0 } = row
      return (
        <div style={{ position: 'relative', paddingRight: 15 }}>
          <SyncfusionTimePicker
            step={apptTimeIntervel}
            value={row.startTime}
            disabled={disabled}
            onChange={time => {
              if (!isTimeChange(row.startTime, time)) return
              const { commitChanges } = control
              row.startTime = time
              if (row.startTime) {
                const _endTime = moment(row.startTime, timeFormat24Hour)
                  .add(apptDurationHour, 'hour')
                  .add(apptDurationMinute, 'minute')
                  .format(timeFormat24Hour)

                row.endTime = _endTime
              } else {
                row.endTime = undefined
              }
              commitChanges({
                changed: {
                  [row.id]: {
                    startTime: row.startTime,
                    endTime: row.endTime,
                  },
                },
              })
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 8,
            }}
          >
            {error && (
              <Tooltip title={error}>
                <Warning color='error' />
              </Tooltip>
            )}
          </div>
        </div>
      )
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
    isDisabled: row => disabled,
    isHiddend: row => {
      return (
        !row.calendarResource ||
        row.calendarResource.resourceType === CALENDAR_RESOURCE.RESOURCE
      )
    },
  },
  {
    columnName: 'conflicts',
    // type: 'error',
    editingEnabled: false,
    sortingEnabled: false,
    disabled: true,
    align: 'center',
    width: 40,
    render: row => {
      if (row.conflicts && row.conflicts.length > 0) {
        return <ErrorPopover errors={row.conflicts} />
      }

      return null
    },
  },
]

export const initialAptInfo = {
  patientName: '',
  patientContactNo: '',
  isEnableRecurrence: false,
}

export const commonExt = (appointmentTypes, handleCopyAppointmentClick) => {
  return [
    {
      columnName: 'appointmentStatus',
      // type: 'codeSelect',
      // code: 'ltappointmentstatus',
      render: row => {
        let color
        const redColorStatus = [
          APPOINTMENT_STATUS.PFA_CANCELLED,
          APPOINTMENT_STATUS.PFA_NOSHOW,
          APPOINTMENT_STATUS.PFA_RESCHEDULED,
          APPOINTMENT_STATUS.TURNEDUPLATE,
        ]
        if (redColorStatus.includes(row.appointmentStatusFk)) color = 'red'
        if (row.appointmentStatusFk === APPOINTMENT_STATUS.CONFIRMED)
          color = 'green'

        return (
          <div
            style={{
              color,
            }}
          >
            <span>{row.appointmentStatus}</span>
          </div>
        )
      },
      width: 140,
    },
    {
      columnName: 'appointmentDate',
      format: dateFormatLong,
      type: 'date',
      width: 100,
    },
    {
      columnName: 'startTime',
      type: 'time',
      sortingEnabled: false,
      width: 80,
    },
    {
      columnName: 'calendarResourceFK',
      type: 'codeSelect',
      code: 'ctcalendarresource',
      valueField: 'id',
      labelField: 'name',
    },
    {
      columnName: 'cancellationReason',
      sortingEnabled: false,
      render: row => {
        const { cancellationReason = '', rescheduleReason = '' } = row
        let reasons = []
        if (cancellationReason !== '') reasons.push(cancellationReason)
        if (rescheduleReason !== '') reasons.push(rescheduleReason)
        const title = reasons.join(', ')
        return (
          <Tooltip title={title}>
            <span>{title}</span>
          </Tooltip>
        )
      },
      width: 150,
    },
    {
      columnName: 'appointmentTypeFK',
      sortingEnabled: false,
      render: row => {
        const { appointmentTypeFK } = row
        const appointmentType = appointmentTypes.find(
          item => item.id === appointmentTypeFK,
        )
        if (!appointmentType) return null
        return (
          <AppointmentTypeLabel
            color={appointmentType.tagColorHex}
            label={appointmentType.displayValue}
          />
        )
      },
      width: 120,
    },
    {
      columnName: 'updateByUser',
      sortingEnabled: false,
      render: row => {
        const content = `${mapApptStatus(row.appointmentStatusFk)} by ${
          row.updateByUser
        }`
        return (
          <Tooltip title={content}>
            <span>{content}</span>
          </Tooltip>
        )
      },
    },
    {
      columnName: 'updateDate',
      type: 'date',
      sortingEnabled: false,
      width: 140,
      render: row => {
        const content = moment(row.updateDate).format('DD MMM YYYY HH:mm')
        return (
          <Tooltip title={content}>
            <span>{content}</span>
          </Tooltip>
        )
      },
    },
    {
      columnName: 'action',
      width: 60,
      sortingEnabled: false,
      align: 'center',
      render: row => {
        const accessRight = Authorized.check('appointment.appointmentdetails')
        const createApptAccessRight = Authorized.check(
          'appointment.newappointment',
        )
        if (
          !accessRight ||
          accessRight.rights !== 'enable' ||
          !createApptAccessRight ||
          createApptAccessRight.rights !== 'enable'
        )
          return
        return (
          INVALID_APPOINTMENT_STATUS.indexOf(row.appointmentStatusFk) ===
            -1 && (
            <Tooltip title='Copy'>
              <Button
                color='transparent'
                style={{ float: 'right' }}
                justIcon
                onClick={() => handleCopyAppointmentClick(row.id)}
              >
                <FileAddTwoTone />
              </Button>
            </Tooltip>
          )
        )
      },
    },
  ]
}

export const previousApptTableParams = (
  appointmentTypes,
  handleCopyAppointmentClick,
) => {
  return {
    columns: [
      { name: 'appointmentDate', title: 'Date' },
      { name: 'startTime', title: 'Time' },
      { name: 'calendarResourceFK', title: 'Resource' },
      { name: 'appointmentTypeFK', title: 'Appt Type' },
      { name: 'appointmentStatus', title: 'Status' },
      {
        name: 'cancellationReason',
        title: 'Reason',
      },
      { name: 'appointmentRemarks', title: 'Remarks' },
      { name: 'updateByUser', title: 'Update By' },
      { name: 'updateDate', title: 'Update On' },
      { name: 'action', title: 'Action' },
    ],
    columnExtensions: [
      ...commonExt(appointmentTypes, handleCopyAppointmentClick),
    ],
  }
}

export const futureApptTableParams = appointmentTypes => {
  return {
    columns: [
      { name: 'appointmentDate', title: 'Date' },
      { name: 'startTime', title: 'Time' },
      { name: 'calendarResourceFK', title: 'Resource' },
      { name: 'appointmentTypeFK', title: 'Appt Type' },
      { name: 'appointmentStatus', title: 'Status' },
      {
        name: 'rescheduleReason',
        title: 'Reason',
      },
      { name: 'appointmentRemarks', title: 'Remarks' },
      { name: 'updateByUser', title: 'Update By' },
      { name: 'updateDate', title: 'Update On' },
    ],
    columnExtensions: [...commonExt(appointmentTypes)],
  }
}
