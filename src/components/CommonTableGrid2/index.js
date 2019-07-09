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
import { LinearProgress, Paper, Tooltip } from '@material-ui/core'
import {
  primaryColor,
  dangerColor,
  roseColor,
  grayColor,
  fontColor,
  hoverColor,
  tableEvenRowColor,
} from 'mui-pro-jss'
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
import RadioTypeProvider from './EditCellComponents/RadioTypeProvider'
import StatusTypeProvider from './EditCellComponents/StatusTypeProvider'
import TimeTypeProvider from './EditCellComponents/TimeTypeProvider'
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
@connect(({ loading }) => {
  return { loading }
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
        style={{
          // cursor: 'pointer',
          // ...styles[row.sector.toLowerCase()],
        }}
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
      sortConfig: {
        onSortingChange: (sorting) => {
          this.search({
            sorting,
          })
        },
      },
      summary: false,
      summaryConfig: {},
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
          // table: {
          //   borderCollapse: 'collapse',
          // },
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
    const { entity } = nextProps
    if (
      entity &&
      (entity.pagination !== preState.pagination ||
        entity.filter !== preState.filter)
    ) {
      return {
        pagination: entity.pagination,
        rows: entity.list,
        filter: entity.filter,
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
    const { query, dispatch, type, queryMethod = 'query', entity } = this.props

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
    } else if (entity) {
      const p = {
        ...entity.pagination,
        ...entity.filter,
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
      entity,
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

    const newColumExtensions = columnExtensions.concat([
      ...[
        { columnName: 'action', width: 95, align: 'center' },
        {
          columnName: 'rowIndex',
          width: 80,
          align: 'left',
          disabled: true,
        },
      ],
      ...columns
        .filter((o) => !columnExtensions.find((m) => m.columnName === o.name))
        .map((o) => {
          return {
            columnName: o.name,
            type: 'text',
          }
        }),
    ])
    // console.log(errors, newColumExtensions)

    const tableProps = {
      columnExtensions: newColumExtensions,
      ...(ActionProps.TableCellComponent
        ? { cellComponent: ActionProps.TableCellComponent }
        : {}),
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
    const HeaderRow = this.TableHeaderRow
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
                entity ? entity.list : rows,
                this.state.pagination,
              )} // this.state.data ||
              columns={
                showRowNumber ? (
                  [
                    { name: 'rowIndex', title: 'No.' },
                  ].concat(columns)
                ) : (
                  columns
                )
              }
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
              {pager && !entity && <IntegratedPaging />}
              {pager &&
              entity && (
                <CustomPaging totalCount={this.state.pagination.totalRecords} />
              )}
              {selectable && <IntegratedSelection />}
              <TextTypeProvider columnExtensions={newColumExtensions} />
              <SelectTypeProvider columnExtensions={newColumExtensions} />
              <NumberTypeProvider columnExtensions={newColumExtensions} />
              <DateTypeProvider columnExtensions={newColumExtensions} />
              <RadioTypeProvider columnExtensions={newColumExtensions} />
              <StatusTypeProvider columnExtensions={newColumExtensions} />
              <TimeTypeProvider columnExtensions={newColumExtensions} />

              {grouping && <DragDropProvider />}

              <TableBase
                height={height}
                rowComponent={this.TableRow}
                {...tableProps}
              />
              {selectable && (
                <TableSelection
                  highlightRow
                  selectByRowClick
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
                leftColumns={
                  showRowNumber ? (
                    [
                      'rowIndex',
                    ].concat(leftColumns)
                  ) : (
                    leftColumns
                  )
                }
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
