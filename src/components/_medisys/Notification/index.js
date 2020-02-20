import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
import Notifications from '@material-ui/icons/Notifications'
import Refresh from '@material-ui/icons/Refresh'
// common components
import { Badge, Popper, Button } from '@/components'
// sub components
import NotificationList from './NotificationList'
// assets
import customDropdownStyle from '@/assets/jss/material-dashboard-pro-react/components/customDropdownStyle'

const styles = (theme) => ({
  ...customDropdownStyle(theme),
  overlayRoot: {
    display: 'flex',
    height: 50,
    borderBottom: 'solid 1px #DCDCDC',
  },
})

const NotificationComponent = ({ notifications = [], dispatch, classes }) => {
  const refreshQueueListing = () => {
    dispatch({
      type: 'queueLog/refresh',
    })
  }

  const overlay = (
    <div>
      <div className={classes.overlayRoot}>
        <p style={{ margin: 'auto auto auto 15px', fontSize: 16 }}>
          Notifications
        </p>
        <Button
          link
          noUnderline
          simple
          color='primary'
          size='sm'
          onClick={refreshQueueListing}
        >
          <Refresh />
          Refresh Q
        </Button>
      </div>
      <NotificationList notifications={notifications} dispatch={dispatch} />
    </div>
  )

  return (
    <Popper
      trigger='click'
      className={classnames({
        [classes.pooperResponsive]: true,
        [classes.pooperNav]: true,
      })}
      overlay={overlay}
    >
      <Badge
        badgeContent={notifications.length}
        color='primary'
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Button justIcon color='transparent'>
          <Notifications fontSize='large' />
        </Button>
      </Badge>
    </Popper>
  )
}

export default withStyles(styles, { name: 'NotificationComponent' })(
  NotificationComponent,
)
