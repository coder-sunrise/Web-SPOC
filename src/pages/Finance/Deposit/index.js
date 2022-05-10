import React, { Component } from 'react'
import { connect } from 'dva'
import $ from 'jquery'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { compare } from '@/layouts'
import { getBizSession } from '@/services/queue'
import { CardContainer, WarningSnackbar } from '@/components'
import FilterBar from './FilterBar'
import Grid from './Grid'

const styles = () => ({
  header: {
    marginTop: 0,
    color: 'black',
  },
})

@compare('deposit')
@connect(({ deposit, global }) => ({
  deposit,
  mainDivHeight: global.mainDivHeight,
}))
class Deposit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasActiveSession: true,
    }
  }

  componentDidMount() {
    this.checkHasActiveSession()
    this.queryDepositListing()
  }

  checkHasActiveSession = () => {
    const bizSessionPayload = {
      IsClinicSessionClosed: false,
    }
    getBizSession(bizSessionPayload).then(result => {
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
          startDate: moment()
            .add(-1, 'month')
            .formatUTC(),
          endDate: moment()
            .endOf('day')
            .formatUTC(false),
        },
      },
    })
  }
  queryDepositListingOrigin = () => {
    this.props.dispatch({
      type: 'deposit/query',
      payload: {},
    })
  }

  render() {
    const { props } = this
    const { classes, mainDivHeight = 700, ...restProps } = props

    let height = mainDivHeight - 100 - ($('.filterBar').height() || 0)
    if (height < 300) height = 300
    return (
      <CardContainer hideHeader>
        <div className='filterBar'>
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
        </div>
        <Grid
          {...restProps}
          queryDepositListing={this.queryDepositListingOrigin}
          hasActiveSession={this.state.hasActiveSession}
          height={height}
        />
      </CardContainer>
    )
  }
}

export default withStyles(styles)(Deposit)
