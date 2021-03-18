import React from 'react'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { CommonTableGrid, Tooltip } from '@/components'
import {
  PURCHASE_ORDER_STATUS_TEXT,
  INVOICE_STATUS_TEXT,
} from '@/utils/constants'
import { ContextMenuOptions, PurchaseReceiveGridCol } from '../variables'

const enabledSelectPOStatus = [
  PURCHASE_ORDER_STATUS_TEXT.FINALIZED,
  PURCHASE_ORDER_STATUS_TEXT.PARTIALREVD,
  PURCHASE_ORDER_STATUS_TEXT.FULFILLED,
]

const PurchaseReceiveDataGrid = ({
  selectedRows,
  actions: {
    handleDuplicatePO,
    handleNavigate,
    handleOnSelectionChange,
    handlePrintPOReport,
  },
  height,
}) => {
  const onContextButtonClick = (row, id) => {
    switch (id) {
      case '0':
        handleNavigate('edit', row.id)
        break
      case '1':
        handleDuplicatePO(row.id)
        break
      case '2':
        handlePrintPOReport(row.id)
        break
      default:
        break
    }
  }

  return (
    <CommonTableGrid
      style={{ margin: 0 }}
      type='purchaseReceiveList'
      selection={selectedRows}
      forceRender
      onSelectionChange={handleOnSelectionChange}
      columns={PurchaseReceiveGridCol}
      onRowDoubleClick={(row) => handleNavigate('edit', row.id)}
      TableProps={{
        height,
      }}
      columnExtensions={[
        {
          columnName: 'invoiceStatus',
          sortBy: 'invoiceStatusFKNavigation.DisplayValue',
        },
        {
          columnName: 'supplier',
          sortBy: 'supplierFKNavigation.displayValue',
        },
        {
          columnName: 'purchaseOrderDate',
          type: 'date',
        },
        {
          columnName: 'exceptedDeliveryDate',
          type: 'date',
        },
        { columnName: 'totalAftGst', type: 'number', currency: true },
        {
          columnName: 'outstanding',
          type: 'number',
          currency: true,
          sortingEnabled: false,
        },
        {
          columnName: 'purchaseOrderStatus',
          sortBy: 'purchaseOrderStatusFKNavigation.displayValue',
        },
        {
          columnName: 'action',
          align: 'center',
          render: (row) => {
            return (
              <Tooltip title='More Actions'>
                <div style={{ display: 'inline-block' }}>
                  <GridButton
                    row={row}
                    onClick={onContextButtonClick}
                    contextMenuOptions={ContextMenuOptions(row)}
                  />
                </div>
              </Tooltip>
            )
          },
        },
      ]}
      FuncProps={{
        selectable: true,
        selectConfig: {
          showSelectAll: true,
          rowSelectionEnabled: (row) =>
            enabledSelectPOStatus.includes(row.purchaseOrderStatus) &&
            row.invoiceStatus === INVOICE_STATUS_TEXT.OUTSTANDING,
        },
      }}
    />
  )
}

export default PurchaseReceiveDataGrid
