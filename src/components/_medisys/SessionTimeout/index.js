import React from 'react'
import { Divider, withStyles } from '@material-ui/core'
import { Button } from '@/components'

const styles = (theme) => ({
  content: {
    textAlign: 'center',
    minHeight: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  footer: { textAlign: 'center', marginTop: 8 },
})

const SessionTimeout = ({ classes, onClose, onConfirm }) => (
  <React.Fragment>
    <div className={classes.content}>
      <h4>
        Your session is about to time-out. Would you like to remain logged on?
      </h4>
    </div>
    <Divider />
    <div className={classes.footer}>
      <Button color='danger' onClick={onClose}>
        No
      </Button>
      <Button color='primary' onClick={onConfirm}>
        Yes
      </Button>
    </div>
  </React.Fragment>
)

export default withStyles(styles, { name: 'SessionTimeout' })(SessionTimeout)
