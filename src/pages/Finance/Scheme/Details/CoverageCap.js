import React, { memo } from 'react'
import { formatMessage } from 'umi'
import {
  Field,
  FastField,
  RadioGroup,
  GridContainer,
  GridItem,
  NumberInput,
} from '@/components'

const CoverageCap = ({ values, theme, classes, setFieldValue }) => {
  // console.log({ values })
  const onRadioButtonChange = event => {
    const { target } = event

    if (target.value === 'sub') {
      setFieldValue('coverageMaxCap', undefined)
      setFieldValue(
        'itemGroupMaxCapacityDto.consumableMaxCapacity.maxCapValue',
        undefined,
      )
      setFieldValue(
        'itemGroupMaxCapacityDto.serviceMaxCapacity.maxCapValue',
        undefined,
      )
    }

    if (target.value === 'all') {
      if (!values.id) setFieldValue('itemGroupMaxCapacityDto', {})
      else {
        setFieldValue(
          'itemGroupMaxCapacityDto.consumableMaxCapacity.isDeleted',
          true,
        )
        setFieldValue(
          'itemGroupMaxCapacityDto.serviceMaxCapacity.isDeleted',
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
      <GridItem xs={11}>
        <Field
          name='coverageMaxCap'
          render={args => (
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
          render={args => (
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
          name='itemGroupMaxCapacityDto.serviceMaxCapacity.maxCapValue'
          render={args => (
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
        <p style={{ marginTop: theme.spacing(1) }}>Leave blank if no cap</p>
      </GridItem>
    </GridContainer>
  )
}
export default memo(CoverageCap)
