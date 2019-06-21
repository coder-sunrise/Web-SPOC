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
import CommandComponent from './CommandComponent'
import { getGlobalVariable, getUniqueGUID } from '@/utils/utils'
import CustomTableEditRow from './CustomTableEditRow'
import CommonTableGrid from './index'
import EditPlugin from './EditPlugin'
import { Button } from '@/components'

const styles = (theme) => ({})

class EditableTableGrid extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      editingRowIds: [],
      hasError: false,
      addedRows: [],
      errorRows: [],
    }
  }

  // static getDerivedStateFromProps (nextProps, preState) {
  //   const { EditingProps = {}, rows, errors = [] } = nextProps
  //   const { editingRowIds = [] } = EditingProps
  //   const { errorRows } = preState
  //   const newErrowRows = []
  //   // console.log(editingRowIds, errors)
  //   if (errors.length > 0 && !getGlobalVariable('gridIgnoreValidation')) {
  //     errors.forEach((error, i) => {
  //       if (error && rows[i]) {
  //         // console.log(rows, error)
  //         newErrowRows.push(rows[i].id)
  //       }
  //     })
  //   }

  //   if (
  //     newErrowRows.length !== errorRows.length ||
  //     newErrowRows.find((o) => !errorRows.find((m) => m === o))
  //   ) {
  //     return {
  //       errorRows: newErrowRows,
  //     }
  //   }

  //   return null
  // }

  onAddedRowsChange = (addedRows) => {
    this.setState({
      addedRows,
    })
  }

  _onEditingRowIdsChange = (ids) => {
    const { EditingProps, rows } = this.props
    const { onEditingRowIdsChange = (f) => f } = EditingProps
    // console.log(ids)

    // if (this.state.hasError) {
    //   // onEditingRowIdsChange(this.state.ed)
    //   return
    // }
    // this.setState({
    //   editingRowIds: ids,
    // })
    onEditingRowIdsChange(ids)
  }

  _onCommitChanges = ({ added, changed, deleted }) => {
    const { EditingProps, rows, schema } = this.props
    const { onCommitChanges = (f) => f } = EditingProps
    // console.log(changed)
    // this.setState({

    // })
    // console.log('commitChanges')
    const { values, setFieldValue } = this.props
    let newRows = _.cloneDeep(rows)
    // console.log(patientEmergencyContact)
    if (added) {
      newRows = added
        .map((o) => {
          return {
            id: getUniqueGUID(),
            isNew: true,
            ...o,
          }
        })
        .concat(newRows)
    }

    if (changed) {
      newRows = newRows.map((row) => {
        const n = changed[row.id] ? { ...row, ...changed[row.id] } : row
        return n
      })
    }

    if (deleted) {
      // dispatch({
      //   type: `emergencyContact/localDelete`,
      //   payload: deleted,
      // }).then(setArrayValue)

      const deletedEcs = newRows.filter((row) =>
        deleted.find((o) => o === row.id),
      )
      deletedEcs.forEach((o) => {
        o.isDeleted = true
      })
    }

    // if (schema) {
    //   for (let index = 0; index < newRows.length; index++) {
    //     const row = newRows[index]
    //     let vaild = false
    //     try {
    //       const r = schema.validateSync(row, { abortEarly: false })
    //       console.log(r)
    //       vaild = true
    //     } catch (error) {
    //       console.log(error)
    //       this.setState({ hasError: true })
    //     }
    //     return vaild
    //   }

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

  containerComponent = (p) => {
    // console.log(this.props)
    const { theme, FuncProps = {} } = this.props
    const { pagerConfig = {} } = FuncProps
    const { containerExtraComponent } = pagerConfig
    // console.log(containerExtraComponent)
    const {
      EditingProps: {
        showAddCommand = false,
        // EditCell = DefaultEditCell,
      } = {},
      ...props
    } = this.props

    return (
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            padding: theme.spacing.unit * 2,
          }}
        >
          {showAddCommand && (
            <Button
              onClick={(e) => {
                $(e.target)
                  .parents('.medisys-table')
                  .find('.medisys-table-add')
                  .trigger('click')
              }}
              color='primary'
              link
              disabled={this.state.addedRows.length > 0}
            >
              New
            </Button>
          )}
          {containerExtraComponent}
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

  render () {
    const {
      theme,
      columnExtensions = [],
      EditingProps: {
        rowChanges = {},
        editingRowIds = [],
        onEditingRowIdsChange = (f) => f,
        onAddedRowsChange = (f) => f,
        onCommitChanges = (f) => f,
        onRowChangesChange = (f) => f,
        availableColumns = [],
        showAddCommand = false,
        showEditCommand = true,
        showDeleteCommand = true
        // EditCell = DefaultEditCell,
      } = {},
      ...props
    } = this.props
    // console.log(editingRowIds, this.state.errorRows)

    return (
      <CommonTableGrid
        columnExtensions={columnExtensions}
        {...props}
        containerComponent={this.containerComponent}
        extraState={[
          <EditingState
            editingRowIds={[
              ...new Set(editingRowIds.concat(this.state.errorRows)),
            ]}
            rowChanges={rowChanges}
            onAddedRowsChange={this.onAddedRowsChange}
            onEditingRowIdsChange={this._onEditingRowIdsChange}
            onRowChangesChange={onRowChangesChange}
            onCommitChanges={this._onCommitChanges}
            columnExtensions={columnExtensions}
          />,
        ]}
        extraRow={[
          <CustomTableEditRow availableColumns={availableColumns} />,
        ]}
        extraColumn={[
          <TableEditColumn
            showAddCommand={this.addable}
            showEditCommand = {showEditCommand}
            showDeleteCommand = {showDeleteCommand}
            commandComponent={CommandComponent}
            // cellComponent={(cellProps) => {
            //   console.log(cellProps)
            //   const { children, ...p } = cellProps
            //   return (
            //     <Table.Cell {...p}>
            //       {children.map((o) => {
            //         if (o) {
            //           return React.cloneElement(o, {
            //             row: p.row,
            //             ...o.props,
            //           })
            //         }
            //         return null
            //       })}
            //     </Table.Cell>
            //   )
            // }}
          />,
        ]}
        extraGetter={[
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
        ]}
      />
    )
  }
}

EditableTableGrid.propTypes = {
  columnExtensions: PropTypes.array,
  EditingProps: PropTypes.shape({
    editingRowIds: PropTypes.array,
    rowChanges: PropTypes.object,
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
