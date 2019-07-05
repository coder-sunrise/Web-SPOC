import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Button, GridContainer, GridItem, TextField } from '@/components'
// styles
import styles from './styles'

const WriteOff = ({ classes, onClose, onConfirm }) => (
  <div>
    <h4 className={classes.title}>
      Are you sure to Write off the selected invoice?
    </h4>
    <GridContainer justify='center' alignItems='center'>
      <GridItem md={10} className={classes.reason}>
        <TextField label='Reason' defaultValue='' />
      </GridItem>
      <GridItem>
        <Button color='primary' onClick={onConfirm}>
          Confirm
        </Button>
        <Button color='danger' onClick={onClose}>
          Cancel
        </Button>
      </GridItem>
    </GridContainer>
  </div>
)

export default withStyles(styles, { name: 'WriteOff' })(WriteOff)
