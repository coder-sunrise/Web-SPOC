import React from 'react'
import { dateFormatLong } from '@/utils/format'
import {
  APPOINTMENT_STATUS,
  CANCELLATION_REASON_TYPE,
  mapApptStatus,
} from '@/utils/constants'
import { CodeSelect, Tooltip, timeFormat24Hour } from '@/components'
import moment from 'moment'
import { AppointmentTypeLabel } from '@/components/_medisys'

export const commonExt = appointmentTypes => {
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
      width: 55,
      render: row =>
        `${moment(row.startTime, timeFormat24Hour).format(timeFormat24Hour)}`,
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
  ]
}

export const previousApptTableParams = appointmentTypes => {
  return {
    columns: [
      { name: 'appointmentDate', title: 'Date' },
      { name: 'startTime', title: 'Time' },
      { name: 'calendarResourceFK', title: 'Resource' },
      { name: 'appointmentTypeFK', title: 'Appt Type' },
      { name: 'appointmentStatus', title: 'Status' },
      { name: 'cancellationReason', title: 'Reason' },
      { name: 'appointmentRemarks', title: 'Remarks' },
      { name: 'updateByUser', title: 'Update By' },
      { name: 'updateDate', title: 'Update On' },
    ],
    columnExtensions: [...commonExt(appointmentTypes)],
  }
}

export const futureApptTableParams = appointmentTypes => {
  return {
    columns: [
      { name: 'appointmentDate', title: 'Date' },
      { name: 'startTime', title: 'Time' },
      { name: 'calendarResourceFK', title: 'Resource' },
      { name: 'appointmentRemarks', title: 'Remarks' },
      { name: 'appointmentStatus', title: 'Status' },
    ],
    columnExtensions: [...commonExt(appointmentTypes)],
  }
}
