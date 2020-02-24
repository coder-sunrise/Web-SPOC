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
import { getServices } from '@/utils/codes'

const reportId = 37
const fileName = 'Inventory Trending Report'

class InventoryTrendingReport extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
      inventoryType: 'MEDICATION',
      serviceItems: [],
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting) => {
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        handleTypeChanged={(e) => {
          if (e === 'SERVICE') {
            window.g_app._store
              .dispatch({
                type: 'codetable/fetchCodes',
                payload: {
                  code: 'ctservice',
                  filter: {
                    'serviceFKNavigation.IsActive': true,
                    'serviceCenterFKNavigation.IsActive': true,
                    combineCondition: 'and',
                  },
                },
              })
              .then((list) => {
                const { services } = getServices(list)
                this.setState({ serviceItems: services })
              })
          }

          this.setState({ inventoryType: e })
        }}
        {...this.state}
      />
    )
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
