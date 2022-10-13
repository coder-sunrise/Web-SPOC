import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { connect } from 'dva'
import { history } from 'umi'
// material ui
import { Popover } from '@material-ui/core'
// medisys component
import { VisitStatusTag, LoadingWrapper } from '@/components/_medisys'
import { CommonTableGrid, notification } from '@/components'
// medisys component
// sub component
import { getAppendUrl } from '@/utils/utils'
import {
  VISIT_STATUS,
  ContextMenuOptions,
  AppointmentContextMenu,
} from '@/pages/Reception/Queue/variables'
import Authorized from '@/utils/Authorized'
import { VISIT_TYPE, VALUE_KEYS } from '@/utils/constants'
import ActionButton from './ActionButton'
import ContextMenu from './ContextMenu'
// utils
import { filterData } from '../utils'
import { StatusIndicator } from '../variables'
import {
  FuncConfig,
  QueueTableConfig,
  QueueColumnExtensions,
  AppointmentTableConfig,
  ApptColumnExtensions,
} from './variables'

const Grid = ({
  dispatch,
  codetable,
  user,
  calendarEvents = [],
  filter = StatusIndicator.ALL,
  searchQuery,
  selfOnly = false,
  queueList = [],
  queryingList = false,
  queryingFormData = false,
  showingVisitRegistration = false,
  handleEditVisitClick,
  onRegisterPatientClick,
  onViewPatientProfileClick,
  handleActualizeAppointment,
  statusTagClicked,
  mainDivHeight = 700,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)

  const [rightClickedRow, setRightClickedRow] = useState(undefined)

  const handlePopoverOpen = event => setAnchorEl(event.target)

  const handlePopoverClose = () => {
    setAnchorEl(null)
    setRightClickedRow(undefined)
  }

  const openContextMenu = Boolean(anchorEl)

  const isAssignedDoctor = useCallback(
    row => {
      if (!row.doctor) return false
      const {
        doctor: { id },
        visitStatus,
      } = row
      const {
        clinicianProfile: { doctorProfile },
      } = user.data

      if (!doctorProfile) {
        notification.error({
          message: 'Current user is not authorized to access',
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
    [user],
  )

  const deleteQueue = (id, queueNo) => {
    dispatch({
      type: 'queueLog/deleteQueueByQueueID',
      payload: {
        id,
        queueNo,
      },
    })
  }

  useEffect(() => {
    dispatch({
      type: 'queueCalling/getExistingQueueCallList',
      payload: {
        keys: VALUE_KEYS.QUEUECALLING,
      },
    })
  }, [])

  // const calendarData = useMemo(
  //   () => calendarEvents.reduce(flattenAppointmentDateToCalendarEvents, []),
  //   [
  //     calendarEvents,
  //   ],
  // )

  const computeQueueListingData = () => {
    if (filter === StatusIndicator.APPOINTMENT) return calendarEvents
    let data = [...queueList]

    const {
      clinicianProfile: { doctorProfile },
    } = user.data

    if (selfOnly)
      data = data.filter(item => {
        if (!item.doctor) return false
        const {
          doctor: { id },
        } = item
        return doctorProfile ? id === doctorProfile.id : false
      })

    return filterData(filter, data, searchQuery)
  }

  const queueListingData = useMemo(computeQueueListingData, [
    filter,
    selfOnly,
    calendarEvents,
    queueList,
    user,
    searchQuery,
  ])

  const deleteQueueConfirmation = row => {
    const { queueNo, id } = row

    dispatch({
      type: 'global/updateAppState',
      payload: {
        openConfirm: true,
        openConfirmTitle: '',
        openConfirmText: 'Confirm',
        openConfirmContent: `Delete this visit (Q No.: ${queueNo})?`,
        onConfirmSave: () => deleteQueue(id, queueNo),
      },
    })
  }

  const canAccess = id => {
    const apptsActionID = ['8', '9']
    const findMatch = item => item.id === parseFloat(id, 10)

    let menuOpt = ContextMenuOptions.find(findMatch)

    if (apptsActionID.includes(id)) {
      menuOpt = AppointmentContextMenu.find(findMatch)
    }

    const accessRight = Authorized.check(menuOpt.authority)

    // skip for patient dashboard button
    // user can access patient dashboard regardless of access right
    // patient dashboard page will have the access right checking explicitly
    if (id === '4') return true

    return (
      accessRight &&
      (accessRight.rights === 'enable' || accessRight.rights === 'readwrite')
    )
  }

  const onClick = useCallback(
    (row, id) => {
      const hasAccess = canAccess(id)
      if (!hasAccess) {
        notification.error({
          message: 'Current user is not authorized to access',
        })
        return
      }
      dispatch({
        type: 'queueLog/updateState',
        payload: {
          statusTagClicked: true,
        },
      })
      switch (id) {
        case '0': // edit visit
        case '0.1': // view visit
          handleEditVisitClick({
            visitID: row.id,
          })
          break
        case '1': {
          // dispense
          const isInitialLoading =
            row.visitPurposeFK === VISIT_TYPE.OTC &&
            row.visitStatus === 'WAITING'
          const version = Date.now()
          dispatch({
            type: `dispense/start`,
            payload: {
              id: row.visitFK,
              version,
              qid: row.id,
              queueNo: row.queueNo,
            },
          }).then(o => {
            if (o)
              history.push(
                `/reception/queue/dispense?isInitialLoading=${isInitialLoading}&qid=${row.id}&vid=${row.visitFK}&v=${version}&pid=${row.patientProfileFK}`,
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
            qid: row.id,
            v: version,
          }
          history.push(getAppendUrl(parameters, '/reception/queue/billing'))
          break
        }
        case '2': // delete visit
          deleteQueueConfirmation(row)
          break
        case '3': // view patient profile
          onViewPatientProfileClick(row.patientProfileFK, row.id)
          break
        case '4': // patient dashboard
          history.push(
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
                qid: row.id,
                queueNo: row.queueNo,
              },
            }).then(o => {
              if (o)
                history.push(
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
              }).then(o => {
                if (o)
                  history.push(
                    `/reception/queue/consultation?qid=${row.id}&cid=${o.id}&v=${version}`,
                  )
              })
            } else {
              history.push(
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
            }).then(o => {
              if (o)
                if (o.updateByUserFK !== user.data.id) {
                  const { clinicianprofile = [] } = codetable
                  const editingUser = clinicianprofile.find(
                    m => m.userProfileFK === o.updateByUserFK,
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
                        }).then(c => {
                          history.push(
                            `/reception/queue/consultation?qid=${row.id}&cid=${c.id}&v=${version}`,
                          )
                        })
                      },
                    },
                  })
                } else {
                  history.push(
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
            item => item.id === row.clinicianProfileFk,
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
      setTimeout(() => {
        dispatch({
          type: 'queueLog/updateState',
          payload: {
            statusTagClicked: false,
          },
        })
      }, 3000)
    },
    [codetable.clinicianprofile],
  )

  const onRowDoubleClick = useCallback(
    row => {
      const { visitStatus, visitPurposeFK = VISIT_TYPE.BF } = row
      const isWaiting = visitStatus === VISIT_STATUS.WAITING
      const {
        clinicianProfile: { doctorProfile },
      } = user.data
      const retailVisits = [VISIT_TYPE.OTC, VISIT_TYPE.BF]
      if (!doctorProfile || retailVisits.includes(visitPurposeFK)) return false

      if (isWaiting) onClick(row, '5') // start consultation context menu id = 5

      return true
    },
    [user],
  )

  const renderActionButton = useCallback(
    row => {
      return <ActionButton row={row} onClick={onClick} />
    },
    [codetable, onClick],
  )

  const handleContextMenuClick = useCallback(
    menuItem => {
      handlePopoverClose()
      onClick(rightClickedRow, menuItem.key)
    },
    [rightClickedRow],
  )

  const onOutsidePopoverRightClick = event => {
    event.preventDefault()
    handlePopoverClose()
  }

  const handleStatusTagClick = row => {
    let id = '5' // default as Start Consultation
    const { visitStatus, visitPurposeFK, patientProfileFk } = row
    if (visitStatus === VISIT_STATUS.UPCOMING_APPT) {
      id = patientProfileFk ? '8' : '9'

      onClick(row, id)
      return
    }

    switch (visitStatus) {
      case VISIT_STATUS.WAITING:
        if (
          visitPurposeFK === VISIT_TYPE.OTC ||
          visitPurposeFK === VISIT_TYPE.BF
        )
          id = '1'
        else id = '5'
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

    onClick(row, id)
  }

  const isLoading = showingVisitRegistration ? false : queryingList
  let loadingText = 'Refreshing queue...'
  if (!queryingList && queryingFormData) loadingText = ''
  const height = mainDivHeight - 190
  const TableProps = { height }
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
            TableProps={TableProps}
            rows={queueListingData}
            firstColumnCustomPadding={10}
            forceRender
            columnExtensions={[
              ...QueueColumnExtensions,
              {
                columnName: 'visitStatus',
                width: 200,
                render: row => (
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
              // console.log({ target: event.target.parentElement })
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
            TableProps={TableProps}
            rows={queueListingData}
            firstColumnCustomPadding={10}
            columnExtensions={[
              ...ApptColumnExtensions,
              {
                columnName: 'visitStatus',
                width: 200,
                render: row => (
                  <VisitStatusTag
                    row={row}
                    onClick={handleStatusTagClick}
                    statusTagClicked={statusTagClicked}
                  />
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
  mainDivHeight: global.mainDivHeight,
  filter: queueLog.currentFilter,
  selfOnly: queueLog.selfOnly,
  queueList: queueLog.list || [],
  statusTagClicked: queueLog.statusTagClicked,
  calendarEvents: queueLog.appointmentList || [],
  showingVisitRegistration: global.showVisitRegistration,
  queryingList:
    loading.effects['queueLog/refresh'] ||
    loading.effects['queueLog/getSessionInfo'] ||
    loading.effects['queueLog/query'] ||
    loading.effects['calendar/getCalendarList'],
  queryingFormData: loading.effects['dispense/initState'],
}))(Grid)
