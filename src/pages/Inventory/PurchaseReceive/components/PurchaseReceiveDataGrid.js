import React, { useState } from 'react'
import { connect } from 'dva'
import { CommonTableGrid, Tooltip } from '@/components'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { ContextMenuOptions, PurchaseReceiveGridCol, PurchaseReceiveGridTableConfig } from '../variables'
import {
  notification,
} from '@/components'
import { formatMessage } from 'umi/locale'

const PurchaseReceiveDataGrid = ({
  purchaseReceiveList,
  actions: { handleDuplicatePO, handleNavigate },
}) => {
  const [
    selectedRows,
    setSelectedRows,
  ] = useState([])

  const onContextButtonClick = (row, id) => {
    switch (id) {
      case '0':
        handleNavigate('edit', row.id)
        break
      case '1':
        handleDuplicatePO(row.id)
        break
      case '2':
        notification.info({ message: 'Print' })
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
      onSelectionChange={(selection) => setSelectedRows(selection)}
      columns={PurchaseReceiveGridCol}
      columnExtensions={[
        {
          columnName: 'purchaseOrderDate',
          type: 'date',
          format: 'DD MMM YYYY',
        },
        {
          columnName: 'expectedDeliveryDate',
          type: 'date',
          format: 'DD MMM YYYY',
        },
        { columnName: 'total', type: 'number', currency: true },
        { columnName: 'outstanding', type: 'number', currency: true },
        {
          columnName: 'status',
          sortingEnabled: false,
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
      {...PurchaseReceiveGridTableConfig}
    />
  )
}

export default PurchaseReceiveDataGrid