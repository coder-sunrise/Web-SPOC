import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Info from '@material-ui/icons/InfoOutlined'
// common components
import {
  Button,
  DateRangePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  TextField,
  DatePicker,
  Tooltip,
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
          {/* <GridItem xs={6} md={3}>
          

            <FastField
              name='invoiceDateFrom'
              render={(args) => (
                <DatePicker label='Invoice Date From' {...args} />
              )}
            />
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='invoiceDateTo'
              render={(args) => (
                <DatePicker label='Invoice Date To' {...args} />
              )}
            />
          </GridItem> */}
          <GridItem xs={6} md={3}>
            {/* <FastField
              name='pataientOutstanding'
              render={(args) => <TextField label='O/S Balance' {...args} />}
            /> */}
            <FastField
              name='favouriteSupplierFK'
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
                pataientOutstanding,
                invoiceDates,
              } = values
              dispatch({
                type: 'invoiceList/query',
                payload: {
                  // [`${prefix}patientReferenceNo`]: search,
                  // [`${prefix}name`]: search,
                  // [`${prefix}patientAccountNo`]: search,
                  // [`${prefix}contactFkNavigation.contactNumber.number`]: search,
                  // combineCondition: 'or',
                  invoiceNo,
                  patientName,
                  patientAccountNo,
                  pataientOutstanding,
                  invoiceDateFrom: invoiceDates[0],
                  invoiceDateTo: invoiceDates[1],
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
