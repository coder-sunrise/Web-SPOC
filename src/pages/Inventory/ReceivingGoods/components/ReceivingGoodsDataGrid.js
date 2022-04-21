import React from 'react'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { CommonTableGrid, Tooltip } from '@/components'
import {
  INVOICE_STATUS_TEXT,
  RECEIVING_GOODS_STATUS_TEXT,
} from '@/utils/constants'
import Authorized from '@/utils/Authorized'
import { ContextMenuOptions, ReceivingGoodsGridCol } from '../variables'

const ReceivingGoodsDataGrid = ({
  selectedRows,
  actions: {
    handleDuplicateRG,
    handleNavigate,
    handleOnSelectionChange,
    handlePrintRGReport,
  },
  height,
}) => {
  const onContextButtonClick = (row, id) => {
    switch (id) {
      case '0':
        handleNavigate('edit', row.id)
        break
      case '1':
        handleDuplicateRG(row.id)
        break
      case '2':
        handlePrintRGReport(row.id)
        break
      default:
        break
    }
  }
  const viewEditAuthority = Authorized.check(
    'receivinggoods.receivinggoodsdetails',
  ) || { rights: 'hidden' }
  return (
    <CommonTableGrid
      style={{ margin: 0 }}
      type='receivingGoodsList'
      selection={selectedRows}
      TableProps={{
        height,
      }}
      forceRender
      onSelectionChange={handleOnSelectionChange}
      columns={ReceivingGoodsGridCol}
      onRowDoubleClick={(row) => {
        if (viewEditAuthority && viewEditAuthority.rights === 'enable')
          handleNavigate('edit', row.id)
      }}
      columnExtensions={[
        {
          columnName: 'invoiceStatus',
          sortBy: 'invoiceStatusFKNavigation.DisplayValue',
          width: 120,
        },
        {
          columnName: 'supplier',
          sortBy: 'supplierFKNavigation.displayValue',
        },
        {
          columnName: 'receivingGoodsDate',
          type: 'date',
          width: 120,
        },
        {
          columnName: 'receivingGoodsNo',
          width: 120,
        },
        {
          columnName: 'documentNo',
          width: 120,
        },
        {
          columnName: 'totalAftGST',
          type: 'number',
          currency: true,
          sortingEnabled: false,
          width: 120,
        },
        {
          columnName: 'outstanding',
          type: 'number',
          currency: true,
          sortingEnabled: false,
          width: 120,
        },
        {
          columnName: 'receivingGoodsStatus',
          sortBy: 'receivinggoodsStatusFKNavigation.displayValue',
          width: 120,
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
            row.receivingGoodsStatus ===
              RECEIVING_GOODS_STATUS_TEXT.COMPLETED &&
            row.invoiceStatus === INVOICE_STATUS_TEXT.OUTSTANDING,
        },
      }}
    />
  )
}

export default ReceivingGoodsDataGrid
