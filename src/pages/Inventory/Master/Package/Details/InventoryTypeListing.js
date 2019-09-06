import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Remove from '@material-ui/icons/Remove'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import Yup from '@/utils/yup'
import {
  CardContainer,
  CommonTableGrid,
  Tooltip,
  Button,
  GridContainer,
  GridItem,
  EditableTableGrid,
} from '@/components'

const styles = () => ({
  displayDiv: {
    float: 'right',
    padding: '20px',
  },

  tableHeader: {
    marginTop: 50,
  },
})

const InventoryTypeListing = ({
  dispatch,
  classes,
  packDetail,
  medication,
  consumable,
  vaccination,
  service,
  setFieldValue,
  selectedItem,
  setSelectedItem,
  setServiceCenter,
  ...props
}) => {
  const {
    medicationPackageItem,
    consumablePackageItem,
    vaccinationPackageItem,
    servicePackageItem,
  } = props.values
  const { medicationTableParas, medicationColExtensions } = medication
  const { consumableTableParas, consumableColExtensions } = consumable
  const { vaccinationTableParas, vaccinationColExtensions } = vaccination
  const { serviceTableParas, serviceColExtensions, serviceList } = service

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
    quantity: Yup.number().required(),
  })
  const consumableSchema = Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    quantity: Yup.number().required(),
  })
  const vaccinationSchema = Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    quantity: Yup.number().required(),
  })

  const onCommitChanges = (type) => ({ rows, deleted }) => {
    if (deleted) {
      const deletedSet = new Set(deleted)
      const changedRows = rows.filter((row) => !deletedSet.has(row.id))
      setFieldValue(`${type}`, changedRows)
      return rows
    }
    switch (type) {
      case 'medicationPackageItem': {
        const vals = medicationPackageItem.concat(rows[0])
        return setFieldValue(`${type}`, vals)
      }
      case 'consumablePackageItem': {
        const vals = consumablePackageItem.concat(rows[0])
        return setFieldValue(`${type}`, vals)
      }
      case 'vaccinationPackageItem': {
        const vals = vaccinationPackageItem.concat(rows[0])
        return setFieldValue(`${type}`, vals)
      }
      case 'servicePackageItem': {
        const vals = servicePackageItem.concat(rows[0])
        return setFieldValue(`${type}`, vals)
      }
      default:
        return rows
    }
  }

  const onAddedRowsChange = (addedRows) => {
    if (addedRows.length > 0) {
      const newRow = addedRows[0]

      const { quantity, unitPrice } = newRow

      const total = () => {
        if (quantity && unitPrice) {
          return quantity * unitPrice
        }
        return undefined
      }

      return addedRows.map((row) => ({
        ...row,
        unitPrice: selectedItem.sellingPrice
          ? selectedItem.sellingPrice
          : selectedItem.unitPrice,
        subTotal: total(),
      }))
    }
    setSelectedItem({})
    return addedRows
  }

  const calTotal = () => {
    let total = 0
    medicationPackageItem.forEach((row) => {
      total += row.subTotal
    })

    servicePackageItem.forEach((row) => {
      total += row.subTotal
    })

    consumablePackageItem.forEach((row) => {
      total += row.subTotal
    })

    vaccinationPackageItem.forEach((row) => {
      total += row.subTotal
    })

    return total
  }

  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <GridContainer>
        <GridItem xs={12}>
          <div className={classes.displayDiv}>
            <h4>
              <b>Package Price: ${calTotal().toFixed(2)}</b>
            </h4>
          </div>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12}>
          <b>Medication</b>
          <EditableTableGrid
            {...medicationTableParas}
            columnExtensions={medicationColExtensions}
            schema={medicationSchema}
            rows={medicationPackageItem}
            FuncProps={{ pager: false }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              onCommitChanges: onCommitChanges('medicationPackageItem'),
              onAddedRowsChange: onAddedRowsChange,
            }}
          />
        </GridItem>
        <GridItem xs={12} className={classes.tableHeader}>
          <b>Consumable</b>
          <EditableTableGrid
            {...consumableTableParas}
            columnExtensions={consumableColExtensions}
            schema={consumableSchema}
            rows={consumablePackageItem}
            FuncProps={{ pager: false }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              onAddedRowsChange: onAddedRowsChange,
              onCommitChanges: onCommitChanges('consumablePackageItem'),
            }}
          />
        </GridItem>
        <GridItem xs={12} className={classes.tableHeader}>
          <b>Vaccination</b>
          <EditableTableGrid
            {...vaccinationTableParas}
            columnExtensions={vaccinationColExtensions}
            schema={vaccinationSchema}
            rows={vaccinationPackageItem}
            FuncProps={{ pager: false }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              onCommitChanges: onCommitChanges('vaccinationPackageItem'),
              onAddedRowsChange: onAddedRowsChange,
            }}
          />
        </GridItem>
        <GridItem xs={12} className={classes.tableHeader}>
          <b>Service</b>
          <EditableTableGrid
            {...serviceTableParas}
            columnExtensions={serviceColExtensions}
            rows={servicePackageItem}
            FuncProps={{ pager: false }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              onAddedRowsChange: onAddedRowsChange,
              onCommitChanges: onCommitChanges('servicePackageItem'),

              // onEditingRowIdsChange: { changeEditingRowIds },
              // onRowChangesChange: { onRowChangesChange },
              // onRowChangesChange: onRowChangesChange,
              // onDeletedRowIdsChange: onDeletedRowIdsChange,
              // onAddedRowsChange: onAddedRowsChange,
            }}
          />
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
