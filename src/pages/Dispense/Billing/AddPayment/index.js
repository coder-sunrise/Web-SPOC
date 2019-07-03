import React, { Component } from 'react'
import * as Yup from 'yup'
// formik
import { Formik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem } from '@/components'
// sub component
import PayerHeader from './PayerHeader'
import PaymentType from './PaymentType'
import PaymentCard from './PaymentCard'
import PaymentSummary from './PaymentSummary'
// styling
import styles from './styles'
import {
  getLargestID,
  mapPaymentListToValues,
  ValidationScheme,
  InitialValue,
} from './variables'

const mapPaymentListToValidationScheme = (schemes, payment) => {
  return {
    ...schemes,
    [payment.id]: ValidationScheme[payment.type],
  }
}

class AddPayment extends Component {
  state = {
    paymentList: [],
  }

  onPaymentTypeClick = (values) => (event) => {
    const { currentTarget: { id: type } } = event

    const { paymentList } = this.state
    const payment = {
      id: getLargestID(paymentList) + 1,
      type,
      ...InitialValue[type],
    }

    const newPaymentList = paymentList.map((item) => values[item.id])
    this.setState({
      paymentList: [
        ...newPaymentList,
        payment,
      ],
    })
  }

  onDeleteClick = (event) => {
    const { currentTarget: { id } } = event
    const { paymentList } = this.state
    this.setState({
      paymentList: paymentList.filter(
        (payment) => payment.id !== parseInt(id, 10),
      ),
    })
  }

  onConfirmClick = (values, formikBag) => {}

  render () {
    const { classes, onClose } = this.props
    const { paymentList } = this.state

    const validationSchema = Yup.object().shape({
      ...paymentList.reduce(mapPaymentListToValidationScheme, {}),
    })

    return (
      <div>
        <PayerHeader />
        <Formik
          enableReinitialize
          initialValues={paymentList.reduce(mapPaymentListToValues, {})}
          validationSchema={validationSchema}
          onSubmit={this.onConfirmClick}
          render={({ errors, values, handleSubmit }) => {
            console.log({ errors })
            return (
              <React.Fragment>
                <PaymentType
                  handlePaymentTypeClick={this.onPaymentTypeClick(values)}
                />
                <PaymentCard
                  paymentList={paymentList}
                  handleDeletePayment={this.onDeleteClick}
                />

                <GridContainer alignItems='flex-end'>
                  <PaymentSummary />
                  <GridItem md={12} className={classes.addPaymentActionButtons}>
                    <Button color='danger' onClick={onClose}>
                      Cancel
                    </Button>
                    <Button color='primary' onClick={handleSubmit}>
                      Confirm
                    </Button>
                  </GridItem>
                </GridContainer>
              </React.Fragment>
            )
          }}
        />
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AddPayment' })(AddPayment)
