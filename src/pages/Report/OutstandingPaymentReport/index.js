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
  constructor(props) {
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
      isPatientPayer:
        params.payerType === 'All' || params.payerType === 'Patient',
      isCompanyPayer:
        params.payerType === 'All' || params.payerType === 'Company',
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
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
