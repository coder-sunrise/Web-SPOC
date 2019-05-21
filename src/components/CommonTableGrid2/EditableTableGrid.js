import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { EditingState } from '@devexpress/dx-react-grid'
import { TableEditColumn } from '@devexpress/dx-react-grid-material-ui'
import { Getter } from '@devexpress/dx-react-core'
import CommandComponent from './CommandComponent'
import { getGlobalVariable } from '@/utils/utils'

import CustomTableEditRow from './CustomTableEditRow'
import CommonTableGrid from './index'
import EditPlugin from './EditPlugin'

class EditableTableGrid extends PureComponent {
  state = {
    editingRowIds: [],
    addedRows: [],
    errorRows: [],
  }

  static getDerivedStateFromProps (nextProps, preState) {
    const { EditingProps = {}, rows, errors = [] } = nextProps
    const { editingRowIds = [] } = EditingProps
    const { errorRows } = preState
    const newErrowRows = []
    // console.log(editingRowIds, errors)
    if (errors.length > 0 && !getGlobalVariable('gridIgnoreValidation')) {
      errors.forEach((error, i) => {
        if (error && rows[i]) {
          console.log(rows, error)
          newErrowRows.push(rows[i].id)
        }
      })
    }

    if (
      newErrowRows.length !== errorRows.length ||
      newErrowRows.find((o) => !errorRows.find((m) => m === o))
    ) {
      return {
        errorRows: newErrowRows,
      }
    }

    return null
  }

  onAddedRowsChange = (addedRows) => {
    this.setState({
      addedRows,
    })
  }

  _onCommitChanges = (p) => {
    const { onCommitChanges = (f) => f } = this.props
    const { changed } = p
    // console.log(changed)
    // this.setState({

    // })
    onCommitChanges(p)
  }

  render () {
    const {
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
        // EditCell = DefaultEditCell,
      } = {},
      ...props
    } = this.props
    // console.log(editingRowIds, this.state.errorRows)

    return (
      <CommonTableGrid
        columnExtensions={columnExtensions}
        {...props}
        extraState={[
          <EditingState
            editingRowIds={[
              ...new Set(editingRowIds.concat(this.state.errorRows)),
            ]}
            rowChanges={rowChanges}
            onAddedRowsChange={this.onAddedRowsChange}
            onEditingRowIdsChange={onEditingRowIdsChange}
            onRowChangesChange={onRowChangesChange}
            onCommitChanges={onCommitChanges}
            columnExtensions={columnExtensions}
          />,
        ]}
        extraRow={[
          <CustomTableEditRow availableColumns={availableColumns} />,
        ]}
        extraColumn={[
          <TableEditColumn
            showAddCommand={showAddCommand && this.state.addedRows.length === 0}
            showEditCommand
            showDeleteCommand
            commandComponent={CommandComponent}
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

export default EditableTableGrid
