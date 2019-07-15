import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  Checkbox,
  GridContainer,
  GridItem,
  Select,
  CommonCard,
} from '@/components'
// sub component
import RecurrenceDailyInput from './RecurrenceDaily'
import RecurrenceWeeklyInput from './RecurrenceWeekly'
import RecurrenceMonthlyInput from './RecurrenceMonthly'
import RecurrenceList from './RecurrenceList'
import { recurrencePattern, RECURRENCE_PATTERN } from './variables'
import styles from './style'

const Recurrence = ({ classes, values, isDoctorBlock }) => {
  return (
    <CommonCard size='sm' title='Recurrence'>
      <GridContainer item md={12}>
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
            <h5>Recurrence: </h5>
          </GridItem>
          <GridItem>
            <RecurrenceList values={values} isDoctorBlock={isDoctorBlock} />
          </GridItem>
        </React.Fragment>
      </GridContainer>
      <GridItem xs md={12} className={classes.enableOccurenceCheckbox}>
        <FastField
          name='updateAllMatches'
          render={(args) => {
            return (
              <Checkbox
                simple
                label='Update all appointments match the series'
                {...args}
              />
            )
          }}
        />
      </GridItem>
    </CommonCard>
  )
}

export default withStyles(styles, { name: 'Recurrence' })(Recurrence)
