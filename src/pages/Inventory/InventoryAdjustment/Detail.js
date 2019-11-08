import React, { PureComponent } from 'react'
import _ from 'lodash'
import { withStyles } from '@material-ui/core'
import Yup from '@/utils/yup'
import { INVENTORY_TYPE, INVENTORY_ADJUSTMENT_STATUS } from '@/utils/constants'
import {
  inventoryAdjustmentStatus,
  podoOrderType,
  getInventoryItemList,
} from '@/utils/codes'
import {
  withFormikExtend,
  FastField,
  GridContainer,
  GridItem,
  TextField,
  DatePicker,
  Select,
  EditableTableGrid,
  OutlinedTextField,
  Field,
  ProgressButton,
} from '@/components'

const styles = (theme) => ({
  errorMessage: {
    margin: theme.spacing(2),
    color: '#cf1322',
    fontSize: ' 0.75rem',
    minHeight: '1em',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: 400,
    lineHeight: '1em',
    letterSpacing: ' 0.03333em',
  },
})
let commitCount = 1000 // uniqueNumber

// const inventoryAdjustmentSchema = Yup.object().shape({
//   inventoryTypeFK: Yup.number().required(),
//   code: Yup.number().required(),
//   displayValue: Yup.number().required(),
//   batchNo: Yup.array().when('expiryDate', {
//     is: (v) => v === undefined || v === '',
//     then: Yup.array().nullable(),
//     otherwise: Yup.array().required(),
//   }),
//   adjustmentQty: Yup.number()
//     .min(-9999.9, 'Adjustment Qty must between -9,999.9 and 9,999.9')
//     .max(9999.9, 'Adjustment Qty must between -9,999.9 and 9,999.9'),
// })

@withFormikExtend({
  mapPropsToValues: ({ inventoryAdjustment }) => {
    const value = inventoryAdjustment.entity || inventoryAdjustment.default
    return {
      ...value,
      // adjustmentTransactionNo: value.adjustmentTransactionNo || runningNo,
    }
  },
  validationSchema: Yup.object().shape({
    adjustmentTransactionDate: Yup.date().required(),
    remarks: Yup.string().max(2000, 'Max 2000 characters for remarks.'),
    // inventoryAdjustmentItems: Yup.array().when('stockList', {
    //   is: (v) => !v || v.length === 0,
    //   then: Yup.array()
    //     .compact((v) => v.isDeleted)
    //     .of(inventoryAdjustmentSchema)
    //     .required('At least one item is required.'),
    // }),
  }),
  handleSubmit: (values, { props, resetForm }) => {
    const {
      inventoryAdjustmentItems,
      stockList,
      inventoryAdjustmentStatusString,
      batchNo,
      ...restValue
    } = values
    const { dispatch, onConfirm } = props

    const list =
      inventoryAdjustmentItems.length > 0 ? inventoryAdjustmentItems : stockList
    console.log('list', inventoryAdjustmentItems, stockList)
    const newInventoryAdjustmentItem = list.map((o) => {
      const type = (v) => {
        switch (v) {
          case INVENTORY_TYPE.MEDICATION:
            return {
              typeName: 'medication',
              codeName: 'medicationCode',
              nameName: 'medicationName',
              stock: 'medicationStock',
              stockFK: 'medicationStockFK',
              itemFK: 'inventoryMedicationFK',
            }
          case INVENTORY_TYPE.VACCINATION:
            return {
              typeName: 'vaccination',
              codeName: 'vaccinationCode',
              nameName: 'vaccinationName',
              stock: 'vaccinationStock',
              stockFK: 'vaccinationStockFK',
              itemFK: 'inventoryVaccinationFK',
            }
          case INVENTORY_TYPE.CONSUMABLE:
            return {
              typeName: 'consumable',
              codeName: 'consumableCode',
              nameName: 'consumableName',
              stock: 'consumableStock',
              stockFK: 'consumableStockFK',
              itemFK: 'inventoryConsumableFK',
            }
          default:
            return {}
        }
      }
      const getType = type(o.inventoryTypeFK)

      const stockFK = o.isManuallyCreated ? undefined : o.stockFK
      const getBatchNo = () => {
        if (o.batchNo) {
          if (Array.isArray(o.batchNo)) return o.batchNo[0]
          return o.batchNo
        }
        return o[getType.typeName].batchNo
      }
      if (list === inventoryAdjustmentItems) {
        const { restValues, ...val } = o
        const { code, displayValue, ...value } = val
        let newQty = 0
        if (val.stock) newQty += val.stock
        if (val.adjustmentQty) newQty += val.adjustmentQty
        console.log('check123', { o })
        const getExpiryDate = () => {
          if (o.expiryDate) {
            return o.expiryDate
          }
          if (o[getType.typeName] && o[getType.typeName][getType.stockFK])
            return o[getType.typeName].expiryDate
          return undefined
        }

        const getStockFK = () => {
          if (o.isManuallyCreated) return undefined
          if (o.stockFK) return o.stockFK
          if (o[getType.typeName]) return o[getType.typeName][getType.stockFK]
          return undefined
        }
        return {
          ...value,
          newQty,
          id: o.getFromApi ? undefined : o.id,
          [getType.typeName]: {
            ...o[getType.typeName],
            [getType.stock]: undefined,
            batchNo: getBatchNo(), // || o[getType.typeName].batchNo,
            expiryDate: getExpiryDate(),
            [getType.itemFK]: o.code || o[getType.typeName][getType.itemFK],
            [getType.stockFK]: getStockFK(),
            [getType.codeName]:
              o.codeString || o[getType.typeName][getType.codeName], // || o[getType.typeName][getType.codeName],
            [getType.nameName]:
              o.displayValueString || o[getType.typeName][getType.codeName], // || o[getType.typeName][getType.nameName],
          },
        }
      }
      return {
        ...o,
        batchNo: getBatchNo(),
        id: o.getFromApi ? undefined : o.id,
        [getType.typeName]: {
          batchNo: getBatchNo(),
          expiryDate: o.expiryDate,
          [getType.stockFK]: stockFK,
          [getType.codeName]: o.code,
          [getType.nameName]: o.displayValue,
        },
      }
    })
    console.log('submit123', newInventoryAdjustmentItem)
    dispatch({
      type: 'inventoryAdjustment/upsert',
      payload: {
        ...restValue,
        inventoryAdjustmentStatus: inventoryAdjustmentStatusString,
        inventoryAdjustmentItems: newInventoryAdjustmentItem,
      },
    }).then((r) => {
      if (r) {
        resetForm()
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
    selectedBatch: null,
    inventoryAdjustmentItems: [],

    stockMedication: [], // medication
    stockVaccination: [], // vaccination
    stockConsumable: [], // consumable

    filterStockMedication: [], // medication
    filterStockVaccination: [], // vaccination
    filterStockConsumable: [], // consumable
    stockList: [],
    editingRowIds: [],
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
          { value: INVENTORY_TYPE.MEDICATION, name: 'Medication' },
          { value: INVENTORY_TYPE.CONSUMABLE, name: 'Consumable' },
          { value: INVENTORY_TYPE.VACCINATION, name: 'Vaccination' },
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
        width: 250,
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
        width: 90,
      },
      {
        columnName: 'batchNo',
        type: 'select',
        mode: 'tags',
        valueField: 'name',
        maxSelected: 1,
        disableAll: true,
        options: (row) => {
          return this.stockOptions(row)
        },
        onChange: (e) => {
          console.log({ e })
          this.handleSelectedBatch(e)
        },
        render: (row) => {
          return <TextField text value={row.batchNo} />
        },
      },
      {
        columnName: 'expiryDate',
        type: 'date',
        isDisabled: (row) => this.isDisabled(row),
        width: 150,
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

  isDisabled = (row) => {
    if (row.isManuallyCreated === true) return false
    if (
      row.restValues &&
      (row.restValues.medicationStockFK ||
        row.restValues.consumableStockFK ||
        row.restValues.vaccinationStockFK)
    ) {
      return true
    }
    return false
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
        // const getType = this.type(o.inventoryTypeFK)
        // const stockId = o[getType.typeName][getType.stockFK]
        // this.setState((prevState) => {
        //   return {
        //     [getType.filterStateName]: prevState[
        //       getType.filterStateName
        //     ].filter((j) => j.id !== o.id),
        //   }
        // })
        // const { batchNo } = this.state[getType.filterStateName].find((j) =>
        //   console.log(j, j.id, o.id),
        // )
        return {
          ...o,
          batchNo: [
            o.batchNo,
          ],
          batchNoString: o.batchNo || '', // TODO: not sure want to pass empty string or not
          stockFK: o.id,
          code: o.inventoryItemFK,
          codeString: o.code,
          displayValue: o.inventoryItemFK,
          displayValueString: o.displayValue,
          getFromApi: true,
        }
      })
      console.log('sstockList', newStockList)
      this.setState({ stockList: newStockList })
      setValues({ ...values, stockList: newStockList })
    } else if (inventoryAdjustment.entity) {
      const { inventoryAdjustmentItems } = inventoryAdjustment.entity
      if (inventoryAdjustmentItems) {
        // console.log({ inventoryAdjustmentItems })
        const newList = inventoryAdjustmentItems.map((o) => {
          const getType = this.type(o.inventoryTypeFK)
          return {
            ...o,
            code: o[getType.typeName][getType.itemFK],
            displayValue: o[getType.typeName][getType.itemFK],
            batchNo: [
              o[getType.typeName].batchNo,
            ],
            expiryDate: o[getType.typeName].expiryDate,
            stock: o[getType.typeName][getType.stock]
              ? o[getType.typeName][getType.stock].stock
              : undefined,
            restValues: o[getType.typeName],
            [getType.typeName]: {
              ...o[getType.typeName],
              [getType.stock]: undefined,
            },
          }
        })
        // console.log({ newList })
        this.setState({ inventoryAdjustmentItems: newList })
        // values.inventoryAdjustmentItems.forEach((o) => {
        //   const getType = this.type(o.inventoryTypeFK)
        //   const stockId = o[getType.typeName][getType.stockFK]
        //   this.setState((prevState) => {
        //     return {
        //       [getType.filterStateName]: prevState[
        //         getType.filterStateName
        //       ].filter((j) => j.id !== stockId),
        //     }
        //   })
        // })
      }
      // await setValues({
      //   ...values,
      //   inventoryAdjustmentItems: newList,
      // })
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
      consumable,
      vaccination,
    ] = await Promise.all(result)

    this.setOption(medication, consumable, vaccination)

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }

  setOption = (m, c, v) => {
    if (!m.data || !c.data || !v.data) {
      return
    }
    const mOptions = m.data.map((o) => {
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

    const vOptions = v.data.map((o) => {
      return {
        ...o,
        name: o.batchNo,
        value: o.id,
      }
    })

    this.setState({ stockMedication: mOptions })
    this.setState({ stockConsumable: cOptions })
    this.setState({ stockVaccination: vOptions })
    this.setState({ filterStockMedication: mOptions })
    this.setState({ filterStockConsumable: cOptions })
    this.setState({ filterStockVaccination: vOptions })
  }

  rowOptions = (row) => {
    if (row.inventoryTypeFK === INVENTORY_TYPE.MEDICATION) {
      return this.state.MedicationItemList
    }
    if (row.inventoryTypeFK === INVENTORY_TYPE.VACCINATION) {
      return this.state.VaccinationItemList
    }
    if (row.inventoryTypeFK === INVENTORY_TYPE.CONSUMABLE) {
      return this.state.ConsumableItemList
    }
    return []
  }

  additionalFilteringStock = (row, filteredStockOptions, x) => {
    const getType = this.type(row.inventoryTypeFK)
    const value = row[getType.typeName]
      ? row[getType.typeName].batchNo
      : undefined

    const results = filteredStockOptions.filter(
      ({ value: id1 }) => !x.some(({ value: id2 }) => id2 === id1),
    )

    const edittingBatchNo = filteredStockOptions.find(
      (o) => o.batchNo === value,
    )

    const edittingBatchNo1 = this.state[getType.stateName].find(
      (o) => o.id === row.batchNo,
    )

    filteredStockOptions = [
      ...x,
      edittingBatchNo,
    ]

    filteredStockOptions = [
      ...new Set(filteredStockOptions),
    ]
    let temp = []
    if (!filteredStockOptions.includes(undefined)) {
      temp = filteredStockOptions.filter(
        ({ value: id1 }) => !results.some(({ value: id2 }) => id2 === id1),
      )
    }
    filteredStockOptions = [
      ...temp,
      edittingBatchNo1,
    ]

    if (filteredStockOptions.includes(undefined)) {
      return []
    }
    return filteredStockOptions
  }

  stockOptions = (row) => {
    if (row.inventoryTypeFK === INVENTORY_TYPE.MEDICATION) {
      let array = [
        ...this.state.filterStockMedication,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)

      // const tempStockMedication = [
      //   ...this.state.stockMedication,
      // ]

      // const filteredTempStockMedication = tempStockMedication.filter(
      //   (o) => o.inventoryItemFK === row.code,
      // )

      // let filteredStockOptions = filteredTempStockMedication
      // console.log('asds', filteredStockOptions)
      // if (row.id) {
      //   filteredStockOptions = this.additionalFilteringStock(
      //     row,
      //     filteredStockOptions,
      //     x,
      //   )
      // }
      // console.log(filteredStockOptions, x)
      // console.log(row.id)
      // return row.id ? filteredStockOptions : x
      console.log({ x })
      return x
    }
    if (row.inventoryTypeFK === INVENTORY_TYPE.VACCINATION) {
      let array = [
        ...this.state.filterStockVaccination,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)

      // const tempStockVaccination = [
      //   ...this.state.stockVaccination,
      // ]
      // const filteredTempStockVaccination = tempStockVaccination.filter(
      //   (o) => o.inventoryItemFK === row.code,
      // )

      // let filteredStockOptions = filteredTempStockVaccination
      // if (row.id) {
      //   filteredStockOptions = this.additionalFilteringStock(
      //     row,
      //     filteredStockOptions,
      //     x,
      //   )
      // }
      // return row.id ? filteredStockOptions : x
      return x
    }
    if (row.inventoryTypeFK === INVENTORY_TYPE.CONSUMABLE) {
      let array = [
        ...this.state.filterStockConsumable,
      ]
      let x = array.filter((o) => o.inventoryItemFK === row.code)

      // const tempStockConsumable = [
      //   ...this.state.stockConsumable,
      // ]
      // const filteredTempStockConsumable = tempStockConsumable.filter(
      //   (o) => o.inventoryItemFK === row.code,
      // )

      // let filteredStockOptions = filteredTempStockConsumable
      // if (row.id) {
      //   filteredStockOptions = this.additionalFilteringStock(
      //     row,
      //     filteredStockOptions,
      //     x,
      //   )
      // }
      // return row.id ? filteredStockOptions : x
      return x
    }
    return []
  }

  filterStockOption = (e) => {
    const { row } = e
    if (row.batchNo) {
      const getState = this.type(row.inventoryTypeFK)
      this.setState((prevState) => {
        return {
          [getState.filterStateName]: prevState[
            getState.filterStateName
          ].filter((o) => o.id !== row.batchNo),
        }
      })
    }
  }

  handleSelectedBatch = (e) => {
    const { option, row, val } = e
    console.log({ e })
    if (option) {
      // const { expiryDate, stock, value, batchNo } = option
      this.setState({ selectedItem: undefined })
      if (val && val.length > 0) {
        const [
          firstIndex,
        ] = val
        row.batchNo = val
        row.batchNoString = firstIndex
        if (option.length > 0) {
          const { expiryDate, stock, id } = option[0]
          row.expiryDate = expiryDate
          row.stock = stock
          row.stockFK = id
        } else {
          row.stockFK = undefined
          row.isManuallyCreated = true
          row.expiryDate = undefined
          row.stock = undefined
        }
      } else {
        row.expiryDate = undefined
        row.stock = undefined
        row.batchNoString = undefined
      }
      // row.batchNo = value
      // row.expiryDate = expiryDate
      // row.stock = stock
      // row.batchNoString = batchNo
    }

    // this.filterStockOption(e)

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
      case INVENTORY_TYPE.MEDICATION:
        return {
          typeName: 'medication',
          codeName: 'medicationCode',
          nameName: 'medicationName',
          stock: 'medicationStock',
          stockFK: 'medicationStockFK',
          itemFK: 'inventoryMedicationFK',
          stateName: 'stockMedication',
          filterStateName: 'filterStockMedication',
        }
      case INVENTORY_TYPE.VACCINATION:
        return {
          typeName: 'vaccination',
          codeName: 'vaccinationCode',
          nameName: 'vaccinationName',
          stock: 'vaccinationStock',
          stockFK: 'vaccinationStockFK',
          itemFK: 'inventoryVaccinationFK',
          stateName: 'stockVaccination',
          filterStateName: 'filterStockVaccination',
        }
      case INVENTORY_TYPE.CONSUMABLE:
        return {
          typeName: 'consumable',
          codeName: 'consumableCode',
          nameName: 'consumableName',
          stock: 'consumableStock',
          stockFK: 'consumableStockFK',
          itemFK: 'inventoryConsumableFK',
          stateName: 'stockConsumable',
          filterStateName: 'filterStockConsumable',
        }
      default:
        return {}
    }
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
      row.batchNo = undefined
      row.batchNoString = undefined
      row.expiryDate = undefined
      row.stock = undefined
      this.setState({ selectedItem: e })
      this.setState({ selectedBatch: undefined })
      if (row.inventoryTypeFK && row.code && !row.batchNo) {
        const getState = this.type(row.inventoryTypeFK)
        const defaultStock = this.state[getState.filterStateName].find(
          (j) => j.inventoryItemFK === row.code && j.isDefault,
        )
        if (defaultStock) {
          row.batchNo = [
            defaultStock.batchNo,
          ]
          row.stockFK = defaultStock.id
          row.stock = defaultStock.stock
          row.expiryDate = defaultStock.expiryDate
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

  onCommitChanges = ({ rows, deleted }) => {
    const { setValues, values } = this.props
    const { stockList } = this.state

    if (deleted) {
      const deletedSet = new Set(deleted)
      const test = [
        ...deletedSet,
      ]
      const deletedRow = rows.find((row) => row.id === test[0])

      deletedRow.isDeleted = true
      // const changedRows = rows.filter((row) => row.id === test[0])
      // if (deletedRow.batchNo) {
      //   const getState = this.type(deletedRow.inventoryTypeFK)

      //   const stockItem = this.state[getState.stateName].find(
      //     (o) => o.id === deletedRow.batchNo,
      //   )
      //   this.setState((prevState) => {
      //     return {
      //       [getState.filterStateName]: [
      //         ...prevState[getState.filterStateName],
      //         stockItem,
      //       ],
      //     }
      //   })
      // }
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
    // if (this.state.selectedItem) {
    //   this.filterStockOption(this.state.selectedItem)
    // }

    // let tempfilterStockConsumable = [
    //   ...this.state.stockConsumable,
    // ]
    // let tempfilterStockMedication = [
    //   ...this.state.stockMedication,
    // ]
    // let tempfilterStockVaccination = [
    //   ...this.state.stockVaccination,
    // ]

    // rows.forEach((o) => {
    //   const type = o.inventoryTypeFK
    //   if (o.batchNo && !o.isDeleted) {
    //     switch (type) {
    //       case INVENTORY_TYPE.MEDICATION: {
    //         tempfilterStockMedication = tempfilterStockMedication.filter(
    //           (j) => j.id !== o.batchNo,
    //         )
    //         break
    //       }
    //       case INVENTORY_TYPE.VACCINATION: {
    //         tempfilterStockVaccination = tempfilterStockVaccination.filter(
    //           (j) => j.id !== o.batchNo,
    //         )
    //         break
    //       }
    //       case INVENTORY_TYPE.CONSUMABLE: {
    //         tempfilterStockConsumable = tempfilterStockConsumable.filter(
    //           (j) => j.id !== o.batchNo,
    //         )
    //         break
    //       }
    //       default:
    //     }
    //   }
    // })
    // this.setState(() => {
    //   return {
    //     filterStockMedication: tempfilterStockMedication,
    //     filterStockConsumable: tempfilterStockConsumable,
    //     filterStockVaccination: tempfilterStockVaccination,
    //   }
    // })

    //   if (o.batchNo) {
    //     const tempStockOptions = [
    //       ...this.state[getState.stateName],
    //     ]
    //     filteredStockOptions = tempStockOptions.filter(
    //       (j) => j.id !== o.batchNo,
    //     )
    //     console.log('filteredStockOptions', filteredStockOptions)

    //
    //   }

    //   return rows
    // })
    if (stockList.length > 0) {
      this.setState({ stockList: rows })
    } else {
      this.setState({ inventoryAdjustmentItems: rows })
    }
    setValues({
      ...values,
      inventoryAdjustmentItems: rows,
    })
    this.setState({ selectedBatch: undefined })
    this.setState({ selectedItem: undefined })
  }

  onAddedRowsChange = (addedRows) => {
    let returnRows = addedRows
    if (returnRows.length > 0 && !_.isEmpty(returnRows[0])) {
      if (this.state.selectedItem) {
        const { option } = this.state.selectedItem
        const { uom, expiryDate, stock } = option
        if (uom) {
          returnRows = returnRows.map((r) => ({
            ...r,
            uomDisplayValue: uom,
          }))
        } else {
          returnRows = returnRows.map((r) => {
            const { uomDisplayValue } = r
            return {
              ...r,
              uomDisplayValue,
              expiryDate,
              stock,
            }
          })
        }
        if (this.state.selectedBatch && returnRows) {
          this.setState({ selectedItem: undefined })
          returnRows = returnRows.map((r) => ({
            ...r,
            stock: this.state.selectedBatch.stock,
            batchNoString: this.state.selectedBatch.batchNo,
          }))
        }
      }
      console.log({ returnRows })
      return returnRows
    }
    returnRows = returnRows.map((o) => ({
      inventoryTypeFK: undefined,
      code: undefined,
      displayValue: undefined,
      uomDisplayValue: undefined,
      batchNo: undefined,
      expiryDate: undefined,
      stock: undefined,
      adjustmentQty: undefined,
    }))
    return returnRows
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
      await setFieldValue(
        'inventoryAdjustmentStatusFK',
        INVENTORY_ADJUSTMENT_STATUS.FINALIZED,
      )
    }
    handleSubmit()
  }

  changeEditingRowIds = (editingRowIds) => {
    this.setState({ editingRowIds })
  }

  render () {
    const { props } = this
    const { theme, values, footer, errors } = props
    const cfg = {}
    if (
      values.inventoryAdjustmentStatusFK !== INVENTORY_ADJUSTMENT_STATUS.DRAFT
    ) {
      cfg.onRowDoubleClick = undefined
    }

    console.log('state', this.state.stockList)
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
                      disabled={
                        values.inventoryAdjustmentStatusFK !==
                        INVENTORY_ADJUSTMENT_STATUS.DRAFT
                      }
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
                        options={inventoryAdjustmentStatus}
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
                      disabled={
                        values.inventoryAdjustmentStatusFK !==
                        INVENTORY_ADJUSTMENT_STATUS.DRAFT
                      }
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
          {console.log(errors.inventoryAdjustmentItems)}

          <EditableTableGrid
            style={{ marginTop: 10 }}
            FuncProps={{
              edit: values.inventoryAdjustmentStatusFK === 1,
              pager: false,
              addNewLabelName: 'New Inventory Adjustment',
            }}
            // schema={inventoryAdjustmentSchema}
            // onRowDoubleClick={this.onEditingRowsChange}
            EditingProps={{
              showAddCommand:
                values.inventoryAdjustmentStatusFK ===
                INVENTORY_ADJUSTMENT_STATUS.DRAFT,
              showEditCommand:
                values.inventoryAdjustmentStatusFK ===
                INVENTORY_ADJUSTMENT_STATUS.DRAFT,
              showDeleteCommand:
                values.inventoryAdjustmentStatusFK ===
                INVENTORY_ADJUSTMENT_STATUS.DRAFT,
              onCommitChanges: this.onCommitChanges,
              onAddedRowsChange: this.onAddedRowsChange,
              onEditingRowIdsChange: this.changeEditingRowIds,
              editingRowIds: this.state.editingRowIds,
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
          {/* <GridContainer
            direction='row'
            justify='flex-end'
            alignItems='flex-end'
          >
            <Button color='danger' onClick={navigateDirtyCheck('/inventory/master?t=0')}>
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
          </GridContainer> */}
          {footer &&
            footer({
              onConfirm: props.handleSubmit,
              confirmBtnText: 'Save',
              extraButtons: (
                <ProgressButton
                  color='info'
                  type='submit'
                  onClick={this.updateStatus}
                  disabled={
                    values.inventoryAdjustmentStatusFK !==
                    INVENTORY_ADJUSTMENT_STATUS.DRAFT
                  }
                >
                  Finalize
                </ProgressButton>
              ),
              confirmProps: {
                disabled:
                  values.inventoryAdjustmentStatusFK !==
                  INVENTORY_ADJUSTMENT_STATUS.DRAFT,
              },
            })}
        </div>
      </React.Fragment>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Detail)
