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
    treatmentCategory: Yup.number().required(),
    treatment: Yup.number().required(),
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
  calculateSubtotal = (
    quantity = 0,
    unitPrice = 0,
    discount = 0,
    discountType = 'Percentage',
  ) => {
    let subtotal = unitPrice * quantity

    if (discountType === 'ExactAmount') {
      subtotal -= discount
    } else {
      subtotal *= (100 - discount) / 100
    }

    this.props.setFieldValue('subtotal', subtotal)
  }

  render () {
    const { values, footer, handleSubmit } = this.props
    const isExactAmount = values.discountType === 'ExactAmount'

    return (
      <div>
        <GridContainer>
          <GridItem xs={8}>
            <GridItem>
              <FastField
                name='treatmentCategory'
                render={(args) => {
                  return (
                    <CodeSelect
                      temp
                      label='Treatment Category'
                      code='inventorypackage'
                      labelField='displayValue'
                      // onChange={this.changePackage}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem>
              <FastField
                name='treatment'
                render={(args) => {
                  return (
                    <CodeSelect
                      temp
                      label='Treatment'
                      code='inventorypackage'
                      labelField='displayValue'
                      // onChange={this.changePackage}
                      {...args}
                    />
                  )
                }}
              />
            </GridItem>
            <GridItem>
              <Field
                name='remarks'
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
                          values.discount,
                          values.discountType,
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
                          values.discount,
                          values.discountType,
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
                  name='discount'
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
                            values.discountType,
                          )}
                        {...args}
                      />
                    )
                  }}
                />
              </GridItem>
              <GridItem style={{ padding: 0 }}>
                <Field
                  name='discountType'
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
                            values.discount,
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
                name='subtotal'
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
