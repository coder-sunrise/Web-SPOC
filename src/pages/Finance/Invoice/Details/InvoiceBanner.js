import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  CardContainer,
  DatePicker,
  GridContainer,
  GridItem,
  TextField,
  NumberInput,
} from '@/components'
// styles
import styles from './styles'

const amountProps = {
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

const InvoiceBanner = ({ classes }) => {
  return (
    <CardContainer hideHeader size='sm'>
      <GridContainer>
        <GridContainer item md={3} alignItems='flex-start'>
          <GridItem md={6}>
            <h5 className={classes.boldText}>Lee Tian Kang,</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>S1234567D</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>Invoice No: </h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>INV-0001</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>Invoice Date:</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>07 May 2019</h5>
          </GridItem>
        </GridContainer>
        <GridContainer alignItems='flex-start' item md={8}>
          <GridContainer item md={12}>
            <GridItem md={3}>
              <FastField
                name='invoiceAmount'
                render={(args) => (
                  <NumberInput
                    prefix='Invoice Amount'
                    defaultValue={3500}
                    {...amountProps}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={1} />
            <GridItem md={3}>
              <FastField
                name='writeOffAmount'
                render={(args) => (
                  <NumberInput
                    prefix='Write Off Amount'
                    defaultValue={0}
                    {...amountProps}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={1} />
            <GridItem md={3}>
              <FastField
                name='outstandingBalance'
                render={(args) => (
                  <NumberInput
                    prefix='O/S Balance'
                    defaultValue={3500}
                    {...amountProps}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
          <GridContainer item md={12}>
            <GridItem md={3}>
              <FastField
                name='totalPayments'
                render={(args) => (
                  <NumberInput
                    prefix='Total Payments'
                    defaultValue={0}
                    {...amountProps}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={1} />
            <GridItem md={3}>
              <FastField
                name='creditNote'
                render={(args) => (
                  <NumberInput
                    prefix='Credit Note'
                    defaultValue={0}
                    {...amountProps}
                    {...args}
                  />
                )}
              />
            </GridItem>
          </GridContainer>
        </GridContainer>
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'InvoiceBanner' })(InvoiceBanner)
