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
      const { cancellationReason, rescheduleReason } = row
      let title = cancellationReason || ''
      if (title !== '') {
        title = `${title}, ${rescheduleReason}`
      } else title = rescheduleReason

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
