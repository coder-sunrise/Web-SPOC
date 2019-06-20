import React from 'react'
import { Pageview, Delete, Save, Edit, Cancel } from '@material-ui/icons'
import { Button } from '@/components'
import { updateGlobalVariable, getGlobalVariable } from '@/utils/utils'

const EditButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={onExecute}
    justIcon
    round
    color='primary'
    title='Edit'
  >
    <Edit />
  </Button>
)

const CancelButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={(e) => {
      updateGlobalVariable('gridIgnoreValidation', true)
      onExecute(e)
    }}
    justIcon
    round
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
      updateGlobalVariable('gridIgnoreValidation', true)
      onExecute(e)
    }}
    justIcon
    round
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
        updateGlobalVariable('gridIgnoreValidation', false)
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
      updateGlobalVariable('gridIgnoreValidation', false)
      onExecute(e)
    }}
    justIcon
    data-button-type='progress'
    round
    color='primary'
    title='Save'
    style={{ marginRight: 5 }}
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
