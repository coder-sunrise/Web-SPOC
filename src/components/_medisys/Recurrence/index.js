import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
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
  FieldSet,
  NumberInput,
  DatePicker,
} from '@/components'
// sub components
import InputDaily from './InputDaily'
import InputWeekly from './InputWeekly'
import InputMonthly from './InputMonthly'
import ResultLabel from './ResultLabel'
// constants
import { RECURRENCE_PATTERN, RECURRENCE_RANGE } from './const.js'
// styles
import styles from './styles'

const labelSize = {
  sm: 1,
  md: 2,
  lg: 4,
}

const inputSize = {
  sm: 2,
  md: 3,
  lg: 4,
}

const RecurrenceDTO = {
  recurrencePatternFK: 1,
  recurrenceFrequency: 1,
  recurrenceDayOfTheMonth: 1,
  recurrenceDaysOfTheWeek: [],
  recurrenceRange: '',
  recurrenceCount: 1,
  recurrenceEndDate: undefined,
}

const Recurrence = ({
  classes,
  disabled = false,
  block = false,
  size = 'md',
  formValues,
  recurrenceDto = RecurrenceDTO,
  handleRecurrencePatternChange = (f) => f,
}) => {
  const { isEnableRecurrence, currentAppointment = {} } = formValues
  const { recurrencePatternFK, recurrenceRange } = recurrenceDto
  const { appointmentDate } = currentAppointment
  const _labelSize = labelSize[size]
  const blockSize = (12 - _labelSize) / 2
  const _inputSize = block ? blockSize : inputSize[size]
  return (
    <Fragment>
      <FastField
        name='isEnableRecurrence'
        render={(args) => {
          return (
            <Checkbox
              {...args}
              disabled={disabled}
              simple
              label='Enable Recurrence'
            />
          )
        }}
      />
      {isEnableRecurrence && (
        <FieldSet title='Recurrence' disabled={disabled}>
          <GridContainer item md={12}>
            <GridItem md={_labelSize} className={classes.inlineLabel}>
              <span>Recurrence Pattern</span>
            </GridItem>
            <GridItem xs md={_inputSize}>
              <FastField
                name='recurrenceDto.recurrencePatternFK'
                render={(args) => (
                  <CodeSelect
                    {...args}
                    disabled={disabled}
                    code='ltRecurrencePattern'
                    onChange={handleRecurrencePatternChange}
                  />
                )}
              />
            </GridItem>
            {recurrencePatternFK === RECURRENCE_PATTERN.DAILY && (
              <InputDaily
                disabled={disabled}
                labelSize={_labelSize}
                inputSize={_inputSize}
              />
            )}
            {recurrencePatternFK === RECURRENCE_PATTERN.WEEKLY && (
              <InputWeekly
                disabled={disabled}
                recurrenceDto={recurrenceDto}
                labelSize={_labelSize}
                inputSize={_inputSize}
              />
            )}

            {recurrencePatternFK === RECURRENCE_PATTERN.MONTHLY && (
              <InputMonthly
                disabled={disabled}
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
                  name='recurrenceDto.recurrenceRange'
                  render={(args) => (
                    <RadioGroup
                      // label='Range of Recurrence'
                      disabled={disabled}
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
                {recurrenceRange === RECURRENCE_RANGE.AFTER && (
                  <FastField
                    name='recurrenceDto.recurrenceCount'
                    render={(args) => (
                      <NumberInput
                        {...args}
                        min={1}
                        disabled={disabled}
                        suffix='occurences'
                      />
                    )}
                  />
                )}
                {recurrenceRange === RECURRENCE_RANGE.BY && (
                  <FastField
                    name='recurrenceDto.recurrenceEndDate'
                    render={(args) => (
                      <DatePicker disabled={disabled} {...args} />
                    )}
                  />
                )}
              </GridItem>
            </GridContainer>
            <GridContainer item md={12}>
              <GridItem md={_labelSize} className={classes.recurrenceListLabel}>
                <span>Recurrence</span>
              </GridItem>
              <GridItem className={classes.recurrenceListLabel}>
                {isEnableRecurrence && (
                  <ResultLabel
                    date={appointmentDate}
                    recurrenceDto={recurrenceDto}
                  />
                )}
              </GridItem>
            </GridContainer>
          </GridContainer>
        </FieldSet>
      )}
    </Fragment>
  )
}

Recurrence.propTypes = {
  formValues: PropTypes.object,
  size: PropTypes.oneOf([
    'sm',
    'md',
    'lg',
  ]),
}

export default withStyles(styles, { name: 'RecurrenceComponent' })(Recurrence)
