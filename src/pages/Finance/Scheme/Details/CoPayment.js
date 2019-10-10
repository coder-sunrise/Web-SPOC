import React from 'react'
import { formatMessage } from 'umi/locale'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  NumberInput,
  Switch,
} from '@/components'

const CoPayment = ({ values, classes, setFieldValue }) => {
  const CPNumber = (label, type, radType) => (args) => {
    return (
      <NumberInput
        label={label}
        currency={type === 'ExactAmount'}
        percentage={type === 'Percentage'}
        disabled={values.itemGroupValueDtoRdoValue !== radType}
        defaultValue='0.00'
        format='$0,0.00'
        {...args}
      />
    )
  }

  const CPSwitch = (type) => (args) => {
    if (!args.field.value) {
      args.field.value = 'ExactAmount'
    }
    return (
      <Switch
        checkedChildren='$'
        checkedValue='ExactAmount'
        unCheckedChildren='%'
        unCheckedValue='Percentage'
        label=' '
        disabled={values.itemGroupValueDtoRdoValue !== type}
        {...args}
      />
    )
  }

  const onRadioButtonChange = (event) => {
    const { target } = event

    if (target.value === 'sub') {
      setFieldValue('overalCoPaymentValue', undefined)
      setFieldValue('overalCoPaymentValueType', 'ExactAmount')
    } else {
      setFieldValue(
        'itemGroupValueDto.consumableGroupValue.itemGroupValue',
        0.0,
      )
      setFieldValue(
        'itemGroupValueDto.consumableGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue(
        'itemGroupValueDto.medicationGroupValue.itemGroupValue',
        0.0,
      )
      setFieldValue(
        'itemGroupValueDto.medicationGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue(
        'itemGroupValueDto.vaccinationGroupValue.itemGroupValue',
        0.0,
      )
      setFieldValue(
        'itemGroupValueDto.vaccinationGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue('itemGroupValueDto.serviceGroupValue.itemGroupValue', 0.0)
      setFieldValue(
        'itemGroupValueDto.serviceGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue('itemGroupValueDto.packageGroupValue.itemGroupValue', 0.0)
      setFieldValue(
        'itemGroupValueDto.packageGroupValue.groupValueType',
        'ExactAmount',
      )
    }
  }

  return (
    <GridContainer>
      <GridItem xs={1}>
        <FastField
          name='itemGroupValueDtoRdoValue'
          render={(args) => (
            <RadioGroup
              label=''
              inputClass={classes.rdoInput}
              onChange={onRadioButtonChange}
              options={[
                {
                  value: 'all',
                  label: '',
                },
                {
                  value: 'sub',
                  label: '',
                },
              ]}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem xs={9}>
        <Field
          name='overalCoPaymentValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.allItems',
            }),
            values.overalCoPaymentValueType,
            'all',
          )}
        />
        <Field
          name='itemGroupValueDto.consumableGroupValue.itemGroupValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.consumables',
            }),
            values.itemGroupValueDto &&
            values.itemGroupValueDto.consumableGroupValue
              ? values.itemGroupValueDto.consumableGroupValue.groupValueType
              : 'ExactAmount',
            'sub',
          )}
        />

        <Field
          name='itemGroupValueDto.medicationGroupValue.itemGroupValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.medications',
            }),
            values.itemGroupValueDto &&
            values.itemGroupValueDto.medicationGroupValue
              ? values.itemGroupValueDto.medicationGroupValue.groupValueType
              : 'ExactAmount',
            'sub',
          )}
        />
        <Field
          name='itemGroupValueDto.vaccinationGroupValue.itemGroupValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.vaccines',
            }),
            values.itemGroupValueDto &&
            values.itemGroupValueDto.vaccinationGroupValue
              ? values.itemGroupValueDto.vaccinationGroupValue.groupValueType
              : 'ExactAmount',
            'sub',
          )}
        />
        <Field
          name='itemGroupValueDto.serviceGroupValue.itemGroupValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.services',
            }),
            values.itemGroupValueDto &&
            values.itemGroupValueDto.serviceGroupValue
              ? values.itemGroupValueDto.serviceGroupValue.groupValueType
              : 'ExactAmount',
            'sub',
          )}
        />
        <Field
          name='itemGroupValueDto.packageGroupValue.itemGroupValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.packages',
            }),
            values.itemGroupValueDto &&
            values.itemGroupValueDto.packageGroupValue
              ? values.itemGroupValueDto.packageGroupValue.groupValueType
              : 'ExactAmount',
            'sub',
          )}
        />
      </GridItem>
      <GridItem xs={2}>
        <Field name='overalCoPaymentValueType' render={CPSwitch('all')} />

        <Field
          name='itemGroupValueDto.consumableGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
        <Field
          name='itemGroupValueDto.medicationGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
        <Field
          name='itemGroupValueDto.vaccinationGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
        <Field
          name='itemGroupValueDto.serviceGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
        <Field
          name='itemGroupValueDto.packageGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
      </GridItem>
    </GridContainer>
  )
}
export default CoPayment
