import React, { PureComponent } from 'react'
import { connect } from 'dva'
import Yup from '@/utils/yup'
import {
  EditableTableGrid,
  withFormikExtend,
  FastField,
  CodeSelect,
} from '@/components'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import { podoOrderType, getInventoryItem } from '@/utils/codes'
let commitCount = 2200 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  code: Yup.number().required(),
  //name: Yup.number().required(),
  orderQty: Yup.number().required(),
})

class Grid extends PureComponent {
  constructor (props) {
    super(props)
    // Initialize invoice calculation
    //this.props.calculateInvoice()
    this.state = {
      onClickColumn: undefined,
      selectedItem: {},
      itemDropdownList: [],
    }
  }

  handleOnOrderTypeChanged = async (e) => {
    const { dispatch } = this.props
    const { option, row } = e
    const { ctName } = option

    this.setState({
      onClickColumn: 'Type',
    })

    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: ctName,
      },
    }).then((list) => {
      const { inventoryItemList } = getInventoryItem(list)
      this.setState({
        itemDropdownList: inventoryItemList,
      })
      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
    })
  }

  handleItemOnChange = (e) => {
    console.log('handleItemOnChange', e)
    const { option, row } = e
    const { sellingPrice, uom, name, value } = option
    this.setState({
      selectedItem: option,
      onClickColumn: 'Code',
    })
    //return { ...row, unitPrice: sellingPrice, uom: prescribingUOM.name }
  }

  onAddedRowsChange = (addedRows) => {
    const defaultAmountQty = 0.00001
    if (addedRows.length > 0) {
      let finalAddedRows
      const { selectedItem, onClickColumn } = this.state
      const newRow = addedRows[0]
      const { orderQty, unitPrice, bonusQty } = newRow
      const calcTotalPrice = () => {
        if (orderQty >= 1 && selectedItem.sellingPrice) {
          return orderQty * selectedItem.sellingPrice
        } else {
          return selectedItem.sellingPrice || defaultAmountQty
        }
      }

      const calcTotalQty = () => {
        if (orderQty && bonusQty) {
          return orderQty + bonusQty
        } else {
          return defaultAmountQty
        }
      }

      if (onClickColumn === 'Type') {
        console.log('onAddedRowsChangeType')
        finalAddedRows = addedRows.map((row) => ({
          itemFK: [],
          name: [],
          uom: '',
          orderQty: defaultAmountQty,
          bonusQty: defaultAmountQty,
          totalQty: defaultAmountQty,
          quantityReceived: defaultAmountQty,
          unitPrice: defaultAmountQty,
          totalPrice: defaultAmountQty,
        }))
      } else if (onClickColumn === 'Code') {
        console.log(
          'onAddedRowsChangeCode',
          newRow,
          selectedItem,
          calcTotalPrice(),
        )

        finalAddedRows = addedRows.map((row) => ({
          ...row,
          uom: selectedItem.prescribingUOM
            ? selectedItem.prescribingUOM.name
            : undefined,
          unitPrice: selectedItem.sellingPrice
            ? selectedItem.sellingPrice
            : defaultAmountQty,
          totalQty: calcTotalQty(),
          totalPrice: calcTotalPrice(),
        }))
      } else {
        console.log('onAddedRowsChangeElse', calcTotalQty())
        finalAddedRows = addedRows.map((row) => ({
          ...row,
          totalQty: calcTotalQty(),
          totalPrice: calcTotalPrice(),
        }))
      }

      //this.setState({ selectedItem: {}, onClickColumn: undefined })
      this.setState({ onClickColumn: undefined })
      return finalAddedRows
    }
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
    //const { purchaseOrderItems } = this.props
    const { rows, dispatch } = this.props
    console.log('Grid', rows)

    const tableParas = {
      getRowId: (r) => r.uid,
      columns: [
        { name: 'type', title: 'Type' },
        // Sync -s
        { name: 'itemFK', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        // Sync -e
        { name: 'orderQty', title: 'Order Qty' },
        { name: 'bonusQty', title: 'Bonus Qty' },
        { name: 'totalQty', title: 'Total Qty' }, // Disabled, auto calc
        { name: 'quantityReceived', title: 'Total Received' },
        //Sync c -s
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'totalPrice', title: 'Total Price' }, // Disabled, auto calc
        //Sync c -e
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: podoOrderType,
          onChange: (e) => {
            if (e.option) {
              this.handleOnOrderTypeChanged(e)
            }
          },
        },
        {
          columnName: 'itemFK',
          type: 'select',
          labelField: 'name',
          options: this.state.itemDropdownList,
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e)
            }
          },
        },
        {
          columnName: 'name',
          type: 'select',
          labelField: 'value',
          options: this.state.itemDropdownList,
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e)
            }
          },
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
          columnName: 'quantityReceived',
          type: 'number',
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
        },
      ],
    }

    return (
      <React.Fragment>
        <EditableTableGrid
          //rows={purchaseOrderItems}
          rows={rows}
          //schema={receivingDetailsSchema}
          FuncProps={{
            pager: false,
          }}
          EditingProps={{
            showAddCommand: isEditable,
            showEditCommand: false,
            showDeleteCommand: isEditable,
            onCommitChanges: this.onCommitChanges,
            onAddedRowsChange: this.onAddedRowsChange,
          }}
          {...tableParas}
        />
      </React.Fragment>
    )
  }
}

export default Grid
