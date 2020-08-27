import React, { useState } from 'react'
import moment from 'moment'
// material ui
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  withStyles,
} from '@material-ui/core'
import { Button } from '@/components'
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
  copyBtn: {
    paddingTop: '0px !important',
  },
})

const NotificationContent = ({ notification, classes, dispatch }) => {
  const [
    copied,
    setCopied,
  ] = useState(false)
  let messageTitle = notification.type ? TITLE[notification.type] : ''
  // let backgroundColor = notification.type ? COLOR[notification.type] : ''
  const icon = ICONS[notification.type] || Object.values(ICONS)[0]
  if (notification.type === NOTIFICATION_TYPE.QUEUE) {
    const { queueNo = 'xx.x' } = notification
    messageTitle = `${TITLE[NOTIFICATION_TYPE.QUEUE]} ${queueNo.includes('.')
      ? queueNo
      : `${queueNo}.0`} -`
  }
  const isError = notification.type === NOTIFICATION_TYPE.ERROR

  const handleCopyRequestID = () => {
    let temporaryInput = document.createElement('INPUT')
    document.body.appendChild(temporaryInput)
    temporaryInput.setAttribute('value', notification.requestId)
    temporaryInput.select()
    document.execCommand('copy')
    document.body.removeChild(temporaryInput)
    setCopied(true)
  }

  return (
    <ListItem
      button
      alignItems='flex-start'
      className={classes.itemRoot}
      disabled={!isError && notification.read}
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
              <span>{messageTitle}&nbsp;</span>
              <p className={classes.messageText}>{notification.message}</p>
            </div>
            {isError && (
              <div className={classes.itemContainer}>
                <span>Request ID:&nbsp;</span>
                <p>{notification.requestId}</p>
                <Button
                  size='sm'
                  link
                  color='primary'
                  onClick={handleCopyRequestID}
                  className={classes.copyBtn}
                >
                  {copied ? 'Copied' : 'Copy Request ID'}
                </Button>
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
