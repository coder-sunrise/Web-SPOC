import React, { useState, useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import { compose } from 'redux'
import { isNumber } from 'util'
import IconButton from '@material-ui/core/IconButton'
import VolumeUp from '@material-ui/icons/VolumeUp'
import { sendNotification } from '@/utils/realtime'

import {
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  VALUE_KEYS,
} from '@/utils/constants'
import { notification, Button } from '@/components'

const CallingQueueButton = ({
  classes,
  qId = '0',
  roomNo,
  dispatch,
  doctor,
  roomAssignmentList,
  ctroom,
  user,
  queueCalling: { oriQCallList = [], lastUpdateDate, tracker, ...restValues },
}) => {
  // console.log({ qId })

  const qNo = qId.includes('.0') ? qId.replace('.0', '') : qId

  const [
    disable,
    setDisable,
  ] = useState(false)

  useEffect(
    () => {
      if (tracker && qNo === tracker.qNo) {
        const isExistCalledQ = oriQCallList.find((q) => q.qNo === tracker.qNo)
        if (!isExistCalledQ) {
          dispatch({
            type: 'queueCalling/updateState',
            payload: {
              oriQCallList: [
                tracker,
                ...oriQCallList,
              ],
            },
          })
        }
        setDisable(() => !disable)
        setTimeout(() => {
          setDisable(() => false)
          dispatch({
            type: 'queueCalling/updateState',
            payload: {
              tracker: undefined,
            },
          })
        }, 3000)
      }
    },
    [
      tracker,
    ],
  )

  const getRoomAssigned = () => {
    if (roomNo) {
      if (isNumber(roomNo)) {
        const roomAssigned = ctroom.find((room) => room.id === roomNo)
        return roomAssigned ? roomAssigned.name || '' : ''
      }
      return roomNo
    }

    let roomAssign = ''

    if (doctor) {
      let clinicianProfileFK = isNumber(doctor)
        ? doctor
        : doctor.clinicianProfile.id

      if (user.clinicianProfile.doctorProfile) {
        clinicianProfileFK = user.clinicianProfile.doctorProfile.id
      }

      // console.log({ clinicianProfileFK })

      const roomAssignment = (roomAssignmentList || [])
        .find((room) => room.clinicianProfileFK === clinicianProfileFK)
      // console.log({ roomAssignment })
      if (roomAssignment) {
        const roomAssigned = ctroom.find(
          (room) => room.id === roomAssignment.roomFK,
        )
        if (roomAssigned) roomAssign = roomAssigned.name
      }
      // console.log({ roomAssign })
    }

    return roomAssign
  }

  const callingQueue = { qNo, roomNo: getRoomAssigned() }

  const newQList = [
    ...oriQCallList,
  ]

  const isCalled = newQList.find((q) => q.qNo === qNo)

  const updateData = (existingQArray, newRestValues = {}) => {
    const valueArray = [
      callingQueue,
      ...existingQArray,
    ]

    const stringifyValue = JSON.stringify(valueArray)

    const payload = {
      ...restValues,
      ...newRestValues,
      key: VALUE_KEYS.QUEUECALLING,
      value: stringifyValue,
      isUserMaintainable: true,
      lastUpdateDate: null,
    }

    dispatch({
      type: 'queueCalling/upsertQueueCallList',
      payload,
    }).then((response) => {
      if (response) {
        notification.success({ message: 'Called' })
        const { lastUpdateDate: lastUpdateTime, concurrencyToken } = response
        dispatch({
          type: 'queueCalling/updateState',
          payload: {
            lastUpdateDate: lastUpdateTime,
            oriQCallList: valueArray,
            concurrencyToken,
          },
        })
        sendNotification('QueueCalled', {
          type: NOTIFICATION_TYPE.QUEUE,
          status: NOTIFICATION_STATUS.OK,
          message: 'Queue Called',
          ...callingQueue,
          queueNo: callingQueue.qNo,
        })
      } else {
        dispatch({
          type: 'queueCalling/getExistingQueueCallList',
          payload: {
            keys: VALUE_KEYS.QUEUECALLING,
          },
        }).then((res) => {
          const { value, ...restRespValues } = res

          const existingQCall = JSON.parse(value)

          updateData(existingQCall, restRespValues)
        })
      }
    })
  }

  const handleCallingQueue = async () => {
    setDisable(() => !disable)
    setTimeout(() => {
      setDisable(() => false)
    }, 3000)

    const { lastUpdateDate: dataLastUpdateDate } = await dispatch({
      type: 'queueCalling/getStatus',
      payload: {
        keys: VALUE_KEYS.QUEUECALLING,
      },
    })

    if (dataLastUpdateDate !== lastUpdateDate) {
      dispatch({
        type: 'queueCalling/getExistingQueueCallList',
        payload: {
          keys: VALUE_KEYS.QUEUECALLING,
        },
      }).then((response) => {
        const { value, ...newRestValues } = response

        const existingQCall = JSON.parse(value)

        updateData(existingQCall, newRestValues)
      })

      return
    }

    updateData(oriQCallList)
  }

  return (
    <Button
      type='submit'
      round
      color={isCalled ? 'danger' : 'primary'}
      size='sm'
      justIcon
      style={{ marginRight: '0px' }}
      onClick={handleCallingQueue}
    >
      <VolumeUp />
    </Button>
  )
}

export default React.memo(
  compose(
    connect(
      ({ queueLog, queueCalling, settingRoomAssignment, codetable, user }) => ({
        qlist: queueLog.list,
        queueCalling,
        roomAssignmentList: settingRoomAssignment.list,
        ctroom: codetable.ctroom || [],
        user: user.data,
      }),
    ),
  )(CallingQueueButton),
)
