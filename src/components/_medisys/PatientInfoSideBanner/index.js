import React, { useState } from 'react'
import classnames from 'classnames'
import moment from 'moment'
import _ from 'lodash'
// antd
import { Skeleton } from 'antd'
// material ui
import { withStyles, Divider } from '@material-ui/core'
// common components
import Refresh from '@material-ui/icons/Sync'
import { SchemePopover } from 'medisys-components'
import {
  NumberInput,
  CodeSelect,
  dateFormatLong,
  DatePicker,
  IconButton,
} from '@/components'
import { LoadingWrapper } from '@/components/_medisys'
// assets
import styles from './styles.js'

const PatientInfoSideBanner = ({
  height,
  theme,
  classes,
  entity,
  dispatch,
}) => {
  const entityNameClass = classnames({
    [classes.cardCategory]: true,
    [classes.entityName]: true,
  })

  const [
    refreshedSchemeData,
    setRefreshedSchemeData,
  ] = useState({})

  const refreshChasBalance = (patientCoPaymentSchemeFK, oldSchemeTypeFK) => {
    dispatch({
      type: 'patient/refreshChasBalance',
      payload: {
        ...entity,
        patientCoPaymentSchemeFK,
      },
    }).then((result) => {
      if (result) {
        dispatch({
          type: 'patient/query',
          payload: {
            id: entity.id,
          },
        })

        const {
          balance,
          schemeTypeFk,
          validFrom,
          validTo,
          acuteVisitPatientBalance,
          acuteVisitClinicBalance,
          isSuccessful,
          statusDescription,
          acuteBalanceStatusCode,
          chronicBalanceStatusCode,
        } = result
        let isShowReplacementModal = false
        if (!isSuccessful) {
          setRefreshedSchemeData({
            statusDescription,
            isSuccessful,
          })
        } else {
          if (oldSchemeTypeFK !== schemeTypeFk) {
            isShowReplacementModal = true
          }
          setRefreshedSchemeData({
            isShowReplacementModal,
            oldSchemeTypeFK,
            balance,
            patientCoPaymentSchemeFK,
            schemeTypeFK: schemeTypeFk,
            validFrom,
            validTo,
            acuteVisitPatientBalance,
            acuteVisitClinicBalance,
            isSuccessful,
            acuteBalanceStatusCode,
            chronicBalanceStatusCode,
          })
        }
      }
    })
  }

  const getSchemeDetails = (schemeData) => {
    if (
      !_.isEmpty(refreshedSchemeData) &&
      refreshedSchemeData.isSuccessful === true
    ) {
      return { ...refreshedSchemeData }
    }
    // Scheme Balance
    const balance =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].balance
    // Patient Acute Visit Patient Balance
    const acuteVPBal =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].acuteVisitPatientBalance
    // Patient Acute Visit Clinic Balance
    const acuteVCBal =
      schemeData.patientSchemeBalance.length <= 0
        ? undefined
        : schemeData.patientSchemeBalance[0].acuteVisitClinicBalance

    return {
      balance,
      patientCoPaymentSchemeFK: schemeData.id,
      schemeTypeFK: schemeData.schemeTypeFK,
      validFrom: schemeData.validFrom,
      validTo: schemeData.validTo,
      acuteVisitPatientBalance: acuteVPBal,
      acuteVisitClinicBalance: acuteVCBal,
      statusDescription: refreshedSchemeData.statusDescription,
      // acuteBalanceStatusCode:
      //   schemeData.patientSchemeBalance.length > 0
      //     ? schemeData.patientSchemeBalance[0].acuteBalanceStatusCode
      //     : '',
      // chronicBalanceStatusCode:
      //   schemeData.patientSchemeBalance.length > 0
      //     ? schemeData.patientSchemeBalance[0].chronicBalanceStatusCode
      //     : '',
      isSuccessful:
        refreshedSchemeData.isSuccessful !== ''
          ? refreshedSchemeData.isSuccessful
          : '',
    }
  }

  return entity && entity.id ? (
    <React.Fragment>
      <h4 className={entityNameClass}>
        <CodeSelect
          // authority='none'
          text
          code='ctSalutation'
          value={entity.salutationFK}
        />{' '}
        {entity.name}
      </h4>
      <p>{entity.patientReferenceNo}</p>
      <p>
        {entity.patientAccountNo},{' '}
        <CodeSelect text code='ctNationality' value={entity.nationalityFK} />
      </p>

      <p>
        <DatePicker text format={dateFormatLong} value={entity.dob} />
        ({Math.floor(
          moment.duration(moment().diff(entity.dob)).asYears(),
        )},&nbsp;
        <CodeSelect
          code='ctGender'
          // optionLabelLength={1}
          text
          value={entity.genderFK}
        />)
      </p>

      <Divider light />
      <div
        className={classes.schemeContainer}
        style={{ maxHeight: height - 455 - 20 }}
      >
        {entity.patientScheme.filter((o) => o.schemeTypeFK <= 6).map((o) => {
          const schemeData = getSchemeDetails(o)
          return (
            <div style={{ marginBottom: theme.spacing(1) }}>
              <p style={{ fontWeight: 500 }}>
                {/* <CodeSelect text code='ctSchemeType' value={o.schemeTypeFK} /> */}
                <CodeSelect
                  text
                  code='ctSchemeType'
                  value={schemeData.schemeTypeFK}
                />
                <IconButton>
                  <Refresh
                    onClick={() =>
                      refreshChasBalance(
                        schemeData.patientCoPaymentSchemeFK,
                        schemeData.schemeTypeFK,
                      )}
                  />
                </IconButton>

                <SchemePopover
                  isShowReplacementModal={schemeData.isShowReplacementModal}
                  handleRefreshChasBalance={() =>
                    refreshChasBalance(
                      schemeData.patientCoPaymentSchemeFK,
                      schemeData.schemeTypeFK,
                    )}
                  entity={entity}
                  schemeData={schemeData}
                />
              </p>
              {schemeData.validFrom && (
                <div>
                  <p>
                    Balance:{' '}
                    {schemeData.chronicBalanceStatusCode === 'SC105' ? (
                      'Full Balance'
                    ) : (
                      <NumberInput text currency value={schemeData.balance} />
                    )}
                  </p>
                  <p>
                    Validity:{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      // value={o.validFrom}
                      value={schemeData.validFrom}
                    />{' '}
                    -{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      // value={o.validTo}
                      value={schemeData.validTo}
                    />
                  </p>
                  <p style={{ color: 'red' }}>{schemeData.statusDescription}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {entity.patientScheme.filter((o) => o.schemeTypeFK <= 5).length > 0 && (
        <Divider light />
      )}
    </React.Fragment>
  ) : null
}

export default withStyles(styles, {
  withTheme: true,
  name: 'PatientInfoSideBanner',
})(PatientInfoSideBanner)
