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
} from '@devexpress/dx-react-grid-material-ui'
import { Getter } from '@devexpress/dx-react-core'
import Add from '@material-ui/icons/Add'
import CommandComponent from './CommandComponent'
import { getGlobalVariable, getUniqueNumericId } from '@/utils/utils'
import CustomTableEditRow from './CustomTableEditRow'
import CommonTableGrid from './index'
import EditPlugin from './EditPlugin'
import { Button } from '@/components'
import Authorized from '@/utils/Authorized'

let uniqueGid = 0

const styles = (theme) => ({})

class EditableTableGrid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      editingRowIds: [],
      deletedRowIds: [],
      addedRows: this.props.EditingProps.addedRows || [],
      // hasError: false,
      // errorRows: [],
    }
    this.gridId = `edit-${uniqueGid++}`
  }

  static getDerivedStateFromProps (nextProps, preState) {
    // console.log({ preState })
    const { EditingProps = {}, rows, errors = [] } = nextProps
    const { editingRowIds, addedRows } = EditingProps
    // console.log(nextProps.EditingRowIds, preState.editingRowIds)
    if (editingRowIds)
      return {
        editingRowIds,
      }

    return null
  }

  _onAddedRowsChange = (addedRows) => {
    let row = addedRows
    if (this.props.EditingProps.onAddedRowsChange) {
      row = this.props.EditingProps.onAddedRowsChange(addedRows)
    }
    this.setState({
      addedRows: row,
    })
  }

  _onEditingRowIdsChange = (ids) => {
    const { EditingProps, rows } = this.props
    const { onEditingRowIdsChange } = EditingProps

    let newIds = ids
    if (onEditingRowIdsChange) {
      newIds = onEditingRowIdsChange(ids)
    }
    // console.log(newIds)
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
    if (
      [
        'svg',
      ].indexOf(e.target.nodeName) < 0 &&
      !this.state.editingRowIds.find((o) => o === row.id)
    ) {
      const { onRowDoubleClick } = this.props
      if (onRowDoubleClick) {
        onRowDoubleClick()
      } else {
        this.setState((prevState) => {
          const ids = prevState.editingRowIds.concat([
            row.id,
          ])
          if (prevState.editingRowIds.length === 0) {
            window.g_app._store.dispatch({
              type: 'global/updateState',
              payload: {
                disableSave: true,
              },
            })
          }
          return {
            editingRowIds: ids,
          }
        })
      }
    }
  }

  _onCommitChanges = ({ added, changed, deleted }) => {
    const { EditingProps, rows, schema } = this.props
    const { onCommitChanges = (f) => f } = EditingProps
    // console.log(added, changed, deleted)
    // this.setState({

    // })
    // console.log('commitChanges')
    // const { values, setFieldValue } = this.props
    let newRows = _.cloneDeep(rows)
    if (added) {
      // console.log(added, window.$tempGridRow, window.$tempGridRow[this.gridId])
      const tempNewData = window.$tempGridRow[this.gridId][undefined] || {}
      // console.log(tempNewData)

      newRows = added
        .map((o) => {
          const id = getUniqueNumericId()
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
        const n = changed[row.id]
          ? {
              ...row,
              ...window.$tempGridRow[this.gridId][row.id],
              ...changed[row.id],
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
        newRows = newRows.filter((o) => o.id !== undefined)
      }
      const deletedEcs = newRows.filter((row) =>
        deleted.find((o) => o === row.id),
      )
      deletedEcs.forEach((o) => {
        o.isDeleted = true
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
    onCommitChanges({
      rows: newRows,
      added,
      changed,
      deleted,
    })
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
    const { pagerConfig = {}, pager = true } = FuncProps
    const { containerExtraComponent } = pagerConfig
    return (
      <React.Fragment>
        {showAddCommand && (
          <Button
            hideIfNoEditRights
            onClick={(e) => {
              window.g_app._store.dispatch({
                type: 'global/updateState',
                payload: {
                  disableSave: true,
                },
              })
              $(e.target)
                .parents(selector)
                .find('.medisys-table-add')
                .trigger('click')
            }}
            color='primary'
            link
            disabled={this.state.addedRows.length > 0}
            {...addCommandProps}
          >
            <Add />New
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
        // EditCell = DefaultEditCell,
      } = {},
      ...props
    } = this.props

    // console.log('editabletablegrid', { props: this.props })

    const { FuncProps: { pager = true } } = {
      FuncProps: {},
      ...props,
    }
    const { editingRowIds, deletedRowIds, rowChanges, addedRows } = this.state
    // console.log(this.state, this.props)
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
      onRowDoubleClick: this.onRowDoubleClick,
      ...cfg,
      ...props,
    }
    // console.log(rowChanges, addedRows)
    const editableCfg = {
      extraState: [
        <EditingState
          editingRowIds={editingRowIds}
          deletedRowIds={deletedRowIds}
          rowChanges={rowChanges}
          addedRows={addedRows}
          onAddedRowsChange={this._onAddedRowsChange}
          onEditingRowIdsChange={this._onEditingRowIdsChange}
          onDeletedRowIdsChange={this._onDeletedRowIdsChange}
          onRowChangesChange={this._onRowChangesChange}
          onCommitChanges={this._onCommitChanges}
          columnExtensions={columnExtensions}
        />,
      ],
      extraRow: [
        <CustomTableEditRow availableColumns={availableColumns} />,
      ],
      extraColumn: [
        <TableEditColumn
          showAddCommand={this.addable}
          showEditCommand={showEditCommand}
          showDeleteCommand={showDeleteCommand}
          commandComponent={CommandComponent}
          cellComponent={(cellProps) => {
            const { children, ...p } = cellProps
            return (
              <Table.Cell {...p}>
                {children.map((o) => {
                  if (o) {
                    return React.cloneElement(o, {
                      row: p.row,
                      editingRowIds,
                      key: o.props.id,
                      schema: this.props.schema,
                      gridId: this.gridId,
                      ...o.props,
                    })
                  }
                  return null
                })}
              </Table.Cell>
            )
          }}
        />,
      ],
      extraGetter: [
        // <EditPlugin />,
        <Getter
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
                width: 110,
              },
            ]
            // console.log(cols)
            return cols
          }}
        />,
      ],
    }
    // console.log('EditableTableGrid')

    const element = (
      <Authorized.Context.Consumer>
        {({ view, edit, behavior }) => (
          <Authorized
            authority={[
              view,
              edit,
            ]}
          >
            {(matches) => {
              // console.log('EditableTableGrid', view, edit, behavior)

              return Authorized.generalCheck(
                matches,
                this.props,
                <CommonTableGrid {...sharedCfg} {...editableCfg} />,
                <CommonTableGrid {...sharedCfg} />,
              )
            }}
          </Authorized>
        )}
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
    onEdionEditingRowIdsChange: PropTypes.func,
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
