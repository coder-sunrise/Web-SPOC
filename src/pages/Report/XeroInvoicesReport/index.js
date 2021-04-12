import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import ReportBase from '../ReportBase'

const reportId = 79
const fileName = 'Xero Invoices Report'
const exportTableName = 'XeroInvoices'

class XeroInvoicesReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
      tableName: exportTableName,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting, formikProps, exportCSV) => {
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        exportCSV={exportCSV}
      />
    )
  }
}

const XeroInvoicesReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
    dateTo: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(XeroInvoicesReport)

export default XeroInvoicesReportWithFormik
