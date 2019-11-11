import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import PatientList from './PatientList'
import ReportBase from '../ReportBase'

const reportId = 2
const fileName = 'Patient Listing Report'

class PatientListing extends ReportBase {
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
    return <PatientList reportDatas={reportDatas} />
  }

}

const PatientListingWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    patientCriteria: '',
    dateFrom: moment(new Date()).add(-1, 'year').toDate(),
    dateTo: moment(new Date()).toDate(),
    ageFrom: 0,
    ageTo: 0,
  }),
})(PatientListing)

export default PatientListingWithFormik
