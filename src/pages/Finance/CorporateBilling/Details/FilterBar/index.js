import React from 'react'
// formik
import { FastField, Field, withFormik } from 'formik'
import { withStyles } from '@material-ui/core'
import { FormattedMessage } from 'umi'
import Search from '@material-ui/icons/Search'
// common components
import {
  Button,
  ProgressButton,
  GridContainer,
  GridItem,
  SizeContainer,
  TextField,
  Select,
} from '@/components'
import { FilterBarDate } from '@/components/_medisys'
import { osBalanceStatus } from '@/utils/codes'

const FilterBar = ({ classes, values, searchInvoice }) => {

  const { invoiceStartDate, invoiceEndDate } = values.filterValues

  return (
    <SizeContainer>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='filterValues.invoiceNo'
              render={args => <TextField label='Invoice No' {...args} />}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='filterValues.invoiceStartDate'
              render={args => (
                <FilterBarDate
                  args={args}
                  label='Invoice Date From'
                  formValues={{
                    startDate: invoiceStartDate,
                    endDate: invoiceEndDate,
                  }}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Field
              name='filterValues.invoiceEndDate'
              render={args => (
                <FilterBarDate
                  args={args}
                  label='Invoice Date To'
                  isEndDate
                  formValues={{
                    startDate: invoiceStartDate,
                    endDate: invoiceEndDate,
                  }}
                />
              )}
            />
          </GridItem>
        </GridContainer>

        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='filterValues.patientAccountNo'
              render={args => <TextField label='Patient Acc. No.' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='filterValues.patientName'
              render={args => <TextField label='Patient Name' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='filterValues.outstandingBalanceStatus'
              render={args => {
                return (
                  <Select
                    label='O/S Balance'
                    options={osBalanceStatus}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
        </GridContainer>

        <div
          className={classes.searchButton}
          style={{ marginTop: 10, marginLeft: 8 }}
        >
          <ProgressButton
            color='primary'
            icon={<Search />}
            onClick={searchInvoice}
          >
            <FormattedMessage id='form.search' />
          </ProgressButton>
        </div>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles({ withTheme: true })(FilterBar)
