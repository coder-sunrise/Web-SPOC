import React, { PureComponent } from 'react'
import moment from 'moment'
import { connect } from 'dva'
import { withStyles } from '@material-ui/core'
import FilterBar from './FilterBar'
import CorFormGrid from './CorFormGrid'
import VisitFormGrid from './VisitFormGrid'
import { CardContainer } from '@/components'
import { FORM_FROM } from '@/utils/constants'

const styles = () => ({})

@connect(({ formListing }) => ({
  formListing,
}))
class FormListingDetails extends PureComponent {
  componentDidMount () {
    this.queryFormListing()
  }

  queryFormListing = () => {
    const { formListing, formFrom } = this.props
    let payload
    if (formFrom === FORM_FROM.FORMMODULE) {
      payload = {
        apiCriteria: {
          startDate: moment().add(-1, 'month').formatUTC(),
          endDate: moment().formatUTC(false),
        },
      }
    } else {
      payload = {
        apiCriteria: {
          visitID: formListing.visitID,
        },
      }
    }
    this.props.dispatch({
      type: 'formListing/query',
      payload,
    })
  }

  render () {
    const { formFrom } = this.props
    return (
      <CardContainer hideHeader>
        <React.Fragment>
          {formFrom === FORM_FROM.FORMMODULE ? (
            <div>
              <FilterBar {...this.props} />
              <CorFormGrid {...this.props} />
            </div>
          ) : (
            <VisitFormGrid {...this.props} />
          )}
        </React.Fragment>
      </CardContainer>
    )
  }
}
export default withStyles(styles)(FormListingDetails)
