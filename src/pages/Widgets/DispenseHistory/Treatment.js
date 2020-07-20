import React from 'react'
import { CardContainer, CommonTableGrid } from '@/components'
import * as config from './config'

export const tableColumns = [
  { name: 'visitDate', title: 'Date' },
  // {name:'code', title:'Code'},
  { name: 'description', title: 'Name' },
  { name: 'category', title: 'Category' },
  { name: 'remarks', title: 'Remarks' },
  { name: 'totalPrice', title: 'Subtotal' },
  { name: 'adjAmt', title: 'Adj.' },
  { name: 'totalAfterItemAdjustment', title: 'Total' },
]

export const TableColumnExtensions = [
  { columnName: 'visitDate', width: 105, type: 'date' },
  // { columnName: 'code', compare: config.compareString },
  { columnName: 'category', width: 120 },
  { columnName: 'description', width: 250 },
  { columnName: 'remarks' },
  { columnName: 'totalPrice', width: 90, type: 'currency' },
  { columnName: 'adjAmt', width: 80, type: 'currency' },
  { columnName: 'totalAfterItemAdjustment', width: 90, type: 'currency' },
]

export default ({ classes, current, fieldName = '' }) => {
  return (
    <CardContainer hideHeader size='sm' style={{ margin: 0 }}>
      <CommonTableGrid
        size='sm'
        rows={current.treatment || []}
        columns={tableColumns}
        FuncProps={{ pager: false }}
        columnExtensions={TableColumnExtensions}
      />
    </CardContainer>
  )
}
