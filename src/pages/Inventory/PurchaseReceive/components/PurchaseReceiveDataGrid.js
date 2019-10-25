import React, { useState } from 'react'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { formatMessage } from 'umi/locale'
import { CommonTableGrid, Tooltip, notification } from '@/components'
import Authorized from '@/utils/Authorized'
import { ContextMenuOptions, PurchaseReceiveGridCol } from '../variables'

const PurchaseReceiveDataGrid = ({
  selectedRows,
  actions: {
    handleDuplicatePO,
    handleNavigate,
    handleOnSelectionChange,
    handlePrintPOReport,
  },
}) => {
  // const [
  //   selectedRows,
  //   setSelectedRows,
  // ] = useState([])

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
      // onSelectionChange={(selection) => setSelectedRows(selection)}
      onSelectionChange={handleOnSelectionChange}
      columns={PurchaseReceiveGridCol}
      onRowDoubleClick={(row) => handleNavigate('edit', row.id)}
      // onRowDoubleClick={(row) => console.log(row)}
      columnExtensions={[
        {
          columnName: 'invoiceStatus',
          sortBy: 'invoiceStatusFKNavigation.DisplayValue',
          render: (row) => {
            const { purchaseOrderStatus, invoiceStatus } = row
            if (
              purchaseOrderStatus === 'Draft' ||
              purchaseOrderStatus === 'Cancelled'
            )
              return <p />
            return <p>{invoiceStatus}</p>
          },
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
        { columnName: 'totalAmount', type: 'number', currency: true },
        { columnName: 'outstanding', type: 'number', currency: true, sortingEnabled: false, },
        {
          columnName: 'purchaseOrderStatus',
          sortBy: 'purchaseOrderStatusFKNavigation.displayValue',
        },
        {
          columnName: 'action',
          align: 'center',
          render: (row) => {
            return (
              <Authorized authority='purchasingandreceiving.purchasingandreceivingdetails'>
                <Tooltip title='More Actions'>
                  <div style={{ display: 'inline-block' }}>
                    <GridButton
                      row={row}
                      onClick={onContextButtonClick}
                      contextMenuOptions={ContextMenuOptions(row)}
                    />
                  </div>
                </Tooltip>
              </Authorized>
            )
          },
        },
      ]}
      FuncProps={{
        selectable: true,
        selectConfig: {
          showSelectAll: true,
        },
      }}
    />
  )
}

export default PurchaseReceiveDataGrid
