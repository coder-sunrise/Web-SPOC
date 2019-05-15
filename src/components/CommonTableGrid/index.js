import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

// material ui
import { fade } from '@material-ui/core/styles/colorManipulator'
import { LinearProgress, withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import {
  FilteringState,
  EditingState,
  GroupingState,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
} from '@devexpress/dx-react-grid'
import {
  DragDropProvider,
  Grid as DevGrid,
  GroupingPanel,
  PagingPanel,
  Table,
  TableGroupRow,
  TableHeaderRow,
  TableSelection,
  Toolbar,
  TableFixedColumns,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui'
import NumberTypeProvider from './EditCellComponents/NumberTypeProvider'
import TextTypeProvider from './EditCellComponents/TextTypeProvider'
import SelectTypeProvider from './EditCellComponents/SelectTypeProvider'
import DateTypeProvider from './EditCellComponents/DateTypeProvider'

const styles = (theme) => ({
  tableStriped: {
    '& tbody tr:nth-of-type(even)': {
      backgroundColor: fade(theme.palette.secondary.main, 0.01),
    },
    '& tbody tr:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 0.05),
    },
  },
})
const TableElement = ({ classes, ...restProps }) => {
  return <Table.Table {...restProps} className={classes.tableStriped} />
}
const TableComponent = withStyles(styles, { name: 'TableComponent' })(
  TableElement,
)
const TableBase = ({ height, scrollable, dispatch, ...props }) => {
  // console.log(props, height)
  return height ? (
    <VirtualTable tableComponent={TableComponent} height={height} {...props} />
  ) : (
    <Table tableComponent={TableComponent} {...props} />
  )
}

const DefaultTableCell = ({ dispatch, ...props }) => <Table.Cell {...props} />
const TableRow = ({ row, ...restProps }) => {
  // console.log(row, restProps)
  return (
    <Table.Row
      {...restProps}
      onDoubleClick={() => alert(JSON.stringify(row))}
      style={{
        // cursor: 'pointer',
        // ...styles[row.sector.toLowerCase()],
      }}
    />
  )
}
const getIndexedRows = (rows = []) => {
  return rows.map((o, i) => {
    return {
      sIndex: i,
      ...o,
    }
  })
}
const CommonTableGrid = ({
  pageSizes = [
    5,
    10,
    15,
  ],
  dateColumns = [],
  numberColumns = [],
  selectColumns = [],
  selectColumnsOptions = {},
  numberColumnsConfigs = {},
  columns = [],
  TableCell = DefaultTableCell,
  columnExtensions = [],
  filteringColExtensions = [],
  defaultSorting = [],
  height = undefined,
  textColumns = [],
  rightColumns = [],
  leftColumns = [],
  rows = [],
  selection = [],
  getRowId = (row) => row.Id,
  onSelectionChange = (f) => f,
  onRowDoubleClick = (f) => f,
  onRowClick = (f) => f,
  FuncProps: { edit, filter, grouping, pager, selectable } = {
    edit: false,
    filter: false,
    grouping: false,
    pager: true,
    selectable: false,
  },
  ActionProps: { TableCellComponent = DefaultTableCell } = {
    TableCellComponent: DefaultTableCell,
  },
  FilteringProps: {
    defaultFilters = [],
    onFiltersChange = (f) => f,
    filterColumnExtensions = [],
  } = {},
  extraState = [],
  extraRow = [],
  extraColumn = [],
  extraGetter = [],
  isLoading = false,
}) => {
  return (
    <Paper>
      <DevGrid
        rows={getIndexedRows(rows)}
        columns={columns}
        getRowId={getRowId}
      >
        {filter && (
          <FilteringState
            defaultFilters={defaultFilters}
            onFiltersChange={onFiltersChange}
            columnExtensions={filterColumnExtensions}
          />
        )}
        <SortingState defaultSorting={defaultSorting} />
        {selectable && (
          <SelectionState
            selection={selection}
            onSelectionChange={onSelectionChange}
          />
        )}
        {grouping && <GroupingState />}
        {pager && <PagingState />}

        {extraState.map((o) => o)}

        {grouping && <IntegratedGrouping />}
        {/* <IntegratedFiltering /> */}
        <IntegratedSorting />
        {pager && <IntegratedPaging />}
        {selectable && <IntegratedSelection />}
        <TextTypeProvider
          for={textColumns}
          columnExtensions={columnExtensions}
        />
        {selectColumns && (
          <SelectTypeProvider
            for={selectColumns}
            source={selectColumnsOptions}
            columnExtensions={columnExtensions}
          />
        )}
        {!!numberColumns && (
          <NumberTypeProvider
            for={numberColumns}
            config={numberColumnsConfigs}
          />
        )}
        {!!dateColumns && <DateTypeProvider for={dateColumns} />}
        {grouping && <DragDropProvider />}

        <TableBase
          height={height}
          rowComponent={({ row, ...restProps }) => {
            // console.log(row, restProps)
            return (
              <Table.Row
                {...restProps}
                onDoubleClick={(event) => {
                  onRowDoubleClick(row, event)
                }}
                onClick={(event) => {
                  onRowClick(row, event)
                }}
                style={{
                  // cursor: 'pointer',
                  // ...styles[row.sector.toLowerCase()],
                }}
              />
            )
          }}
          cellComponent={TableCellComponent}
          columnExtensions={[
            ...columnExtensions,
            ...numberColumns.map((col) => ({
              columnName: col,
              align: 'right',
            })),
            { columnName: 'action', width: 95, align: 'center' },
          ]}
        />
        {selectable && (
          <TableSelection highlightRow selectByRowClick showSelectionColumn />
        )}

        <TableHeaderRow showSortingControls />
        {extraRow.map((o) => o)}
        {pager && <PagingPanel pageSizes={pageSizes} />}

        {grouping && <TableGroupRow />}
        {grouping && <Toolbar />}
        {grouping && <GroupingPanel showSortingControls />}
        {extraColumn.map((o) => o)}
        <TableFixedColumns
          rightColumns={
            rightColumns.length > 0 ? (
              rightColumns
            ) : (
              [
                'Action',
              ]
            )
          }
          leftColumns={leftColumns}
        />
        {extraGetter.map((o) => o)}
      </DevGrid>
    </Paper>
  )
}
CommonTableGrid.propTypes = {
  // required
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  numberColumns: PropTypes.array.isRequired,
  dateColumns: PropTypes.array.isRequired,

  // optional
  pageSizes: PropTypes.array,
  TableCell: PropTypes.object,
  columnExtensions: PropTypes.array,
  filteringColExtensions: PropTypes.array,
  defaultSorting: PropTypes.array,
  selection: PropTypes.array,
  onSelectionChange: PropTypes.func,
  FuncProps: PropTypes.shape({
    edit: PropTypes.bool,
    filter: PropTypes.bool,
    grouping: PropTypes.bool,
    pager: PropTypes.bool,
    selectable: PropTypes.bool,
  }),
  FilteringProps: PropTypes.shape({
    defaultFilters: PropTypes.array,
    onFiltersChange: PropTypes.func,
    filterColumnExtensions: PropTypes.array,
  }),
  ActionProps: PropTypes.shape({
    TableCellComponent: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]),
  }),
  isLoading: PropTypes.bool,
}

export default CommonTableGrid
