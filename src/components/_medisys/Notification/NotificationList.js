import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button } from '@/components'
// sub components
import NotificationContent from './NotificationContent'

const styles = () => ({
  root: {
    width: '100%',
    minWidth: 400,
    maxWidth: 500,
  },
  emptyRoot: {
    minHeight: 290,
    maxHeight: 290,
    display: 'flex',
    justifyContent: 'center',
  },
  listRoot: {
    maxHeight: 290,
    overflowY: 'auto',
  },
  footer: {
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    borderTop: 'solid 1px #DCDCDC',
  },
  buttonLink: { margin: 'auto' },
})

const NotificationList = ({ dispatch, notifications = [], classes }) => {
  const clearNotification = () => {
    dispatch({
      type: 'header/clearNotifications',
    })
  }

  const rootClass = classnames({
    [classes.root]: true,
    [classes.listRoot]: notifications.length > 0,
    [classes.emptyRoot]: notifications.length === 0,
  })

  if (notifications.length > 0) {
    const sorted = notifications.sort(
      (a, b) => (a.timestamp < b.timestamp ? 1 : -1),
    )

    return (
      <div>
        <div className={rootClass}>
          {sorted.map((n) => <NotificationContent notification={n} />)}
        </div>
        <div className={classes.footer}>
          <Button
            className={classes.buttonLink}
            link
            simple
            size='sm'
            color='primary'
            onClick={clearNotification}
          >
            Clear notifications
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className={rootClass}>
      <p style={{ margin: 'auto' }}>You have viewed all notifications</p>
    </div>
  )
}

export default withStyles(styles, { name: 'NotificationList' })(
  NotificationList,
)
