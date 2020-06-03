import React from 'react'
import { withStyles } from '@material-ui/core'
import { Dashboard, ClearAll } from '@material-ui/icons'
import { ProgressButton, notification } from '@/components'
import Authorized from '@/utils/Authorized'
import { VALUE_KEYS } from '@/utils/constants'

const styles = (theme) => ({
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
      <ProgressButton
        icon={<Dashboard />}
        size={size}
        color='info'
        className={classes.queueDashboardButton}
        onClick={() => window.open('/queuedisplay/dashboard')}
      >
        Open Queue Display
      </ProgressButton>
      {showClear ? (
        <ProgressButton
          size={size}
          icon={<ClearAll />}
          className={classes.queueDashboardButton}
          onClick={() => {
            dispatch({
              type: 'queueCalling/getExistingQueueCallList',
              payload: {
                keys: VALUE_KEYS.QUEUECALLING,
              },
            }).then((res) => {
              // const { value, ...restRespValues } = res
              dispatch({
                type: 'queueCalling/upsertQueueCallList',
                payload: {
                  ...res,
                  key: VALUE_KEYS.QUEUECALLING,
                  value: '[]',
                },
              }).then((response) => {
                if (response) notification.success({ message: 'Cleared' })
              })
            })
          }}
        >
          clear
        </ProgressButton>
      ) : (
        ''
      )}
    </Authorized>
  )
}

export default withStyles(styles, { withTheme: true })(QueueDashboardButton)
