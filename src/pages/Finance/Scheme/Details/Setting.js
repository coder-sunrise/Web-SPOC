import React from 'react'
import CoPayment from './CoPayment'
import CoverageCap from './CoverageCap'
import ItemList from './ItemList'

import {
  Field,
  GridContainer,
  GridItem,
  NumberInput,
  SizeContainer,
  CardContainer,
  FieldSet,
  Switch,
} from '@/components'

const CPSwitch = (label, isUserMaintainable) => (args) => {
  if (!args.field.value) {
    args.field.value = 'ExactAmount'
  }
  return (
    <Switch
      checkedChildren='$'
      checkedValue='ExactAmount'
      unCheckedChildren='%'
      unCheckedValue='Percentage'
      label={label}
      disabled={!isUserMaintainable}
      {...args}
    />
  )
}
const CPNumber = (label, type, isUserMaintainable) => (args) => {
  return (
    <NumberInput
      label={label}
      currency={type === 'ExactAmount'}
      percentage={type === 'Percentage'}
      disabled={!isUserMaintainable}
      {...args}
    />
  )
}
const Setting = (props) => {
  const { schemeDetail, height, classes, values, setFieldValue } = props

  const { isUserMaintainable } = values
  return (
    <CardContainer
      hideHeader
      style={{
        height,
        overflow: 'auto',
      }}
    >
      <SizeContainer size='sm'>
        <GridContainer>
          <GridItem xs={8} md={5}>
            <Field
              name='patientMinCoPaymentAmount'
              render={CPNumber(
                'Minimum Patient Payable Amount',
                values.patientMinCoPaymentAmountType,
                isUserMaintainable,
              )}
            />
          </GridItem>
          <GridItem xs={4} md={1}>
            <Field
              name='patientMinCoPaymentAmountType'
              render={CPSwitch(' ', isUserMaintainable)}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={6}>
            <FieldSet size='sm' title='Coverage Cap'>
              <CoverageCap
                setFieldValue={setFieldValue}
                values={values}
                classes={classes}
              />
            </FieldSet>
          </GridItem>
          <GridItem xs={12} md={6}>
            <FieldSet size='sm' title='Co-Payment'>
              <CoPayment
                schemeDetail={schemeDetail}
                setFieldValue={setFieldValue}
                values={values}
                classes={classes}
              />
            </FieldSet>
          </GridItem>
        </GridContainer>
        <ItemList
          {...props}
          // values={values}
          CPSwitch={CPSwitch}
          CPNumber={CPNumber}
          setFieldValue={setFieldValue}
        />
      </SizeContainer>
    </CardContainer>
  )
}

export default Setting
