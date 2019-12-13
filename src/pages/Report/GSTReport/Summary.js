import React from 'react'
// common components
import { ReportDataGrid } from '@/components/_medisys'

const Summary = ({ reportDatas }) => {
  if (!reportDatas) return null

  const {
    SumExpenditureGstDetails: [
      SumExpenditureGstDetail,
    ],
    SumIncomeGstDetails: [
      SumIncomeGstDetail,
    ],
    GstDetails: [
      GstDetail,
    ],
  } = reportDatas
  const sumData = [
    {
      id: '0',
      name: 'Total Income:',
      value: SumIncomeGstDetail.sumIncomeAmount,
    },
    {
      id: '1',
      name: 'Total Output Tax:',
      value: SumIncomeGstDetail.sumIncomeGst,
    },
    {
      id: '2',
      name: 'Total Expenditure:',
      value: SumExpenditureGstDetail.sumExpenditureAmount,
    },
    {
      id: '3',
      name: 'Total Input Tax:',
      value: SumExpenditureGstDetail.sumExpenditureAmount,
    },
    {
      id: '4',
      name: 'Total Output Tax - Total Input Tax:',
      value: GstDetail.totalTax,
    },
  ]

  const sumExtensions = [
    { columnName: 'name', sortingEnabled: false, width: 300 },
    {
      columnName: 'value',
      sortingEnabled: false,
      width: 200,
      align: 'right',
      type: 'currency',
    },
  ]
  const sumCols = [
    { name: 'name', title: 'Name' },
    { name: 'value', title: 'Value' },
  ]
  return (
    <ReportDataGrid
      style={{ width: 500, marginTop: 6 }}
      noHeight
      header={false}
      data={sumData}
      columns={sumCols}
      columnExtensions={sumExtensions}
      flexible
    />
  )
}

export default Summary
