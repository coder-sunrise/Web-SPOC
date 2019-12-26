import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Remove from '@material-ui/icons/Remove'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Yup from '@/utils/yup'
import {
  CardContainer,
  Tooltip,
  Button,
  GridContainer,
  GridItem,
  EditableTableGrid,
} from '@/components'
import { podoOrderType, getInventoryItemList, getServices } from '@/utils/codes'

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
    return () => {
      dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
    }
  }, [])

  const {
    medicationOrderSetItem,
    consumableOrderSetItem,
    vaccinationOrderSetItem,
    serviceOrderSetItem,
  } = values

  const Cell = ({ column, row, ...p }) => {
    if (column.name === 'Action') {
      return (
        <Table.Cell {...p}>
          <Tooltip title='Remove' placement='bottom'>
            <Button
              size='sm'
              onClick={() => console.log(row)}
              justIcon
              round
              color='primary'
              style={{ marginRight: 5 }}
            >
              <Remove />
            </Button>
          </Tooltip>
        </Table.Cell>
      )
    }
    return <Table.Cell {...p} />
  }
  const TableCell = (p) => Cell({ ...p, dispatch })

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
  const [
    editingRowIds,
    setEditingRowIds,
  ] = useState([])
  const [
    rowChanges,
    setRowChanges,
  ] = useState({})

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
      if (
        orderSetDetail.entity &&
        orderSetDetail.entity.serviceOrderSetItem.length > 0
      ) {
        serviceOrderSetItem.forEach((o) => {
          o.serviceName = serviceCenterServices.find(
            (i) => i.serviceCenter_ServiceId === o.serviceCenterServiceFK,
          ).serviceCenterId
        })
      }
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

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
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
      setMedicationRows(medicationOrderSetItem)
      setConsumableRows(consumableOrderSetItem)
      setVaccinationRows(vaccinationOrderSetItem)
      setServiceRows(serviceOrderSetItem)
      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
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
      medicationRows.forEach((row) => {
        if (!row.isDeleted) {
          total += row.subTotal
        }
      })

      serviceRows.forEach((row) => {
        if (!row.isDeleted) {
          total += row.subTotal
        }
      })

      consumableRows.forEach((row) => {
        if (!row.isDeleted) {
          total += row.subTotal
        }
      })

      vaccinationRows.forEach((row) => {
        if (!row.isDeleted) {
          total += row.subTotal
        }
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

      dispatch({
        // force current edit row components to update
        type: 'global/updateState',
        payload: {
          commitCount: (commitCount += 1),
        },
      })
    },
    [
      medicationRows,
      consumableRows,
      vaccinationRows,
      serviceRows,
    ],
  )

  useEffect(
    () => {
      if (serviceRows.length > 0 && serviceCenterServicess.length > 0) {
        const newServiceRows = serviceRows.map((o) => {
          if (o.tempServiceCenterServiceFK) {
            return {
              ...o,
            }
          }
          return {
            ...o,
            serviceCenterServiceFK: serviceCenterServicess.find(
              (s) => s.serviceCenter_ServiceId === o.serviceCenterServiceFK,
            ).serviceId,
            serviceName: serviceCenterServicess.find(
              (s) => s.serviceCenter_ServiceId === o.serviceCenterServiceFK,
            ).serviceCenterId,
          }
        })

        setServiceRows(newServiceRows)

        dispatch({
          // force current edit row components to update
          type: 'global/updateState',
          payload: {
            commitCount: (commitCount += 1),
          },
        })
        dispatch({
          type: 'orderSetDetail/updateState',
          payload: {
            entity: {
              ...values,
              serviceOrderSetItem: newServiceRows,
            },
          },
        })
      }
    },
    [
      serviceCenterServicess,
    ],
  )

  const onCommitChanges = (type) => ({ rows, deleted }) => {
    if (deleted) {
      const deletedSet = new Set(deleted)
      const changedRows = rows.filter((row) => !deletedSet.has(row.id))
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
    }
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
          rows[0] = {
            ...rows[0],
            isDeleted: false,
            tempServiceCenterServiceFK:
              serviceCenterService.serviceCenter_ServiceId,
            tempServiceName: servicess.find((o) => o.value === serviceFK).name,
          }
        }

        setServiceRows([
          ...serviceRows,
          rows[0],
        ])
        return setFieldValue(`${type}`, serviceRows)
      }
      default:
        return rows
    }
  }

  const onEditingRowIdsChange = (type) => ({ rows, deleted }) => {}

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
    const { value, row } = e
    row.subTotal = value * row.unitPrice
  }

  const onRowChangesChange = (rows) => {}

  const onAddedRowsChange = (type) => (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]

      const {
        quantity,
        unitPrice,
        serviceCenterServiceFK,
        serviceName,
      } = newRow

      const total = () => {
        if (quantity && unitPrice) {
          return quantity * unitPrice
        }
        return 0.0
      }
      if (type === 'service') {
        if (serviceCenterServiceFK && serviceName) {
          const returnRow = addedRows.map((row) => ({
            ...row,
            subTotal: total(),
          }))
          return returnRow
        }

        return addedRows.map((row) => ({
          ...row,
          unitPrice: undefined,
          subTotal: total(),
        }))
      }

      if (selectedItem) {
        return addedRows.map((row) => ({
          ...row,
          subTotal: total(),
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

    dispatch({
      // force current edit row components to update
      type: 'global/updateState',
      payload: {
        commitCount: (commitCount += 1),
      },
    })
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
        onChange: (e) => calSubtotal(e),
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
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
        onChange: (e) => calSubtotal(e),
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
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
        onChange: (e) => calSubtotal(e),
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
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
        options: () =>
          servicess.filter(
            (o) =>
              !serviceCenterFK ||
              o.serviceCenters.find((m) => m.value === serviceCenterFK),
          ),

        onChange: (e) => {
          setServiceFK(e.val)
          handleItemOnChange
          getServiceCenterService(e.row)
          dispatch({
            // force current edit row components to update
            type: 'global/updateState',
            payload: {
              commitCount: (commitCount += 1),
            },
          })
        },
      },
      {
        columnName: 'serviceName',
        type: 'select',
        options: (row) => {
          return serviceCenterss.filter(
            (o) =>
              !serviceFK ||
              o.services.find(
                (m) => m.value === serviceFK || m.value === row.serviceName,
              ),
          )
        },

        onChange: (e) => {
          setServiceCenterFK(e.val)
          handleItemOnChange
          getServiceCenterService(e.row)
          dispatch({
            // force current edit row components to update
            type: 'global/updateState',
            payload: {
              commitCount: (commitCount += 1),
            },
          })
        },
      },
      {
        columnName: 'quantity',
        width: 150,
        type: 'number',
        format: '0.0',
        onChange: (e) => calSubtotal(e),
      },
      {
        columnName: 'unitPrice',
        width: 150,
        type: 'number',
        currency: true,
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
          <GridItem xs={12}>
            <h4>
              <b>Medication</b>
            </h4>
            <EditableTableGrid
              {...medicationProps}
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={onEditingRowIdsChange()}
              rowChanges={rowChanges}
              onRowChangesChange={onRowChangesChange()}
              schema={medicationSchema}
              rows={medicationRows}
              onRowDoubleClick={undefined}
              FuncProps={{ pager: false }}
              EditingProps={{
                messages: {
                  deleteCommand: 'Delete medication',
                },
                showAddCommand: true,
                showEditCommand: false,
                onCommitChanges: onCommitChanges('medicationOrderSetItem'),
                onAddedRowsChange: onAddedRowsChange('medication'),
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.tableHeader}>
            <h4>
              <b>Consumable</b>
            </h4>
            <EditableTableGrid
              {...consumableProps}
              schema={consumableSchema}
              rows={consumableRows}
              FuncProps={{ pager: false }}
              onRowDoubleClick={undefined}
              EditingProps={{
                messages: {
                  deleteCommand: 'Delete consumable',
                },
                showAddCommand: true,
                showEditCommand: false,
                onAddedRowsChange: onAddedRowsChange('consumable'),
                onCommitChanges: onCommitChanges('consumableOrderSetItem'),
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.tableHeader}>
            <h4>
              <b>Vaccination</b>
            </h4>
            <EditableTableGrid
              {...vaccinationProps}
              schema={vaccinationSchema}
              rows={vaccinationRows}
              FuncProps={{ pager: false }}
              onRowDoubleClick={undefined}
              EditingProps={{
                messages: {
                  deleteCommand: 'Delete vaccination',
                },
                showAddCommand: true,
                showEditCommand: false,
                onCommitChanges: onCommitChanges('vaccinationOrderSetItem'),
                onAddedRowsChange: onAddedRowsChange('vaccination'),
              }}
            />
          </GridItem>
          <GridItem xs={12} className={classes.tableHeader}>
            <h4>
              <b>Service</b>
            </h4>
            <EditableTableGrid
              {...serviceProps}
              schema={serviceSchema}
              rows={serviceRows}
              FuncProps={{ pager: false }}
              onRowDoubleClick={undefined}
              EditingProps={{
                messages: {
                  deleteCommand: 'Delete service',
                },
                showAddCommand: true,
                showEditCommand: false,
                onAddedRowsChange: onAddedRowsChange('service'),
                onCommitChanges: onCommitChanges('serviceOrderSetItem'),
              }}
            />
          </GridItem>
        </GridContainer>
      </CardContainer>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
