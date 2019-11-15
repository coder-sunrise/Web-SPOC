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
import { smsStatus, messageStatus } from '@/utils/codes'

const styles = (theme) => ({
  checkbox: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
})

const FilterByPatient = ({ classes, setFieldValue }) => {
  return (
    <React.Fragment>
      <GridItem md={4}>
        <FastField
          name='patientName'
          render={(args) => (
            <TextField
              {...args}
              label='Patient Details (Patient Name, Acc No., Patient Ref. No., Contact No.)'
            />
          )}
        />
      </GridItem>
      {/* <GridItem md={4}>
        <FastField
          name='lastVisitDate'
          render={(args) => (
            <DateRangePicker
              {...args}
              label='Last Visit Date From'
              label2='To'
              onChange={(e) => {
                if (e.length === 0) setFieldValue('lastVisitDate', undefined)
              }}
            />
          )}
        />
      </GridItem> */}
      {/* <GridItem md={4} /> */}
      <GridItem md={2}>
        <FastField
          name='lastSMSSendStatus'
          render={(args) => (
            <Select {...args} label='SMS Status' options={smsStatus} />
          )}
        />
      </GridItem>
      <GridItem xs={4} className={classes.checkbox}>
        <FastField
          name='consent'
          render={(args) => <Checkbox label='PDPA Consent' {...args} />}
        />
      </GridItem>
      <GridItem md={6} />

      {/* <GridItem md={2}>
        <FastField
          name='messageStatus'
          render={(args) => (
            <Select {...args} label='Message Status' options={messageStatus} />
          )}
        />
      </GridItem> */}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'FilterByPatient' })(FilterByPatient)
