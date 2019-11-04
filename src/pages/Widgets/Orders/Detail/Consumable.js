import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  NumberInput,
  FastField,
  withFormikExtend,
} from '@/components'

import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'

@connect(({ global }) => ({ global }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) =>
    orders.entity || orders.defaultConsumable,
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    inventoryConsumableFK: Yup.number().required(),
    // unitPrice: Yup.number().required(),
    totalPrice: Yup.number().required(),
    quantity: Yup.number().required(),
  }),

  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, orders, currentType } = props
    const { rows } = orders
    const data = {
      sequence: rows.length,
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Consumable extends PureComponent {
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (
      (!this.props.global.openAdjustment && nextProps.global.openAdjustment) ||
      nextProps.orders.shouldPushToState
    ) {
      nextProps.dispatch({
        type: 'orders/updateState',
        payload: {
          entity: nextProps.values,
          shouldPushToState: false,
        },
      })
    }
  }

  changeConsumable = (v, op = {}) => {
    const { setFieldValue, values } = this.props
    console.log(v, op)
    setFieldValue('consumableCode', op.code)
    setFieldValue('consumableName', op.displayValue)
    if (op.sellingPrice) {
      setFieldValue('unitPrice', op.sellingPrice)
      setFieldValue('totalPrice', op.sellingPrice * values.quantity)
      this.updateTotalPrice(op.sellingPrice * values.quantity)
    } else {
      setFieldValue('unitPrice', undefined)
      setFieldValue('totalPrice', undefined)
      this.updateTotalPrice(undefined)
    }
  }

  updateTotalPrice = (v) => {
    if (v !== undefined) {
      const { adjType, adjValue } = this.props.values
      const adjustment = calculateAdjustAmount(
        adjType === 'ExactAmount',
        v,
        adjValue,
      )
      this.props.setFieldValue('totalAfterItemAdjustment', adjustment.amount)
      this.props.setFieldValue('adjAmount', adjustment.adjAmount)
    } else {
      this.props.setFieldValue('totalAfterItemAdjustment', undefined)
      this.props.setFieldValue('adjAmount', undefined)
    }
  }

  render () {
    const { values, footer, handleSubmit, setFieldValue } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='inventoryConsumableFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Name'
                    code='inventoryconsumable'
                    labelField='displayValue'
                    onChange={this.changeConsumable}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={4}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    step={1}
                    min={1}
                    onChange={(e) => {
                      if (values.unitPrice) {
                        const total = e.target.value * values.unitPrice
                        setFieldValue('totalPrice', total)
                        this.updateTotalPrice(total)
                      }
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='totalPrice'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total'
                    currency
                    onChange={(e) => {
                      this.updateTotalPrice(e.target.value)
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='totalAfterItemAdjustment'
              render={(args) => {
                return (
                  <NumberInput
                    label='Total After Adj'
                    currency
                    disabled
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='remarks'
              render={(args) => {
                // return <RichEditor placeholder='Remarks' {...args} />
                return (
                  <TextField multiline rowsMax='5' label='Remarks' {...args} />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
        })}
      </div>
    )
  }
}
export default Consumable
