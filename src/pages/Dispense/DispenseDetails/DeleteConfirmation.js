import React, { useState } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Warning from '@material-ui/icons/Warning'
// common components
import { Button, GridContainer, GridItem, TextField } from '@/components'

const styles = (theme) => ({
  reasonTextBox: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
  title: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  warningIcon: {
    margin: theme.spacing(2),
  },
})

const DeleteConfirmation = ({
  classes,
  showIcon,
  message,
  handleSubmit,
  onClose,
}) => {
  const [cancelReason, setCancelReason] = useState('')

  return (
    <GridContainer justify='center' alignItems='center'>
      <GridItem md={12} className={classes.title}>
        {showIcon && (
          <Warning fontSize='large' className={classes.warningIcon} />
        )}
        <h4 style={{ textAlign: 'left' }}>{message}</h4>
      </GridItem>
      <GridItem md={10}>
        <TextField
          label='Reason'
          autoFocus
          onChange={e => setCancelReason(e.target.value)}
        />
      </GridItem>
      <GridItem>
        <Button color='danger' onClick={onClose}>
          Cancel
        </Button>
        <Button
          color='primary'
          onClick={() => handleSubmit(cancelReason)}
          disabled={cancelReason.trim() === ''}
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
