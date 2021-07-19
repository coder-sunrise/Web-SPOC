
import React, { useState, useRef } from 'react'
import { useIntl, Link } from 'umi'
import { Tabs } from '@/components'
import { VISIT_TYPE_NAME } from '@/utils/constants'
import {
  FastEditableTableGrid,
  Tooltip,
} from '@/components'
import { preOrderItemCategory } from '@/utils/codes'
interface IHistoryPreOrderProps {

}

const HistoryPreOrder: React.FC<IHistoryPreOrderProps> = (props :any) => {
  const {schema,patientPreOrderItem } = props
  const {list} = patientPreOrderItem

  const getFilteredRows = (rows : any) => {
    return rows.filter((c: { preOrderItemStatus: string }) => c.preOrderItemStatus === 'Actualized')
  }

  const tableParas = {
    columns: [
      { name: 'preOrderItemType', title: 'Type' },
      { name: 'itemName', title: 'Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'orderByUser', title: 'Order By' },
      { name: 'orderDate', title: 'Order Time' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'amount', title: 'Amount' },
      { name: 'actualizedByUser', title: 'Actualized By'},
      { name: 'actualizedDate', title: 'Actualized Date'},
    ],
    columnExtensions: [
      {
        columnName: 'preOrderItemType',
        type: 'select',
        labelField: 'name',
        valueField: 'value',
        width: 180,
        options: () => preOrderItemCategory,
        isDisabled: () => true,
      },
      {
        columnName: 'itemName',
        isDisabled: () => true,
      },
      {
        columnName: 'quantity',
        type: 'number',
        precision: 2,
        width: 100,
        isDisabled: () => true,
      },
      {
        columnName: 'orderByUser',
        width: 150,
        type: 'text',
        isDisabled: () => true,
      },
      {
        columnName: 'orderDate',
        type: 'date',
        width: 100,
        isDisabled: () => true,
      },
      {
        columnName: 'remarks',
        maxLength: 100,
        sortingEnabled: false,
        isDisabled: () => true,
      },
      {
        columnName: 'amount',
        width: 100,
        type: 'currency',
        isDisabled: () => true,
      },
      {
        columnName: 'actualizedByUser',
        type: 'text',
        isDisabled: () => true,
        render: (row) => {
          return row.actualizedByUser ? row.actualizedByUser : '-'
        },
      },
      {
        columnName: 'actualizedDate',
        type: 'date',
        isDisabled: () => true,
      },
    ],
  }

  return <>
  <FastEditableTableGrid
    rows={getFilteredRows(list)}
    schema={schema}
    EditingProps={{
      showCommandColumn: false,
    }}
    {...tableParas}
  />
</>
}

export default HistoryPreOrder