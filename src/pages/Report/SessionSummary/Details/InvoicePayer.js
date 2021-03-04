import React from 'react'
import { IntegratedSummary } from '@devexpress/dx-react-grid'
import { ReportDataGrid } from '@/components/_medisys'

const InvoicePayer = ({ reportDatas }) => {
  if (!reportDatas) return null
  let listData = []
  const { CompanyDetails } = reportDatas
  if (CompanyDetails) {
    listData = CompanyDetails.map((item, index) => ({
      ...item,
      id: `${item.coPayer}-${index}`,
    }))
  }

  const InvoicePayerTableColumn = [
    { name: 'companyName', title: 'Co-Payer' },
    { name: 'totalCompanyAmount', title: 'Co-Payer Payable' },
  ]

  const InvoicePayerTableColumnExtension = [
    { columnName: 'companyName', sortingEnabled: false },
    {
      columnName: 'totalCompanyAmount',
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
          { columnName: 'totalCompanyAmount', type: 'sum' },
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
