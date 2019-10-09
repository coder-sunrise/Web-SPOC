import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridItem, FastField, NumberInput } from '@/components'
// styling
import styles from './styles'

const PaymentSummary = ({ classes }) => (
  <React.Fragment>
    <GridItem md={6} className={classes.paymentSummary}>
      <h4>Outstanding balance after payment: $0.00</h4>
    </GridItem>
    <GridItem md={6} container className={classes.paymentSummary}>
      <GridItem md={6}>Total Payment: </GridItem>
      <GridItem md={6}>$ 0.00</GridItem>

      <GridItem md={6}>Cash Rounding: </GridItem>
      <GridItem md={6}>$ 0.00</GridItem>
      <GridItem md={6}>Collectable Amount: </GridItem>
      <GridItem md={6}>$ 0.00</GridItem>
      <GridItem md={6}>Cash Received: </GridItem>
      <GridItem md={6}>
        <FastField
          name='cashReceived'
          render={(args) => <NumberInput {...args} />}
        />
      </GridItem>
      <GridItem md={6}>Cash Returned: </GridItem>
      <GridItem md={6}>$ 0.00</GridItem>
    </GridItem>
  </React.Fragment>
)

export default withStyles(styles, { name: 'PaymentSummary' })(PaymentSummary)
