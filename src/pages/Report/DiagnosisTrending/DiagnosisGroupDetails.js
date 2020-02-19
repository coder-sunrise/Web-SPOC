import React, { PureComponent } from 'react'
import { ReportDataGrid } from '@/components/_medisys'

class DiagnosisGroupDetails extends PureComponent {
  render () {
    let listData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas.DiagnosisDetails) {
      listData = reportDatas.DiagnosisGroupDetails.map((item, index) => ({
        ...item,
        id: `DiagnosisDetails-${index}-${item.diagnosisCode}`,
      }))
    }
    const FuncProps = {
      pager: false,
      grouping: true,
      groupingConfig: {
        state: {
          grouping: [
            { columnName: 'groupName' },
          ],
        },
      },
    }

    const DiagnosisDetailsColumns = [
      { name: 'groupName', title: 'Date' },
      { name: 'diagnosisCode', title: 'Diagnosis Code' },
      { name: 'diagnosisName', title: 'Diagnosis Name' },
      { name: 'patientCount', title: 'Patients' },
      { name: 'visitCount', title: 'Visits' },
    ]
    const DiagnosisDetailsExtensions = [
      { columnName: 'groupName', sortingEnabled: false },
      { columnName: 'diagnosisCode', sortingEnabled: false },
      { columnName: 'diagnosisName', sortingEnabled: false },
      { columnName: 'patientCount', sortingEnabled: false },
      { columnName: 'visitCount', sortingEnabled: false },
    ]

    return (
      <ReportDataGrid
        data={listData}
        columns={DiagnosisDetailsColumns}
        columnExtensions={DiagnosisDetailsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default DiagnosisGroupDetails
