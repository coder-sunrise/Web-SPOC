import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { compare } from '@/layouts'
import { getBizSession } from '@/services/queue'
import { CardContainer, WarningSnackbar } from '@/components'
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
  constructor (props) {
    super(props)
    this.state = {
      hasActiveSession: true,
    }
  }

  componentDidMount () {
    this.checkHasActiveSession()
    this.queryDepositListing()
  }

  checkHasActiveSession = () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    getBizSession(bizSessionPayload).then((result) => {
      if (result) {
        const { data } = result.data
        this.setState({ hasActiveSession: data.length > 0 })
      }
    })
  }

  queryDepositListing = () => {
    this.props.dispatch({
      type: 'deposit/query',
      payload: {
        apiCriteria: {
          OnlyWithDeposit: false,
          startDate: moment().add(-1, 'month').formatUTC(),
          endDate: moment().endOf('day').formatUTC(false),
        },
      },
    })
  }

  render () {
    const { props } = this
    const { classes, ...restProps } = props
    return (
      <CardContainer hideHeader>
        {!this.state.hasActiveSession ? (
          <div style={{ paddingTop: 5 }}>
            <WarningSnackbar
              variant='warning'
              className={classes.margin}
              message='Action(s) is not allowed due to no active session was found.'
            />
          </div>
        ) : (
          ''
        )}
        <FilterBar
          queryDepositListing={this.queryDepositListing}
          {...restProps}
        />
        <Grid {...restProps} hasActiveSession={this.state.hasActiveSession} />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Deposit)
