import React, { useEffect } from 'react'
import { withStyles } from '@material-ui/core'
import Beep from './state-change_confirm-up.wav'

const styles = () => ({
  callingQueueSection: {
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    lineHeight: '10vw',
    fontSize: '8vw',
  },
})

const slideAudio = new Audio(Beep)

const CurrentCallingQueue = ({
  classes,
  callingQueue,
  setShowCurrentCallQueue,
  dispatch,
  qCallList,
}) => {
  const playSound = () => {
    slideAudio.muted = false
    slideAudio.play()
    slideAudio.loop = true

    if (callingQueue.length > 0) {
      const qIsExist = qCallList.find(
        (q) =>
          q.qNo === callingQueue[0].qNo && q.roomNo === callingQueue[0].roomNo,
      )

      let qArray = []
      if (qIsExist) {
        const otherQCalls = qCallList.filter(
          (q) =>
            q.qNo !== callingQueue[0].qNo &&
            q.roomNo !== callingQueue[0].roomNo,
        )
        qArray = [
          qIsExist,
          ...otherQCalls,
        ]
      } else {
        qArray = [
          callingQueue[0],
          ...qCallList,
        ]
      }

      const remainingPendingQCall = callingQueue.filter(
        (q) =>
          q.qNo !== callingQueue[0].qNo && q.roomNo !== callingQueue[0].roomNo,
      )

      dispatch({
        type: 'queueCalling/updateState',
        payload: {
          qCallList: qArray,
        },
      })

      setTimeout(() => {
        slideAudio.pause()
        slideAudio.currentTime = 0
        dispatch({
          type: 'queueCalling/updateState',
          payload: {
            pendingQCall: remainingPendingQCall,
            calling: remainingPendingQCall.length > 0,
          },
        })
      }, 5000)
    }
  }

  useEffect(() => {
    playSound()
    return () => {
      slideAudio.remove()
    }
  }, [])

  return (
    <div className={classes.callingQueueSection}>
      <p>{callingQueue[0].roomNo}</p>
      <p style={{ fontWeight: 'bold' }}>{callingQueue[0].qNo}</p>
    </div>
  )
}

export default withStyles(styles)(CurrentCallingQueue)
