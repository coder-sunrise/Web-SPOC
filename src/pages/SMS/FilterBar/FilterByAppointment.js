import React from 'react'
import { formatMessage } from 'umi/locale'
// formik
import { FastField } from 'formik'
// common components
import { Checkbox, GridItem, DatePicker, Select } from '@/components'

const FilterByAppointment = () => {
  return (
    <React.Fragment>
      <GridItem xs={2}>
        <FastField
          name='Start'
          render={(args) => (
            <DatePicker
              label={formatMessage({ id: 'sms.from' })}
              timeFormat={false}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem xs={2}>
        <FastField
          name='End'
          render={(args) => (
            <DatePicker
              label={formatMessage({ id: 'sms.to' })}
              timeFormat={false}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem xs={4} />
      <GridItem xs={4} />
      <GridItem xs={4}>
        <FastField
          name='Doctor'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.doctor',
                })}
                options={[
                  {
                    name: 'Dr Levine',
                    value: 'Dr Levine',
                  },
                  {
                    name: 'Dr Heloo',
                    value: 'Dr Heloo',
                  },
                ]}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={4}>
        <FastField
          name='AppointmentStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.appointment.status',
                })}
                options={[
                  {
                    name: 'Confirmed',
                    value: 'Confirmed',
                  },
                  {
                    name: 'Unknown',
                    value: 'Unknown',
                  },
                ]}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={4}>
        <FastField
          name='ExcludeSent'
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
      <GridItem xs={4}>
        <FastField
          name='SMSStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.status',
                })}
                options={[
                  {
                    name: 'Sent',
                    value: 'Sent',
                  },
                  {
                    name: 'Pending',
                    value: 'Pending',
                  },
                ]}
                {...args}
              />
            )
          }}
        />
      </GridItem>
      <GridItem xs={4}>
        <FastField
          name='MessageStatus'
          render={(args) => {
            return (
              <Select
                label={formatMessage({
                  id: 'sms.message.status',
                })}
                options={[
                  {
                    name: 'Read',
                    value: 'Read',
                  },
                  {
                    name: 'Unread',
                    value: 'Unread',
                  },
                ]}
                {...args}
              />
            )
          }}
        />
      </GridItem>
    </React.Fragment>
  )
}

export default FilterByAppointment
