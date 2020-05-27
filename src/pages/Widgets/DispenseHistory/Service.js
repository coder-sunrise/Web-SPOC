import React from 'react'
import { CardContainer, CommonTableGrid } from '@/components'
 
import * as config from './config'

export const tableColumns = [
  { name: 'visitDate', title: 'Date' },
  { name: 'code', title: 'Code' },
  { name: 'description', title: 'Name' },
  { name: 'serviceCenter', title: 'Service Center' },
  { name: 'remarks', title: 'Remarks' },
  { name: 'totalPrice', title: 'Subtotal' },
  { name: 'adjAmt', title: 'Adjustment' },
  { name: 'totalAfterItemAdjustment', title: 'Total' },
]

export const TableColumnExtensions =
  [
    { columnName: 'visitDate', type: 'date' },
    { columnName: 'code', compare: config.compareString },
    { columnName: 'description', compare: config.compareString },
    { columnName: 'serviceCenter', compare: config.compareString },
    { columnName: 'remarks', compare: config.compareString },
    { columnName: 'totalPrice', type: 'currency' },
    { columnName: 'adjAmt', type: 'currency' },
    { columnName: 'totalAfterItemAdjustment', type: 'currency' },
  ]

export default ({ classes, current, fieldName = '' }) => {

  return (
    <CardContainer
      hideHeader
      size='sm'
      style={{ margin: 0 }}
    >
      <CommonTableGrid
        size='sm'
        rows={current.service || []}
        columns={tableColumns}
        FuncProps={{ pager: false }}
        columnExtensions={TableColumnExtensions}
      />
    </CardContainer>
  )
}
