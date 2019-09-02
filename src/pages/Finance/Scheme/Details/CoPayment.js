import React, { useEffect, useState } from 'react'
import { formatMessage } from 'umi/locale'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
  Switch,
} from '@/components'

const CoPayment = ({ values, classes, setFieldValue }) => {
  const CPNumber = (label, type, radType) => (args) => {
    // if (!type) type = 'ExactAmount'
    return (
      <NumberInput
        label={label}
        currency={type === 'ExactAmount'}
        percentage={type === 'Percentage'}
        disabled={values.itemGroupValueDtoRdoValue !== radType}
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
        undefined,
      )
      setFieldValue(
        'itemGroupValueDto.consumableGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue(
        'itemGroupValueDto.medicationGroupValue.itemGroupValue',
        undefined,
      )
      setFieldValue(
        'itemGroupValueDto.medicationGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue(
        'itemGroupValueDto.vaccinationGroupValue.itemGroupValue',
        undefined,
      )
      setFieldValue(
        'itemGroupValueDto.vaccinationGroupValue.groupValueType',
        undefined,
      )

      setFieldValue(
        'itemGroupValueDto.serviceGroupValue.itemGroupValue',
        undefined,
      )
      setFieldValue(
        'itemGroupValueDto.serviceGroupValue.groupValueType',
        undefined,
      )

      setFieldValue(
        'itemGroupValueDto.packageGroupValue.itemGroupValue',
        undefined,
      )
      setFieldValue(
        'itemGroupValueDto.packageGroupValue.groupValueType',
        undefined,
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
            values.itemGroupValueDto
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
