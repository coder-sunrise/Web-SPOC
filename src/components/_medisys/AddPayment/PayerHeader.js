import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridContainer, GridItem } from '@/components'
// styling
import styles from './styles'

const parseToTwoDecimalString = (value = 0.0) => value.toFixed(2)

const PayerHeader = ({ classes, patient, invoice }) => (
  <GridContainer justify='space-between' className={classes.payerHeader}>
    <GridItem md={3} className={classes.leftAlignText}>
      <h4>Payer: </h4>
      <h4>{patient.name}</h4>
    </GridItem>
    <GridItem md={3} className={classes.centerText}>
      <h4>Total Payable: </h4>
      <h4>$ {parseToTwoDecimalString(invoice.totalAftGst)}</h4>
    </GridItem>
    <GridItem md={3} className={classes.centerText}>
      <h4>Outstanding: </h4>
      <h4>$ {parseToTwoDecimalString(invoice.outstandingBalance)}</h4>
    </GridItem>
  </GridContainer>
)

const ConnectedPayerHeader = connect(({ patient }) => ({
  patient: patient.entity || patient.default,
}))(PayerHeader)

export default withStyles(styles, { name: 'PayerHeader' })(ConnectedPayerHeader)
