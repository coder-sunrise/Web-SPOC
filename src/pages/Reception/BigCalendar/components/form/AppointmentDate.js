import React from 'react'
// formik
import { FastField } from 'formik'
// custom component
import { GridContainer, GridItem, DatePicker, TextField } from '@/components'

const _dateFormat = 'DD MMM YYYY'

const AppointmentDate = () => (
  <GridContainer item xs md={12}>
    <GridItem xs md={6}>
      <FastField
        name='startDate'
        // validate={this.startDateValidation}
        render={(args) => (
          <DatePicker
            label='Appointment Date'
            {...args}
            allowClear={false}
            format={_dateFormat}
          />
        )}
      />
    </GridItem>
    <GridItem xs md={6}>
      <FastField
        name='bookedBy'
        render={(args) => (
          <TextField
            label='Booked By'
            disabled
            {...args}
            options={[]}
            format={_dateFormat}
          />
        )}
      />
    </GridItem>
  </GridContainer>
)

export default AppointmentDate
