import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { CardContainer } from '@/components'
import PaymentTypeRow from './PaymentTypeRow'
// utils
import { PAYMENT_MODE, INVOICE_PAYER_TYPE } from '@/utils/constants'
// styling
import styles from './styles'

const PayerHeader = ({
  classes,
  paymentModes,
  hideDeposit,
  handlePaymentTypeClick,
  patientInfo,
  currentPayments = [],
  currentOSAmount,
  maxHeight,
}) => {
  const disableCash = currentPayments.length > 0
  const disableAllMode = currentPayments.includes(PAYMENT_MODE.CASH)
  const disableDeposit =
    currentPayments.includes(PAYMENT_MODE.CASH) ||
    currentPayments.includes(PAYMENT_MODE.DEPOSIT) ||
    currentOSAmount <= 0
  return (
    <CardContainer
      hideHeader
      className={classes.paymentModeContainer}
      style={{
        maxHeight: maxHeight,
      }}
    >
      {paymentModes.map(mode => (
        <PaymentTypeRow
          mode={mode}
          hideDeposit={hideDeposit}
          patientInfo={patientInfo}
          disableCash={disableCash}
          disableDeposit={disableDeposit}
          disableAllMode={disableAllMode}
          onPaymentModeClick={handlePaymentTypeClick}
        />
      ))}
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
