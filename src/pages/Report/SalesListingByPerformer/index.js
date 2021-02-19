import React from 'react'
import moment from 'moment'
import * as Yup from 'yup'
// formik
import { withFormik } from 'formik'
// material ui
import SolidExpandMore from '@material-ui/icons/ArrowDropDown'
// common components
import { Accordion } from '@/components'
import { AccordionTitle } from '@/components/_medisys'
import ReportBase from '../ReportBase'
import FilterBar from './FilterBar'
import SalesList from './SalesList'

const reportId = 77
const fileName = 'Sales Listing By Performer Report'
class SalesListingByPerformer extends ReportBase {
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
    return <SalesList reportDatas={reportDatas} />
  }
}
const SalesListingByPerformerWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
  }),
})(SalesListingByPerformer)

export default SalesListingByPerformerWithFormik