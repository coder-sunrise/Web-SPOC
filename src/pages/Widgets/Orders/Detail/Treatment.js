import React, { PureComponent } from 'react'
import {
  GridContainer,
  GridItem,
  withFormikExtend,
  Field,
  NumberInput,
  FastField,
  OutlinedTextField,
  Switch,
  CodeSelect,
  Select,
} from '@/components'
import Yup from '@/utils/yup'

@withFormikExtend({
  mapPropsToValues: ({ orders = {}, type }) => {
    const v = {
      ...(orders.entity || orders.defaultTreatment),
      type,
    }
    return v
  },
  enableReinitialize: true,
  validationSchema: Yup.object().shape({
    treatmentCategoryFK: Yup.number().required(),
    treatmentFK: Yup.number().required(),
    quantity: Yup.number().required(),
    unitPrice: Yup.number().required(),
  }),
  handleSubmit: (values, { props, onConfirm }) => {
    const { dispatch, currentType, getNextSequence } = props

    const data = {
      sequence: getNextSequence(),
      ...values,
      subject: currentType.getSubject(values),
      isDeleted: false,
      totalPrice: values.unitPrice,
      totalAfterItemAdjustment: values.totalPrice,
    }
    dispatch({
      type: 'orders/upsertRow',
      payload: data,
    })
    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Treatment extends PureComponent {
  state = {
    ctTreatment: [],
  }

  componentDidMount () {
    this.props
      .dispatch({
        type: 'codetable/fetchCodes',
        payload: {
          code: 'cttreatment',
        },
      })
      .then((v) => {
        this.setState({ ctTreatment: v })
      })
  }

  calculateSubtotal = (
    quantity = 0,
    unitPrice = 0,
    adjAmount = 0,
    adjType = 'Percentage',
  ) => {
    let subtotal = unitPrice * quantity

    if (adjType === 'ExactAmount') {
      subtotal -= adjAmount
    } else {
      if (adjAmount > 100) adjAmount = 100
      subtotal *= (100 - adjAmount) / 100
    }

    this.props.setFieldValue('totalPrice', subtotal)
  }

  setItemName = (v, op) => {
    const { setFieldValue, values } = this.props
    const { displayValue, sellingPrice, isActive } = op

    setFieldValue('itemName', displayValue)
    setFieldValue('unitPrice', sellingPrice)
    setFieldValue('isActive', isActive)
    this.calculateSubtotal(
      values.quantity,
      sellingPrice,
      values.adjAmount,
      values.adjType,
    )
  }

  render () {
    const { values, footer, handleSubmit, setFieldValue } = this.props
    const isExactAmount = values.adjType === 'ExactAmount'
    return (
      <div>
        <GridContainer>
          <GridItem xs={8}>
            <GridItem>
              <FastField
                name='treatmentCategoryFK'
                render={(args) => {
                  return (
                    <CodeSelect
                      temp
                      label='Treatment Category'
                      code='cttreatmentcategory'
                      labelField='name'
                      onChange={() => setFieldValue('treatmentFK', undefined)}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem>
              <Field
                name='treatmentFK'
                render={(args) => {
                  return (
                    <Select
                      label='Treatment'
                      labelField='displayValue'
                      valueField='id'
                      options={this.state.ctTreatment.filter(
                        (o) =>
                          o.treatmentCategoryFK === values.treatmentCategoryFK,
                      )}
                      onChange={(v, op = {}) => {
                        this.setItemName(v, op)
                      }}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem>
              <Field
                name='remark'
                render={(args) => {
                  return (
                    <OutlinedTextField
                      label='Remarks'
                      multiline
                      rowsMax={3}
                      rows={2}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridItem>
          <GridItem xs={4}>
            <GridItem>
              <Field
                name='quantity'
                render={(args) => {
                  return (
                    <NumberInput
                      precision={0}
                      label='Quantity'
                      min={1}
                      onChange={(e) =>
                        this.calculateSubtotal(
                          e.target.value,
                          values.unitPrice,
                          values.adjAmount,
                          values.adjType,
                        )}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>

            <GridItem>
              <Field
                name='unitPrice'
                render={(args) => {
                  return (
                    <NumberInput
                      label='Unit Price'
                      currency
                      onChange={(e) =>
                        this.calculateSubtotal(
                          values.quantity,
                          e.target.value,
                          values.adjAmount,
                          values.adjType,
                        )}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>

            <GridItem container direction='row' style={{ padding: 0 }}>
              <GridItem>
                <Field
                  name='adjAmount'
                  render={(args) => {
                    return (
                      <NumberInput
                        label='Discount'
                        currency={isExactAmount}
                        percentage={!isExactAmount}
                        onChange={(e) =>
                          this.calculateSubtotal(
                            values.quantity,
                            values.unitPrice,
                            e.target.value,
                            values.adjType,
                          )}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem style={{ padding: 0 }}>
                <Field
                  name='adjType'
                  render={(args) => {
                    return (
                      <Switch
                        checkedChildren='$'
                        unCheckedChildren='%'
                        checkedValue='ExactAmount'
                        unCheckedValue='Percentage'
                        label=''
                        onChange={(e) =>
                          this.calculateSubtotal(
                            values.quantity,
                            values.unitPrice,
                            values.adjAmount,
                            e,
                          )}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
            </GridItem>

            <GridItem>
              <Field
                name='totalPrice'
                render={(args) => {
                  return (
                    <NumberInput
                      label='Sub-Total'
                      disabled
                      currency
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
          </GridItem>
        </GridContainer>
        {footer({
          onSave: handleSubmit,
          onReset: this.handleReset,
          showAdjustment: false,
        })}
      </div>
    )
  }
}

export default Treatment
