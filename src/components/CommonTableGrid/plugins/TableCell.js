import React from 'react'
import _ from 'lodash'

import { Paper, Tooltip, IconButton } from '@material-ui/core'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'
import ReOrder from '@material-ui/icons/Reorder'
import { Table } from '@devexpress/dx-react-grid-material-ui'
import {
  SortableContainer,
  SortableHandle,
  SortableElement,
  arrayMove,
} from 'react-sortable-hoc'
import { Action } from '@devexpress/dx-react-core'
import {
  getGlobalVariable,
  getUniqueNumericId,
  difference,
} from '@/utils/utils'

const actionCols = ['actions', 'action', 'Action', 'editCommand']
const DragHandle = SortableHandle(({ style }) => (
  <Tooltip title='Drag'>
    <span
      style={{
        ...style,
        // ...{ cursor: 'move', paddingTop: 4, margin: '0px 8px' },
      }}
    >
      <ReOrder />
    </span>
  </Tooltip>
))

class TableCell extends React.Component {
  shouldComponentUpdate(nextProps) {
    // console.log(nextProps.extraCellConfig, this.props.extraCellConfig)
    // console.log(row === this.props.row)

    if (window._forceTableUpdate) {
      return true
    }
    const { extraCellConfig: orgConfig, row: orgRow } = this.props

    const {
      getRowId,
      extraCellConfig,
      columnExtensions = [],
      row,
      forceRender,
    } = nextProps
    if (forceRender) return true
    // console.log(extraCellConfig, columnExtensions)
    if (
      window._forceTableRowUpdate &&
      window._forceTableRowUpdate.includes(getRowId(row))
    ) {
      // console.log(4, row)
      return true
    }

    // console.log(orgConfig, extraCellConfig, nextProps)
    if (
      extraCellConfig &&
      extraCellConfig.editingCells &&
      extraCellConfig.editingCells.find(
        o => o.rowId === getRowId(row), // &&
        // o.columnName === nextProps.column.name,
      )
    ) {
      // console.log(3, row)

      return true
    }

    if (
      orgConfig &&
      orgConfig.editingCells &&
      orgConfig.editingCells.find(
        o => o.rowId === getRowId(this.props.row), // &&
        // o.columnName === nextProps.column.name,
      )
    ) {
      // console.log(2, row)
      return true
    }

    if (nextProps.column) {
      const col =
        columnExtensions.find(o => o.columnName === nextProps.column.name) || {}
      if (
        // typeof col.options === 'function' ||
        row._errors &&
        row._errors.find(o => o.params.path === nextProps.column.name)
      ) {
        // console.log(1, row)

        return true
      }

      if (nextProps.value !== this.props.value) return true

      if (col.observeFields) {
        const changedFields = col.observeFields.map(o => row[o] !== orgRow[o])
        if (changedFields.filter(o => o).length > 0) return true
      }

      //
    }
    if (nextProps.column && actionCols.includes(nextProps.column.name))
      return true
    // if (!_.isEqual(orgRow._errors, row._errors)) return true
    // if (this.editing === true) {
    //   this.editing = false
    //   return true
    // }
    return false
    // if (nextProps.extraCellConfig) return true
    // return row !== this.props.row
  }

  moveRow = (row, direction) => () => {
    const { onRowMove } = this.props
    if (onRowMove) onRowMove(row, direction)
  }

  render() {
    const {
      columnExtensions = [],
      extraState,
      getRowId,
      classes: clses,
      onClick,
      onContextMenu,
      height,
      rows,
      columns,
      schema,
      EditProps,
      FuncProps,
      theme,
      loading,
      global,
      children,
      leftColumns,
      style,
      className,
      colSpan,
      rowSpan,
      column,
      row,
      authorize,
      align,
      tableColumn,
      classes,

      ...restProps
    } = this.props

    let cfg = {
      // tabIndex: 0,
      leftColumns,
      style,
      className,
      colSpan,
      // classes,
      rowSpan,
      column,
      row,
      tableColumn,
    }

    if (extraState) {
      const colCfg =
        columnExtensions.find(o => o.columnName === column.name) || {}
      const latestRow = window.$tempGridRow[this.gridId]
        ? window.$tempGridRow[this.gridId][getRowId(row)] || row
        : row
      // try {
      //   console.log(!colCfg, !colCfg.isDisabled, !colCfg.isDisabled(latestRow))
      // } catch (error) {}
      // console.log(this.props.authorize)
      if (authorize && authorize.rights === 'disable') {
        return <Table.Cell {...cfg}>{children}</Table.Cell>
      }
      if (
        (!colCfg.isDisabled || !colCfg.isDisabled(latestRow)) &&
        !colCfg.disabled
      ) {
        if (!['radio', 'checkbox', 'custom'].includes(colCfg.type)) {
          cfg.tabIndex = 0
          cfg.onFocus = onClick
        }
      }
    }

    if (column) {
      if (column.name === 'rowMove') {
        const cls = {
          width: 18,
          height: 18,
          padding: 1,
          margin: '0 auto',
        }

        if (!this.props.rowMoveable || !this.props.rowMoveable(row))
          return <Table.Cell>{children}</Table.Cell>

        return (
          <Table.Cell
            // {...restProps}
            // {...cfg}
            editingEnabled={false}
            className='td-move-cell'
            style={{ padding: 0 }}
          >
            <div style={{ display: 'flex', flexFlow: 'column' }}>
              <IconButton
                className='move-button'
                style={{ ...cls, display: 'none' }}
                onClick={this.moveRow(row, 'UP')}
              >
                <ArrowDropUp />
              </IconButton>
              <IconButton
                className='move-button'
                style={cls}
                onClick={this.moveRow(row, 'DOWN')}
              >
                <ArrowDropDown />
              </IconButton>
            </div>
          </Table.Cell>
        )
      }
      if (column.name === 'rowDrag') {
        return (
          <Table.Cell>
            <div className={clses.dragCellContainer}>
              <DragHandle />
            </div>
          </Table.Cell>
        )
      }
    }
    return <Table.Cell {...cfg}>{children}</Table.Cell>
  }
}

export default TableCell
