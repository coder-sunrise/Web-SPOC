import React, { PureComponent } from 'react'
import Yup from '@/utils/yup'
import {
  FastEditableTableGrid,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'
import { rgType, getInventoryItem, inventoryItemListing } from '@/utils/codes'
import { INVENTORY_TYPE } from '@/utils/constants'
import { fetchAndSaveCodeTable } from '@/utils/codetable'
import { roundTo, getUniqueId } from '@/utils/utils'

const ReceivingGoodsDetailsSchema = Yup.object().shape({
  type: Yup.number().required(),
  code: Yup.number().required(),
  name: Yup.number().required(),
  orderQuantity: Yup.number()
    .min(1, 'Order Quantity must be greater than or equal to 1')
    .required(),
  bonusReceived: Yup.number()
    .min(0, 'Bonus Received Quantity must be greater than or equal to 0')
    .required(),
  quantityReceived: Yup.number()
    .min(0, 'Received Quantity must be greater than or equal to 0')
    .max(Yup.ref('orderQuantity'), (e) => {
      return `Received Quantity must be less than or equal to ${e.max
        ? e.max.toFixed(1)
        : e.max}`
    })
    .required(),
  unitPrice: Yup.number()
    .min(0, 'Unit Price must be greater than or equal to $0')
    .required(),
  totalPrice: Yup.number()
    .min(0, 'Total Price must be greater than or equal to $0')
    .required(),
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
    const excludeInactiveCodes = () => {
      const { values } = this.props
      if (!Number.isNaN(values.id)) {
        return undefined
      }
      return true
    }

    await rgType.map((x) => {
      fetchAndSaveCodeTable(x.ctName, {
        isActive: excludeInactiveCodes(),
      }).then((list) => {
        const { inventoryItemList } = inventoryItemListing(
          list,
          x.itemFKName,
          x.stateName,
          x.stockName,
        )
        this.setState({
          [x.stateName]: inventoryItemList,
        })
      })
      return null
    })
  }

  handleOnOrderTypeChanged = async (e) => {
    const { row, option } = e
    const { value, itemFKName, stateName } = option
    const originItemList = this.state[stateName]

    const { inventoryItemList } = getInventoryItem(
      originItemList,
      value,
      itemFKName,
      [],
      [],
    )

    await this.setState({
      [`filter${stateName}`]: inventoryItemList,
    })

    row.code = null
    row.name = null
    row.codeString = undefined
    row.nameString = undefined
    row.unitOfMeasurement = ''
    row.unitPrice = 0
    row.orderQuantity = 0
    row.bonusReceived = 0
    row.quantityReceived = 0
    row.totalReceived = 0
    row.batchNo = undefined
    row.expiryDate = undefined
    row.gstAmount = 0
    row.totalPrice = 0
    row.totalAfterGST = 0
    this.setState({ onClickColumn: 'type' })
  }

  handleItemOnChange = (e, type) => {
    const { option, row } = e
    if (option) {
      if (type === 'code') {
        row.name = option.value
      } else {
        row.code = option.value
      }
      row.codeString = option.code
      row.nameString = option.name
      row.unitOfMeasurement = option.uom
      row.unitPrice = option.lastCostPriceBefBonus
    } else {
      row.name = null
      row.code = null
      row.codeString = undefined
      row.nameString = undefined
      row.unitOfMeasurement = undefined
      row.unitPrice = 0
    }

    row.orderQuantity = 0
    row.bonusReceived = 0
    row.quantityReceived = 0
    row.totalReceived = 0
    row.totalPrice = 0
    row.gstAmount = 0
    row.totalAfterGST = 0
    const defaultBatch = this.getBatchStock(row).find(
      (batch) => batch.isDefault,
    )
    row.batchNo = undefined
    row.expiryDate = undefined
    if (defaultBatch) {
      row.batchNo = defaultBatch.batchNo
      row.expiryDate = defaultBatch.expiryDate
    }
    this.setState({
      selectedItem: option,
      onClickColumn: 'item',
    })
  }

  handleSelectedBatch = (e) => {
    const { option, row, val } = e

    if (option.length > 0) {
      const { expiryDate, batchNo } = option[0]
      row.batchNo = batchNo
      row.expiryDate = expiryDate
    } else {
      row.batchNo = val[0]
      row.expiryDate = undefined
    }
  }

  onAddedRowsChange = (addedRows) => {
    let newAddedRows = addedRows
    if (addedRows.length > 0) {
      this.setState({ onClickColumn: undefined })
      newAddedRows = addedRows.map((row) => ({
        ...row,
        orderQuantity: 0,
        bonusReceived: 0,
        quantityReceived: 0,
        totalReceived: 0,
        unitPrice: 0,
        totalPrice: 0,
        isFocused: true,
      }))
    }
    return newAddedRows
  }

  onCommitChanges = ({ rows, added, changed, deleted }) => {
    const { setFieldValue } = this.props
    if (deleted) {
      const newRows = rows.map((o) => {
        return { ...o, isDeleted: o.uid === deleted[0] ? true : o.isDeleted }
      })
      setFieldValue('rows', newRows)
    } else if (added || changed) {
      const newRows = rows.map((o, index) => {
        const item = rgType.find((x) => x.value === o.type)
        let itemFK
        if (item) {
          const { itemFKName } = item
          itemFK = itemFKName
        }
        return {
          uid: getUniqueId(),
          ...o,
          [itemFK]: o.code,
          itemFK: o.code,
          sortOrder: index + 1,
        }
      })
      setFieldValue('rows', newRows)
    }
    return rows
  }

  rowOptions = (row) => {
    const getCurrentOptions = (stateName, filteredOptions) => {
      const selectedItem = this.state[stateName].find(
        (o) => o.itemFK === row.itemFK,
      )
      let currentOptions = filteredOptions
      if (selectedItem) {
        currentOptions = [
          ...filteredOptions,
          selectedItem,
        ]
      }
      return currentOptions
    }

    const filterActiveCode = (ops) => {
      return ops.filter((o) => o.isActive === true)
    }
    if (row.type === 1) {
      const filteredOptions = this.state.MedicationItemList
      const activeOptions = filterActiveCode(filteredOptions)
      const currentOptions = getCurrentOptions(
        'MedicationItemList',
        activeOptions,
      )
      return row.uid ? currentOptions : activeOptions
    }
    if (row.type === 3) {
      const filteredOptions = this.state.VaccinationItemList
      const activeOptions = filterActiveCode(filteredOptions)
      const currentOptions = getCurrentOptions(
        'VaccinationItemList',
        activeOptions,
      )
      return row.uid ? currentOptions : activeOptions
    }
    if (row.type === 2) {
      const filteredOptions = this.state.ConsumableItemList
      const activeOptions = filterActiveCode(filteredOptions)
      const currentOptions = getCurrentOptions(
        'ConsumableItemList',
        activeOptions,
      )
      return row.uid ? currentOptions : activeOptions
    }
    return []
  }

  calculateTotalPrice = (e) => {
    const { row } = e
    if (row) {
      const { orderQuantity = 0, unitPrice = 0 } = row
      row.totalPrice = roundTo(orderQuantity * unitPrice)
    }
  }

  updateOrderQuantiry = (e) => {
    const { row } = e
    if (row) {
      const { orderQuantity = 0, unitPrice = 0, bonusReceived = 0 } = row
      row.quantityReceived = orderQuantity
      row.totalReceived = bonusReceived + orderQuantity
      row.totalPrice = roundTo(orderQuantity * unitPrice)
    }
  }

  calculateTotalReceivedQuatity = (e) => {
    const { row } = e
    if (row) {
      const { bonusReceived = 0, quantityReceived = 0 } = row
      row.totalReceived = bonusReceived + quantityReceived
    }
  }

  calculateUnitPrice = (e) => {
    const { row } = e
    if (row) {
      const { orderQuantity = 0, totalPrice = 0 } = row
      if (orderQuantity > 0) {
        row.unitPrice = roundTo(totalPrice / orderQuantity, 3)
      } else {
        row.unitPrice = 0
      }
    }
  }

  getOptions = (stateItemList, storeItemList, row) => {
    const stateArray = stateItemList
    const selectedArray = stateArray.length <= 0 ? storeItemList : stateArray
    return selectedArray.find((o) => o.itemFK === row.code).stock || []
  }

  getBatchStock = (row) => {
    const {
      MedicationItemList = [],
      ConsumableItemList = [],
      VaccinationItemList = [],
    } = this.props.receivingGoodsDetails

    if (row.code && row.name) {
      if (row.type === INVENTORY_TYPE.CONSUMABLE) {
        return this.getOptions(
          this.state.ConsumableItemList,
          ConsumableItemList,
          row,
        )
      }
    }

    return []
  }

  render () {
    const { values, isEditable } = this.props
    const { rows } = values
    const tableParas = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'unitOfMeasurement', title: 'UOM' },
        { name: 'orderQuantity', title: 'Order Qty.' },
        { name: 'quantityReceived', title: 'Received Qty.' },
        { name: 'bonusReceived', title: 'Bonus Qty.' },
        { name: 'totalReceived', title: 'Total Received Qty.' },
        { name: 'unitPrice', title: 'Unit Price' },
        { name: 'totalPrice', title: 'Total Price' },
        { name: 'batchNo', title: 'Batch No.' },
        { name: 'expiryDate', title: 'Expiry Date' },
      ],
      columnExtensions: [
        {
          columnName: 'type',
          type: 'select',
          options: rgType,
          sortingEnabled: false,
          onChange: (e) => {
            if (e.option) {
              this.handleOnOrderTypeChanged(e)
            }
          },
          isDisabled: (row) => row.isClosed,
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
            this.handleItemOnChange(e, 'code')
          },
          isDisabled: (row) => row.isClosed,
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
            this.handleItemOnChange(e, 'name')
          },
          isDisabled: (row) => row.isClosed,
        },
        {
          columnName: 'unitOfMeasurement',
          disabled: true,
          sortingEnabled: false,
        },
        {
          columnName: 'orderQuantity',
          type: 'number',
          precision: 1,
          onChange: this.updateOrderQuantiry,
          width: 100,
          sortingEnabled: false,
          isDisabled: (row) => row.isClosed,
        },
        {
          columnName: 'bonusReceived',
          type: 'number',
          precision: 1,
          onChange: this.calculateTotalReceivedQuatity,
          sortingEnabled: false,
          width: 100,
          isDisabled: (row) => row.isClosed,
        },
        {
          columnName: 'quantityReceived',
          type: 'number',
          precision: 1,
          onChange: this.calculateTotalReceivedQuatity,
          sortingEnabled: false,
          width: 100,
          isDisabled: (row) => row.isClosed,
        },
        {
          columnName: 'totalReceived',
          type: 'number',
          format: '0.0',
          disabled: true,
          sortingEnabled: false,
          width: 140,
        },
        {
          columnName: 'unitPrice',
          type: 'number',
          currency: true,
          precision: 3,
          onChange: this.calculateTotalPrice,
          sortingEnabled: false,
          width: 100,
          isDisabled: (row) => row.isClosed,
        },
        {
          columnName: 'totalPrice',
          type: 'number',
          currency: true,
          onChange: this.calculateUnitPrice,
          sortingEnabled: false,
          width: 100,
          isDisabled: (row) => row.isClosed,
        },
        {
          columnName: 'batchNo',
          type: 'select',
          mode: 'tags',
          maxSelected: 1,
          labelField: 'batchNo',
          valueField: 'batchNo',
          disableAll: true,
          options: this.getBatchStock,
          sortingEnabled: false,
          maxLength: 20,
          onChange: (e) => {
            this.handleSelectedBatch(e)
          },
          render: (row) => {
            return <TextField text value={row.batchNo} />
          },
        },
        {
          columnName: 'expiryDate',
          sortingEnabled: false,
          type: 'date',
        },
      ],
      onRowDoubleClick: undefined,
    }
    return (
      <GridContainer style={{ paddingRight: 20 }}>
        <GridItem xs={4} md={12}>
          <FastEditableTableGrid
            getRowId={(r) => r.uid}
            rows={rows}
            schema={ReceivingGoodsDetailsSchema}
            forceRenderDuration={5000}
            FuncProps={{
              pager: false,
            }}
            EditingProps={{
              showCommandColumn: isEditable,
              showAddCommand: isEditable,
              onCommitChanges: this.onCommitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
            }}
            {...tableParas}
          />
        </GridItem>
      </GridContainer>
    )
  }
}

export default Grid
