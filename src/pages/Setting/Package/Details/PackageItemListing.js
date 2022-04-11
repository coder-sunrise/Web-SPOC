import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import moment from 'moment'
import Yup from '@/utils/yup'
import { GridContainer, GridItem, NumberInput } from '@/components'
import { podoOrderType, inventoryItemListing } from '@/utils/codes'
import { getServices } from '@/utils/codetable'
import PackageItemType from './PackageItemType'
import { ITEM_TYPE } from '@/utils/constants'
import { roundTo, maxReducer } from '@/utils/utils'
import { currencySymbol } from '@/utils/config'

const styles = theme => ({
  displayDiv: {
    float: 'right',
    padding: '20px',
    marginRight: theme.spacing(9),
  },

  tableHeader: {
    marginTop: 50,
  },

  tableSectionHeader: {
    fontWeight: 400,
    marginLeft: -15,
  },
})

let commitCount = 1000 // uniqueNumber
const PackageItemListing = ({
  dispatch,
  classes,
  settingPackage,
  setFieldValue,
  setValues,
  values,
  theme,
}) => {
  const {
    medicationPackageItem,
    consumablePackageItem,
    vaccinationPackageItem,
    servicePackageItem,
  } = values

  const medicationSchema = Yup.object().shape({
    inventoryMedicationFK: Yup.number().required(),
    quantity: Yup.number()
      .required()
      .min(1),
    defaultConsumeQuantity: Yup.number()
      .required()
      .min(0),
    subTotal: Yup.number()
      .required()
      .min(0),
  })
  const consumableSchema = Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    quantity: Yup.number()
      .required()
      .min(1),
    defaultConsumeQuantity: Yup.number()
      .required()
      .min(0),
    subTotal: Yup.number()
      .required()
      .min(0),
  })
  const vaccinationSchema = Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    quantity: Yup.number()
      .required()
      .min(1),
    defaultConsumeQuantity: Yup.number()
      .required()
      .min(0),
    subTotal: Yup.number()
      .required()
      .min(0),
  })
  const serviceSchema = Yup.object().shape({
    serviceFK: Yup.number().required(),
    serviceCenterFK: Yup.number().required(),
    quantity: Yup.number()
      .required()
      .min(1),
    defaultConsumeQuantity: Yup.number()
      .required()
      .min(0),
    subTotal: Yup.number()
      .required()
      .min(0),
  })

  const [totalPrice, setTotalPrice] = useState(0)

  const [medicationRows, setMedicationRows] = useState(medicationPackageItem)
  const [consumableRows, setConsumableRows] = useState(consumablePackageItem)
  const [vaccinationRows, setVaccinationRows] = useState(vaccinationPackageItem)
  const [serviceRows, setServiceRows] = useState(servicePackageItem)

  const [medicationList, setMedicationList] = useState([])

  const [consumableList, setConsumableList] = useState([])

  const [vaccinationList, setVaccinationList] = useState([])

  const [selectedItem, setSelectedItem] = useState(() => {})

  const [servicess, setServicess] = useState(() => [])
  const [serviceCenterss, setServiceCenterss] = useState(() => [])
  const [serviceCenterServicess, setServiceCenterServicess] = useState(() => [])

  const fetchCodes = async () => {
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
      },
    }).then(list => {
      const { services, serviceCenters, serviceCenterServices } = getServices(
        list,
      )
      setServicess(services)
      setServiceCenterss(serviceCenters)
      setServiceCenterServicess(serviceCenterServices)
    })

    podoOrderType.forEach(x => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: x.ctName,
        },
      }).then(list => {
        const { inventoryItemList } = inventoryItemListing(list)
        switch (x.stateName) {
          case 'ConsumableItemList': {
            return setConsumableList(
              inventoryItemList.filter(item => item.orderable),
            )
          }
          case 'MedicationItemList': {
            return setMedicationList(
              inventoryItemList.filter(item => item.orderable),
            )
          }
          case 'VaccinationItemList': {
            return setVaccinationList(inventoryItemList)
          }
          default: {
            return null
          }
        }
      })
    })
  }

  useEffect(() => {
    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
  }, [medicationList, consumableList, vaccinationList])

  useEffect(() => {
    setMedicationRows(medicationPackageItem)
    setConsumableRows(consumablePackageItem)
    setVaccinationRows(vaccinationPackageItem)
    setServiceRows(servicePackageItem)
  }, [settingPackage])

  useEffect(() => {
    fetchCodes()
  }, [])

  useEffect(() => {
    let total = 0
    const calTotal = row => {
      const { isDeleted, subTotal } = row
      if (!isDeleted && subTotal) {
        total += subTotal
      }
      return total
    }
    medicationRows.forEach(row => {
      calTotal(row)
    })

    serviceRows.forEach(row => {
      calTotal(row)
    })

    consumableRows.forEach(row => {
      calTotal(row)
    })

    vaccinationRows.forEach(row => {
      calTotal(row)
    })

    setFieldValue('medicationPackageItem', medicationRows)
    setFieldValue('consumablePackageItem', consumableRows)
    setFieldValue('vaccinationPackageItem', vaccinationRows)
    setFieldValue('servicePackageItem', serviceRows)

    setTotalPrice(total)

    setValues({
      ...values,
      medicationPackageItem: medicationRows,
      consumablePackageItem: consumableRows,
      vaccinationPackageItem: vaccinationRows,
      servicePackageItem: serviceRows,
      totalPrice: total,
    })
  }, [medicationRows, consumableRows, vaccinationRows, serviceRows])

  const handleItemOnChange = e => {
    const { option, row } = e
    const { sellingPrice } = option
    setSelectedItem(option)
    row.quantity = 1
    row.unitPrice = sellingPrice || 0
    row.subTotal = row.quantity * row.unitPrice
    row.defaultConsumeQuantity = 0
    row.isActive = option.isActive
  }

  const getNextSequence = type => {
    let list
    switch (type) {
      case 'medicationPackageItem': {
        list = medicationRows.filter(m => !m.isDeleted)
        break
      }
      case 'consumablePackageItem': {
        list = consumableRows.filter(c => !c.isDeleted)
        break
      }
      case 'vaccinationPackageItem': {
        list = vaccinationRows.filter(v => !v.isDeleted)
        break
      }
      case 'servicePackageItem': {
        list = serviceRows.filter(s => !s.isDeleted)
        break
      }
      default: {
        break
      }
    }

    let nextSequence = 1
    if (list && list.length > 0) {
      nextSequence = list.map(o => o.sequence).reduce(maxReducer, 0) + 1
    }

    return nextSequence
  }

  const onCommitChanges = type => ({ rows, deleted, added, changed }) => {
    if (deleted) {
      const tempArray = [...values[type]]
      const newArray = tempArray.map(o => {
        if (o.id === deleted[0]) {
          return {
            ...o,
            isDeleted: true,
          }
        }
        return {
          ...o,
        }
      })
      switch (type) {
        case 'medicationPackageItem': {
          return setMedicationRows(newArray)
        }
        case 'consumablePackageItem': {
          return setConsumableRows(newArray)
        }
        case 'vaccinationPackageItem': {
          return setVaccinationRows(newArray)
        }
        case 'servicePackageItem': {
          return setServiceRows(newArray)
        }
        default: {
          return rows
        }
      }
    } else if (added) {
      rows[0].sequence = getNextSequence(type)
      switch (type) {
        case 'medicationPackageItem': {
          rows[0].inventoryItemTypeFK = ITEM_TYPE.MEDICATION
          setMedicationRows([...medicationRows, rows[0]])
          return setFieldValue(`${type}`, medicationRows)
        }
        case 'consumablePackageItem': {
          rows[0].inventoryItemTypeFK = ITEM_TYPE.CONSUMABLE
          setConsumableRows([...consumableRows, rows[0]])
          return setFieldValue(`${type}`, consumableRows)
        }
        case 'vaccinationPackageItem': {
          rows[0].inventoryItemTypeFK = ITEM_TYPE.VACCINATION
          setVaccinationRows([...vaccinationRows, rows[0]])
          return setFieldValue(`${type}`, vaccinationRows)
        }
        case 'servicePackageItem': {
          rows[0].inventoryItemTypeFK = ITEM_TYPE.SERVICE
          const { serviceFK, serviceCenterFK } = rows[0]
          const serviceCenterService =
            serviceCenterServicess.find(
              o =>
                o.serviceId === serviceFK &&
                o.serviceCenterId === serviceCenterFK,
            ) || {}
          if (serviceCenterService) {
            rows[0] = {
              ...rows[0],
              isDeleted: false,
            }
          }
          setServiceRows([...serviceRows, rows[0]])
          return setFieldValue(`${type}`, serviceRows)
        }
        default:
          return rows
      }
    } else if (changed) {
      const getType = t => {
        switch (t) {
          case 'medicationPackageItem': {
            return {
              stateRows: medicationRows,
              setStateRow: v => setMedicationRows(v),
            }
          }
          case 'consumablePackageItem': {
            return {
              stateRows: consumableRows,
              setStateRow: v => setConsumableRows(v),
            }
          }
          case 'vaccinationPackageItem': {
            return {
              stateRows: vaccinationRows,
              setStateRow: v => setVaccinationRows(v),
            }
          }
          case 'servicePackageItem': {
            return {
              stateRows: serviceRows,
              setStateRow: v => setServiceRows(v),
            }
          }
          default: {
            return null
          }
        }
      }
      const edittedType = getType(type)
      edittedType.setStateRow(rows)
      return setFieldValue(`${type}`, rows)
    }
  }

  const onAddedRowsChange = type => addedRows => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]
      const { serviceFK, serviceCenterFK } = newRow
      if (type === 'service') {
        if (serviceFK && serviceCenterFK) {
          const returnRow = addedRows.map(row => ({
            ...row,
          }))
          return returnRow
        }
        return addedRows.map(row => ({
          ...row,
          quantity: undefined,
          unitPrice: undefined,
          subTotal: undefined,
        }))
      }
      if (selectedItem) {
        return addedRows.map(row => ({
          ...row,
        }))
      }
    }
    return addedRows.map(row => {
      return {
        ...row,
        subTotal: 0,
        defaultConsumeQuantity: 0,
      }
    })
  }

  const calUnitPrice = e => {
    const { row } = e
    const { subTotal, quantity } = row
    row.unitPrice = 0
    if (subTotal && quantity && quantity !== 0) {
      row.unitPrice = roundTo(subTotal / quantity)
    }
  }

  const medicationProps = {
    columns: [
      { name: 'inventoryMedicationFK', title: 'Medication Name' },
      { name: 'defaultConsumeQuantity', title: 'Consume Qty.' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],

    columnExtensions: [
      {
        columnName: 'inventoryMedicationFK',
        type: 'select',
        labelField: 'displayValue',
        options: medicationList,
        onChange: handleItemOnChange,
      },
      {
        columnName: 'defaultConsumeQuantity',
        width: 120,
        type: 'number',
        format: '0.0',
      },
      {
        columnName: 'quantity',
        width: 100,
        type: 'number',
        format: '0.0',
        onChange: calUnitPrice,
      },
      {
        columnName: 'unitPrice',
        width: 100,
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        width: 130,
        type: 'number',
        currency: true,
        onChange: calUnitPrice,
      },
    ],
  }

  const medicationEditingProps = {
    messages: {
      deleteCommand: 'Delete medication',
    },
    showAddCommand: true,
    onCommitChanges: onCommitChanges('medicationPackageItem'),
    onAddedRowsChange: onAddedRowsChange('medication'),
  }

  const consumableProps = {
    columns: [
      { name: 'inventoryConsumableFK', title: 'Consumable Name' },
      { name: 'defaultConsumeQuantity', title: 'Consume Qty.' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],

    columnExtensions: [
      {
        columnName: 'inventoryConsumableFK',
        type: 'select',
        labelField: 'displayValue',
        options: consumableList,
        onChange: handleItemOnChange,
      },
      {
        columnName: 'defaultConsumeQuantity',
        width: 120,
        type: 'number',
        format: '0.0',
      },
      {
        columnName: 'quantity',
        width: 100,
        type: 'number',
        format: '0.0',
        onChange: calUnitPrice,
      },
      {
        columnName: 'unitPrice',
        width: 100,
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        width: 130,
        type: 'number',
        currency: true,
        onChange: calUnitPrice,
      },
    ],
  }

  const consumableEditingProps = {
    messages: {
      deleteCommand: 'Delete consumable',
    },
    showAddCommand: true,
    onAddedRowsChange: onAddedRowsChange('consumable'),
    onCommitChanges: onCommitChanges('consumablePackageItem'),
  }

  const vaccinationProps = {
    columns: [
      { name: 'inventoryVaccinationFK', title: 'Vaccination' },
      { name: 'defaultConsumeQuantity', title: 'Consume Qty.' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],
    columnExtensions: [
      {
        columnName: 'inventoryVaccinationFK',
        type: 'select',
        labelField: 'displayValue',
        options: vaccinationList,
        onChange: handleItemOnChange,
      },
      {
        columnName: 'defaultConsumeQuantity',
        width: 120,
        type: 'number',
        format: '0.0',
      },
      {
        columnName: 'quantity',
        width: 100,
        type: 'number',
        format: '0.0',
        onChange: calUnitPrice,
      },
      {
        columnName: 'unitPrice',
        width: 100,
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        width: 130,
        type: 'number',
        currency: true,
        onChange: calUnitPrice,
      },
    ],
  }

  const vaccinationEditingProps = {
    messages: {
      deleteCommand: 'Delete vaccination',
    },
    showAddCommand: true,
    onCommitChanges: onCommitChanges('vaccinationPackageItem'),
    onAddedRowsChange: onAddedRowsChange('vaccination'),
  }

  const getServiceCenterService = row => {
    const { serviceFK, serviceCenterFK } = row
    if (!serviceFK || !serviceCenterFK) {
      setSelectedItem({})
      return
    }
    const serviceCenterService =
      serviceCenterServicess.find(
        o => o.serviceId === serviceFK && o.serviceCenterId === serviceCenterFK,
      ) || {}
    if (serviceCenterService) {
      row.serviceCenterServiceFK = serviceCenterService.serviceCenter_ServiceId
      row.unitPrice = serviceCenterService.unitPrice || 0
      row.quantity = 1
      row.defaultConsumeQuantity = 0
      row.subTotal = row.quantity * row.unitPrice
      row.inventoryItemCode = serviceCenterService.code
      row.inventoryItemName = serviceCenterService.displayValue
      row.isActive =
        moment(serviceCenterService.effectiveStartDate) <= moment() &&
        moment() <= moment(serviceCenterService.effectiveEndDate)
    }
  }

  const serviceProps = {
    columns: [
      { name: 'serviceFK', title: 'Service' },
      { name: 'serviceCenterFK', title: 'Service Center' },
      { name: 'defaultConsumeQuantity', title: 'Consume Qty.' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],

    columnExtensions: [
      {
        columnName: 'serviceFK',
        type: 'select',
        labelField: 'displayValue',
        options: row => {
          let options = []
          const tempArray = [...servicess]
          if (!row.serviceCenterFK) {
            options = tempArray
          } else {
            options = tempArray.filter(o =>
              o.serviceCenters.find(m => m.value === row.serviceCenterFK),
            )
          }

          return options.map(m => {
            const defaultServiceCenter =
              m.serviceCenters.find(o => o.isDefault) || {}
            const { unitPrice = 0 } = defaultServiceCenter
            return {
              ...m,
              displayValue: `${m.name} - ${
                m.code
              } (${currencySymbol}${unitPrice.toFixed(2)})`,
            }
          })
        },
        onChange: e => {
          handleItemOnChange
          if (!e.row.serviceCenterFK) {
            const serviceCenterService = serviceCenterServicess.find(
              o => o.serviceId === e.val && o.isDefault,
            )
            if (serviceCenterService) {
              e.row.serviceCenterFK = serviceCenterService.serviceCenterId
            }
          }

          getServiceCenterService(e.row)
          e.row.serviceFK = e.val
        },
      },
      {
        columnName: 'serviceCenterFK',
        type: 'select',
        width: 150,
        options: row => {
          const tempArray = [...serviceCenterss]
          if (!row.serviceFK) {
            return tempArray
          }
          const options = tempArray.filter(o =>
            o.services.find(m => m.value === row.serviceFK),
          )
          return options
        },

        onChange: e => {
          handleItemOnChange
          getServiceCenterService(e.row)
          e.row.serviceCenterFK = e.val
        },
      },
      {
        columnName: 'defaultConsumeQuantity',
        width: 120,
        type: 'number',
        format: '0.0',
      },
      {
        columnName: 'quantity',
        width: 100,
        type: 'number',
        format: '0.0',
        onChange: calUnitPrice,
      },
      {
        columnName: 'unitPrice',
        width: 100,
        type: 'number',
        currency: true,
        disabled: true,
      },
      {
        columnName: 'subTotal',
        width: 130,
        type: 'number',
        currency: true,
        onChange: calUnitPrice,
      },
    ],
  }

  const serviceEditingProps = {
    messages: {
      deleteCommand: 'Delete service',
    },
    showAddCommand: true,
    onAddedRowsChange: onAddedRowsChange('service'),
    onCommitChanges: onCommitChanges('servicePackageItem'),
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <div className={classes.displayDiv}>
            <h4>
              <b>
                Package Total Price:{' '}
                <NumberInput text currency value={totalPrice} />
              </b>
            </h4>
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer
        style={{
          overflow: 'auto',
          minHeight: 470,
          maxHeight: 470,
          padding: 5,
        }}
      >
        <PackageItemType
          title='Service'
          packageItemTypeProps={serviceProps}
          schema={serviceSchema}
          rows={serviceRows}
          editingProps={serviceEditingProps}
        />

        <PackageItemType
          title='Consumable'
          packageItemTypeProps={consumableProps}
          schema={consumableSchema}
          rows={consumableRows}
          editingProps={consumableEditingProps}
          style={{ marginTop: theme.spacing(2) }}
        />

        <PackageItemType
          title='Medication'
          packageItemTypeProps={medicationProps}
          schema={medicationSchema}
          rows={medicationRows}
          editingProps={medicationEditingProps}
          style={{ marginTop: theme.spacing(2) }}
        />

        <PackageItemType
          title='Vaccination'
          packageItemTypeProps={vaccinationProps}
          schema={vaccinationSchema}
          rows={vaccinationRows}
          editingProps={vaccinationEditingProps}
          style={{ marginTop: theme.spacing(2) }}
        />
      </GridContainer>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(PackageItemListing)
