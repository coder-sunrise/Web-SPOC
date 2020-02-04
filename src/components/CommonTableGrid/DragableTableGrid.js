import React from 'react'
import { connect } from 'dva'
// material ui
import { withStyles } from '@material-ui/core'
import ReOrder from '@material-ui/icons/Reorder'
// devgrids
import { Table } from '@devexpress/dx-react-grid-material-ui'
// react-sortable-hoc
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc'
// common component
import {
  Checkbox,
  CommonTableGrid,
  EditableTableGrid,
  Tooltip,
} from '@/components'

const styles = () => ({
  dragCellContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortableContainer: {
    zIndex: 10000,
  },
})

const DragHandle = SortableHandle(({ style }) => (
  <Tooltip title='Drag'>
    <span
      style={{
        ...style,
        ...{ cursor: 'move', paddingTop: 4, margin: '0px 8px' },
      }}
    >
      <ReOrder />
    </span>
  </Tooltip>
))

const DragableTableGrid = ({
  classes,
  editable = false,
  dispatch,
  dataSource,
  columns,
  columnExtensions,
  onRowDrop,
  handleCommitChanges,
  height,
  ...restGridProps
}) => {
  const onSortEnd = ({ newIndex, oldIndex }) => {
    const newRows = arrayMove(dataSource, oldIndex, newIndex)
    onRowDrop(newRows)
    dispatch({
      type: 'global/incrementCommitCount',
    })
  }

  const _TableBody = ({ row, ...restProps }) => {
    const TableBody = SortableContainer(Table.TableBody)
    return (
      <TableBody
        {...restProps}
        onSortEnd={onSortEnd}
        useDragHandle
        helperClass={classes.sortableContainer}
      />
    )
  }

  const _TableRow = ({ row, ...restProps }) => {
    const TableRow = SortableElement(Table.Row)
    const index = dataSource.map((i) => i.id).indexOf(row.id)
    return <TableRow {...restProps} index={index} />
  }

  const onCommitChanges = ({ rows, changed }) => {
    handleCommitChanges(rows)
  }

  const handleCheckboxTick = (row, checked) => {
    const newRow = { ...row, isSelected: checked }
    handleCommitChanges(
      dataSource.map((item) => (item.id === newRow.id ? newRow : { ...item })),
    )
    dispatch({
      type: 'global/incrementCommitCount',
    })
  }

  const TableCell = ({ value, ...restProps }) => {
    const { column, row } = restProps
    const handleChange = (v) => {
      handleCheckboxTick(row, v.target.value)
    }
    if (column.name === 'drag') {
      return (
        <Table.Cell {...restProps}>
          <div className={classes.dragCellContainer}>
            <DragHandle />
            {/* <Checkbox
              style={{ display: 'inline-block' }}
              simple
              checked={row.isSelected}
              onChange={handleChange}
            /> */}
          </div>
        </Table.Cell>
      )
    }
    return <Table.Cell {...restProps}>{restProps.children}</Table.Cell>
  }

  if (editable) {
    return (
      <EditableTableGrid
        rows={dataSource}
        getRowId={(row) => row.id}
        columns={columns}
        columnExtensions={columnExtensions}
        EditingProps={{
          showAddCommand: false,
          showDeleteCommand: false,
          onCommitChanges,
        }}
        {...restGridProps}
      />
    )
  }

  return (
    <CommonTableGrid
      rows={dataSource}
      getRowId={(row) => row.id}
      columns={columns}
      columnExtensions={columnExtensions}
      ActionProps={{
        TableCellComponent: TableCell,
      }}
      TableProps={{
        bodyComponent: _TableBody,
        rowComponent: _TableRow,
      }}
      {...restGridProps}
    />
  )
}

const ConnectedDragableTableGrid = connect()(DragableTableGrid)

export default withStyles(styles)(ConnectedDragableTableGrid)
