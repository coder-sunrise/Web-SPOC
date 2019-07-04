import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { compose } from 'redux'
import { Paper, Grid } from '@material-ui/core'
import { GridContainer } from '@/components'
import {
  ThemeProvider,
  MessageList,
  Message,
  MessageText,
  Avatar,
  Row,
} from '@livechat/ui-kit'

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

const MessageListing = ({ classes }) => {
  const [ list, setList ] = useState([
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
    let i = 0
    let messageCount = messages.length
    let m = []

    while (i < messageCount) {
      let previous = messages[i - 1]
      let current = messages[i]
      let currentMoment = moment(current.date)
      let showTimestamp = true

      if (previous) {
        let previousMoment = moment(previous.date)
        let previousDuration = moment.duration(
          currentMoment.diff(previousMoment),
        )
        if (previousDuration.as('hours') < 1) {
          showTimestamp = false
        }
      }
      const { date, text, avatar, isOwn, deliveryStatus } = current
      let p = { text, avatar, isOwn, deliveryStatus }
      m = m.concat(
        <React.Fragment key={current.id}>
          {showTimestamp && <div style={{ textAlign: 'center' }}>{date}</div>}
          <Row reverse={!!isOwn}>
            <Avatar imgUrl={avatar} />
            <Message {...p}>
              <MessageText
                className={
                  current.isOwn ? classes.sentMessage : classes.repliedMessage
                }
              >
                {text}
              </MessageText>
            </Message>
          </Row>
        </React.Fragment>,
      )
      i += 1
    }
    return m
  }
  const newMessageProps = {
    onSend: (arr) => {
      setList([
        ...list,
        ...arr.map((m, index) => {
          return {
            date: moment().format('YYYY-MM-DD HH-mm'),
            text: m,
            avatar:
              'https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg',
            // authorName: 'Jonn Smith',
            isOwn: true,
            deliveryStatus: 'Pending',
            id: list.length + 1 + index,
          }
        }),
      ])
    },
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
            <MessageList active>{renderMessages(list)}</MessageList>
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
