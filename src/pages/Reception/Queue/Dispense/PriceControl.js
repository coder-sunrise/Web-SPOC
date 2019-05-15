import React, { PureComponent } from 'react'
// umi
import { formatMessage, FormattedMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// custom components
import { Button, GridContainer, GridItem, NumberInput } from '@/components'

class PriceControl extends PureComponent {
  state = {
    isDiscountPercent: true,
  }

  changeDiscountType = (discountType) => () => {
    this.setState({ isDiscountPercent: discountType === 'percent' })
  }

  calculateTotal = () => {
    const { isDiscountPercent } = this.state
    const { setFieldValue, values } = this.props
    const { unitPrice, discount, quantity } = values
    const subTotalAmount = unitPrice * quantity
    const totalAmount = isDiscountPercent
      ? subTotalAmount - subTotalAmount * discount / 100
      : subTotalAmount - discount

    setFieldValue('subTotal', subTotalAmount)
    setFieldValue('amount', totalAmount)
  }

  onQuantityChange = (changedValue) => {
    const { setFieldValue, values } = this.props
    const { target } = changedValue
    setFieldValue('quantity', target.value, false)
    setTimeout(this.calculateTotal, 100)
  }

  onDiscountChange = (changedValue) => {
    const { setFieldValue } = this.props
    const { target } = changedValue

    setFieldValue('discount', target.value)
    setTimeout(this.calculateTotal, 100)
  }

  render () {
    const { isDiscountPercent } = this.state

    return (
      <GridItem md={3}>
        <GridContainer direction='column'>
          <GridItem xs>
            <FastField
              name='unitPrice'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'reception.queue.dispense.unitPrice',
                  })}
                  currency
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='scheme'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'reception.queue.dispense.scheme',
                  })}
                  disabled
                  currency
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='quantity'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'reception.queue.dispense.quantity',
                  })}
                  qty
                  onChange={this.onQuantityChange}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='subTotal'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'reception.queue.dispense.subTotal',
                  })}
                  disabled
                  currency
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs>
            <FastField
              name='discount'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'reception.queue.dispense.discount',
                  })}
                  onChange={this.onDiscountChange}
                  percent
                  {...args}
                />
              )}
            />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                size='sm'
                color='rose'
                simple={!isDiscountPercent}
                onClick={this.changeDiscountType('percent')}
              >
                <FormattedMessage id='reception.queue.dispense.discount.percent' />
              </Button>
              <Button
                size='sm'
                color='rose'
                simple={isDiscountPercent}
                onClick={this.changeDiscountType('amount')}
              >
                <FormattedMessage id='reception.queue.dispense.discount.amount' />
              </Button>
            </div>
          </GridItem>
          <GridItem xs>
            <FastField
              name='amount'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'reception.queue.dispense.total',
                  })}
                  disabled
                  currency
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </GridItem>
    )
  }
}

export default PriceControl
