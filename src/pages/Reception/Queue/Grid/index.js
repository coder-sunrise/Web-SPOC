import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
// material ui
import { Popover } from '@material-ui/core'
// medisys component
import { LoadingWrapper, DoctorLabel } from '@/components/_medisys'
import { CommonTableGrid, DateFormatter, notification } from '@/components'
// medisys component
// sub component
import ActionButton from './ActionButton'
import StatusBadge from './StatusBadge'
// utils
import { getAppendUrl } from '@/utils/utils'
import { calculateAgeFromDOB } from '@/utils/dateUtils'
import { flattenAppointmentDateToCalendarEvents } from '@/pages/Reception/Appointment'
import { filterData, formatAppointmentTimes } from '../utils'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { StatusIndicator } from '../variables'
import { GENDER } from '@/utils/constants'

const compareQueueNo = (a, b) => {
  const floatA = parseFloat(a)
  const floatB = parseFloat(b)
  if (Number.isNaN(floatA) || Number.isNaN(floatB)) {
    return -1
  }

  return floatA < floatB ? -1 : 1
}

const compareString = (a, b) => a.localeCompare(b)
const compareDoctor = (a, b) =>
  a.clinicianProfile.name.localeCompare(b.clinicianProfile.name)

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
    { name: 'invoicePaymentMode', title: 'Payment Mode' },
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

const columnExtensions = [
  {
    columnName: 'visitStatus',
    width: 180,
    render: (row) => <StatusBadge row={row} />,
  },
  { columnName: 'queueNo', width: 80, compare: compareQueueNo },
  { columnName: 'patientAccountNo', compare: compareString },
  { columnName: 'visitStatus', type: 'status', width: 150 },
  { columnName: 'invoiceNo', render: (row) => row.invoiceNo || '-' },
  {
    columnName: 'roomNo',
    render: (row) => row.roomNo || '-',
  },
  {
    columnName: 'patientScheme',
    render: (row) => row.patientScheme || '-',
  },
  {
    columnName: 'invoicePaymentMode',
    width: 150,
    render: (row) => row.invoicePaymentMode || '-',
  },
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
    width: 160,
    render: (row) =>
      DateFormatter({
        value: row.timeIn,
        full: true,
      }),
  },
  {
    columnName: 'timeOut',
    width: 160,
    render: (row) =>
      DateFormatter({
        value: row.timeOut,
        full: true,
      }),
  },
  {
    columnName: 'gender/age',
    render: (row) => {
      if (row.visitStatus === VISIT_STATUS.UPCOMING_APPT) {
        const { patientProfile } = row
        const { genderFK, dob } = patientProfile
        const gender = GENDER[genderFK] ? GENDER[genderFK].substr(0, 1) : 'U'
        const age = calculateAgeFromDOB(dob)
        return `${gender}/${age}`
      }
      const { dob, gender = 'U' } = row

      const ageLabel = calculateAgeFromDOB(dob)
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
    compare: compareDoctor,
    render: (row) => <DoctorLabel doctor={row.doctor} hideMCR />,
  },
]

const gridHeight = window.innerHeight - 250

const Grid = ({
  dispatch,
  codetable,
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
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)
  const handlePopoverOpen = (event) => setAnchorEl(event.currentTarget)

  const handlePopoverClose = () => setAnchorEl(null)

  const openContextMenu = Boolean(anchorEl)

  const isAssignedDoctor = useCallback(
    (row) => {
      const {
        doctor: { clinicianProfile: { doctorProfile: assignedDoctorProfile } },
        visitStatus,
      } = row
      const { clinicianProfile: { doctorProfile } } = user.data

      if (!doctorProfile) {
        notification.error({
          message: 'Unauthorized Access',
        })
        return false
      }

      if (visitStatus === 'IN CONS') {
        if (assignedDoctorProfile.id !== doctorProfile.id) {
          notification.error({
            message: `You cannot resume other doctor's consultation.`,
          })
          return false
        }
      }
      return true
    },
    [
      user,
    ],
  )

  const deleteQueue = (id) => {
    dispatch({
      type: 'queueLog/deleteQueueByQueueID',
      payload: {
        id,
      },
    }).then((response) => {
      if (response === 204)
        notification.success({
          message: 'Visit deleted',
        })
    })
  }

  const onRowDoubleClick = (row) => {
    const isWaiting = row.visitStatus === VISIT_STATUS.WAITING
    const isInCons = row.visitStatus === VISIT_STATUS.IN_CONS
    const isPaused = row.visitStatus === VISIT_STATUS.PAUSED
    const version = Date.now()

    const valid = isAssignedDoctor(row)

    const contextMenuButtonID = isWaiting ? '5' : '6'
    console.log({ row, contextMenuButtonID })
    return true
  }

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
        openConfirmText: 'Confirm',
        openConfirmContent: `Are you sure want to delete this visit (Q No.: ${queueNo})?`,
        onConfirmSave: () => deleteQueue(id),
      },
    })
  }

  const onClick = useCallback(
    (row, id) => {
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
              // router.push(
              //   `/reception/queue/patientdashboard?qid=${row.id}&vid=${row.visitFK}&v=${version}&md2=dsps`,
              // )
              router.push(
                `/reception/queue/dispense?qid=${row.id}&vid=${row.visitFK}&v=${version}&pid=${row.patientProfileFK}`,
              )
          })

          break
        }
        case '1.1': {
          // billing
          const version = Date.now()
          const parameters = {
            vid: row.visitFK,
            pid: row.patientProfileFK,
            v: version,
          }
          router.push(getAppendUrl(parameters, '/reception/queue/billing'))
          break
        }
        case '2': // delete visit
          deleteQueueConfirmation(row)
          break
        case '3': // view patient profile
          onViewPatientProfileClick(row.patientProfileFK, row.id)
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
                if (o.updateByUserFK !== user.data.id) {
                  const { clinicianprofile } = codetable
                  const editingUser = clinicianprofile.find(
                    (m) => m.userProfileFK === o.updateByUserFK,
                  ) || {
                    name: 'Someone',
                  }
                  dispatch({
                    type: 'global/updateAppState',
                    payload: {
                      openConfirm: true,
                      openConfirmContent: `${editingUser.name} is currently editing the patient note, do you want to overwrite?`,
                      onConfirmSave: () => {
                        dispatch({
                          type: `consultation/overwrite`,
                          payload: {
                            id: row.visitFK,
                            version,
                          },
                        }).then((c) => {
                          router.push(
                            `/reception/queue/patientdashboard?qid=${row.id}&cid=${c.id}&v=${version}&md2=cons`,
                          )
                        })
                      },
                    },
                  })
                } else {
                  router.push(
                    `/reception/queue/patientdashboard?qid=${row.id}&cid=${o.id}&v=${version}&md2=cons`,
                  )
                }
            })
          }
          break
        }
        case '8': {
          handleActualizeAppointment({
            patientID: row.patientProfileFk,
            appointmentID: row.id,
            primaryClinicianFK: row.appointment_Resources.find(
              (item) => item.isPrimaryClinician,
            ).clinicianFK,
            primaryClinicianRoomFK: row.appointment_Resources.find(
              (item) => item.isPrimaryClinician,
            ).roomFk,
          })
          break
        }
        case '9':
          onRegisterPatientClick()
          break
        default:
          break
      }
    },
    [
      codetable,
    ],
  )

  const renderActionButton = useCallback(
    (row) => {
      return <ActionButton row={row} onClick={onClick} />
    },
    [
      codetable,
      onClick,
    ],
  )

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
          onContextMenu={(row, event) => {
            // event.preventDefault()
            // handlePopoverOpen(event)
          }}
          columnExtensions={[
            ...columnExtensions,
            {
              columnName: 'action',
              align: 'center',
              render: renderActionButton,
            },
          ]}
          FuncProps={FuncConfig}
          onRowDoubleClick={onRowDoubleClick}
          {...TableConfig}
        />
      </LoadingWrapper>
      {/* <Popover
        open={openContextMenu}
        anchorEl={anchorEl}
        // anchorOrigin={{
        //   vertical: 'center',
        //   horizontal: 'center',
        // }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        // style={{ width: 500, height: 500 }}
      >
        <div style={{ width: 200, height: 400 }}>123f</div>
      </Popover> */}
    </div>
  )
}

export default connect(
  ({ queueLog, calendar, global, loading, user, codetable }) => ({
    user,
    codetable,
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
  }),
)(Grid)
