import React from 'react'
import { CardContainer, CommonTableGrid } from '@/components'
import * as config from './config'

export const tableColumns = [
  {name:'visitDate', title:'Date'},
  {name:'code', title:'Code'},
  {name:'description', title:'Name'},
  {name:'category', title:'Category'},
  {name:'remarks', title:'Remarks'},
  {name:'totalPrice', title:'Subtotal'},
  {name:'adjAmt', title:'Adjustment'},
  {name:'totalAfterItemAdjustment', title:'Total'},
]

export const TableColumnExtensions =
  [
    { columnName: 'code', compare: config.compareString },
    { columnName: 'category', compare: config.compareString },
    { columnName: 'description', compare: config.compareString },
    { columnName: 'remarks', compare: config.compareString }, 
    { columnName: 'visitDate', type: 'date' },
    { columnName: 'totalPrice', type: 'currency'},
    { columnName: 'adjAmt', type: 'currency'},
    { columnName: 'totalAfterItemAdjustment', type: 'currency'},
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
        rows={current.treatment||[]}
        columns={tableColumns}
        FuncProps={{ pager: false }}
        columnExtensions={TableColumnExtensions}
      />
    </CardContainer>
  )
}
