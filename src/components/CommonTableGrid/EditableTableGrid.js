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
  TableInlineCellEditing,
} from '@devexpress/dx-react-grid-material-ui'
import { Getter } from '@devexpress/dx-react-core'
import Add from '@material-ui/icons/Add'
import CommandComponent from './CommandComponent'
import { getGlobalVariable, getUniqueId } from '@/utils/utils'
import CustomTableEditRow from './CustomTableEditRow'
import CommonTableGrid from './index'
import EditPlugin from './EditPlugin'
import { Button } from '@/components'
import Authorized from '@/utils/Authorized'

let uniqueGid = 0

const styles = (theme) => ({})

class EditableTableGrid extends React.Component {
  static defaultProps = {
    EditingProps: {},
    getRowId: (r) => r.id,
  }

  constructor (props) {
    super(props)
    const { EditingProps = {} } = props
    this.state = {
      editingRowIds: [],
      deletedRowIds: [],
      addedRows: EditingProps.addedRows || EditingProps.defaultNewRow || [],
      editingCells: [],
      errorCells: [],
      // hasError: false,
      // errorRows: [],
    }
    this.gridId = `edit-${uniqueGid++}`
    console.log(this.gridId)
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

  // componentWillReceiveProps (nextProps) {
  //   const { EditingProps = {}, rows, errors = [] } = nextProps
  //   if (!_.isEqual(rows, this.props.rows)) {
  //     const cells = this.getErrorCells(nextProps)
  //     console.log(cells)
  //   }
  // }

  getErrorCells = (props) => {
    const { getRowId } = props || this.props

    const errorRows = Object.values(window.$tempGridRow[this.gridId]).filter(
      (o) => o._errors && o._errors.length && !o.isDeleted,
    )
    // console.log(
    //   errorRows,
    //   this.state.editingCells,
    //   window.$tempGridRow[this.gridId],
    // )
    const errorCells = []
    errorRows.forEach((r) => {
      const { _errors } = r
      const rowId = getRowId(r)
      _errors.forEach((e) => {
        const { path } = e
        errorCells.push({
          rowId,
          columnName: path,
        })
      })
    })
    return errorCells
  }

  _onEditingCellsChange = (editingCells) => {
    const errorCells = this.getErrorCells()
    // console.log(errorCells)
    const { global } = window.g_app._store.getState()
    if (window.$tempGridRow[this.gridId] && errorCells.length) {
      if (!global.disableSave)
        window.g_app._store.dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: true,
          },
        })
    } else if (!errorCells.length && global.disableSave) {
      window.g_app._store.dispatch({
        type: 'global/updateState',
        payload: {
          disableSave: false,
        },
      })
    }
    // this.setState({
    //   editingCells: _.unionWith(editingCells, errorCells, _.isEqual),
    //   errorCells,
    // })
    this.setState({
      errorCells,
      editingCells,
    })
  }

  _onAddedRowsChange = (addedRows) => {
    // console.log('_onAddedRowsChange', addedRows)
    let row = addedRows
    if (this.props.EditingProps.onAddedRowsChange) {
      row = this.props.EditingProps.onAddedRowsChange(addedRows)
    }
    // this.setState({
    //   addedRows: row,
    // })
    if (row.length === 0) {
      console.log(window.$tempGridRow, this.gridId)
      if (window.$tempGridRow[this.gridId])
        delete window.$tempGridRow[this.gridId][undefined]
    } else if (window.$tempGridRow[this.gridId]) {
      window.$tempGridRow[this.gridId][undefined] = row[0]
    }
    return row
  }

  _onEditingRowIdsChange = (ids) => {
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

  _onDeletedRowIdsChange = (ids) => {
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

  _onRowChangesChange = (changes) => {
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
      [
        'svg',
      ].indexOf(e.target.nodeName) < 0 &&
      !this.state.editingRowIds.find((o) => o === getRowId(row))
    ) {
      const { onRowDoubleClick, EditingProps, rows } = this.props
      const { onEditingRowIdsChange } = EditingProps
      if (onRowDoubleClick) {
        onRowDoubleClick()
      } else {
        this.setState((prevState) => {
          const ids = prevState.editingRowIds.concat([
            getRowId(row),
          ])
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
    const { EditingProps, rows = [], schema, getRowId } = this.props

    const { onCommitChanges = (f) => f } = EditingProps
    let shouldUpdate = false
    if (added && Object.values(added)[0]) shouldUpdate = true
    if (changed && Object.values(changed)[0]) shouldUpdate = true
    if (deleted && deleted.length > 0) shouldUpdate = true
    if (!shouldUpdate) return

    // console.log(added, changed, deleted, rows)

    // this.setState({

    // })
    // console.log('commitChanges', added, changed, deleted, rows)
    // const { values, setFieldValue } = this.props
    let newRows = _.cloneDeep(rows)
    if (added) {
      // console.log(added, window.$tempGridRow, window.$tempGridRow[this.gridId])
      if (!window.$tempGridRow[this.gridId])
        window.$tempGridRow[this.gridId] = {}
      const tempNewData = window.$tempGridRow[this.gridId][undefined] || {}
      // console.log(tempNewData)

      newRows = added
        .map((o) => {
          const id = getUniqueId()
          window.$tempGridRow[this.gridId][id] = {
            id,
            isNew: true,
            ...tempNewData,
            ...o,
          }
          return window.$tempGridRow[this.gridId][id]
        })
        .concat(newRows)
      // this.setState({
      //   addedRows: [],
      // })
      delete window.$tempGridRow[this.gridId][undefined]
    }

    if (changed) {
      newRows = newRows.map((row) => {
        const n = changed[getRowId(row)]
          ? {
              ...row,
              // ...window.$tempGridRow[this.gridId][getRowId(row)],
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
        newRows = newRows.filter((o) => getRowId(o) !== undefined)
      }
      const deletedEcs = newRows.filter((row) =>
        deleted.find((o) => o === getRowId(row)),
      )
      deletedEcs.forEach((o) => {
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
    // window.$tempGridRow[this.gridId]={}
    if (updatedRows && Array.isArray(updatedRows)) {
      // console.log(updatedRows, window.$tempGridRow[this.gridId])
      window.$tempGridRow[this.gridId] = {}
      updatedRows.forEach((r) => {
        if (!window.$tempGridRow[this.gridId][r.id])
          window.$tempGridRow[this.gridId][r.id] = {}
        window.$tempGridRow[this.gridId][r.id] = r
      })
      // window.$tempGridRow[this.gridId] = updatedRows
    }
    // this._onEditingCellsChange(this.state.editingCells)
  }

  getAddRowComponent = (selector = '.medisys-table') => {
    const { theme, FuncProps = {} } = this.props
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
    return (
      <React.Fragment>
        {showAddCommand && (
          <Button
            // hideIfNoEditRights
            onClick={(e) => {
              this._onCommitChanges({
                added: this._onAddedRowsChange([
                  {},
                ]),
              })
              // setTimeout(() => {
              //   window.g_app._store.dispatch({
              //     type: 'global/updateState',
              //     payload: {
              //       disableSave: true,
              //     },
              //   })
              // }, 1)

              // $(e.target)
              //   .parents(selector)
              //   .find('.medisys-table-add')
              //   .trigger('click')
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
  }

  containerComponent = (p) => {
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

  render () {
    const {
      theme,
      columnExtensions = [],
      EditingProps: {
        availableColumns = [],
        showAddCommand = false,
        showEditCommand = true,
        showDeleteCommand = true,
        messages = {
          commitCommand: 'Save',
          editCommand: 'Edit',
          deleteCommand: 'Delete',
          cancelCommand: 'Cancel',
        },
        // EditCell = DefaultEditCell,
      } = {},
      getRowId,
      ...props
    } = this.props

    // console.log('editabletablegrid', props.rows)

    const { FuncProps: { pager = true } } = {
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
    const sharedCfg = {
      gridId: this.gridId,
      columnExtensions,
      editingRowIds,
      // onRowDoubleClick: this.onRowDoubleClick,
      ...cfg,
      ...props,
    }
    // console.log(rowChanges, addedRows)
    // console.log({ columnExtensions })
    const editableCfg = {
      getRowId,
      extraState: [
        <EditingState
          key={`editingState-${uniqueGid}`}
          editingRowIds={editingRowIds}
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
          columnExtensions={columnExtensions}
        />,
      ],
      extraRow: [
        <CustomTableEditRow
          key={`CustomTableEditRow-${uniqueGid}`}
          availableColumns={availableColumns}
        />,
      ],
      extraColumn: [
        <TableEditColumn
          key={`TableEditColumn-${uniqueGid}`}
          showAddCommand={this.addable}
          // showEditCommand={showEditCommand}
          showDeleteCommand={showDeleteCommand}
          commandComponent={CommandComponent}
          messages={messages}
          // cellComponent={(cellProps) => {
          //   const { children, ...p } = cellProps
          //   return (
          //     <Table.Cell {...p}>
          //       {children.map((o) => {
          //         if (o) {
          //           // console.log(12311231,o.props)
          //           return React.cloneElement(o, {
          //             row: p.row,
          //             disabled: p.row.disabled,
          //             editingRowIds,
          //             getRowId,
          //             key: o.props.id,
          //             schema: this.props.schema,
          //             gridId: this.gridId,
          //             ...o.props,
          //           })
          //         }
          //         return null
          //       })}
          //     </Table.Cell>
          //   )
          // }}
        />,
      ],
      extraGetter: [
        // <EditPlugin />,
        <Getter
          key={`Getter-${uniqueGid}`}
          name='tableColumns'
          computed={({ tableColumns, isColumnEditingEnabled }) => {
            const cols = [
              ...tableColumns.filter(
                (c) => c.type !== TableEditColumn.COLUMN_TYPE,
              ),
              {
                key: 'editCommand',
                type: TableEditColumn.COLUMN_TYPE,
                fixed: 'right',
                width: 75,
              },
            ]
            // console.log(cols)
            return cols
          }}
        />,
        <TableInlineCellEditing
          key={`TableInlineCellEditing-${uniqueGid}`}
          // cellComponent={(p) => {
          //   console.log(p)
          //   const { classes, onClick, onFocus, ...restProps } = p
          //   const { column, row } = restProps
          //   const { name } = column
          //   // console.log(p2)
          //   // return null
          //   // console.log(restProps)
          //   // if (name === 'rowMove') return <Table.Cell {...restProps} />

          //   // // return null
          //   // // return (
          //   // //   <Table.Cell editingEnabled={name !== 'rowMove'} {...restProps} />
          //   // // )

          //   return (
          //     <TableInlineCellEditing.Cell
          //       editingEnabled={name !== 'rowMove'}
          //       onFocus={false}
          //       {...restProps}
          //     />
          //   )
          // }}
          startEditAction='click'
          selectTextOnEditStart
        />,
      ],
    }
    // console.log('EditableTableGrid')
    // console.log(editableCfg)
    const element = (
      <Authorized.Context.Consumer>
        {(matches) => {
          // console.log(matches)
          return Authorized.generalCheck(
            matches,
            this.props,
            <CommonTableGrid {...sharedCfg} {...editableCfg} />,
            <CommonTableGrid {...sharedCfg} />,
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
    EditCell: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.func,
    ]),
  }),
}

export default withStyles(styles, {
  name: 'EditableTableGrid',
  withTheme: true,
})(EditableTableGrid)
