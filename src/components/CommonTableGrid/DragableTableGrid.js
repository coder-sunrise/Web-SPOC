import React from 'react'
import { connect } from 'dva'
// material ui
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
import { CommonTableGrid, Tooltip } from '@/components'

const DragHandle = SortableHandle(({ style }) => (
  <Tooltip title='Drag'>
    <span style={{ ...style, ...{ cursor: 'move' } }}>
      <ReOrder />
    </span>
  </Tooltip>
))

const TableCell = ({ value, ...restProps }) => {
  const { column } = restProps
  if (column.name === 'drag') {
    return (
      <Table.Cell {...restProps}>
        <DragHandle />
      </Table.Cell>
    )
  }
  return <Table.Cell {...restProps}>{restProps.children}</Table.Cell>
}

const DragableTableGrid = ({
  dispatch,
  rows,
  columns,
  columnExtensions,
  onRowDrop,
  ...restGridProps
}) => {
  const onSortEnd = ({ newIndex, oldIndex }) => {
    const newRows = arrayMove(rows, oldIndex, newIndex)
    dispatch({
      type: 'global/incrementCommitCount',
    })
    onRowDrop(newRows)
  }

  const _TableBody = ({ row, ...restProps }) => {
    const TableBody = SortableContainer(Table.TableBody)
    return <TableBody {...restProps} onSortEnd={onSortEnd} useDragHandle />
  }

  const _TableRow = ({ row, ...restProps }) => {
    const TableRow = SortableElement(Table.Row)
    const index = rows.map((i) => i.id).indexOf(row.id)
    return <TableRow {...restProps} index={index} />
  }

  return (
    <CommonTableGrid
      rows={rows}
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

export default connect()(DragableTableGrid)
