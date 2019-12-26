import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Yup from '@/utils/yup'
import { CardContainer, GridContainer, GridItem } from '@/components'
import { podoOrderType, getInventoryItemList, getServices } from '@/utils/codes'
import InventoryType from './InventoryType'

const styles = () => ({
  displayDiv: {
    float: 'right',
    padding: '20px',
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
  orderSetDetail,
  setFieldValue,
  setValues,
  values,
  setTotalPrice,
  totalPrice,
  theme,
}) => {
  useEffect(() => {
    // return () => {
    //   dispatch({
    //     type: 'global/updateState',
    //     payload: {
    //       disableSave: false,
    //     },
    //   })
    // }
  }, [])

  const {
    medicationOrderSetItem,
    consumableOrderSetItem,
    vaccinationOrderSetItem,
    serviceOrderSetItem,
  } = values

  const medicationSchema = Yup.object().shape({
    inventoryMedicationFK: Yup.number().required(),
    quantity: Yup.number().required().min(1),
  })
  const consumableSchema = Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    quantity: Yup.number().required().min(1),
  })
  const vaccinationSchema = Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    quantity: Yup.number().required().min(1),
  })
  const serviceSchema = Yup.object().shape({
    serviceCenterServiceFK: Yup.number().required(),
    serviceName: Yup.number().required(),
    quantity: Yup.number().required().min(1),
  })

  const [
    medicationRows,
    setMedicationRows,
  ] = useState(medicationOrderSetItem)
  const [
    consumableRows,
    setConsumableRows,
  ] = useState(consumableOrderSetItem)
  const [
    vaccinationRows,
    setVaccinationRows,
  ] = useState(vaccinationOrderSetItem)
  const [
    serviceRows,
    setServiceRows,
  ] = useState(serviceOrderSetItem)

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
      // if (
      //   orderSetDetail.entity &&
      //   orderSetDetail.entity.serviceOrderSetItem.length > 0
      // ) {
      //   serviceOrderSetItem.forEach((o) => {
      //     o.serviceName = serviceCenterServices.find(
      //       (i) => i.serviceCenter_ServiceId === o.serviceCenterServiceFK,
      //     ).serviceCenterId
      //   })
      // }
    })

    podoOrderType.forEach((x) => {
      dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: x.ctName,
        },
      }).then((list) => {
        const { inventoryItemList } = getInventoryItemList(list)
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

    // dispatch({
    //   // force current edit row components to update
    //   type: 'global/updateState',
    //   payload: {
    //     commitCount: (commitCount += 1),
    //   },
    // })
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
      setMedicationRows(medicationOrderSetItem)
      setConsumableRows(consumableOrderSetItem)
      setVaccinationRows(vaccinationOrderSetItem)
      setServiceRows(serviceOrderSetItem)
      // dispatch({
      //   // force current edit row components to update
      //   type: 'global/updateState',
      //   payload: {
      //     commitCount: (commitCount += 1),
      //   },
      // })
    },
    [
      orderSetDetail,
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

      setFieldValue('medicationOrderSetItem', medicationRows)
      setFieldValue('consumableOrderSetItem', consumableRows)
      setFieldValue('vaccinationOrderSetItem', vaccinationRows)
      setFieldValue('serviceOrderSetItem', serviceRows)

      setTotalPrice(total)

      setValues({
        ...values,
        medicationOrderSetItem: medicationRows,
        consumableOrderSetItem: consumableRows,
        vaccinationOrderSetItem: vaccinationRows,
        serviceOrderSetItem: serviceRows,
        totalPrice: total,
      })

      // dispatch({
      //   // force current edit row components to update
      //   type: 'global/updateState',
      //   payload: {
      //     commitCount: (commitCount += 1),
      //   },
      // })
    },
    [
      medicationRows,
      consumableRows,
      vaccinationRows,
      serviceRows,
    ],
  )

  // useEffect(
  //   () => {
  //     if (serviceRows.length > 0 && serviceCenterServicess.length > 0) {
  //       const newServiceRows = serviceRows.map((o) => {
  //         if (o.tempServiceCenterServiceFK) {
  //           return {
  //             ...o,
  //           }
  //         }
  //         return {
  //           ...o,
  //           serviceCenterServiceFK: serviceCenterServicess.find(
  //             (s) => s.serviceCenter_ServiceId === o.serviceCenterServiceFK,
  //           ).serviceId,
  //           serviceName: serviceCenterServicess.find(
  //             (s) => s.serviceCenter_ServiceId === o.serviceCenterServiceFK,
  //           ).serviceCenterId,
  //         }
  //       })

  //       setServiceRows(newServiceRows)

  //       dispatch({
  //         // force current edit row components to update
  //         type: 'global/updateState',
  //         payload: {
  //           commitCount: (commitCount += 1),
  //         },
  //       })
  //       dispatch({
  //         type: 'orderSetDetail/updateState',
  //         payload: {
  //           entity: {
  //             ...values,
  //             serviceOrderSetItem: newServiceRows,
  //           },
  //         },
  //       })
  //     }
  //   },
  //   [
  //     serviceCenterServicess,
  //   ],
  // )

  const onCommitChanges = (type) => ({ rows, deleted, added, changed }) => {
    if (deleted) {
      const tempArray = [
        ...values[type],
      ]
      const newArray = tempArray.map((o) => {
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
        case 'medicationOrderSetItem': {
          return setMedicationRows(newArray)
        }
        case 'consumableOrderSetItem': {
          return setConsumableRows(newArray)
        }
        case 'vaccinationOrderSetItem': {
          return setVaccinationRows(newArray)
        }
        case 'serviceOrderSetItem': {
          return setServiceRows(newArray)
        }

        default: {
          return rows
        }
      }
    } else if (added) {
      switch (type) {
        case 'medicationOrderSetItem': {
          setMedicationRows([
            ...medicationRows,
            rows[0],
          ])
          return setFieldValue(`${type}`, medicationRows)
        }
        case 'consumableOrderSetItem': {
          setConsumableRows([
            ...consumableRows,
            rows[0],
          ])
          return setFieldValue(`${type}`, consumableRows)
        }
        case 'vaccinationOrderSetItem': {
          setVaccinationRows([
            ...vaccinationRows,
            rows[0],
          ])
          return setFieldValue(`${type}`, vaccinationRows)
        }
        case 'serviceOrderSetItem': {
          const { serviceCenterServiceFK, serviceName } = rows[0]
          const serviceCenterService =
            serviceCenterServicess.find(
              (o) =>
                o.serviceId === serviceCenterServiceFK &&
                o.serviceCenterId === serviceName,
            ) || {}
          if (serviceCenterService) {
            const item = servicess.find((o) => o.value === serviceFK)
            rows[0] = {
              ...rows[0],
              isDeleted: false,
              tempServiceCenterServiceFK:
                serviceCenterService.serviceCenter_ServiceId,
              tempServiceName: item ? item.name : undefined,
            }
          }

          setServiceRows([
            ...serviceRows,
            rows[0],
          ])
          setServiceCenterFK()
          setServiceFK()
          return setFieldValue(`${type}`, serviceRows)
        }
        default:
          return rows
      }
    } else if (changed) {
      const getType = (t) => {
        switch (t) {
          case 'medicationOrderSetItem': {
            return {
              stateRows: medicationRows,
              setStateRow: (v) => setMedicationRows(v),
            }
          }
          case 'consumableOrderSetItem': {
            return {
              stateRows: consumableRows,
              setStateRow: (v) => setConsumableRows(v),
            }
          }
          case 'vaccinationOrderSetItem': {
            return {
              stateRows: vaccinationRows,
              setStateRow: (v) => setVaccinationRows(v),
            }
          }
          case 'serviceOrderSetItem': {
            return {
              stateRows: serviceRows,
              setStateRow: (v) => setServiceRows(v),
            }
          }
          default: {
            return null
          }
        }
      }

      const edittedType = getType(type)

      const newRows = rows.map((item) => {
        // const {
        //   medicationName,
        //   inventoryMedication,
        //   consumableName,
        //   inventoryConsumable,
        //   vaccinationName,
        //   inventoryVaccination,
        //   service,
        //   ...restFields
        // } = item

        let tempServiceCenterServiceFK
        const tempServiceId = serviceFK || item.serviceCenterServiceFK
        const tempServiceCenterId = serviceCenterFK || item.serviceName
        const serviceCenterService =
          serviceCenterServicess.find(
            (o) =>
              o.serviceId === tempServiceId &&
              o.serviceCenterId === tempServiceCenterId,
          ) || {}
        if (serviceCenterService) {
          tempServiceCenterServiceFK =
            serviceCenterService.serviceCenter_ServiceId
        }

        const obj = {
          ...item,
          tempServiceCenterServiceFK,
        }

        return obj
      })

      setServiceCenterFK()
      setServiceFK()
      edittedType.setStateRow(newRows)
      return setFieldValue(`${type}`, newRows)

      // Object.entries(changed).map(([ key, value,
      // ]) => {

      //   const newArray = edittedType.stateRows.map((item) => {
      //     if (item.id === parseInt(key, 10)) {
      //       const {
      //         medicationName,
      //         inventoryMedication,
      //         consumableName,
      //         inventoryConsumable,
      //         vaccinationName,
      //         inventoryVaccination,
      //         service,
      //         ...restFields
      //       } = item

      //       let tempServiceCenterServiceFK
      //       const tempServiceId = serviceFK || item.serviceCenterServiceFK
      //       const tempServiceCenterId = serviceCenterFK || item.serviceName
      //       const serviceCenterService =
      //         serviceCenterServicess.find(
      //           (o) =>
      //             o.serviceId === tempServiceId &&
      //             o.serviceCenterId === tempServiceCenterId,
      //         ) || {}
      //       if (serviceCenterService) {
      //         tempServiceCenterServiceFK =
      //           serviceCenterService.serviceCenter_ServiceId
      //       }
      //       console.log('asds', restFields)

      //       const obj = {
      //         ...restFields,
      //         // ...value,
      //         tempServiceCenterServiceFK,
      //       }
      //       console.log('obj', obj)

      //       return obj
      //     }
      //     return item
      //   })
      //   setServiceCenterFK()
      //   setServiceFK()
      //   edittedType.setStateRow(newArray)
      //   return setFieldValue(`${type}`, newArray)
      // })
    }
  }

  const getServiceCenterService = (row) => {
    const { serviceCenterServiceFK, serviceName } = row
    if (!serviceCenterServiceFK || !serviceName) {
      setSelectedItem({})
      return
    }
    const serviceCenterService =
      serviceCenterServicess.find(
        (o) =>
          o.serviceId === serviceCenterServiceFK &&
          o.serviceCenterId === serviceName,
      ) || {}
    if (serviceCenterService) {
      row.unitPrice = serviceCenterService.unitPrice
    }
  }
  const calSubtotal = (e) => {
    const { row } = e
    const { unitPrice, quantity } = row
    if (unitPrice && quantity) row.subTotal = unitPrice * quantity
  }

  const onAddedRowsChange = (type) => (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]

      const {
        quantity,
        unitPrice,
        serviceCenterServiceFK,
        serviceName,
      } = newRow

      // const total = () => {
      //   if (quantity && unitPrice) {
      //     return quantity * unitPrice
      //   }
      //   return 0.0
      // }
      if (type === 'service') {
        if (serviceCenterServiceFK && serviceName) {
          const returnRow = addedRows.map((row) => ({
            ...row,
            // subTotal: total(),
          }))
          return returnRow
        }

        return addedRows.map((row) => ({
          ...row,
          quantity: undefined,
          unitPrice: undefined,
          subTotal: undefined,
          // subTotal: total(),
        }))
      }

      if (selectedItem) {
        return addedRows.map((row) => ({
          ...row,
          // subTotal: total(),
        }))
      }
    }
    return addedRows
  }

  const handleItemOnChange = (e) => {
    const { option, row } = e
    const { sellingPrice } = option
    setSelectedItem(option)
    row.quantity = undefined
    row.unitPrice = sellingPrice
    row.subTotal = undefined

    // dispatch({
    //   // force current edit row components to update
    //   type: 'global/updateState',
    //   payload: {
    //     commitCount: (commitCount += 1),
    //   },
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
        onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        onChange: calSubtotal,
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
        onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        onChange: calSubtotal,
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
        onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        onChange: calSubtotal,
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

  const serviceProps = {
    columns: [
      { name: 'serviceCenterServiceFK', title: 'Service' },
      { name: 'serviceName', title: 'Service Center' },
      { name: 'quantity', title: 'Quantity' },
      { name: 'unitPrice', title: 'Unit Price' },
      { name: 'subTotal', title: 'Amount' },
    ],

    columnExtensions: [
      {
        columnName: 'serviceCenterServiceFK',
        type: 'select',
        options: (row) => {
          const tempArray = [
            ...servicess,
          ]
          if (!row.serviceName) {
            return tempArray
          }
          const options = tempArray.filter((o) =>
            o.serviceCenters.find((m) => m.value === row.serviceName),
          )
          return options
          // return tempArray.filter(
          //   (o) =>
          //     !serviceCenterFK ||
          //     o.serviceCenters.find((m) => m.value === serviceCenterFK),
          // )
        },
        onChange: (e) => {
          setServiceFK(e.val)
          handleItemOnChange
          getServiceCenterService(e.row)
          e.row.serviceCenterServiceFK = e.val
          // dispatch({
          //   // force current edit row components to update
          //   type: 'global/updateState',
          //   payload: {
          //     commitCount: (commitCount += 1),
          //   },
          // })
        },
      },
      {
        columnName: 'serviceName',
        type: 'select',
        options: (row) => {
          const tempArray = [
            ...serviceCenterss,
          ]
          if (!row.serviceCenterServiceFK) {
            return tempArray
          }
          const options = tempArray.filter((o) =>
            o.services.find((m) => m.value === row.serviceCenterServiceFK),
          )
          return options
          // return tempArray.filter(
          //   (o) =>
          //     !serviceFK ||
          //     o.services.find(
          //       (m) => m.value === serviceFK || m.value === row.serviceName,
          //     ),
          // )
        },

        onChange: (e) => {
          setServiceCenterFK(e.val)
          handleItemOnChange
          getServiceCenterService(e.row)
          e.row.serviceName = e.val
          // dispatch({
          //   // force current edit row components to update
          //   type: 'global/updateState',
          //   payload: {
          //     commitCount: (commitCount += 1),
          //   },
          // })
        },
      },
      {
        columnName: 'quantity',
        width: 150,
        type: 'number',
        format: '0.0',
        onChange: calSubtotal,
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
        onChange: calSubtotal,
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
    onCommitChanges: onCommitChanges('medicationOrderSetItem'),
    onAddedRowsChange: onAddedRowsChange('medication'),
  }

  const consumableEditingProps = {
    messages: {
      deleteCommand: 'Delete consumable',
    },
    showAddCommand: true,
    onAddedRowsChange: onAddedRowsChange('consumable'),
    onCommitChanges: onCommitChanges('consumableOrderSetItem'),
  }

  const vaccinationEditingProps = {
    messages: {
      deleteCommand: 'Delete vaccination',
    },
    showAddCommand: true,
    onCommitChanges: onCommitChanges('vaccinationOrderSetItem'),
    onAddedRowsChange: onAddedRowsChange('vaccination'),
  }

  const serviceEditingProps = {
    messages: {
      deleteCommand: 'Delete service',
    },
    showAddCommand: true,
    onAddedRowsChange: onAddedRowsChange('service'),
    onCommitChanges: onCommitChanges('serviceOrderSetItem'),
  }
  return (
    <div>
      <CardContainer
        hideHeader
        style={{
          margin: theme.spacing(1),
          maxHeight: 700,
          minHeight: 700,
        }}
      >
        <GridContainer>
          <GridItem xs={12}>
            <div className={classes.displayDiv}>
              <h4>
                <b>Order Set Price: ${totalPrice.toFixed(2)}</b>
              </h4>
            </div>
          </GridItem>
        </GridContainer>
        <GridContainer
          style={{
            overflow: 'auto',
            minHeight: 550,
            maxHeight: 550,
            padding: 10,
          }}
        >
          <InventoryType
            title='Medication'
            inventoryTypeProps={medicationProps}
            schema={medicationSchema}
            rows={medicationRows}
            editingProps={medicationEditingProps}
          />

          <InventoryType
            title='Consumable'
            inventoryTypeProps={consumableProps}
            schema={consumableSchema}
            rows={consumableRows}
            editingProps={consumableEditingProps}
            style={{ marginTop: 15 }}
          />

          <InventoryType
            title='Vaccination'
            inventoryTypeProps={vaccinationProps}
            schema={vaccinationSchema}
            rows={vaccinationRows}
            editingProps={vaccinationEditingProps}
            style={{ marginTop: 15 }}
          />

          <InventoryType
            title='Service'
            inventoryTypeProps={serviceProps}
            schema={serviceSchema}
            rows={serviceRows}
            editingProps={serviceEditingProps}
            style={{ marginTop: 15 }}
          />
        </GridContainer>
      </CardContainer>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
