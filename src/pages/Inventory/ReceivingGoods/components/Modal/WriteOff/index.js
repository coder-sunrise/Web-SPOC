import React, { useState } from 'react'
import { withStyles } from '@material-ui/core'
import { Button, GridContainer, GridItem, TextField } from '@/components'

const styles = (theme) => ({
  reason: {
    marginBottom: theme.spacing(2),
  },
})

const WriteOff = ({ classes, handleSubmit, onClose }) => {
  const [
    reason,
    setReason,
  ] = useState('')

  return (
    <div>
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
            disabled={reason === ''}
          >
            Write-Off
          </Button>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default withStyles(styles, { name: 'WriteOff' })(WriteOff)
