import React, { PureComponent } from 'react'

import PropTypes from 'prop-types'
import moment from 'moment'
import * as colorManipulator from '@material-ui/core/styles/colorManipulator'
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
} from '@material-ui/core/styles'
import { smallTheme, defaultTheme, largeTheme } from '@/utils/theme'
import { Button } from '@/components'
// import Paper from '@material-ui/core/Paper'
import { LinearProgress, Paper, Tooltip, IconButton } from '@material-ui/core'
import {
  primaryColor,
  dangerColor,
  roseColor,
  grayColor,
  fontColor,
  hoverColor,
  tableEvenRowColor,
} from 'mui-pro-jss'
import ArrowDropDown from '@material-ui/icons/ArrowDropDown'
import ArrowDropUp from '@material-ui/icons/ArrowDropUp'

import classNames from 'classnames'
import { connect } from 'dva'
import {
  FilteringState,
  GroupingState,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  IntegratedSummary,
  PagingState,
  SelectionState,
  SortingState,
  SummaryState,
  DataTypeProvider,
  CustomPaging,
} from '@devexpress/dx-react-grid'
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
} from '@devexpress/dx-react-grid-material-ui'
import NumberTypeProvider from './EditCellComponents/NumberTypeProvider'
import TextTypeProvider from './EditCellComponents/TextTypeProvider'
import SelectTypeProvider from './EditCellComponents/SelectTypeProvider'
import DateTypeProvider from './EditCellComponents/DateTypeProvider'
import RangeDateTypeProvider from './EditCellComponents/RangeDateTypeProvider'
import RadioTypeProvider from './EditCellComponents/RadioTypeProvider'
import StatusTypeProvider from './EditCellComponents/StatusTypeProvider'
import TimeTypeProvider from './EditCellComponents/TimeTypeProvider'
import RowErrorTypeProvider from './EditCellComponents/RowErrorTypeProvider'
import { watchForElementChange } from '@/utils/utils'

const cellStyle = {
  cell: {
    // borderRight: '1px solid rgba(0, 0, 0, 0.12)',
    borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
  },
}

// console.log(colorManipulator)
const styles = (theme) => ({
  tableStriped: {
    '& > tbody > tr:nth-of-type(odd), & > thead > tr': {
      // backgroundColor: colorManipulator.fade(
      //   theme.palette.secondary.main,
      //   0.01,
      // ),
      backgroundColor: '#ffffff',
    },
    '& > tbody > tr:nth-of-type(even)': {
      backgroundColor: tableEvenRowColor,
    },
    '& > tbody > tr:hover': {
      // backgroundColor: colorManipulator.fade(
      //   theme.palette.secondary.main,
      //   0.05,
      // ),
      backgroundColor: hoverColor,
    },

    '& > tbody > tr.grid-edit-row': {
      backgroundColor: '#ffffff',
    },

    '& > tbody > tr.grid-edit-row:hover': {
      backgroundColor: '#ffffff',
    },
  },
  paperContainer: {
    // margin: '0 5px',
    '& > div': {
      width: '100%',
    },
  },
})

const DefaultTableCell = React.memo(
  ({ dispatch, ...props }) => <Table.Cell {...props} />,
  (prevProps, nextProps) => {
    console.log(prevProps, nextProps)
    console.log(prevProps === nextProps, prevProps.row === nextProps.row)
    return prevProps === nextProps || prevProps.row === nextProps.row
  },
)
const getIndexedRows = (rows = [], pagerConfig = {}) => {
  const startIndex = pagerConfig.current
    ? pagerConfig.pagesize * (pagerConfig.current - 1) + 1
    : 1
  // console.log(startIndex)
  // console.log(rows)
  return rows.map((o, i) => {
    return {
      rowIndex: startIndex + i,
      ...o,
    }
  })
}
let gridId = 0
@connect(({ loading, global }) => {
  return { loading, global }
})
class CommonTableGrid2 extends React.Component {
  state = {
    pagination: {
      current: 1,
      pagesize: 10,
    },
  }

  constructor (props) {
    super(props)
    const {
      classes,
      theme,
      oddEven = true,
      onRowDoubleClick = (f) => f,
      onRowClick = (f) => f,
      rowMoveable = (f) => false,
    } = props
    // console.log(props)
    this.gridId = `grid-${gridId++}`
    this.myRef = React.createRef()
    const cls = classNames({
      [classes.tableStriped]: oddEven,
    })
    const TableComponent = ({ ...restProps }) => {
      return <Table.Table {...restProps} className={cls} />
    }

    this.TableBase = ({ height, scrollable, dispatch, ...restProps }) => {
      return height ? (
        <VirtualTable
          tableComponent={TableComponent}
          height={height}
          {...restProps}
        />
      ) : (
        <Table tableComponent={TableComponent} {...restProps} />
      )
    }

    this.TableRow = ({ row, ...restProps }) => (
      <Table.Row
        {...restProps}
        onDoubleClick={(event) => {
          onRowDoubleClick(row, event)
        }}
        onClick={(event) => {
          onRowClick(row, event)
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

    this.TableHeaderRow = ({ row, ...restProps }) => (
      <TableHeaderRow
        {...restProps}
        titleComponent={({ children }) => (
          <Tooltip title={children} placement='top'>
            <div>{children}</div>
          </Tooltip>
        )}
        sortLabelComponent={({ children, ...p }) => {
          // console.log(children, p)

          return (
            <TableHeaderRow.SortLabel
              {...p}
              getMessage={(ps) => {
                // console.log(ps)
                return ''
              }}
            >
              <Tooltip title={children} placement='top'>
                <div>{children}</div>
              </Tooltip>
            </TableHeaderRow.SortLabel>
          )
        }}
      />
    )

    this.defaultFunctionConfig = {
      filter: false,
      selectable: false,
      pager: true,
      pagerStateConfig: {
        onCurrentPageChange: (current) => {
          this.search({
            current: current + 1,
          })
        },
        onPageSizeChange: (pagesize) => {
          this.search({
            pagesize,
            current: 1,
          })
        },
      },
      grouping: false,
      groupingConfig: {},
      sort: true,
      sortConfig: {},
      summary: false,
      summaryConfig: {},
    }

    const tableRowSharedRootConfig = {
      '&.moveable ~ tr td.td-move-cell button:nth-child(1)': {
        display: 'block !important',
      },
      '&.moveable:last-of-type td.td-move-cell button:nth-child(2)': {
        display: 'none !important',
      },
      '& td:not(.td-move-cell) .move-button': {
        visibility: 'hidden',
      },
    }
    const sizeConfig = {
      sm: {
        ...smallTheme.overrides,
        MuiTableRow: {
          head: {
            height: 'auto',
          },
          root: {
            height: 'auto',
            ...tableRowSharedRootConfig,
          },
        },
        MuiTableCell: {
          root: {
            padding: '5px 0',
            fontSize: '1em',
          },
        },
        EditCell: {
          cell: {
            padding: '4px 2px 3px 2px',
            ...cellStyle.cell,
          },
        },
        Pager: {
          pager: {
            padding: `0 8px`,
          },
        },
        Pagination: {
          button: {
            fontWeight: 300,
            margin: `${theme.spacing(0.5)}px 0`,
          },
        },
      },
      md: {
        ...defaultTheme.overrides,
        MuiTableRow: {
          root: {
            ...tableRowSharedRootConfig,
          },
        },
      },
    }
    const size = props.size || theme.props.size
    this.theme = createMuiTheme({
      overrides: {
        RootBase: {
          root: {
            width: '100%',
          },
        },
        TableFixedCell: {
          fixedCell: {
            zIndex: 1,
            overflow: 'visible',
            backgroundColor: 'inherit',
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
          },
          dividerRight: {
            borderRightWidth: 0,
          },
        },
        TableCell: cellStyle,
        EditCell: {
          cell: {
            padding: '7px 4px 7px 4px',
            ...cellStyle.cell,
          },
        },
        TableHeaderCell: cellStyle,
        Table: {
          table: {
            borderCollapse: 'collapse',
          },
          stickyTable: {
            ' & > thead > tr': {
              backgroundColor: '#ffffff',
            },
          },
        },
        MuiTableCell: {
          root: {
            padding: '10px 8px 10px 8px',
            fontSize: '1em',
          },
        },
        PrivateSwitchBase: {
          root: {
            padding: 0,
          },
        },
        Pagination: {
          button: {
            fontWeight: 300,
          },
        },
        ...sizeConfig[size],
      },
    })
    // console.log(this.theme)
    // this.search()
    // console.log(props.query, ' c grid')
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { entity, type, columnExtensions } = nextProps
    let _entity = entity
    if (!_entity && type) {
      _entity = window.g_app._store.getState()[type]
    }
    if (
      _entity &&
      (_entity.pagination !== preState.pagination ||
        _entity.filter !== preState.filter)
    ) {
      // console.log(_entity.filter)
      if (_entity.filter && _entity.filter.sorting) {
        _entity.filter.sorting.forEach((o) => {
          const c = columnExtensions.find((m) => m.sortBy === o.columnName)
          if (c) {
            o.columnName = c.columnName
          }
        })
      }
      return {
        pagination: _entity.pagination,
        rows: _entity.list,
        filter: _entity.filter,
        entity: _entity,
      }
    }
    if (nextProps.rows && nextProps.rows !== preState.rows) {
      return {
        rows: nextProps.rows,
      }
    }

    return null
  }

  // componentDidMount () {
  //   watchForElementChange({
  //     container: this.myRef.current,
  //     selector: 'tr.grid-new-row',
  //     config: {
  //       // subtree: true,
  //       childList: true,
  //     },
  //     ongoing: true,
  //     callback: (mutation) => {
  //       console.log(mutation)
  //     },
  //   })
  // }

  // shouldComponentUpdate = (nextProps, nextState) => {
  //   const { values, nameDateFrom, nameDateTo } = this.props
  //   // const { values: nextValues } = nextProps

  //   // const { checkedAllDate } = this.state

  //   // const isValuesEmpty =
  //   //   Object.entries(values).length === 0 && values.constructor === Object
  //   // const isNextValuesEmpty =
  //   //   Object.entries(nextValues).length === 0 &&
  //   //   nextValues.constructor === Object

  //   // if (!isValuesEmpty && !isNextValuesEmpty) {
  //   //   return (
  //   //     nextValues[nameDateFrom] !== values[nameDateFrom] ||
  //   //     nextValues[nameDateTo] !== values[nameDateTo] ||
  //   //     nextState.checkedAllDate !== checkedAllDate
  //   //   )
  //   // }
  //   console.log(nextProps, nextState)
  //   console.log(this.props, this.state)
  //   console.log(nextProps === this.props, nextState === this.state)
  //   return true
  // }

  search = (payload) => {
    const { query, dispatch, type, queryMethod = 'query' } = this.props

    if (query) {
      query({
        callback: (data) => {
          // console.log(data)
          if (data) {
            const { current, data: list, pagesize, totalRecords } = data

            this.setState({
              data: list,
              pagination: {
                totalRecords,
                current,
                pagesize,
                ...payload,
              },
            })
          }
        },
        ...payload,
      })
    } else if (this.state.entity) {
      const p = {
        ...this.state.entity.pagination,
        ...this.state.entity.filter,
        ...payload,
      }
      // console.log(p)
      dispatch({
        type: `${type}/${queryMethod}`,
        payload: p,
      })
    } else {
      const { pagination } = this.state
      payload.current &&
        this.setState({
          pagination: {
            ...pagination,
            ...payload,
          },
        })
    }
  }

  moveRow = (row, direction) => () => {
    const { onRowMove } = this.props
    if (onRowMove) onRowMove(row, direction)
  }

  Cell = (p) => {
    const { classes, ...restProps } = p
    const { column, row } = restProps
    // console.log(p2)
    // return null
    if (column && column.name === 'rowMove') {
      const cls = {
        width: 20,
        height: 20,
        padding: 1,
        margin: '0 auto',
      }

      if (!this.props.rowMoveable || !this.props.rowMoveable(row))
        return <Table.Cell {...restProps} />

      return (
        <Table.Cell
          {...restProps}
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
    return <Table.Cell {...restProps} />
  }

  render () {
    const {
      classes,
      pageSizes = [
        5,
        10,
        50,
        100,
      ],
      columns = [],
      type,
      rows,
      TableCell = DefaultTableCell,
      columnExtensions = [],
      filteringColExtensions = [],
      defaultSorting = [],
      height = undefined,
      rightColumns = [],
      leftColumns = [],
      showRowNumber = false,
      rowMoveable = null,
      header = true,
      selection = [],
      errors = [],
      query,
      getRowId = (row) => (row.Id ? row.Id : row.id),
      onSelectionChange = (f) => f,
      FuncProps = {},
      ActionProps = {},
      FilteringProps: {
        defaultFilters = [],
        onFiltersChange = (f) => f,
        filterColumnExtensions = [],
      } = {},
      LoadingProps: { isLoading = false, loadingMessage = 'Retrieve data' } = {
        isLoading: false,
        loadingMessage: 'Retrieve data',
      },
      extraState = [],
      extraRow = [],
      extraColumn = [],
      extraGetter = [],
      containerComponent,
      schema,
      editingRowIds,
      global,
    } = this.props

    const {
      grouping,
      selectable,
      selectConfig = { showSelectAll: false },
      pager,
      pagerConfig = {},
      pagerStateConfig,
      groupingConfig,
      summary,
      summaryConfig,
      sort,
      sortConfig,
      filter,
    } = {
      ...this.defaultFunctionConfig,
      ...FuncProps,
    }
    if (containerComponent) {
      pagerConfig.containerComponent = containerComponent
    }
    // console.log(this.props)
    // console.log(
    //   filter,
    //   grouping,
    //   selectable,
    //   pager,
    //   pagerConfig,
    //   groupingConfig,
    //   summary,
    //   summaryConfig,
    //   sort,
    //   sortConfig,
    // )
    // console.log(this.state)
    const { TableBase } = this
    const actionColCfg = { columnName: 'action', width: 95, align: 'center' }
    const newColumExtensions = columnExtensions.concat([
      ...[
        actionColCfg,
        {
          columnName: 'rowIndex',
          width: 80,
          align: 'left',
          disabled: true,
        },
        {
          columnName: 'rowMove',
          width: 40,
          align: 'center',
          disabled: true,
        },
      ],
      ...columns
        .filter(
          (o) =>
            !columnExtensions.find((m) => m.columnName === o.name) ||
            o.name === 'action',
        )
        .map((o) => {
          let extraCfg = {}
          if (o.name === 'action') {
            extraCfg = {
              ...actionColCfg,
            }
          }
          return {
            ...extraCfg,
            columnName: o.name,
            type: 'text',
          }
        }),
    ])
    // console.log(errors, newColumExtensions)

    const tableProps = {
      columnExtensions: newColumExtensions,
      cellComponent:
        (this.props.ActionProps || {}).TableCellComponent || this.Cell,
    }
    // const extraPagerConfig = {
    //   ...pagerConfig,
    // }
    // console.log(leftColumns, rightColumns, header)
    // console.log(errors)
    // if (errors.length > 0) {

    // }
    newColumExtensions.forEach((c) => {
      c.validationSchema = schema
      c.gridId = this.gridId
      if (c.type === 'number' || c.type === 'currency') {
        if (!c.align) {
          c.align = 'right'
        }
      }
      // c.errors = []
      // errors.forEach((e, i) => {
      //   if (e) {
      //     // console.log(i)
      //     const m = Object.keys(e).find((es) => es === c.columnName)
      //     if (m) {
      //       c.errors.push({
      //         index: i + 1,
      //         columnName: c.columnName,
      //         error: e[c.columnName],
      //       })
      //     }
      //   }
      // })
      // console.log(error, c)
    })
    // console.log(pager, pagerConfig)
    const cellComponentConfig = {
      columnExtensions: newColumExtensions,
      editingRowIds,
      commitCount: global.commitCount,
    }
    const allowSelectRowByClick =
      columns.find((col) => col.name.toUpperCase() === 'ACTION') === undefined

    const HeaderRow = this.TableHeaderRow

    let newColumns = columns
    let newLeftCols = leftColumns
    if (rowMoveable && !newColumns.find((o) => o.name === 'rowMove')) {
      newLeftCols = [
        'rowMove',
      ].concat(newLeftCols)
      newColumns.unshift({ name: 'rowMove', title: ' ' })
    }
    if (showRowNumber && !newColumns.find((o) => o.name === 'rowIndex')) {
      newLeftCols = [
        'rowIndex',
      ].concat(newLeftCols)
      newColumns.unshift({ name: 'rowIndex', title: 'No.' })
    }
    return (
      <MuiThemeProvider theme={this.theme}>
        <Paper
          className={classNames({
            [classes.paperContainer]: true,
            [this.props.className]: true,
            'medisys-table': true,
          })}
          style={this.props.style}
        >
          {isLoading && (
            <div>
              <LinearProgress />
              <span>{loadingMessage}</span>
            </div>
          )}
          <div ref={this.myRef}>
            <DevGrid
              rows={getIndexedRows(
                this.state.entity
                  ? this.state.entity.list
                  : rows.filter((o) => !o.isDeleted),
                this.state.pagination,
              )} // this.state.data ||
              columns={newColumns}
              getRowId={getRowId}
            >
              {filter && (
                <FilteringState
                  defaultFilters={defaultFilters}
                  onFiltersChange={onFiltersChange}
                  columnExtensions={filterColumnExtensions}
                />
              )}
              {sort && (
                <SortingState
                  sorting={this.state.pagination.sorting}
                  defaultSorting={defaultSorting}
                  onSortingChange={(sorting) => {
                    sorting.forEach((o) => {
                      const c = newColumExtensions.find(
                        (m) => m.columnName === o.columnName,
                      )
                      o.columnName = c.sortBy || c.columnName
                    })
                    this.search({
                      sorting,
                    })
                  }}
                  columnExtensions={newColumExtensions}
                  {...sortConfig}
                />
              )}
              {selectable && (
                <SelectionState
                  selection={selection}
                  onSelectionChange={onSelectionChange}
                />
              )}
              {summary && <SummaryState {...summaryConfig.state} />}
              {grouping && <GroupingState {...groupingConfig.state} />}
              {pager && (
                <PagingState
                  currentPage={this.state.pagination.current - 1}
                  pageSize={this.state.pagination.pagesize}
                  {...pagerStateConfig}
                />
              )}

              {extraState.map((o) => o)}

              {grouping && <IntegratedGrouping />}
              {/* <IntegratedFiltering /> */}
              {sort && !type && <IntegratedSorting />}
              {summary && <IntegratedSummary {...summaryConfig.integrated} />}
              {pager && !this.state.entity && <IntegratedPaging />}
              {pager &&
              this.state.entity && (
                <CustomPaging totalCount={this.state.pagination.totalRecords} />
              )}
              {selectable && <IntegratedSelection />}
              <TextTypeProvider {...cellComponentConfig} />
              <SelectTypeProvider {...cellComponentConfig} />
              <NumberTypeProvider {...cellComponentConfig} />
              <DateTypeProvider {...cellComponentConfig} />
              <RangeDateTypeProvider {...cellComponentConfig} />
              <RadioTypeProvider {...cellComponentConfig} />
              <StatusTypeProvider {...cellComponentConfig} />
              <TimeTypeProvider {...cellComponentConfig} />
              <RowErrorTypeProvider {...cellComponentConfig} />

              {grouping && <DragDropProvider />}

              <TableBase
                height={height}
                rowComponent={this.TableRow}
                {...tableProps}
              />
              {selectable && (
                <TableSelection
                  highlightRow
                  selectByRowClick={allowSelectRowByClick}
                  showSelectionColumn
                  {...selectConfig}
                />
              )}

              {header && <HeaderRow showSortingControls />}
              {extraRow.map((o) => o)}
              {pager && <PagingPanel pageSizes={pageSizes} {...pagerConfig} />}

              {grouping && <TableGroupRow {...groupingConfig.row} />}
              {grouping && groupingConfig.showToolbar && <Toolbar />}
              {grouping &&
              groupingConfig.showToolbar && (
                <GroupingPanel showSortingControls />
              )}
              {summary && <TableSummaryRow {...summaryConfig.row} />}
              {extraColumn.map((o) => o)}
              <TableFixedColumns
                rightColumns={
                  rightColumns.length > 0 ? (
                    rightColumns
                  ) : (
                    [
                      'action',
                      'Action',
                      'editCommand',
                    ]
                  )
                }
                leftColumns={newLeftCols}
              />
              {extraGetter.map((o) => o)}
            </DevGrid>
          </div>
        </Paper>
      </MuiThemeProvider>
    )
  }
}
CommonTableGrid2.propTypes = {
  // required
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  // optional
  pageSizes: PropTypes.array,
  TableCell: PropTypes.object,
  columnExtensions: PropTypes.array,
  filteringColExtensions: PropTypes.array,
  defaultSorting: PropTypes.array,
  selection: PropTypes.array,
  onSelectionChange: PropTypes.func,
  FuncProps: PropTypes.shape({
    filter: PropTypes.bool,
    grouping: PropTypes.bool,
    pager: PropTypes.bool,
    pagerConfig: PropTypes.object,
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
  LoadingProps: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    loadingMessage: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  }),
}

export default withStyles(styles, {
  name: 'CommonTableGrid2',
  withTheme: true,
})(CommonTableGrid2)
