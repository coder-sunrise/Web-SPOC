import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'

import DepositList from './DepositList'
import ReportBase from '../ReportBase'

const reportId = 23
const fileName = 'Deposit Transaction Report'

class DepositTransactionReport extends ReportBase {
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
    return <DepositList reportDatas={reportDatas} />
  }
}

const DepositTransactionReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => {
    const values = {
      dateFrom: moment(new Date()).startOf('month').toDate(),
      dateTo: moment(new Date()).endOf('month').toDate(),
    }
    console.log({ values })
    return values
  },
})(DepositTransactionReport)

export default DepositTransactionReportWithFormik
