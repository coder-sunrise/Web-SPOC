import React, { Component } from 'react'
import * as Yup from 'yup'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem } from '@/components'
import withFormikExtend from '@/components/Decorator/withFormikExtend'
// sub component
import PayerHeader from './PayerHeader'
import PaymentType from './PaymentType'
import PaymentCard from './PaymentCard'
import PaymentSummary from './PaymentSummary'
// styling
import styles from './styles'
import { ValidationSchema, getLargestID, InitialValue } from './variables'
import { rounding } from './utils'
import { roundToTwoDecimals } from '@/utils/utils'
import { PAYMENT_MODE } from '@/utils/constants'

@connect(({ clinicSettings }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
}))
@withFormikExtend({
  notDirtyDuration: 0,
  displayName: 'AddPaymentForm',
  mapPropsToValues: ({ invoice, payments, clinicSettings }) => {
    const { outstandingBalance = 0 } = invoice
    const collectableAmount = rounding(clinicSettings, outstandingBalance)

    // const cashReceived =
    //   payments.length > 0 ? payments[0].cashReceived : outstandingBalance
    // const cashRounding = rounding(clinicSettings, cashReceived)
    // const cashPayment = payments.length > 0 ? payments

    return {
      cashReturned: 0,
      cashReceived: 0,
      cashRounding: 0,
      outstandingAfterPayment: outstandingBalance,
      totalAmtPaid: outstandingBalance,
      paymentList: [],
      // paymentList:
      //   payments.length > 0
      //     ? payments[0].paymentModes
      //     : [
      //         {
      //           id: 0,
      //           paymentMode: 'Cash',
      //           paymentModeFK: 1,
      //           amt: outstandingBalance,
      //           remarks: '',
      //           sequence: 0,
      //         },
      //       ],
      collectableAmount,
      ...invoice,
    }
  },
  validationSchema: ValidationSchema,
  handleSubmit: (values, { props }) => {
    const { handleSubmit } = props
    const {
      paymentList,
      cashRounding,
      cashReceived,
      cashReturned,
      totalAmtPaid,
      collectableAmount,
    } = values

    const returnValue = {
      paymentModes: paymentList.map((payment, index) => ({
        ...payment,
        sequence: index,
        // id: undefined,
      })),
      outstandingBalance: collectableAmount - totalAmtPaid,
      cashRounding,
      cashReceived,
      cashReturned,
      totalAmtPaid,
    }
    handleSubmit(returnValue)
  },
})
class AddPayment extends Component {
  state = {
    cashPaymentAmount: 0,
  }

  componentDidMount () {
    const { values, setFieldValue } = this.props
    const { paymentList, collectableAmount } = values
    const totalPaid = paymentList.reduce(
      (total, payment) => total + (payment.amt || 0),
      0,
    )

    setFieldValue(
      'outstandingAfterPayment',
      roundToTwoDecimals(collectableAmount - totalPaid),
    )
  }

  onPaymentTypeClick = async (event) => {
    const { values, setFieldValue, clinicSettings } = this.props
    const { currentTarget: { id: type } } = event
    const paymentMode = Object.keys(PAYMENT_MODE).find(
      (mode) => PAYMENT_MODE[mode] === parseInt(type, 10),
    )
    const amount =
      values.paymentList.length === 0 ? values.outstandingBalance : null
    const payment = {
      id: getLargestID(values.paymentList) + 1,
      paymentModeFK: parseInt(type, 10),
      paymentMode,
      ...InitialValue[type],
      amt: amount,
    }
    const newPaymentList = [
      ...values.paymentList,
      payment,
    ]
    await setFieldValue('paymentList', newPaymentList)
    this.handleAmountChange()
  }

  onDeleteClick = async (event) => {
    const { currentTarget: { id } } = event
    const { values, setFieldValue } = this.props
    const newPaymentList = values.paymentList.filter(
      (payment) => payment.id !== parseFloat(id, 10),
    )

    await setFieldValue('paymentList', newPaymentList)
    this.handleAmountChange()
  }

  handleAmountChange = () => {
    const { values, setFieldValue, clinicSettings } = this.props
    const { paymentList, outstandingBalance, collectableAmount } = values
    const totalPaid = paymentList.reduce(
      (total, payment) => total + (payment.amt || 0),
      0,
    )
    const cashPayment = paymentList.find(
      (payment) => payment.paymentModeFK === PAYMENT_MODE.CASH,
    )

    let cashReturned = 0
    if (cashPayment) {
      const cashAfterRounding = roundToTwoDecimals(
        rounding(clinicSettings, cashPayment.amt),
      )
      console.log({ cashAfterRounding })
      setFieldValue('cashReceived', cashAfterRounding)
      setFieldValue(
        'cashRounding',
        roundToTwoDecimals(cashAfterRounding - cashPayment.amt),
      )

      if (totalPaid > outstandingBalance && cashPayment) {
        cashReturned = roundToTwoDecimals(totalPaid - outstandingBalance)
        setFieldValue('cashReturned', cashReturned)
      }
      const collectableAmountAfterRounding = roundToTwoDecimals(
        rounding(clinicSettings, outstandingBalance),
      )
      setFieldValue('collectableAmount', collectableAmountAfterRounding)
      this.setState({
        cashPaymentAmount: cashPayment.amt,
      })
    } else {
      console.log('no cash payment')

      setFieldValue('collectableAmount', values.finalPayable)
      setFieldValue('cashReceived', 0)
      setFieldValue('cashReturned', 0)
      setFieldValue('cashRounding', 0)
      this.setState({
        cashPaymentAmount: 0,
      })
    }
    setFieldValue('totalAmtPaid', totalPaid)
    setFieldValue(
      'outstandingAfterPayment',
      roundToTwoDecimals(outstandingBalance - totalPaid + cashReturned),
    )
  }

  handleCashReceivedChange = () => {
    const { values, setFieldValue } = this.props
    const { paymentList } = values
    const cashPayment = paymentList.find(
      (payment) => payment.paymentModeFK === PAYMENT_MODE.CASH,
    )
    if (cashPayment) {
      const cashReturned = roundToTwoDecimals(
        values.cashReceived - (cashPayment.amt + values.cashRounding),
      )
      setFieldValue('cashReturned', cashReturned)
    }
  }

  render () {
    const {
      classes,
      onClose,
      invoice = {},
      clinicSettings,
      values,
      handleSubmit,
    } = this.props
    const { paymentList } = values
    console.log({ values })
    return (
      <div>
        <PayerHeader
          invoice={invoice}
          outstandingAfterPayment={values.outstandingAfterPayment}
        />
        <React.Fragment>
          <PaymentType
            disableCash={values.paymentList.reduce(
              (noCashPaymentMode, payment) =>
                payment.paymentModeFK === PAYMENT_MODE.CASH ||
                noCashPaymentMode,
              false,
            )}
            handlePaymentTypeClick={this.onPaymentTypeClick}
          />
          <PaymentCard
            paymentList={paymentList}
            handleDeletePayment={this.onDeleteClick}
            handleAmountChange={this.handleAmountChange}
            setFieldValue={this.props.setFieldValue}
          />

          <GridContainer alignItems='flex-end'>
            <PaymentSummary
              clinicSettings={clinicSettings}
              handleCashReceivedChange={this.handleCashReceivedChange}
              minCashReceived={this.state.cashPaymentAmount}
              {...values}
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
      </div>
    )
  }
}

export default withStyles(styles, { name: 'AddPayment' })(AddPayment)
