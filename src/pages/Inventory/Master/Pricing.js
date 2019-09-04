import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { formatMessage } from 'umi/locale'

import {
  CardContainer,
  GridContainer,
  GridItem,
  NumberInput,
} from '@/components'

const styles = () => ({})

const Pricing = ({ values, setFieldValue }) => {
  const [
    acp,
    setAcp,
  ] = useState()
  const [
    markupMargin,
    setMarkupMargin,
  ] = useState()

  const calculate = () => {
    const suggestedSellingPrice =
      parseFloat(acp) + parseFloat(acp) * parseFloat(markupMargin)
    setFieldValue('suggestSellingPrice', suggestedSellingPrice)
  }

  useEffect(
    () => {
      if (acp && markupMargin) {
        calculate()
      }
    },
    [
      acp,
      markupMargin,
    ],
  )
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
                      label={formatMessage({
                        id: 'inventory.master.pricing.lastCostPriceBefBonus',
                      })}
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
                      label={formatMessage({
                        id: 'inventory.master.pricing.lastCostPriceAftBonus',
                      })}
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
                      label={formatMessage({
                        id: 'inventory.master.pricing.averageCostPrice',
                      })}
                      onBlur={(e) => setAcp(e.target.value)}
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
                name='markupMargin'
                render={(args) => (
                  <NumberInput
                    label={formatMessage({
                      id: 'inventory.master.pricing.profitMarginPercentage',
                    })}
                    onBlur={(e) => setMarkupMargin(e.target.value)}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='suggestSellingPrice'
                render={(args) => (
                  <NumberInput
                    currency
                    label={formatMessage({
                      id: 'inventory.master.pricing.suggestedSellingPrice',
                    })}
                    disabled
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='sellingPrice'
                render={(args) => (
                  <NumberInput
                    currency
                    label={formatMessage({
                      id: 'inventory.master.pricing.sellingPrice',
                    })}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem xs={12}>
              <FastField
                name='maxDiscount'
                render={(args) => (
                  <NumberInput
                    label={formatMessage({
                      id: 'inventory.master.pricing.maxDiscount',
                    })}
                    {...args}
                  />
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
