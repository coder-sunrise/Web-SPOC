import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput } from '@/components'
import styles from './style'

const RecurrenceMonthly = ({ classes, labelSize, inputSize }) => {
  return (
    <GridContainer item xs md={12}>
      <GridItem md={labelSize} className={classes.inlineLabel}>
        <span>Day</span>
      </GridItem>
      <GridItem md={inputSize}>
        <FastField name='day' render={(args) => <NumberInput {...args} />} />
      </GridItem>
      <GridItem md={inputSize}>
        <FastField
          name='every'
          render={(args) => (
            <NumberInput {...args} prefix='of every: ' suffix='month(s)' />
          )}
        />
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'RecurrenceMonthly' })(
  RecurrenceMonthly,
)
