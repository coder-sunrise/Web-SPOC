import React from 'react'
import { formatMessage } from 'umi'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  NumberInput,
  Switch,
} from '@/components'

const CoPayment = ({ values, theme, classes, setFieldValue }) => {
  const CPNumber = (label, type, radType) => args => {
    return (
      <NumberInput
        label={label}
        currency={type === 'ExactAmount'}
        percentage={type === 'Percentage'}
        disabled={values.itemGroupValueDtoRdoValue !== radType}
        // defaultValue='0.00'
        format='$0,0.00'
        allowEmpty={false}
        min={0}
        {...args}
      />
    )
  }

  const CPSwitch = type => args => {
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

  const onRadioButtonChange = event => {
    const { target } = event

    if (target.value === 'sub') {
      setFieldValue('overalCoPaymentValue', undefined)
      setFieldValue('overalCoPaymentValueType', 'Percentage')
      setFieldValue('itemGroupValueDto.consumableGroupValue.itemGroupValue', 0)
      setFieldValue(
        'itemGroupValueDto.consumableGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue('itemGroupValueDto.serviceGroupValue.itemGroupValue', 0)
      setFieldValue(
        'itemGroupValueDto.serviceGroupValue.groupValueType',
        'ExactAmount',
      )

      setFieldValue('itemGroupValueDto.orderSetGroupValue.itemGroupValue', 0)
      setFieldValue(
        'itemGroupValueDto.OrderSetGroupValue.groupValueType',
        'ExactAmount',
      )
    }

    if (target.value === 'all') {
      setFieldValue('overalCoPaymentValue', 100)
      setFieldValue('overalCoPaymentValueType', 'Percentage')

      if (!values.id) setFieldValue('itemGroupValueDto', {})
      else {
        setFieldValue('itemGroupValueDto.consumableGroupValue.isDeleted', true)
        setFieldValue('itemGroupValueDto.serviceGroupValue.isDeleted', true)
        setFieldValue('itemGroupValueDto.orderSetGroupValue.isDeleted', true)
      }
    }
  }

  return (
    <GridContainer>
      <GridItem xs={1}>
        <FastField
          name='itemGroupValueDtoRdoValue'
          render={args => (
            <RadioGroup
              label=''
              className={classes.rdoInput}
              onChange={onRadioButtonChange}
              vertical
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
        <p style={{ marginTop: theme.spacing(1) }}>&nbsp;</p>
      </GridItem>
      <GridItem xs={2}>
        <Field name='overalCoPaymentValueType' render={CPSwitch('all')} />
        <Field
          name='itemGroupValueDto.consumableGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
        <Field
          name='itemGroupValueDto.serviceGroupValue.groupValueType'
          render={CPSwitch('sub')}
        />
      </GridItem>
    </GridContainer>
  )
}
export default CoPayment
