import React, { PureComponent } from 'react'
import { connect } from 'dva'
import {
  GridContainer,
  GridItem,
  TextField,
  CodeSelect,
  DatePicker,
  NumberInput,
  FastField,
  Field,
  withFormikExtend,
} from '@/components'
import Yup from '@/utils/yup'
import { calculateAdjustAmount } from '@/utils/utils'

let i = 0
@connect(({ global }) => ({ global }))
@withFormikExtend({
  mapPropsToValues: ({ orders = {} }) =>
    orders.entity || orders.defaultVaccination,
  enableReinitialize: true,

  validationSchema: Yup.object().shape({
    inventoryVaccinationFK: Yup.number().required(),
    // unitPrice: Yup.number().required(),
    totalPrice: Yup.number().required(),
    vaccinationGivenDate: Yup.date().required(),
    quantity: Yup.number().required(),
    usageMethodFK: Yup.number().required(),
    dosageFK: Yup.number().required(),
    uomfk: Yup.number().required(),
  }),

  handleSubmit: (values, { props, onConfirm, resetForm }) => {
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
    }).then(() => {
      resetForm(orders.defaultVaccination)
    })

    if (onConfirm) onConfirm()
  },
  displayName: 'OrderPage',
})
class Vaccination extends PureComponent {
  state = {
    selectedVaccination: undefined,
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

  changeVaccination = (v, op = {}) => {
    const { setFieldValue, values } = this.props

    this.setState({
      selectedVaccination: op,
    })

    setFieldValue('isActive', op.isActive)
    setFieldValue(
      'dosageFK',
      op.prescribingDosage ? op.prescribingDosage.id : undefined,
    )
    setFieldValue(
      'dosageCode',
      op.prescribingDosage ? op.prescribingDosage.code : undefined,
    )
    setFieldValue(
      'dosageDisplayValue',
      op.prescribingDosage ? op.prescribingDosage.name : undefined,
    )
    setFieldValue('uomfk', op.prescribingUOM ? op.prescribingUOM.id : undefined)
    setFieldValue(
      'uomCode',
      op.prescribingUOM ? op.prescribingUOM.code : undefined,
    )
    setFieldValue(
      'uomDisplayValue',
      op.prescribingUOM ? op.prescribingUOM.name : undefined,
    )
    setFieldValue(
      'usageMethodFK',
      op.vaccinationUsage ? op.vaccinationUsage.id : undefined,
    )
    setFieldValue(
      'usageMethodCode',
      op.vaccinationUsage ? op.vaccinationUsage.code : undefined,
    )
    setFieldValue(
      'usageMethodDisplayValue',
      op.vaccinationUsage ? op.vaccinationUsage.name : undefined,
    )
    setFieldValue('vaccinationName', op.displayValue)
    setFieldValue('vaccinationCode', op.code)

    this.calculateQuantity(op)
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

  calculateQuantity = (vaccination) => {
    const { codetable, setFieldValue, values, disableEdit } = this.props
    // console.log(this.props)
    let currentVaccination =
      vaccination && Object.values(vaccination).length ? vaccination : undefined
    if (!currentVaccination) currentVaccination = this.state.selectedVaccination
    let newTotalQuantity = 0
    // console.log(currentVaccination, values)
    if (currentVaccination && currentVaccination.dispensingQuantity) {
      newTotalQuantity = currentVaccination.dispensingQuantity
    } else {
      const { ctmedicationdosage } = codetable

      const dosage = ctmedicationdosage.find(
        (o) =>
          o.id ===
          (values.dosageFK || currentVaccination.prescribingDosage
            ? currentVaccination.prescribingDosage.id
            : undefined),
      )
      if (dosage) {
        newTotalQuantity = Math.round(dosage.multiplier)
      }

      const { prescriptionToDispenseConversion } = currentVaccination
      if (prescriptionToDispenseConversion)
        newTotalQuantity = Math.round(
          newTotalQuantity / prescriptionToDispenseConversion,
        )
    }
    setFieldValue(`quantity`, newTotalQuantity)
    // console.log(newTotalQuantity)
    if (currentVaccination.sellingPrice) {
      setFieldValue('unitPrice', currentVaccination.sellingPrice)
      setFieldValue(
        'totalPrice',
        currentVaccination.sellingPrice * newTotalQuantity,
      )
      this.updateTotalPrice(currentVaccination.sellingPrice * newTotalQuantity)
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
      ...orders.defaultService,
      type: orders.type,
    })
  }

  render () {
    const { theme, values, footer, handleSubmit, setFieldValue } = this.props
    return (
      <div>
        <GridContainer>
          <GridItem xs={12}>
            <Field
              name='inventoryVaccinationFK'
              render={(args) => {
                return (
                  <CodeSelect
                    temp
                    label='Vaccination Name'
                    labelField='displayValue'
                    code='inventoryvaccination'
                    onChange={this.changeVaccination}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={6}>
            <FastField
              name='vaccinationGivenDate'
              render={(args) => {
                return <DatePicker label='Date Given' {...args} />
              }}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={4}>
            <Field
              name='usageMethodFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Usage'
                    allowClear={false}
                    code='ctVaccinationUsage'
                    onChange={(v, op = {}) => {
                      setFieldValue('usageMethodCode', op ? op.code : undefined)
                      setFieldValue(
                        'usageMethodDisplayValue',
                        op ? op.name : undefined,
                      )
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='dosageFK'
              render={(args) => {
                return (
                  <CodeSelect
                    label='Dosage'
                    labelField='displayValue'
                    allowClear={false}
                    code='ctmedicationdosage'
                    onChange={(v, op = {}) => {
                      setFieldValue('dosageCode', op ? op.code : undefined)
                      setFieldValue(
                        'dosageDisplayValue',
                        op ? op.displayValue : undefined,
                      )
                      setTimeout(this.calculateQuantity, 1)
                    }}
                    valueFiled='id'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='uomfk'
              render={(args) => {
                return (
                  <CodeSelect
                    label='UOM'
                    allowClear={false}
                    code='ctvaccinationunitofmeasurement'
                    onChange={(v, op = {}) => {
                      setFieldValue('uomCode', op ? op.code : undefined)
                      setFieldValue('uomDisplayValue', op ? op.name : undefined)
                    }}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={4}>
            <FastField
              name='quantity'
              render={(args) => {
                return (
                  <NumberInput
                    label='Quantity'
                    formatter={(v) => `${v} Tab/s`}
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
          onReset: this.handleReset,
        })}
      </div>
    )
  }
}
export default Vaccination
