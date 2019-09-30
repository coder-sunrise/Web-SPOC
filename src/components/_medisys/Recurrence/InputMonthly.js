import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput } from '@/components'
// styles
import styles from './styles'

const RecurrenceMonthly = ({ classes, disabled, labelSize, inputSize }) => {
  return (
    <GridContainer item xs md={12}>
      <GridItem md={labelSize} className={classes.inlineLabel}>
        <span>Day</span>
      </GridItem>
      <GridItem md={inputSize}>
        <FastField
          name='recurrenceDto.recurrenceDayOfTheMonth'
          render={(args) => <NumberInput disabled={disabled} {...args} />}
        />
      </GridItem>
      <GridItem md={inputSize}>
        <FastField
          name='recurrenceDto.recurrenceFrequency'
          render={(args) => (
            <NumberInput
              {...args}
              min={1}
              disabled={disabled}
              prefix='of every: '
              suffix='month(s)'
            />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'RecurrenceMonthly' })(
  RecurrenceMonthly,
)
