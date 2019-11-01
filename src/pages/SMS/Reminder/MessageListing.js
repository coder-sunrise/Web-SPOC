import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { compose } from 'redux'
import { Paper, Grid } from '@material-ui/core'
import {
  ThemeProvider,
  MessageList,
  Message,
  MessageText,
  Avatar,
  Row,
} from '@livechat/ui-kit'
import {
  GridContainer,
  dateFormatLongWithTimeNoSec,
  timeFormat24Hour,
} from '@/components'

import New from '../New'

const styles = () => ({
  messageBar: {
    height: '55vh',
  },
  sendBar: {
    height: 'auto',
  },
  sentMessage: {
    marginBottom: '0.1em',
    backgroundColor: 'rgb(66, 127, 225)',
    color: 'rgb(255, 255, 255)',
    borderTopLeftRadius: '1.4em',
    borderTopRightRadius: '1.4em',
    borderBottomRightRadius: '0.3em',
    borderBottomLeftRadius: '1.4em',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderImage: 'initial',
  },
  repliedMessage: {
    marginBottom: '0.1em',
    backgroundColor: 'rgb(251, 251, 251)',
    borderTopLeftRadius: '1.4em',
    borderTopRightRadius: '1.4em',
    borderBottomRightRadius: '1.4em',
    borderBottomLeftRadius: '0.3em',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 0, 0, 0.05)',
    borderImage: 'initial',
  },
})

const MessageListing = ({ classes, sms, recipient, dispatch, onConfirm }) => {
  const [
    list,
    setList,
  ] = useState([
    {
      date: '2019-05-01 21:37',
      text: 'Hi Tan Ah Kow',
      avatar: 'https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg',
      // authorName: 'Jonn Smith',
      isOwn: true,
      deliveryStatus: 'Sent',
      id: 1,
    },
    {
      date: '2019-05-01 22:38',
      text: 'Hi ',
      avatar:
        'https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png',
      // authorName: 'Jonn',
      isOwn: false,
      id: 2,
    },
    {
      date: '2019-05-01 22:39',
      text: 'How Are you ',
      avatar: 'https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg',
      // authorName: 'Jonn',
      isOwn: true,
      deliveryStatus: 'Sent',
      id: 3,
    },
    {
      date: '2019-05-01 22:37',
      text: 'Are you okay',
      avatar: 'https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg',
      // authorName: 'Jonn',
      isOwn: true,
      deliveryStatus: 'Sent',
      id: 4,
    },
    {
      date: '2019-05-01 22:37',
      text: 'Yes doctor',
      avatar:
        'https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png',
      // authorName: 'Jonn Smith',
      isOwn: false,
      id: 5,
    },
    {
      date: '2019-05-01 22:37',
      text: 'Yes doctor',
      avatar:
        'https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png',
      // authorName: 'Jonn Smith',
      isOwn: false,
      id: 6,
    },
    {
      date: '2019-05-01 22:37',
      text: 'Yes doctor',
      avatar:
        'https://static.staging.livechatinc.com/1520/P10B78E30V/dfd1830ebb68b4eefe6432d7ac2be2be/Cat-BusinessSidekick_Wallpapers.png',
      // authorName: 'Jonn Smith',
      isOwn: false,
      id: 7,
    },
    {
      date: '2019-05-01 23:37',
      text: 'Can we make appointment on 2019-02-31',
      avatar: 'https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg',
      // authorName: 'Jonn',
      isOwn: true,
      deliveryStatus: 'Pending',
      id: 8,
    },
  ])
  const renderMessages = (messages) => {
    if (messages) {
      let i = 0
      let messageCount = messages.length
      let m = []

      while (i < messageCount) {
        let previous = messages[i - 1]
        let current = messages[i]
        let currentMoment = moment(current.sendDate)
        let showTimestamp = true

        if (previous) {
          let previousMoment = moment(previous.sendDate)
          let previousDuration = moment.duration(
            previousMoment.diff(currentMoment),
          )
          if (previousDuration.asMinutes() < 2) {
            showTimestamp = false
          }
        }
        const { sendDate, content, status } = current
        let p = { content, status }
        m = m.concat(
          <React.Fragment key={current.id}>
            {showTimestamp && (
              <div style={{ textAlign: 'center' }}>
                {moment(sendDate).format(dateFormatLongWithTimeNoSec)}
              </div>
            )}
            <Row reverse>
              <Message
                {...p}
                date={moment(sendDate).format(timeFormat24Hour)}
                isOwn
                showMetaOnClick
              >
                <MessageText className={classes.sentMessage}>
                  {content}
                </MessageText>
              </Message>
            </Row>
          </React.Fragment>,
        )
        i += 1
      }
      return m
    }
    return null
  }
  const newMessageProps = {
    recipient,
    dispatch,
    onConfirm,
  }
  return (
    <ThemeProvider>
      <GridContainer
        style={{
          overflowY: 'auto',
        }}
        direction='column'
        spacing={8}
      >
        <Grid item>
          <Paper className={classes.messageBar}>
            <MessageList active>{renderMessages(sms.smsHistory)}</MessageList>
          </Paper>
        </Grid>
        <Grid item>
          <Paper className={classes.sendBar}>
            <New {...newMessageProps} />
          </Paper>
        </Grid>
      </GridContainer>
    </ThemeProvider>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  MessageListing,
)
