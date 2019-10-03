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
import { SchemePopover, CHASCardReplacement } from 'medisys-components'
import More from '@material-ui/icons/MoreHoriz'
import {
  NumberInput,
  CodeSelect,
  dateFormatLong,
  DatePicker,
  IconButton,
  Popover,
  CommonModal,
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

  const refreshChasBalance = (selectedSchemeTypeFK) => {
    dispatch({
      type: 'patient/refreshChasBalance',
      payload: entity,
    }).then((result) => {
      if (result) {
        const {
          balance,
          patientCoPaymentSchemeFk,
          schemeTypeFk,
          validFrom,
          validTo,
        } = result
        let isShowReplacementModal = false

        if (selectedSchemeTypeFK !== schemeTypeFk) {
          isShowReplacementModal = true
        }

        setRefreshedSchemeData({
          oldSchemeTypeFK: selectedSchemeTypeFK,
          schemeTypeFK: schemeTypeFk,
          balance,
          validFrom,
          validTo,
          isShowReplacementModal,
        })
      }
    })
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
        {
          <CodeSelect
            code='ctGender'
            // optionLabelLength={1}
            text
            value={entity.genderFK}
          />
        })
      </p>

      <Divider light />
      <div
        className={classes.schemeContainer}
        style={{ maxHeight: height - 455 - 20 }}
      >
        {entity.patientScheme.filter((o) => o.schemeTypeFK <= 5).map((o) => {
          // console.log('patientScheme', o)
          const schemeTypeFK = _.isEmpty(refreshedSchemeData)
            ? o.schemeTypeFK
            : refreshedSchemeData.schemeTypeFK
          const balance =
            o.patientSchemeBalance.length <= 0
              ? ''
              : o.patientSchemeBalance[0].balance
          const validFrom = _.isEmpty(refreshedSchemeData)
            ? o.validFrom
            : refreshedSchemeData.validFrom
          const validTo = _.isEmpty(refreshedSchemeData)
            ? o.validTo
            : refreshedSchemeData.validTo

          return (
            <div style={{ marginBottom: theme.spacing(1) }}>
              <p style={{ fontWeight: 500 }}>
                {/* <CodeSelect text code='ctSchemeType' value={o.schemeTypeFK} /> */}
                <CodeSelect text code='ctSchemeType' value={schemeTypeFK} />
                <IconButton>
                  <Refresh onClick={() => refreshChasBalance(o.schemeTypeFK)} />
                </IconButton>

                <SchemePopover
                  isShowReplacementModal={
                    refreshedSchemeData.isShowReplacementModal
                  }
                  handleRefreshChasBalance={() =>
                    refreshChasBalance(o.schemeTypeFK)}
                  data={o}
                  entity={entity}
                  schemeTypeFK={schemeTypeFK}
                  refreshedSchemeData={refreshedSchemeData}
                  balanceValue={
                    _.isEmpty(refreshedSchemeData) ? (
                      balance
                    ) : (
                      refreshedSchemeData.balance
                    )
                  }
                  dateFrom={validFrom}
                  dateTo={validTo}
                />
              </p>
              {validFrom && (
                <div>
                  <p>
                    Balance:{' '}
                    <NumberInput
                      text
                      currency
                      value={
                        _.isEmpty(refreshedSchemeData) ? (
                          balance
                        ) : (
                          refreshedSchemeData.balance
                        )
                      }
                    />
                  </p>
                  <p>
                    Validity:{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      // value={o.validFrom}
                      value={validFrom}
                    />{' '}
                    -{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      // value={o.validTo}
                      value={validTo}
                    />
                  </p>
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
