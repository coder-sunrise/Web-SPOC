import React from 'react'
// material ui
import { Divider, withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput, FastField } from '@/components'
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

const Summary = ({ classes, clinicSettings }) => {
  const getGST = () => {
    const { settings } = clinicSettings
    if (settings) {
      const { gSTPercentageInt } = settings
      return `GST (${gSTPercentageInt}%)`
    }
    return null
  }
  return (
    <GridContainer
      direction='column'
      justify='center'
      alignItems='flex-end'
      className={classes.summaryContent}
    >
      <GridItem xs={6} md={6}>
        <FastField
          name='invoiceTotal'
          render={(args) => {
            return (
              <NumberInput prefix='Sub Total:' {...amountProps} {...args} />
            )
          }}
        />
      </GridItem>

      <GridItem xs={6} md={6}>
        <FastField
          name='totalAdjustment'
          render={(args) => {
            return (
              <NumberInput prefix='Adjustments:' {...amountProps} {...args} />
            )
          }}
        />
      </GridItem>

      <GridItem xs={6} md={6}>
        <FastField
          name='invoiceGSTAmt'
          render={(args) => {
            return <NumberInput prefix={getGST()} {...amountProps} {...args} />
          }}
        />
      </GridItem>
      <GridItem md={3} className={classes.divider}>
        <Divider />
      </GridItem>

      <GridItem xs={6} md={6}>
        <FastField
          name='invoiceTotalAftGST'
          render={(args) => {
            return <NumberInput prefix='Total:' {...amountProps} {...args} />
          }}
        />
      </GridItem>
    </GridContainer>
  )
}
export default withStyles(styles, { name: 'InvoiceSummary' })(Summary)
