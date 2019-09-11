import React, { useState } from 'react'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import MessageListing from './Reminder/MessageListing'
import { CommonModal, CardContainer, Danger } from '@/components'
import Grid from './Grid'
import New from './New'
import FilterBar from './FilterBar'

const styles = {
  sendBar: {
    marginTop: '10px',
  },
  blur: {
    opacity: 0.4,
  },
  warningContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    zIndex: 9999,
  },
  warningContent: {
    top: '50%',
    left: '45%',
    position: 'fixed',
    '& h4': {
      fontWeight: 'bold',
    },
  },
}

const SMS = ({ classes }) => {
  const [
    showMessageModal,
    setShowMessageModal,
  ] = useState(false)
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

  const showWarning = false
  const contentClass = classnames({
    [classes.blur]: showWarning,
  })

  return (
    <CardContainer hideHeader>
      {/* <Button
        variant='contained'
        color='primary'
        onClick={() => }
      >
        <Assignment />
      </Button> */}
      {showWarning && (
        <div className={classes.warningContainer}>
          <div className={classes.warningContent}>
            <CardContainer hideHeader>
              <Danger>
                <h4>Please contact administrator to setup SMS feature.</h4>
              </Danger>
            </CardContainer>
          </div>
        </div>
      )}
      <div className={contentClass}>
        <FilterBar />
        <Grid {...gridProps} />
        <div className={classes.sendBar}>
          <New {...newMessageProps} />
        </div>
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
