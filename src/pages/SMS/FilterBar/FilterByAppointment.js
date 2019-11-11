import React from 'react'
import { formatMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import {
  Checkbox,
  GridItem,
  Select,
  CodeSelect,
  DateRangePicker,
  Field,
} from '@/components'
// medisys component
import { AppointmentTypeLabel, DoctorLabel } from '@/components/_medisys'
import { smsStatus, messageStatus, appointmentStatus } from '@/utils/codes'

const styles = (theme) => ({
  checkbox: {
    paddingTop: `${theme.spacing(2)}px !important`,
  },
})
const FilterByAppointment = ({ classes, values, setFieldValue }) => {
  const { appointmentType } = values
  return (
    <React.Fragment>
      <GridItem md={4}>
        <Field
          name='upcomingAppointmentDate'
          render={(args) => (
            <DateRangePicker
              {...args}
              label='Upcoming Appointment From'
              label2='To'
              onChange={(e) => {
                if (e.length === 0)
                  setFieldValue('upcomingAppointmentDate', undefined)
              }}
            />
          )}
        />
      </GridItem>
      <GridItem xs={4}>
        <FastField
          name='appointmentType'
          render={(args) => {
            return (
              <CodeSelect
                {...args}
                mode='multiple'
                all={-99}
                label='Filter by Appointment Type'
                code='ctappointmenttype'
                labelField='displayValue'
                renderDropdown={(option) => (
                  <AppointmentTypeLabel
                    color={option.tagColorHex}
                    label={option.displayValue}
                  />
                )}
                defaultOptions={[
                  {
                    isExtra: true,
                    id: -99,
                    displayValue: 'All appointment types',
                  },
                ]}
                maxTagCount={appointmentType.length <= 1 ? 1 : 0}
                maxTagPlaceholder='appointment types'
              />
            )
          }}
        />
      </GridItem>

      <GridItem xs={4}>
        <FastField
          name='doctor'
          render={(args) => {
            return (
              <CodeSelect
                label={formatMessage({
                  id: 'sms.doctor',
                })}
                code='doctorProfile'
                labelField='clinicianProfile.name'
                valueField='clinicianProfile.id'
                renderDropdown={(option) => <DoctorLabel doctor={option} />}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={2}>
        <FastField
          name='appointmentStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.appointment.status',
                })}
                options={appointmentStatus}
                {...args}
              />
            )
          }}
        />
      </GridItem>

      <GridItem xs={4} className={classes.checkbox}>
        <FastField
          name='isReminderSent'
          render={(args) => (
            <Checkbox
              simple
              label={formatMessage({
                id: 'sms.appointment.exclude',
              })}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={6} />
      <GridItem xs={2}>
        <FastField
          name='lastSMSSendStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.status',
                })}
                options={smsStatus}
                {...args}
              />
            )
          }}
        />
      </GridItem>

      {/* <GridItem xs={2}>
        <FastField
          name='MessageStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.message.status',
                })}
                options={messageStatus}
                {...args}
              />
            )
          }}
        />
      </GridItem> */}
    </React.Fragment>
  )
}

export default withStyles(styles, { name: 'FilterByAppointment' })(
  FilterByAppointment,
)
