import React, { useState, useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import { compose } from 'redux'
import { isNumber } from 'util'
import { sendNotification } from '@/utils/realtime'
import {
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  VALUE_KEYS,
} from '@/utils/constants'
import { notification } from '@/components'
import Authorized from '@/utils/Authorized'

const btnStyle = {
  borderRadius: '50%',
  width: 20,
  padding: 10,
  boxShadow: '0 3px 6px rgba(0, 0, 0, 0.6)',
}

const styles = () => ({
  uncalledQueueStyle: {
    background: '#4255bd',
    cursor: 'pointer',

    '&:hover': {
      background: '#354497',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      background: '#354497',
      opacity: 0.5,
    },
  },
  calledQueueStyle: {
    background: '#cf1322',
    cursor: 'pointer',

    '&:hover': {
      background: '#A60F1B',
    },
    '&:disabled': {
      cursor: 'not-allowed',
      background: '#A60F1B',
      opacity: 0.5,
    },
  },
})

const CallingQueueButton = ({
  classes,
  qId = '0',
  roomNo,
  dispatch,
  doctor,
  roomAssignmentList,
  ctroom,
  user,
  queueCalling: { qCallList = [], lastUpdateDate, tracker, ...restValues },
}) => {
  const [
    roomAssignList,
    setRoomAssignList,
  ] = useState(roomAssignmentList)
  // console.log({ qId })

  const qNo = qId.includes('.0') ? qId.replace('.0', '') : qId

  const [
    disable,
    setDisable,
  ] = useState(false)

  useEffect(
    () => {
      if (tracker && qNo === tracker.qNo) {
        setDisable(() => !disable)
        setTimeout(() => {
          setDisable(() => false)
        }, 3000)
      }
    },
    [
      tracker,
    ],
  )

  useEffect(
    () => {
      if (!roomAssignList) {
        dispatch({
          type: 'settingRoomAssignment/query',
          payload: {
            pagesize: 9999,
          },
        }).then((response) => {
          if (response) {
            const { data } = response
            setRoomAssignList(data)
          }
        })

        // dispatch({
        //   type: 'codetable/fetchCodes',
        //   payload: {
        //     code: 'clinicianprofile',
        //   },
        // })
      }
    },
    [
      roomAssignList,
    ],
  )

  const getRoomAssigned = () => {
    if (roomNo) {
      if (isNumber(roomNo)) {
        const roomAssigned = ctroom.find((room) => room.id === roomNo)
        return roomAssigned.name
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

      const roomAssignment = (roomAssignList || [])
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
    ...qCallList,
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
            qCallList: valueArray,
            concurrencyToken,
          },
        })
        sendNotification('QueueCalled', {
          type: NOTIFICATION_TYPE.QUEUECALL,
          status: NOTIFICATION_STATUS.OK,
          message: 'Queue Called',
          ...callingQueue,
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

    updateData(qCallList)
  }

  const currentStyle = isCalled
    ? classes.calledQueueStyle
    : classes.uncalledQueueStyle

  return (
    <Authorized authority='openqueuedisplay'>
      <button
        type='submit'
        className={currentStyle}
        onClick={handleCallingQueue}
        disabled={disable}
        style={btnStyle}
      />
    </Authorized>
  )
}

export default React.memo(
  compose(
    withStyles(styles, { withTheme: true }),
    connect(
      ({ queueLog, queueCalling, settingRoomAssignment, codetable, user }) => ({
        qlist: queueLog.list,
        queueCalling,
        roomAssignmentList: settingRoomAssignment.list,
        ctroom: codetable.ctroom,
        user: user.data,
      }),
    ),
  )(CallingQueueButton),
)
