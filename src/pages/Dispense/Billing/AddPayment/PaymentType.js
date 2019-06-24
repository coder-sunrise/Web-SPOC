import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
// common components
import { Button, GridContainer, GridItem } from '@/components'
// styling
import styles from './styles'

const PayerHeader = ({ classes }) => (
  <GridContainer alignItems='center' className={classes.paymentTypeRow}>
    <GridItem className={classes.leftAlignText}>
      <h4>Payment Type: </h4>
    </GridItem>
    <GridItem>
      <Button color='primary' size='sm' disabled>
        <Add />
        Cash
      </Button>
      <Button color='primary' size='sm' disabled>
        <Add />
        Nets
      </Button>
      <Button color='primary' size='sm' disabled>
        <Add />
        Credit Card
      </Button>
      <Button color='primary' size='sm' disabled>
        <Add />
        Cheque
      </Button>
      <Button color='primary' size='sm' disabled>
        <Add />
        GIRO
      </Button>
    </GridItem>
  </GridContainer>
)

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
