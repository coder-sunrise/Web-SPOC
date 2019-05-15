import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Field, withFormik } from 'formik'
import { formatMessage } from 'umi/locale'
import { withStyles, Grid, Divider } from '@material-ui/core'

import { GridContainer, GridItem, NumberInput } from '@/components'
import CollectPaymentGrid from './CollectPaymentGrid'
import FilterBar from './FilterBar'
import PaymentType from './PaymentType'

const style = () => ({
  totalPayment: {
    textAlign: 'right',
  },
  summaryLabel: {
    paddingTop: 0,
  },
})

@connect(({ corporateBilling }) => ({
  corporateBilling,
}))
@withFormik({
  mapPropsToValues: () => ({
    totalAmount: 0,
  }),
})
class CollectPayment extends PureComponent {
  state = {
    totalAmount: 0,
  }

  getTotalPayAmount = () => {
    const { corporateBilling: { collectPaymentList } } = this.props

    const getSum = (sum, payment) => sum + payment.payAmount
    const totalAmount = collectPaymentList.reduce(getSum, 0)

    return totalAmount
  }

  handleTotalAmountChanges = (totalAmount) => {
    this.setState({ totalAmount })
  }

  render () {
    const { totalAmount } = this.state
    const { theme, classes, footer, onConfirm } = this.props

    const summaryCfg = {
      currency: true,
      formControlProps: {
        className: classes.summaryLabel,
      },
    }

    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs sm={12} md={12}>
            <FilterBar />
          </GridItem>
          <GridItem xs sm={12} md={8}>
            <CollectPaymentGrid
              onTotalAmountChanges={this.handleTotalAmountChanges}
            />
          </GridItem>
          <GridItem xs sm={12} md={4}>
            <PaymentType totalAmount={totalAmount} />
          </GridItem>
        </GridContainer>
        {footer &&
          footer({
            onConfirm,
            confirmBtnText: formatMessage({
              id: 'form.save',
            }),
            confirmProps: {
              disabled: false,
            },
          })}
      </React.Fragment>
    )
  }
}

export default withStyles(style, { withTheme: true })(CollectPayment)
