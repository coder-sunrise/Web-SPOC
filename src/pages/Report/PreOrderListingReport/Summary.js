import React from 'react'
// common components
import { ReportDataGrid } from '@/components/_medisys'
import { Tooltip } from '@/components'

const Summary = ({ reportDatas }) => {
  if (!reportDatas) return null

  const { PreOrderListingSummary = [] } = reportDatas

  const sumCols = [
    { name: 'type', title: 'Type' },
    { name: 'itemName', title: 'Item Name' },
    { name: 'total', title: 'Total Order Qty.' },
  ]
  const sumExtensions = [
    { columnName: 'type', sortingEnabled: false, width: 200 },
    {
      columnName: 'itemName',
      sortingEnabled: false,
      width: 250,
    },
    {
      columnName: 'total',
      sortingEnabled: false,
      width: 150,
      align: 'right',
      render: row => {
        return (
          <Tooltip title={`${row.total}.0 ${row.uom || ''}`}>
            <span>{`${row.total}.0 ${row.uom || ''}`}</span>
          </Tooltip>
        )
      },
    },
  ]
  return (
    <ReportDataGrid
      style={{ width: 603 }}
      noHeight
      data={PreOrderListingSummary}
      columns={sumCols}
      columnExtensions={sumExtensions}
      flexible
    />
  )
}

export default Summary
