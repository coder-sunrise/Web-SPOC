import React, { Component } from 'react'
import moment from 'moment'
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
import PaymentDateAndBizSession from './PaymentDateAndBizSession'
// styling
import styles from './styles'
import { ValidationSchema, getLargestID } from './variables'
import { rounding } from './utils'
import { roundToTwoDecimals } from '@/utils/utils'
import { PAYMENT_MODE, INVOICE_PAYER_TYPE } from '@/utils/constants'
// services
import { getBizSession } from '@/services/queue'

@connect(({ clinicSettings, patient }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  patient: patient.entity,
}))
@withFormikExtend({
  notDirtyDuration: 0.5,
  displayName: 'AddPaymentForm',
  mapPropsToValues: ({ invoice, showPaymentDate }) => {
    const { outstandingBalance } = invoice

    return {
      ...invoice,
      showPaymentDate,
      cashReturned: 0,
      cashReceived: 0,
      cashRounding: 0,
      totalAmtPaid: 0,
      outstandingAfterPayment: outstandingBalance,
      collectableAmount: outstandingBalance,
      paymentList: [],
      paymentReceivedDate: moment().formatUTC(false),
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
      paymentReceivedByUserFK,
      paymentReceivedDate,
      paymentReceivedBizSessionFK,
      paymentCreatedBizSessionFK,
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
      paymentReceivedByUserFK,
      paymentReceivedDate,
      paymentReceivedBizSessionFK,
      paymentCreatedBizSessionFK,
    }

    handleSubmit(returnValue)
  },
})
class AddPayment extends Component {
  state = {
    cashPaymentAmount: 0,
    bizSessionList: [],
    paymentModes: [],
  }

  componentWillMount = () => {
    this.props
      .dispatch({
        type: 'codetable/fetchCodes',
        payload: { code: 'ctpaymentmode' },
      })
      .then((response) => {
        this.setState({
          paymentModes: response,
        })
      })
    if (this.props.showPaymentDate) {
      this.fetchBizSessionList(moment())
      this.fetchCurrentActiveBizSession()
    }
  }

  // componentDidMount = () => {
  //   document.addEventListener('keydown', this.handleKeyDown)
  // }

  // componentWillUnmount () {
  //   // unbind keyDown listener
  //   document.removeEventListener('keydown', this.handleKeyDown)
  // }

  handleKeyDown = (event) => {
    event.preventDefault()
    const min = 112
    const max = 123
    const { keyCode } = event
    if (keyCode < min || keyCode > max) return

    console.log({ keyCode })
    // TODO: add payment base on keyCode and paymentMode hotkey setting
    switch (keyCode) {
      default:
        break
    }
  }

  fetchCurrentActiveBizSession = () => {
    const activeBizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    getBizSession(activeBizSessionPayload).then((response) => {
      const { status, data } = response
      if (parseInt(status, 10) === 200 && data.totalRecords === 1) {
        const { data: sessionData } = data
        this.props.setFieldValue(
          'paymentCreatedBizSessionFK',
          sessionData[0].id,
        )
      }
    })
  }

  fetchBizSessionList = (date) => {
    const { setFieldValue } = this.props
    getBizSession({
      pagesize: 999,
      sessionNoPrefix: moment(date).format('YYMMDD'),
    }).then((response) => {
      const { status, data } = response
      if (parseInt(status, 10) === 200) {
        const bizSessionList = data.data.map((item) => ({
          value: item.id,
          name: item.sessionNo,
        }))
        this.setState({
          bizSessionList,
        })

        if (bizSessionList.length > 0)
          setFieldValue('paymentReceivedBizSessionFK', bizSessionList[0].value)
      }
    })
  }

  onPaymentTypeClick = async (paymentMode) => {
    const { values, setFieldValue } = this.props
    // const { currentTarget: { id: type } } = event
    // const paymentMode = Object.keys(PAYMENT_MODE).find(
    //   (mode) => PAYMENT_MODE[mode] === parseInt(type, 10),
    // )
    const { id: type, displayValue } = paymentMode
    const amount = values.outstandingAfterPayment
    const payment = {
      id: getLargestID(values.paymentList) + 1,
      displayValue,
      paymentModeFK: parseInt(type, 10),
      paymentMode: displayValue,
      amt: parseInt(type, 10) === PAYMENT_MODE.DEPOSIT ? 0 : amount,
    }

    const newPaymentList = [
      ...values.paymentList,
      payment,
    ]
    await setFieldValue('paymentList', newPaymentList)
    this.calculatePayment()
  }

  onDeleteClick = async (paymentID) => {
    const { values, setFieldValue } = this.props
    const newPaymentList = values.paymentList.filter(
      (payment) => payment.id !== parseFloat(paymentID, 10),
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
          cashPaymentAmount: cashAfterRounding,
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
    else if (totalPaid < finalPayable) {
      setFieldValue(
        'cashReturned',
        _cashReceived - (cashPayment.amt + cashRounding),
      )
    } else setFieldValue('cashReturned', 0)
  }

  handlePaymentDateChange = (value) => {
    this.fetchBizSessionList(value)
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
      showPaymentDate,
      invoicePayerName = '',
    } = this.props
    const { paymentList } = values
    const { bizSessionList, paymentModes } = this.state
    console.log({ values })
    return (
      <div>
        <PayerHeader
          invoicePayerName={invoicePayerName}
          invoice={invoice}
          outstandingAfterPayment={values.outstandingAfterPayment}
        />
        <React.Fragment>
          {showPaymentDate && (
            <PaymentDateAndBizSession
              bizSessionList={bizSessionList}
              handleDateChange={this.handlePaymentDateChange}
            />
          )}
          <GridContainer className={classes.paymentContent}>
            <GridItem md={12}>
              <h4>Payment Mode: </h4>
            </GridItem>
            <GridItem md={3} className={classes.noPaddingLeft}>
              <PaymentType
                paymentModes={paymentModes}
                disableCash={values.paymentList.reduce(
                  (noCashPaymentMode, payment) =>
                    payment.paymentModeFK === PAYMENT_MODE.CASH ||
                    noCashPaymentMode,
                  false,
                )}
                hideDeposit={values.payerTypeFK !== INVOICE_PAYER_TYPE.PATIENT}
                patientInfo={patient}
                handlePaymentTypeClick={this.onPaymentTypeClick}
              />
            </GridItem>
            <GridItem md={9}>
              <PaymentCard
                paymentList={paymentList}
                handleDeletePayment={this.onDeleteClick}
                handleAmountChange={this.handleAmountChange}
                setFieldValue={this.props.setFieldValue}
                patientInfo={patient}
              />
            </GridItem>
          </GridContainer>

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
              <Button
                color='primary'
                onClick={handleSubmit}
                disabled={paymentList.length === 0}
              >
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
