import React from 'react'
// formik
import { FastField } from 'formik'
// custom component
import {
  dateFormat,
  GridContainer,
  GridItem,
  DatePicker,
  TextField,
} from '@/components'

const AppointmentDate = () => (
  <GridContainer item xs md={12}>
    <GridItem xs md={6}>
      <FastField
        name='currentAppointment.appointmentDate'
        // validate={this.startDateValidation}
        render={(args) => (
          <DatePicker
            disabled
            format={dateFormat}
            allowClear={false}
            label='Appointment Date'
            {...args}
          />
        )}
      />
    </GridItem>
    <GridItem xs md={6}>
      <FastField
        name='bookedByUser'
        render={(args) => <TextField label='Booked By' disabled {...args} />}
      />
    </GridItem>
  </GridContainer>
)

export default AppointmentDate
