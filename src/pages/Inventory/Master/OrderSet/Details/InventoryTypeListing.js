import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Yup from '@/utils/yup'
import { CardContainer, GridContainer, GridItem } from '@/components'
import { podoOrderType, inventoryItemListing } from '@/utils/codes'
import { getServices } from '@/utils/codetable'
import Authorized from '@/utils/Authorized'
import { currencySymbol } from '@/utils/config'

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

  const { consumableOrderSetItem, serviceOrderSetItem } = values

  const consumableSchema = Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    quantity: Yup.number()
      .required()
      .min(1),
  })
  const serviceSchema = Yup.object().shape({
    serviceFK: Yup.number().required(),
    serviceCenterServiceFK: Yup.number().required(),
    serviceName: Yup.number().required(),
    quantity: Yup.number()
      .required()
      .min(1),
  })

  const [consumableRows, setConsumableRows] = useState(consumableOrderSetItem)
  const [serviceRows, setServiceRows] = useState(serviceOrderSetItem)

  const [consumableList, setConsumableList] = useState([])

  const [selectedItem, setSelectedItem] = useState(() => {})

  const [servicess, setServicess] = useState(() => [])
  const [serviceCenterss, setServiceCenterss] = useState(() => [])
  const [serviceCenterServicess, setServiceCenterServicess] = useState(() => [])
  const [serviceFK, setServiceFK] = useState(() => {})
  const [serviceCenterFK, setServiceCenterFK] = useState(() => {})

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
  }, [consumableList])

  useEffect(() => {
    setConsumableRows(consumableOrderSetItem)
    setServiceRows(serviceOrderSetItem)
    // dispatch({
    //   // force current edit row components to update
    //   type: 'global/updateState',
    //   payload: {
    //     commitCount: (commitCount += 1),
    //   },
    // })
  }, [orderSetDetail])

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

    serviceRows.forEach(row => {
      calTotal(row)
    })

    consumableRows.forEach(row => {
      calTotal(row)
    })

    setFieldValue('consumableOrderSetItem', consumableRows)
    setFieldValue('serviceOrderSetItem', serviceRows)

    setTotalPrice(total)

    setValues({
      ...values,
      consumableOrderSetItem: consumableRows,
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
  }, [consumableRows, serviceRows])

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
        case 'consumableOrderSetItem': {
          return setConsumableRows(newArray)
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
        case 'consumableOrderSetItem': {
          setConsumableRows([...consumableRows, rows[0]])
          return setFieldValue(`${type}`, consumableRows)
        }
        case 'serviceOrderSetItem': {
          const { serviceCenterServiceFK, serviceName } = rows[0]
          const serviceCenterService =
            serviceCenterServicess.find(
              o =>
                o.serviceId === serviceCenterServiceFK &&
                o.serviceCenterId === serviceName,
            ) || {}
          if (serviceCenterService) {
            const item = servicess.find(o => o.value === serviceFK)
            rows[0] = {
              ...rows[0],
              isDeleted: false,
              tempServiceCenterServiceFK:
                serviceCenterService.serviceCenter_ServiceId,
              tempServiceName: item ? item.name : undefined,
            }
          }

          setServiceRows([...serviceRows, rows[0]])
          setServiceCenterFK()
          setServiceFK()
          return setFieldValue(`${type}`, serviceRows)
        }
        default:
          return rows
      }
    } else if (changed) {
      const getType = t => {
        switch (t) {
          case 'consumableOrderSetItem': {
            return {
              stateRows: consumableRows,
              setStateRow: v => setConsumableRows(v),
            }
          }
          case 'serviceOrderSetItem': {
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

      const newRows = rows.map(item => {
        let tempServiceCenterServiceFK
        const tempServiceId = serviceFK || item.serviceCenterServiceFK
        const tempServiceCenterId = serviceCenterFK || item.serviceName
        const serviceCenterService =
          serviceCenterServicess.find(
            o =>
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
    }
  }

  const getServiceCenterService = row => {
    const { servicefk = serviceFK, serviceName } = row
    if (!servicefk || !serviceName) {
      setSelectedItem({})
      return
    }
    const serviceCenterService =
      serviceCenterServicess.find(
        o => o.serviceId === servicefk && o.serviceCenterId === serviceName,
      ) || {}
    if (serviceCenterService) {
      row.unitPrice = serviceCenterService.unitPrice
    }
  }
  const calSubtotal = e => {
    const { row } = e
    const { unitPrice, quantity } = row
    if ((unitPrice || unitPrice === 0) && (quantity || quantity === 0))
      row.subTotal = unitPrice * quantity
  }

  const onAddedRowsChange = type => addedRows => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]

      const { servicefk = serviceFK, serviceName } = newRow

      if (type === 'service') {
        if (servicefk && serviceName) {
          const returnRow = addedRows.map(row => ({
            ...row,
          }))
          return returnRow
        }

        return addedRows.map(row => ({
          ...row,
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
      }
    })
  }

  const handleItemOnChange = e => {
    const { option, row } = e
    const { sellingPrice } = option
    setSelectedItem(option)
    row.quantity = 1
    row.unitPrice = sellingPrice
    row.subTotal = row.quantity * row.unitPrice
  }

  const consumableProps = {
    columns: [
      { name: 'inventoryConsumableFK', title: 'Product Name' },
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
      { name: 'serviceFK', title: 'Service' },
      { name: 'serviceName', title: 'Service Center' },
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
          if (!row.serviceName) {
            options = tempArray
          } else {
            options = tempArray.filter(o =>
              o.serviceCenters.find(m => m.value === row.serviceName),
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
          setServiceFK(e.val)
          handleItemOnChange
          getServiceCenterService(e.row)
          if (!e.row.quantity) {
            e.row.quantity = 1
          }
          const serviceCenterService = serviceCenterServicess.find(
            o => o.serviceId === e.val && o.isDefault,
          )
          if (serviceCenterService) {
            e.row.unitPrice = serviceCenterService.unitPrice
            e.row.serviceName = serviceCenterService.serviceCenterId
            e.row.subTotal = e.row.quantity * serviceCenterService.unitPrice
            e.row.serviceCenterServiceFK =
              serviceCenterService.serviceCenter_ServiceId
          }
          calSubtotal
        },
      },
      {
        columnName: 'serviceName',
        type: 'select',
        options: row => {
          let options = []
          const tempArray = [...serviceCenterss]
          if (!row.serviceFK) {
            options = tempArray
          }
          options = tempArray.filter(o =>
            o.services.find(m => m.value === row.serviceFK),
          )
          return options
        },
        onChange: e => {
          setServiceCenterFK(e.val)
          handleItemOnChange
          getServiceCenterService(e.row)
          e.row.serviceName = e.val
          let originServiceCenterService = serviceCenterServicess.find(
            o => o.serviceCenter_ServiceId === e.row.serviceCenterServiceFK,
          )
          const serviceCenterService = serviceCenterServicess.find(
            o =>
              o.serviceId === originServiceCenterService.serviceId &&
              o.serviceCenterId === e.val,
          )
          if (serviceCenterService) {
            e.row.unitPrice = serviceCenterService.unitPrice
            e.row.subTotal = e.row.quantity * serviceCenterService.unitPrice
            e.row.serviceCenterServiceFK =
              serviceCenterService.serviceCenter_ServiceId
          }
          calSubtotal
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

  const consumableEditingProps = {
    messages: {
      deleteCommand: 'Delete consumable',
    },
    showAddCommand: true,
    onAddedRowsChange: onAddedRowsChange('consumable'),
    onCommitChanges: onCommitChanges('consumableOrderSetItem'),
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
          <Authorized authority='inventorymaster.orderset.consumable'>
            <InventoryType
              title='Ophthalmic Product'
              inventoryTypeProps={consumableProps}
              schema={consumableSchema}
              rows={consumableRows}
              editingProps={consumableEditingProps}
              style={{ marginTop: 15 }}
            />
          </Authorized>

          <Authorized authority='inventorymaster.orderset.service'>
            <InventoryType
              title='Service'
              inventoryTypeProps={serviceProps}
              schema={serviceSchema}
              rows={serviceRows}
              editingProps={serviceEditingProps}
              style={{ marginTop: 15 }}
            />
          </Authorized>
        </GridContainer>
      </CardContainer>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
