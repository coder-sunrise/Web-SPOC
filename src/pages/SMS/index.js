import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import { compose } from 'redux'
import moment from 'moment'
import { connect } from 'dva'
import { CardContainer, Danger, Tabs } from '@/components'
import New from './New'
import { SmsOption } from './variables'
import { ADD_ON_FEATURE } from '@/utils/constants'

const styles = {
  sendBar: {
    marginTop: '10px',
  },
  blur: {
    opacity: 1,
  },

  warningContent: {
    '& h4': {
      fontWeight: 'bold',
      color: '#696969',
    },
    top: '50%',
    position: 'fixed',
    left: '35%',
    zIndex: 9999,
  },

  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.87)',
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: 999,
    top: '0px',
    left: '0px',
    opacity: 0.5 /* in FireFox */,
    filter: 'alpha(opacity=50),' /* in IE */,
  },
}

const SMS = ({ classes, smsAppointment, smsPatient, dispatch, clinicInfo }) => {
  const [
    selectedRows,
    setSelectedRows,
  ] = useState([])

  const [
    currentTab,
    setCurrentTab,
  ] = useState('0')

  const [
    showWarning,
    setShowWarning,
  ] = useState(false)

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

  const checkSmsConfiguration = (smsService) => {
    if (!smsService) {
      setShowWarning(true)
      return false
    }
    dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctAddonFeature',
      },
    }).then((ctAddonFeature) => {
      const currentDate = moment().formatUTC()
      const {
        effectiveStartDate,
        effectiveEndDate,
        ctAddOnFeatureFK,
      } = smsService
      if (currentDate < effectiveStartDate || currentDate > effectiveEndDate) {
        setShowWarning(true)
        return false
      }
      const smsFeature = ctAddonFeature.find((o) => o.id === ctAddOnFeatureFK)
      if (!smsFeature) {
        setShowWarning(true)
        return false
      }
      return true
    })
  }

  useEffect(() => {
    const { addOnSubscriptions } = clinicInfo
    const smsService = addOnSubscriptions.find(
      (o) => o.ctAddOnFeatureFK === ADD_ON_FEATURE.SMS,
    )

    if (checkSmsConfiguration(smsService)) {
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
    }
  }, [])
  return (
    <div>
      <CardContainer hideHeader>
        {showWarning && (
          <React.Fragment>
            <div className={classes.overlay}> </div>
            <div className={classes.warningContent}>
              <CardContainer hideHeader>
                <Danger>
                  <h4>
                    To configure and use SMS feature, please contact system
                    administrator for assistant.
                  </h4>
                </Danger>
              </CardContainer>
            </div>
          </React.Fragment>
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
    </div>
  )
}
export default compose(
  withStyles(styles, { withTheme: true }),
  React.memo,
  connect(({ smsAppointment, smsPatient, clinicInfo }) => ({
    smsAppointment,
    smsPatient,
    clinicInfo,
  })),
)(SMS)
