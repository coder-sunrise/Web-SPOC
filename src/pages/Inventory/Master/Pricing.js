import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'

import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
} from '@/components'

const styles = () => ({})

const Pricing = () => {
  return (
    <CardContainer
      hideHeader
      style={{
        marginLeft: 5,
        marginRight: 5,
      }}
    >
      <GridContainer gutter={0}>
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='lastCostPriceBefBonus'
                render={(args) => {
                  return (
                    <NumberInput
                      currency
                      label='Last Cost Price (Before Bonus)'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='lastCostPriceAftBonus'
                render={(args) => {
                  return (
                    <NumberInput
                      currency
                      label='Last Cost Price (After Bonus)'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='averageCostPrice'
                render={(args) => {
                  return (
                    <NumberInput
                      currency
                      label='Average Cost Price'
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
        <GridItem xs={12} md={2} />
        <GridItem xs={12} md={5}>
          <GridContainer>
            <GridItem xs={12}>
              <FastField
                name='profitMarginPercentage'
                render={(args) => (
                  <NumberInput label='Markup Margin (%)' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='suggestSellingPrice'
                render={(args) => (
                  <NumberInput
                    currency
                    label='Suggested Selling Price'
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='sellingPriceBefDiscount'
                render={(args) => (
                  <NumberInput currency label='Selling Price' {...args} />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='maxDiscount'
                render={(args) => (
                  <NumberInput label='Max Discount (%)' {...args} />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridItem>
      </GridContainer>
      <Divider style={{ margin: '40px 0 20px 0' }} />
    </CardContainer>
  )
}
export default withStyles(styles, { withTheme: true })(Pricing)
