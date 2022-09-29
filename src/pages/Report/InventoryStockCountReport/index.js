import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import InventoryStockCountList from './InventoryStockCountList'
import ReportBase from '../ReportBase'
import { GridContainer, GridItem } from '@/components'

const reportId = 40
const fileName = 'Inventory Stock Count Report'

class InventoryStockCountReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        values={this.props.values}
      />
    )
  }

  renderContent = (reportDatas) => {
    return <InventoryStockCountList reportDatas={reportDatas} />
  }
}

const InventoryStockCountReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    inventoryType: Yup.string().required(),
  }),
  mapPropsToValues: () => ({
    isActive: true,
    inventoryType: [-99, 'CONSUMABLE'],
  }),
})(InventoryStockCountReport)

export default InventoryStockCountReportWithFormik
