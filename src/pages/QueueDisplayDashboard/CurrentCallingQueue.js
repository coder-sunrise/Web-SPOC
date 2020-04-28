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
    lineHeight: '15vw',
    fontSize: '12vw',
    animation: `mui-ripple-pulsate 2500ms 200ms infinite`,
    background: 'black',
    color: 'white',
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
        <p
          style={{
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '1vw',
            whiteSpace: 'nowrap',
            height: '50%',
          }}
        >
          {callingQueue.roomNo}
        </p>
        <p style={{ fontWeight: 'bold', height: '50%', fontSize: '30vw' }}>
          {callingQueue.qNo === parseInt(callingQueue.qNo, 10) ? callingQueue.qNo : callingQueue.qNo.padStart(3, '0')}
        </p>
      </Fragment>
    </div>
  )
}

export default withStyles(styles)(CurrentCallingQueue)
