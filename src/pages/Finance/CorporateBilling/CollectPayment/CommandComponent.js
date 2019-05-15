import React from 'react'
import { Pageview, Delete, Save, Edit, Cancel } from '@material-ui/icons'
import { Button } from '@/components'

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
    onClick={onExecute}
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
    onClick={onExecute}
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
    <Button color='primary' onClick={onExecute} title='Create new row'>
      New
    </Button>
  </div>
)

const CommitButton = ({ onExecute }) => (
  <Button
    size='sm'
    onClick={onExecute}
    justIcon
    round
    color='primary'
    title='Save'
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

const CommandComponent = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id]
  return <CommandButton onExecute={onExecute} />
}

export default CommandComponent
