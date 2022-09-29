import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'

// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import PartialDispenseList from './PartialDispenseList'
import ReportBase from '../ReportBase'

const reportId = 85
const fileName = 'Dispensary Report'

class PartialDispenseReport extends ReportBase {
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
    return <PartialDispenseList reportDatas={reportDatas} />
  }
}

const PartialDispenseReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({}),
  mapPropsToValues: () => ({
    patientCriteria: '',
    inventoryType: 'CONSUMABLE',
    dateFrom: moment(new Date())
      .add('-1', 'M')
      .toDate(),
    dateTo: moment(new Date()).toDate(),
  }),
})(PartialDispenseReport)

export default PartialDispenseReportWithFormik
