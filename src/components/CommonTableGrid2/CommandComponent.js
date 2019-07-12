import React from 'react'
import Delete from '@material-ui/icons/Delete'
import Save from '@material-ui/icons/Save'
import Edit from '@material-ui/icons/Edit'
import Cancel from '@material-ui/icons/Clear'

import { Button } from '@/components'
import { updateGlobalVariable, getGlobalVariable } from '@/utils/utils'

const EditButton = ({ onExecute, editingRowIds }) => (
  <Button
    size='sm'
    onClick={(e) => {
      if (editingRowIds.length === 0) {
        window.g_app._store.dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: true,
          },
        })
      }
      onExecute(e)
    }}
    justIcon
    color='primary'
    title='Edit'
  >
    <Edit />
  </Button>
)

const CancelButton = ({ onExecute, row, editingRowIds }) => (
  <Button
    size='sm'
    onClick={(e) => {
      // updateGlobalVariable('gridIgnoreValidation', true)
      if (
        (!row.id && editingRowIds.length === 0) ||
        (row.id && editingRowIds.length === 1)
      ) {
        window.g_app._store.dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: false,
          },
        })
      }
      onExecute(e)
    }}
    justIcon
    color='danger'
    title='Cancel'
  >
    <Cancel />
  </Button>
)

const DeleteButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={(e) => {
      // updateGlobalVariable('gridIgnoreValidation', true)
      onExecute(e)
    }}
    justIcon
    color='primary'
    title='Delete'
  >
    <Delete />
  </Button>
)

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <Button
      color='primary'
      onClick={(e) => {
        // updateGlobalVariable('gridIgnoreValidation', false)
        onExecute(e)
      }}
      title='Create new row'
      className='medisys-table-add'
      style={{ display: 'none' }}
    >
      New
    </Button>
  </div>
)

const CommitButton = ({ onExecute, editingRowIds }) => (
  <Button
    size='sm'
    onClick={(e) => {
      if (editingRowIds.length > 0) {
        window.g_app._store.dispatch({
          type: 'global/updateState',
          payload: {
            disableSave: false,
          },
        })
      }
      // updateGlobalVariable('gridIgnoreValidation', false)
      onExecute(e)
    }}
    justIcon
    data-button-type='progress'
    data-grid-button='true'
    color='primary'
    title='Save'
    className='grid-commit'
  >
    <Save />
  </Button>
)

const commandComponents = {
  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,
}

const CommandComponent = ({ id, onExecute, ...resetProps }) => {
  const CommandButton = commandComponents[id]
  return <CommandButton onExecute={onExecute} {...resetProps} />
}

export default CommandComponent
