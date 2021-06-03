import React from 'react'
import { withStyles } from '@material-ui/core'
import { Dashboard, ClearAll } from '@material-ui/icons'
import { ProgressButton, notification } from '@/components'
import Authorized from '@/utils/Authorized'
import {
  VALUE_KEYS,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
} from '@/utils/constants'
import { sendNotification } from '@/utils/realtime'

const styles = theme => ({
  queueDashboardButton: {
    margin: `${theme.spacing(2)}px ${theme.spacing(1)}px ${theme.spacing(
      2,
    )}px 0`,
  },
})

const QueueDashboardButton = ({
  classes,
  size = 'md',
  dispatch,
  showClear = false,
}) => {
  return (
    <Authorized authority='openqueuedisplay'>
      <div style={{ display: 'inline-Block' }}>
        <ProgressButton
          icon={<Dashboard />}
          size={size}
          color='info'
          onClick={() => window.open('/queuedisplay/dashboard')}
        >
          Open Queue Display
        </ProgressButton>
        {showClear && (
          <ProgressButton
            size={size}
            icon={<ClearAll />}
            onClick={() => {
              dispatch({
                type: 'queueCalling/claearAll',
                payload: {
                  key: VALUE_KEYS.QUEUECALLING,
                },
              }).then(res => {
                if (res) {
                  notification.success({ message: 'Cleared' })
                  sendNotification('QueueClear', {
                    type: NOTIFICATION_TYPE.QUEUECALL,
                    status: NOTIFICATION_STATUS.OK,
                    message: 'Queue Clear',
                  })
                }
              })
            }}
          >
            clear
          </ProgressButton>
        )}
      </div>
    </Authorized>
  )
}

export default withStyles(styles, { withTheme: true })(QueueDashboardButton)
