import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput, Select } from '@/components'
// constants
import { WeekDays } from './const'
// styles
import styles from './styles'

const InputWeekly = ({
  classes,
  disabled,
  recurrenceDto,
  labelSize,
  inputSize,
}) => {
  const { recurrenceDaysOfTheWeek: selectedDays = [] } = recurrenceDto

  const maxTagCount = selectedDays.length === 1 ? 1 : 0

  return (
    <GridContainer item xs md={12}>
      <GridItem md={labelSize} className={classes.inlineLabel}>
        <span>Every</span>
      </GridItem>
      <GridItem md={inputSize}>
        <FastField
          name='recurrenceDto.recurrenceFrequency'
          render={(args) => (
            <NumberInput
              disabled={disabled}
              min={1}
              precision={0}
              suffix='week(s)'
              {...args}
            />
          )}
        />
      </GridItem>
      <GridItem md={inputSize}>
        <FastField
          name='recurrenceDto.recurrenceDaysOfTheWeek'
          render={(args) => (
            <Select
              {...args}
              disabled={disabled}
              prefix='On'
              mode='multiple'
              options={WeekDays}
              maxTagCount={maxTagCount}
              maxTagPlaceholder='days'
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'InputWeekly' })(InputWeekly)
