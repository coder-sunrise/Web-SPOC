import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
// common components
import { Button, GridContainer, GridItem } from '@/components'
// styling
import styles from './styles'
import { paymentTypes } from './variables'
import { PAYMENT_MODE } from '@/utils/constants'

const PayerHeader = ({
  classes,
  disableCash,
  handlePaymentTypeClick,
  patientInfo,
}) => (
  <GridContainer alignItems='center' className={classes.paymentTypeRow}>
    <GridItem className={classes.leftAlignText}>
      <h4>Payment Type: </h4>
    </GridItem>
    <GridItem>
      <Button
        color='primary'
        size='sm'
        disabled={disableCash}
        id={PAYMENT_MODE.CASH}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Cash
      </Button>
      <Button
        color='primary'
        size='sm'
        id={PAYMENT_MODE.NETS}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Nets
      </Button>
      <Button
        color='primary'
        size='sm'
        id={PAYMENT_MODE.CREDIT_CARD}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Credit Card
      </Button>
      <Button
        color='primary'
        size='sm'
        id={PAYMENT_MODE.CHEQUE}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Cheque
      </Button>
      <Button
        color='primary'
        size='sm'
        id={PAYMENT_MODE.GIRO}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        GIRO
      </Button>
      <Button
        color='primary'
        size='sm'
        id={PAYMENT_MODE.DEPOSIT}
        onClick={handlePaymentTypeClick}
        disabled={patientInfo.patientDeposit === undefined}
      >
        <Add />
        Deposit
      </Button>
    </GridItem>
  </GridContainer>
)

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
