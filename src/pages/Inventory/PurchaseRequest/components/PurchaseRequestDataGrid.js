import React from 'react'
import { GridContextMenuButton as GridButton } from 'medisys-components'
import { CommonTableGrid, Tooltip, Button } from '@/components'
import { getAccessRight , PurchaseRequestGridCol, PURCHASE_REQUEST_STATUS } from '../variables'
import Edit from '@material-ui/icons/Edit'
import Delete from '@material-ui/icons/Delete'
import Print from '@material-ui/icons/Print'

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
      case 0:
        handleNavigate('edit', row.id)
        break
      case 1:
        handleDelete(row)
        break
      case 2:
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
          sortBy: 'createByUserFkNavigation.clinicianProfile.name',
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
          width: 130,
          render: row => {
            const editableAR = getAccessRight('purchasingrequest.modifypurchasingrequest')
            const editable = editableAR && row.purchaseRequestStatusFK !== PURCHASE_REQUEST_STATUS.SUBMITTED
            return (
              <div>
                <Button
                  color='primary'
                  justIcon
                  title='Edit'
                  disabled={!editableAR}
                  onClick={() => onContextButtonClick(row, 0)}
                >
                  <Edit />
                </Button>
                <Button
                  color='danger'
                  justIcon
                  title='Delete'
                  disabled={!editable}
                  onClick={() => onContextButtonClick(row, 1)}
                >
                  <Delete />
                </Button>
                <Button
                  color='primary'
                  justIcon
                  title='Print'
                  onClick={() => onContextButtonClick(row, 2)}
                >
                  <Print />
                </Button>
              </div>
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
