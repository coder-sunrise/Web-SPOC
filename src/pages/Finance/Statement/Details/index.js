import React, { PureComponent } from 'react'
import { withStyles, Paper } from '@material-ui/core'
import { connect } from 'dva'
import { withFormikExtend, Tabs } from '@/components'
import { StatementDetailOption } from './variables'
import DetailsHeader from './DetailsHeader'
import Yup from '@/utils/yup'

const styles = () => ({})
@connect(({ statement, user }) => ({
  statement,
  user,
}))
@withFormikExtend({
  enableReinitialize: true,
  mapPropsToValues: ({ statement }) => {
    const returnValue = statement.entity || statement.default

    let adminChargeValue = 0
    if (returnValue.statementInvoice) {
      returnValue.statementInvoice.forEach((o) => {
        adminChargeValue += o.adminCharge
      })
    }

    const outstandingBalance =
      returnValue.totalAmount - returnValue.collectedAmount - adminChargeValue

    return {
      ...returnValue,
      outstandingBalance,
      adminChargeValue,
    }
  },
  validationSchema: Yup.object().shape({
    amount: Yup.number().max(Yup.ref('maxAmount')),
    paymentCreatedBizSessionFK: Yup.number().required(),
  }),
  handleSubmit: (values, { props }) => {
    const { dispatch, onConfirm, history, user } = props
    const { paymentCreatedBizSessionFK } = values

    const paymentReceivedByUserFK = user.data.id
    values.statementInvoice.forEach((o) => {
      o.statementInvoicePayment.forEach((i) => {
        i.invoicePayment = {
          ...i.invoicePayment,
          paymentCreatedBizSessionFK,
          paymentReceivedBizSessionFK: paymentCreatedBizSessionFK,
          paymentReceivedByUserFK,
        }
      })
    })

    console.log({ values })
    const payload = {
      ...values,
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
        this.setState({ type: v.adminChargeValueType })
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
