import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import { EditableTableGrid, withFormikExtend } from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import { podoOrderType } from '@/utils/codes'

const receivingDetailsSchema = Yup.object().shape({
  code: Yup.number().required(),
  orderQty: Yup.number().required(),
})

class Grid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      selectedItem: {},
    }
  }

  deleteRow = (row, e) => {}

  handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice } = option
    // setSelectedItem(option)
    this.setState({ selectedItem: option })

    return { ...row, unitPrice: sellingPrice }
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
        labelField: 'displayValue',
        valueField: 'id',
        onChange: this.handleItemOnChange,
      },
      // {
      //   columnName: 'name',
      //   type: 'codeSelect',
      //   code: 'ctService',
      // },
      {
        columnName: 'uom',
        type: 'codeSelect',
        code: 'ctMedicationUnitOfMeasurement',
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
    return setFieldValue('purchaseOrderItems', rows)
    this.calcTotal()
  }

  calcTotal = () => {
    const { setFieldValue, values } = this.props
    const { purchaseOrderItems } = values
    let total = 0

    purchaseOrderItems.forEach((row) => {
      total += row.totalPrice
    })

    setFieldValue('summaryTotal', total)
    return total
  }

  render () {
    const isEditable = true
    const { purchaseOrderItems } = this.props
    console.log('PO Grid', this.props)
    return (
      <React.Fragment>
        <EditableTableGrid
          rows={purchaseOrderItems}
          schema={receivingDetailsSchema}
          FuncProps={{
            //edit: isEditable,
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: false,
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
