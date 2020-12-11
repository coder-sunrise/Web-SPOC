import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  GridContainer,
  GridItem,
  NumberInput,
  Tooltip,
} from '@/components'
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
  patient,
  invoice,
  invoicePayerName,
  outstandingAfterPayment,
  showReferrenceNo,
}) => {
  const { totalClaim } = invoice
  const payerColumnConfig = showReferrenceNo ? { md: 6 } : { md: 10 }
  return (
    <div>
      <GridContainer justify='space-between' className={classes.payerHeader}>
        <GridItem md={2}>
          <h5 style={titleStyle}>Payer: </h5>
        </GridItem>
        <GridItem {...payerColumnConfig} className={classes.leftAlignText}>
          <Tooltip title={invoicePayerName}>
            <h5 title={invoicePayerName} style={titleStyle}>{invoicePayerName}</h5>
          </Tooltip>
        </GridItem>
        {showReferrenceNo && (
          <GridItem md={2}>
            <h5 style={titleStyle}>Referrence No.: </h5>
          </GridItem>
        )}
        {showReferrenceNo && (
          <GridItem md={2} className={classes.leftAlignText}>
            <h5 style={{ marginTop: 0 }}>{patient.patientAccountNo}</h5>
          </GridItem>
        )}
      </GridContainer>
      <GridContainer justify='space-between' className={classes.payerHeader}>
        <GridItem md={2}>
          <h5 style={titleStyle}>Total Payable: </h5>
        </GridItem>
        <GridItem md={2} className={classes.leftAlignText}>
          <NumberInput text currency value={invoice.totalAftGst} />
        </GridItem>
        {totalClaim !== undefined && (
          <GridItem md={2}>
            <h5 style={titleStyle}>Total Claim: </h5>
          </GridItem>
        )}
        {totalClaim !== undefined && (
          <GridItem md={2} className={classes.leftAlignText}>
            <NumberInput text currency value={totalClaim} />
          </GridItem>
        )}
        {totalClaim === undefined && (
          <GridItem md={4} className={classes.leftAlignText}>
            <span>&nbsp;</span>
          </GridItem>
        )}
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
