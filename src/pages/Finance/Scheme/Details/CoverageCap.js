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

    if (target.value === 'sub') setFieldValue('coverageMaxCap', undefined)
    else {
      setFieldValue(
        'itemGroupMaxCapacityDto.consumableMaxCapacity.maxCapValue',
        undefined,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.medicationMaxCapacity.maxCapValue',
        undefined,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.vaccinationMaxCapacity.maxCapValue',
        undefined,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.serviceMaxCapacity.maxCapValue',
        undefined,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.packageMaxCapacity.maxCapValue',
        undefined,
      )
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
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'all'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapAll',
              })}
              {...args}
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
              {...args}
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}
export default memo(CoverageCap)
