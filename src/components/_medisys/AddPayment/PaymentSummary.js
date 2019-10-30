import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridItem, Field, NumberInput } from '@/components'
// styling
import styles from './styles'
import { PAYMENT_MODE } from '@/utils/constants'

const parseToTwoDecimalString = (value = 0.0) => value.toFixed(2)

const PaymentSummary = ({
  classes,
  totalAftGst,
  outstandingBalance,
  collectableAmount,
  cashReturned,
  cashRounding,
  handleCashReceivedChange,
  paymentList,
  minCashReceived,
}) => {
  const shouldDisableCashReceived = paymentList.reduce(
    (noCashPaymentMode, payment) =>
      payment.paymentModeFK === PAYMENT_MODE.CASH ? false : noCashPaymentMode,
    true,
  )
  return (
    <React.Fragment>
      <GridItem md={6} className={classes.paymentSummary} />
      <GridItem md={6} container className={classes.paymentSummary}>
        <GridItem md={6}>Total Payment: </GridItem>
        <GridItem md={6}>
          <NumberInput text currency value={outstandingBalance} />
        </GridItem>
        <GridItem md={6}>Cash Rounding: </GridItem>
        <GridItem md={6}>
          <NumberInput value={cashRounding} text currency />
        </GridItem>
        <GridItem md={6}>Collectable Amount: </GridItem>
        <GridItem md={6}>
          <NumberInput value={collectableAmount} text currency />
        </GridItem>
        <GridItem md={6}>Cash Received: </GridItem>
        <GridItem md={3} />
        <GridItem md={3}>
          <Field
            name='cashReceived'
            render={(args) => (
              <NumberInput
                simple
                onChange={handleCashReceivedChange}
                min={shouldDisableCashReceived ? 0 : minCashReceived}
                disabled={shouldDisableCashReceived}
                currency
                size='sm'
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem md={6}>Cash Returned: </GridItem>
        <GridItem md={6}>
          <NumberInput value={cashReturned} text currency />
        </GridItem>
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'PaymentSummary' })(PaymentSummary)
