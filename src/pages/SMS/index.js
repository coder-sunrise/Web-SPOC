import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import moment from 'moment'
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

const SMS = ({ classes, smsAppointment, smsPatient, dispatch }) => {
  const [
    selectedRows,
    setSelectedRows,
  ] = useState([])

  const [
    currentTab,
    setCurrentTab,
  ] = useState('0')

  const newMessageProps = {
    selectedRows,
    dispatch,
    setSelectedRows,
    smsAppointment,
    smsPatient,
    currentTab,
  }
  const gridProps = {
    classes,
    smsAppointment,
    smsPatient,
    dispatch,
    setSelectedRows,
    selectedRows,
  }

  const showWarning = false
  const contentClass = classnames({
    [classes.blur]: showWarning,
  })

  const defaultSearchQuery = (type) => {
    if (type === 'Appointment') {
      return {
        lgteql_AppointmentDate: moment().formatUTC(),

        lsteql_AppointmentDate: moment().add(1, 'months').formatUTC(false),
      }
    }
    return {
      'lgteql_Visit.VisitDate': moment().subtract(1, 'months').formatUTC(),
      'lsteql_Visit.VisitDate': moment().formatUTC(false),
      'PatientPdpaConsent.IsConsent': true,
    }
  }

  useEffect(() => {
    dispatch({
      type: 'smsAppointment/query',
      payload: {
        smsType: 'Appointment',
        ...defaultSearchQuery('Appointment'),
      },
    })
    dispatch({
      type: 'smsPatient/query',
      payload: {
        smsType: 'Patient',
        ...defaultSearchQuery(),
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
          onChange={(e) => setCurrentTab(e)}
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
  connect(({ smsAppointment, smsPatient }) => ({
    smsAppointment,
    smsPatient,
  })),
)(SMS)
