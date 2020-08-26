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
      const redColorStatus = [
        APPOINTMENT_STATUS.PFA_CANCELLED,
        APPOINTMENT_STATUS.PFA_NOSHOW,
        APPOINTMENT_STATUS.PFA_RESCHEDULED,
      ]
      return (
        <div
          style={{
            color: redColorStatus.includes(row.appointmentStatusFk)
              ? 'red'
              : undefined,
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
    {
      name: 'cancellationReason',
      title: 'Reason',
    },
    { name: 'appointmentRemarks', title: 'Remarks' },
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
    { name: 'appointmentStatusFk', title: 'Status' },
    { name: 'appointmentRemarks', title: 'Remarks' },
  ],
  columnExtensions: [
    ...commonExt,
  ],
}
