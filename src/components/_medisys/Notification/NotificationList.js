import color from 'color'
import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles, Divider } from '@material-ui/core'
// common components
import { hoverColor } from 'mui-pro-jss'
import { Button } from '@/components'
// sub components
import NotificationContent from './NotificationContent'

const styles = (theme) => ({
  root: {
    // width: '100%',
    // minWidth: 400,
    // maxWidth: 500,
  },
  emptyRoot: {
    minHeight: 290,
    maxHeight: 290,
    display: 'flex',
    justifyContent: 'center',
  },
  listRoot: {
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: color(hoverColor).lighten(0.05).hex(),
  },
  footer: {
    textAlign: 'center',
    padding: theme.spacing(),
    // display: 'flex',
    // justifyContent: 'center',
    // borderTop: 'solid 1px #DCDCDC',
  },
  buttonLink: { margin: 'auto' },
})

const NotificationList = ({ dispatch, notifications = [], classes, type }) => {
  const clearNotification = () => {
    dispatch({
      type: 'header/clearNotification',
      payload: {
        type,
      },
    })
  }
  const readNotification = () => {
    dispatch({
      type: 'header/readNotification',
      payload: {
        type,
      },
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
          {sorted.map((n) => (
            <NotificationContent notification={n} dispatch={dispatch} />
          ))}
        </div>
        <Divider />
        <div className={classes.footer}>
          <Button
            className={classes.buttonLink}
            link
            size='sm'
            onClick={readNotification}
          >
            Make all as read
          </Button>
          <Button
            className={classes.buttonLink}
            link
            size='sm'
            onClick={clearNotification}
          >
            Clear
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
