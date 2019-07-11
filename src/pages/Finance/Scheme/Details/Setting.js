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
} from '@/components'

const styles = () => ({
  buttonGroupDiv: {
    margin: 'auto',
  },
})

const Setting = ({ schemeDetail, dispatch, classes }) => {
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
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={4} md={4}>
            <FastField
              name='minimumPatientPayableAmount'
              render={(args) => (
                <NumberInput
                  label={formatMessage({
                    id: 'inventory.master.pricing.maxDiscount',
                  })}
                  {...args}
                />
              )}
            />
          </GridItem>
          <GridItem xs={8} md={8} className={classes.buttonGroupDiv}>
            <ButtonGroup options={options} />
          </GridItem>
          <GridItem xs={6} md={6}>
            <Card>
              <CardHeader color='primary' text>
                <CardText color='primary'>
                  <h5 className={classes.cardTitle}>Coverage Cap</h5>
                </CardText>
              </CardHeader>
              <CardBody>
                <CoverageCap />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem xs={6} md={6}>
            <Card>
              <CardHeader color='primary' text>
                <CardText color='primary'>
                  <h5 className={classes.cardTitle}>Co-Payment</h5>
                </CardText>
              </CardHeader>
              <CardBody>
                <CoPayment />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default compose(withStyles(styles, { withTheme: true }), React.memo)(
  Setting,
)
