import React, { useState } from 'react'
import { Button, GridContainer, GridItem, TextField } from '@/components'

const TextEditor = ({ item = {}, handleSubmit, onClose }) => {
  const [
    name,
    setName,
  ] = useState('')

  return (
    <div>
      <GridContainer justify='center' alignItems='center'>
        <GridItem md={10}>
          <TextField
            label={item.label}
            onChange={(e) => setName(e.target.value)}
            defaultValue={item.value}
            autoFocus
          />
        </GridItem>
        <Button color='danger' onClick={onClose}>
          Cancel
        </Button>
        <GridItem>
          <Button
            color='primary'
            onClick={() => handleSubmit(name)}
            disabled={name === ''}
          >
            Confirm
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default TextEditor
