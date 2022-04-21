import React, { PureComponent } from 'react'
import _ from 'lodash'
import { connect } from 'dva'
import moment from 'moment'
import { FastField } from 'formik'
import Yup from '@/utils/yup'
import { withStyles } from '@material-ui/core'
import { roundToPrecision } from '@/utils/codes'
import {
  GridItem,
  CardContainer,
  NumberInput,
  TextField,
  CodeSelect,
  Field,
  DatePicker,
  Select,
  ProgressButton,
  serverDateFormat,
  notification,
  withFormikExtend,
} from '@/components'
import { PAYMENT_MODE, DEFAULT_PAYMENT_MODE_GIRO } from '@/utils/constants'
import { getBizSession } from '@/services/queue'
import paymentService from '@/services/invoicePayment'
import { CreditCardNumberInput } from '@/components/_medisys'

const styles = theme => ({})
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: () => {
    return {
      paymentModeFK: DEFAULT_PAYMENT_MODE_GIRO.PAYMENT_FK,
      displayValue: DEFAULT_PAYMENT_MODE_GIRO.DISPLAY_VALUE,
    }
  },
  validationSchema: Yup.object().shape({
    paymentCreatedBizSessionFK: Yup.number().required(),
    creditCardTypeFK: Yup.number().when('paymentModeFK', {
      is: val => val === PAYMENT_MODE.CREDIT_CARD,
      then: Yup.number().required(),
    }),
    paymentDate: Yup.string().required(),
    paymentModeFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props, resetForm, ...rest }) => {
    const {
      dispatch,
      history,
      user,
      codetable,
      billingDetails: { invoiceList, company, filterValues },
      searchCompany,
      setFieldValue,
    } = props
    const {
      paymentCreatedBizSessionFK,
      initialPaymentCreatedBizSessionFK,
      paymentModeFK,
      displayValue,
      paymentDate,
      initialPaymentDate,
      remarks,
      cardNumber,
      creditCardTypeFK,
      refNo,
      chequeNo,
    } = values

    const paymentReceivedByUserFK = user.data.id
    let toPaidInvoiceList = invoiceList.filter(item => item.payAmount > 0)

    const isCashPayment = paymentModeFK === PAYMENT_MODE.CASH
    let invoicePayments = []
    let invoicePayment = null
    let paymentAmt = null
    let roundingAmt = null
    let cardPayment = null
    let chequePayment = null
    let giroPayment = null
    let netsPayment = null
    if (paymentModeFK === 1) {
      let creditCardType = codetable.ctcreditcardtype.find(
        item => item.id === creditCardTypeFK,
      ).name
      cardPayment = {
        creditCardNo: cardNumber,
        creditCardTypeFK,
        creditCardType,
      }
    } else if (paymentModeFK === 2) {
      chequePayment = { chequeNo }
    } else if (paymentModeFK === 5) {
      giroPayment = { refNo }
    } else if (paymentModeFK === 4) {
      netsPayment = { refNo }
    }

    toPaidInvoiceList.map(invoice => {
      paymentAmt = invoice.payAmount
      roundingAmt = parseFloat(
        Math.abs(paymentAmt - roundToPrecision(paymentAmt, 0.05)).toFixed(2),
      )

      invoicePayment = {
        invoicePayerFK: invoice.copayerInvoicePayerId,
        totalAmtPaid: paymentAmt,
        cashReceived: isCashPayment ? paymentAmt - roundingAmt : 0,
        cashReturned: 0,
        paymentReceivedDate: moment(paymentDate, serverDateFormat).formatUTC(
          false,
        ),
        paymentReceivedByUserFK,
        paymentReceivedBizSessionFK: paymentCreatedBizSessionFK,
        paymentCreatedBizSessionFK,
        isCancelled: false,
        invoicePaymentMode: [
          {
            paymentModeFK,
            paymentMode: displayValue,
            amt: paymentAmt,
            cashRounding: isCashPayment ? roundingAmt : 0,
            remark: remarks,
            creditCardPayment: cardPayment,
            giroPayment,
            chequePayment,
            netsPayment,
          },
        ],
      }

      invoicePayments.push(invoicePayment)
    })

    paymentService.addPayment(invoicePayments).then(response => {
      if (response) {
        notification.success({
          message: 'Payment added',
        })
        searchCompany(company.id)
        resetForm({
          paymentCreatedBizSessionFK: initialPaymentCreatedBizSessionFK,
          paymentDate: initialPaymentDate,
          paymentModeFK: DEFAULT_PAYMENT_MODE_GIRO.PAYMENT_FK,
          displayValue: DEFAULT_PAYMENT_MODE_GIRO.DISPLAY_VALUE,
        })
      }
    })
  },
  displayName: 'CorporateBillingPayment',
})
class Payment extends PureComponent {
  state = {
    isCardPayment: false,
    isGIROPayment: true,
    isChequePayment: false,
    isNetsPayment: false,
    totalAmount: '',
    hasActiveSession: false,
    bizSessionList: [],
  }

  componentDidMount() {
    this.checkHasActiveSession()
    this.fetchLatestBizSessions()
  }

  onChangePaymentMode = (event, op) => {
    const { displayValue } = op
    const { setFieldValue } = this.props
    const selectedValue = event || ''
    if (selectedValue === 1) {
      this.setState({ isCardPayment: true })
      this.setState({ isGIROPayment: false })
      this.setState({ isChequePayment: false })
      this.setState({ isNetsPayment: false })
      setFieldValue('creditCardTypeFK', 1)
    } else if (selectedValue === 5) {
      this.setState({ isChequePayment: false })
      this.setState({ isNetsPayment: false })
      this.setState({ isCardPayment: false })
      this.setState({ isGIROPayment: true })
      setFieldValue('cardNumber', '')
      setFieldValue('creditCardTypeFK', undefined)
    } else if (selectedValue === 2) {
      this.setState({ isChequePayment: true })
      this.setState({ isNetsPayment: false })
      this.setState({ isCardPayment: false })
      this.setState({ isGIROPayment: false })
      setFieldValue('cardNumber', '')
      setFieldValue('creditCardTypeFK', undefined)
    } else if (selectedValue === 4) {
      this.setState({ isChequePayment: false })
      this.setState({ isNetsPayment: true })
      this.setState({ isCardPayment: false })
      this.setState({ isGIROPayment: false })
      setFieldValue('cardNumber', '')
      setFieldValue('creditCardTypeFK', undefined)
    } else {
      this.setState({ isCardPayment: false })
      this.setState({ isChequePayment: false })
      this.setState({ isGIROPayment: false })
      setFieldValue('cardNumber', '')
      setFieldValue('refNo', '')
      setFieldValue('chequeNo', '')
      setFieldValue('creditCardTypeFK', undefined)
    }
    setFieldValue('displayValue', displayValue)
  }

  onChangeDate = event => {
    if (event) {
      this.getBizList(event)
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
      if (status === '200' && data.totalRecords > 0) {
        const { data: sessionData } = data
        const { isClinicSessionClosed, sessionStartDate } = sessionData[0]
        let paymentDate = moment()
        if (isClinicSessionClosed === true) {
          paymentDate = moment(sessionStartDate, serverDateFormat)
        }

        this.getBizList(paymentDate.format(serverDateFormat))
      } else {
        setFieldValue('paymentDate', null)
        setFieldValue('paymentCreatedBizSessionFK', undefined)
        setFieldValue('initialPaymentDate', null)
        setFieldValue('initialPaymentCreatedBizSessionFK', undefined)
      }
    })
  }

  getBizList = date => {
    if (!date) return
    const { dispatch, setFieldValue } = this.props
    const momentDate = moment(date, serverDateFormat)

    const startDateTime = moment(
      momentDate.set({ hour: 0, minute: 0, second: 0 }),
    ).formatUTC(false)
    const endDateTime = moment(
      momentDate.set({ hour: 23, minute: 59, second: 59 }),
    ).formatUTC(false)

    dispatch({
      type: 'billingDetails/bizSessionList',
      payload: {
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
      },
    }).then(() => {
      const { bizSessionList: newBizSessionList } = this.props.billingDetails

      this.setState(() => {
        return { bizSessionList: newBizSessionList }
      })

      if (newBizSessionList) {
        setFieldValue('paymentDate', startDateTime)
        setFieldValue('initialPaymentDate', startDateTime)

        const paymentCreatedBizSessionFK =
          !newBizSessionList || newBizSessionList.length === 0
            ? undefined
            : newBizSessionList[0].value

        setFieldValue('paymentCreatedBizSessionFK', paymentCreatedBizSessionFK)
        setFieldValue(
          'initialPaymentCreatedBizSessionFK',
          paymentCreatedBizSessionFK,
        )
      }
    })
  }

  checkHasActiveSession = async () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    const result = await getBizSession(bizSessionPayload)
    const { data } = result.data

    this.setState(() => {
      return {
        hasActiveSession: data.length > 0,
      }
    })
  }

  render() {
    const {
      isCardPayment,
      isGIROPayment,
      isNetsPayment,
      isChequePayment,
      hasActiveSession,
      bizSessionList,
    } = this.state

    const {
      values,
      handleSubmit,
      setFieldValue,
      billingDetails: { totalPaidAmount },
    } = this.props

    return (
      <CardContainer hideHeader style={{ marginTop: 0 }}>
        <GridItem>
          <NumberInput
            currency
            label='Amount'
            disabled
            value={totalPaidAmount}
            min={0}
          />
        </GridItem>

        <GridItem>
          <Field
            name='paymentDate'
            render={args => (
              <DatePicker
                onChange={this.onChangeDate}
                disabledDate={d => !d || d.isAfter(moment())}
                label='Date'
                {...args}
              />
            )}
          />
        </GridItem>

        <GridItem>
          <Field
            name='paymentCreatedBizSessionFK'
            render={args => (
              <Select label='Session' options={bizSessionList} {...args} />
            )}
          />
        </GridItem>

        <GridItem>
          <Field
            name='paymentModeFK'
            render={args => (
              <CodeSelect
                {...args}
                label='Payment Mode'
                code='ctPaymentMode'
                labelField='displayValue'
                localFilter={item => item.code !== 'DEPOSIT'}
                onChange={(e, op = {}) => this.onChangePaymentMode(e, op)}
              />
            )}
          />
        </GridItem>

        {isCardPayment && (
          <React.Fragment>
            <GridItem>
              <Field
                name='creditCardTypeFK'
                render={args => (
                  <CodeSelect
                    label='Card Type'
                    code='ctCreditCardType'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem>
              <Field
                name='cardNumber'
                render={args => <CreditCardNumberInput {...args} />}
              />
            </GridItem>
          </React.Fragment>
        )}
        {isGIROPayment && (
          <React.Fragment>
            <GridItem>
              <FastField
                name='refNo'
                render={args => <TextField {...args} label='Ref. No' />}
              />
            </GridItem>
          </React.Fragment>
        )}
        {isNetsPayment && (
          <React.Fragment>
            <GridItem>
              <FastField
                name='refNo'
                render={args => <TextField {...args} label='Ref. No' />}
              />
            </GridItem>
          </React.Fragment>
        )}
        {isChequePayment && (
          <React.Fragment>
            <GridItem>
              <FastField
                name='chequeNo'
                render={args => <TextField {...args} label='Cheque No' />}
              />
            </GridItem>
          </React.Fragment>
        )}

        <GridItem>
          <FastField
            name='remarks'
            render={args => <TextField {...args} multiline label='Remarks' />}
          />
        </GridItem>
        <GridItem style={{ float: 'right', padding: 0, marginTop: 10 }}>
          <ProgressButton
            color='primary'
            disabled={totalPaidAmount <= 0 || !hasActiveSession}
            onClick={handleSubmit}
          >
            Confirm Payment
          </ProgressButton>
        </GridItem>
      </CardContainer>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Payment)
