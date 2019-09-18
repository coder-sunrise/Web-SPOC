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

const InvoiceBanner = ({ classes, ...restProps }) => {
  const { values } = restProps
  return (
    <CardContainer hideHeader size='sm'>
      <GridContainer>
        <GridContainer item md={3} alignItems='flex-start'>
          <GridItem md={6}>
            <h5 className={classes.boldText}>{values.patientName}</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>{values.patientAccountNo}</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>Invoice No: </h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>{values.invoiceNo}</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>Invoice Date:</h5>
          </GridItem>
          <GridItem md={6}>
            <h5 className={classes.boldText}>{values.invoiceDate}</h5>
          </GridItem>
        </GridContainer>
        <GridContainer alignItems='flex-start' item md={8}>
          <GridContainer item md={12}>
            <GridItem md={3}>
              <FastField
                name='invoiceTotal'
                render={(args) => (
                  <NumberInput
                    prefix='Invoice Amount'
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
                name='totalPayment'
                render={(args) => (
                  <NumberInput
                    prefix='Total Payments'
                    {...amountProps}
                    {...args}
                  />
                )}
              />
            </GridItem>
            <GridItem md={1} />
            <GridItem md={3}>
              <FastField
                name='totalCreditNoteAmt'
                render={(args) => (
                  <NumberInput
                    prefix='Credit Note'
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
