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
import AuthorizedContext from '@/components/Context/Authorized'

// let commitCount = 2201 // uniqueNumber

const receivingDetailsSchema = Yup.object().shape({
  type: Yup.number().required(),
  code: Yup.number().required(),
  name: Yup.number().required(),
  batchNo: Yup.array().when('expiryDate', {
    is: (v) => v === undefined || v === '',
    then: Yup.array().nullable(),
    otherwise: Yup.array().required(),
  }),
  expiryDate: Yup.string().nullable(),

  // orderQty: Yup.number().required(),
  // bonusQty: Yup.number().required(),
  // quantityReceived: Yup.number().min(0).required(),
  // totalBonusReceived: Yup.number().min(0).required(),
  currentReceivingQty: Yup.number()
    .min(0, 'Current Receiving Quantity must be greater than or equal to 0')
    .max(Yup.ref('maxCurrentReceivingQty'), (e) => {
      return `Current Receiving Quantity must be less than or equal to ${e.max.toFixed(
        1,
      )}`
    })
    .required(),
  // currentReceivingBonusQty: Yup.number()
  //   .min(
  //     0,
  //     'Current Receiving Bonus Quantity must be greater than or equal to 0',
  //   )
  //   .max(Yup.ref('maxCurrentReceivingBonusQty'), (e) => {
  //     return `Current Receiving Bonus Quantity must be less than or equal to ${e.max.toFixed(
  //       1,
  //     )}`
  //   })
  //   .required(),
})

@withFormikExtend({
  mapPropsToValues: ({ deliveryOrderDetails }) => {
    // console.log('DODetails', deliveryOrderDetails)
    return deliveryOrderDetails.entity
  },
  enableReinitialize: true,
  displayName: 'deliveryOrderDetails',
  validationSchema: Yup.object().shape({
    // deliveryOrderNo: Yup.string().required(),
    deliveryOrderDate: Yup.string().required(),
    rows: Yup.array().required('At least one item is required.'),
    // rows: Yup.array().compact((v) => v.isDeleted).of(receivingDetailsSchema),
    remark: Yup.string().max(500),
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

    const getPurchaseOrderItemFK = (v) => {
      if (v.id <= 0) {
        let itemFKName = ''
        switch (v.type) {
          case 1: {
            itemFKName = 'inventoryMedicationFK'
            break
          }
          case 2: {
            itemFKName = 'inventoryVaccinationFK'
            break
          }
          case 3: {
            itemFKName = 'inventoryConsumableFK'
            break
          }
          default: {
            break
          }
        }
        const { id } = rows.find((o) => o[itemFKName] === v[itemFKName])
        return id
      }
      if (values.id) {
        return v.purchaseOrderItemFK
      }
      return v.id
    }
    let deliveryOrderItem = rows.map((x, index) => {
      // const itemType = podoOrderType.find((y) => y.value === x.type)
      const {
        purchaseOrderMedicationItem,
        purchaseOrderVaccinationItem,
        purchaseOrderConsumableItem,
        ...restX
      } = x
      return {
        ...restX,
        // inventoryTransactionItemFK: 39, // Temporary hard code, will remove once Soe fix the API
        purchaseOrderItemFK: getPurchaseOrderItemFK(x),
        recevingQuantity: x.currentReceivingQty,
        bonusQuantity: x.currentReceivingBonusQty,
        isDeleted: x.isDeleted,
        batchNo: x.batchNo ? x.batchNo[0] : undefined,
        expiryDate: x.expiryDate,
        sortOrder: index + 1,
        id: values.id ? x.id : undefined,
      }
    })
    dispatch({
      type: 'deliveryOrderDetails/upsert',
      payload: {
        ...restValues,
        sequence: list ? list.length + 1 : 1,
        // inventoryTransactionFK: 26, // Temporary hard code, will remove once Soe fix the API
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
    await this.props.refreshDeliveryOrder()
    await this.initializeStateItemList()
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
          x.stockName,
        )
        this.setState({
          [x.stateName]: inventoryItemList,
        })
      })

      return null
    })

    // dispatch({
    //   // force current edit row components to update
    //   type: 'global/updateState',
    //   payload: {
    //     commitCount: (commitCount += 1),
    //   },
    // })
  }

  setOption = (m, c, v) => {
    if (!m.data || !c.data || !v.data) {
      return
    }
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
    const { purchaseOrderDetails, entity } = deliveryOrderDetails
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
      // purchaseOrderOutstandingItem,
      entity.rows,
    )

    this.setState({
      [`filter${stateName}`]: inventoryItemList,
    })

    // this.forceUpdate()

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
    const { option, row } = e
    const { value, remainingQty } = option
    if (type === 'code') {
      row.name = value
    } else {
      row.code = value
    }

    row.uom = value
    row.currentReceivingQty = remainingQty
    row.itemFK = value
    row.maxCurrentReceivingQty = remainingQty
    row.maxCurrentReceivingBonusQty = remainingQty

    const { deliveryOrderDetails } = this.props
    const { purchaseOrderDetails } = deliveryOrderDetails
    const { purchaseOrderOutstandingItem } = purchaseOrderDetails
    let osItem = purchaseOrderOutstandingItem.filter((x) => x.code === value)[0]

    row.orderQuantity = osItem.orderQuantity
    row.bonusQuantity = osItem.bonusQuantity
    row.quantityReceived = osItem.totalReceived
    row.totalBonusReceived = osItem.totalBonusReceived

    this.setState({
      selectedItem: option,
      onClickColumn: 'item',
    })

    // this.forceUpdate()

    return { ...row }
  }

  handleSelectedBatch = (e) => {
    // console.log('handleSelectedBatch', e)
    const { option, row, val } = e
    if (val) {
      row.batchNo = val[0]
    }
    if (option) {
      const { expiryDate, stock, value, batchNo } = option
      row.batchNo = value
    }
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
        payload: { uid: existUid, ...changed[existUid], gridRows: rows },
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
        let tempOrderQty = tempRow.orderQuantity
        let tempBonusQty = tempRow.bonusQuantity
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

          this.setState({ onClickColumn: undefined })
          return addedRows.map((row) => ({
            ...row,
            itemFK: selectedItem.value,
            orderQuantity: osItem.orderQuantity,
            bonusQuantity: osItem.bonusQuantity,
            quantityReceived: osItem.quantityReceived,
            totalBonusReceived: osItem.totalBonusReceived,
            // currentReceivingQty: osItem.orderQuantity - osItem.quantityReceived,
            // currentReceivingBonusQty:
            //   osItem.bonusQuantity - osItem.bonusReceived,
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
          // this.forceUpdate()
        }

        this.setState({ onClickColumn: undefined })

        newAddedRows = addedRows.map((row) => ({
          ...row,
          orderQuantity: tempOrderQty,
          bonusQuantity: tempBonusQty,
          quantityReceived: tempQuantityReceived,
          totalBonusReceived: tempTotalBonusReceived,
          itemFK: selectedItem.value,
          // currentReceivingQty: tempCurrentReceivingQty,
          // currentReceivingBonusQty: tempCurrentReceivingBonusQty,
        }))
      } else {
        // Initialize new generated row
        this.setState({ onClickColumn: undefined })
        newAddedRows = addedRows.map((row) => ({
          ...row,
          orderQuantity: 0,
          bonusQuantity: 0,
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

  getItemOptions = (row, filteredStateName, stateName) => {
    const { code, isNew } = row
    if (code !== '') {
      return this.state[stateName].filter((o) => o.value === code)
    }
    return isNew ? this.state[filteredStateName] : this.state[stateName]
  }

  rowOptions = (row) => {
    if (row.type === 1) {
      return this.getItemOptions(
        row,
        'filterMedicationItemList',
        'MedicationItemList',
      )
    }
    if (row.type === 2) {
      return this.getItemOptions(
        row,
        'filterVaccinationItemList',
        'VaccinationItemList',
      )
    }
    if (row.type === 3) {
      return this.getItemOptions(
        row,
        'filterConsumableItemList',
        'ConsumableItemList',
      )
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
    const {
      footer,
      values,
      theme,
      refreshDeliveryOrder,
      errors,
      classes,
    } = props
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
          isDisabled: () => !!values.id,
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
          isDisabled: () => !!values.id,
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
          isDisabled: () => !!values.id,
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
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'orderQuantity',
          type: 'number',
          format: '0.0',
          disabled: true,
          width: 90,
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'bonusQuantity',
          type: 'number',
          format: '0.0',
          disabled: true,
          width: 90,
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'quantityReceived',
          type: 'number',
          format: '0.0',
          disabled: true,
          width: 120,
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'totalBonusReceived',
          type: 'number',
          format: '0.0',
          disabled: true,
          width: 150,
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'currentReceivingQty',
          type: 'number',
          format: '0.0',
          width: 150,
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'currentReceivingBonusQty',
          type: 'number',
          format: '0.0',
          width: 200,
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'batchNo',
          type: 'select',
          mode: 'tags',
          maxSelected: 1,
          labelField: 'batchNo',
          disableAll: true,
          options: (row) => {
            if (row.type === 1) {
              return this.state.MedicationItemList.find(
                (o) => o.itemFK === row.code,
              ).stock
            }
            if (row.type === 2) {
              return this.state.VaccinationItemList.find(
                (o) => o.itemFK === row.code,
              ).stock
            }
            if (row.type === 3) {
              return this.state.ConsumableItemList.find(
                (o) => o.itemFK === row.code,
              ).stock
            }
            return []
          },
          onChange: (e) => {
            // this.handleSelectedBatch(e)
          },
          render: (row) => {
            return <TextField text value={row.batchNo} />
          },
          isDisabled: () => !!values.id,
        },
        {
          columnName: 'expiryDate',
          type: 'date',
          isDisabled: () => !!values.id,
        },
      ],
      onRowDoubleClick: undefined,
    }

    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(2) }}>
          <GridContainer>
            <AuthorizedContext.Provider
              value={{
                rights: values.id ? 'disable' : 'enable',
                // rights: 'disable',
              }}
            >
              <GridItem xs={12} md={5}>
                <GridContainer>
                  <GridItem xs={12}>
                    <FastField
                      name='deliveryOrderNo'
                      render={(args) => {
                        return (
                          <TextField
                            autoFocus
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
            </AuthorizedContext.Provider>
          </GridContainer>

          <GridItem xs={12} md={11}>
            <h4 style={{ marginTop: 20, fontWeight: 'bold' }}>
              {formatMessage({
                id: 'inventory.pr.detail.dod.receivingDetails',
              })}
            </h4>
          </GridItem>
          <div style={{ margin: theme.spacing(2) }}>
            {errors.rows && (
              <p className={classes.errorMsgStyle}>{errors.rows}</p>
            )}

            <EditableTableGrid
              getRowId={(r) => r.uid}
              rows={rows}
              // schema={values.id ? {} : receivingDetailsSchema}
              schema={receivingDetailsSchema}
              FuncProps={{
                // edit: isEditable,
                pager: false,
              }}
              EditingProps={{
                showAddCommand: isEditable,
                showEditCommand: !values.id,
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
            })}
        </div>
      </React.Fragment>
    )
  }
}

export default DODetails
