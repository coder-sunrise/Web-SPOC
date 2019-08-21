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
} from '@/components'

const CoPayment = ({ values, classes, CPSwitch, CPNumber }) => {
  return (
    <GridContainer>
      <GridItem xs={1}>
        <FastField
          name='itemGroupValueDtoRdoValue'
          render={(args) => (
            <RadioGroup
              label=''
              inputClass={classes.rdoInput}
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
        <FastField
          name='overalCoPaymentValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.allItems',
            }),
            values.overalCoPaymentValueType,
          )}
        />
        <FastField
          name='itemGroupValueDto.consumableGroupValue.itemGroupValue'
          render={CPNumber(
            formatMessage({
              id: 'finance.scheme.setting.consumables',
            }),
            values.itemGroupValueDto.consumableGroupValue.groupValueType,
          )}
        />
        <FastField
          name='itemGroupValueDto.medicationGroupValue.itemGroupValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupValueDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.medications',
              })}
              {...args}
            />
          )}
        />
        <FastField
          name='itemGroupValueDto.vaccinationGroupValue.itemGroupValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupValueDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.vaccines',
              })}
              {...args}
            />
          )}
        />
        <FastField
          name='itemGroupValueDto.serviceGroupValue.itemGroupValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupValueDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.services',
              })}
              {...args}
            />
          )}
        />
        <FastField
          name='itemGroupValueDto.packageGroupValue.itemGroupValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupValueDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.packages',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem xs={2}>
        <FastField name='overalCoPaymentValueType' render={CPSwitch} />
        <FastField
          name='itemGroupValueDto.consumableGroupValue.groupValueType'
          render={CPSwitch}
        />
        <FastField
          name='itemGroupValueDto.medicationGroupValue.groupValueType'
          render={CPSwitch}
        />
        <FastField
          name='itemGroupValueDto.vaccinationGroupValue.groupValueType'
          render={CPSwitch}
        />
        <FastField
          name='itemGroupValueDto.serviceGroupValue.groupValueType'
          render={CPSwitch}
        />
        <FastField
          name='itemGroupValueDto.packageGroupValue.groupValueType'
          render={CPSwitch}
        />
      </GridItem>
    </GridContainer>
  )
}
export default CoPayment
