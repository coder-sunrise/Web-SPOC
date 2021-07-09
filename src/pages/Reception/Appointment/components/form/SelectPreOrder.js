import React, { useState } from 'react'
import numeral from 'numeral'
import { qtyFormat } from '@/utils/config'
import { CommonTableGrid, Button, CardContainer } from '@/components'
import { queryList as queryAppointments } from '@/services/calendar'

const SelectPreOrder = ({ activePreOrderItem = [], onSelectPreOrder, footer, mainDivHeight }) => {
  console.log('activePreOrderItem', activePreOrderItem)
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
      rows={activePreOrderItem}
      forceRender
      FuncProps={{
        pager: false,
        selectable: true,
        selectConfig: {
          showSelectAll: true,
          rowSelectionEnabled: (row) => true,
        },
      }}
      TableProps={{
        height,
      }}
      selection={selectedPreOrders}
      onSelectionChange={handleSelectionChange}
      getRowId={(row) => row.id}
      columns={[
        { name: 'category', title: 'Category' },
        { name: 'itemName', title: 'Name' },
        { name: 'quantity', title: 'Quantity' },
        { name: 'orderBy', title: 'Order By' },
        { name: 'orderDate', title: 'Order Date & Time' },
        { name: 'remarks', title: 'Remarks' },
        { name: 'amount', title: 'Amount' },
        { name: 'hasPaid', title: 'Paid' },
      ]}
      columnExtensions={[
        { columnName: 'category', sortingEnabled: false, width: 120 },
        { columnName: 'itemName', sortingEnabled: false },
        {
          columnName: 'quantity', sortingEnabled: false, width: 120, render: row => {
            const { quantity, dispenseUOM = '' } = row
            return `${numeral(quantity).format(
              qtyFormat,
            )} ${dispenseUOM}`
          },
        },
        { columnName: 'orderBy', sortingEnabled: false },
        { columnName: 'orderDate', sortingEnabled: false, type: 'date', showTime: true, width: 180 },
        { columnName: 'remarks', sortingEnabled: false },
        { columnName: 'amount', sortingEnabled: false, type: 'currency', width: 90 },
        { columnName: 'hasPaid', sortingEnabled: false, width: 50, render: (row) => row.hasPaid ? 'Yes' : 'No' },
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