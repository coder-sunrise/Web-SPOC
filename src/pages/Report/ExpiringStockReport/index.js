import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import ReportBase from '../ReportBase'
import ExpiringStockList from './ExpiringStockList'

const reportId = '76'
const fileName = 'Expiring Stock Report'

class ExpiringStockReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} values={this.props.values} />
  }

  renderContent = (reportDatas) => {
    return <ExpiringStockList reportDatas={reportDatas} />
  }
}

const ExpiringStockReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    stockType: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date())
      .startOf('month')
      .toDate(),
    dateTo: moment(new Date())
      .endOf('month')
      .toDate(),
    stockType: 'CONSUMABLE',
  }),
})(ExpiringStockReport)

export default ExpiringStockReportWithFormik
