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
} from '@/components'

const FilterBar = ({ classes, dispatch }) => {
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
          <GridItem xs={6} md={3}>
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
          </GridItem>
          <GridItem xs={6} md={3}>
            <FastField
              name='pataientOutstanding'
              render={(args) => <TextField label='O/S Balance' {...args} />}
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
              dispatch({
                type: 'invoiceList/query',
                payload: {
                  // [`${prefix}patientReferenceNo`]: search,
                  // [`${prefix}name`]: search,
                  // [`${prefix}patientAccountNo`]: search,
                  // [`${prefix}contactFkNavigation.contactNumber.number`]: search,
                  // combineCondition: 'or',
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
