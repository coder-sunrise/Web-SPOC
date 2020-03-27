import React, { useEffect, Fragment } from 'react'
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
  setRerender,
  setPendingCallData,
}) => {
  const playSound = () => {
    slideAudio.muted = false
    slideAudio.play()
    slideAudio.loop = true
  }

  useEffect(
    () => {
      if (callingQueue.length > 0) setShowCurrentCallQueue(() => true)
      console.log({ callingQueue })
      setTimeout(() => {
        const remainingPendingQCall = callingQueue.filter((q, idx) => idx !== 0)
        console.log({ remainingPendingQCall })
        slideAudio.pause()
        slideAudio.currentTime = 0
        setPendingCallData(remainingPendingQCall)
        if (remainingPendingQCall.length === 0) {
          setShowCurrentCallQueue(() => false)
        }
        dispatch({
          type: 'queueCalling/updateState',
          payload: {
            pendingQCall: remainingPendingQCall,
          },
        })
      }, 5000)
    },
    [
      callingQueue,
    ],
  )

  useEffect(() => {
    playSound()
    return () => {
      slideAudio.remove()
    }
  }, [])

  return (
    <div className={classes.callingQueueSection}>
      {callingQueue.length > 0 && (
        <Fragment>
          <p>{callingQueue[0].roomNo}</p>
          <p style={{ fontWeight: 'bold' }}>{callingQueue[0].qNo}</p>
        </Fragment>
      )}
    </div>
  )
}

export default withStyles(styles)(CurrentCallingQueue)
