import React from 'react'
import * as Yup from 'yup'
import moment, { monthsShort } from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import ReportBase from '../ReportBase'
import PatientAgeingList from './PatientAgeingList'

const reportId = 62
const fileName = 'Patient Ageing Report'

class PatientAgeingReport extends ReportBase {
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
    if (!reportDatas) return null
    return <PatientAgeingList reportDatas={reportDatas} />
  }
}

const PatientAgeingReportWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      month: Yup.string().required(),
      year: Yup.string().required(),
    }
  ),
  mapPropsToValues: () => ({
    patientCriteria: '',
    month: monthsShort(moment(new Date()).months()),
    year: moment(new Date()).years(),
  }),
})(PatientAgeingReport)

export default PatientAgeingReportWithFormik
