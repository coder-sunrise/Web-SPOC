import React, { useState, useRef } from 'react'
import moment from 'moment'
import { useIntl, Link } from 'umi'
import { Tabs } from '@/components'
import { VISIT_TYPE_NAME } from '@/utils/constants'
import { Tooltip, CommonTableGrid } from '@/components'
import { preOrderItemCategory } from '@/utils/codes'
interface IHistoryPreOrderProps {}

const HistoryPreOrder: React.FC<IHistoryPreOrderProps> = (props: any) => {
  const { schema, patientPreOrderItem } = props
  const { list } = patientPreOrderItem

  const getFilteredRows = (rows: any) => {
    return rows.filter(
      (c: { preOrderItemStatus: string }) =>
        c.preOrderItemStatus === 'Actualized',
    )
  }

  const tableParas = {
    columns: [
      { name: 'preOrderItemType', title: 'Type' },
      { name: 'itemName', title: 'Name' },
      { name: 'quantity', title: 'Order Qty.' },
      { name: 'orderByUser', title: 'Order By' },
      { name: 'orderDate', title: 'Order Date' },
      { name: 'remarks', title: 'Remarks' },
      { name: 'amount', title: 'Amount' },
      { name: 'actualizedQuantity', title: 'Actualized Qty.' },
      { name: 'actualizedByUser', title: 'Actualized By' },
      { name: 'actualizedDate', title: 'Actualized Date' },
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
        render: row => {
          return (
            <Tooltip title={row.preOrderItemType}>
              <div>{row.preOrderItemType}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'itemName',
        isDisabled: () => true,
        render: row => {
          return (
            <Tooltip title={row.itemName}>
              <div>{row.itemName}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'quantity',
        type: 'number',
        precision: 1,
        width: 100,
        render: row => {
          return (
            <Tooltip
              title={
                <span>
                  {row.quantity.toFixed(1)} {row.dispenseUOM}
                </span>
              }
            >
              <span>
                {row.quantity.toFixed(1)} {row.dispenseUOM}
              </span>
            </Tooltip>
          )
        },
        isDisabled: () => true,
      },
      {
        columnName: 'orderByUser',
        width: 150,
        type: 'text',
        isDisabled: () => true,
        render: row => {
          return (
            <Tooltip title={row.orderByUser}>
              <div>{row.orderByUser}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'orderDate',
        type: 'date',
        width: 150,
        render: row => {
          return (
            <span>{moment(row.orderDate).format('DD MMM YYYY HH:mm')}</span>
          )
        },
        isDisabled: () => true,
      },
      {
        columnName: 'remarks',
        maxLength: 100,
        sortingEnabled: false,
        isDisabled: () => true,
        render: row => {
          return (
            <Tooltip title={row.remarks}>
              <div>{row.remarks}</div>
            </Tooltip>
          )
        },
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
        precision: 1,
        width: 120,
        sortingEnabled: false,
        render: row => {
          return (
            <Tooltip
              title={
                <span>
                  {row.actualizedQuantity.toFixed(1)} {row.dispenseUOM}
                </span>
              }
            >
              <span>
                {row.actualizedQuantity.toFixed(1)} {row.dispenseUOM}
              </span>
            </Tooltip>
          )
        },
        isDisabled: () => true,
      },
      {
        columnName: 'actualizedByUser',
        type: 'text',
        isDisabled: () => true,
        render: row => {
          return (
            <Tooltip title={row.actualizedByUser ? row.actualizedByUser : '-'}>
              <div>{row.actualizedByUser ? row.actualizedByUser : '-'}</div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'actualizedDate',
        type: 'date',
        render: row => {
          return (
            <span>{moment(row.orderDate).format('DD MMM YYYY HH:mm')}</span>
          )
        },
        isDisabled: () => true,
      },
    ],
    FuncProps: {
      pager: true,
      pagerDefaultState: {
        pagesize: 100,
      },
    },
  }

  return (
    <>
      <CommonTableGrid
        rows={getFilteredRows(list)}
        schema={schema}
        EditingProps={{
          showCommandColumn: false,
        }}
        {...tableParas}
      />
    </>
  )
}

export default HistoryPreOrder
