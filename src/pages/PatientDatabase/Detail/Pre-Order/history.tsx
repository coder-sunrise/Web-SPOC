
import React, { useState, useRef } from 'react'
import moment from 'moment'
import { useIntl, Link } from 'umi'
import { Tabs } from '@/components'
import { VISIT_TYPE_NAME } from '@/utils/constants'
import {
  Tooltip,
  CommonTableGrid, 
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
      { name: 'orderByUser', title: 'Order By' },
      { name: 'orderDate', title: 'Order Date' },
      { name: 'quantity', title: 'Order Qty.' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'amount', title: 'Amount' },
      { name: 'actualizedByUser', title: 'Actualized By'},
      { name: 'actualizedDate', title: 'Actualized Date'},
      { name: 'actualizedQuantity', title: 'Actualized Qty.' },

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
        precision: 1,
        width: 100,
        render: (row) => {
          return <span>{row.quantity} {row.dispenseUOM}</span>
        },
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
        width: 150,
        render: (row) => {
          return <span>{moment(row.orderDate).format('DD MMM YYYY HH:mm')}</span>
        },
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
        columnName: 'actualizedQuantity',
        type: 'number',
        precision: 2,
        width: 120,
        render: (row) => {
          return <span>{row.actualizedQuantity} {row.dispenseUOM}</span>
        },
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
        render: (row) => {
          return <span>{moment(row.orderDate).format('DD MMM YYYY HH:mm')}</span>
        },
        isDisabled: () => true,
      },
    ],
  }

  return <>
  <CommonTableGrid
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