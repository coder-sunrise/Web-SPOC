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
  RadioGroup,
  FieldSet,
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

const Recurrence = ({
  classes,
  values = {},
  isDoctorBlock,
  labelSize = 2,
  inputSize = 3,
}) => {
  const _labelSize = isDoctorBlock ? 4 : labelSize
  const _inputSize = isDoctorBlock ? 4 : inputSize

  return (
    <div>
      <FastField
        name='enableRecurrence'
        render={(args) => {
          return <Checkbox simple label='Enable Recurrence' {...args} />
        }}
      />
      {values.enableRecurrence && (
        <FieldSet size='sm' title='Recurrence'>
          <GridContainer item md={12}>
            <GridItem md={_labelSize} className={classes.inlineLabel}>
              <span>Recurrence Pattern</span>
            </GridItem>
            <GridItem xs md={_inputSize}>
              <FastField
                name='recurrencePattern'
                render={(args) => (
                  <Select {...args} options={recurrencePattern} />
                )}
              />
            </GridItem>

            {values.recurrencePattern === RECURRENCE_PATTERN.DAILY && (
              <RecurrenceDailyInput
                values={values}
                labelSize={_labelSize}
                inputSize={_inputSize}
              />
            )}
            {values.recurrencePattern === RECURRENCE_PATTERN.WEEKLY && (
              <RecurrenceWeeklyInput
                values={values}
                labelSize={_labelSize}
                inputSize={_inputSize}
              />
            )}
            {values.recurrencePattern === RECURRENCE_PATTERN.MONTHLY && (
              <RecurrenceMonthlyInput
                values={values}
                labelSize={_labelSize}
                inputSize={_inputSize}
              />
            )}
            <GridItem md={_labelSize} className={classes.inlineLabel}>
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
              <GridItem md={_inputSize * 2}>
                {values.recurrenceRange === RECURRENCE_RANGE.AFTER && (
                  <FastField
                    name='occurence'
                    render={(args) => (
                      <NumberInput {...args} suffix='occurences' />
                    )}
                  />
                )}
                {values.recurrenceRange === RECURRENCE_RANGE.BY && (
                  <FastField
                    name='stopDate'
                    render={(args) => <DatePicker {...args} />}
                  />
                )}
              </GridItem>
            </GridContainer>
            <GridContainer item md={12}>
              <GridItem md={_labelSize} className={classes.recurrenceListLabel}>
                <span>Recurrence</span>
              </GridItem>
              <GridItem className={classes.recurrenceListLabel}>
                {values.enableRecurrence && (
                  <RecurrenceList
                    values={values}
                    isDoctorBlock={isDoctorBlock}
                    // className={classes.recurrenceListLabel}
                  />
                )}
              </GridItem>
            </GridContainer>
          </GridContainer>
        </FieldSet>
      )}
    </div>
  )
}

export default withStyles(styles, { name: 'Recurrence' })(Recurrence)
