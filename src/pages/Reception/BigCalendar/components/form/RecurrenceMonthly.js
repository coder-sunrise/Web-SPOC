import React from 'react'
// formik
import { FastField } from 'formik'
// common component
import {
  DatePicker,
  GridContainer,
  GridItem,
  NumberInput,
  RadioGroup,
  Select,
} from '@/components'
import { RECURRENCE_RANGE, days } from './variables'

const RecurrenceMonthly = ({ values }) => {
  return (
    <GridContainer item xs md={8}>
      <GridItem md={6}>
        <FastField
          name='day'
          render={(args) => <NumberInput label='Day' {...args} />}
        />
      </GridItem>
      <GridItem md={6}>
        <FastField
          name='every'
          render={(args) => (
            <NumberInput {...args} label='Of Every' suffix='month(s)' />
          )}
        />
      </GridItem>
      <GridItem md={6}>
        <FastField
          name='recurrenceRange'
          render={(args) => (
            <RadioGroup
              label='Range of Recurrence'
              textField='name'
              options={[
                {
                  value: RECURRENCE_RANGE.AFTER,
                  name: 'End After',
                },
                {
                  value: RECURRENCE_RANGE.BY,
                  name: 'End By',
                },
              ]}
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={6}>
        {values.recurrenceRange === RECURRENCE_RANGE.AFTER && (
          <FastField
            name='occurence'
            render={(args) => <NumberInput {...args} label='Occurence' />}
          />
        )}
        {values.recurrenceRange === RECURRENCE_RANGE.BY && (
          <FastField
            name='stopDate'
            render={(args) => <DatePicker {...args} label='Stop Date' />}
          />
        )}
      </GridItem>
    </GridContainer>
  )
}

export default RecurrenceMonthly
