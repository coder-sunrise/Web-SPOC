import React from 'react'
import { dateFormatLong } from '@/utils/format'
import { APPOINTMENT_STATUS, CANCELLATION_REASON_TYPE } from '@/utils/constants'
import { CodeSelect, Tooltip } from '@/components'

export const commonExt = [
  {
    columnName: 'appointmentStatusFk',
    type: 'codeSelect',
    code: 'ltappointmentstatus',
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
      const {
        appointmentStatusFk,
        cancellationReasonTypeFK,
        cancellationReason,
      } = row
      const appointmentStatus = parseInt(appointmentStatusFk, 10)
      const title = cancellationReason || ''
      if (appointmentStatus === APPOINTMENT_STATUS.CANCELLED) {
        if (cancellationReasonTypeFK === CANCELLATION_REASON_TYPE.NOSHOW)
          return (
            <CodeSelect
              code='ltcancelreasontype'
              value={cancellationReasonTypeFK}
              text
            />
          )
        if (cancellationReasonTypeFK === CANCELLATION_REASON_TYPE.OTHERS)
          return (
            <Tooltip title={title}>
              <span>{title}</span>
            </Tooltip>
          )
      }
      return ''
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
