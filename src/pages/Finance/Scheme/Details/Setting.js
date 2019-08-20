import React, { useEffect } from 'react'
import { formatMessage } from 'umi/locale'
import { Divider } from '@material-ui/core'
import CoPayment from './CoPayment'
import CoverageCap from './CoverageCap'

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
  return (
    <Switch
      checkedChildren='$'
      checkedValue='$'
      unCheckedChildren='%'
      unCheckedValue='%'
      label=''
      {...args}
    />
  )
}
const Setting = (props) => {
  const { schemeDetail, dispatch, height, classes, values } = props
  const options = [
    {
      label: '$',
      value: '$',
    },
    {
      label: '%',
      value: '%',
    },
  ]
  console.log(values.patientMinCoPaymentAmountType === '$', values)
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
            <FastField
              name='patientMinCoPaymentAmount'
              render={(args) => (
                <NumberInput
                  label='Minimum Patient Payable Amount'
                  currency={values.patientMinCoPaymentAmountType === '$'}
                  percentage={values.patientMinCoPaymentAmountType === '%'}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={4} md={1}>
            <FastField name='patientMinCoPaymentAmountType' render={CPSwitch} />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={6}>
            <FieldSet size='sm' title='Coverage Cap'>
              <CoverageCap {...props} />
            </FieldSet>
          </GridItem>
          <GridItem xs={12} md={6}>
            <FieldSet size='sm' title='Co-Payment'>
              <CoPayment />
            </FieldSet>
          </GridItem>
        </GridContainer>
      </SizeContainer>
    </CardContainer>
  )
}

export default Setting
