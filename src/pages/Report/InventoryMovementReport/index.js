import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import MovementList from './MovementList'
import ReportBase from '../ReportBase'

const reportId = 22
const fileName = 'Inventory Movement Report'
class InventoryMovementReport extends ReportBase {
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

  renderContent = (reportDatas) => {
    return <MovementList reportDatas={reportDatas} />
  }
}

const InventoryMovementReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date())
      .startOf('month')
      .toDate(),
    dateTo: moment(new Date())
      .endOf('month')
      .toDate(),
    inventoryType: 'CONSUMABLE',
    transactionType: 'ALL',
  }),
})(InventoryMovementReport)

export default InventoryMovementReportWithFormik
