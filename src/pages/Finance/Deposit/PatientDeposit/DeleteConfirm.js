import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem, TextField } from '@/components'

const styles = (theme) => ({
  centerText: { textAlign: 'center' },
  spacing: {
    marginBottom: theme.spacing(2),
  },
})

const DeleteConfirm = ({ classes, handleConfirm, onClose }) => {
  const [
    cancelReason,
    setCancelReason,
  ] = useState('')

  return (
    <GridContainer justify='center' alignItems='center'>
      <GridItem md={12} className={classes.centerText}>
        <h4>Delete this record?</h4>
      </GridItem>
      <GridItem md={10} className={classes.spacing}>
        <TextField
          label='Reason'
          autoFocus
          maxLength={200}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </GridItem>
      <GridItem>
        <Button color='danger' onClick={onClose}>
          Cancel
        </Button>
        <Button
          color='primary'
          onClick={() => handleConfirm(cancelReason)}
          disabled={cancelReason.trim() === ''}
        >
          Confirm
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'DeleteConfirm' })(DeleteConfirm)
