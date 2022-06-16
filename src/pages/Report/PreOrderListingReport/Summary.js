import React from 'react'
import numeral from 'numeral'
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
        const displayQty = `${numeral(row.total).format('0.0')} ${row.uom ||
          ''}`
        return (
          <Tooltip title={displayQty}>
            <span>{displayQty}</span>
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
