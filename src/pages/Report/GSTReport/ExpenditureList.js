import React, { PureComponent } from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'

import { ReportDataGrid } from '@/components/_medisys'

class ExpenditureList extends PureComponent {

  handleExpandedGroupsChange = (expandedGroups) => {
    this.setState((prevState) => {
      return { ...prevState, tableGroupRows: expandedGroups }
    })
  }

  render () {
    let incomeData = []
    const { reportDatas } = this.props
    if (!reportDatas)
      return null
    if (reportDatas && reportDatas.ExpenditureGstDetails) {
      incomeData = reportDatas.ExpenditureGstDetails.map(
        (item, index) => ({
          ...item,
          id: `expenditure-${index}-${item.invoiceNo}`,
        }),
      )
    }

    const ExpenditureGstDetailsCols = [
      { name: 'expenditureDate', title: 'Date' },
      { name: 'expenditureDescription', title: 'Description' },
      { name: 'expenditureName', title: 'Name' },
      { name: 'expenditureAmount', title: 'Amount' },
      { name: 'expenditureGst', title: 'GST' },
      { name: 'expenditureTotal', title: 'Final Amount' },
    ]
    const ExpenditureGstDetailsExtensions = [
      { columnName: 'expenditureDate', type: 'date' },
      { columnName: 'expenditureAmount', type: 'currency', currency: true },
      { columnName: 'expenditureGst', type: 'currency', currency: true },
      { columnName: 'expenditureTotal', type: 'currency', currency: true },
    ]

    let FuncProps = {
      pager: false,
      summary: true,
      summaryConfig: {
        state: {
          totalItems: [
            { columnName: 'expenditureAmount', type: 'sum' },
            { columnName: 'expenditureGst', type: 'sum' },
            { columnName: 'expenditureTotal', type: 'sum' },
          ],
        },
        integrated: {
          calculator: IntegratedSummary.defaultCalculator,
        },
        row: {
          messages: {
            sum: 'Total',
          },
        },
      },
    }
    return (
      <ReportDataGrid
        height={500}
        data={incomeData}
        columns={ExpenditureGstDetailsCols}
        columnExtensions={ExpenditureGstDetailsExtensions}
        FuncProps={FuncProps}
      />
    )
  }
}
export default ExpenditureList
