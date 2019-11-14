import React from 'react'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
import * as Yup from 'yup'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
// sub components
import FilterBar from './FilterBar'

import SalesDetails from './SalesDetails'
import SummaryOfSales from './SummaryOfSales'
import Summary from './Summary'
import ReportBase from '../ReportBase'
import CategorySummary from './CategorySummary'

const reportId = 3
const fileName = 'Sales Summary Report'
class SalesSummary extends ReportBase {
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
    return <Accordion
      active={this.state.activePanel}
      onChange={this.handleActivePanelChange}
      leftIcon
      expandIcon={<SolidExpandMore fontSize='large' />}
      collapses={[
        {
          title: <AccordionTitle title='Sales Details' />,
          content: (
            <SalesDetails reportDatas={reportDatas} />
          ),
        },
        {
          title: <AccordionTitle title='Summary' />,
          content: (
            <Summary reportDatas={reportDatas} />
          ),
        },
        {
          title: <AccordionTitle title='Summary Of Category' />,
          content: (
            <CategorySummary reportDatas={reportDatas} />
          ),
        },
        {
          title: <AccordionTitle title='Summary Of Sales' />,
          content: (
            <SummaryOfSales reportDatas={reportDatas} />
          ),
        },
      ]}
    />
  }

}
const SalesSummaryWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(SalesSummary)

export default SalesSummaryWithFormik
