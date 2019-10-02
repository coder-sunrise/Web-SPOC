import React, { useState } from 'react'
import classnames from 'classnames'
import moment from 'moment'
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
    showReplacementModal,
    setShowReplacementModal,
  ] = useState(false)

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

        if (selectedSchemeTypeFK !== schemeTypeFk) {
          setShowReplacementModal(true)
        }
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
          return (
            <div style={{ marginBottom: theme.spacing(1) }}>
              <p style={{ fontWeight: 500 }}>
                <CodeSelect text code='ctSchemeType' value={o.schemeTypeFK} />
                <IconButton>
                  <Refresh onClick={() => refreshChasBalance(o.schemeTypeFK)} />
                </IconButton>

                <SchemePopover
                  handleRefreshChasBalance={refreshChasBalance}
                  data={o}
                />
              </p>
              {o.validFrom && (
                <div>
                  <p>
                    Balance:{' '}
                    <NumberInput
                      text
                      currency
                      value={
                        o.patientSchemeBalance.length <= 0 ? (
                          ''
                        ) : (
                          o.patientSchemeBalance[0].balance
                        )
                      }
                    />
                  </p>
                  <p>
                    Validity:{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      value={o.validFrom}
                    />{' '}
                    -{' '}
                    <DatePicker
                      text
                      format={dateFormatLong}
                      value={o.validTo}
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

      <CommonModal
        open={showReplacementModal}
        title='CHAS Card Replacement'
        maxWidth='md'
        onConfirm={() => setShowReplacementModal(false)}
        onClose={() => setShowReplacementModal(false)}
      >
        <CHASCardReplacement
          handleOnClose={() => setShowReplacementModal(false)}
        />
      </CommonModal>
    </React.Fragment>
  ) : null
}

export default withStyles(styles, {
  withTheme: true,
  name: 'PatientInfoSideBanner',
})(PatientInfoSideBanner)
