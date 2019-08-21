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

const CoverageCap = ({ values, classes }) => {
  return (
    <GridContainer>
      <GridItem xs={1}>
        <FastField
          name='itemGroupMaxCapacityDtoRdoValue'
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
      <GridItem xs={11}>
        <FastField
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
        <FastField
          name='consumableMaxCapacity'
          render={(args) => (
            <TextField
              disabled={values.itemGroupMaxCapacityDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapConsumables',
              })}
              {...args}
            />
          )}
        />
        <FastField
          name='medicationMaxCapacity'
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
        <FastField
          name='vaccinationMaxCapacity'
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
        <FastField
          name='serviceMaxCapacity'
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
        <FastField
          name='packageMaxCapacity'
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
export default CoverageCap
