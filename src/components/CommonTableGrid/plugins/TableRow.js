import React from 'react'
import { Getter, Plugin } from '@devexpress/dx-react-core'

import _ from 'lodash'
import {
  DragDropProvider,
  Grid as DevGrid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableGroupRow,
  TableHeaderRow,
  TableSummaryRow,
  TableSelection,
  Toolbar,
  TableFixedColumns,
  VirtualTable,
  TableTreeColumn,
  IntegratedSelection,
} from '@devexpress/dx-react-grid-material-ui'

class TableRow extends React.Component {
  shouldComponentUpdate (nextProps) {
    // console.log(nextProps.extraCellConfig, this.props.extraCellConfig)
    // console.log(nextProps.row === this.props.row)
    const { extraCellConfig: orgConfig, row: orgRow } = this.props

    const { getRowId, extraCellConfig, columnExtensions = [], row } = nextProps

    if (
      extraCellConfig &&
      extraCellConfig.editingCells &&
      extraCellConfig.editingCells.find(
        (o) => o.rowId === getRowId(nextProps.row),
      )
    )
      return true

    if (
      orgConfig &&
      orgConfig.editingCells &&
      orgConfig.editingCells.find((o) => o.rowId === getRowId(this.props.row))
    )
      return true

    // if (columnExtensions.find((o) => typeof o.options === 'function')) {
    //   return true
    // }

    if (!_.isEqual(orgRow._errors, row._errors)) return true
    return false
  }

  render () {
    const {
      onRowDoubleClick = undefined,
      onContextMenu = undefined,
      onRowClick = (f) => f,
      rowMoveable = (f) => false,
      row,
      tableRow,
      rowSelectionEnabled,
      ...restProps
    } = this.props
    console.log(2)
    return (
      <Table.Row
        {...restProps}
        onDoubleClick={(event) => {
          onRowDoubleClick && onRowDoubleClick(row || tableRow.row, event)
        }}
        onClick={(event) => {
          onRowClick(row, event)
        }}
        onContextMenu={(event) => {
          onContextMenu && onContextMenu(row || tableRow.row, event)
        }}
        className={
          typeof rowMoveable === 'function' && rowMoveable(row) ? (
            'moveable'
          ) : (
            ''
          )
        }
      />
    )
  }
}

export default TableRow
