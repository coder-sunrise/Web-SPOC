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
    paddingLeft: 22,
    paddingRight: 22,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#cccccc',
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
  disableDrag,
  ...restGridProps
}) => {
  const onSortEnd = ({ newIndex, oldIndex }) => {
    const newRows = arrayMove(dataSource, oldIndex, newIndex)
    onRowDrop(newRows, oldIndex, newIndex)
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
        updateBeforeSortStart={(aa) => {
          console.log('111', aa.node.innerHTML)
          aa.node.innerHTML =
            '<svg focusable="false" viewBox="0 0 24 19" aria-hidden="true" style="width:20"><path d="M3 15h18v-2H3v2zm0 4h18v-2H3v2zm0-8h18V9H3v2zm0-6v2h18V5H3z"></path></svg>&nbsp;&nbsp;Drag to re-order '
        }}
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
        <Table.Cell {...restProps} style={{ paddingLeft: 10, paddingRiht: 0 }}>
          <div className={classes.dragCellContainer}>
            {disableDrag ? (
              <span
                style={{
                  ...restProps.style,
                  ...{
                    cursor: 'not-allowed',
                    paddingTop: 4,
                    margin: '0px 8px',
                  },
                  color: 'gray',
                }}
              >
                <ReOrder />
              </span>
            ) : (
              <DragHandle />
            )}
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
      forceRender
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
