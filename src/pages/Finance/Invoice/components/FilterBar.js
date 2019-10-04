import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  DateRangePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  TextField,
  Select,
} from '@/components'
import { osBalanceStatus } from '@/utils/codes'

const FilterBar = ({ classes, dispatch, values }) => {
  return (
    <SizeContainer>
      <React.Fragment>
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='invoiceNo'
              render={(args) => <TextField label='Invoice No' {...args} />}
            />
          </GridItem>
          <GridItem xs={6} md={6}>
            <FastField
              name='invoiceDates'
              render={(args) => {
                return (
                  <DateRangePicker
                    label='Invoice Date From'
                    label2='Invoice Date To'
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='osBalanceStatus'
              render={(args) => {
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
        <GridContainer>
          <GridItem xs={6} md={3}>
            <FastField
              name='patientAccountNo'
              render={(args) => (
                <TextField label='Patient Acc. No.' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='patientName'
              render={(args) => <TextField label='Patient Name' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <div className={classes.searchButton}>
          <Button
            color='primary'
            onClick={() => {
              const {
                invoiceNo,
                patientName,
                patientAccountNo,
                // invoiceDates,
              } = values
              dispatch({
                type: 'invoiceList/query',
                payload: {
                  invoiceNo,
                  patientName,
                  patientAccountNo,
                  // invoiceDateFrom: invoiceDates[0],
                  // invoiceDateTo: invoiceDates[1],
                },
              })
            }}
          >
            Search
          </Button>
          {/* <i>Double click on record to view invoice</i> */}
        </div>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
