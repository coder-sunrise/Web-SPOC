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
import {
  podoOrderType,
  getInventoryItem,
  getInventoryItemList,
} from '@/utils/codes'

let commitCount = 2200 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.string().required(),
  code: Yup.string().required(),
  name: Yup.string().required(),
  orderQty: Yup.number().min(0).required(),
  bonusQty: Yup.number().min(0).required(),
  //quantityReceived: Yup.number().min(0).required(),
})

class Grid extends Component {
  constructor (props) {
    super(props)
    this.state = {
      onClickColumn: undefined,
      selectedItem: {},

      consumableItemList: [],
      medicationItemList: [],
      vaccinationItemList: [],

      filterConsumableItemList: [],
      filterMedicationItemList: [],
      filterVaccinationItemList: [],
    }
  }

  initializeStateItemList = async () => {
    const { dispatch } = this.props

    await podoOrderType.forEach((x) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: x.ctName,
        },
      }).then((list) => {
        const { inventoryItemList } = getInventoryItemList(list)
        this.setState({ [x.stateName]: inventoryItemList })
      })
    })
  }

  componentDidMount () {
    this.initializeStateItemList()
  }

  handleOnOrderTypeChanged = async (e) => {
    const { dispatch } = this.props
    const { row } = e
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })

    row.code = ''
    row.name = ''
    row.uom = ''
    row.orderQty = 0
    row.bonusQty = 0
    row.totalQty = 0
    row.quantityReceived = 0
    row.unitPrice = 0
    row.totalPrice = 0

    this.setState({ onClickColumn: 'type' })
  }

  handleItemOnChange = (e, type) => {
    const { dispatch } = this.props
    const { option, row } = e
    const { sellingPrice, uom, name, value } = option

    if (type === 'code') {
      row.name = option.name
    } else {
      row.code = option.code
    }

    row.uom = option.uom
    row.orderQty = 0
    row.bonusQty = 0
    row.totalQty = 0
    row.quantityReceived = 0

    this.setState({
      selectedItem: option,
      onClickColumn: 'item',
    })

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })

    return { ...row }
  }

  onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      if (!addedRows.isFocused) {
        const { onClickColumn, selectedItem } = this.state
        console.log('selectedItem', selectedItem)
        let tempRow = addedRows[0]
        let tempOrderQty = tempRow.orderQty
        let tempBonusQty = tempRow.bonusQty
        let tempTotalQty = tempRow.totalQty
        let tempQuantityReceived = tempRow.quantityReceived
        let tempUnitPrice = tempRow.unitPrice
        let tempTotalPrice = tempRow.totalPrice

        const calcTotalQty = () => {
          if (tempOrderQty >= 0 && tempBonusQty >= 0) {
            console.log('calcTotalQty', tempOrderQty, tempBonusQty)
            return tempOrderQty + tempBonusQty
          }
        }

        const calcTotalPrice = () => {
          if (tempOrderQty >= 1 && selectedItem.sellingPrice) {
            return tempOrderQty * selectedItem.sellingPrice
          }
        }

        if (onClickColumn === 'type') {
        } else if (onClickColumn === 'item') {
          tempUnitPrice = selectedItem.sellingPrice
          tempTotalPrice = selectedItem.sellingPrice
        } else {
          tempTotalQty = calcTotalQty() || 0
          tempTotalPrice = calcTotalPrice() || tempUnitPrice
        }

        this.setState({ onClickColumn: undefined })

        return addedRows.map((row) => ({
          ...row,
          itemFK: selectedItem.value,
          totalQty: tempTotalQty,
          unitPrice: tempUnitPrice,
          totalPrice: tempTotalPrice,
        }))
      } else {
        // Initialize new generated row
        this.setState({ onClickColumn: undefined })
        return addedRows.map((row) => ({
          ...row,
          orderQty: 0,
          bonusQty: 0,
          totalQty: 0,
          quantityReceived: 0,
          unitPrice: 0,
          totalPrice: 0,
          isFocused: true,
        }))
      }
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
      //getRowId: (r) => r.uid,
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'orderQty', title: 'Order Qty' },
        { name: 'bonusQty', title: 'Bonus Qty' },
        { name: 'totalQty', title: 'Total Qty' }, // Disabled, auto calc
        { name: 'quantityReceived', title: 'Total Received' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'totalPrice', title: 'Total Price' }, // Disabled, auto calc
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
          columnName: 'code',
          type: 'select',
          labelField: 'code',
          options: (row) => {
            if (row.type === 1) {
              return this.state.medicationItemList
            } else if (row.type === 2) {
              return this.state.vaccinationItemList
            } else if (row.type === 3) {
              return this.state.consumableItemList
            } else {
              return []
            }
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
          options: (row) => {
            if (row.type === 1) {
              return this.state.medicationItemList
            } else if (row.type === 2) {
              return this.state.vaccinationItemList
            } else if (row.type === 3) {
              return this.state.consumableItemList
            } else {
              return []
            }
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
          options: (row) => {
            if (row.type === 1) {
              return this.state.medicationItemList
            } else if (row.type === 2) {
              return this.state.vaccinationItemList
            } else if (row.type === 3) {
              return this.state.consumableItemList
            } else {
              return []
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
        },
      ],
    }

    return (
      <GridContainer style={{ paddingRight: 20 }}>
        <GridItem xs={4} md={12}>
          <EditableTableGrid
            getRowId={(r) => r.uid}
            rows={rows}
            schema={receivingDetailsSchema}
            FuncProps={{
              //edit: isEditable,
              pager: false,
            }}
            EditingProps={{
              showAddCommand: isEditable,
              showEditCommand: isEditable,
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
