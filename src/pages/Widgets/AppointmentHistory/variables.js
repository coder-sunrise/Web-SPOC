import React from 'react'
import { dateFormatLong } from '@/utils/format'
import { APPOINTMENT_STATUS, CANCELLATION_REASON_TYPE } from '@/utils/constants'
import { CodeSelect, Tooltip } from '@/components'

export const commonExt = [
  {
    columnName: 'appointmentStatusFk',
    // type: 'codeSelect',
    // code: 'ltappointmentstatus',
    render: (row) => {
      let color
      const redColorStatus = [
        APPOINTMENT_STATUS.PFA_CANCELLED,
        APPOINTMENT_STATUS.PFA_NOSHOW,
        APPOINTMENT_STATUS.PFA_RESCHEDULED,
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
          <CodeSelect
            code='ltappointmentstatus'
            text
            value={row.appointmentStatusFk}
          />
        </div>
      )
    },
  },
  {
    columnName: 'appointmentDate',
    format: dateFormatLong,
    type: 'date',
  },
  {
    columnName: 'startTime',
    type: 'time',
    sortingEnabled: false,
  },
  {
    columnName: 'doctor',
    type: 'codeSelect',
    code: 'clinicianprofile',
    valueField: 'id',
    labelField: 'name',
  },
  {
    columnName: 'cancellationReason',
    render: (row) => {
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
  },
]

export const previousApptTableParams = {
  columns: [
    { name: 'appointmentDate', title: 'Date' },
    { name: 'startTime', title: 'Time' },
    { name: 'doctor', title: 'Doctor' },
    { name: 'appointmentStatusFk', title: 'Status' },
    { name: 'appointmentRemarks', title: 'Remarks' },
    {
      name: 'cancellationReason',
      title: 'Reason',
    },
  ],
  columnExtensions: [
    ...commonExt,
  ],
}

export const futureApptTableParams = {
  columns: [
    { name: 'appointmentDate', title: 'Date' },
    { name: 'startTime', title: 'Time' },
    { name: 'doctor', title: 'Doctor' },
    { name: 'appointmentRemarks', title: 'Remarks' },
    { name: 'appointmentStatusFk', title: 'Status' },
  ],
  columnExtensions: [
    ...commonExt,
  ],
}
