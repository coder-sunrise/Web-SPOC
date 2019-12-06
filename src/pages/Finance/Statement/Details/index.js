import React, { PureComponent } from 'react'
import { withStyles, Paper } from '@material-ui/core'
import { connect } from 'dva'
import { withFormikExtend, Tabs } from '@/components'
import { StatementDetailOption } from './variables'
import DetailsHeader from './DetailsHeader'
import Yup from '@/utils/yup'
import { PAYMENT_MODE, DEFAULT_PAYMENT_MODE_GIRO } from '@/utils/constants'
import { roundToPrecision } from '@/utils/codes'

const styles = () => ({})
@connect(({ statement, user }) => ({
  statement,
  user,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ statement }) => {
    const returnValue = statement.entity || statement.default
    let newStatementInvoice = []
    let total = 0
    let adminChargeValue = 0
    if (returnValue.statementInvoice) {
      newStatementInvoice = returnValue.statementInvoice.map((o) => {
        const { statementInvoicePayment, adminCharge, outstandingAmount } = o
        total += outstandingAmount
        adminChargeValue += adminCharge

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
      returnValue.totalAmount - returnValue.collectedAmount - adminChargeValue

    return {
      ...returnValue,
      outstandingBalance,
      adminChargeValue,
      amount: total,
      maxAmount: total,
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
    const { paymentCreatedBizSessionFK, paymentModeFK, displayValue } = values
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
  state = {
    type: '',
  }

  componentDidMount = () => {
    const { statement, dispatch, history } = this.props
    if (statement.currentId) {
      dispatch({
        type: 'statement/queryOne',
        payload: {
          id: statement.currentId,
        },
      }).then((v) => {
        if (v) this.setState({ type: v.adminChargeValueType })
      })
    } else {
      history.push('/finance/statement/')
    }
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
            options={StatementDetailOption(this.props, this.state.type)}
          />
        </Paper>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(StatementDetails)
