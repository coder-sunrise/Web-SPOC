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
  Tooltip,
} from '@/components'
import STYLES from '../styles'

const FilterBar = ({ classes }) => {
  return (
    <SizeContainer>
      <React.Fragment>
        <GridContainer>
          <GridItem md={2}>
            <FastField
              name='invoiceNo'
              render={(args) => <TextField label='Invoice No' {...args} />}
            />
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='invoiceDate'
              render={(args) => (
                <DateRangePicker label='Invoice Date' {...args} />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='outstandingBalance'
              render={(args) => <TextField label='O/S Balance' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem md={2}>
            <FastField
              name='patientID'
              render={(args) => <TextField label='Patient ID' {...args} />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='patientName'
              render={(args) => <TextField label='Patient Name' {...args} />}
            />
          </GridItem>
        </GridContainer>
        <div className={classes.searchButton}>
          <Button color='primary'>Search</Button>
          <i>Double click on record to view invoice</i>
        </div>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles(STYLES, { name: 'InvoiceFilterBar' })(FilterBar)
