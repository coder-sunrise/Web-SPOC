import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Yup from '@/utils/yup'
import { GridContainer, GridItem } from '@/components'
import { podoOrderType, inventoryItemListing } from '@/utils/codes'
import { getServices } from '@/utils/codetable'
import Authorized from '@/utils/Authorized'
import PackageItemType from './PackageItemType'

const styles = (theme) => ({
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
const InventoryTypeListing = ({
  dispatch,
  classes,
  packageDetail,
  setFieldValue,
  setValues,
  values,
  setTotalPrice,
  totalPrice,
  theme,
}) => {
  const {
    medicationPackageItem,
    consumablePackageItem,
    vaccinationPackageItem,
    servicePackageItem,
  } = values

  console.log('values', values, packageDetail, totalPrice, values.totalPrice)

  const medicationSchema = Yup.object().shape({
    inventoryMedicationFK: Yup.number().required(),
    quantity: Yup.number().required().min(1),
    defaultConsumeQuantity: Yup.number().required().min(0),
    subTotal: Yup.number().required().min(0),
  })
  const consumableSchema = Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    quantity: Yup.number().required().min(1),
    defaultConsumeQuantity: Yup.number().required().min(0),
    subTotal: Yup.number().required().min(0),
  })
  const vaccinationSchema = Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    quantity: Yup.number().required().min(1),
    defaultConsumeQuantity: Yup.number().required().min(0),
    subTotal: Yup.number().required().min(0),
  })
  const serviceSchema = Yup.object().shape({
    serviceCenterServiceFK: Yup.number().required(),
    serviceName: Yup.number().required(),
    quantity: Yup.number().required().min(1),
    defaultConsumeQuantity: Yup.number().required().min(0),
    subTotal: Yup.number().required().min(0),
  })

  const [
    medicationRows,
    setMedicationRows,
  ] = useState(medicationPackageItem)
  const [
    consumableRows,
    setConsumableRows,
  ] = useState(consumablePackageItem)
  const [
    vaccinationRows,
    setVaccinationRows,
  ] = useState(vaccinationPackageItem)
  const [
    serviceRows,
    setServiceRows,
  ] = useState(servicePackageItem)

  const [
    medicationList,
    setMedicationList,
  ] = useState([])

  const [
    consumableList,
    setConsumableList,
  ] = useState([])

  const [
    vaccinationList,
    setVaccinationList,
  ] = useState([])

  const [
    selectedItem,
    setSelectedItem,
  ] = useState(() => {})

  const [
    servicess,
    setServicess,
  ] = useState(() => [])
  const [
    serviceCenterss,
    setServiceCenterss,
  ] = useState(() => [])
  const [
    serviceCenterServicess,
    setServiceCenterServicess,
  ] = useState(() => [])
  const [
    serviceFK,
    setServiceFK,
  ] = useState(() => {})
  const [
    serviceCenterFK,
    setServiceCenterFK,
  ] = useState(() => {})

  const fetchCodes = async () => {
    await dispatch({
      type: 'codetable/fetchCodes',
      payload: {
        code: 'ctservice',
      },
    }).then((list) => {
      const { services, serviceCenters, serviceCenterServices } = getServices(
        list,
      )
      setServicess(services)
      setServiceCenterss(serviceCenters)
      setServiceCenterServicess(serviceCenterServices)
    })

    podoOrderType.forEach((x) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: x.ctName,
        },
      }).then((list) => {
        const { inventoryItemList } = inventoryItemListing(list)
        switch (x.stateName) {
          case 'ConsumableItemList': {
            return setConsumableList(inventoryItemList)
          }
          case 'MedicationItemList': {
            return setMedicationList(inventoryItemList)
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

  useEffect(
    () => {
      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
    },
    [
      medicationList,
      consumableList,
      vaccinationList,
    ],
  )

  useEffect(
    () => {
      setMedicationRows(medicationPackageItem)
      setConsumableRows(consumablePackageItem)
      setVaccinationRows(vaccinationPackageItem)
      setServiceRows(servicePackageItem)
    },
    [
      packageDetail,
    ],
  )

  useEffect(() => {
    fetchCodes()
  }, [])

  useEffect(
    () => {
      let total = 0
      const calTotal = (row) => {
        const { isDeleted, subTotal } = row
        if (!isDeleted && subTotal) {
          total += subTotal
        }
        return total
      }
      medicationRows.forEach((row) => {
        calTotal(row)
      })

      serviceRows.forEach((row) => {
        calTotal(row)
      })

      consumableRows.forEach((row) => {
        calTotal(row)
      })

      vaccinationRows.forEach((row) => {
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
    },
    [
      medicationRows,
      consumableRows,
      vaccinationRows,
      serviceRows,
    ],
  )

  const handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice } = option
    setSelectedItem(option)
    row.quantity = 1
    row.unitPrice = sellingPrice || 0
    row.subTotal = row.quantity * row.unitPrice
  }

  const onCommitChanges = (type) => ({ rows, deleted, added, changed }) => {
    // if (deleted) {
    //   const tempArray = [
    //     ...values[type],
    //   ]
    //   const newArray = tempArray.map((o) => {
    //     if (o.id === deleted[0]) {
    //       return {
    //         ...o,
    //         isDeleted: true,
    //       }
    //     }
    //     return {
    //       ...o,
    //     }
    //   })
    //   switch (type) {
    //     case 'medicationPackageItem': {
    //       return setMedicationRows(newArray)
    //     }
    //     case 'consumablePackageItem': {
    //       return setConsumableRows(newArray)
    //     }
    //     case 'vaccinationPackageItem': {
    //       return setVaccinationRows(newArray)
    //     }
    //     case 'servicePackageItem': {
    //       return setServiceRows(newArray)
    //     }
    //     default: {
    //       return rows
    //     }
    //   }
    // } else if (added) {
    //   switch (type) {
    //     case 'medicationPackageItem': {
    //       setMedicationRows([
    //         ...medicationRows,
    //         rows[0],
    //       ])
    //       return setFieldValue(`${type}`, medicationRows)
    //     }
    //     case 'consumablePackageItem': {
    //       setConsumableRows([
    //         ...consumableRows,
    //         rows[0],
    //       ])
    //       return setFieldValue(`${type}`, consumableRows)
    //     }
    //     case 'vaccinationPackageItem': {
    //       setVaccinationRows([
    //         ...vaccinationRows,
    //         rows[0],
    //       ])
    //       return setFieldValue(`${type}`, vaccinationRows)
    //     }
    //     case 'servicePackageItem': {
    //       const { serviceCenterServiceFK, serviceName } = rows[0]
    //       const serviceCenterService =
    //         serviceCenterServicess.find(
    //           (o) =>
    //             o.serviceId === serviceCenterServiceFK &&
    //             o.serviceCenterId === serviceName,
    //         ) || {}
    //       if (serviceCenterService) {
    //         const item = servicess.find((o) => o.value === serviceFK)
    //         rows[0] = {
    //           ...rows[0],
    //           isDeleted: false,
    //           tempServiceCenterServiceFK:
    //             serviceCenterService.serviceCenter_ServiceId,
    //           tempServiceName: item ? item.name : undefined,
    //         }
    //       }
    //       setServiceRows([
    //         ...serviceRows,
    //         rows[0],
    //       ])
    //       setServiceCenterFK()
    //       setServiceFK()
    //       return setFieldValue(`${type}`, serviceRows)
    //     }
    //     default:
    //       return rows
    //   }
    // } else if (changed) {
    //   const getType = (t) => {
    //     switch (t) {
    //       case 'medicationPackageItem': {
    //         return {
    //           stateRows: medicationRows,
    //           setStateRow: (v) => setMedicationRows(v),
    //         }
    //       }
    //       case 'consumablePackageItem': {
    //         return {
    //           stateRows: consumableRows,
    //           setStateRow: (v) => setConsumableRows(v),
    //         }
    //       }
    //       case 'vaccinationPackageItem': {
    //         return {
    //           stateRows: vaccinationRows,
    //           setStateRow: (v) => setVaccinationRows(v),
    //         }
    //       }
    //       case 'servicePackageItem': {
    //         return {
    //           stateRows: serviceRows,
    //           setStateRow: (v) => setServiceRows(v),
    //         }
    //       }
    //       default: {
    //         return null
    //       }
    //     }
    //   }
    //   const edittedType = getType(type)
    //   const newRows = rows.map((item) => {
    //     let tempServiceCenterServiceFK
    //     const tempServiceId = serviceFK || item.serviceCenterServiceFK
    //     const tempServiceCenterId = serviceCenterFK || item.serviceName
    //     const serviceCenterService =
    //       serviceCenterServicess.find(
    //         (o) =>
    //           o.serviceId === tempServiceId &&
    //           o.serviceCenterId === tempServiceCenterId,
    //       ) || {}
    //     if (serviceCenterService) {
    //       tempServiceCenterServiceFK =
    //         serviceCenterService.serviceCenter_ServiceId
    //     }
    //     const obj = {
    //       ...item,
    //       tempServiceCenterServiceFK,
    //     }
    //     return obj
    //   })
    //   setServiceCenterFK()
    //   setServiceFK()
    //   edittedType.setStateRow(newRows)
    //   return setFieldValue(`${type}`, newRows)
    // }
  }

  const onAddedRowsChange = (type) => (addedRows) => {
    // if (addedRows.length > 0) {
    //   const newRow = addedRows[0]
    //   const {
    //     quantity,
    //     unitPrice,
    //     serviceCenterServiceFK,
    //     serviceName,
    //   } = newRow
    //   if (type === 'service') {
    //     if (serviceCenterServiceFK && serviceName) {
    //       const returnRow = addedRows.map((row) => ({
    //         ...row,
    //         // subTotal: total(),
    //       }))
    //       return returnRow
    //     }
    //     return addedRows.map((row) => ({
    //       ...row,
    //       quantity: undefined,
    //       unitPrice: undefined,
    //       subTotal: undefined,
    //       // subTotal: total(),
    //     }))
    //   }
    //   if (selectedItem) {
    //     return addedRows.map((row) => ({
    //       ...row,
    //       // subTotal: total(),
    //     }))
    //   }
    // }
    // return addedRows.map((row) => {
    //   return {
    //     ...row,
    //     subTotal: 0,
    //   }
    // })
  }

  const medicationProps = {
    columns: [
      { name: 'inventoryMedicationFK', title: 'Medication Name' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],

    columnExtensions: [
      {
        columnName: 'inventoryMedicationFK',
        type: 'select',
        labelField: 'name',
        options: medicationList,
        onChange: handleItemOnChange,
      },
      {
        columnName: 'quantity',
        width: 150,
        type: 'number',
        format: '0.0',
        // onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        // onChange: calSubtotal,
      },
      {
        columnName: 'subTotal',
        width: 150,
        type: 'number',
        currency: true,
        disabled: true,
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
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],

    columnExtensions: [
      {
        columnName: 'inventoryConsumableFK',
        type: 'select',
        labelField: 'name',
        options: consumableList,
        onChange: handleItemOnChange,
      },

      {
        columnName: 'quantity',
        width: 150,
        type: 'number',
        format: '0.0',
        // onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        // onChange: calSubtotal,
      },
      {
        columnName: 'subTotal',
        width: 150,
        type: 'number',
        currency: true,
        disabled: true,
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
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],
    columnExtensions: [
      {
        columnName: 'inventoryVaccinationFK',
        type: 'select',
        labelField: 'name',
        options: vaccinationList,
        onChange: handleItemOnChange,
      },
      {
        columnName: 'quantity',
        width: 150,
        type: 'number',
        format: '0.0',
        // onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        // onChange: calSubtotal,
      },
      {
        columnName: 'subTotal',
        width: 150,
        type: 'number',
        currency: true,
        disabled: true,
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

  return (
    <div>
      <GridContainer>
        <GridItem xs={12}>
          <div className={classes.displayDiv}>
            <h4>
              <b>Package Total Price: ${totalPrice.toFixed(2)}</b>
            </h4>
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer
        style={{
          overflow: 'auto',
          minHeight: 530,
          maxHeight: 530,
          padding: 5,
        }}
      >
        <Authorized authority='inventorymaster.package.service'>
          <PackageItemType
            title='Consumable'
            packageItemTypeProps={consumableProps}
            schema={consumableSchema}
            rows={consumableRows}
            editingProps={consumableEditingProps}
          />
        </Authorized>

        <Authorized authority='inventorymaster.package.consumable'>
          <PackageItemType
            title='Consumable'
            packageItemTypeProps={consumableProps}
            schema={consumableSchema}
            rows={consumableRows}
            editingProps={consumableEditingProps}
            style={{ marginTop: theme.spacing(2) }}
          />
        </Authorized>

        <Authorized authority='inventorymaster.package.medication'>
          <PackageItemType
            title='Medication'
            packageItemTypeProps={medicationProps}
            schema={medicationSchema}
            rows={medicationRows}
            editingProps={medicationEditingProps}
            style={{ marginTop: theme.spacing(2) }}
          />
        </Authorized>

        <Authorized authority='inventorymaster.package.vaccination'>
          <PackageItemType
            title='Vaccination'
            packageItemTypeProps={vaccinationProps}
            schema={vaccinationSchema}
            rows={vaccinationRows}
            editingProps={vaccinationEditingProps}
            style={{ marginTop: theme.spacing(2) }}
          />
        </Authorized>
      </GridContainer>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
