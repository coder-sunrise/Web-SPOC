import React, { PureComponent } from 'react'
import { formatMessage } from 'umi/locale'
import Yup from '@/utils/yup'
import {
  GridContainer,
  GridItem,
  FastField,
  TextField,
  withFormikExtend,
  DatePicker,
  OutlinedTextField,
  EditableTableGrid,
} from '@/components'
import {
  podoOrderType,
  getInventoryItem,
  getInventoryItemList,
} from '@/utils/codes'

let commitCount = 2201 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.string().required(),
  code: Yup.string().required(),
  name: Yup.string().required(),
  // orderQty: Yup.number().required(),
  // bonusQty: Yup.number().required(),
  // quantityReceived: Yup.number().min(0).required(),
  // totalBonusReceived: Yup.number().min(0).required(),

  currentReceivingQty: Yup.number().min(0).required(),
  currentReceivingBonusQty: Yup.number().min(0).required(),
})

@withFormikExtend({
  mapPropsToValues: ({ deliveryOrderDetails }) => {
    // console.log('DODetails', deliveryOrderDetails)
    return deliveryOrderDetails.entity
  },
  enableReinitialize: true,
  displayName: 'deliveryOrderDetails',
  validationSchema: Yup.object().shape({
    deliveryOrderNo: Yup.string().required(),
    deliveryOrderDate: Yup.string().required(),
    rows: Yup.array().compact((v) => v.isDeleted).of(receivingDetailsSchema),
  }),
  handleSubmit: (values, { props }) => {
    const { rows, ...restValues } = values
    // console.log('handleSubmit1', values)
    // console.log('handleSubmit2', restValues)
    const {
      deliveryOrderDetails,
      refreshDeliveryOrder,
      dispatch,
      onConfirm,
    } = props
    const { list } = deliveryOrderDetails

    let deliveryOrderItem = rows.map((x, index) => {
      // const itemType = podoOrderType.find((y) => y.value === x.type)
      return {
        inventoryTransactionItemFK: 39, // Temporary hard code, will remove once Soe fix the API
        purchaseOrderItemFK: x.id,
        recevingQuantity: x.currentReceivingQty,
        bonusQuantity: x.currentReceivingBonusQty,
        isDeleted: x.isDeleted,
        // batchNo: x.batchNo[0],
        expiryDate: x.expiryDate,
        sortOrder: index + 1,
        inventoryTransactionItemDto: {},
      }
    })

    dispatch({
      type: 'deliveryOrderDetails/upsert',
      payload: {
        ...restValues,
        sequence: list ? list.length + 1 : 1,
        inventoryTransactionFK: 26, // Temporary hard code, will remove once Soe fix the API
        deliveryOrderStatusFK: 1, // Temporary hard code, will remove once Soe fix the API
        deliveryOrderItem,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'purchaseOrderDetails/refresh',
          payload: {
            id: deliveryOrderDetails.id,
          },
        })

        setTimeout(() => refreshDeliveryOrder(), 500)
      }
    })
  },
})
class DODetails extends PureComponent {
  state = {
    onClickColumn: undefined,
    selectedItem: {},

    ConsumableItemList: [],
    MedicationItemList: [],
    VaccinationItemList: [],

    filterConsumableItemList: [],
    filterMedicationItemList: [],
    filterVaccinationItemList: [],

    // Batch No. #
    expiryDateAvailability: false,
    selectedBatch: {},
    stockMedication: [], // medication
    stockVaccination: [], // vaccination
    stockConsumable: [], // consumable

    filterStockMedication: [], // medication
    filterStockVaccination: [], // vaccination
    filterStockConsumable: [], // consumable
  }

  componentDidMount = async () => {
    await this.initializeStateItemList()
  }

  forceUpdate = () => {
    const { dispatch } = this.props
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  initializeStateItemList = async () => {
    const { dispatch } = this.props
    const result = []

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

      result.push(
        dispatch({
          type: 'deliveryOrderDetails/getStockDetails',
          payload: {
            id: x.value,
          },
        }),
      )
      return null
    })

    let [
      medication,
      vaccination,
      consumable,
    ] = await Promise.all(result)

    this.setOption(medication, vaccination, consumable)

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  setOption = (m, v, c) => {
    const mOptions = m.data.map((o) => {
      return {
        ...o,
        name: o.batchNo,
        value: o.batchNo,
        // value: o.id,
      }
    })
    const vOptions = v.data.map((o) => {
      return {
        ...o,
        name: o.batchNo,
        value: o.batchNo,
        // value: o.id,
      }
    })

    const cOptions = c.data.map((o) => {
      return {
        ...o,
        name: o.batchNo,
        value: o.batchNo,
        // value: o.id,
      }
    })

    this.setState({ stockMedication: mOptions })
    this.setState({ stockVaccination: vOptions })
    this.setState({ stockConsumable: cOptions })
    this.setState({ filterStockMedication: mOptions })
    this.setState({ filterStockVaccination: vOptions })
    this.setState({ filterStockConsumable: cOptions })
  }

  handleOnOrderTypeChanged = async (e) => {
    const { values, deliveryOrderDetails } = this.props
    const { purchaseOrderDetails } = deliveryOrderDetails
    const { purchaseOrderOutstandingItem } = purchaseOrderDetails
    const { rows } = values
    const { row, option } = e
    const { value, itemFKName, stateName } = option
    const originItemList = this.state[stateName]

    const { inventoryItemList } = getInventoryItem(
      originItemList,
      value,
      itemFKName,
      rows,
      purchaseOrderOutstandingItem,
    )

    this.setState({
      [`filter${stateName}`]: inventoryItemList,
    })

    this.forceUpdate()

    row.code = ''
    row.name = ''
    row.uom = ''
    row.orderQty = 0
    row.bonusQty = 0
    row.quantityReceived = 0
    row.totalBonusReceived = 0
    row.currentReceivingQty = 0
    row.currentReceivingBonusQty = 0

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

    this.setState({
      selectedItem: option,
      onClickColumn: 'item',
    })

    this.forceUpdate()

    return { ...row }
  }

  handleSelectedBatch = (e) => {
    // console.log('handleSelectedBatch', e)
    // const { option, row } = e
    // if (option) {
    //   const { expiryDate, stock, value, batchNo } = option
    //   row.batchNo = value
    //   row.expiryDate = expiryDate
    //   row.stock = stock
    //   row.batchNoString = batchNo
    //   this.setState({ selectedItem: e })
    // }
    // this.props.dispatch({
    //   // force current edit row components to update
    //   type: 'global/updateState',
    //   payload: {
    //     commitCount: (commitCount += 1),
    //   },
    // })
  }

  onCommitChanges = ({ rows, deleted, changed }) => {
    // console.log({ rows, changed })
    const { dispatch } = this.props

    if (deleted) {
      dispatch({
        type: 'deliveryOrderDetails/deleteRow',
        payload: deleted[0],
      })
    } else if (changed) {
      const existUid = Object.keys(changed)[0]
      dispatch({
        type: 'deliveryOrderDetails/upsertRow',
        payload: { uid: existUid, ...changed[existUid] },
      })
    } else {
      dispatch({
        type: 'deliveryOrderDetails/upsertRow',
        payload: rows[0],
      })
    }

    return rows
  }

  onAddedRowsChange = (addedRows) => {
    let newAddedRows = addedRows
    if (addedRows.length > 0) {
      if (!addedRows.isFocused) {
        const { onClickColumn, selectedItem } = this.state
        let tempRow = addedRows[0]
        let tempOrderQty = tempRow.orderQty
        let tempBonusQty = tempRow.bonusQty
        let tempQuantityReceived = tempRow.quantityReceived
        let tempTotalBonusReceived = tempRow.totalBonusReceived
        let tempCurrentReceivingQty = tempRow.currentReceivingQty
        let tempCurrentReceivingBonusQty = tempRow.currentReceivingBonusQty

        if (onClickColumn === 'type') {
          // Handle type changed
        } else if (onClickColumn === 'item') {
          const { deliveryOrderDetails } = this.props
          const { purchaseOrderDetails } = deliveryOrderDetails
          const { purchaseOrderOutstandingItem } = purchaseOrderDetails
          let osItem = purchaseOrderOutstandingItem.filter(
            (x) => x.code === selectedItem.value,
          )[0]

          return addedRows.map((row) => ({
            ...row,
            itemFK: selectedItem.value,
            orderQty: osItem.orderQty,
            bonusQty: osItem.bonusQty,
            quantityReceived: osItem.quantityReceived,
            totalBonusReceived: osItem.quantityReceived,
            currentReceivingQty: osItem.orderQty - osItem.quantityReceived,
            currentReceivingBonusQty: osItem.orderQty - osItem.bonusQty,
          }))
        } else {
          tempCurrentReceivingQty =
            tempOrderQty - tempQuantityReceived < tempCurrentReceivingQty
              ? ''
              : tempCurrentReceivingQty
          tempCurrentReceivingBonusQty =
            tempBonusQty - tempTotalBonusReceived < tempCurrentReceivingBonusQty
              ? ''
              : tempCurrentReceivingBonusQty
          this.forceUpdate()
        }

        this.setState({ onClickColumn: undefined })

        newAddedRows = addedRows.map((row) => ({
          ...row,
          orderQty: tempOrderQty,
          bonusQty: tempBonusQty,
          quantityReceived: tempQuantityReceived,
          totalBonusReceived: tempTotalBonusReceived,
          itemFK: selectedItem.value,
          currentReceivingQty: tempCurrentReceivingQty,
          currentReceivingBonusQty: tempCurrentReceivingBonusQty,
        }))
      } else {
        // Initialize new generated row
        this.setState({ onClickColumn: undefined })
        newAddedRows = addedRows.map((row) => ({
          ...row,
          orderQty: 0,
          bonusQty: 0,
          quantityReceived: 0,
          totalBonusReceived: 0,
          currentReceivingQty: 0,
          currentReceivingBonusQty: 0,
          isFocused: true,
        }))
      }
    }
    return newAddedRows
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

  stockOptions = (row) => {
    if (row.inventoryItemTypeFK === 1) {
      let array = [
        ...this.state.filterStockMedication,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      return x
    }
    if (row.inventoryItemTypeFK === 2) {
      let array = [
        ...this.state.filterStockVaccination,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      return x
    }
    if (row.inventoryItemTypeFK === 3) {
      let array = [
        ...this.state.filterStockConsumable,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      return x
    }
    return []
  }

  render () {
    const isEditable = true
    const { props } = this
    const { footer, values, theme } = props
    const { rows } = values

    const tableParas = {
      columns: [
        { name: 'type', title: 'Type' },
        { name: 'code', title: 'Code' },
        { name: 'name', title: 'Name' },
        { name: 'uom', title: 'UOM' },
        { name: 'orderQuantity', title: 'Order Qty' },
        { name: 'bonusQuantity', title: 'Bonus Qty' },
        { name: 'quantityReceived', title: 'Total Received' },
        { name: 'totalBonusReceived', title: 'Total Bonus Received' },
        { name: 'currentReceivingQty', title: 'Current Receiving Qty' },
        {
          name: 'currentReceivingBonusQty',
          title: 'Current Receiving Bonus Qty',
        },
        { name: 'batchNo', title: 'Batch No.' },
        { name: 'expiryDate', title: 'Expiry Date' },
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
          disabled: true,
        },
        {
          columnName: 'bonusQuantity',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'quantityReceived',
          type: 'number',
          disabled: true,
        },
        {
          columnName: 'totalBonusReceived',
          type: 'number',
          width: 180,
          disabled: true,
        },
        {
          columnName: 'currentReceivingQty',
          type: 'number',
          width: 150,
        },
        {
          columnName: 'currentReceivingBonusQty',
          type: 'number',
          width: 180,
        },
        {
          columnName: 'batchNo',
          type: 'select',
          mode: 'tags',
          maxSelected: 1,
          disableAll: true,
          options: (row) => {
            return this.stockOptions(row)
          },
          onChange: (e) => {
            this.handleSelectedBatch(e)
          },
        },
        {
          columnName: 'expiryDate',
          type: 'date',
          // disabled: this.state.expiryDateAvailability,
        },
      ],
      onRowDoubleClick: undefined,
    }

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          <GridContainer>
            <GridItem xs={12} md={5}>
              <GridContainer>
                <GridItem xs={12}>
                  <FastField
                    name='deliveryOrderNo'
                    render={(args) => {
                      return (
                        <TextField
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.deliveryOrderNo',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
                <GridItem xs={12}>
                  <FastField
                    name='deliveryOrderDate'
                    render={(args) => {
                      return (
                        <DatePicker
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.deliveryOrderDate',
                          })}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>

            <GridItem xs={12} md={1} />

            <GridItem xs={12} md={5}>
              <GridContainer>
                <GridItem xs={12}>
                  <FastField
                    name='remark'
                    render={(args) => {
                      return (
                        <OutlinedTextField
                          label={formatMessage({
                            id: 'inventory.pr.detail.dod.remarks',
                          })}
                          multiline
                          rowsMax={2}
                          rows={2}
                          {...args}
                        />
                      )
                    }}
                  />
                </GridItem>
              </GridContainer>
            </GridItem>
          </GridContainer>

          <GridItem xs={12} md={11}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.dod.receivingDetails',
              })}
            </h4>
          </GridItem>
          <div style={{ margin: theme.spacing(2) }}>
            <EditableTableGrid
              getRowId={(r) => r.uid}
              rows={rows}
              schema={receivingDetailsSchema}
              FuncProps={{
                // edit: isEditable,
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
          </div>
          {footer &&
            footer({
              align: 'center',
              onConfirm: props.handleSubmit,
              confirmBtnText: 'Save',
              confirmProps: {
                disabled: false,
              },
            })}
        </div>
      </React.Fragment>
    )
  }
}

export default DODetails
