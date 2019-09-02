import React, { useEffect } from 'react'
import { formatMessage } from 'umi/locale'
import { Divider } from '@material-ui/core'
import CoPayment from './CoPayment'
import CoverageCap from './CoverageCap'
import ItemList from './ItemList'

import {
  Field,
  FastField,
  GridContainer,
  GridItem,
  ButtonGroup,
  NumberInput,
  Card,
  CardHeader,
  CardText,
  CardBody,
  SizeContainer,
  CardContainer,
  FieldSet,
  Switch,
} from '@/components'

const CPSwitch = (args) => {
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
      {...args}
    />
  )
}
const CPNumber = (label, type) => (args) => {
  return (
    <NumberInput
      label={label}
      currency={type === 'ExactAmount'}
      percentage={type === 'Percentage'}
      {...args}
    />
  )
}
const Setting = (props) => {
  const {
    schemeDetail,
    dispatch,
    height,
    classes,
    values,
    setFieldValue,
  } = props
  const changeFieldValue = (value, type, args) => {
    if (value !== type) {
      return null
    }
    return args.field.value
  }
  // const options = [
  //   {
  //     label: '$',
  //     value: 'ExactAmount',
  //   },
  //   {
  //     label: '%',
  //     value: 'Percentage',
  //   },
  // ]
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
              )}
            />
          </GridItem>
          <GridItem xs={4} md={1}>
            <Field name='patientMinCoPaymentAmountType' render={CPSwitch} />
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
        <ItemList {...props} CPSwitch={CPSwitch} CPNumber={CPNumber} />
      </SizeContainer>
    </CardContainer>
  )
}

export default Setting
