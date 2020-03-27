import React, { useState, useEffect, useCallback } from 'react'
import { withStyles } from '@material-ui/core'
import { connect } from 'dva'
import { compose } from 'redux'
import { sendNotification } from '@/utils/realtime'
import { NOTIFICATION_TYPE, NOTIFICATION_STATUS, KEYS } from '@/utils/constants'
import { withFormikExtend } from '@/components'

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
  queueCalling: { qCallList = [], lastUpdateDate, ...restValues },
}) => {
  const qNo = qId.replace('.0', '')
  const callingQueue = { qNo, roomNo }

  const newQList = [
    ...qCallList,
  ]

  const isCalled = newQList.find((q) => q.qNo === qNo)

  const [
    disable,
    setDisable,
  ] = useState(false)

  const updateData = (existingQArray, newRestValues = {}) => {
    const otherQCalls = existingQArray.filter((q) => q.qNo !== qNo)
    let valueArray = []
    if (isCalled) {
      valueArray = [
        isCalled,
        ...otherQCalls,
      ]
    } else {
      valueArray = [
        callingQueue,
        ...otherQCalls,
      ]
    }

    const stringifyValue = JSON.stringify(valueArray)

    const payload = {
      ...restValues,
      ...newRestValues,
      key: KEYS.QUEUECALLING,
      value: stringifyValue,
      isUserMaintainable: true,
    }

    dispatch({
      type: 'queueCalling/upsertQueueCallList',
      payload,
    }).then((response) => {
      if (response) {
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
        keys: KEYS.QUEUECALLING,
      },
    })

    if (dataLastUpdateDate !== lastUpdateDate) {
      dispatch({
        type: 'queueCalling/getExistingQueueCallList',
        payload: {
          keys: KEYS.QUEUECALLING,
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
  connect(({ queueLog, queueCalling }) => ({
    qlist: queueLog.list,
    queueCalling,
  })),
)(CallingQueueButton)
