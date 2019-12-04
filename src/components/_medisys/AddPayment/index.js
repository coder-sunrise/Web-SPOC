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
import { roundTo } from '@/utils/utils'
import { PAYMENT_MODE, INVOICE_PAYER_TYPE } from '@/utils/constants'
// services
import { getBizSession } from '@/services/queue'

@connect(({ clinicSettings, patient, codetable }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  patient: patient.entity,
  ctPaymentMode: codetable.ctpaymentmode,
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
      // paymentReceivedDate: moment().formatUTC(false),
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
      this.fetchLatestBizSessions()
    }
  }

  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    // unbind keyDown listener
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = (event) => {
    const { values } = this.props
    const min = 112
    const max = 123
    const { keyCode, key } = event
    if (keyCode < min || keyCode > max) return
    event.preventDefault()

    // TODO: add payment base on keyCode and paymentMode hotkey setting
    const { ctPaymentMode, patient } = this.props

    const paymentModeObj = ctPaymentMode.find((o) => o.hotKey === key)

    if (paymentModeObj) {
      const isCash = paymentModeObj.id === PAYMENT_MODE.CASH
      const isDeposit = paymentModeObj.id === PAYMENT_MODE.DEPOSIT
      const hasCashPaymentAlready =
        values.paymentList.filter(
          (item) => item.paymentModeFK === PAYMENT_MODE.CASH,
        ).length > 0

      const hasDeposit =
        patient.patientDeposit && patient.patientDeposit.balance > 0
      if (
        (isCash && hasCashPaymentAlready) ||
        (isDeposit &&
          (values.payerTypeFK !== INVOICE_PAYER_TYPE.PATIENT || !hasDeposit))
      )
        return

      this.onPaymentTypeClick(paymentModeObj)
    }

    // let paymentModeFK
    // switch (keyCode) {
    //   case 112: {
    //     paymentModeFK = PAYMENT_MODE.CREDIT_CARD
    //     break
    //   }
    //   case 113: {
    //     paymentModeFK = PAYMENT_MODE.CHEQUE
    //     break
    //   }
    //   default:
    //     paymentModeFK = 0
    //     break
    // }
  }

  fetchLatestBizSessions = () => {
    const { setFieldValue } = this.props
    const payload = {
      pagesize: 1,
      sorting: [
        { columnName: 'sessionStartDate', direction: 'desc' },
      ],
    }
    getBizSession(payload).then((response) => {
      const { status, data } = response
      if (parseInt(status, 10) === 200 && data.totalRecords > 0) {
        const { data: sessionData } = data
        setFieldValue('paymentCreatedBizSessionFK', sessionData[0].id)
        setFieldValue('paymentReceivedDate', sessionData[0].sessionStartDate)

        this.fetchBizSessionList(sessionData[0].sessionStartDate)
      } else {
        setFieldValue('paymentCreatedBizSessionFK', undefined)
        setFieldValue('paymentReceivedDate', null)
      }
    })
  }

  fetchBizSessionList = (date) => {
    const { setFieldValue } = this.props
    const momentDate = moment(date)
    const startDateTime = moment(
      momentDate.set({ hour: 0, minute: 0, second: 0 }),
    ).formatUTC(false)
    const endDateTime = moment(
      momentDate.set({ hour: 23, minute: 59, second: 59 }),
    ).formatUTC(false)

    getBizSession({
      pagesize: 999,
      lsteql_SessionStartDate: endDateTime,
      group: [
        {
          isClinicSessionClosed: false,
          lgteql_SessionCloseDate: startDateTime,
          combineCondition: 'or',
        },
      ],
      sorting: [
        { columnName: 'sessionStartDate', direction: 'desc' },
      ],
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
        else setFieldValue('paymentReceivedBizSessionFK', undefined)
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
    const totalPaid = roundTo(
      paymentList.reduce((total, payment) => total + (payment.amt || 0), 0),
    )

    const cashPayment = paymentList.find(
      (payment) => payment.paymentModeFK === PAYMENT_MODE.CASH,
    )

    let cashReturned = 0
    if (cashPayment) {
      const cashAfterRounding = roundTo(
        rounding(clinicSettings, cashPayment.amt),
      )
      const collectableAmountAfterRounding = roundTo(
        rounding(clinicSettings, outstandingBalance),
      )
      const roundingAmt = roundTo(cashAfterRounding - cashPayment.amt)
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
        cashReturned = roundTo(totalPaid - outstandingBalance)
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
      roundTo(outstandingBalance - totalPaid + cashReturned),
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
        roundTo(_cashReceived - (cashPayment.amt + cashRounding)),
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
                currentPayments={values.paymentList.map(
                  (payment) => payment.paymentModeFK,
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
