import React, { Component } from 'react'
import moment from 'moment'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem, serverDateFormat, notification } from '@/components'
import withFormikExtend from '@/components/Decorator/withFormikExtend'
// sub component
import { roundTo } from '@/utils/utils'
import { PAYMENT_MODE, INVOICE_PAYER_TYPE } from '@/utils/constants'
import { getBizSession } from '@/services/queue'
import PayerHeader from './PayerHeader'
import PaymentType from './PaymentType'
import PaymentCard from './PaymentCard'
import PaymentSummary from './PaymentSummary'
import PaymentDateAndBizSession from './PaymentDateAndBizSession'
// styling
import styles from './styles'
import { ValidationSchema, getLargestID } from './variables'
import { rounding } from './utils'

@connect(({ clinicSettings, patient, codetable }) => ({
  clinicSettings: clinicSettings.settings || clinicSettings.default,
  patient: patient.entity,
  ctPaymentMode: codetable.ctpaymentmode,
}))
@withFormikExtend({
  notDirtyDuration: 0.5,
  displayName: 'AddPaymentForm',
  mapPropsToValues: ({
    invoice,
    showPaymentDate,
    isGroupPayment,
    visitGroupStatusDetails = [],
  }) => {
    let newValues = {
      ...invoice,
      showPaymentDate,
      cashReturned: 0,
      cashReceived: 0,
      cashRounding: 0,
      totalAmtPaid: 0,
      outstandingAfterPayment: invoice.outstandingBalance,
      collectableAmount: invoice.outstandingBalance,
      paymentList: [],
    }
    if (isGroupPayment && visitGroupStatusDetails.length > 0) {
      const outstandingBalance = roundTo(_.sumBy(
        visitGroupStatusDetails,
        'outstandingBalance',
      ))
      newValues = {
        ...newValues,
        outstandingAfterPayment: outstandingBalance,
        collectableAmount: outstandingBalance,
        finalPayable: outstandingBalance,
        outstandingBalance: outstandingBalance,
        invoiceOSAmount: invoice.outstandingBalance,
        isGroupPayment,
      }
    }
    return newValues
  },
  validationSchema: ValidationSchema,
  handleSubmit: (values, { props }) => {
    const { handleSubmit, isGroupPayment } = props
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
      isGroupPayment,
    }

    // console.log({ returnValue })
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
      .then(response => {
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

  componentWillUnmount() {
    // unbind keyDown listener
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  handleKeyDown = event => {
    const { values } = this.props
    const min = 112
    const max = 123
    const { keyCode, key } = event
    if (keyCode < min || keyCode > max) return

    event.preventDefault()
    const { ctPaymentMode, patient } = this.props

    const paymentModeObj = ctPaymentMode.find(o => o.hotKey === key)

    if (paymentModeObj) {
      const isCash = paymentModeObj.id === PAYMENT_MODE.CASH
      const isDeposit = paymentModeObj.id === PAYMENT_MODE.DEPOSIT
      const hasCashPaymentAlready =
        values.paymentList.filter(
          item => item.paymentModeFK === PAYMENT_MODE.CASH,
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
  }

  fetchLatestBizSessions = () => {
    const { setFieldValue } = this.props
    const payload = {
      pagesize: 1,
      sorting: [{ columnName: 'sessionStartDate', direction: 'desc' }],
    }
    getBizSession(payload).then(response => {
      const { status, data } = response
      if (parseInt(status, 10) === 200 && data.totalRecords > 0) {
        const { data: sessionData } = data
        const { isClinicSessionClosed, sessionStartDate } = sessionData[0]
        let paymentDate = moment()
        if (isClinicSessionClosed === true) {
          paymentDate = moment(sessionStartDate, serverDateFormat)
        }

        const formateDate = paymentDate.format(serverDateFormat)
        setFieldValue('paymentCreatedBizSessionFK', sessionData[0].id)
        setFieldValue('paymentReceivedDate', formateDate)

        this.fetchBizSessionList(formateDate)
      } else {
        setFieldValue('paymentCreatedBizSessionFK', undefined)
        setFieldValue('paymentReceivedDate', null)
      }
    })
  }

  fetchBizSessionList = date => {
    if (!date) return

    const { setFieldValue } = this.props
    const momentDate = moment(date, serverDateFormat)
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
      sorting: [{ columnName: 'sessionStartDate', direction: 'desc' }],
    }).then(response => {
      const { status, data } = response
      if (parseInt(status, 10) === 200) {
        const bizSessionList = data.data.map(item => ({
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

  getPopulateAmount = paymentMode => {
    const { id: type } = paymentMode
    const {
      values: { outstandingAfterPayment, invoiceOSAmount = 0 },
      patient,
      isGroupPayment,
      visitGroupStatusDetails,
    } = this.props

    if (parseInt(type, 10) !== PAYMENT_MODE.DEPOSIT) return outstandingAfterPayment

    const { patientDeposit } = patient
    if (patientDeposit) {
      const { balance = 0 } = patientDeposit
      if(isGroupPayment)
        return Math.min(balance, Math.min(outstandingAfterPayment, invoiceOSAmount))
      return Math.min(balance, outstandingAfterPayment)
    }
  }

  onPaymentTypeClick = async paymentMode => {
    const { values, setFieldValue, isGroupPayment, visitGroupStatusDetails } = this.props
    const { id: type, displayValue } = paymentMode
    const amt = this.getPopulateAmount(paymentMode)

    let payment = {
      id: getLargestID(values.paymentList) + 1,
      displayValue,
      paymentModeFK: parseInt(type, 10),
      paymentMode: displayValue,
      amt: roundTo(amt),
    }
    if (isGroupPayment) {
      const isDeposit = parseInt(type, 10) === PAYMENT_MODE.DEPOSIT 
      const defaultRemark = isDeposit
        ? values.invoiceNo
        : values.paymentList.some(x => x.isDeposit)
        ? visitGroupStatusDetails.filter(x => x.invoiceNo !== values.invoiceNo).map(x => x.invoiceNo).join('/')
        : visitGroupStatusDetails.map(x => x.invoiceNo).join('/')
      payment = {
          ...payment,
          isDeposit,
          remark: defaultRemark,
        }
    }
    const newPaymentList = [...values.paymentList, payment]
    await setFieldValue('paymentList', newPaymentList)
    this.calculatePayment()
  }

  onDeleteClick = async paymentID => {
    const { values, setFieldValue } = this.props
    const newPaymentList = values.paymentList.filter(
      payment => payment.id !== parseFloat(paymentID, 10),
    )

    await setFieldValue('paymentList', newPaymentList)
    this.calculatePayment()
  }

  calculatePayment = () => {
    const { values, setFieldValue, clinicSettings, isGroupPayment, visitGroupStatusDetails = [] } = this.props
    let { paymentList, outstandingBalance } = values
    const totalPaid = roundTo(
      paymentList.reduce((total, payment) => total + (payment.amt || 0), 0),
    )

    const cashPayment = paymentList.find(
      payment => payment.paymentModeFK === PAYMENT_MODE.CASH,
    )

    let cashReturned = 0
    if (cashPayment) {
      let cashAfterRounding = roundTo(
        rounding(clinicSettings, cashPayment.amt),
      )
      let collectableAmountAfterRounding = roundTo(
        rounding(clinicSettings, totalPaid),
      )
      if (isGroupPayment) {
        const otherPayment = _.sumBy(paymentList, p =>
          p.paymentModeFK !== PAYMENT_MODE.CASH ? p.amt || 0 : 0,
        )
        let tempOtherPayment = otherPayment
        //rouding os for per invoice then sum
        const newCashAfterRounding = roundTo(_.sumBy(visitGroupStatusDetails, x => {
          const paidAmt = roundTo(Math.min(tempOtherPayment, x.outstandingBalance))
          const remainOS = roundTo(x.outstandingBalance - paidAmt)
          tempOtherPayment -= paidAmt
          if(remainOS > 0){
            const newInvoiceOS = roundTo(rounding(clinicSettings, remainOS))
            // console.log('invoice O/S after cash rounding','newInvoiceOS', newInvoiceOS,'remainOS',remainOS)
            return newInvoiceOS
          }
          return 0
        }))
        //console.log('newCashAfterRounding',newCashAfterRounding,'cashAfterRounding',cashAfterRounding)
        cashAfterRounding = newCashAfterRounding
        collectableAmountAfterRounding = otherPayment + newCashAfterRounding
      }
      const roundingAmt = roundTo(cashAfterRounding - cashPayment.amt)
      this.setState(
        {
          cashPaymentAmount: cashAfterRounding,
        },
        () => {
          setFieldValue('cashReceived', cashAfterRounding)
          setFieldValue('_cashAfterRounding', cashAfterRounding)
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
      setFieldValue('collectableAmount', totalPaid)
      setFieldValue('_cashAfterRounding', 0)
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

  handleCashReceivedChange = event => {
    const _cashReceived = event.target.value
    const { values, setFieldValue } = this.props
    const { cashRounding, paymentList, finalPayable } = values
    const cashPayment = paymentList.find(
      payment => payment.paymentModeFK === PAYMENT_MODE.CASH,
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

  handlePaymentDateChange = value => {
    this.fetchBizSessionList(value)
  }

  getPayerHeaderProps = () => {
    const {
      patient,
      values,
      invoice = {},
      invoicePayerName = '',
      isGroupPayment,
      visitGroupStatusDetails = []
    } = this.props
    return {
      invoiceNo: isGroupPayment
        ? visitGroupStatusDetails.map(x => x.invoiceNo).join('/')
        : invoice.invoiceNo,
      invoicePayerName: isGroupPayment
        ? visitGroupStatusDetails.map(x => x.name).join('/')
        : invoicePayerName,
      patientReferenceNo: isGroupPayment
        ? visitGroupStatusDetails.map(x => x.patientReferenceNo).join('/')
        : patient.patientReferenceNo,
      outstandingAfterPayment: values.outstandingAfterPayment,
      totalClaim: isGroupPayment
        ? _.sumBy(visitGroupStatusDetails, x => x.totalClaim)
        : invoice.totalClaim,
      totalAftGst: isGroupPayment
        ? _.sumBy(visitGroupStatusDetails, x => x.totalAftGST)
        : invoice.totalAftGst,
      payerTypeFK: isGroupPayment
        ? INVOICE_PAYER_TYPE.PATIENT
        : invoice.payerTypeFK,
    }
  }

  render() {
    const {
      classes,
      onClose,
      invoice = {},
      clinicSettings,
      values,
      handleSubmit,
      patient,
      showPaymentDate,
      disabledPayment,
    } = this.props
    const { bizSessionList, paymentModes } = this.state
    const payerHeaderProps = this.getPayerHeaderProps()
    return (
      <div>
        <PayerHeader {...payerHeaderProps} />
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
                  payment => payment.paymentModeFK,
                )}
                hideDeposit={values.payerTypeFK !== INVOICE_PAYER_TYPE.PATIENT}
                patientInfo={patient}
                handlePaymentTypeClick={this.onPaymentTypeClick}
                currentOSAmount={values.invoiceOSAmount}
              />
            </GridItem>
            <GridItem md={9}>
              <PaymentCard
                paymentList={values.paymentList}
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
                onClick={()=>{
                  if (this.props.isGroupPayment && values.outstandingAfterPayment > 0) {
                    notification.warning({
                      message:'Outstanding balance of current visit group must to be fully paid.',
                    })
                  }else handleSubmit()
                }}
                disabled={values.paymentList.length === 0 || disabledPayment}
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
