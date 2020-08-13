import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import VisitList from './VisitList'
import ReportBase from '../ReportBase'

const reportId = 63
const fileName = 'Visit Listing Report'

@connect(({ visitRegistration }) => ({
  visitRegistration,
}))
class VisitListing extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  formatReportParams = (params) => {
    return {
      ...params,
      groupByVisitPurpose: params.groupBy === 'VisitPurpose',
      groupByDoctor: params.groupBy === 'Doctor',
    }
  }

  componentDidMount = async () => {
    const { dispatch } = this.props
    const response = await dispatch({
      type: 'visitRegistration/getVisitOrderTemplateList',
      payload: {
        pagesize: 9999,
      },
    })
    if (response) {
      const { data } = response
      const templateOptions = data
        .filter((template) => template.isActive)
        .map((template) => {
          return {
            ...template,
            value: template.id,
            name: template.displayValue,
          }
        })

      dispatch({
        type: 'visitRegistration/updateState',
        payload: {
          visitOrderTemplateOptions: templateOptions,
        },
      })
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    const { visitRegistration: { visitOrderTemplateOptions = [] } } = this.props
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        visitOrderTemplateOptions={visitOrderTemplateOptions}
      />
    )
  }

  renderContent = (reportDatas) => {
    return <VisitList reportDatas={reportDatas} />
  }
}

const VisitListingWithFormik = withFormik({
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
    groupBy: 'None',
  }),
})(VisitListing)

export default VisitListingWithFormik
