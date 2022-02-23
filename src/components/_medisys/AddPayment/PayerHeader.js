import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import { INVOICE_PAYER_TYPE } from '@/utils/constants'
// common components
import { GridContainer, GridItem, NumberInput, Tooltip } from '@/components'
// styling
import styles from './styles'

const titleStyle = {
  width: '100%',
  display: 'inline-block',
  overflow: 'hidden',
  marginTop: 0,
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: '500',
}

const PayerHeader = ({
  classes,
  invoiceNo,
  invoicePayerName,
  patientReferenceNo,
  outstandingAfterPayment,
  totalClaim,
  totalAftGst,
  payerTypeFK,
}) => {
  const showReferrenceNo = payerTypeFK === INVOICE_PAYER_TYPE.PATIENT
  return (
    <div>
      <GridContainer justify='space-between' className={classes.payerHeader}>
        <GridItem md={2}>
          <h5 style={titleStyle}>Payer: </h5>
        </GridItem>
        <GridItem md={6} className={classes.leftAlignText}>
          <Tooltip title={invoicePayerName}>
            <h5 style={{ marginTop: 0 }} title={invoicePayerName}>
              {invoicePayerName}
            </h5>
          </Tooltip>
        </GridItem>
        <GridItem md={2}>
          <h5 style={titleStyle}>Total Payable: </h5>
        </GridItem>
        <GridItem md={2} className={classes.leftAlignText}>
          <NumberInput text currency value={totalAftGst} />
        </GridItem>
      </GridContainer>
      {(showReferrenceNo || totalClaim != undefined) && (
        <GridContainer justify='space-between' className={classes.payerHeader}>
          <GridItem md={2}>
            {showReferrenceNo && <h5 style={titleStyle}>Referrence No.: </h5>}
          </GridItem>
          <GridItem md={6} className={classes.leftAlignText}>
            {showReferrenceNo && (
              <Tooltip title={patientReferenceNo}>
                <h5 style={{ marginTop: 0 }}>{patientReferenceNo}</h5>
              </Tooltip>
            )}
          </GridItem>
          <GridItem md={2}>
            {totalClaim !== undefined && (
              <h5 style={titleStyle}>Total Claim: </h5>
            )}
          </GridItem>
          <GridItem md={2} className={classes.leftAlignText}>
            {totalClaim !== undefined && (
              <NumberInput text currency value={totalClaim} />
            )}
          </GridItem>
        </GridContainer>
      )}
      <GridContainer justify='space-between' className={classes.payerHeader}>
        <GridItem md={2}>
          <Tooltip title={invoiceNo}>
            <h5 style={titleStyle}>Invoice No.: </h5>
          </Tooltip>
        </GridItem>
        <GridItem md={6} className={classes.leftAlignText}>
          <h5 style={{ marginTop: 0 }}>{invoiceNo}</h5>
        </GridItem>
        <GridItem md={2}>
          <h5 style={titleStyle}>Outstanding: </h5>
        </GridItem>
        <GridItem md={2} className={classes.leftAlignText}>
          <NumberInput text currency value={outstandingAfterPayment} />
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
