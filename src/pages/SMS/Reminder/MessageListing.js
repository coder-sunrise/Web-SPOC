import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { compose } from 'redux'
import { Paper, Grid } from '@material-ui/core'
import { List, message, Avatar, Spin } from 'antd'
import InfiniteScroll from 'react-infinite-scroller'
import {
  ThemeProvider,
  MessageList,
  Message,
  MessageText,
  Row,
} from '@livechat/ui-kit'
import { dateFormatLongWithTimeNoSec, timeFormat24Hour } from '@/components'

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

  demoInfiniteContainer: {
    border: '1px solid #e8e8e8',
    borderRadius: 4,
    overflow: 'auto',
    padding: '8px 24px',
    height: 400,
  },
  demoLoadingContainer: {
    // position: 'absolute',
    // bottom: 40,
    width: '100%',
    textAlign: 'center',
  },
})

const MessageListing = ({
  classes,
  recipient,
  dispatch,
  onConfirm,
  footer,
  smsAppointment,
  smsPatient,
}) => {
  const [
    historyList,
    setHistoryList,
  ] = useState([])
  const [
    loading,
    setLoading,
  ] = useState(false)
  const [
    hasMore,
    setHasMore,
  ] = useState(true)
  const [
    totalHistory,
    setTotalHistory,
  ] = useState(0)

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1)

  const getSMSHistory = () => {
    const phoneNum = `${recipient.countryCode}${recipient.patientContactNo}`
    dispatch({
      type: 'sms/querySMSHistory',
      payload: {
        Recipient: parseInt(phoneNum, 10),
        current: currentPage,
        pagesize: 10,
      },
    }).then((v) => {
      if (v) {
        const { data, totalRecords } = v.data
        setHistoryList((prevList) => [
          ...prevList,
          ...data,
        ])
        setTotalHistory(totalRecords)
        setLoading(false)
      }
    })
  }

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
    smsAppointment,
    smsPatient,
  }

  const checkIsItLoadedAllHistory = () => {
    if (historyList.length >= totalHistory) {
      // message.warning('Infinite List loaded all')
      setHasMore(false)
      setLoading(false)
      return true
    }
    return false
  }

  useEffect(
    () => {
      getSMSHistory(currentPage)
    },
    [
      currentPage,
    ],
  )

  const refresh = () => {
    setHistoryList([])
    setTotalHistory(0)
    setHasMore(true)
    setCurrentPage(1)
  }

  const handleInfiniteOnLoad = () => {
    setLoading(true)
    if (checkIsItLoadedAllHistory()) return
    setCurrentPage(currentPage + 1)
  }

  return (
    <React.Fragment>
      <div className={classes.demoInfiniteContainer}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={handleInfiniteOnLoad}
          hasMore={!loading && hasMore}
          useWindow={false}
        >
          <ThemeProvider>
            <Paper>
              <MessageList active>{renderMessages(historyList)}</MessageList>
              {loading &&
              hasMore && (
                <div className={classes.demoLoadingContainer}>
                  <Spin />
                </div>
              )}
            </Paper>
          </ThemeProvider>
        </InfiniteScroll>
      </div>
      <Grid item>
        <Paper className={classes.sendBar}>
          <New {...newMessageProps} />
        </Paper>
      </Grid>
      {footer &&
        footer({
          onConfirm: refresh,
          confirmBtnText: 'Refresh',
          confirmProps: {
            disabled: false,
          },
        })}
    </React.Fragment>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  MessageListing,
)
