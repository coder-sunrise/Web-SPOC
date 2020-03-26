import React, { useState } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import { compose } from 'redux'
import { sendNotification } from '@/utils/realtime'
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS, KEYS } from '@/utils/constants'

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
  qId,
  roomNo,
  dispatch,
  queueCalling: { qCallList, ...restValues },
}) => {
  const qNo = qId.replace('.0', '')

  const newQList = [
    ...qCallList,
  ]

  const isCalled = newQList.find((q) => q.qNo === qNo && q.roomNo === roomNo)

  const [
    disable,
    setDisable,
  ] = useState(false)

  const handleCallingQueue = async () => {
    setDisable(() => !disable)
    setTimeout(() => {
      setDisable(() => false)
    }, 3000)

    const { lastUpdateDate } = await dispatch({
      type: 'queueCalling/getStatus',
      payload: {
        keys: KEYS.QUEUECALLING,
      },
    })

    sendNotification('QueueCalled', {
      type: NOTIFICATION_TYPE.QUEUECALL,
      status: NOTIFICATION_STATUS.OK,
      message: 'Queue Called',
      qNo,
      roomNo,
    })

    let valueArray = []
    const otherQCalls = qCallList.filter(
      (q) => q.qNo !== qNo && q.roomNo !== roomNo,
    )
    if (isCalled) {
      valueArray = [
        isCalled,
        ...otherQCalls,
      ]
    } else {
      valueArray = [
        { qNo, roomNo },
        ...otherQCalls,
      ]
    }

    const stringifyValue = JSON.stringify(valueArray)

    dispatch({
      type: 'queueCalling/upsertQueueCallList',
      payload: {
        ...restValues,
        key: KEYS.QUEUECALLING,
        value: stringifyValue,
      },
    })
  }

  const currentStyle = isCalled
    ? classes.calledQueueStyle
    : classes.uncalledQueueStyle

  return (
    <button
      type='submit'
      className={currentStyle}
      onClick={handleCallingQueue}
      disabled={disable}
      style={btnStyle}
    />
  )
}

export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ queueLog, queueCalling }) => ({
    qlist: queueLog.list,
    queueCalling,
  })),
)(CallingQueueButton)
