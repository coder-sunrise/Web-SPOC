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
  Field,
  DatePicker,
} from '@/components'

import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'
import LowStockInfo from './LowStockInfo'

@connect(({ global, codetable }) => ({ global, codetable }))
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
  state = {
    selectedConsumable: {
      consumableStock: [],
    },
    batchNo: '',
    expiryDate: '',
  }

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
    const { setFieldValue, values, disableEdit } = this.props

    let defaultBatch
    if (op.consumableStock) {
      defaultBatch = op.consumableStock.find((o) => o.isDefault === true)
      if (defaultBatch)
        this.setState({
          batchNo: defaultBatch.batchNo,
          expiryDate: defaultBatch.expiryDate,
        })
    }
    if (disableEdit === false) {
      setFieldValue('batchNo', defaultBatch ? defaultBatch.batchNo : undefined)
      setFieldValue(
        'expiryDate',
        defaultBatch ? defaultBatch.expiryDate : undefined,
      )
    }
    // console.log(v, op)
    setFieldValue('isActive', true)
    setFieldValue('consumableCode', op.code)
    setFieldValue('consumableName', op.displayValue)
    setFieldValue('unitOfMeasurement', op.uom ? op.uom.name : undefined)

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
    if (v || v === 0) {
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

  handleReset = () => {
    const { setValues, orders } = this.props
    setValues({
      ...orders.defaultConsumable,
      type: orders.type,
    })
  }

  render () {
    const { theme, values, footer, handleSubmit, setFieldValue, classes, disableEdit } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <FastField
              name='inventoryConsumableFK'
              render={(args) => {
                return (
                  <div style={{ position: 'relative' }}>
                    <CodeSelect
                      temp
                      label='Consumable Name'
                      code='inventoryconsumable'
                      labelField='displayValue'
                      onChange={this.changeConsumable}
                      {...args}
                      style={{ paddingRight: 20 }}
                    />
                    <LowStockInfo sourceType='consumable' {...this.props} />
                  </div>
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
          <GridItem xs={2} className={classes.editor}>
            <Field
              name='batchNo'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Batch No.'
                    labelField='batchNo'
                    valueField='batchNo'
                    options={this.state.selectedConsumable.consumableStock}
                    onChange={(e, op = {}) => {
                      setFieldValue('expiryDate', op.expiryDate)
                    }}
                    disabled={disableEdit}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={2} className={classes.editor}>
            <Field
              name='expiryDate'
              render={(args) => {
                return (
                  <DatePicker
                    label='Expiry Date'
                    disabled={disableEdit}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={8} className={classes.editor}>
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
          onReset: this.handleReset,
        })}
      </div>
    )
  }
}
export default Consumable
