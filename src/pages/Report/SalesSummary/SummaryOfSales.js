import React from 'react'
import {
  IntegratedSummary,
} from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'


const SummaryOfSales = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  let listData = []
  const { SummaryByDateDetails } = reportDatas
  if (SummaryByDateDetails) {
    listData = SummaryByDateDetails.map((item, index) => ({
      ...item,
      id: `SummaryByDateDetails-${index}-${item.categoryCode}`,
    }))
  }

  const SummaryByDateDetailsColumns = [
    { name: 'salesDate', title: 'Date' },
    { name: 'totalAmount', title: 'Total Amount' },
  ]
  const SummaryByDateDetailsColumnsExtensions = [
    { columnName: 'totalAmount', type: 'currency', currency: true },
  ]
  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [{ columnName: 'totalAmount', type: 'sum' }],
      },
      integrated: {
        calculator: IntegratedSummary.defaultCalculator,
      },
      row: {
        messages: {
          sum: 'Grand Total',
        },
      },
    },
  }
  return (
    <ReportDataGrid
      height={500}
      data={listData}
      columns={SummaryByDateDetailsColumns}
      columnExtensions={SummaryByDateDetailsColumnsExtensions}
      FuncProps={FuncProps}
    />
  )
}

export default SummaryOfSales
