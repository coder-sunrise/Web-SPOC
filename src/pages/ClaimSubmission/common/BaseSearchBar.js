import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
import Search from '@material-ui/icons/Search'
// common components
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  TextField,
} from '@/components'

const styles = (theme) => ({
  searchButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
})

const BaseSearchBar = ({ classes, children, hideInvoiceDate }) => {
  return (
    <React.Fragment>
      <GridContainer>
        <GridItem container md={8}>
          <GridItem md={6}>
            <FastField
              name='patientName'
              render={(args) => <TextField {...args} label='Patient Name' />}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='patientAccNo'
              render={(args) => <TextField {...args} label='Ref. No/Acc. No' />}
            />
          </GridItem>
          <GridItem md={6}>
            <FastField
              name='invoiceNo'
              render={(args) => <TextField {...args} label='Invoice No.' />}
            />
          </GridItem>
          <GridItem md={6}>
            {!hideInvoiceDate && (
              <FastField
                name='invoiceDate'
                render={(args) => <DatePicker {...args} label='Invoice Date' />}
              />
            )}
          </GridItem>
          <GridItem md={6} className={classes.searchButton}>
            <Button color='primary' size='sm'>
              <Search />Search
            </Button>
          </GridItem>
        </GridItem>
        <GridItem container md={4}>
          {children}
        </GridItem>
      </GridContainer>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'BaseSearchBar' })(
  React.memo(BaseSearchBar),
)
