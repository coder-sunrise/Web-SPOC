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

const DeleteConfirmation = ({
  classes,
  handleSubmit,
  id,
  type,
  itemID,
  onClose,
}) => {
  const [
    reason,
    setReason,
  ] = useState('')

  return (
    <GridContainer justify='center' alignItems='center'>
      <GridItem md={12} className={classes.centerText}>
        <h4>
          Are you sure to void {type} {itemID}?
        </h4>
      </GridItem>
      <GridItem md={10} className={classes.spacing}>
        <TextField
          label='Reason'
          onChange={(e) => setReason(e.target.value)}
          defaultValue=''
        />
      </GridItem>
      <GridItem>
        <Button color='danger' onClick={onClose}>
          Cancel
        </Button>
        <Button
          color='primary'
          onClick={() => handleSubmit(id, reason)}
          disabled={reason === ''}
        >
          Confirm
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'DeleteConfirmation' })(
  DeleteConfirmation,
)
