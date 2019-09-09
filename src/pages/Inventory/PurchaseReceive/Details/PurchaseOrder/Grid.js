import React, { PureComponent } from 'react'
import { EditableTableGrid } from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import { podoOrderType } from '@/utils/codes'

class Grid extends PureComponent {
  deleteRow = (row, e) => {}
  tableParas = {
    columns: [
      { name: 'type', title: 'Type' },
      { name: 'code', title: 'Code' },
      { name: 'name', title: 'Name' },
      { name: 'uom', title: 'UOM' },
      { name: 'orderQty', title: 'Order Qty' },
      { name: 'bonusQty', title: 'Bonus Qty' },
      { name: 'totalQty', title: 'Total Qty' },
      { name: 'totalReceived', title: 'Total Received' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'totalPrice', title: 'Total Price' },
    ],
    columnExtensions: [
      {
        columnName: 'type',
        type: 'codeSelect',
        options: podoOrderType,
      },
      {
        columnName: 'code',
        type: 'codeSelect',
        code: 'ctService',
      },
      {
        columnName: 'name',
        type: 'codeSelect',
        code: 'ctService',
      },
      {
        columnName: 'uom',
        type: 'codeSelect',
        code: 'ctMedicationUnitOfMeasurement',
      },
      {
        columnName: 'orderQty',
        type: 'number',
      },
      {
        columnName: 'bonusQty',
        type: 'number',
      },
      {
        columnName: 'totalQty',
        type: 'number',
      },
      {
        columnName: 'totalReceived',
        type: 'number',
      },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
      },
      {
        columnName: 'totalPrice',
        type: 'number',
        currency: true,
      },
    ],
  }
  render () {
    const isEditable = true
    return (
      <React.Fragment>
        <EditableTableGrid
          //rows={values.deliveryOrder_receivingItemList}
          //schema={receivingDetailsSchema}
          FuncProps={{
            //edit: isEditable,
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            //showEditCommand: isEditable,
            //showDeleteCommand: isEditable,
            onCommitChanges: this.onCommitChanges,
            onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...this.tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
