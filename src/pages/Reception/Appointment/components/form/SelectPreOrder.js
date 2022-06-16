import React, { useState } from 'react'
import numeral from 'numeral'
import moment from 'moment'
import _ from 'lodash'
import { qtyFormat } from '@/utils/config'
import { CommonTableGrid, Button, CardContainer, Tooltip } from '@/components'
import { queryList as queryAppointments } from '@/services/calendar'
import { InventoryTypes } from '@/utils/codes'
import { showCurrency } from '@/utils/utils'

const SelectPreOrder = ({
  activePreOrderItem = [],
  onSelectPreOrder,
  footer,
  mainDivHeight,
  disabled,
  actualizePreOrderAccessRight,
  isRetail,
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
            rowSelectionEnabled: row =>
              (isRetail === true &&
                row.preOrderItemStatus === 'New' &&
                row.isPreOrderItemActive === true &&
                row.isPreOrderItemOrderable === true &&
                row.isUOMChanged === false &&
                (row.preOrderItemType === 'Medication' ||
                  row.preOrderItemType === 'Consumable' ||
                  row.preOrderItemType === 'Service')) ||
              ((isRetail === false || !isRetail) &&
                row.preOrderItemStatus === 'New' &&
                row.isPreOrderItemActive === true &&
                row.isPreOrderItemOrderable === true &&
                row.isUOMChanged === false),
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
          { name: 'apptDate', title: 'Appt. Date' },
          { name: 'amount', title: 'Total' },
          { name: 'hasPaid', title: 'Paid' },
          { name: 'preOrderItemStatus', title: 'Status' },
        ]}
        columnExtensions={[
          {
            columnName: 'preOrderItemType',
            sortingEnabled: false,
            width: 120,
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
          {
            columnName: 'displayQty',
            type: 'number',
            precision: 1,
            sortingEnabled: false,
            width: 120,
            render: row => {
              const displayQty = `${numeral(row.quantity).format(
                '0.0',
              )} ${row.dispenseUOM || ''}`
              return (
                <Tooltip title={displayQty}>
                  <span>{displayQty}</span>
                </Tooltip>
              )
            },
          },
          { columnName: 'orderByUser', sortingEnabled: false },
          { columnName: 'orderDateDisplay', sortingEnabled: false, width: 140 },
          { columnName: 'remarks', sortingEnabled: false },
          {
            columnName: 'apptDate',
            width: 150,
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
            columnName: 'amount',
            width: 80,
            type: 'currency',
            sortingEnabled: false,
            isDisabled: () => true,
            render: row => {
              return row.hasPaid === 'Yes' ? showCurrency(row.amount) : '-'
            },
          },
          { columnName: 'hasPaid', sortingEnabled: false, width: 50 },
          {
            columnName: 'preOrderItemStatus',
            sortingEnabled: false,
            width: 100,
          },
        ]}
      />
      <div style={{ paddingTop: '10px', paddingBottom: '10px' }}>
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
      {footer &&
        footer({
          onConfirm:
            actualizePreOrderAccessRight.rights === 'enable' && !disabled
              ? onConfirm
              : null,
          confirmBtnText: 'Actualize',
          confirmProps: {
            disabled: !selectedPreOrders.length || disabled,
          },
        })}
    </div>
  )
}

export default SelectPreOrder
