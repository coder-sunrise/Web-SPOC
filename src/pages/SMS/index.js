import React, { PureComponent, useState } from 'react'
import { connect } from 'dva'
import { FormattedMessage, formatMessage } from 'umi/locale'
import { Assignment, Close } from '@material-ui/icons'
import { withStyles } from '@material-ui/core/styles'
import { Paper } from '@material-ui/core'
import { compare } from '@/layouts'
import { getAppendUrl } from '@/utils/utils'
import { compose } from 'redux'
import MessageListing from './Reminder/MessageListing'
import { CommonModal, Button, CommonHeader } from '@/components'
import Grid from './Grid'
import New from './New'
import FilterBar from './FilterBar'

const styles = {
  sendBar: {
    marginTop: '10px',
  },
}

const SMS = (props) => {
  const [ showMessageModal, setShowMessageModal ] = useState(false)
  const { classes } = props
  const newMessageProps = {
    onSend: (value) => {
      console.log(value)
      //   setList([
      //     ...list,
      //     {
      //       date: moment().format('YYYY-MM-DD HH-mm'),
      //       text: value,
      //       avatar:
      //         'https://livechat.s3.amazonaws.com/default/avatars/male_8.jpg',
      //       // authorName: 'Jonn Smith',
      //       isOwn: true,
      //       deliveryStatus: 'Pending',
      //       id: list.length + 1,
      //     },
      //   ])
      // },
    },
  }
  const gridProps = {
    showSMSHistory: () => {
      console.log('test')
      setShowMessageModal(true)
    },
  }
  return (
    <CommonHeader titleId='finance.statement.statementNo'>
      {/* <Button
        variant='contained'
        color='primary'
        onClick={() => }
      >
        <Assignment />
      </Button> */}
      <FilterBar />
      <Grid {...gridProps} />
      <div className={classes.sendBar}>
        <New {...newMessageProps} />
      </div>
      <CommonModal
        open={showMessageModal}
        title='Send SMS'
        maxWidth='sm'
        onClose={() => setShowMessageModal(false)}
        onConfirm={() => setShowMessageModal(true)}
        showFooter={false}
      >
        {showMessageModal ? <MessageListing /> : null}
      </CommonModal>
    </CommonHeader>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(SMS)
