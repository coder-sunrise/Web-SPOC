import React, { PureComponent } from 'react'
import { withStyles, Paper } from '@material-ui/core'
import { connect } from 'dva'
import moment from 'moment'
import { withFormikExtend, Tabs, serverDateFormat } from '@/components'
import { StatementDetailOption } from './variables'
import DetailsHeader from './DetailsHeader'
import Yup from '@/utils/yup'
import { PAYMENT_MODE, DEFAULT_PAYMENT_MODE_GIRO } from '@/utils/constants'
import { roundToPrecision } from '@/utils/codes'
import { getBizSession } from '@/services/queue'

const styles = () => ({})
@connect(({ statement, user }) => ({
  statement,
  user,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ statement }) => {
    const returnValue = statement.entity || statement
    let newStatementInvoice = []
    let total = 0
    let adminChargeValueField = 0
    if (returnValue.statementInvoice) {
      newStatementInvoice = returnValue.statementInvoice.map((o) => {
        const { statementInvoicePayment, adminCharge, outstandingAmount } = o
        total += outstandingAmount
        adminChargeValueField += adminCharge

        return {
          ...o,
          tempOutstandingAmount: o.outstandingAmount,
          statementInvoicePayment: [
            ...statementInvoicePayment,
          ],
        }
      })
    }

    const outstandingBalance =
      returnValue.totalAmount -
      returnValue.collectedAmount -
      adminChargeValueField

    return {
      ...returnValue,
      outstandingBalance,
      adminChargeValueField,
      amount: Number(total).toFixed(2),
      maxAmount: Number(total).toFixed(2),
      paymentModeFK: DEFAULT_PAYMENT_MODE_GIRO.PAYMENT_FK, // GIRO
      displayValue: DEFAULT_PAYMENT_MODE_GIRO.DISPLAY_VALUE,
      statementInvoice: newStatementInvoice,
    }
  },
  validationSchema: Yup.object().shape({
    amount: Yup.number().max(Yup.ref('maxAmount')),
    paymentCreatedBizSessionFK: Yup.number().required(),
    creditCardTypeFK: Yup.number().when('paymentModeFK', {
      is: (val) => val === 1,
      then: Yup.number().required(),
    }),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history, user } = props
    const {
      paymentCreatedBizSessionFK,
      paymentModeFK,
      displayValue,
      paymentDate,
    } = values
    const paymentReceivedByUserFK = user.data.id
    let newPaymentStatementInvoice = values.statementInvoice.filter(
      (o) =>
        o.statementInvoicePayment.find((i) => !i.id) &&
        o.tempOutstandingAmount > 0,
    )
    newPaymentStatementInvoice = newPaymentStatementInvoice.map((o) => {
      let newInvoicePayment = o.statementInvoicePayment.find((i) => !i.id)
      const existingInvoicePayment = o.statementInvoicePayment.filter(
        (i) => i.id,
      )
      const isCashPayment = paymentModeFK === PAYMENT_MODE.CASH
      const paymentAmt = newInvoicePayment.totalAmtPaid
      const roundingAmt = parseFloat(
        Math.abs(paymentAmt - roundToPrecision(paymentAmt, 0.05)).toFixed(2),
      )
      const { invoicePayment, statementInvoiceFK } = newInvoicePayment
      newInvoicePayment = {
        ...invoicePayment,
        paymentCreatedBizSessionFK,
        paymentReceivedBizSessionFK: paymentCreatedBizSessionFK,
        paymentReceivedByUserFK,
        paymentReceivedDate: moment(paymentDate, serverDateFormat).formatUTC(
          false,
        ),
        invoicePaymentMode: [
          {
            paymentModeFK,
            amt: invoicePayment.totalAmtPaid,
            paymentMode: displayValue,
            cashRouding: isCashPayment ? roundingAmt : 0,
          },
        ],
      }
      return {
        ...o,
        statementInvoicePayment: [
          ...existingInvoicePayment,
          { invoicePayment: { ...newInvoicePayment }, statementInvoiceFK },
        ],
      }
    })

    // values.statementInvoice.forEach((o) => {
    //   o.statementInvoicePayment.forEach((i) => {
    //     if (!i.id) {
    //       const isCashPayment = paymentModeFK === PAYMENT_MODE.CASH
    //       const paymentAmt = i.invoicePayment.totalAmtPaid
    //       const roundingAmt = parseFloat(
    //         Math.abs(paymentAmt - roundToPrecision(paymentAmt, 0.05)).toFixed(
    //           2,
    //         ),
    //       )
    //       i.invoicePayment = {
    //         ...i.invoicePayment,
    //         paymentCreatedBizSessionFK,
    //         paymentReceivedBizSessionFK: paymentCreatedBizSessionFK,
    //         paymentReceivedByUserFK,
    //         invoicePaymentMode: [
    //           {
    //             paymentModeFK,
    //             amt: i.invoicePayment.totalAmtPaid,
    //             paymentMode: displayValue,
    //             cashRouding: isCashPayment ? roundingAmt : 0,
    //           },
    //         ],
    //       }
    //     }
    //   })
    // })

    const payload = {
      ...values,
      statementInvoice: newPaymentStatementInvoice,
    }
    dispatch({
      type: 'statement/upsert',
      payload,
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        history.push('/finance/statement')
      }
    })
  },
})
class StatementDetails extends PureComponent {
  componentDidMount = () => {
    const { statement, dispatch, history } = this.props
    if (statement.currentId) {
      dispatch({
        type: 'statement/refreshStatement',
        payload: {
          id: statement.currentId,
        },
      }).then((response) => {
        if (response) this.fetchLatestBizSessions()
      })
    } else {
      history.push('/finance/statement/')
    }
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
      }
    })
  }

  getBizList = (date) => {
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
      type: 'statement/bizSessionList',
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
        sorting: [
          { columnName: 'sessionStartDate', direction: 'desc' },
        ],
      },
    }).then(() => {
      const { bizSessionList } = this.props.statement
      if (bizSessionList) {
        setFieldValue('paymentDate', startDateTime)
        setFieldValue(
          'paymentCreatedBizSessionFK',
          !bizSessionList || bizSessionList.length === 0
            ? undefined
            : bizSessionList[0].value,
        )
      }
    })
  }

  render () {
    return (
      <React.Fragment>
        <Paper>
          <DetailsHeader {...this.props} />
        </Paper>
        <Paper style={{ padding: 5 }}>
          <Tabs
            style={{ marginTop: 20 }}
            defaultActiveKey='0'
            options={StatementDetailOption(
              this.props,
              this.fetchLatestBizSessions,
              this.getBizList,
            )}
          />
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(StatementDetails)
