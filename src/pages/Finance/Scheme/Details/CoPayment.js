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
        <Field
          name='overalCoPaymentValue'
          // render={CPNumber(
          //   formatMessage({
          //     id: 'finance.scheme.setting.allItems',
          //   }),
          //   values.overalCoPaymentValueType,
          // )}
          render={(args) => {
            if (values.overalCoPaymentValueType) {
              return (
                <NumberInput
                  currency
                  disabled={values.itemGroupValueDtoRdoValue !== 'all'}
                  label={formatMessage({
                    id: 'finance.scheme.setting.allItems',
                  })}
                  {...args}
                />
              )
            }
            return (
              <NumberInput
                percentage
                disabled={values.itemGroupValueDtoRdoValue !== 'all'}
                label={formatMessage({
                  id: 'finance.scheme.setting.allItems',
                })}
                {...args}
              />
            )
          }}

          // render={(args) =>
          //   CPNumber(
          //     formatMessage({
          //       id: 'finance.scheme.setting.allItems',
          //     }),
          //     // values.overalCoPaymentValueType,
          //     { ...args },
        />
        <Field
          name='itemGroupValueDto.consumableGroupValue.itemGroupValue'
          render={(args) => (
            <NumberInput
              disabled={values.itemGroupValueDtoRdoValue !== 'sub'}
              label={formatMessage({
                id: 'finance.scheme.setting.consumables',
              })}
              {...args}
            />
            // <GridItem xs={8} md={5}>
            //   <Field
            //     name='patientMinCoPaymentAmount'
            //     render={CPNumber(
            //       'Minimum Patient Payable Amount',
            //       values.patientMinCoPaymentAmountType,
            //     )}
            //   />
            // </GridItem>
            // <GridItem xs={4} md={1}>
            //   <Field name='patientMinCoPaymentAmountType' render={CPSwitch} />
            // </GridItem>
            // render={CPNumber(
            //   formatMessage({
            //     id: 'finance.scheme.setting.consumables',
            //   }),
            //   values.itemGroupValueDto.consumableGroupValue.groupValueType,
            // )}

            // render={CPNumber(
            //   'Minimum Patient Payable Amount',
            //   values.itemGroupValueDto.consumableGroupValue.groupValueType,
          )}
        />
        <Field
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
        <Field
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
        <Field
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
        <Field
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
        <Field name='overalCoPaymentValueType' render={CPSwitch} />

        <Field
          name='itemGroupValueDto.consumableGroupValue.groupValueType'
          render={CPSwitch}
        />
        <Field
          name='itemGroupValueDto.medicationGroupValue.groupValueType'
          render={CPSwitch}
        />
        <Field
          name='itemGroupValueDto.vaccinationGroupValue.groupValueType'
          render={CPSwitch}
        />
        <Field
          name='itemGroupValueDto.serviceGroupValue.groupValueType'
          render={CPSwitch}
        />
        <Field
          name='itemGroupValueDto.packageGroupValue.groupValueType'
          render={CPSwitch}
        />
      </GridItem>
    </GridContainer>
  )
}
export default CoPayment
