import React, { Fragment } from 'react'
import moment from 'moment'
// components
import { DoctorLabel, CallingQueueButton } from '@/components/_medisys'
import {
  CodeSelect,
  DateFormatter,
  Tooltip,
  dateFormatLong,
  dateFormatLongWithTimeNoSec12h,
} from '@/components'
// utils
import { calculateAgeFromDOB } from '@/utils/dateUtils'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import Authorized from '@/utils/Authorized'

const compareString = (a, b) => a.localeCompare(b)
const compareDoctor = (a, b) => {
  const titleA = a.clinicianProfile.title ? `${a.clinicianProfile.title} ` : ''
  const nameA = `${titleA}${a.clinicianProfile.name}`

  const titleB = b.clinicianProfile.title ? `${b.clinicianProfile.title} ` : ''
  const nameB = `${titleB}${b.clinicianProfile.name}`
  return nameA.localeCompare(nameB)
}

const compareTime = (a, b) => {
  if (a === '-' && b !== '-') return -1
  if (a !== '-' && b === '-') return 1

  const momentA = moment(a)
  const momentB = moment(b)
  if (momentA.isSameOrBefore(momentB)) return -1
  if (momentA.isSameOrAfter(momentB)) return 1

  return 0
}

const compareQueueNo = (a, b) => {
  const floatA = parseFloat(a)
  const floatB = parseFloat(b)
  if (Number.isNaN(floatA) || Number.isNaN(floatB)) {
    return -1
  }

  return floatA < floatB ? -1 : 1
}

export const FuncConfig = {
  pager: false,
  sort: true,
  columnReorderable: true,
  columnSelectable: true,
  sortConfig: {
    defaultSorting: [
      { columnName: 'queueNo', direction: 'asc' },
    ],
  },
  resizable: true,
  selectRowHighlightable: true,
}

export const AppointmentTableConfig = {
  columns: [
    { name: 'visitStatus', title: 'Status' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'patientAccountNo', title: 'Acc. No.' },
    { name: 'gender/age', title: 'Gender / Age' },
    { name: 'doctorName', title: 'Doctor' },
    { name: 'appointmentTime', title: 'Appt. Time' },
    { name: 'roomNo', title: 'Room No.' },
    { name: 'remarks', title: 'Remarks' },
    { name: 'patientContactNo', title: 'Phone' },
    { name: 'action', title: 'Action' },
  ],
  identifier: 'reception_appointment',
}

export const ApptColumnExtensions = [
  // {
  //   columnName: 'visitStatus',
  //   width: 180,
  //   render: (row) => <VisitStatusTag row={row} />,
  // },
  { columnName: 'patientAccountNo', compare: compareString, width: 120 },
  {
    columnName: 'patientName',
    width: 250,
    compare: compareString,
  },
  {
    columnName: 'doctorName',
    width: 250,
    render: (row) => {
      const _title = row.title ? `${row.title} ` : ''
      return `${_title}${row.doctorName}`
    },
  },
  {
    columnName: 'gender/age',
    render: (row) => {
      const { genderFK, dob, patientProfileFk } = row
      if (!patientProfileFk) return null
      const gender = (
        <CodeSelect
          text
          code='ctgender'
          value={genderFK}
          valueField='id'
          labelField='code'
        />
      )
      const age = calculateAgeFromDOB(dob)
      return (
        <React.Fragment>
          {gender}
          <span>/{age}</span>
        </React.Fragment>
      )
    },
    width: 100,
    sortingEnabled: false,
  },
  {
    columnName: 'roomNo',
    render: (row) => row.roomNo || '-',
    width: 120,
  },
  {
    columnName: 'remarks',
    width: 180,
    render: (row) => row.remarks || '-',
  },
  {
    columnName: 'appointmentTime',
    width: 170,
    type: 'date',
    showTime: true,
  },
  {
    columnName: 'patientContactNo',
    width: 120,
  },
]

export const QueueTableConfig = {
  columns: [
    { name: 'visitStatus', title: 'Status' },
    { name: 'queueNo', title: 'Q. No.' },
    { name: 'patientReferenceNo', title: 'Ref. No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'patientAccountNo', title: 'Acc. No.' },
    { name: 'gender/age', title: 'Gender / Age' },
    { name: 'doctor', title: 'Doctor' },
    { name: 'appointmentTime', title: 'Appt. Time' },
    { name: 'roomNo', title: 'Room No.' },
    { name: 'remarks', title: 'Remarks' },
    { name: 'timeIn', title: 'Time In' },
    { name: 'timeOut', title: 'Time Out' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceStatus', title: 'Invoice Status' },
    { name: 'invoiceAmount', title: 'Invoice Amt.' },
    // { name: 'invoicePaymentMode', title: 'Payment Mode' },
    { name: 'invoiceGST', title: 'GST' },
    { name: 'invoicePaymentAmount', title: 'Payment' },
    { name: 'invoiceOutstanding', title: 'Outstanding' },
    { name: 'patientScheme', title: 'Scheme' },
    { name: 'patientMobile', title: 'Phone' },
    { name: 'visitOrderTemplate', title: 'Visit Order Template' },
    { name: 'action', title: 'Action' },
  ],
  leftColumns: [
    'visitStatus',
    'queueNo',
    'patientName',
  ],
  identifier: 'reception',
}

export const QueueColumnExtensions = [
  // {
  //   columnName: 'visitStatus',
  //   width: 180,
  //   render: (row) => <VisitStatusTag row={row} />,
  // },
  {
    columnName: 'queueNo',
    width: 80,
    compare: compareQueueNo,
    render: (row) => {
      return (
        <Fragment>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{row.queueNo}</span>
            <div>
              {row.visitStatus !== VISIT_STATUS.UPCOMING_APPT && (
                <Authorized authority='openqueuedisplay'>
                  <CallingQueueButton
                    qId={row.queueNo}
                    roomNo={row.roomNo}
                    doctor={row.doctor}
                  />
                </Authorized>
              )}
            </div>
          </div>
        </Fragment>
      )
    },
  },
  { columnName: 'patientAccountNo', compare: compareString, width: 120 },

  { columnName: 'invoiceNo', width: 120 },
  {
    columnName: 'roomNo',
    width: 120,
  },
  {
    columnName: 'remarks',
    width: 180,
  },
  {
    columnName: 'patientScheme',
    width: 200,
  },
  {
    columnName: 'invoiceStatus',
    width: 120,
  },
  {
    columnName: 'patientMobile',
    width: 120,
  },
  // {
  //   columnName: 'invoicePaymentMode',
  //   width: 150,
  //   render: (row) => row.invoicePaymentMode || '-',
  // },
  {
    columnName: 'patientName',
    width: 250,
    compare: compareString,
  },
  { columnName: 'referralCompany', width: 150 },
  { columnName: 'referralPerson', width: 150 },
  { columnName: 'referralRemarks', width: 150 },
  { columnName: 'invoiceAmount', type: 'number', currency: true, width: 120 },
  {
    columnName: 'invoicePaymentAmount',
    type: 'number',
    currency: true,
    width: 120,
  },
  { columnName: 'invoiceGST', type: 'number', currency: true, width: 120 },
  {
    columnName: 'invoiceOutstanding',
    type: 'number',
    currency: true,
    width: 120,
  },
  {
    columnName: 'timeIn',
    width: 170,
    type: 'date',
    showTime: true,
  },
  {
    columnName: 'timeOut',
    width: 170,
    type: 'date',
    showTime: true,
  },
  {
    columnName: 'gender/age',
    render: (row) => {
      const { dob, gender = 'U' } = row

      const ageLabel = calculateAgeFromDOB(dob)
      return (
        <Tooltip title={`${gender}/${ageLabel}`}>
          <span>{`${gender}/${ageLabel}`}</span>
        </Tooltip>
      )
    },
    width: 100,
    sortingEnabled: false,
  },
  {
    columnName: 'appointmentTime',
    width: 160,
    type: 'date',
    showTime: true,
    // compare: compareTime,
    render: (row) => {
      if (row.appointmentTime) {
        // const appointmentDate = moment(row.appointmentTime).format('MM DD YYYY')
        const appointmentDate = moment(row.appointmentTime).format(
          dateFormatLong,
        )
        return DateFormatter({
          value: `${appointmentDate} ${row.appointmentResourceStartTime}`,
          format: dateFormatLongWithTimeNoSec12h,
        })
      }
      return '-'
    },
  },
  {
    columnName: 'doctor',
    compare: compareDoctor,
    render: (row) => <DoctorLabel doctor={row.doctor} hideMCR />,
  },
  {
    columnName: 'visitOrderTemplate',
    width: 180,
  },
]
