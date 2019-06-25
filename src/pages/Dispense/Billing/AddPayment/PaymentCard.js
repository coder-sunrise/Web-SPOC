import React, { Component } from 'react'
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

const mapPaymentListToValues = (acc, payment) => ({
  ...acc,
  [payment.id]: { ...payment },
})

// @withFormik({
//   enableReinitialize: true,
//   mapPropsToValues: (props) => {
//     const { paymentList } = props
//     console.log('mappropstovalues', { props })
//     return paymentList.reduce(mapPaymentListToValues, {})
//   },
//   handleSubmit: (values) => {
//     console.log('handleSubmit', { values })
//   },
// })
class PaymentCard extends Component {
  MapPaymentTypeToComponent = (payment) => (
    <GridItem md={12}>
      {MapPaymentType[payment.type]({
        payment,
        handleDeletePayment: this.props.handleDeletePayment,
      })}
    </GridItem>
  )

  render () {
    const { classes, paymentList, values } = this.props
    return (
      <CardContainer hideHeader className={classes.paymentTypeContainer}>
        <GridContainer justify='space-between' alignItems='flex-end'>
          {paymentList.map(this.MapPaymentTypeToComponent)}
        </GridContainer>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { name: 'PaymentCard' })(PaymentCard)
