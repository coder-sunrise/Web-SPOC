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
        <Field
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
          name='consumableMaxCapacity'
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
          name='medicationMaxCapacity'
          render={(args) => (
            <NumberInput
              label={formatMessage({
                id: 'finance.scheme.setting.maximumCapMedications',
              })}
              {...args}
            />
          )}
        />
        <Field
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
        <Field
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
        <Field
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
