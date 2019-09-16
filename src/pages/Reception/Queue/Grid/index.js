import React, { memo, useState, useMemo } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
// medisys component
import { LoadingWrapper, DoctorLabel } from '@/components/_medisys'
import { CommonTableGrid, DateFormatter } from '@/components'
// medisys component
// sub component
import ActionButton from './ActionButton'
// utils
import { flattenAppointmentDateToCalendarEvents } from '@/pages/Reception/Appointment'
import { filterData, formatAppointmentTimes } from '../utils'
import { StatusIndicator } from '../variables'

const compareQueueNo = (a, b) => {
  const floatA = parseFloat(a)
  const floatB = parseFloat(b)
  if (Number.isNaN(floatA) || Number.isNaN(floatB)) {
    return -1
  }

  return floatA < floatB ? -1 : 1
}

const compareString = (a, b) => a.localeCompare(b)

const FuncConfig = {
  pager: false,
  sort: true,
  sortConfig: {
    defaultSorting: [
      { columnName: 'queueNo', direction: 'asc' },
    ],
  },
}
const TableConfig = {
  columns: [
    { name: 'visitStatus', title: 'Status' },
    { name: 'queueNo', title: 'Q. No.' },
    { name: 'patientName', title: 'Patient Name' },
    { name: 'gender/age', title: 'Gender / Age' },
    { name: 'doctor', title: 'Doctor' },
    { name: 'roomNo', title: 'Room No.' },
    { name: 'timeIn', title: 'Time In' },
    { name: 'timeOut', title: 'Time Out' },
    { name: 'invoiceNo', title: 'Invoice No' },
    { name: 'invoiceAmount', title: 'Invoice Amount' },
    { name: 'appointmentTime', title: 'Appt. Time' },
    { name: 'patientAccountNo', title: 'Acc No.' },
    { name: 'gst', title: 'GST' },
    { name: 'payment', title: 'Payment' },
    { name: 'paymentMode', title: 'Payment Mode' },
    { name: 'company', title: 'Company' },
    { name: 'outstandingBalance', title: 'Outstanding' },
    { name: 'patientScheme', title: 'Scheme' },
    { name: 'patientMobile', title: 'Phone' },
    { name: 'action', title: 'Action' },
  ],
  leftColumns: [
    'visitStatus',
    'queueNo',
  ],
}

const columnExtensions = [
  { columnName: 'queueNo', width: 80, compare: compareQueueNo },
  { columnName: 'patientAccountNo', compare: compareString },
  { columnName: 'visitStatus', type: 'status', width: 150 },
  { columnName: 'paymentMode', width: 150 },
  {
    columnName: 'patientName',
    width: 250,
    compare: compareString,
  },
  { columnName: 'referralCompany', width: 150 },
  { columnName: 'referralPerson', width: 150 },
  { columnName: 'referralRemarks', width: 150 },
  { columnName: 'invoiceAmount', type: 'number', currency: true },
  { columnName: 'payment', type: 'number', currency: true },
  { columnName: 'gst', type: 'number', currency: true },
  { columnName: 'outstandingBalance', type: 'number', currency: true },
  { columnName: 'Action', width: 100, align: 'center' },
  {
    columnName: 'timeIn',
    width: 160,
    render: (row) =>
      DateFormatter({
        value: row.timeIn,
        full: true,
      }),
  },
  { columnName: 'timeOut', width: 160 },
  {
    columnName: 'gender/age',
    render: (row) =>
      row.gender && row.age ? `${row.gender}/${row.age < 0 ? 0 : row.age}` : '',
    sortBy: 'genderFK',
  },
  {
    columnName: 'appointmentTime',
    width: 160,
    render: (row) => {
      if (row.appointmentTime) {
        return DateFormatter({
          value: row.appointmentTime,
          full: true,
        })
      }

      if (row.startTime) return formatAppointmentTimes(row.startTime).join(', ')
      return '-'
    },
  },
  {
    columnName: 'doctor',
    render: (row) => <DoctorLabel doctor={row.doctor} />,
  },
]

const Grid = ({
  dispatch,
  calendarEvents = [],
  filter = StatusIndicator.ALL,
  queueList = [],
  queryingData = false,
  showingVisitRegistration = false,
  handleEditVisitClick,
  onRegisterPatientClick,
  onViewPatientProfileClick,
  handleActualizeAppointment,
  deleteQueue,
}) => {
  const onRowDoubleClick = (row) =>
    handleEditVisitClick({
      visitID: row.id,
    })

  const calendarData = useMemo(
    () => calendarEvents.reduce(flattenAppointmentDateToCalendarEvents, []),
    [
      calendarEvents,
    ],
  )

  const computeQueueListingData = () => {
    if (filter === StatusIndicator.APPOINTMENT) return calendarData
    return filterData(filter, queueList)
  }

  const queueListingData = useMemo(computeQueueListingData, [
    filter,
    calendarEvents,
    queueList,
  ])

  const deleteQueueConfirmation = (row) => {
    const { queueNo, id } = row

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: '',
        openConfirmContent: `Are you sure want to delete this visit (Q No.: ${queueNo})?`,
        onOpenConfirm: () => deleteQueue(id),
      },
    })
  }

  const onClick = (row, id) => {
    switch (id) {
      case '0': // edit visit
      case '0.1': // view visit
        handleEditVisitClick({
          visitID: row.id,
        })
        break
      case '1': // dispense
        router.push(`/reception/queue/dispense/${row.visitReferenceNo}`)
        break
      case '1.1': // billing
        router.push(`/reception/queue/dispense/${row.visitReferenceNo}/billing`)
        break
      case '2': // delete visit
        deleteQueueConfirmation(row)
        break
      case '3': // view patient profile
        onViewPatientProfileClick(row.patientProfileFK)
        break
      case '4': // patient dashboard
        router.push(
          `/reception/queue/patientdashboard?qid=${row.id}&v=${Date.now()}`,
        )
        break
      case '5': // start consultation
        router.push(
          `/reception/queue/patientdashboard?qid=${row.id}&v=${Date.now()}&md2=cons&status=${row.visitStatus}`,
        )
        break
      case '6': // resume consultation
        router.push(
          `/reception/queue/patientdashboard?qid=${row.id}&v=${Date.now()}&md2=cons&action=resume&visit=${row.visitFK}&status=${row.visitStatus}`,
        )
        break
      case '7': // edit consultation
        router.push(
          `/reception/queue/patientdashboard?qid=${row.id}&v=${Date.now()}&md2=cons&action=edit&visit=${row.visitFK}&status=${row.visitStatus}`,
        )
        break
      case '8':
        handleActualizeAppointment({
          patientID: row.patientProfileFk,
          appointmentID: row.id,
        })
        break
      case '9':
        onRegisterPatientClick()
        break
      default:
        break
    }
  }

  const [
    colExtensions,
  ] = useState([
    ...columnExtensions,
    {
      columnName: 'action',
      align: 'center',
      render: (row) => <ActionButton row={row} onClick={onClick} />,
    },
  ])

  const isLoading = showingVisitRegistration ? false : queryingData

  return (
    <div style={{ minHeight: '76.5vh', maxHeight: '76.5vh' }}>
      <LoadingWrapper
        linear
        loading={isLoading}
        text='Refreshing queue listing...'
      >
        <CommonTableGrid
          size='sm'
          // height={700}
          rows={queueListingData}
          columnExtensions={colExtensions}
          FuncProps={FuncConfig}
          onRowDoubleClick={onRowDoubleClick}
          {...TableConfig}
        />
      </LoadingWrapper>
    </div>
  )
}

export default memo(
  connect(({ queueLog, calendar, global, loading }) => ({
    filter: queueLog.currentFilter,
    queueList: queueLog.list,
    calendarEvents: calendar.list,
    showingVisitRegistration: global.showVisitRegistration,
    queryingData:
      loading.effects['queueLog/refresh'] ||
      loading.effects['queueLog/getSessionInfo'] ||
      loading.effects['queueLog/query'] ||
      loading.effects['calendar/getCalendarList'],
  }))(Grid),
)
