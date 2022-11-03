import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
// sub components
import FilterBar from './FilterBar'
import VisitList from './VisitList'
import ReportBase from '../ReportBase'

const reportId = 63
const fileName = 'Visit Listing Report'

const styles = () => ({
  contactIcon: {
    width: 15,
    height: 15,
    position: 'relative',
    top: 3,
  },
})

@connect(({ visitRegistration, codetable }) => ({
  visitRegistration,
  ctcopayer: codetable.ctcopayer || [],
}))
class VisitListing extends ReportBase {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  formatReportParams = params => {
    return {
      ...params,
      groupByVisitPurpose: params.groupBy === 'VisitPurpose',
      groupByDoctor: params.groupBy === 'Doctor',
      groupByCopayer: params.groupBy === 'Copayer',
      groupByQueueStatus: params.groupBy === 'QueueStatus',
      groupByOptometrist: params.groupBy === 'Optometrist',
      groupByStudentOptometrist: params.groupBy === 'StudentOptometrist',
    }
  }

  componentDidMount = async () => {
    const { dispatch } = this.props
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctcopayer',
      },
    })
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    const { ctcopayer, classes } = this.props
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        ctcopayer={ctcopayer}
        classes={classes}
      />
    )
  }

  renderContent = reportDatas => {
    return <VisitList reportDatas={reportDatas} />
  }
}

const VisitListingWithFormik = withFormik({
  mapPropsToValues: () => ({
    dateFrom: moment(new Date())
      .startOf('month')
      .toDate(),
    dateTo: moment(new Date())
      .endOf('month')
      .toDate(),
    groupBy: 'None',
  }),
})(VisitListing)

export default withStyles(styles, { withTheme: true })(VisitListingWithFormik)
