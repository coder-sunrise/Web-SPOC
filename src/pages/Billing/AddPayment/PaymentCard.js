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
import styles from './styles'
import { paymentTypes } from './variables'

const MapPaymentType = {
  [paymentTypes.cash]: (props) => <CashPayment {...props} />,
  [paymentTypes.nets]: (props) => <NetsPayment {...props} />,
  [paymentTypes.creditCard]: (props) => <CreditCardPayment {...props} />,
  [paymentTypes.cheque]: (props) => <ChequePayment {...props} />,
  [paymentTypes.giro]: (props) => <GiroPayment {...props} />,
}

class PaymentCard extends Component {
  MapPaymentTypeToComponent = (payment) => (
    <GridItem md={12}>
      {MapPaymentType[payment.paymentModeFK]({
        payment,
        handleDeletePayment: this.props.handleDeletePayment,
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
