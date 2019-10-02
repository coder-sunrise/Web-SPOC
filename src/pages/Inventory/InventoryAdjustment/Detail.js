import React, { PureComponent } from 'react'
import _ from 'lodash'
import Yup from '@/utils/yup'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  Select,
  EditableTableGrid,
  Button,
  OutlinedTextField,
  Field,
  ProgressButton,
} from '@/components'
import { podoOrderType, getInventoryItemList } from '@/utils/codes'

const styles = (theme) => ({})
let commitCount = 1000 // uniqueNumber

@withFormikExtend({
  mapPropsToValues: ({ inventoryAdjustment, runningNo }) => {
    const value = inventoryAdjustment.entity || inventoryAdjustment.default
    return {
      ...value,
      adjustmentTransactionNo: value.adjustmentTransactionNo || runningNo,
    }
  },
  validationSchema: Yup.object().shape({
    adjustmentTransactionDate: Yup.date().required(),
    remarks: Yup.string().max(2000, 'Max 2000 characters for remarks.'),
  }),
  handleSubmit: (values, { props }) => {
    const {
      inventoryAdjustmentItems,
      stockList,
      inventoryAdjustmentStatusString,
      ...restValue
    } = values

    const { dispatch, onConfirm, getRunningNo } = props

    const list = inventoryAdjustmentItems || stockList
    const newInventoryAdjustmentItem = list.map((o) => {
      const type = (v) => {
        switch (v) {
          case 1:
            return {
              typeName: 'medication',
              codeName: 'medicationCode',
              nameName: 'medicationName',
              stockFK: 'medicationStockFK',
              itemFK: 'inventoryMedicationFK',
            }
          case 2:
            return {
              typeName: 'vaccination',
              codeName: 'vaccinationCode',
              nameName: 'vaccinationName',
              stockFK: 'vaccinationStockFK',
              itemFK: 'inventoryVaccinationFK',
            }
          case 3:
            return {
              typeName: 'consumable',
              codeName: 'consumableCode',
              nameName: 'consumableName',
              stockFK: 'consumableStockFK',
              itemFK: 'inventoryConsumableFK',
            }
          default:
            return {}
        }
      }
      const getType = type(o.inventoryTypeFK)

      if (list === inventoryAdjustmentItems) {
        const { restValues, ...val } = o
        const { batchNo, code, displayValue, ...value } = val
        console.log('as', o, val, getType)
        return {
          ...value,
          [getType.typeName]: {
            ...restValues,
            batchNo: o.batchNoString || o[getType.typeName].batchNo,
            expiryDate: o.expiryDate,
            [getType.itemFK]: o.code,
            [getType.stockFK]: o.batchNo,
            [getType.codeName]:
              o.codeString || o[getType.typeName][getType.codeName],
            [getType.nameName]:
              o.displayValueString || o[getType.typeName][getType.nameName],
          },
        }
      }
      return {
        ...o,
        [getType.typeName]: {
          batchNo: o.batchNoString,
          expiryDate: o.expiryDate,
          [getType.stockFK]: o.id,
          [getType.codeName]: o.code,
          [getType.nameName]: o.displayValue,
        },
      }
    })
    dispatch({
      type: 'inventoryAdjustment/upsert',
      payload: {
        ...restValue,
        inventoryAdjustmentStatus: inventoryAdjustmentStatusString,
        inventoryAdjustmentItems: newInventoryAdjustmentItem,
      },
    }).then((r) => {
      if (r) {
        if (onConfirm) onConfirm()
        dispatch({
          type: 'inventoryAdjustment/query',
        })
        getRunningNo()
      }
    })
  },
  displayName: 'InventoryAdjustment',
})
class Detail extends PureComponent {
  state = {
    type: undefined,
    ConsumableItemList: [],
    MedicationItemList: [],
    VaccinationItemList: [],

    filterConsumableItemList: [],
    filterMedicationItemList: [],
    filterVaccinationItemList: [],

    selectedItem: null,
    selectedBatch: null,
    inventoryAdjustmentItems: [],

    stockMedication: [], // medication
    stockVaccination: [], // vaccination
    stockConsumable: [], // consumable

    filterStockMedication: [], // medication
    filterStockVaccination: [], // vaccination
    filterStockConsumable: [], // consumable
    stockList: [],
  }

  tableParas = {
    columns: [
      {
        name: 'inventoryTypeFK',
        title: 'Type',
      },
      { name: 'code', title: 'Code' },
      { name: 'displayValue', title: 'Name' },
      { name: 'uomDisplayValue', title: 'UOM' },
      { name: 'batchNo', title: 'Batch #' },
      { name: 'expiryDate', title: 'Expiry Date' },
      { name: 'stock', title: 'Current Stock' },
      { name: 'adjustmentQty', title: 'Adjustment Qty' },
    ],
    columnExtensions: [
      {
        columnName: 'inventoryTypeFK',
        type: 'select',
        options: [
          { value: 1, name: 'Medication' },
          { value: 3, name: 'Consumable' },
          { value: 2, name: 'Vaccination' },
        ],
        onChange: (e) => {
          this.setState({ type: `inventory${e.val}` })
          this.props.dispatch({
            // force current edit row components to update
            type: 'global/updateState',
            payload: {
              commitCount: (commitCount += 1),
            },
          })
        },
      },
      {
        columnName: 'code',
        type: 'select',
        labelField: 'code',
        autoComplete: true,
        options: (row) => {
          return this.rowOptions(row)
        },
        onChange: (e) => {
          this.handleSelectedItem(e)
        },
      },
      {
        columnName: 'displayValue',
        type: 'select',
        labelField: 'name',
        autoComplete: true,
        options: (row) => {
          return this.rowOptions(row)
        },
        onChange: (e) => {
          this.handleSelectedItem(e)
        },
      },
      {
        columnName: 'uomDisplayValue',
        disabled: true,
        // type: 'number',
      },
      {
        columnName: 'batchNo',
        type: 'select',
        autoComplete: true,
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
        disabled: true,
      },
      {
        columnName: 'stock',
        disabled: true,
        type: 'number',
        qty: true,
      },
      {
        columnName: 'adjustmentQty',
        type: 'number',
        format: '0.0',
        qty: true,
      },
    ],
    columnEditingEnabled: false,
  }

  componentDidMount = async () => {
    const { dispatch, values, inventoryAdjustment, setValues } = this.props
    await this.initializeStateItemList()
    const type = (v) => {
      switch (v) {
        case 1:
          return {
            typeName: 'medication',
            codeName: 'medicationCode',
            nameName: 'medicationName',
            stockFK: 'medicationStockFK',
            itemFK: 'inventoryMedicationFK',
            stateName: 'stockMedication',
            filterStateName: 'filterStockMedication',
          }
        case 2:
          return {
            typeName: 'vaccination',
            codeName: 'vaccinationCode',
            nameName: 'vaccinationName',
            stockFK: 'vaccinationStockFK',
            itemFK: 'inventoryVaccinationFK',
            stateName: 'stockVaccination',
            filterStateName: 'filterStockVaccination',
          }
        case 3:
          return {
            typeName: 'consumable',
            codeName: 'consumableCode',
            nameName: 'consumableName',
            stockFK: 'consumableStockFK',
            itemFK: 'inventoryConsumableFK',
            stateName: 'stockConsumable',
            filterStateName: 'filterStockConsumable',
          }
        default:
          return {}
      }
    }
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
    if (values.stockList) {
      const newStockList = values.stockList.map((o) => {
        const getType = type(o.inventoryTypeFK)
        // const stockId = o[getType.typeName][getType.stockFK]
        this.setState((prevState) => {
          return {
            [getType.filterStateName]: prevState[
              getType.filterStateName
            ].filter((j) => j.id !== o.id),
          }
        })

        return {
          ...o,
          batchNo: o.id,
          code: o.inventoryItemFK,
          displayValue: o.inventoryItemFK,
        }
      })

      this.setState({ stockList: newStockList })
    } else if (inventoryAdjustment.entity) {
      const { inventoryAdjustmentItems } = inventoryAdjustment.entity
      const newList = inventoryAdjustmentItems.map((o) => {
        const getType = type(o.inventoryTypeFK)
        return {
          ...o,
          code: o[getType.typeName][getType.itemFK],
          displayValue: o[getType.typeName][getType.itemFK],
          batchNo: o[getType.typeName][getType.stockFK],
          expiryDate: this.state[getType.stateName].find(
            (i) => i.id === o[getType.typeName][getType.stockFK],
          ).expiryDate,
          stock: this.state[getType.stateName].find(
            (i) => i.id === o[getType.typeName][getType.stockFK],
          ).stock,
          restValues: o[getType.typeName],
        }
      })
      this.setState({ inventoryAdjustmentItems: newList })
      await setValues({
        ...values,
        inventoryAdjustmentItems: newList,
      })

      values.inventoryAdjustmentItems.forEach((o) => {
        const getType = type(o.inventoryTypeFK)
        const stockId = o[getType.typeName][getType.stockFK]
        this.setState((prevState) => {
          return {
            [getType.filterStateName]: prevState[
              getType.filterStateName
            ].filter((j) => j.id !== stockId),
          }
        })
      })
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
        const { inventoryItemList } = getInventoryItemList(
          list,
          x.itemFKName,
          x.stateName,
        )
        this.setState({
          [x.stateName]: inventoryItemList,
        })
      })
    })

    const result = []
    for (let i = 1; i < 4; i++) {
      result.push(
        dispatch({
          type: 'inventoryAdjustment/getStockDetails',
          payload: {
            id: i,
          },
        }),
      )
    }

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
        value: o.id,
      }
    })
    const vOptions = v.data.map((o) => {
      return {
        ...o,
        name: o.batchNo,
        value: o.id,
      }
    })

    const cOptions = c.data.map((o) => {
      return {
        ...o,
        name: o.batchNo,
        value: o.id,
      }
    })

    this.setState({ stockMedication: mOptions })
    this.setState({ stockVaccination: vOptions })
    this.setState({ stockConsumable: cOptions })
    this.setState({ filterStockMedication: mOptions })
    this.setState({ filterStockVaccination: vOptions })
    this.setState({ filterStockConsumable: cOptions })
  }

  rowOptions = (row) => {
    if (row.inventoryTypeFK === 1) {
      return this.state.MedicationItemList
    }
    if (row.inventoryTypeFK === 2) {
      return this.state.VaccinationItemList
    }
    if (row.inventoryTypeFK === 3) {
      return this.state.ConsumableItemList
    }
    return []
  }

  stockOptions = (row) => {
    if (row.inventoryTypeFK === 1) {
      let array = [
        ...this.state.filterStockMedication,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      // return this.state.stockMedication
      return row.id ? this.state.stockMedication : x
    }
    if (row.inventoryTypeFK === 2) {
      let array = [
        ...this.state.filterStockVaccination,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      return row.id ? this.state.stockVaccination : x
    }
    if (row.inventoryTypeFK === 3) {
      let array = [
        ...this.state.filterStockConsumable,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      return row.id ? this.state.stockConsumable : x
    }
    return []
  }

  filterStockOption = (e) => {
    const { option, row } = e
    console.log('filter', option, row)
    if (row.batchNo) {
      const getState = this.type(row.inventoryTypeFK)
      this.setState((prevState) => {
        return {
          [getState.filteredStateName]: prevState[getState.stateName].filter(
            (o) => o.id !== row.batchNo,
          ),
        }
      })
    }
  }

  handleSelectedBatch = (e) => {
    const { option, row } = e
    if (option) {
      const { expiryDate, stock, value, batchNo } = option
      row.batchNo = value
      row.expiryDate = expiryDate
      // row.stock = stock
      row.batchNoString = batchNo
      this.setState({ selectedItem: e })
    }

    this.props.dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  type = (v) => {
    switch (v) {
      case 1:
        return {
          stateName: 'stockMedication',
          filteredStateName: 'filterStockMedication',
        }
      case 2:
        return {
          stateName: 'stockVaccination',
          filteredStateName: 'filterStockVaccination',
        }
      case 3:
        return {
          stateName: 'stockConsumable',
          filteredStateName: 'filterStockConsumable',
        }
      default:
        return {}
    }
  }

  handleSelectedItem = (e) => {
    const { option, row } = e
    if (option) {
      const { uom, value, code, name } = option
      console.log('handleOption', option, uom)
      this.setState({ selectedItem: e })
      row.code = value
      row.displayValue = value
      row.uomDisplayValue = uom
      row.codeString = code
      row.displayValueString = name

      console.log('row', row)

      if (row.inventoryTypeFK && row.code && !row.batchNo) {
        const getState = this.type(row.inventoryTypeFK)
        const defaultStock = this.state[getState.filteredStateName].find(
          (j) =>
            j.inventoryItemFK === row.code && j.batchNo === 'Not Applicable',
        )

        if (defaultStock) {
          row.batchNo = defaultStock.id
          row.stock = defaultStock.stock

          this.setState({ selectedBatch: defaultStock })
        }
      }
    }

    this.props.dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  onCommitChanges = ({ rows, deleted, added }) => {
    const { setValues, setFieldValue, values } = this.props
    const { stockList, stockMedication } = this.state

    if (deleted) {
      const deletedSet = new Set(deleted)

      const deletedRow = rows.find((row) => deletedSet.has(row.id))

      deletedRow.isDeleted = true

      const changedRows = rows.filter((row) => !deletedSet.has(row.id))

      if (deletedRow.batchNo) {
        const getState = this.type(deletedRow.inventoryTypeFK)

        const stockItem = this.state[getState.stateName].find(
          (o) => o.id === deletedRow.batchNo,
        )
        this.setState((prevState) => {
          return {
            [getState.filteredStateName]: [
              ...prevState[getState.filteredStateName],
              stockItem,
            ],
          }
        })
      }

      if (stockList.length > 0) {
        this.setState({ stockList: rows })
      } else {
        this.setState({ inventoryAdjustmentItems: rows })
      }
      setValues({
        ...values,
        inventoryAdjustmentItems: rows,
      })

      return rows
    }
    if (this.state.selectedItem) {
      this.filterStockOption(this.state.selectedItem)
    }

    // if (rows.length > 0) {
    //   rows.forEach((o) => {
    //     if (o.id < 0 && !o.batchNo) {
    //       const getState = type(o.inventoryTypeFK)
    //       const defaultStock = this.state[getState.filteredStateName].find(
    //         (j) =>
    //           j.inventoryItemFK === o.code && j.batchNo === 'Not Applicable',
    //       )

    //       o.batchNo = defaultStock.id
    //       o.stock = defaultStock.stock
    //     }
    //   })
    // }

    this.setState({ inventoryAdjustmentItems: rows })
    setValues({
      ...values,
      inventoryAdjustmentItems: rows,
    })

    this.setState({ selectedBatch: undefined })
    this.setState({ selectedItem: undefined })

    return rows
  }

  onAddedRowsChange = (addedRows) => {
    let returnRows
    if (this.state.selectedItem) {
      const { option } = this.state.selectedItem
      const { uom, expiryDate, stock } = option
      console.log('option', option)
      if (uom) {
        returnRows = addedRows.map((r) => ({
          ...r,
          uomDisplayValue: 123,
        }))
        // this.props.dispatch({
        //   // force current edit row components to update
        //   type: 'global/updateState',
        //   payload: {
        //     commitCount: (commitCount += 1),
        //   },
        // })
      } else {
        returnRows = addedRows.map((r) => ({
          ...r,
          stock,
          expiryDate,
        }))
      }
      console.log(returnRows, 'returnRows')

      // this.props.dispatch({
      //   // force current edit row components to update
      //   type: 'global/updateState',s
      //   payload: {
      //     commitCount: (commitCount += 1),
      //   },
      // })

      if (this.state.selectedBatch && returnRows) {
        // const { stock } = this.state.selectedItem
        returnRows = returnRows.map((r) => ({
          ...r,
          stock: this.state.selectedBatch.stock,
          batchNoString: this.state.selectedBatch.batchNo,
        }))
      }
      return returnRows
    }

    return addedRows
  }

  handleCancel = () => {
    this.props.dispatch({
      type: 'inventoryAdjustment/updateState',
      payload: {
        showModal: false,
      },
    })
  }

  updateStatus = async () => {
    const { setFieldValue, handleSubmit, errors } = this.props
    if (_.isEmpty(errors)) {
      await setFieldValue('inventoryAdjustmentStatusFK', 2)
    }
    handleSubmit()
  }

  render () {
    const { props } = this
    const { theme, values, handleSubmit, getRunningNo } = props
    const cfg = {}
    if (values.inventoryAdjustmentStatusFK !== 1) {
      cfg.onRowDoubleClick = undefined
    }
    const inventoryAdjustmentSchema = Yup.object().shape({
      inventoryTypeFK: Yup.number().required(),
      code: Yup.number().required(),
      displayValue: Yup.number().required(),
      batchNo: Yup.number().required(),
      adjustmentQty: Yup.number()
        .min(-9999.9, 'Adjustment Qty must between -9,999.9 and 9,999.9')
        .max(9999.9, 'Adjustment Qty must between -9,999.9 and 9,999.9'),
    })
    // console.log('state', this.state)
    return (
      <React.Fragment>
        <div style={{ margin: theme.spacing(1) }}>
          <GridContainer>
            <GridItem md={6}>
              <GridItem md={12}>
                <FastField
                  name='adjustmentTransactionNo'
                  render={(args) => (
                    <TextField label='Transaction No' disabled {...args} />
                  )}
                />
              </GridItem>
              <GridItem md={12}>
                <Field
                  name='adjustmentTransactionDate'
                  render={(args) => (
                    <DatePicker
                      label='Transaction Date'
                      {...args}
                      disabled={values.inventoryAdjustmentStatusFK !== 1}
                    />
                  )}
                />
              </GridItem>

              <GridItem md={12}>
                <FastField
                  name='inventoryAdjustmentStatusFK'
                  render={(args) => {
                    return (
                      <Select
                        label='Status'
                        options={[
                          { value: 1, name: 'Draft' },
                          { value: 2, name: 'Finalized' },
                          { value: 3, name: 'Discarded' },
                        ]}
                        disabled
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridItem>
            <GridItem md={6}>
              <Field
                name='remarks'
                render={(args) => {
                  return (
                    <OutlinedTextField
                      label='Remarks'
                      multiline
                      rowsMax={2}
                      rows={2}
                      disabled={values.inventoryAdjustmentStatusFK !== 1}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>

          <EditableTableGrid
            style={{ marginTop: 10 }}
            FuncProps={{
              edit: values.inventoryAdjustmentStatusFK === 1,
              pager: false,
              addNewLabelName: 'New Inventory Adjustment',
            }}
            schema={inventoryAdjustmentSchema}
            EditingProps={{
              showAddCommand: values.inventoryAdjustmentStatusFK === 1,
              showEditCommand: values.inventoryAdjustmentStatusFK === 1,
              showDeleteCommand: values.inventoryAdjustmentStatusFK === 1,
              onCommitChanges: this.onCommitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
              // columnEditingEnabled: false,
              // editingEnabled: false,
            }}
            {...cfg}
            rows={
              this.state.inventoryAdjustmentItems.length === 0 ? (
                this.state.stockList
              ) : (
                this.state.inventoryAdjustmentItems
              )
            }
            {...this.tableParas}
          />
          <GridContainer
            direction='row'
            justify='flex-end'
            alignItems='flex-end'
          >
            <Button color='danger' onClick={() => this.handleCancel()}>
              Cancel
            </Button>
            <ProgressButton
              submitKey='inventoryAdjustment/submit'
              onClick={handleSubmit}
              disabled={values.inventoryAdjustmentStatusFK !== 1}
            />
            <Button
              color='info'
              type='submit'
              onClick={this.updateStatus}
              disabled={values.inventoryAdjustmentStatusFK !== 1}
            >
              Finalize
            </Button>
          </GridContainer>
        </div>
      </React.Fragment>
    )
  }
}

export default Detail
