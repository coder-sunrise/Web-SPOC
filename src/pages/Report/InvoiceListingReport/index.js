import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import InvoiceList from './InvoiceList'
import ReportBase from '../ReportBase'

class InvoiceListingReport extends ReportBase {
  constructor(props) {
    super(props)
    this.state = {
      ...this.state,
      reportId: 59,
      fileName: 'Invoice Listing Report',
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    return <InvoiceList reportDatas={reportDatas} />
  }
}

const InvoiceListingReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    listingFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    listingFrom: moment(new Date()).startOf('month').toDate(),
    listingTo: moment(new Date()).endOf('month').toDate(),
    groupBy: 'None',
  }),
})(InvoiceListingReport)

export default InvoiceListingReportWithFormik
