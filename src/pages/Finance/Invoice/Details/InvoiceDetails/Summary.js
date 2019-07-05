import React from 'react'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput } from '@/components'
// styling
import styles from './styles'

const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

const Summary = ({ classes }) => {
  return (
    <GridContainer
      direction='column'
      justify='center'
      alignItems='flex-end'
      className={classes.summaryContent}
    >
      <GridItem xs={6} md={6}>
        <NumberInput prefix='Sub Total:' defaultValue={10} {...amountProps} />
      </GridItem>

      <GridItem xs={6} md={6}>
        <NumberInput prefix='Adjustments:' defaultValue={2} {...amountProps} />
      </GridItem>

      <GridItem xs={6} md={6}>
        <NumberInput prefix='GST (7%):' defaultValue={0.63} {...amountProps} />
      </GridItem>
      <GridItem md={3} className={classes.divider}>
        <Divider />
      </GridItem>

      <GridItem xs={6} md={6}>
        <NumberInput prefix='Total:' defaultValue={10.63} {...amountProps} />
      </GridItem>
    </GridContainer>
  )
}
export default withStyles(styles, { name: 'InvoiceSummary' })(Summary)
