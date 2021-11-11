import React from 'react'
// common components
import { ReportDataGrid } from '@/components/_medisys'

const Summary = ({ reportDatas }) => {
  if (!reportDatas) return null

  const { RadiologyStatisticSummary = [] } = reportDatas

  const sumData = RadiologyStatisticSummary
  const sumCols = [
    { name: 'visitType', title: 'Visit Type' },
    { name: 'serviceName', title: 'Examinations' },
    { name: 'total', title: 'Total' },
  ]
  const sumExtensions = [
    { columnName: 'visitType', sortingEnabled: false, width: 200 },
    {
      columnName: 'serviceName',
      sortingEnabled: false,
      width: 250,
    },
    {
      columnName: 'total',
      sortingEnabled: false,
      width: 150,
      align: 'right',
    },
  ]
  return (
    <ReportDataGrid
      style={{ width: 603 }}
      noHeight
      data={RadiologyStatisticSummary}
      columns={sumCols}
      columnExtensions={sumExtensions}
      flexible
    />
  )
}

export default Summary
