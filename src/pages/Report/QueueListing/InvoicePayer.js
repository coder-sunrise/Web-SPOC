import React from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

const InvoicePayer = ({ reportDatas }) => {
  if (!reportDatas) return null
  let listData = []
  const { InvoicePayerDetail } = reportDatas
  if (InvoicePayerDetail) {
    listData = InvoicePayerDetail.map((item, index) => ({
      ...item,
      id: `${item.coPayer}-${index}`,
    }))
  }

  const InvoicePayerTableColumn = [
    { name: 'coPayer', title: 'Co-Payer' },
    { name: 'coPayerPayable', title: 'Co-Payer Payable' },
  ]

  const InvoicePayerTableColumnExtension = [
    { columnName: 'coPayer', sortingEnabled: false },
    {
      columnName: 'coPayerPayable',
      type: 'currency',
      currency: true,
      sortingEnabled: false,
    },
  ]

  const FuncProps = {
    pager: false,
    summary: true,
    summaryConfig: {
      state: {
        totalItems: [
          { columnName: 'coPayerPayable', type: 'sum' },
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
      noHeight
      data={listData}
      columns={InvoicePayerTableColumn}
      columnExtensions={InvoicePayerTableColumnExtension}
      FuncProps={FuncProps}
    />
  )
}

export default InvoicePayer
