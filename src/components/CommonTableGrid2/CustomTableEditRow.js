import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, TableEditRow } from '@devexpress/dx-react-grid-material-ui'
import { TableCell, withStyles } from '@material-ui/core'
import SelectCell from './EditCellComponents/SelectCell'

const styles = (theme) => ({
  lookupEditCell: {
    paddingTop: theme.spacing.unit * 1.25,
    paddingRight: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
  },
})

const DefaultEditCell = (props) => <TableEditRow.Cell {...props} />

const LookupEditCellBase = ({
  availableColumnValues,
  column: { name },
  value,
  onValueChange,
  classes,
  ...props
}) => {
  console.log('lookup edit cell base', props)
  return (
    <TableCell className={classes.lookupEditCell} {...props}>
      <SelectCell
        name={name}
        label={value}
        value={value}
        onValueChange={onValueChange}
        options={availableColumnValues}
      />
    </TableCell>
  )
}

export const LookupEditCell = withStyles(styles)(LookupEditCellBase)

const EditCell = (props) => {
  const {
    editingEnabled,
    onValueChange,
    column,
    availableColumns,
    ...restProps
  } = props
  const availableValues = availableColumns[column.name]

  const TableCellProps = {
    tableRow: restProps.tableRow,
    tableColumn: restProps.tableColumn,
    colSpan: restProps.colSpan || undefined,
    rowSpan: restProps.rowSpan || undefined,
  }

  if (!editingEnabled) {
    return <Table.Cell {...restProps} />
  }
  return availableValues ? (
    <LookupEditCell {...props} availableColumnValues={availableValues} />
  ) : (
    <TableEditRow.Cell
      {...restProps}
      column={column}
      onValueChange={onValueChange}
      editingEnabled={editingEnabled}
    />
  )
}

class CustomTableEditRow extends PureComponent {
  static propTypes = {
    availableColumns: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { availableColumns } = this.props

    this.EditCell = (editorProps) => (
      <EditCell availableColumns={availableColumns} {...editorProps} />
    )
  }

  render () {
    return <TableEditRow cellComponent={this.EditCell} />
  }
}

export default CustomTableEditRow
