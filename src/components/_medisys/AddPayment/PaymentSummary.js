import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { GridItem, FastField, SizeContainer, NumberInput } from '@/components'
// styling
import styles from './styles'

const PaymentSummary = ({ classes }) => (
  <React.Fragment>
    <GridItem md={6} className={classes.paymentSummary}>
      <h4>Outstanding balance after payment: $0.00</h4>
    </GridItem>
    <GridItem md={6} container className={classes.paymentSummary}>
      <GridItem md={6}>Total Payment: </GridItem>
      <GridItem md={6}>
        <FastField
          name='totalPayment'
          render={(args) => <NumberInput {...args} text currency />}
        />
      </GridItem>
      <GridItem md={6}>Cash Rounding: </GridItem>
      <GridItem md={6}>
        <FastField
          name='cashRounding'
          render={(args) => <NumberInput {...args} text currency />}
        />
      </GridItem>
      <GridItem md={6}>Collectable Amount: </GridItem>
      <GridItem md={6}>
        <FastField
          name='collectableAmount'
          render={(args) => <NumberInput {...args} text currency />}
        />
      </GridItem>
      <GridItem md={6}>Cash Received: </GridItem>
      <GridItem md={3} />
      <GridItem md={3}>
        <FastField
          name='cashReceived'
          render={(args) => (
            <NumberInput
              style={{ textAlign: 'right' }}
              simple
              currency
              size='sm'
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={6}>Cash Returned: </GridItem>
      <GridItem md={6}>
        <FastField
          name='cashReturned'
          render={(args) => <NumberInput {...args} text currency />}
        />
      </GridItem>
    </GridItem>
  </React.Fragment>
)

export default withStyles(styles, { name: 'PaymentSummary' })(PaymentSummary)
