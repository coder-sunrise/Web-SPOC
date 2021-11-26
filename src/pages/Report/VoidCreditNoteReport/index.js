import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
// services
import VoidCNList from './VoidCNList'
import ReportBase from '../ReportBase'

const reportId = 14
const fileName = 'Void Credit Note & Payment Report'

class VoidCreditNoteReport extends ReportBase {
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
    return <VoidCNList reportDatas={reportDatas} />
  }
}

const VoidCreditNoteReportWithFormik = withFormik({
  validationSchema: Yup.object().shape({
    dateFrom: Yup.date().required(),
  }),
  mapPropsToValues: () => ({
    dateFrom: moment(new Date()).startOf('month').toDate(),
    dateTo: moment(new Date()).endOf('month').toDate(),
    filterType: 'Credit Note',
  }),
})(VoidCreditNoteReport)

export default VoidCreditNoteReportWithFormik
