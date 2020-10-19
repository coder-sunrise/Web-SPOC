import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import PurchaseReceivingList from './PurchaseReceivingList'
import ReportBase from '../ReportBase'

const reportId = 64
const fileName = 'Purchase & Receiving Listing Report'
class PurchaseReceivingListingReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    return <PurchaseReceivingList reportDatas={reportDatas} />
  }
}

const PurchaseReceivingListingReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(PurchaseReceivingListingReport)

export default PurchaseReceivingListingReportWithFormik
