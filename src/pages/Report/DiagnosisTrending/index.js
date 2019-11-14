import React from 'react'
import * as Yup from 'yup'
import moment from 'moment'
// formik
import { withFormik } from 'formik'
// sub components
import FilterBar from './FilterBar'
import { ReportDataGrid } from '@/components/_medisys'
import ReportBase from '../ReportBase'

const DiagnosisDetailsColumns = [
  { name: 'groupName', title: 'Date' },
  { name: 'diagnosisCode', title: 'Diagnosis Code' },
  { name: 'diagnosisName', title: 'Diagnosis Name' },
  { name: 'patientCount', title: 'Patients' },
  { name: 'visitCount', title: 'Visits' },
]

const reportId = 6
const fileName = 'Diagnosis Trending'
class DiagnosisTrending extends ReportBase {
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
    let listData = []
    if (!reportDatas)
      return null
    if (reportDatas.DiagnosisDetails) {
      listData = reportDatas.DiagnosisDetails.map(
        (item, index) => ({
          ...item,
          id: `DiagnosisDetails-${index}-${item.diagnosisCode}`,
        }),
      )
    }
    const FuncProps = {
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'groupName' },
          ],
        },
      },
    }
    return (
      <ReportDataGrid
        height='auto'
        data={listData}
        columns={DiagnosisDetailsColumns}
        FuncProps={FuncProps}
      />
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
