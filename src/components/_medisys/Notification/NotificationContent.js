import React from 'react'
import moment from 'moment'
// material ui
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  withStyles,
} from '@material-ui/core'
import { TITLE, COLOR, ICONS } from './constants'
import { NOTIFICATION_TYPE } from '@/utils/constants'

const styles = () => ({
  root: { maxHeight: 100, background: '#f0f8ff' },
  itemContainer: { display: 'flex' },
  messageText: {},
  timestampText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 5,
  },
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
  icon: {
    minWidth: 38,
  },
})

const NotificationContent = ({ notification, classes, dispatch }) => {
  let messageTitle = notification.type ? TITLE[notification.type] : ''
  // let backgroundColor = notification.type ? COLOR[notification.type] : ''
  const icon = ICONS[notification.type] || Object.values(ICONS)[0]
  if (notification.type === NOTIFICATION_TYPE.QUEUE) {
    const { queueNo = 'xx.x' } = notification
    messageTitle = `${TITLE[NOTIFICATION_TYPE.QUEUE]} ${queueNo} -`
  }
  const isError = notification.type === NOTIFICATION_TYPE.ERROR
  return (
    <ListItem
      button
      alignItems='flex-start'
      className={classes.itemRoot}
      disabled={notification.read}
      onClick={() => {
        dispatch({
          type: 'header/readNotification',
          payload: {
            notification,
          },
        })
      }}
    >
      <ListItemIcon className={classes.icon}>{icon}</ListItemIcon>
      <ListItemText
        primary={
          <div>
            <div className={classes.itemContainer}>
              <span>{messageTitle}</span>
              <p className={classes.messageText}>{notification.message}</p>
            </div>
            {isError && (
              <div className={classes.itemContainer}>
                <span>Request ID:&nbsp;</span>
                <p>{notification.requestId}</p>
              </div>
            )}
          </div>
        }
        secondary={
          <p className={classes.timestampText}>
            {moment(notification.timestamp).toNow(true).concat(' ago')} send by{' '}
            {notification.sender}
          </p>
        }
      />
    </ListItem>
  )
}

export default withStyles(styles, { name: 'NotificationContent' })(
  NotificationContent,
)
