import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import MessageListing from './Reminder/MessageListing'
import { CommonModal, CardContainer } from '@/components'
import Grid from './Grid'
import New from './New'
import FilterBar from './FilterBar'

const styles = {
  sendBar: {
    marginTop: '10px',
  },
}

const SMS = ({ classes }) => {
  const [ showMessageModal, setShowMessageModal ] = useState(false)
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
      setShowMessageModal(true)
    },
  }
  return (
    <CardContainer hideHeader>
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
        onClose={() => setShowMessageModal(false)}
        onConfirm={() => setShowMessageModal(true)}
        showFooter={false}
      >
        {showMessageModal ? <MessageListing /> : null}
      </CommonModal>
    </CardContainer>
  )
}
export default compose(withStyles(styles, { withTheme: true }), React.memo)(SMS)
