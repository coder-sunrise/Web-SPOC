import React from 'react'
import moment from 'moment'
// components
import { DoctorLabel, VisitStatusTag } from '@/components/_medisys'
import { dateFormat, CodeSelect, DateFormatter, Tooltip } from '@/components'
// utils
import { calculateAgeFromDOB } from '@/utils/dateUtils'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

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
  sortConfig: {
    defaultSorting: [
      { columnName: 'queueNo', direction: 'asc' },
    ],
  },
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
    { name: 'patientContactNo', title: 'Phone' },
    { name: 'action', title: 'Action' },
  ],
}

export const ApptColumnExtensions = [
  {
    columnName: 'visitStatus',
    width: 180,
    render: (row) => <VisitStatusTag row={row} />,
  },
  { columnName: 'patientAccountNo', compare: compareString },
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
    sortingEnabled: false,
  },
  {
    columnName: 'roomNo',
    render: (row) => row.roomNo || '-',
  },
  {
    columnName: 'appointmentTime',
    width: 160,
    render: (row) => {
      const appointmentDate = moment(row.appointmentDate).format(dateFormat)
      return DateFormatter({
        value: `${appointmentDate} ${row.startTime}`,
        full: true,
      })
      // if (row.appointmentTime) {
      //   return DateFormatter({
      //     value: row.appointmentTime,
      //     full: true,
      //   })
      // }

      // if (row.startTime) return formatAppointmentTimes(row.startTime).join(', ')
      // return '-'
    },
  },
]

export const QueueTableConfig = {
  columns: [
    { name: 'visitStatus', title: 'Status' },
    { name: 'queueNo', title: 'Q. No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'patientAccountNo', title: 'Acc. No.' },
    { name: 'gender/age', title: 'Gender / Age' },
    { name: 'doctor', title: 'Doctor' },
    { name: 'appointmentTime', title: 'Appt. Time' },
    { name: 'roomNo', title: 'Room No.' },
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
    { name: 'action', title: 'Action' },
  ],
  leftColumns: [
    'visitStatus',
    'queueNo',
  ],
}

export const QueueColumnExtensions = [
  // {
  //   columnName: 'visitStatus',
  //   width: 180,
  //   render: (row) => <VisitStatusTag row={row} />,
  // },
  { columnName: 'queueNo', width: 80, compare: compareQueueNo },
  { columnName: 'patientAccountNo', compare: compareString },

  { columnName: 'invoiceNo', render: (row) => row.invoiceNo || '-' },
  {
    columnName: 'roomNo',
    render: (row) => row.roomNo || '-',
  },
  // {
  //   columnName: 'patientScheme',
  //   render: (row) => row.patientScheme || '-',
  // },
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
  { columnName: 'invoiceAmount', type: 'number', currency: true },
  { columnName: 'invoicePaymentAmount', type: 'number', currency: true },
  { columnName: 'invoiceGST', type: 'number', currency: true },
  { columnName: 'invoiceOutstanding', type: 'number', currency: true },
  { columnName: 'Action', width: 100, align: 'center' },
  {
    columnName: 'timeIn',
    width: 180,
    type: 'date',
    showTime: true,
    // compare: compareTime,
    // render: (row) =>
    //   DateFormatter({
    //     value: row.timeIn,
    //     full: true,
    //   }),
  },
  {
    columnName: 'timeOut',
    width: 180,
    type: 'date',

    showTime: true,

    // compare: compareTime,
    // render: (row) => {
    //   if (!row.timeOut) return '-'
    //   return DateFormatter({
    //     value: row.timeOut,
    //     full: true,
    //   })
    // },
  },
  {
    columnName: 'gender/age',
    render: (row) => {
      // if (row.visitStatus === VISIT_STATUS.UPCOMING_APPT) {
      //   const { patientProfile } = row
      //   const { genderFK, dob } = patientProfile
      //   const gender = (
      //     <CodeSelect
      //       text
      //       code='ctgender'
      //       value={genderFK}
      //       valueField='id'
      //       labelField='code'
      //     />
      //   )

      //   const age = calculateAgeFromDOB(dob)
      //   return (
      //     <Tooltip title={`${gender}/${age}`}>
      //       <span>
      //         {gender}/{age}
      //       </span>
      //     </Tooltip>
      //   )
      // }
      const { dob, gender = 'U' } = row

      const ageLabel = calculateAgeFromDOB(dob)
      return (
        <Tooltip title={`${gender}/${ageLabel}`}>
          <span>{`${gender}/${ageLabel}`}</span>
        </Tooltip>
      )
    },
    sortingEnabled: false,
  },
  {
    columnName: 'appointmentTime',
    width: 160,
    compare: compareTime,
    render: (row) => {
      if (row.appointmentTime) {
        const appointmentDate = moment(row.appointmentTime).format(dateFormat)
        return DateFormatter({
          value: `${appointmentDate} ${row.appointmentResourceStartTime}`,
          full: true,
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
]
