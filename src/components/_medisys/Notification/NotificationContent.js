import React from 'react'
import moment from 'moment'
// material ui
import { ListItem, ListItemText, withStyles } from '@material-ui/core'
import { TITLE } from './constants'
import { NOTIFICATION_TYPE } from '@/utils/constants'

const styles = () => ({
  root: { maxHeight: 100 },
  itemContainer: { display: 'flex' },
  messageText: { marginLeft: 10 },
  timestampText: {
    color: 'grey',
    fontSize: 12,
    marginTop: 5,
  },
})

const NotificationContent = ({ notification, classes }) => {
  let messageTitle = notification.type ? TITLE[notification.type] : ''
  if (notification.type === NOTIFICATION_TYPE.QUEUE) {
    const { queueNo = 'xx.x' } = notification
    messageTitle = `${TITLE[NOTIFICATION_TYPE.QUEUE]} ${queueNo}`
  }

  return (
    <div className={classes.root} key={notification.senderId}>
      <ListItem alignItems='flex-start'>
        <ListItemText
          primary={
            <div className={classes.itemContainer}>
              <b>{`${messageTitle} -`}</b>
              <p className={classes.messageText}>{notification.message}</p>
            </div>
          }
          secondary={
            <p className={classes.timestampText}>
              {moment(notification.timestamp).toNow(true).concat(' ago')}
            </p>
          }
        />
      </ListItem>
      <hr style={{ margin: 0 }} />
    </div>
  )
}

export default withStyles(styles, { name: 'NotificationContent' })(
  NotificationContent,
)
