import React from 'react'
import { withStyles } from '@material-ui/core'
import Dashboard from '@material-ui/icons/Dashboard'
import { ProgressButton } from '@/components'

const styles = (theme) => ({
  queueDashboardButton: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(
      2,
    )}px 0`,
  },
})

const QueueDashboardButton = ({ classes, size = 'md' }) => {
  return (
    <ProgressButton
      icon={<Dashboard />}
      size={size}
      color='info'
      className={classes.queueDashboardButton}
      onClick={() => window.open('/queuedisplay/dashboard')}
    >
      Open Queue Display
    </ProgressButton>
  )
}

export default withStyles(styles, { withTheme: true })(QueueDashboardButton)
