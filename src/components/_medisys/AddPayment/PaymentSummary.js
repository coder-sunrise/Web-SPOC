import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridItem, Field, NumberInput, CardContainer } from '@/components'
// styling
import styles from './styles'
import { PAYMENT_MODE } from '@/utils/constants'

const parseToTwoDecimalString = (value = 0.0) => value.toFixed(2)

const PaymentSummary = ({
  classes,
  totalAmtPaid,
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
    <CardContainer hideHeader style={{ padding: 0, height: 260 }}>
      <GridItem xs={12} container className={classes.paymentSummary}>
        <GridItem xs={7}>Total Payment: </GridItem>
        <GridItem xs={5}>
          <NumberInput text currency value={totalAmtPaid} />
        </GridItem>
        <GridItem xs={7}>Cash Rounding: </GridItem>
        <GridItem xs={5}>
          <NumberInput value={cashRounding} text currency />
        </GridItem>
        <GridItem xs={7}>Collectable Amount: </GridItem>
        <GridItem xs={5}>
          <NumberInput value={collectableAmount} text currency />
        </GridItem>
        <GridItem xs={7}>
          <span style={{ position: 'relative', top: 5 }}>Cash Received: </span>
        </GridItem>
        <GridItem xs={5}>
          <Field
            name='cashReceived'
            render={args => (
              <NumberInput
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
        <GridItem xs={7}>Cash Returned: </GridItem>
        <GridItem xs={5}>
          <NumberInput value={cashReturned} text currency />
        </GridItem>
      </GridItem>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'PaymentSummary' })(PaymentSummary)
