import React, { PureComponent } from 'react'
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
  }),
  handleSubmit: (values, { props }) => {
    // console.log('submitting', values, props)
    const {
      inventoryAdjustmentItems,
      stockList,
      inventoryAdjustmentStatusString,
      // id,
      ...restValue
    } = values
    const { dispatch, onConfirm } = props
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
        const { batchNo, code, displayValue, adjustmentQty, ...value } = val
        return {
          ...value,
          // id: undefined,
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
        // id: undefined,
        [getType.typeName]: {
          batchNo: o.batchNoString,
          expiryDate: o.expiryDate,
          // [getType.itemFK]: o.id,
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
      },
      {
        columnName: 'batchNo',
        type: 'select',
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
      },
      {
        columnName: 'adjustmentQty',
        type: 'number',
      },
    ],
    columnEditingEnabled: false,
  }

  componentDidMount = async () => {
    const { dispatch, values, inventoryAdjustment, setValues } = this.props
    await this.initializeStateItemList()
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
    if (values.stockList) {
      const newStockList = values.stockList.map((o) => {
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
              }
            case 2:
              return {
                typeName: 'vaccination',
                codeName: 'vaccinationCode',
                nameName: 'vaccinationName',
                stockFK: 'vaccinationStockFK',
                itemFK: 'inventoryVaccinationFK',
                stateName: 'stockVaccination',
              }
            case 3:
              return {
                typeName: 'consumable',
                codeName: 'consumableCode',
                nameName: 'consumableName',
                stockFK: 'consumableStockFK',
                itemFK: 'inventoryConsumableFK',
                stateName: 'stockConsumable',
              }
            default:
              return {}
          }
        }
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
      return row.uid ? this.state.stockVaccination : x
    }
    if (row.inventoryTypeFK === 3) {
      let array = [
        ...this.state.filterStockConsumable,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)
      return row.uid ? this.state.stockConsumable : x
    }
    return []
  }

  filterStockOption = (e) => {
    const { option, row } = e
    if (row.batchNo) {
      this.setState((prevState) => {
        return {
          filterStockMedication: prevState.stockMedication.filter(
            (o) => o.batchNo !== option.batchNo,
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
      row.stock = stock
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

  handleSelectedItem = (e) => {
    const { option, row } = e
    if (option) {
      const { uom, value, code, name } = option
      row.code = value
      row.displayValue = value
      row.uomDisplayValue = uom
      row.codeString = code
      row.displayValueString = name
      this.setState({ selectedItem: e })
    }
  }

  onCommitChanges = ({ rows, deleted }) => {
    const { setValues, setFieldValue, values } = this.props
    const { stockList } = this.state
    if (deleted) {
      const deletedSet = new Set(deleted)
      const changedRows = rows.filter((row) => !deletedSet.has(row.id))
      // setFieldValue('inventoryAdjustmentItems', changedRows)
      if (stockList.length > 0) {
        this.setState({ stockList: changedRows })
      } else {
        this.setState({ inventoryAdjustmentItems: changedRows })
      }

      return changedRows
    }
    if (this.state.selectedItem) {
      this.filterStockOption(this.state.selectedItem)
    }
    this.setState({ inventoryAdjustmentItems: rows })
    setValues({
      ...values,
      inventoryAdjustmentItems: rows,
    })

    return rows
  }

  onAddedRowsChange = (addedRows) => {
    if (this.state.selectedItem) {
      let returnRows
      const { option } = this.state.selectedItem
      const { uom, expiryDate, stock } = option
      if (uom) {
        returnRows = addedRows.map((r) => ({
          ...r,
          uomDisplayValue: uom,
        }))
      } else {
        returnRows = addedRows.map((r) => ({
          ...r,
          stock,
          expiryDate,
        }))
      }

      this.props.dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })

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
    const { setFieldValue, setValues, values, handleSubmit } = this.props
    await setFieldValue('inventoryAdjustmentStatusFK', 2)
    // await setValues({
    //   ...values,
    //   inventoryAdjustmentStatusFK: 2,
    //   inventoryAdjustmentStatusString: 'Finalized',
    // })
    handleSubmit()
  }

  render () {
    const { props } = this
    const { theme, values, handleSubmit } = props
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
            EditingProps={{
              showAddCommand: values.inventoryAdjustmentStatusFK === 1,
              showEditCommand: values.inventoryAdjustmentStatusFK === 1,
              showDeleteCommand: values.inventoryAdjustmentStatusFK === 1,
              onCommitChanges: this.onCommitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
              // columnEditingEnabled: false,
              // editingEnabled: false,
            }}
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
