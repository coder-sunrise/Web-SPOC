import React from 'react'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { CommonTableGrid, Tooltip } from '@/components'
import { ContextMenuOptions, PurchaseRequestGridCol } from '../variables'

const PurchaseRequestDataGrid = ({
  selectedRows,
  actions: {
    handleDelete,
    handleNavigate,
    handleOnSelectionChange,
    handlePrintPRReport,
  },
  height,
}) => {
  const onContextButtonClick = (row, id) => {
    switch (id) {
      case '0':
        handleNavigate('edit', row.id)
        break
      case '1':
        handleDelete(row.id)
        break
      case '2':
        handlePrintPRReport(row.id)
        break
      default:
        break
    }
  }

  return (
    <CommonTableGrid
      style={{ margin: 0 }}
      type='purchaseRequestList'
      selection={selectedRows}
      forceRender
      onSelectionChange={handleOnSelectionChange}
      columns={PurchaseRequestGridCol}
      onRowDoubleClick={row => handleNavigate('edit', row.id)}
      TableProps={{
        height,
      }}
      columnExtensions={[
        {
          columnName: 'purchaseRequestNo',
          type: 'text',
        },
        {
          columnName: 'purchaseRequestDate',
          type: 'date',
        },
        {
          columnName: 'exceptedDeliveryDate',
          type: 'date',
        },
        {
          columnName: 'requestBy',
          type: 'text',
        },
        {
          columnName: 'remarks',
          type: 'text',
          sortingEnabled: false,
        },
        {
          columnName: 'purchaseRequestStatus',
          sortBy: 'purchaseRequestStatusFKNavigation.displayValue',
        },
        {
          columnName: 'action',
          align: 'center',
          render: row => {
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
        selectable: false,
        selectConfig: {
          showSelectAll: false,
          rowSelectionEnabled: row => true,
        },
      }}
    />
  )
}

export default PurchaseRequestDataGrid
