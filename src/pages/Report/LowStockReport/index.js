import React from 'react'
import * as Yup from 'yup'
import { withFormik } from 'formik'
import FilterBar from './FilterBar'
import LowStockList from './LowStockList'
import ReportBase from '../ReportBase'

const reportId = 20
const fileName = 'Inventory Threshold Report'

class LowStockReport extends ReportBase {
  constructor(props) {
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

  renderContent = reportDatas => {
    return <LowStockList reportDatas={reportDatas} />
  }
}

const LowStockReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({}),
  mapPropsToValues: () => ({
    inventoryType: 'CONSUMABLE',
    Status: 'active',
    ThresholdType: 'All',
  }),
})(LowStockReport)

export default LowStockReportWithFormik
