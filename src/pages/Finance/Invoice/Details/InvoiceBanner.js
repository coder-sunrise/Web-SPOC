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
  NumberInput,
  dateFormatLong,
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
      <GridContainer xs={12}>
        <GridContainer item md={3} alignItems='flex-start'>
          <GridItem md={4}>
            <h5 className={classes.boldText}>Patient Name: </h5>
          </GridItem>
          <GridItem md={8}>
            <h5 className={classes.normalText}>
              {values.patientName || 'N/A'}&nbsp;({values.patientAccountNo || 'N/A'})
            </h5>
          </GridItem>
          <GridItem md={4}>
            <h5 className={classes.boldText}>Invoice No: </h5>
          </GridItem>
          <GridItem md={8}>
            <h5 className={classes.normalText}>{values.invoiceNo}</h5>
          </GridItem>
          <GridItem md={4}>
            <h5 className={classes.boldText}>Invoice Date:</h5>
          </GridItem>
          <GridItem md={8}>
            <h5 className={classes.normalText}>
              <DatePicker
                text
                format={dateFormatLong}
                value={values.invoiceDate}
              />{' '}
            </h5>
          </GridItem>
        </GridContainer>

        <GridContainer item md={3} alignItems='flex-start'>
          <GridItem md={5}>
            <h5 className={classes.boldText}>Invoice Amount: </h5>
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='invoiceTotalAftGST'
              render={(args) => <NumberInput {...amountProps} {...args} />}
            />
          </GridItem>
          <GridItem md={3} />
          <GridItem md={5}>
            <h5 className={classes.boldText}>Total Payments: </h5>
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='totalPayment'
              render={(args) => <NumberInput {...amountProps} {...args} />}
            />
          </GridItem>
          <GridItem md={3} />
          <GridItem md={5}>
            <h5 className={classes.boldText}>&nbsp;</h5>
          </GridItem>
          <GridItem md={3}>
            <h5 className={classes.normalText}>&nbsp;</h5>
          </GridItem>
          <GridItem md={4} />
        </GridContainer>

        <GridContainer item md={3} alignItems='flex-start'>
          <GridItem md={5}>
            <h5 className={classes.boldText}>Write Off Amount: </h5>
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='writeOffAmount'
              render={(args) => <NumberInput {...amountProps} {...args} />}
            />
          </GridItem>
          <GridItem md={4} />
          <GridItem md={5}>
            <h5 className={classes.boldText}>Credit Note: </h5>
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='totalCreditNoteAmt'
              render={(args) => <NumberInput {...amountProps} {...args} />}
            />
          </GridItem>
          <GridItem md={4} />
          <GridItem md={5}>
            <h5 className={classes.boldText}>&nbsp;</h5>
          </GridItem>
          <GridItem md={7}>
            <h5 className={classes.normalText}>&nbsp;</h5>
          </GridItem>
        </GridContainer>

        <GridContainer item md={3} alignItems='flex-start'>
          <GridItem md={5}>
            <h5 className={classes.boldText}>O/S Balance: </h5>
          </GridItem>
          <GridItem md={3}>
            <FastField
              name='outstandingBalance'
              render={(args) => <NumberInput {...amountProps} {...args} />}
            />
          </GridItem>
          <GridItem md={4} />
          <GridItem md={5}>
            <h5 className={classes.boldText}>&nbsp;</h5>
          </GridItem>
          <GridItem md={7}>
            <h5 className={classes.normalText}>&nbsp;</h5>
          </GridItem>
          <GridItem md={5}>
            <h5 className={classes.boldText}>&nbsp;</h5>
          </GridItem>
          <GridItem md={7}>
            <h5 className={classes.normalText}>&nbsp;</h5>
          </GridItem>
        </GridContainer>
      </GridContainer>
    </CardContainer>
  )
}

export default withStyles(styles, { name: 'InvoiceBanner' })(InvoiceBanner)
