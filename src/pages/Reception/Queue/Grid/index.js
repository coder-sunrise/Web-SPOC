import React, { useMemo } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
// medisys component
import { LoadingWrapper, DoctorLabel } from '@/components/_medisys'
import {
  Badge,
  CommonTableGrid,
  DateFormatter,
  notification,
} from '@/components'
// medisys component
// sub component
import ActionButton from './ActionButton'
// utils
import { getAppendUrl } from '@/utils/utils'
import { flattenAppointmentDateToCalendarEvents } from '@/pages/Reception/Appointment'
import { filterData, formatAppointmentTimes } from '../utils'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
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
  {
    columnName: 'visitStatus',
    width: 180,
    render: (row) => {
      const { visitStatus: value } = row
      // const hasBadge = Object.keys(VISIT_STATUS).map((key) => VISIT_STATUS[key])
      let color = '#999999'
      let hasBadge = true
      switch (value.toUpperCase()) {
        case VISIT_STATUS.WAITING:
          color = '#4255BD'
          break
        case VISIT_STATUS.DISPENSE:
        case VISIT_STATUS.BILLING:
        case VISIT_STATUS.ORDER_UPDATED:
          color = '#098257'
          break
        case VISIT_STATUS.IN_CONS:
        case VISIT_STATUS.PAUSED:
          color = '#CF1322'
          break
        case VISIT_STATUS.UPCOMING_APPT:
          color = '#999999'
          break
        default:
          color = '#999999'
          hasBadge = false
          break
      }
      // return value
      return hasBadge ? (
        <Badge
          style={{
            padding: 6,
            fontSize: '.75rem',
            backgroundColor: color,
          }}
          color={color}
        >
          {value}
        </Badge>
      ) : (
        <span
          style={{
            padding: 8,
            fontSize: '.875rem',
          }}
        >
          {value}
        </span>
      )
    },
  },
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
    render: (row) => {
      const { age = 0, gender = 'U' } = row
      const ageLabel = age < 0 ? 0 : age
      return `${gender}/${ageLabel}`
    },
    sortingEnabled: false,
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
    render: (row) => <DoctorLabel doctor={row.doctor} hideMCR />,
  },
]

const gridHeight = window.innerHeight - 250

const Grid = ({
  dispatch,
  user,
  calendarEvents = [],
  filter = StatusIndicator.ALL,
  selfOnly = false,
  queueList = [],
  queryingList = false,
  queryingFormData = false,
  showingVisitRegistration = false,
  handleEditVisitClick,
  onRegisterPatientClick,
  onViewPatientProfileClick,
  handleActualizeAppointment,
}) => {
  const deleteQueue = (id) => {
    dispatch({
      type: 'queueLog/deleteQueueByQueueID',
      payload: {
        id,
      },
    })
  }

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
    let data = [
      ...queueList,
    ]

    const { clinicianProfile: { doctorProfile } } = user.data

    if (selfOnly)
      data = data.filter((item) => {
        const {
          doctor: {
            clinicianProfile: { doctorProfile: assignedDoctorProfile },
          },
        } = item

        return doctorProfile
          ? assignedDoctorProfile.id === doctorProfile.id
          : false
      })

    return filterData(filter, data)
  }

  const queueListingData = useMemo(computeQueueListingData, [
    filter,
    selfOnly,
    calendarEvents,
    queueList,
    user,
  ])

  const deleteQueueConfirmation = (row) => {
    const { queueNo, id } = row

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: '',
        openConfirmContent: `Are you sure want to delete this visit (Q No.: ${queueNo})?`,
        onConfirmSave: () => deleteQueue(id),
      },
    })
  }

  const isAssignedDoctor = (row) => {
    const {
      doctor: {
        clinicianProfile: { doctorProfile: assignedDoctorProfile, title, name },
      },
      visitStatus,
    } = row
    const { clinicianProfile: { doctorProfile } } = user.data

    if (!doctorProfile) {
      notification.error({
        message: 'Unauthorized Access',
      })
      return false
    }

    // if (visitStatus === 'IN CONS') {
    //   if (assignedDoctorProfile.id !== doctorProfile.id) {
    //     dispatch({
    //       type: 'global/updateAppState',
    //       payload: {
    //         openConfirm: true,
    //         openConfirmTitle: '',
    //         openConfirmContent: `Are you sure to overwrite ${title ||
    //           ''} ${name} consultation?`,
    //         onConfirmSave: () => null,
    //       },
    //     })
    //     return false
    //   }
    // }

    // if (assignedDoctorProfile.id !== doctorProfile.id) {
    //   notification.error({
    //     message: `You cannot resume other doctor's consultation.`,
    //   })
    //   return false
    // }

    return true
  }

  const onClick = (row, id) => {
    switch (id) {
      case '0': // edit visit
      case '0.1': // view visit
        handleEditVisitClick({
          visitID: row.id,
        })
        break
      case '1': {
        // dispense
        // const parameters = {
        //   vis: row.id,
        //   pid: row.patientProfileFK,
        //   md2: 'disp',
        // }
        // // history.push(getAppendUrl(parameters, '/reception/queue/dispense'))
        // router.push(getAppendUrl(parameters, '/reception/queue'))
        const version = Date.now()
        dispatch({
          type: `dispense/start`,
          payload: {
            id: row.visitFK,
            version,
          },
        }).then((o) => {
          if (o)
            router.push(
              `/reception/queue/patientdashboard?qid=${row.id}&vid=${row.visitFK}&v=${version}&md2=dsps`,
            )
        })

        break
      }
      case '1.1': {
        // billing
        const version = Date.now()
        const parameters = {
          qid: row.id,
          vid: row.visitFK.id,
          pid: row.patientProfileFK,
          v: version,
          md2: 'bill',
        }
        router.push(
          getAppendUrl(parameters, '/reception/queue/patientdashboard'),
        )
        break
      }
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
      case '5': {
        // start consultation
        const valid = isAssignedDoctor(row)
        if (valid) {
          const version = Date.now()
          dispatch({
            type: 'codetable/fetchCodes',
            payload: {
              code: 'ctservice',
              filter: {
                'serviceFKNavigation.IsActive': true,
                combineCondition: 'or',
              },
            },
          })

          dispatch({
            type: `consultation/start`,
            payload: {
              id: row.visitFK,
              version,
            },
          }).then((o) => {
            if (o)
              router.push(
                `/reception/queue/patientdashboard?qid=${row.id}&cid=${o.id}&v=${version}&md2=cons`,
              )
          })
        }
        break
      }
      case '6': {
        // resume consultation
        const valid = isAssignedDoctor(row)
        if (valid) {
          const version = Date.now()

          if (row.visitStatus === 'PAUSED') {
            dispatch({
              type: `consultation/resume`,
              payload: {
                id: row.visitFK,
                version,
              },
            }).then((o) => {
              if (o)
                router.push(
                  `/reception/queue/patientdashboard?qid=${row.id}&cid=${row.clinicalObjectRecordFK}&v=${version}&md2=cons`,
                )
            })
          } else {
            router.push(
              `/reception/queue/patientdashboard?qid=${row.id}&cid=${row.clinicalObjectRecordFK}&v=${version}&md2=cons`,
            )
          }
        }

        break
      }
      case '7': {
        // edit consultation
        const valid = isAssignedDoctor(row)
        if (valid) {
          const version = Date.now()

          dispatch({
            type: `consultation/edit`,
            payload: {
              id: row.visitFK,
              version,
            },
          }).then((o) => {
            if (o)
              router.push(
                `/reception/queue/patientdashboard?qid=${row.id}&cid=${o.id}&v=${version}&md2=cons`,
              )
          })
        }
        break
      }
      case '8': {
        handleActualizeAppointment({
          patientID: row.patientProfileFk,
          appointmentID: row.id,
        })
        break
      }
      case '9':
        onRegisterPatientClick()
        break
      default:
        break
    }
  }

  const isLoading = showingVisitRegistration ? false : queryingList
  let loadingText = 'Refreshing queue...'
  if (!queryingList && queryingFormData) loadingText = ''

  return (
    <div style={{ minHeight: '76vh' }}>
      <LoadingWrapper
        linear
        loading={isLoading || queryingFormData}
        text={loadingText}
      >
        <CommonTableGrid
          size='sm'
          TableProps={{ height: gridHeight }}
          rows={queueListingData}
          columnExtensions={[
            ...columnExtensions,
            {
              columnName: 'action',
              align: 'center',
              render: (row) => {
                return <ActionButton row={row} onClick={onClick} />
              },
            },
          ]}
          FuncProps={FuncConfig}
          onRowDoubleClick={onRowDoubleClick}
          {...TableConfig}
        />
      </LoadingWrapper>
    </div>
  )
}

export default connect(({ queueLog, calendar, global, loading, user }) => ({
  user,
  filter: queueLog.currentFilter,
  selfOnly: queueLog.selfOnly,
  queueList: queueLog.list || [],
  calendarEvents: calendar.list || [],
  showingVisitRegistration: global.showVisitRegistration,
  queryingList:
    loading.effects['queueLog/refresh'] ||
    loading.effects['queueLog/getSessionInfo'] ||
    loading.effects['queueLog/query'] ||
    loading.effects['calendar/getCalendarList'],
  queryingFormData: loading.effects['dispense/initState'],
}))(Grid)
