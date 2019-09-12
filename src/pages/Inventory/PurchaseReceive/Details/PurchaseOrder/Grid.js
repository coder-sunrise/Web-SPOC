import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { EditableTableGrid, withFormikExtend } from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import { podoOrderType } from '@/utils/codes'

const receivingDetailsSchema = Yup.object().shape({
  code: Yup.number().required(),
  //name: Yup.number().required(),
  orderQty: Yup.number().required(),
})

class Grid extends PureComponent {
  constructor (props) {
    super(props)
    // Initialize invoice calculation
    this.props.calculateInvoice()
    this.state = {
      selectedItem: {},
    }
  }

  handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice, prescribingUOM } = option

    this.setState({ selectedItem: option })

    return { ...row, unitPrice: sellingPrice, uom: prescribingUOM.name }
  }

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
        code: 'inventoryMedication',
        labelField: 'code',
        valueField: 'id',
        onChange: this.handleItemOnChange,
      },
      // {
      //   columnName: 'name',
      //   type: 'codeSelect',
      //   code: 'inventoryMedication',
      //   labelField: 'displayValue',
      //   valueField: 'id',
      //   onChange: this.handleItemOnChange,
      // },
      {
        columnName: 'uom',
        disabled: true,
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
        disabled: true,
      },
      {
        columnName: 'totalReceived',
        type: 'number',
        disabled: true,
      },
      {
        columnName: 'unitPrice',
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'totalPrice',
        type: 'number',
        currency: true,
        disabled: true,
        //value: 0,
      },
    ],
  }

  onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]
      const { orderQty, unitPrice } = newRow
      const { selectedItem } = this.state

      const calcTotalPrice = () => {
        if (orderQty && unitPrice) {
          return orderQty * unitPrice
        }
        return undefined
      }

      return addedRows.map((row) => ({
        ...row,
        uom: selectedItem.prescribingUOM
          ? selectedItem.prescribingUOM.name
          : undefined,
        unitPrice: selectedItem.sellingPrice
          ? selectedItem.sellingPrice
          : selectedItem.unitPrice,
        totalPrice: calcTotalPrice(),
      }))
    }

    this.setState({ selectedItem: {} })
    return addedRows
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue } = this.props

    if (deleted) {
      const deletedSet = new Set(deleted)
      const changedRows = rows.filter((row) => !deletedSet.has(row.id))
      setFieldValue('purchaseOrderItems', changedRows)
    }

    setFieldValue('purchaseOrderItems', rows)
    this.props.calculateInvoice(rows)
    return rows
  }

  render () {
    const isEditable = true
    const { purchaseOrderItems } = this.props

    return (
      <React.Fragment>
        <EditableTableGrid
          rows={purchaseOrderItems}
          schema={receivingDetailsSchema}
          FuncProps={{
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: false,
            showDeleteCommand: true,
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
