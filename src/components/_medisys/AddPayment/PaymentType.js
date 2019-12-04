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
}) => {
  const disableCash = currentPayments.includes(PAYMENT_MODE.CASH)
  const disableDeposit = currentPayments.includes(PAYMENT_MODE.DEPOSIT)
  return (
    <CardContainer className={classes.paymentModeContainer} hideHeader>
      {paymentModes.map((mode) => (
        <PaymentTypeRow
          mode={mode}
          hideDeposit={hideDeposit}
          patientInfo={patientInfo}
          disableCash={disableCash}
          disableDeposit={disableDeposit}
          onPaymentModeClick={handlePaymentTypeClick}
        />
      ))}
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
