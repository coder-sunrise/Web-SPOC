import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem, TextField } from '@/components'
// styles
import styles from './styles'

const WriteOff = ({ classes, handleSubmit, onClose }) => {
  const [
    reason,
    setReason,
  ] = useState('')

  return (
    <div>
      <h4 className={classes.title}>
        Are you sure to Write off the selected invoice?
      </h4>
      <GridContainer justify='center' alignItems='center'>
        <GridItem md={10} className={classes.reason}>
          <TextField
            label='Reason'
            onChange={(e) => setReason(e.target.value)}
            defaultValue=''
            autoFocus
          />
        </GridItem>
        <Button color='danger' onClick={onClose}>
          Cancel
        </Button>
        <GridItem>
          <Button
            color='primary'
            onClick={() => handleSubmit(reason)}
            disabled={reason.trim() === ''}
          >
            Confirm
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'WriteOff' })(WriteOff)
