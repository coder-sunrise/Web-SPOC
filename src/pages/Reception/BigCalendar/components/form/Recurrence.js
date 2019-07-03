import React from 'react'
// formik
import { FastField } from 'formik'
// common component
import { GridContainer, GridItem, Select } from '@/components'
// sub component
import RecurrenceDailyInput from './RecurrenceDaily'
import RecurrenceWeeklyInput from './RecurrenceWeekly'
import RecurrenceMonthlyInput from './RecurrenceMonthly'
import RecurrenceList from './RecurrenceList'
import { recurrencePattern, RECURRENCE_PATTERN } from './variables'

const Recurrence = ({ values }) => {
  return (
    <GridContainer item md={12}>
      {values.enableRecurrence && (
        <React.Fragment>
          <GridItem xs md={4}>
            <FastField
              name='recurrencePattern'
              render={(args) => (
                <Select
                  {...args}
                  options={recurrencePattern}
                  label='Recurrence Pattern'
                />
              )}
            />
          </GridItem>
          {values.recurrencePattern === RECURRENCE_PATTERN.DAILY && (
            <RecurrenceDailyInput values={values} />
          )}
          {values.recurrencePattern === RECURRENCE_PATTERN.WEEKLY && (
            <RecurrenceWeeklyInput values={values} />
          )}
          {values.recurrencePattern === RECURRENCE_PATTERN.MONTHLY && (
            <RecurrenceMonthlyInput values={values} />
          )}
          <GridItem>
            <h5>Recurrence List</h5>
          </GridItem>
          <GridItem>
            <RecurrenceList values={values} />
          </GridItem>
        </React.Fragment>
      )}
    </GridContainer>
  )
}

export default Recurrence
