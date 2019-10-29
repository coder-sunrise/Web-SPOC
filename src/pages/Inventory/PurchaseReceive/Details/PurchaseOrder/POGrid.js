import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import { EditableTableGrid, GridContainer, GridItem } from '@/components'
import {
  podoOrderType,
  getInventoryItem,
  getInventoryItemList,
} from '@/utils/codes'

let commitCount = 2200 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.string().required(),
  code: Yup.string().required(),
  // name: Yup.string().required(),
  orderQuantity: Yup.number().min(1).required(),
  bonusQuantity: Yup.number().min(0).required(),
})

class Grid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      onClickColumn: undefined,
      selectedItem: {},

      ConsumableItemList: [],
      MedicationItemList: [],
      VaccinationItemList: [],

      filterConsumableItemList: [],
      filterMedicationItemList: [],
      filterVaccinationItemList: [],
    }
  }

  componentDidMount = () => {
    this.initializeStateItemList()
  }

  initializeStateItemList = async () => {
    const { dispatch } = this.props

    await podoOrderType.map((x) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: x.ctName,
        },
      }).then((list) => {
        const { inventoryItemList } = getInventoryItemList(
          list,
          x.itemFKName,
          x.stateName,
        )
        this.setState({
          [x.stateName]: inventoryItemList,
        })
      })
      return null
    })

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  handleOnOrderTypeChanged = async (e) => {
    const { dispatch, values } = this.props
    const { rows } = values
    const { row, option } = e
    const { value, itemFKName, stateName } = option
    const originItemList = this.state[stateName]

    const { inventoryItemList } = getInventoryItem(
      originItemList,
      value,
      itemFKName,
      rows,
    )

    this.setState({
      [`filter${stateName}`]: inventoryItemList,
    })

    row.code = ''
    row.name = ''
    row.uom = ''
    row.orderQuantity = 0
    row.bonusQuantity = 0
    row.totalQuantity = 0
    row.quantityReceived = 0
    row.unitPrice = 0
    row.totalPrice = 0

    this.setState({ onClickColumn: 'type' })

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  handleItemOnChange = (e, type) => {
    const { option, row } = e

    if (type === 'code') {
      row.name = option.value
    } else {
      row.code = option.value
    }

    row.unitPrice = option.sellingPrice
    row.uom = option.uom
    row.orderQuantity = 0
    row.bonusQuantity = 0
    row.totalQuantity = 0
    row.quantityReceived = 0
    this.setState({
      selectedItem: option,
      onClickColumn: 'item',
    })

    this.props.dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
    return { ...row }
  }

  onAddedRowsChange = (addedRows) => {
    let newAddedRows = addedRows
    if (addedRows.length > 0) {
      if (!addedRows.isFocused) {
        const { onClickColumn, selectedItem } = this.state
        let tempRow = addedRows[0]
        let tempOrderQty = tempRow.orderQuantity
        let tempBonusQty = tempRow.bonusQuantity
        let tempTotalQty = tempRow.totalQuantity
        let tempQuantityReceived = tempRow.quantityReceived
        let tempUnitPrice = tempRow.unitPrice
        let tempTotalPrice = tempRow.totalPrice

        const calcTotalQty = () => {
          if (tempOrderQty >= 0 && tempBonusQty >= 0) {
            return tempOrderQty + tempBonusQty
          }
          return undefined
        }

        const calcTotalPrice = () => {
          if (tempOrderQty >= 1 && tempUnitPrice) {
            return tempOrderQty * tempUnitPrice
          }
          return undefined
        }

        if (onClickColumn === 'type') {
          // type logic here
        } else if (onClickColumn === 'item') {
          tempUnitPrice = selectedItem.sellingPrice
          tempTotalPrice = selectedItem.sellingPrice
        } else {
          tempTotalQty = calcTotalQty() || 0
          tempTotalPrice = calcTotalPrice() || tempUnitPrice
        }

        this.setState({ onClickColumn: undefined })

        newAddedRows = addedRows.map((row) => ({
          ...row,
          itemFK: selectedItem.value,
          totalQuantity: tempTotalQty,
          unitPrice: tempUnitPrice,
          totalPrice: tempTotalPrice,
        }))
      } else {
        // Initialize new generated row
        this.setState({ onClickColumn: undefined })
        newAddedRows = addedRows.map((row) => ({
          ...row,
          orderQuantity: 0,
          bonusQuantity: 0,
          totalQuantity: 0,
          quantityReceived: 0,
          unitPrice: 0,
          totalPrice: 0,
          isFocused: true,
        }))
      }
    }
    return newAddedRows
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { dispatch, calcPurchaseOrderSummary } = this.props

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

    setTimeout(() => calcPurchaseOrderSummary(), 500)
    return rows
  }

  rowOptions = (row) => {
    if (row.type === 1) {
      return row.uid
        ? this.state.MedicationItemList
        : this.state.filterMedicationItemList
    }
    if (row.type === 2) {
      return row.uid
        ? this.state.VaccinationItemList
        : this.state.filterVaccinationItemList
    }
    if (row.type === 3) {
      return row.uid
        ? this.state.ConsumableItemList
        : this.state.filterConsumableItemList
    }
    return []
  }

  render () {
    // const { purchaseOrderItems } = this.props
    const { values, isEditable, isWriteOff } = this.props
    const { rows } = values

    const tableParas = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'orderQuantity', title: 'Order Qty' },
        { name: 'bonusQuantity', title: 'Bonus Qty' },
        { name: 'totalQuantity', title: 'Total Qty' }, // Disabled, auto calc
        { name: 'quantityReceived', title: 'Total Received' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'totalPrice', title: 'Total Price' }, // Disabled, auto calc
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: podoOrderType,
          sortingEnabled: false,
          onChange: (e) => {
            if (e.option) {
              this.handleOnOrderTypeChanged(e)
            }
          },
        },
        {
          columnName: 'code',
          type: 'select',
          labelField: 'code',
          sortingEnabled: false,
          options: (row) => {
            return this.rowOptions(row)
          },
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e, 'code')
            }
          },
        },
        {
          columnName: 'name',
          type: 'select',
          labelField: 'name',
          sortingEnabled: false,
          options: (row) => {
            return this.rowOptions(row)
          },
          onChange: (e) => {
            if (e.option) {
              this.handleItemOnChange(e, 'name')
            }
          },
        },
        {
          columnName: 'uom',
          type: 'select',
          labelField: 'uom',
          disabled: true,
          sortingEnabled: false,
          options: (row) => {
            if (row.type === 1) {
              return this.state.MedicationItemList
            }
            if (row.type === 2) {
              return this.state.VaccinationItemList
            }
            if (row.type === 3) {
              return this.state.ConsumableItemList
            }
            return []
          },
        },
        {
          columnName: 'orderQuantity',
          type: 'number',
        },
        {
          columnName: 'bonusQuantity',
          type: 'number',
        },
        {
          columnName: 'totalQuantity',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'quantityReceived',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'unitPrice',
          type: 'number',
          currency: true,
          // disabled: true,
        },
        {
          columnName: 'totalPrice',
          type: 'number',
          currency: true,
          disabled: true,
        },
      ],
      onRowDoubleClick: undefined,
    }

    return (
      <GridContainer style={{ paddingRight: 20 }}>
        <GridItem xs={4} md={12}>
          <EditableTableGrid
            getRowId={(r) => r.uid}
            rows={rows}
            schema={receivingDetailsSchema}
            FuncProps={{
              edit: isEditable,
              pager: false,
            }}
            EditingProps={{
              showAddCommand: isEditable || !isWriteOff,
              showEditCommand: false,
              showDeleteCommand: isEditable || !isWriteOff,
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
