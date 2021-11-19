import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'

import { ReportDataGrid } from '@/components/_medisys'

class DetailsList extends PureComponent {
  render() {
    let statisticDetailsData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.RadiologyStatisticDetails) {
      statisticDetailsData = reportDatas.RadiologyStatisticDetails.map(
        (item, index) => ({
          ...item,
          id: `accession-${index}-${item.accessionNumber}`,
        }),
      )
    }

    const examinationDetailsCols = [
      { name: 'orderDate', title: 'Order Date' },
      { name: 'accessionNo', title: 'Accession No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'accountNo', title: 'Account No.' },
      { name: 'patientTag', title: 'Patient Tag' },
      { name: 'serviceName', title: 'Examination' },
      { name: 'radiographer', title: 'Technologist' },
      { name: 'visitDoctor', title: 'Visit Doctor' },
      { name: 'visitType', title: 'Visit Type' },
      { name: 'modality', title: 'Modality' },
    ]
    const examinationDetailsColsExtension = [
      {
        columnName: 'orderDate',
        type: 'date',
        sortingEnabled: false,
        width: 120,
      },
      { columnName: 'accessionNo', sortingEnabled: false, width: 120 },
      { columnName: 'patientName', sortingEnabled: false, width: 200 },
      { columnName: 'accountNo', sortingEnabled: false, width: 150 },
      { columnName: 'patientTag', sortingEnabled: false },
      { columnName: 'serviceName', sortingEnabled: false, width: 250 },
      { columnName: 'radiographer', sortingEnabled: false, width: 150 },
      { columnName: 'visitDoctor', sortingEnabled: false, width: 150 },
      { columnName: 'visitType', sortingEnabled: false, width: 150 },
      { columnName: 'modality', sortingEnabled: false, width: 150 },
    ]

    let FuncProps = {
      pager: false,
      summary: false,
    }
    return (
      <ReportDataGrid
        data={statisticDetailsData}
        columns={examinationDetailsCols}
        columnExtensions={examinationDetailsColsExtension}
        FuncProps={FuncProps}
      />
    )
  }
}
export default DetailsList
