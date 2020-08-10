import React from 'react'
import { CardContainer, CommonTableGrid } from '@/components'
import * as config from './config'

export const tableColumns = [
  { name: 'visitDate', title: 'Date' },
  // { name: 'code', title: 'Code' },
  { name: 'name', title: 'Name' },
  { name: 'dispensedQuanity', title: 'Qty.' },
  { name: 'dispenseUOM', title: 'UOM' },
  { name: 'totalPrice', title: 'Subtotal' },
  { name: 'adjAmt', title: 'Adj.' },
  { name: 'totalAfterItemAdjustment', title: 'Total' },
  { name: 'remarks', title: 'Remarks' },
]

export const TableColumnExtensions = [
  { columnName: 'visitDate', width: 105, type: 'date' },
  // { columnName: 'code', width: 120,  },
  { columnName: 'name', width: 250 },
  { columnName: 'remarks' },
  { columnName: 'dispensedQuanity', width: 80, type: 'number' },
  { columnName: 'dispenseUOM', width: 90 },
  { columnName: 'totalPrice', width: 90, type: 'currency' },
  { columnName: 'adjAmt', width: 80, type: 'currency' },
  { columnName: 'totalAfterItemAdjustment', width: 90, type: 'currency' },
]

export default ({ classes, current, fieldName = '' }) => {
  return (
    <CardContainer hideHeader size='sm' style={{ margin: 0 }}>
      <CommonTableGrid
        size='sm'
        rows={current.vaccination || []}
        columns={tableColumns}
        FuncProps={{ pager: false }}
        columnExtensions={TableColumnExtensions}
      />
    </CardContainer>
  )
}
