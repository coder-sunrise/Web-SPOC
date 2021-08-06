import React, { useState } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import _ from 'lodash'
import { qtyFormat } from '@/utils/config'
import { CommonTableGrid, Button, CardContainer } from '@/components'
import { queryList as queryAppointments } from '@/services/calendar'
import { InventoryTypes } from '@/utils/codes'

const SelectPreOrder = ({ activePreOrderItem = [], onSelectPreOrder, footer, mainDivHeight }) => {
  const [
    selectedPreOrders,
    setSelectedPreOrders,
  ] = useState([])
  let height = mainDivHeight - 200
  if (height < 300) height = 300

  const onConfirm = () => {
    if (onSelectPreOrder) {
      onSelectPreOrder([...activePreOrderItem.filter(po => selectedPreOrders.indexOf(po.id) >= 0)])
    }
  }

  const handleSelectionChange = (selection) => {
    setSelectedPreOrders(selection)
  }

  return <div>
    <CommonTableGrid
      size='sm'
      rows={_.orderBy(
        activePreOrderItem,
        [
          'orderDate',
        ],
        [
          'desc',
        ],
      )}
      forceRender
      FuncProps={{
        pager: false,
        selectable: true,
        selectConfig: {
          showSelectAll: true,
          rowSelectionEnabled: (row) => row.preOrderItemStatus === 'New',
        },
      }}
      TableProps={{
        height,
      }}
      selection={selectedPreOrders}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      columns={[
        { name: 'preOrderItemType', title: 'Type' },
        { name: 'itemName', title: 'Name' },
        { name: 'quantity', title: 'Order Qty.' },
        { name: 'orderByUser', title: 'Order By' },
        { name: 'orderDate', title: 'Order Date' },
        { name: 'remarks', title: 'Remarks' },
        { name: 'amount', title: 'Amount' },
        { name: 'hasPaid', title: 'Paid' },
        { name: 'preOrderItemStatus', title: 'Status' },
      ]}
      columnExtensions={[
        {
          columnName: 'preOrderItemType', sortingEnabled: false, width: 120,
        },
        { columnName: 'itemName', sortingEnabled: false },
        {
          columnName: 'quantity', sortingEnabled: false, width: 120, render: row => {
            const { quantity, dispenseUOM = '' } = row
            return `${numeral(quantity).format(
              qtyFormat,
            )} ${dispenseUOM}`
          },
        },
        { columnName: 'orderByUser', sortingEnabled: false },
        { columnName: 'orderDate', sortingEnabled: false, type: 'date', width: 140, render: (row) => <span>{moment(row.orderDate).format('DD MMM YYYY HH:mm')}</span> },
        { columnName: 'remarks', sortingEnabled: false },
        { columnName: 'amount', sortingEnabled: false, type: 'currency', width: 90 },
        { columnName: 'hasPaid', sortingEnabled: false, width: 50, render: (row) => row.hasPaid ? 'Yes' : 'No' },
        { columnName: 'preOrderItemStatus', sortingEnabled: false, width: 100 },
      ]}
    />
    {footer &&
      footer({
        onConfirm: onConfirm,
        confirmBtnText: 'Actualize',
        confirmProps: {
          disabled: !selectedPreOrders.length,
        },
      })}
  </div>
}

export default SelectPreOrder