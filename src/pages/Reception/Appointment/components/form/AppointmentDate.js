import React from 'react'
// formik
import { FastField, Field } from 'formik'
// custom component
import {
  GridContainer,
  GridItem,
  DatePicker,
  TextField,
  CodeSelect,
} from '@/components'
import { APPOINTMENT_STATUSOPTIONS } from '@/utils/constants'

const AppointmentDate = ({ values, disabled, visitOrderTemplateOptions }) => {
  const status = APPOINTMENT_STATUSOPTIONS.find(
    x => x.id === values.appointmentStatusFk,
  )
  return (
    <React.Fragment>
      <GridItem xs md={2}>
        <Field
          name='currentAppointment.appointmentDate'
          // validate={this.startDateValidation}
          render={args => (
            <DatePicker
              {...args}
              disabled={disabled}
              allowClear={false}
              label='Appointment Date'
            />
          )}
        />
      </GridItem>

      <GridItem xs md={2}>
        <TextField
          label='Appointment Status'
          value={status?.name || ''}
          disabled
        />
      </GridItem>

      <GridItem xs md={2}>
        <FastField
          name='bookedByUser'
          render={args => <TextField label='Booked By' disabled {...args} />}
        />
      </GridItem>

      <GridItem xs md={6}>
        <Field
          name='currentAppointment.visitOrderTemplateFK'
          render={args => (
            <CodeSelect
              {...args}
              label='Visit Purpose'
              options={visitOrderTemplateOptions}
              disabled={disabled}
            />
          )}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default AppointmentDate
