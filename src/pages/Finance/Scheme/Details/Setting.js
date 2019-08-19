import React, { useEffect } from 'react'
import { formatMessage } from 'umi/locale'
import { withStyles } from '@material-ui/core/styles'
import { Divider } from '@material-ui/core'
import { FastField } from 'formik'
import { compose } from 'redux'
import CoPayment from './CoPayment'
import CoverageCap from './CoverageCap'

import {
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
} from '@/components'

const Setting = ({ schemeDetail, dispatch, height, classes }) => {
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
          <GridItem xs={12} md={6}>
            <FastField
              name='minimumPatientPayableAmount'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.pricing.maxDiscount',
                  })}
                  suffix={
                    <ButtonGroup
                      options={[
                        {
                          label: '$',
                          value: '$',
                        },
                        {
                          label: '%',
                          value: '%',
                        },
                      ]}
                    />
                  }
                  {...args}
                />
              )}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} md={6}>
            <FieldSet size='sm' title='Coverage Cap'>
              <CoverageCap />
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
