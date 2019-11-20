import React, { useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import router from 'umi/router'
// material ui
import { Popover } from '@material-ui/core'
// medisys component
import { VisitStatusTag, LoadingWrapper } from '@/components/_medisys'
import { CommonTableGrid, notification } from '@/components'
// medisys component
// sub component
import ActionButton from './ActionButton'
import ContextMenu from './ContextMenu'
// utils
import { getAppendUrl } from '@/utils/utils'
import { filterData } from '../utils'
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { StatusIndicator } from '../variables'

import {
  FuncConfig,
  QueueTableConfig,
  QueueColumnExtensions,
  AppointmentTableConfig,
  ApptColumnExtensions,
} from './variables'

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

  const [
    rightClickedRow,
    setRightClickedRow,
  ] = useState(undefined)

  const handlePopoverOpen = (event) => setAnchorEl(event.target)

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setRightClickedRow(undefined)
  }

  const openContextMenu = Boolean(anchorEl)

  const isAssignedDoctor = useCallback(
    (row) => {
      if (!row.doctor) return false
      const { doctor: { id }, visitStatus } = row
      const { clinicianProfile: { doctorProfile } } = user.data

      if (!doctorProfile) {
        notification.error({
          message: 'Unauthorized Access',
        })
        return false
      }

      if (visitStatus === 'IN CONS') {
        if (id !== doctorProfile.id) {
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

  // const calendarData = useMemo(
  //   () => calendarEvents.reduce(flattenAppointmentDateToCalendarEvents, []),
  //   [
  //     calendarEvents,
  //   ],
  // )

  const computeQueueListingData = () => {
    if (filter === StatusIndicator.APPOINTMENT) return calendarEvents
    let data = [
      ...queueList,
    ]

    const { clinicianProfile: { doctorProfile } } = user.data

    if (selfOnly)
      data = data.filter((item) => {
        if (!item.doctor) return false
        const { doctor: { id } } = item
        return doctorProfile ? id === doctorProfile.id : false
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
                  `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
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
                    `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
                  )
              })
            } else {
              router.push(
                `/reception/queue/consultation?qid=${row.id}&cid=${row.clinicalObjectRecordFK}&v=${version}`,
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
                  const { clinicianprofile = [] } = codetable
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
                            `/reception/queue/consultation?qid=${row.id}&cid=${c.id}&v=${version}`,
                          )
                        })
                      },
                    },
                  })
                } else {
                  router.push(
                    `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
                  )
                }
            })
          }
          break
        }
        case '8': {
          const { clinicianprofile = [] } = codetable
          const doctorProfile = clinicianprofile.find(
            (item) => item.id === row.clinicianProfileFk,
          )
          handleActualizeAppointment({
            patientID: row.patientProfileFk,
            appointmentID: row.id,
            primaryClinicianFK: doctorProfile ? doctorProfile.id : undefined,
            primaryClinicianRoomFK: row.roomFk,
          })
          break
        }
        case '9':
          onRegisterPatientClick(false, row)
          break
        default:
          break
      }
    },
    [
      codetable.clinicianprofile,
    ],
  )

  const onRowDoubleClick = useCallback(
    (row) => {
      const isWaiting = row.visitStatus === VISIT_STATUS.WAITING
      const { clinicianProfile: { doctorProfile } } = user.data

      if (!doctorProfile) return false

      if (isWaiting) onClick(row, '5') // start consultation context menu id = 5

      return true
    },
    [
      user,
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

  const handleContextMenuClick = useCallback(
    (menuItem) => {
      handlePopoverClose()
      onClick(rightClickedRow, menuItem.key)
    },
    [
      rightClickedRow,
    ],
  )

  const onOutsidePopoverRightClick = (event) => {
    event.preventDefault()
    handlePopoverClose()
  }

  const handleStatusTagClick = (row) => {
    let id = '5' // default as Start Consultation
    const { visitStatus } = row
    if (visitStatus === VISIT_STATUS.UPCOMING_APPT) return

    switch (visitStatus) {
      case VISIT_STATUS.WAITING:
        id = '5'
        break
      case VISIT_STATUS.IN_CONS:
      case VISIT_STATUS.PAUSED:
        id = '6'
        break
      case VISIT_STATUS.DISPENSE:
      case VISIT_STATUS.ORDER_UPDATED:
        id = '1'
        break
      case VISIT_STATUS.BILLING:
      case VISIT_STATUS.COMPLETED:
        id = '1.1'
        break
      default:
        id = undefined
        break
    }
    if (id) onClick(row, id)
  }

  const isLoading = showingVisitRegistration ? false : queryingList
  let loadingText = 'Refreshing queue...'
  if (!queryingList && queryingFormData) loadingText = ''

  return (
    // <div style={{ minHeight: '76vh' }}>
    <div>
      <LoadingWrapper
        linear
        loading={isLoading || queryingFormData}
        text={loadingText}
      >
        {filter !== StatusIndicator.APPOINTMENT && (
          <CommonTableGrid
            size='sm'
            TableProps={{ height: gridHeight }}
            rows={queueListingData}
            columnExtensions={[
              ...QueueColumnExtensions,
              {
                columnName: 'visitStatus',
                width: 180,
                render: (row) => (
                  <VisitStatusTag row={row} onClick={handleStatusTagClick} />
                ),
              },
              {
                columnName: 'action',
                align: 'center',
                render: renderActionButton,
              },
            ]}
            FuncProps={FuncConfig}
            onRowDoubleClick={onRowDoubleClick}
            onContextMenu={(row, event) => {
              event.preventDefault()
              handlePopoverOpen(event)
              setRightClickedRow(row)
            }}
            {...QueueTableConfig}
          />
        )}
        {filter === StatusIndicator.APPOINTMENT && (
          <CommonTableGrid
            size='sm'
            TableProps={{ height: gridHeight }}
            rows={queueListingData}
            columnExtensions={[
              ...ApptColumnExtensions,

              {
                columnName: 'action',
                align: 'center',
                render: renderActionButton,
              },
            ]}
            FuncProps={FuncConfig}
            onRowDoubleClick={onRowDoubleClick}
            {...AppointmentTableConfig}
          />
        )}
      </LoadingWrapper>
      {rightClickedRow && (
        <Popover
          open={openContextMenu}
          onContextMenu={onOutsidePopoverRightClick}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          onClose={handlePopoverClose}
        >
          <ContextMenu
            show={openContextMenu}
            handleClick={handleContextMenuClick}
            row={rightClickedRow}
          />
        </Popover>
      )}
    </div>
  )
}

export default connect(({ queueLog, global, loading, user, codetable }) => ({
  user,
  codetable,
  filter: queueLog.currentFilter,
  selfOnly: queueLog.selfOnly,
  queueList: queueLog.list || [],
  calendarEvents: queueLog.appointmentList || [],
  showingVisitRegistration: global.showVisitRegistration,
  queryingList:
    loading.effects['queueLog/refresh'] ||
    loading.effects['queueLog/getSessionInfo'] ||
    loading.effects['queueLog/query'] ||
    loading.effects['calendar/getCalendarList'],
  queryingFormData: loading.effects['dispense/initState'],
}))(Grid)
