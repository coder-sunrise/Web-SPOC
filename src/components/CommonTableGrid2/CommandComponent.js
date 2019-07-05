import React from 'react'
import Delete from '@material-ui/icons/Delete'
import Save from '@material-ui/icons/Save'
import Edit from '@material-ui/icons/Edit'
import Cancel from '@material-ui/icons/Clear'

import { Button } from '@/components'
import { updateGlobalVariable, getGlobalVariable } from '@/utils/utils'

const EditButton = ({ onExecute }) => (
  <Button size='sm' onClick={onExecute} justIcon color='primary' title='Edit'>
    <Edit />
  </Button>
)

const CancelButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={(e) => {
      // updateGlobalVariable('gridIgnoreValidation', true)
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

const CommitButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={(e) => {
      // updateGlobalVariable('gridIgnoreValidation', false)
      onExecute(e)
    }}
    justIcon
    data-button-type='progress'
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
  // console.log(id, onExecute, resetProps)
  const CommandButton = commandComponents[id]
  return <CommandButton onExecute={onExecute} />
}

export default CommandComponent
