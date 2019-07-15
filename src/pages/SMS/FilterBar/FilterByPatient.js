import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  DateRangePicker,
  Checkbox,
  GridItem,
  TextField,
  Select,
} from '@/components'

const styles = (theme) => ({
  checkbox: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
})

const FilterByPatient = ({ classes }) => {
  return (
    <React.Fragment>
      <GridItem md={4}>
        <FastField
          name='patientName'
          render={(args) => <TextField {...args} label='Patient Details' />}
        />
      </GridItem>
      <GridItem md={4}>
        <FastField
          name='visitDate'
          render={(args) => <DateRangePicker {...args} label='Visit Date' />}
        />
      </GridItem>
      <GridItem md={4} />
      <GridItem md={2}>
        <FastField
          name='status'
          render={(args) => (
            <Select
              {...args}
              label='SMS Status'
              options={[
                { name: 'Sent', value: 'sent' },
                { name: 'Received', value: 'received' },
              ]}
            />
          )}
        />
      </GridItem>
      <GridItem xs={4} className={classes.checkbox}>
        <FastField
          name='consent'
          render={(args) => <Checkbox simple label='PDPA Consent' {...args} />}
        />
      </GridItem>
      <GridItem md={6} />

      <GridItem md={2}>
        <FastField
          name='messageStatus'
          render={(args) => (
            <Select
              {...args}
              label='Message Status'
              options={[
                { name: 'Sent', value: 'sent' },
                { name: 'Received', value: 'received' },
              ]}
            />
          )}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'FilterByPatient' })(FilterByPatient)
