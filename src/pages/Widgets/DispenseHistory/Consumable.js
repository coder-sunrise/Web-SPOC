import React from 'react'
import { CardContainer, CommonTableGrid } from '@/components'

export const tableColumns = [
  {name:'visitDate', title:'Date'},
  {name:'code', title:'Code'},
  {name:'description', title:'Name'},
  {name:'remarks', title:'Remarks'},
  {name:'quantity', title:'Qty'},
  {name:'totalPrice', title:'Subtotal'},
  {name:'adjAmt', title:'Adjustment'},
  {name:'totalAfterItemAdjustment', title:'Total'},
]

export const TableColumnExtensions =
  [
    { columnName: 'visitDate', type: 'date' },
    { columnName: 'totalPrice', type: 'currency'},
    { columnName: 'adjAmt', type: 'currency'},
    { columnName: 'totalAfterItemAdjustment', type: 'currency'},
    { columnName: 'quantity', type: 'number'},
  ]

export default ({ classes, current, fieldName = '' }) => {

  return (
    <CardContainer
      hideHeader
      size='sm'
      style={{margin:0}}
    >
      <CommonTableGrid
        size='sm'
        rows={current.consumable||[]}
        columns={tableColumns}
        FuncProps={{ pager: false }}
        columnExtensions={TableColumnExtensions}
      />
    </CardContainer>
  )
}