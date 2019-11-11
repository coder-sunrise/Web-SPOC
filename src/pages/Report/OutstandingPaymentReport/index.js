import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import OutstandingList from './OutstandingList'
import ReportBase from '../ReportBase'

const reportId = 16
const fileName = 'Outstanding Payment Report'

class OutstandingPaymentReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...super.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit) => {
    return <FilterBar handleSubmit={handleSubmit} />
  }

  renderContent = (reportDatas) => {
    return <OutstandingList reportDatas={reportDatas} />
  }

}

const OutstandingPaymentReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
    payerType: 'All',
  }),
})(OutstandingPaymentReport)

export default OutstandingPaymentReportWithFormik
