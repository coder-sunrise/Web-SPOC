import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { FastField } from 'formik'
import { formatMessage } from 'umi'
import { GridContainer, GridItem, NumberInput, Field } from '@/components'
import SharedContainer from './SharedContainer'
import { InputNumber } from 'antd'

const styles = () => ({})

const Pricing = ({ values, setFieldValue, consumableDetail, theme }) => {
  const [acp, setAcp] = useState(values.averageCostPrice || 0.0)
  const [markupMargin, setMarkupMargin] = useState(values.markupMargin || 0.0)

  const calculateSuggestSellingPrice = () => {
    const suggestedSellingPrice =
      parseFloat(acp) * (1 + parseFloat(markupMargin) / 100)
    setFieldValue('suggestSellingPrice', suggestedSellingPrice)
  }

  const isEditMode = () => {
    if (consumableDetail && consumableDetail.entity) {
      return true
    }

    return false
  }
  useEffect(() => {
    calculateSuggestSellingPrice()
    setFieldValue('averageCostPrice', acp)
    setFieldValue('markupMargin', markupMargin)
  }, [acp, markupMargin])
  return (
    <div
      hideHeader
      style={{
        margin: theme.spacing(1),
      }}
    >
      <GridContainer gutter={15}>
        <GridItem xs={12} md={4}>
          <Field
            name='lastCostPriceBefBonus'
            render={args => {
              return (
                <NumberInput
                  currency
                  label={formatMessage({
                    id: 'inventory.master.pricing.lastCostPriceBefBonus',
                  })}
                  precision={2}
                  disabled={isEditMode()}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <Field
            name='lastCostPriceAftBonus'
            render={args => {
              return (
                <NumberInput
                  currency
                  label={formatMessage({
                    id: 'inventory.master.pricing.lastCostPriceAftBonus',
                  })}
                  precision={2}
                  disabled={isEditMode()}
                  {...args}
                />
              )
            }}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='averageCostPrice'
            render={args => (
              <NumberInput
                // format='0,0.0000'
                label={formatMessage({
                  id: 'inventory.master.pricing.averageCostPrice',
                })}
                onChange={e => {
                  const inputValue = e.target.value || 0
                  setAcp(inputValue)
                }}
                currency
                precision={4}
                maxLength={11}
                {...args}
              />
            )}
          />
        </GridItem>

        <GridItem xs={12} md={4}>
          <FastField
            name='markupMargin'
            render={args => (
              <NumberInput
                label={formatMessage({
                  id: 'inventory.master.pricing.profitMarginPercentage',
                })}
                onChange={e => {
                  const inputValue = e.target.value || 0
                  setMarkupMargin(inputValue)
                }}
                percentage
                defaultValue='0.0'
                precision={1}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='suggestSellingPrice'
            render={args => (
              <NumberInput
                currency
                label={formatMessage({
                  id: 'inventory.master.pricing.suggestedSellingPrice',
                })}
                disabled={isEditMode()}
                precision={2}
                {...args}
              />
            )}
          />
        </GridItem>
        <GridItem xs={12} md={4}>
          <FastField
            name='sellingPrice'
            render={args => (
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
        <GridItem xs={12} md={4}>
          <FastField
            name='maxDiscount'
            render={args => (
              <NumberInput
                label={formatMessage({
                  id: 'inventory.master.pricing.maxDiscount',
                })}
                percentage
                format='0.0'
                {...args}
              />
            )}
          />
        </GridItem>
      </GridContainer>
    </div>
  )
}
export default withStyles(styles, { withTheme: true })(Pricing)
