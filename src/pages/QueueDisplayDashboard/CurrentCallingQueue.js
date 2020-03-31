import React, { useEffect, Fragment } from 'react'
import { withStyles } from '@material-ui/core'
import Beep from './state-change_confirm-up.wav'

const styles = () => ({
  '@keyframes mui-ripple-pulsate': {
    '0%': {
      transform: 'scale(1)',
    },
    '50%': {
      transform: 'scale(0.92)',
    },
    '100%': {
      transform: 'scale(1)',
    },
  },
  callingQueueSection: {
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    lineHeight: '10vw',
    fontSize: '8vw',
    animation: `mui-ripple-pulsate 2500ms 200ms infinite`,
  },
})

const slideAudio = new Audio(Beep)

const CurrentCallingQueue = ({ classes, callingQueue }) => {
  const playSound = () => {
    slideAudio.muted = false
    slideAudio.play()
    slideAudio.loop = true
  }

  useEffect(() => {
    playSound()
    return () => {
      slideAudio.pause()
      slideAudio.currentTime = 0
      slideAudio.remove()
    }
  }, [])

  return (
    <div className={classes.callingQueueSection}>
      <Fragment>
        <p>{callingQueue.roomNo}</p>
        <p style={{ fontWeight: 'bold' }}>{callingQueue.qNo}</p>
      </Fragment>
    </div>
  )
}

export default withStyles(styles)(CurrentCallingQueue)
