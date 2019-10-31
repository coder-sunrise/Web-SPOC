import React, { Component } from 'react'
import { connect } from 'dva'
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

@connect(({ clinicSettings, patient }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  patient: patient.entity,
}))
@withFormikExtend({
  notDirtyDuration: 0,
  displayName: 'AddPaymentForm',
  mapPropsToValues: ({ invoice }) => {
    const { outstandingBalance } = invoice
    return {
      ...invoice,
      cashReturned: 0,
      cashReceived: 0,
      cashRounding: 0,
      totalAmtPaid: 0,
      outstandingAfterPayment: outstandingBalance,
      collectableAmount: outstandingBalance,
      paymentList: [],
      // finalPayable: _finalPayable,
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
    } = values

    const returnValue = {
      invoicePaymentMode: paymentList.map((payment, index) => ({
        ...payment,
        sequence: index,
        id: undefined,
        cashRounding:
          payment.paymentModeFK === PAYMENT_MODE.CASH ? cashRounding : 0,
      })),
      // outstandingBalance: finalPayable - totalAmtPaid,
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

  // componentDidMount () {
  //   const { values, setFieldValue } = this.props
  //   const { paymentList, collectableAmount } = values
  //   const totalPaid = paymentList.reduce(
  //     (total, payment) => total + (payment.amt || 0),
  //     0,
  //   )

  //   setFieldValue(
  //     'outstandingAfterPayment',
  //     roundToTwoDecimals(collectableAmount - totalPaid),
  //   )
  // }

  onPaymentTypeClick = async (event) => {
    const { values, setFieldValue } = this.props
    const { currentTarget: { id: type } } = event
    const paymentMode = Object.keys(PAYMENT_MODE).find(
      (mode) => PAYMENT_MODE[mode] === parseInt(type, 10),
    )
    const amount =
      values.paymentList.length === 0 ? values.outstandingAfterPayment : null
    const payment = {
      id: getLargestID(values.paymentList) + 1,
      paymentModeFK: parseInt(type, 10),
      paymentMode,
      ...InitialValue[type],
      amt: parseInt(type, 10) === PAYMENT_MODE.DEPOSIT ? 0 : amount,
    }
    const newPaymentList = [
      ...values.paymentList,
      payment,
    ]
    await setFieldValue('paymentList', newPaymentList)
    this.calculatePayment()
  }

  onDeleteClick = async (event) => {
    const { currentTarget: { id } } = event
    const { values, setFieldValue } = this.props
    const newPaymentList = values.paymentList.filter(
      (payment) => payment.id !== parseFloat(id, 10),
    )

    await setFieldValue('paymentList', newPaymentList)
    this.calculatePayment()
  }

  calculatePayment = () => {
    const { values, setFieldValue, clinicSettings } = this.props
    const { paymentList, outstandingBalance } = values
    const totalPaid = roundToTwoDecimals(
      paymentList.reduce((total, payment) => total + (payment.amt || 0), 0),
    )

    const cashPayment = paymentList.find(
      (payment) => payment.paymentModeFK === PAYMENT_MODE.CASH,
    )

    let cashReturned = 0
    if (cashPayment) {
      const cashAfterRounding = roundToTwoDecimals(
        rounding(clinicSettings, cashPayment.amt),
      )
      const collectableAmountAfterRounding = roundToTwoDecimals(
        rounding(clinicSettings, outstandingBalance),
      )
      const roundingAmt = roundToTwoDecimals(
        cashAfterRounding - cashPayment.amt,
      )
      this.setState(
        {
          cashPaymentAmount: cashPayment.amt,
        },
        () => {
          setFieldValue('cashReceived', cashAfterRounding)
        },
      )

      setFieldValue('cashRounding', roundingAmt)
      setFieldValue('collectableAmount', collectableAmountAfterRounding)

      if (totalPaid > outstandingBalance && cashPayment) {
        cashReturned = roundToTwoDecimals(totalPaid - outstandingBalance)
        setFieldValue('cashReturned', cashReturned)
      } else {
        setFieldValue('cashReturned', 0)
      }
    } else {
      setFieldValue('collectableAmount', outstandingBalance)
      setFieldValue('cashReceived', 0)
      setFieldValue('cashReturned', 0)
      setFieldValue('cashRounding', 0)
    }

    setFieldValue('totalAmtPaid', totalPaid)
    setFieldValue(
      'outstandingAfterPayment',
      roundToTwoDecimals(outstandingBalance - totalPaid + cashReturned),
    )
  }

  handleAmountChange = () => {
    setTimeout(() => this.calculatePayment(), 100)
  }

  handleCashReceivedChange = (event) => {
    const _cashReceived = event.target.value
    const { values, setFieldValue } = this.props
    const { cashRounding, paymentList, finalPayable } = values
    const cashPayment = paymentList.find(
      (payment) => payment.paymentModeFK === PAYMENT_MODE.CASH,
    )
    const totalPaid = paymentList.reduce(
      (total, payment) => total + (payment.amt || 0),
      0,
    )

    if (totalPaid - cashPayment.amt + _cashReceived > finalPayable)
      setFieldValue(
        'cashReturned',
        roundToTwoDecimals(_cashReceived - (cashPayment.amt + cashRounding)),
      )
    else setFieldValue('cashReturned', 0)
  }

  render () {
    const {
      classes,
      onClose,
      invoice = {},
      clinicSettings,
      values,
      handleSubmit,
      patient,
    } = this.props
    const { paymentList } = values

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
            patientInfo={patient}
            handlePaymentTypeClick={this.onPaymentTypeClick}
          />
          <PaymentCard
            paymentList={paymentList}
            handleDeletePayment={this.onDeleteClick}
            handleAmountChange={this.handleAmountChange}
            setFieldValue={this.props.setFieldValue}
            patientInfo={patient}
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
