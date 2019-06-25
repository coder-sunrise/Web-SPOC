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

const RecurrenceWeekly = ({ values }) => {
  const { days: selectedDays = [] } = values

  const maxTagCount = selectedDays.length === 1 ? 1 : 0
  const everyDay = 'Every day'
  const maxTagPlaceholder =
    selectedDays.length === 7
      ? everyDay
      : `${selectedDays.length} days selected`

  return (
    <GridContainer item xs md={8}>
      <GridItem md={6}>
        <FastField
          name='every'
          render={(args) => (
            <NumberInput label='Every' suffix='week(s)' {...args} />
          )}
        />
      </GridItem>
      <GridItem md={6}>
        <FastField
          name='days'
          render={(args) => (
            <Select
              {...args}
              label='On'
              mode='multiple'
              options={days}
              maxTagCount={maxTagCount}
              maxTagPlaceholder={maxTagPlaceholder}
            />
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

export default RecurrenceWeekly
