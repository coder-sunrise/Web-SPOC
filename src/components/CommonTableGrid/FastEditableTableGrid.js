import React, { PureComponent } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { EditingState } from '@devexpress/dx-react-grid'
import { withStyles } from '@material-ui/core/styles'
import $ from 'jquery'

import {
  Table,
  TableEditColumn,
  PagingPanel,
  TableEditRow,
  TableInlineCellEditing,
} from '@devexpress/dx-react-grid-material-ui'
import { Getter } from '@devexpress/dx-react-core'
import Add from '@material-ui/icons/Add'
import {
  getGlobalVariable,
  getUniqueNumericId,
  difference,
  enableTableForceRender,
} from '@/utils/utils'
import { Button } from '@/components'
import Authorized from '@/utils/Authorized'
import CommandComponent from './CommandComponent'
import CustomTableEditRow from './CustomTableEditRow'
import CommonTableGrid from './index.optimized'
import EditPlugin from './EditPlugin'
import { updateGlobalState } from './EditCellComponents/utils'

let uniqueGid = 0

const styles = theme => ({})
window.$tempGridRow = {}

class EditableTableGrid extends PureComponent {
  static defaultProps = {
    EditingProps: {},
    getRowId: r => r.id,
    idField: 'id',
  }

  constructor(props) {
    super(props)
    const { EditingProps = {}, id } = props
    this.state = {
      editingRowIds: [],
      deletedRowIds: [],
      addedRows: EditingProps.addedRows || EditingProps.defaultNewRow || [],
      editingCells: [],
      errorCells: [],
      // hasError: false,
      // errorRows: [],
    }
    this.gridId = id || `edit-${uniqueGid++}`
    if (!window.$tempGridRow[this.gridId]) {
      window.$tempGridRow[this.gridId] = {}
    }
    // console.log(this.gridId)
    // console.log('edit created', window.$tempGridRow[this.gridId])
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   // console.log({ preState })
  //   const { EditingProps = {}, rows, errors = [] } = nextProps
  //   const { editingRowIds, addedRows } = EditingProps
  //   // console.log(nextProps.EditingRowIds, preState.editingRowIds)

  //   if (editingRowIds)
  //     return {
  //       editingRowIds,
  //     }

  //   return null
  // }

  componentWillReceiveProps(nextProps) {
    // dectect if datasource changed outside grid, reset grid data cache
    if (Array.isArray(nextProps.rows) && Array.isArray(this.props.rows)) {
      if (
        !_.isEqual(
          nextProps.rows.map(({ _errors, rowIndex, ...o }, i) => o),
          this.props.rows.map(({ _errors, rowIndex, ...o }, i) => o),
        )
      ) {
        if (
          !_.isEqual(
            Object.values(window.$tempGridRow[this.gridId] || {}).map(
              ({ _errors, rowIndex, ...o }, i) => o,
            ),
            nextProps.rows.map(({ _errors, rowIndex, ...o }, i) => o),
          )
        ) {
          const { schema, getRowId } = nextProps

          let { rows } = nextProps
          if (schema)
            rows = rows.map(o => {
              if (getRowId(o))
                try {
                  schema.validateSync(o, {
                    abortEarly: false,
                  })
                } catch (error) {
                  o._errors = error.inner
                }
              return o
            })
          window.$tempGridRow[this.gridId] = rows.reduce((ary, item) => {
            return {
              ...ary,
              [getRowId(item)]: item,
            }
          }, {})
          // console.log(
          //   window.$tempGridRow[this.gridId],
          //   nextProps.rows,
          //   this.props.rows,
          // )
        }
      }
    }
  }

  getErrorCells = props => {
    const { getRowId } = props || this.props

    const errorRows = Object.values(window.$tempGridRow[this.gridId]).filter(
      o => o._errors && o._errors.length && !o.isDeleted,
    )
    const errorCells = []
    errorRows.forEach(r => {
      const { _errors } = r
      const rowId = getRowId(r)
      if (rowId)
        _errors.forEach(e => {
          const { path } = e
          errorCells.push({
            rowId,
            columnName: path,
          })
        })
    })
    // console.log(errorCells)
    return errorCells
  }

  _onEditingCellsChange = editingCells => {
    setTimeout(() => {
      const errorCells = this.getErrorCells()

      this.setState({
        errorCells,
      })
    }, 1)
    const { gridId } = this
    const { getRowId } = this.props
    updateGlobalState({ gridId, getRowId })

    if (editingCells.length > 1) {
      this.setState({
        editingCells: [editingCells[editingCells.length - 1]], // force to active lastest cell to edit mode
      })
    } else {
      this.setState({
        editingCells,
      })
    }
  }

  _onAddedRowsChange = addedRows => {
    // console.log('_onAddedRowsChange', addedRows)
    let row = addedRows
    if (this.props.EditingProps.onAddedRowsChange) {
      row = this.props.EditingProps.onAddedRowsChange(addedRows)
    }
    // this.setState({
    //   addedRows: row,
    // })
    if (row.length === 0) {
      // console.log(window.$tempGridRow, this.gridId)
      if (window.$tempGridRow[this.gridId])
        delete window.$tempGridRow[this.gridId][undefined]
    } else if (window.$tempGridRow[this.gridId]) {
      window.$tempGridRow[this.gridId][undefined] = row[0]
    }
    return row
  }

  _onEditingRowIdsChange = ids => {
    const { EditingProps, rows } = this.props
    const { onEditingRowIdsChange } = EditingProps
    let newIds = ids
    // console.log(ids, window.$tempGridRow)
    if (onEditingRowIdsChange) {
      newIds = onEditingRowIdsChange(ids)
    }
    this.setState({
      editingRowIds: newIds,
    })
  }

  _onDeletedRowIdsChange = ids => {
    const { EditingProps, rows } = this.props
    const { onDeletedRowIdsChange } = EditingProps

    let newIds = ids
    if (onDeletedRowIdsChange) {
      newIds = onDeletedRowIdsChange(ids)
    }
    this.setState({
      deletedRowIds: newIds,
    })
  }

  _onRowChangesChange = changes => {
    // console.log('_onRowChangesChange', changes)
    const { EditingProps, rows } = this.props
    const { onRowChangesChange } = EditingProps

    let newChanges = changes
    if (onRowChangesChange) {
      newChanges = onRowChangesChange(changes)
    }

    this.setState({
      rowChanges: newChanges,
    })
  }

  onRowDoubleClick = (row, e) => {
    const { getRowId } = this.props
    if (
      ['svg'].indexOf(e.target.nodeName) < 0 &&
      !this.state.editingRowIds.find(o => o === getRowId(row))
    ) {
      const { onRowDoubleClick, EditingProps, rows } = this.props
      const { onEditingRowIdsChange } = EditingProps
      if (onRowDoubleClick) {
        onRowDoubleClick()
      } else {
        this.setState(prevState => {
          const ids = prevState.editingRowIds.concat([getRowId(row)])
          if (prevState.editingRowIds.length === 0) {
            window.g_app._store.dispatch({
              type: 'global/updateState',
              payload: {
                disableSave: true,
              },
            })
          }
          if (onEditingRowIdsChange) {
            this._onEditingRowIdsChange(ids)
          }
          return {
            editingRowIds: ids,
          }
        })
      }
    }
  }

  _onCommitChanges = ({ added, changed, deleted }) => {
    // console.log('_onCommitChanges')
    const { EditingProps, rows = [], schema, getRowId } = this.props
    const { onCommitChanges = f => f } = EditingProps
    let shouldUpdate = false
    if (added && Object.values(added)[0]) shouldUpdate = true
    if (changed && Object.values(changed)[0]) shouldUpdate = true
    if (deleted && deleted.length > 0) shouldUpdate = true
    if (!shouldUpdate) return

    let newRows = _.cloneDeep(rows)
    if (added) {
      // console.log(added, window.$tempGridRow, window.$tempGridRow[this.gridId])
      if (!window.$tempGridRow[this.gridId])
        window.$tempGridRow[this.gridId] = {}
      const tempNewData = window.$tempGridRow[this.gridId][undefined] || {}
      // console.log(tempNewData)
      added = added.map(o => {
        const id = getUniqueNumericId()
        window.$tempGridRow[this.gridId][getRowId(o)] = {
          id,
          isNew: true,
          ...tempNewData,
          ...o,
        }
        return window.$tempGridRow[this.gridId][getRowId(o)]
      })
      newRows = added.concat(newRows)
      // this.setState({
      //   addedRows: [],
      // })

      delete window.$tempGridRow[this.gridId][undefined]
    }

    if (changed) {
      newRows = newRows
        .filter(o => !!o)
        .map(row => {
          const n = changed[getRowId(row)]
            ? {
                ...row,
                ...window.$tempGridRow[this.gridId][getRowId(row)],
                ...changed[getRowId(row)],
              }
            : row
          return n
        })
    }

    if (deleted) {
      // dispatch({
      //   type: `emergencyContact/localDelete`,
      //   payload: deleted,
      // }).then(setArrayValue)
      // console.log(deleted)
      if (deleted[0] === undefined) {
        newRows = newRows.filter(o => getRowId(o) !== undefined)
      }
      const deletedEcs = newRows.filter(row =>
        deleted.find(o => o === getRowId(row)),
      )
      deletedEcs.forEach(o => {
        o.isDeleted = true
        delete window.$tempGridRow[this.gridId][getRowId(o)]
      })
    }
    // console.log({ newRows, added, changed, deleted, temp: window.$tempGridRow })
    // if (schema) {
    //   for (let index = 0; index < newRows.length; index++) {
    //     const row = newRows[index]
    //     console.log(row)
    //     try {
    //       schema.validateSync(row, { abortEarly: true })
    //     } catch (error) {
    //       console.log(error)
    //       return
    //     }
    //   }
    // }

    //   // schema.validate(newRows, { abortEarly: false }).then(
    //   //   (v) => {
    //   //     onCommitChanges({
    //   //       rows: newRows,
    //   //       added,
    //   //       changed,
    //   //       deleted,
    //   //     })
    //   //   },
    //   //   (errors) => {
    //   //     console.log('b', a, b, c)
    //   //   },
    //   // )
    // }
    // console.log({ newRows, t: window.$tempGridRow })
    // console.log(newRows, rows, _.isEqual(newRows, rows))
    // if (_.isEqual(newRows, rows)) return
    const updatedRows = onCommitChanges({
      rows: newRows,
      added,
      changed,
      deleted,
    })
    // console.log(rows, newRows, updatedRows)
    // window.$tempGridRow[this.gridId]={}
    if (updatedRows && Array.isArray(updatedRows)) {
      // Fix schema validation which will gone when delete,
      // thus skip when deleted to avoid the
      // existing error validation being cleared (PO grid)
      if (added || changed) {
        window.$tempGridRow[this.gridId] = {}
      }
      updatedRows.forEach(r => {
        if (!window.$tempGridRow[this.gridId][r.id])
          window.$tempGridRow[this.gridId][r.id] = {}
        window.$tempGridRow[this.gridId][r.id] = r
      })
      // window.$tempGridRow[this.gridId] = updatedRows
    }
    this._onEditingCellsChange(this.state.editingCells)
  }

  getAddRowComponent = (selector = '.medisys-table') => {
    const { theme, FuncProps = {}, disable } = this.props
    const {
      EditingProps: {
        showAddCommand = false,
        addCommandProps = {},
        // EditCell = DefaultEditCell,
      } = {},
      ...props
    } = this.props
    const { pagerConfig = {}, pager = true, addNewLabelName } = FuncProps
    const { containerExtraComponent } = pagerConfig
    // console.log(this.state.errorCells)
    return (
      <Authorized.Context.Consumer>
        {(matches = { rights: 'enable' }) => {
          return (
            <React.Fragment>
              {showAddCommand && matches && matches.rights !== 'disable' && (
                <Button
                  // hideIfNoEditRights
                  onClick={e => {
                    this._onCommitChanges({
                      added: this._onAddedRowsChange([{}]),
                    })
                  }}
                  color='primary'
                  link
                  disabled={this.state.errorCells.length > 0}
                  {...addCommandProps}
                >
                  <Add />
                  {addNewLabelName || 'New'}
                </Button>
              )}
              {containerExtraComponent}
            </React.Fragment>
          )
        }}
      </Authorized.Context.Consumer>
    )
  }

  containerComponent = p => {
    const { theme, FuncProps = {} } = this.props

    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            display: 'flex',
            padding: theme.spacing(theme.props.size === 'sm' ? 0.5 : 1),
          }}
        >
          {this.getAddRowComponent()}
        </div>

        <PagingPanel.Container {...p} />
      </div>
    )
  }

  addable = () => {
    const {
      EditingProps: {
        showAddCommand = false,
        // EditCell = DefaultEditCell,
      } = {},
    } = this.props

    return showAddCommand && this.state.addedRows.length === 0
  }

  // componentDidUpdate () {
  //   const { EditingProps: { editingRowIds = [] } = {} } = this.props
  //   // console.log(editingRowIds, this.addable())
  //   if (editingRowIds.length === 0 && this.addable()) {
  //     window.g_app._store.dispatch({
  //       type: 'global/updateState',
  //       payload: {
  //         disableSave: false,
  //       },
  //     })
  //   }
  // }

  // componentDidUpdate () {
  //   console.log('componentDidUpdate', window.$tempGridRow)
  // }

  render() {
    // console.log('redner',this.gridId)
    const {
      theme,
      EditingProps: {
        availableColumns = [],
        showAddCommand = false,
        showEditCommand = true,
        showDeleteCommand = true,
        deleteConfirm = {
          show: false,
          title: 'Delete this row?',
        },
        onRowDelete,
        isDeletable = f => true,
        messages = {
          commitCommand: 'Save',
          editCommand: 'Edit',
          deleteCommand: 'Delete',
          cancelCommand: 'Cancel',
        },
        showCommandColumn = true,
        // EditCell = DefaultEditCell,
      } = {},
      extraColumn,
      ...props
    } = this.props

    // console.log('editabletablegrid', props.rows)

    const {
      FuncProps: { pager = true },
    } = {
      FuncProps: {},
      ...props,
    }
    const {
      editingRowIds,
      deletedRowIds,
      rowChanges,
      addedRows,
      editingCells,
    } = this.state
    // console.log(editingCells)
    // console.log(editingRowIds, this.state.errorRows)
    // console.log('this.containerComponent', this.containerComponent)
    const cfg = {}
    if (this.containerComponent) {
      cfg.containerComponent = this.containerComponent
    }
    const editableCfg = extraColumn
      ? {}
      : {
          extraGetter: [
            // <EditPlugin />,
            <Getter
              // key={`Getter-${uniqueGid}`}
              name='tableColumns'
              computed={({ tableColumns }) => {
                // console.log(tableColumns, TableEditColumn, resetProps)
                // const col = tableColumns.find(
                //   (c) => c.type === TableEditColumn.COLUMN_TYPE,
                // )
                // if (col) {
                //   col.fixed = 'right'
                // }
                let cols = tableColumns.filter(
                  c => c.type !== TableEditColumn.COLUMN_TYPE,
                )

                if (showCommandColumn) {
                  cols = [
                    ...cols,
                    {
                      key: 'editCommand',
                      type: TableEditColumn.COLUMN_TYPE,
                      fixed: 'right',
                      width: 75,
                    },
                  ]
                }
                // console.log(cols)
                return cols
              }}
            />,
          ],
        }

    // console.log(rowChanges, addedRows)
    // console.log({ columnExtensions })
    // const sharedCfg = {

    // }

    // console.log('EditableTableGrid')
    // console.log(sharedCfg)
    const element = (
      <Authorized.Context.Consumer>
        {(matches = { rights: 'enable' }) => {
          const sharedCfg = {
            editableGrid: true,
            gridId: this.gridId,
            editingRowIds,
            getRowId: props.props,
            extraCellConfig: {
              commitChanges: this._onCommitChanges,
              editingCells,
            },
            extraState: [
              <EditingState
                columnEditingEnabled
                deletedRowIds={deletedRowIds}
                rowChanges={rowChanges}
                addedRows={addedRows}
                onAddedRowsChange={this._onAddedRowsChange}
                onEditingRowIdsChange={this._onEditingRowIdsChange}
                editingCells={editingCells}
                onEditingCellsChange={this._onEditingCellsChange}
                onDeletedRowIdsChange={this._onDeletedRowIdsChange}
                onRowChangesChange={this._onRowChangesChange}
                onCommitChanges={this._onCommitChanges}
                columnExtensions={props.columnExtensions}
              />,
            ],
            extraRow: [
              <CustomTableEditRow
                key={`CustomTableEditRow-${uniqueGid}`}
                availableColumns={availableColumns}
              />,
            ],
            extraColumn: extraColumn || [
              <TableEditColumn
                key={`TableEditColumn-${uniqueGid}`}
                showAddCommand={this.addable}
                // showEditCommand={showEditCommand}
                showDeleteCommand={showDeleteCommand}
                commandComponent={CommandComponent}
                width={
                  ['readonly', 'disable'].includes(
                    matches ? matches.rights : '',
                  )
                    ? 0
                    : 'auto'
                }
                cellComponent={cellProps => {
                  const { children, ...p } = cellProps
                  return (
                    <Table.Cell {...p}>
                      {children.map(o => {
                        if (o) {
                          return React.cloneElement(o, {
                            row: p.row,
                            // editingRowIds,
                            // key: o.props.id,
                            // schema: this.props.schema,
                            // gridId: this.gridId,
                            // getRowId: this.props.getRowId,
                            onRowDelete,
                            isDeletable,
                            deleteConfirm,
                            // ...o.props,
                          })
                        }
                        return null
                      })}
                    </Table.Cell>
                  )
                }}
                messages={messages}
              />,
              <TableInlineCellEditing
                key={`TableInlineCellEditing-${uniqueGid}`}
                startEditAction='click'
                selectTextOnEditStart
              />,
            ],

            // onRowDoubleClick: this.onRowDoubleClick,
            ...cfg,
            ...props,
          }
          // console.log(matches)
          return Authorized.generalCheck(
            matches,
            this.props,
            <CommonTableGrid
              authorize={matches}
              {...sharedCfg}
              {...editableCfg}
            />,
            <CommonTableGrid authorize={matches} {...sharedCfg} />,
          )
        }}
      </Authorized.Context.Consumer>
    )
    return (
      <div className='medisys-edit-table'>
        {element}
        {!pager && (
          <div style={{ marginTop: theme.spacing(1) }}>
            {this.getAddRowComponent('.medisys-edit-table')}
          </div>
        )}
      </div>
    )
  }
}

EditableTableGrid.propTypes = {
  columnExtensions: PropTypes.array,
  EditingProps: PropTypes.shape({
    // editingRowIds: PropTypes.array,
    // rowChanges: PropTypes.object,
    onEditingRowIdsChange: PropTypes.func,
    onRowChangesChange: PropTypes.func,
    onCommitChanges: PropTypes.func,
    EditCell: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  }),
}

export default withStyles(styles, {
  name: 'EditableTableGrid',
  withTheme: true,
})(EditableTableGrid)
