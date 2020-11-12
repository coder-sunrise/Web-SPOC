import React from 'react'
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import InventoryList from './InventoryList'
import ReportBase from '../ReportBase'

const reportId = 39
const fileName = 'Inventory Listing Report'

class InventoryListingReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
      acpType: 1,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return <FilterBar handleSubmit={handleSubmit} isSubmitting={isSubmitting} />
  }

  renderContent = (reportDatas) => {
    return <InventoryList reportDatas={reportDatas} />
  }
}

const InventoryListingReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    inventoryType: Yup.string().required(),
    acpType: Yup.number().required(),
  }),
  mapPropsToValues: () => ({
    inventoryType: 'MEDICATION',
    acpType: 1,
  }),
})(InventoryListingReport)

export default InventoryListingReportWithFormik
