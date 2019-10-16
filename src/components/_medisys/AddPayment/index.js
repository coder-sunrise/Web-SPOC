import React, { Component } from 'react'
import * as Yup from 'yup'
import { connect } from 'dva'
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
import { rounding } from './utils'

const mapPaymentListToValidationScheme = (schemes, payment) => {
  return {
    ...schemes,
    [payment.id]: ValidationScheme[payment.type],
  }
}

@connect(({ clinicSettings }) => ({ clinicSettings }))
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

  onConfirmClick = (values, formikBag) => {
    this.props.handleSubmit(values)
    this.props.onClose && this.props.onClose()
  }

  render () {
    const { classes, onClose, invoice = {} } = this.props
    const { paymentList } = this.state

    const validationSchema = Yup.object().shape({
      ...paymentList.reduce(mapPaymentListToValidationScheme, {}),
    })

    return (
      <div>
        <PayerHeader invoice={invoice} />
        <Formik
          enableReinitialize
          initialValues={{
            cashReceived: 0,
            ...paymentList.reduce(mapPaymentListToValues, {}),
          }}
          validationSchema={validationSchema}
          onSubmit={this.onConfirmClick}
          render={({ values, handleSubmit, setFieldValue, ...restProps }) => {
            const hasCash = Object.keys(values).reduce(
              (hasCashMode, key) =>
                values[key].type === 'Cash' ? true : hasCashMode,
              false,
            )
            const _collectableExactAmount = Object.keys(values).reduce(
              (total, key) => total + (values[key].amount || 0),
              0,
            )
            const collectableAmountAfterRounding = rounding(
              {},
              _collectableExactAmount,
            )
            const cashRounding = hasCash
              ? Math.abs(
                  _collectableExactAmount - collectableAmountAfterRounding,
                )
              : 0

            const cashReturned =
              values.cashReceived - collectableAmountAfterRounding

            const totalPaymentAfterRounding = rounding({}, invoice.finalPayable)
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
                  <PaymentSummary
                    hasCash={hasCash}
                    totalPayment={totalPaymentAfterRounding}
                    collectableAmount={collectableAmountAfterRounding}
                    cashRounding={cashRounding}
                    cashReturned={cashReturned}
                  />
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
