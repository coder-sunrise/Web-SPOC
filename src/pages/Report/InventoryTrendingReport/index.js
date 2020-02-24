import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import InventoryGroupDetails from './InventoryGroupDetails'
import InventoryDetails from './InventoryDetails'
import ReportBase from '../ReportBase'
import { GridContainer, GridItem } from '@/components'

const reportId = 37
const fileName = 'Inventory Trending Report'

class InventoryTrendingReport extends ReportBase {
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
    return (
      <GridContainer>
        <GridItem md={12}>
          <InventoryGroupDetails reportDatas={reportDatas} />
        </GridItem>
        <GridItem md={12} style={{ padding: 6 }}>
          <InventoryDetails reportDatas={reportDatas} />
        </GridItem>
      </GridContainer>
    )
  }
}

const InventoryTrendingReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    listingFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    listingFrom: moment(new Date()).startOf('month').toDate(),
    listingTo: moment(new Date()).endOf('month').toDate(),
    viewBy: 'Monthly',
    inventoryType: 'MEDICATION',
  }),
})(InventoryTrendingReport)

export default InventoryTrendingReportWithFormik
