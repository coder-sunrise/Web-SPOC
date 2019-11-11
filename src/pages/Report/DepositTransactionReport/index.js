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
      ...super.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit) => {
    return <FilterBar handleSubmit={handleSubmit} />
  }

  renderContent = (reportDatas) => {
    return <DepositList reportDatas={reportDatas} />
  }

}

const DepositTransactionReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(DepositTransactionReport)

export default DepositTransactionReportWithFormik
