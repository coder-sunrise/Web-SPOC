import React, { useState } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import _ from 'lodash'
import { qtyFormat } from '@/utils/config'
import { CommonTableGrid, Button, CardContainer, Tooltip } from '@/components'
import { queryList as queryAppointments } from '@/services/calendar'
import { InventoryTypes } from '@/utils/codes'

const SelectPreOrder = ({
  activePreOrderItem = [],
  onSelectPreOrder,
  footer,
  mainDivHeight,
  disabled,
  actualizePreOrderAccessRight,
}) => {
  const [selectedPreOrders, setSelectedPreOrders] = useState([])
  let height = mainDivHeight - 200
  if (height < 300) height = 300

  const onConfirm = () => {
    if (onSelectPreOrder) {
      onSelectPreOrder([
        ...activePreOrderItem.filter(
          po => selectedPreOrders.indexOf(po.id) >= 0,
        ),
      ])
    }
  }

  const handleSelectionChange = selection => {
    setSelectedPreOrders(selection)
  }

  return (
    <div>
      <CommonTableGrid
        size='sm'
        rows={_.orderBy(
          activePreOrderItem.map(row => {
            const { quantity, dispenseUOM = '' } = row
            const displayQty = `${numeral(quantity).format(
              qtyFormat,
            )} ${dispenseUOM}`
            return {
              ...row,
              orderDateDisplay: moment(row.orderDate).format(
                'DD MMM YYYY HH:mm',
              ),
              displayQty,
              hasPaid: row.hasPaid ? 'Yes' : 'No',
            }
          }),
          ['orderDate'],
          ['desc'],
        )}
        forceRender
        FuncProps={{
          pager: false,
          selectable: !disabled,
          selectConfig: {
            showSelectAll: true,
            rowSelectionEnabled: row => row.preOrderItemStatus === 'New',
          },
        }}
        TableProps={{
          height,
        }}
        selection={selectedPreOrders}
        onSelectionChange={handleSelectionChange}
        getRowId={row => row.id}
        columns={[
          { name: 'preOrderItemType', title: 'Type' },
          { name: 'itemName', title: 'Name' },
          { name: 'displayQty', title: 'Order Qty.' },
          { name: 'orderByUser', title: 'Order By' },
          { name: 'orderDateDisplay', title: 'Order Date' },
          { name: 'remarks', title: 'Remarks' },
          { name: 'amount', title: 'Amount' },
          { name: 'hasPaid', title: 'Paid' },
          { name: 'preOrderItemStatus', title: 'Status' },
        ]}
        columnExtensions={[
          { columnName: 'preOrderItemType', sortingEnabled: false, width: 120 },
          {
            columnName: 'itemName',
            sortingEnabled: false,
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
          { columnName: 'displayQty', sortingEnabled: false, width: 120 },
          { columnName: 'orderByUser', sortingEnabled: false },
          { columnName: 'orderDateDisplay', sortingEnabled: false, width: 140 },
          { columnName: 'remarks', sortingEnabled: false },
          {
            columnName: 'amount',
            sortingEnabled: false,
            type: 'currency',
            width: 90,
          },
          { columnName: 'hasPaid', sortingEnabled: false, width: 50 },
          {
            columnName: 'preOrderItemStatus',
            sortingEnabled: false,
            width: 100,
          },
        ]}
      />
      {footer &&
        footer({
          onConfirm:
            actualizePreOrderAccessRight.rights === 'enable' ? onConfirm : null,
          confirmBtnText: 'Actualize',
          confirmProps: {
            disabled: !selectedPreOrders.length || disabled,
          },
        })}
    </div>
  )
}

export default SelectPreOrder
