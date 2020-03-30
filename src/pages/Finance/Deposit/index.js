import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { compare } from '@/layouts'

import { CardContainer } from '@/components'
import Authorized from '@/utils/Authorized'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({
  header: {
    marginTop: 0,
    color: 'black',
  },
})
@connect(({ deposit }) => ({
  deposit,
}))
@compare('deposit')
class Deposit extends PureComponent {
  componentDidMount () {
    this.queryDepositListing()
  }

  queryDepositListing = () => {
    this.props.dispatch({
      type: 'deposit/query',
      payload: {
        apiCriteria: {
          OnlyWithDeposit: false,
          startDate: moment().add(-1, 'month').formatUTC(),
          endDate: moment().formatUTC(false),
        },
      },
    })
  }

  render () {
    const { props } = this
    const { classes, ...restProps } = props
    return (
      <CardContainer hideHeader>
        <FilterBar
          queryDepositListing={this.queryDepositListing}
          {...restProps}
        />
        <Grid {...restProps} />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Deposit)
