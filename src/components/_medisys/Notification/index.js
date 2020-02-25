import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles, Divider } from '@material-ui/core'
import Notifications from '@material-ui/icons/Notifications'
import Refresh from '@material-ui/icons/Refresh'
// common components
import { Badge, Popper, Button, Tabs, IconButton } from '@/components'
// sub components
import NotificationList from './NotificationList'
// assets
import customDropdownStyle from '@/assets/jss/material-dashboard-pro-react/components/customDropdownStyle'
import { TYPES } from './constants'

const styles = (theme) => ({
  ...customDropdownStyle(theme),
  overlayRoot: {
    display: 'flex',
    height: 50,
    borderBottom: 'solid 1px #DCDCDC',
  },
})

const NotificationComponent = ({
  notifications = [],
  dispatch,
  classes,
  theme,
}) => {
  const refreshQueueListing = () => {
    dispatch({
      type: 'queueLog/refresh',
    })
  }

  const overlay = (
    <div style={{ position: 'relative', width: 600 }}>
      <Tabs
        type='line'
        // style={{ marginTop: 20 }}
        // activeKey={active}
        // defaultActivekey='1'
        // onChange={(e) => setActive(e)}
        options={TYPES.map((o) => {
          const list = notifications.filter((m) => !o.id || m.type === o.id)
          return {
            ...o,
            name: `${o.name} ${list.filter((m) => !m.read).length > 0
              ? `(${list.filter((m) => !m.read).length})`
              : ''}`,
            content: (
              <NotificationList
                notifications={list}
                dispatch={dispatch}
                type={o.id}
              />
            ),
          }
        })}
      />
      <IconButton
        style={{ top: 12, right: 12, position: 'absolute' }}
        onClick={refreshQueueListing}
      >
        <Refresh />
      </IconButton>
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
        badgeContent={notifications.filter((o) => !o.read).length}
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

export default withStyles(styles, {
  withTheme: true,
  name: 'NotificationComponent',
})(NotificationComponent)
