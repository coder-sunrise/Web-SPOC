import React from 'react'
import moment from 'moment'
import { withStyles } from '@material-ui/core'
import {
  GridContainer,
  GridItem,
  Button,
  NumberInput,
  DatePicker,
  dateFormatLong,
  CodeSelect,
} from '@/components'
import styles from './styles'

const CHASCardReplacement = ({
  theme,
  classes,
  entity,
  refreshedSchemeData,
  handleOnClose,
}) => {
  const {
    oldSchemeTypeFK,
    balance,
    schemeTypeFK,
    validFrom,
    validTo,
    acuteVisitPatientBalance,
    acuteVisitClinicBalance,
    acuteBalanceStatusCode,
    chronicBalanceStatusCode,
    isSuccessful,
  } = refreshedSchemeData
  const { callingName, patientAccountNo } = entity

  const data = entity.patientScheme.filter(
    (o) => o.schemeTypeFK === oldSchemeTypeFK,
  )[0]

  return (
    <GridContainer style={{ marginBottom: theme.spacing(1) }}>
      <GridContainer className={classes.patientDetail}>
        <GridItem md={6}>Patient: {callingName}</GridItem>
        <GridItem md={6}>Account No: {patientAccountNo}</GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem>
          <br />
        </GridItem>
      </GridContainer>
      <GridContainer className={classes.schemeName}>
        <GridItem md={2} />
        <GridItem md={4}>Old CHAS Card:</GridItem>
        <GridItem md={4}>
          <CodeSelect text code='ctSchemeType' value={oldSchemeTypeFK} />
        </GridItem>
        <GridItem md={2} />
        <GridItem md={2} />
        <GridItem md={4}>New CHAS Card:</GridItem>
        <GridItem md={4}>
          <CodeSelect text code='ctSchemeType' value={schemeTypeFK} />
        </GridItem>
        <GridItem md={2} />
      </GridContainer>
      <GridContainer>
        <GridItem>
          <br />
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem md={5}>CHAS Balance:</GridItem>
        {chronicBalanceStatusCode === 'SC105' ? (
          <GridItem md={5}>Full Balance</GridItem>
        ) : (
          <GridItem md={5}>
            <NumberInput text currency value={balance} />
          </GridItem>
        )}
        <GridItem md={2} />
        <GridItem md={5}>CHAS Validity: </GridItem>
        <GridItem md={5}>
          <DatePicker text format={dateFormatLong} value={validTo} />
        </GridItem>
        <GridItem md={2} />

        <GridItem md={5}>Patient Acute Visit Balance:</GridItem>

        {acuteBalanceStatusCode === 'SC100' ||
        (acuteVisitPatientBalance !== undefined &&
          acuteBalanceStatusCode === undefined) ? (
            <GridItem md={5}>
            <div
              style={{
                fontWeight: 500,
                display: 'inline-block',
                paddingLeft: 2,
              }}
            >
              {acuteVisitPatientBalance} Remaining{' '}
            </div>{' '}
            for Year {moment().year()}
          </GridItem>
        ) : (
          <GridItem> NA</GridItem>
        )}
        <GridItem md={2} />

        <GridItem md={5}>Patient Acute Clinic Balance:</GridItem>
        {acuteBalanceStatusCode === 'SC100' ||
        (acuteVisitClinicBalance !== undefined &&
          acuteBalanceStatusCode === undefined) ? (
            <GridItem md={5}>
            <div
              style={{
                fontWeight: 500,
                display: 'inline-block',
                paddingLeft: 2,
              }}
            >
              {acuteVisitClinicBalance} Remaining
            </div>{' '}
            for {moment().format('MMMM')} {moment().year()}
          </GridItem>
        ) : (
          <GridItem> NA</GridItem>
        )}
        <GridItem md={2} />
      </GridContainer>
      <GridContainer className={classes.confirmButton}>
        <Button color='primary' onClick={handleOnClose}>
          OK
        </Button>
      </GridContainer>
    </GridContainer>
  )
}

export default withStyles(styles, {
  withTheme: true,
  name: 'CHASCardReplacement',
})(CHASCardReplacement)
