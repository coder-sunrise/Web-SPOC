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

const AppointmentDate = ({
  disabled,
  visitOrderTemplateOptions,
  patientProfileFK,
}) => {
  const isRegisteredPatient =
    patientProfileFK !== undefined && patientProfileFK !== null
  return (
    <React.Fragment>
      {!isRegisteredPatient && <GridItem xs md={3} />}
      <GridItem xs md={3}>
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

      <GridItem xs md={3}>
        <FastField
          name='appointmentStatusFk'
          render={args => (
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
          render={args => <TextField label='Booked By' disabled {...args} />}
        />
      </GridItem>

      <GridItem xs md={3}>
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
