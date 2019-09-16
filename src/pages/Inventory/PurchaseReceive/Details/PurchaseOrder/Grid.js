import React, { PureComponent, Component } from 'react'
import { connect } from 'dva'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import _ from 'lodash'
import Yup from '@/utils/yup'
import {
  EditableTableGrid,
  withFormikExtend,
  FastField,
  CodeSelect,
  GridContainer,
  GridItem,
} from '@/components'
import { podoOrderType, getInventoryItem } from '@/utils/codes'

let commitCount = 2200 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.number().required(),
  code: Yup.number().required(),
  // name: Yup.number().required(),
  orderQty: Yup.number().min(1).required(),
  bonusQty: Yup.number().min(0).required(),
  quantityReceived: Yup.number().min(0).required(),
})

class Grid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onClickColumn: undefined,
      selectedItem: {},
      itemDropdownList: [],
      selectedName: null,
      selectedCode: null,
    }
  }

  handleOnOrderTypeChanged = async (e) => {
    const { dispatch, rows } = this.props
    const { option, row } = e
    const { ctName, value, itemFKName } = option
    console.log('handleOnOrderTypeChanged', this.props)

    this.setState({
      onClickColumn: 'Type',
    })

    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: ctName,
      },
    }).then((list) => {
      const { inventoryItemList } = getInventoryItem(
        list,
        value,
        itemFKName,
        rows,
      )
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
    const { sellingPrice, uom, name, value, displayValue } = option

    row.code = name
    row.name = displayValue

    this.setState({
      selectedItem: option,
      onClickColumn: 'Code',
    })
    return { ...row }
  }

  onAddedRowsChange = (addedRows) => {
    const defaultQty = 0
    const defaultAmount = 0
    if (addedRows.length > 0) {
      let finalAddedRows
      const { selectedItem, onClickColumn } = this.state
      const newRow = addedRows[0]
      const { orderQty, unitPrice, bonusQty } = newRow
      const calcTotalPrice = () => {
        if (orderQty >= 1 && selectedItem.sellingPrice) {
          return orderQty * selectedItem.sellingPrice
        }
        return selectedItem.sellingPrice || defaultAmount
      }

      const calcTotalQty = () => {
        if (orderQty && bonusQty) {
          return orderQty + bonusQty
        }
        return defaultQty
      }

      if (onClickColumn === 'Type') {
        console.log('onAddedRowsChangeType')
        finalAddedRows = addedRows.map((row) => ({
          itemFK: 0,
          uom: '',
          orderQty: defaultQty,
          bonusQty: defaultQty,
          totalQty: defaultQty,
          quantityReceived: defaultQty,
          unitPrice: defaultAmount,
          totalPrice: defaultAmount,
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
          itemFK: selectedItem.id,
          name: selectedItem.id,
          uom: selectedItem.uom,
          unitPrice: selectedItem.sellingPrice
            ? selectedItem.sellingPrice
            : defaultAmount,
          totalQty: calcTotalQty(),
          totalPrice: calcTotalPrice(),
        }))
      } else {
        // console.log('onAddedRowsChangeElse', calcTotalQty())
        finalAddedRows = addedRows.map((row) => ({
          ...row,
          totalQty: calcTotalQty(),
          totalPrice: calcTotalPrice(),
        }))
      }
      console.log('finalAddedRows', finalAddedRows)
      this.setState({ onClickColumn: undefined })
      return finalAddedRows
    }
    return addedRows
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setFieldValue, dispatch, calculateInvoice } = this.props

    if (deleted) {
      dispatch({
        type: 'purchaseOrderDetails/deleteRow',
        payload: deleted[0],
      })
    } else {
      dispatch({
        type: 'purchaseOrderDetails/upsertRow',
        payload: rows[0],
      })
    }

    setTimeout(() => {
      calculateInvoice()
    }, 1)
    return rows
  }

  render () {
    // const { purchaseOrderItems } = this.props
    const { rows, dispatch, isEditable } = this.props
    const { selectedItem, selectedCode, selectedName } = this.state
    console.log('Grid', rows)

    const tableParas = {
      getRowId: (r) => r.uid,
      columns: [
        { name: 'type', title: 'Type' },
        // Sync -s
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        // Sync -e
        { name: 'orderQty', title: 'Order Qty' },
        { name: 'bonusQty', title: 'Bonus Qty' },
        { name: 'totalQty', title: 'Total Qty' }, // Disabled, auto calc
        { name: 'quantityReceived', title: 'Total Received' },
        // Sync c -s
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'totalPrice', title: 'Total Price' }, // Disabled, auto calc
        // Sync c -e
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: podoOrderType,
          onChange: (e) => {
            if (e.option) {
              this.handleOnOrderTypeChanged(e)

              dispatch({
                // force current edit row components to update
                type: 'global/updateState',
                payload: {
                  commitCount: (commitCount += 1),
                },
              })
            }
          },
        },
        {
          columnName: 'code',
          type: 'select',
          // labelField: 'name',
          options: this.state.itemDropdownList,

          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e)
            }

            dispatch({
              // force current edit row components to update
              type: 'global/updateState',
              payload: {
                commitCount: (commitCount += 1),
              },
            })
          },
        },
        {
          columnName: 'name',
          type: 'select',
          labelField: 'displayValue',
          options: this.state.itemDropdownList,

          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e)
            }

            dispatch({
              // force current edit row components to update
              type: 'global/updateState',
              payload: {
                commitCount: (commitCount += 1),
              },
            })
          },
        },
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
      <GridContainer style={{ paddingRight: 20 }}>
        <GridItem xs={4} md={12}>
          <EditableTableGrid
            // rows={purchaseOrderItems}
            rows={rows}
            schema={receivingDetailsSchema}
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
        </GridItem>
        {/* <GridItem xs={8} md={1} /> */}
      </GridContainer>
    )
  }
}

export default Grid
