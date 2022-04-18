import React, { Component } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import withFormikExtend from '@/components/Decorator/withFormikExtend'
import { ListItem, ListItemText, withStyles, Divider } from '@material-ui/core'
import { Button } from '@/components'
import { AppNotificationContent } from '@/components/_medisys'
import * as Yup from 'yup'
import classnames from 'classnames'
import { sendNotification } from '@/utils/realtime'
import color from 'color'
import { hoverColor } from 'mui-pro-jss'
import { compose } from 'redux'
import { APPNOTIFICATION_SCHEMA } from '@/utils/constants'

const validationSchema = Yup.object().shape({
  rows: Yup.array().of(
    Yup.object().shape({
      content: Yup.string().required('Content cannot be empty.'),
    }),
  ),
})

const styles = theme => ({
  root: {},
  emptyRoot: {
    minHeight: 290,
    maxHeight: 290,
    display: 'flex',
    justifyContent: 'center',
  },
  listRoot: {
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: color(hoverColor)
      .lighten(0.05)
      .hex(),
  },
  footer: {
    textAlign: 'center',
    padding: theme.spacing(),
  },
  buttonLink: { margin: 'auto' },
  itemRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    cursor: 'pointer',
    '&:not(:last-child)': {
      borderBottom: `1px solid rgba(0, 0, 0, 0.12)`,
    },
    '&.Mui-disabled': {
      opacity: 1,
      backgroundColor: 'white',
    },
  },
})
const AppNotificationList = ({
  dispatch,
  classes,
  notifications = [],
  user,
  source,
  appNotification,
}) => {
  const loadNotifications = loadMore => {
    dispatch({
      type: 'appNotification/loadNotifications',
      payload: { loadMore },
    })
  }

  const clearNotification = () => {
    dispatch({
      type: 'header/clearNotification',
      payload: {
        type: Object.values(APPNOTIFICATION_SCHEMA).find(x => x.name === source).id,
      },
    })
  }

  const upsertNotification = payload => {
    dispatch({
      type: 'appNotification/upsert',
      payload: payload,
    }).then(r => {
      if (r == 204) loadNotifications()
    })
  }

  const readNotification = notification => {
    upsertNotification({
      ...notification,
      isRead: true,
      readDate: moment().formatUTC(false),
    })
  }

  const readAllNotification = () => {
    dispatch({
      type: 'appNotification/readAllNotification',
      payload: notifications.map(x => ({
        id: x.id,
        isRead: true,
        readDate: moment().formatUTC(false),
      })),
    }).then(r => {
      if (r == 204) loadNotifications()
    })
  }

  const handleItemAcknowledge = notification => {
    upsertNotification({
      ...notification,
      isAcknowledged: true,
      acknowledgeDate: moment().formatUTC(false),
      isRead: true,
      readDate: moment().formatUTC(false),
    })
  }

  const rootClass = classnames({
    [classes.root]: true,
    [classes.listRoot]: notifications.length > 0,
    [classes.emptyRoot]: notifications.length === 0,
  })

  const actions = {
    onAcknowledge: handleItemAcknowledge,
  }

  if (notifications.length > 0) {
    // const sorted = _.orderBy(notifications, ['generateDate'], ['desc'])
    return (
      <div>
        <div className={rootClass}>
          {notifications.map((notification, index) => (
            <ListItem
              button
              className={classes.itemRoot}
              disabled={notification.read}
              onClick={() => {
                readNotification(notification)
                document.activeElement?.blur()
              }}
            >
              <ListItemText
                primary={
                  <AppNotificationContent
                    key={index}
                    dispatch={dispatch}
                    notification={notification}
                    currentUserFK={user.data.id}
                    {...actions}
                  />
                }
              />
            </ListItem>
          ))}
        </div>
        <Divider />
        <div className={classes.footer}>
          {notifications.some(x => !x.isRead) && (
            <Button
              className={classes.buttonLink}
              link
              size='sm'
              onClick={readAllNotification}
            >
              Make all as read
            </Button>
          )}
          <Button
            className={classes.buttonLink}
            link
            size='sm'
            onClick={clearNotification}
          >
            Clear
          </Button>
          <Button
            className={classes.buttonLink}
            link
            size='sm'
            onClick={() => loadNotifications(true)}
          >
            {`(${appNotification.pageSize}/${appNotification.totalRecords}) `}
            Load More
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

export default compose(
  withStyles(styles, { name: 'AppNotificationList' }),
  connect(({ user, appNotification }) => ({
    user: user,
    appNotification: appNotification,
  })),
)(AppNotificationList)
