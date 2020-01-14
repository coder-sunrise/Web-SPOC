import React from 'react'
// formik
import { FastField } from 'formik'
// custom component
import {
  GridContainer,
  GridItem,
  DatePicker,
  TextField,
  CodeSelect,
} from '@/components'

const AppointmentDate = ({ disabled }) => (
  <React.Fragment>
    <GridItem xs md={3} />
    <GridItem xs md={3}>
      <FastField
        name='currentAppointment.appointmentDate'
        // validate={this.startDateValidation}
        render={(args) => (
          <DatePicker
            {...args}
            disabled={disabled}
            allowClear={false}
            label='Appointment Date'
          />
        )}
      />
    </GridItem>

    <GridItem xs md={3}>
      <FastField
        name='appointmentStatusFk'
        render={(args) => (
          <CodeSelect
            {...args}
            disabled
            code='ltappointmentstatus'
            label='Appointment Status'
          />
        )}
      />
    </GridItem>

    <GridItem xs md={3}>
      <FastField
        name='bookedByUser'
        render={(args) => <TextField label='Booked By' disabled {...args} />}
      />
    </GridItem>
  </React.Fragment>
)

export default AppointmentDate
