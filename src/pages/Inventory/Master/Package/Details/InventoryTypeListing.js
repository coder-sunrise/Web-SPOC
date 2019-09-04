import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Remove from '@material-ui/icons/Remove'
import { Table } from '@devexpress/dx-react-grid-material-ui'
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
  commitChanges,
  onAddedRowsChange,
  onRowChangesChange,
  onDeletedRowIdsChange,
  ...props
}) => {
  console.log('packDetail', packDetail)
  console.log(packDetail.servicePackageItem)
  console.log('service', service)
  console.log('values', props)
  const { values } = props
  console.log('hi', values.servicePackageItem)
  const {
    medicationTableParas,
    medicationColExtensions,
    medicationList,
  } = medication
  const {
    consumableTableParas,
    consumableColExtensions,
    consumableList,
  } = consumable
  const {
    vaccinationTableParas,
    vaccinationColExtensions,
    vaccinationList,
  } = vaccination
  const { serviceTableParas, serviceColExtensions, serviceList } = service
  // const [
  //   rows,
  //   setRows,
  // ] = useState([])
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

  const clickRow = (row, event) => {
    // setRows([
    //   ...rows,
    //   row,
    // ])
  }

  const changeEditingRowIds = (editingRowIds) => setRows({ editingRowIds })

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
              <b>Package Price: $404.00</b>
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
            rows={medicationList}
            FuncProps={{ pager: false }}
            ActionProps={{ TableCellComponent: TableCell }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              // onCommitChanges: this.commitChanges,
              // onAddedRowsChange: this.onAddedRowsChange,
            }}
          />
        </GridItem>
        <GridItem xs={12} className={classes.tableHeader}>
          <b>Consumable</b>
          <EditableTableGrid
            {...consumableTableParas}
            columnExtensions={consumableColExtensions}
            rows={consumableList}
            FuncProps={{ pager: false }}
            ActionProps={{ TableCellComponent: TableCell }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
            }}
          />
        </GridItem>
        <GridItem xs={12} className={classes.tableHeader}>
          <b>Vaccination</b>
          <EditableTableGrid
            {...vaccinationTableParas}
            columnExtensions={vaccinationColExtensions}
            rows={vaccinationList}
            FuncProps={{ pager: false }}
            ActionProps={{ TableCellComponent: TableCell }}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              onCommitChanges: commitChanges,
              onAddedRowsChange: onAddedRowsChange,
              // onCommitChanges: this.commitChanges,
              // onAddedRowsChange: this.onAddedRowsChange,
            }}
          />
        </GridItem>
        <GridItem xs={12} className={classes.tableHeader}>
          <b>Service</b>
          <EditableTableGrid
            {...serviceTableParas}
            columnExtensions={serviceColExtensions}
            rows={values.servicePackageItem ? values.servicePackageItem : []}
            FuncProps={{ pager: false }}
            onRowClick={clickRow}
            EditingProps={{
              showAddCommand: true,
              showEditCommand: false,
              // onEditingRowIdsChange: { changeEditingRowIds },
              // onRowChangesChange: { onRowChangesChange },
              onDeletedRowIdsChange: onDeletedRowIdsChange,
              onCommitChanges: commitChanges,
              // onAddedRowsChange: onAddedRowsChange,
            }}
          />
        </GridItem>
      </GridContainer>
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(InventoryTypeListing)
