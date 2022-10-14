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
  Tooltip,
} from '@/components'
import { APPOINTMENT_STATUSOPTIONS } from '@/utils/constants'
import _ from 'lodash'

const AppointmentDate = ({
  values,
  patientProfile,
  disabled,
  getClinicoperationhour,
}) => {
  const status = APPOINTMENT_STATUSOPTIONS.find(
    x => x.id === values.appointmentStatusFk,
  )
  var patientCopayers = patientProfile?.patientScheme
    ?.filter(x => !x.isExpired && x.isSchemeActive && x.isCopayerActive)
    ?.map(x => x.copayerFK)

  return (
    <React.Fragment>
      <GridItem xs md={2}>
        <Field
          name='currentAppointment.appointmentDate'
          render={args => (
            <DatePicker
              {...args}
              disabled={disabled}
              allowClear={false}
              label='Appointment Date'
              onChange={getClinicoperationhour}
            />
          )}
        />
      </GridItem>

      <GridItem xs md={3}>
        <TextField
          label='Appointment Status'
          value={status?.name || ''}
          disabled
        />
      </GridItem>

      <GridItem xs md={3}>
        <FastField
          name='bookedByUser'
          render={args => <TextField label='Booked By' disabled {...args} />}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default AppointmentDate
