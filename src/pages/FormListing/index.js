import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import FilterBar from './FilterBar'
import Grid from './Grid'
import { CardContainer } from '@/components'

const styles = () => ({})

@connect(({ formListing }) => ({
  formListing,
}))
class FormListing extends PureComponent {
  componentDidMount () {
    this.queryDepositListing()
  }

  queryDepositListing = () => {
    this.props.dispatch({
      type: 'formListing/query',
      payload: {
        apiCriteria: {
          startDate: moment().add(-1, 'month').formatUTC(),
          endDate: moment().formatUTC(false),
        },
      },
    })
  }

  render () {
    return (
      <CardContainer hideHeader>
        <React.Fragment>
          <FilterBar {...this.props} />
          <Grid {...this.props} />
        </React.Fragment>
      </CardContainer>
    )
  }
}
export default withStyles(styles)(FormListing)
