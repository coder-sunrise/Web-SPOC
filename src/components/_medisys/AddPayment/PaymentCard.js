import React, { Component } from 'react'
import classnames from 'classnames'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { CardContainer, GridContainer, GridItem } from '@/components'
import CashPayment from './paymentTypes/Cash'
import NetsPayment from './paymentTypes/Nets'
import CreditCardPayment from './paymentTypes/CreditCard'
import ChequePayment from './paymentTypes/Cheque'
import GiroPayment from './paymentTypes/Giro'
import DepositPayment from './paymentTypes/Deposit'
import styles from './styles'
import { PAYMENT_MODE } from '@/utils/constants'

const MapPaymentType = {
  [PAYMENT_MODE.CASH]: (props) => <CashPayment {...props} />,
  [PAYMENT_MODE.NETS]: (props) => <NetsPayment {...props} />,
  [PAYMENT_MODE.CREDIT_CARD]: (props) => <CreditCardPayment {...props} />,
  [PAYMENT_MODE.CHEQUE]: (props) => <ChequePayment {...props} />,
  [PAYMENT_MODE.GIRO]: (props) => <GiroPayment {...props} />,
  [PAYMENT_MODE.DEPOSIT]: (props) => <DepositPayment {...props} />,
}

class PaymentCard extends Component {
  MapPaymentTypeToComponent = (payment, index) => (
    <GridItem md={12} key={`addpayment-paymentCard-${index}`}>
      {MapPaymentType[payment.paymentModeFK]({
        payment,
        index,
        handleDeletePayment: this.props.handleDeletePayment,
        handleAmountChange: this.props.handleAmountChange,
        setFieldValue: this.props.setFieldValue,
        patientInfo: this.props.patientInfo,
      })}
    </GridItem>
  )

  render () {
    const { classes, paymentList } = this.props
    const noPayment = paymentList.length === 0

    const emptyStateClass = classnames({
      [classes.centerText]: true,
      [classes.boldText]: true,
    })

    return (
      <CardContainer hideHeader className={classes.paymentTypeContainer}>
        {!noPayment ? (
          <GridContainer justify='space-between' alignItems='flex-end'>
            {paymentList.map(this.MapPaymentTypeToComponent)}
          </GridContainer>
        ) : (
          <div className={emptyStateClass}>
            <h4>No payment type added. Please add a payment type</h4>
          </div>
        )}
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'PaymentCard' })(PaymentCard)
