import React from 'react'
import PropTypes from 'prop-types'
import { EditingState } from '@devexpress/dx-react-grid'
import { TableEditColumn } from '@devexpress/dx-react-grid-material-ui'
import { Getter } from '@devexpress/dx-react-core'
import CommandComponent from './CommandComponent'

import CustomTableEditRow from './CustomTableEditRow'
import CommonTableGrid from './index'

const EditableTableGrid = ({
  columnExtensions = [],
  EditingProps: {
    editingRowIds = [],
    rowChanges = {},
    onEditingRowIdsChange = (f) => f,
    onRowChangesChange = (f) => f,
    onCommitChanges = (f) => f,
    availableColumns = [],
    showAddCommand = false,
    // EditCell = DefaultEditCell,
  } = {},
  ...props
}) => {
  return (
    <CommonTableGrid
      columnExtensions={columnExtensions}
      {...props}
      extraState={[
        <EditingState
          editingRowIds={editingRowIds}
          rowChanges={rowChanges}
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
          showAddCommand={showAddCommand}
          showEditCommand
          showDeleteCommand
          commandComponent={CommandComponent}
        />,
      ]}
      extraGetter={[
        <Getter
          name='tableColumns'
          computed={({ tableColumns, isColumnEditingEnabled }) => {
            return [
              ...tableColumns.filter(
                (c) => c.type !== TableEditColumn.COLUMN_TYPE,
              ),
              {
                key: 'editCommand',
                type: TableEditColumn.COLUMN_TYPE,
                width: 100,
              },
            ]
          }}
        />,
      ]}
    />
  )
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
