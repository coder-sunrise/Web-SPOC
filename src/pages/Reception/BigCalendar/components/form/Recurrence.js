import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import {
  CodeSelect,
  Checkbox,
  GridContainer,
  GridItem,
  RadioGroup,
  CommonCard,
  NumberInput,
  DatePicker,
} from '@/components'
// sub component
import RecurrenceDailyInput from './RecurrenceDaily'
import RecurrenceWeeklyInput from './RecurrenceWeekly'
import RecurrenceMonthlyInput from './RecurrenceMonthly'
import RecurrenceList from './RecurrenceList'
import {
  recurrencePattern,
  RECURRENCE_PATTERN,
  RECURRENCE_RANGE,
} from './variables'

import styles from './style'

const Recurrence = ({ classes, values, isDoctorBlock }) => {
  const labelSize = isDoctorBlock ? 4 : 2
  const inputSize = isDoctorBlock ? 4 : 3

  return (
    <CommonCard size='sm' title='Recurrence'>
      <GridContainer item md={12}>
        <GridItem xs md={12} className={classes.enableOccurenceCheckbox}>
          <FastField
            name='isEnableRecurrence'
            render={(args) => {
              return <Checkbox simple label='Enable Recurrence' {...args} />
            }}
          />
        </GridItem>

        {values.isEnableRecurrence && (
          <React.Fragment>
            <GridItem md={labelSize} className={classes.inlineLabel}>
              <span>Recurrence Pattern</span>
            </GridItem>
            <GridItem xs md={inputSize}>
              <FastField
                name='recurrenceDto.recurrencePatternFK'
                render={(args) => (
                  <CodeSelect {...args} code='ltRecurrencePattern' />
                )}
              />
            </GridItem>

            {values.recurrencePatternFK === RECURRENCE_PATTERN.DAILY && (
              <RecurrenceDailyInput
                values={values}
                labelSize={labelSize}
                inputSize={inputSize}
              />
            )}
            {values.recurrencePatternFK === RECURRENCE_PATTERN.WEEKLY && (
              <RecurrenceWeeklyInput
                values={values}
                labelSize={labelSize}
                inputSize={inputSize}
              />
            )}
            {values.recurrencePatternFK === RECURRENCE_PATTERN.MONTHLY && (
              <RecurrenceMonthlyInput
                values={values}
                labelSize={labelSize}
                inputSize={inputSize}
              />
            )}
            <GridItem md={labelSize} className={classes.inlineLabel}>
              <span>Range of Recurrence</span>
            </GridItem>
            <GridContainer item md={6}>
              <GridItem md={12}>
                <FastField
                  name='recurrenceRange'
                  render={(args) => (
                    <RadioGroup
                      // label='Range of Recurrence'
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
              <GridItem md={inputSize * 2}>
                {values.recurrenceRange === RECURRENCE_RANGE.AFTER && (
                  <FastField
                    name='recurrenceDto.recurrenceCount'
                    render={(args) => (
                      <NumberInput {...args} suffix='occurences' />
                    )}
                  />
                )}
                {values.recurrenceRange === RECURRENCE_RANGE.BY && (
                  <FastField
                    name='recurrenceDto.recurrenceEndDate'
                    render={(args) => <DatePicker {...args} />}
                  />
                )}
              </GridItem>
            </GridContainer>
            <GridContainer item md={12}>
              <GridItem md={labelSize} className={classes.recurrenceListLabel}>
                <span>Recurrence</span>
              </GridItem>
              <GridItem className={classes.recurrenceListLabel}>
                {values.isEnableRecurrence && (
                  <RecurrenceList
                    values={values}
                    isDoctorBlock={isDoctorBlock}
                    // className={classes.recurrenceListLabel}
                  />
                )}
              </GridItem>
            </GridContainer>
          </React.Fragment>
        )}
      </GridContainer>
    </CommonCard>
  )
}

export default withStyles(styles, { name: 'Recurrence' })(Recurrence)
