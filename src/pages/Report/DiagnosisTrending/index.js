import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import { GridContainer, GridItem } from '@/components'
import FilterBar from './FilterBar'
import ReportBase from '../ReportBase'
import DiagnosisGroupDetails from './DiagnosisGroupDetails'
import DiagnosisDetails from './DiagnosisDetails'

const reportId = 6
const fileName = 'Diagnosis Trending'
class DiagnosisTrending extends ReportBase {
  constructor (props) {
    super(props)
    this.state = {
      ...this.state,
      reportId,
      fileName,
    }
  }

  renderFilterBar = (handleSubmit, isSubmitting, formikProps) => {
    return (
      <FilterBar
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        formikProps={formikProps}
      />
    )
  }

  renderContent = (reportDatas) => {
    return (
      <GridContainer>
        <GridItem md={12}>
          <DiagnosisGroupDetails reportDatas={reportDatas} />
        </GridItem>
        <GridItem md={12} style={{ padding: 6 }}>
          <DiagnosisDetails reportDatas={reportDatas} />
        </GridItem>
      </GridContainer>
    )
  }
}

const DiagnosisTrendingWithFormik = withFormik({
  validationSchema: Yup.object().shape(
    {
      // patientCriteria: Yup.string().required(),
    },
  ),
  mapPropsToValues: () => ({
    listingFrom: moment(new Date()).startOf('month').toDate(),
    listingTo: moment(new Date()).endOf('month').toDate(),
    viewBy: 'Monthly',
  }),
})(DiagnosisTrending)

export default DiagnosisTrendingWithFormik
