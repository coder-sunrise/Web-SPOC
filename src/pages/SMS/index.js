import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import { connect } from 'dva'
import { CardContainer, Danger, Tabs } from '@/components'
import New from './New'
import { SmsOption } from './variables'

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

const SMS = ({ classes, sms, dispatch }) => {
  const [
    selectedRows,
    setSelectedRows,
  ] = useState([])

  const newMessageProps = {
    selectedRows,
    sms,
    dispatch,
    setSelectedRows,
  }
  const gridProps = {
    sms,
    dispatch,
    setSelectedRows,
    selectedRows,
  }

  const showWarning = false
  const contentClass = classnames({
    [classes.blur]: showWarning,
  })

  const clearFilter = () => {
    dispatch({
      type: 'sms/updateState',
      payload: {
        filter: undefined,
      },
    })
  }

  const getSMSData = (e) => {
    let type = ''
    if (e === '0') type = 'Appointment'
    else type = 'Patient'
    clearFilter()
    dispatch({
      type: 'sms/query',
      payload: {
        smsType: type,
      },
    })
  }

  useEffect(() => {
    clearFilter()
    dispatch({
      type: 'sms/query',
      payload: {
        smsType: 'Appointment',
      },
    })
  }, [])

  return (
    <CardContainer hideHeader>
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
        <Tabs
          defaultActiveKey='0'
          options={SmsOption(gridProps)}
          onChange={getSMSData}
        />
        <div className={classes.sendBar}>
          <New {...newMessageProps} />
        </div>
      </div>
    </CardContainer>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ sms }) => ({
    sms,
  })),
)(SMS)
