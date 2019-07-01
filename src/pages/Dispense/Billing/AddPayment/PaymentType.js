import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
// common components
import { Button, GridContainer, GridItem } from '@/components'
// styling
import styles from './styles'
import { paymentTypes } from './variables'

const PayerHeader = ({ classes, handlePaymentTypeClick }) => (
  <GridContainer alignItems='center' className={classes.paymentTypeRow}>
    <GridItem className={classes.leftAlignText}>
      <h4>Payment Type: </h4>
    </GridItem>
    <GridItem>
      <Button
        color='primary'
        size='sm'
        id={paymentTypes.cash}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Cash
      </Button>
      <Button
        color='primary'
        size='sm'
        id={paymentTypes.nets}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Nets
      </Button>
      <Button
        color='primary'
        size='sm'
        id={paymentTypes.creditCard}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Credit Card
      </Button>
      <Button
        color='primary'
        size='sm'
        id={paymentTypes.cheque}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        Cheque
      </Button>
      <Button
        color='primary'
        size='sm'
        id={paymentTypes.giro}
        onClick={handlePaymentTypeClick}
      >
        <Add />
        GIRO
      </Button>
    </GridItem>
  </GridContainer>
)

export default withStyles(styles, { name: 'PayerHeader' })(PayerHeader)
