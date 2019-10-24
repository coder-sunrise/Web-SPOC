import React, { memo } from 'react'
import { formatMessage } from 'umi/locale'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  NumberInput,
} from '@/components'

const CoverageCap = ({ values, classes, setFieldValue }) => {
  const onRadioButtonChange = (event) => {
    const { target } = event

    if (target.value === 'sub') {
      setFieldValue('coverageMaxCap', undefined)
      setFieldValue(
        'itemGroupMaxCapacityDto.medicationMaxCapacity.maxCapValue',
        0.0,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.consumableMaxCapacity.maxCapValue',
        0.0,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.vaccinationMaxCapacity.maxCapValue',
        0.0,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.serviceMaxCapacity.maxCapValue',
        0.0,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.packageMaxCapacity.maxCapValue',
        0.0,
      )
    }

    if (target.value === 'all') {
      if (!values.id) setFieldValue('itemGroupMaxCapacityDto', {})
      else {
        setFieldValue(
          'itemGroupMaxCapacityDto.medicationMaxCapacity.isDeleted',
          true,
        )
        setFieldValue(
          'itemGroupMaxCapacityDto.consumableMaxCapacity.isDeleted',
          true,
        )
        setFieldValue(
          'itemGroupMaxCapacityDto.vaccinationMaxCapacity.isDeleted',
          true,
        )
        setFieldValue(
          'itemGroupMaxCapacityDto.serviceMaxCapacity.isDeleted',
          true,
        )
        setFieldValue(
          'itemGroupMaxCapacityDto.packageMaxCapacity.isDeleted',
          true,
        )
      }
    }
  }

  return (
    <GridContainer>
      <GridItem xs={1}>
        <FastField
          name='itemGroupMaxCapacityDtoRdoValue'
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
      <GridItem xs={11}>
        <Field
          name='coverageMaxCap'
          render={(args) => (
            <NumberInput
              {...args}
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'all'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapAll',
              })}
              currency
              // min={1}
            />
          )}
        />
        <Field
          name='itemGroupMaxCapacityDto.consumableMaxCapacity.maxCapValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapConsumables',
              })}
              currency
              min={0}
              {...args}
            />
          )}
        />
        <Field
          name='itemGroupMaxCapacityDto.medicationMaxCapacity.maxCapValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapMedications',
              })}
              currency
              min={0}
              {...args}
            />
          )}
        />
        <Field
          name='itemGroupMaxCapacityDto.vaccinationMaxCapacity.maxCapValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapVaccines',
              })}
              currency
              min={0}
              {...args}
            />
          )}
        />
        <Field
          name='itemGroupMaxCapacityDto.serviceMaxCapacity.maxCapValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapServices',
              })}
              currency
              min={0}
              {...args}
            />
          )}
        />
        <Field
          name='itemGroupMaxCapacityDto.packageMaxCapacity.maxCapValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapPackages',
              })}
              currency
              min={0}
              {...args}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}
export default memo(CoverageCap)
