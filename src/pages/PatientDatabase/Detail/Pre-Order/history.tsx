import React, { useState, useRef } from 'react'
import moment from 'moment'
import { useIntl, Link } from 'umi'
import { Tabs } from '@/components'
import { VISIT_TYPE_NAME } from '@/utils/constants'
import { Tooltip, CommonTableGrid } from '@/components'
import { preOrderItemCategory } from '@/utils/codes'
interface IHistoryPreOrderProps {}

const HistoryPreOrder: React.FC<IHistoryPreOrderProps> = (props: any) => {
  const { schema, patientPreOrderItem, height } = props
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
      { name: 'apptDate', title: 'Appt. Date' },
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
        width: 130,
        options: () => preOrderItemCategory,
        isDisabled: () => true,
        render: row => {
          return (
            <Tooltip title={row.preOrderItemType}>
              <div>
                <span style={{ color: 'red', fontStyle: 'italic' }}>
                  <sup>
                    {row.isPreOrderItemActive === false
                      ? '#1'
                      : row.isPreOrderItemOrderable === false
                      ? '#2'
                      : row.isUOMChanged === true
                      ? '#3'
                      : ''}
                    &nbsp;
                  </sup>
                </span>

                <span>{row.preOrderItemType}</span>
              </div>
            </Tooltip>
          )
        },
      },
      {
        columnName: 'itemName',
        isDisabled: () => true,
        render: row => {
          return (
            <Tooltip
              title={
                <div>
                  {`Code: ${row.code}`}
                  <br />
                  {`Name: ${row.itemName}`}
                </div>
              }
            >
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
        width: 140,
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
        columnName: 'apptDate',
        width: 140,
        type: 'date',
        sortingEnabled: false,
        render: row => {
          return row.apptDate
            ? `${moment(row.apptDate).format('DD MMM YYYY')} ${moment(
                row.apptStartTime,
                'HH:mm',
              ).format('HH:mm')}`
            : '-'
        },
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
        width: 140,
        render: row => {
          return (
            <span>
              {moment(row.actualizedDate).format('DD MMM YYYY HH:mm')}
            </span>
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
      sortConfig: {
        defaultSorting: [{ columnName: 'actualizedDate', direction: 'desc' }],
      },
    },
  }

  return (
    <>
      <div style={{ maxHeight: height - 250, overflowY: 'auto' }}>
        <CommonTableGrid
          rows={getFilteredRows(list)}
          schema={schema}
          EditingProps={{
            showCommandColumn: false,
          }}
          {...tableParas}
        />
      </div>

      <div style={{ position: 'fixed', bottom: 100, width: '100%' }}>
        <span>
          Note:&nbsp;
          <span style={{ color: 'red', fontStyle: 'italic' }}>
            <sup>#1&nbsp;</sup>
          </span>
          Inactive item &nbsp;&nbsp;
          <span style={{ color: 'red', fontStyle: 'italic' }}>
            <sup>#2&nbsp;</sup>
          </span>
          Non-orderable item&nbsp;&nbsp;
          <span style={{ color: 'red', fontStyle: 'italic' }}>
            <sup>#3&nbsp;</sup>
          </span>
          Dispense/prescribe UOM changed&nbsp;&nbsp;
        </span>
      </div>
    </>
  )
}

export default HistoryPreOrder
