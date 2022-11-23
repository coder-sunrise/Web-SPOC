import React, { PureComponent } from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'

import { ReportDataGrid } from '@/components/_medisys'

class IncomeList extends PureComponent {
  render () {
    let incomeData = []
    const { reportDatas } = this.props
    if (!reportDatas) return null
    if (reportDatas && reportDatas.IncomeGstDetails) {
      incomeData = reportDatas.IncomeGstDetails.map((item, index) => ({
        ...item,
        id: `gst-${index}-${item.invoiceNo}`,
      }))
    }

    const InComeGstDetailsCols = [
      { name: 'incomeDate', title: 'Date' },
      { name: 'invoiceNo', title: 'Invoice No.' },
      { name: 'patientName', title: 'Patient Name' },
      { name: 'incomeAmount', title: 'Invoice Amount' },
      { name: 'incomeGst', title: 'Gst' },
      { name: 'incomeTotal', title: 'Final Amount' },
    ]
    const InComeGstDetailsExtensions = [
      {
        columnName: 'incomeDate',
        type: 'date',
        sortingEnabled: false,
        width: 120,
      },
      {
        columnName: 'incomeAmount',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 180,
      },
      {
        columnName: 'incomeGst',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 180,
      },
      {
        columnName: 'incomeTotal',
        type: 'currency',
        currency: true,
        sortingEnabled: false,
        width: 180,
      },
      { columnName: 'invoiceNo', sortingEnabled: false, width: 200 },
      { columnName: 'patientName', sortingEnabled: false },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'incomeAmount', type: 'grandTotal' },
            { columnName: 'incomeGst', type: 'grandTotal' },
            { columnName: 'incomeTotal', type: 'grandTotal' },
          ],
          groupItems: [
            { columnName: 'incomeAmount', type: 'sum' },
            { columnName: 'incomeGst', type: 'sum' },
            { columnName: 'incomeTotal', type: 'sum' },
          ],
        },
        integrated: {
          calculator: (type, rows, getValue) => {
            if (type === 'grandTotal')
              return IntegratedSummary.defaultCalculator('sum', rows, getValue)
            return IntegratedSummary.defaultCalculator(type, rows, getValue)
          },
        },
        row: {
          messages: {
            sum: 'Total',
            grandTotal: 'Total',
          },
        },
      },
    }

    let InComeGstDetails = InComeGstDetailsCols
    if (reportDatas && !!reportDatas.GstDetails[0].isDoctorGroup) {
      FuncProps = {
        ...FuncProps,
        grouping: true,
        groupingConfig: {
          state: {
            grouping: [
              { columnName: 'doctorName' },
            ],
          },
        },
      }
      InComeGstDetails = [
        { name: 'doctorName', title: 'Optometrist Name' },
        ...InComeGstDetailsCols,
      ]
    }
    return (
      <ReportDataGrid
        data={incomeData}
        columns={InComeGstDetails}
        columnExtensions={InComeGstDetailsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default IncomeList
