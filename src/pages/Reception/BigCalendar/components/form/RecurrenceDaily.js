import React from 'react'
// formik
import { FastField } from 'formik'
// material ui
import { withStyles } from '@material-ui/core'
// common component
import { GridContainer, GridItem, NumberInput } from '@/components'
import styles from './style'

const RecurrenceDaily = ({ classes, labelSize, inputSize }) => {
  return (
    <GridContainer item xs md={12}>
      <GridItem md={labelSize} className={classes.inlineLabel}>
        <span>Every</span>
      </GridItem>
      <GridItem md={inputSize}>
        <FastField
          name='recurrenceFrequency'
          render={(args) => <NumberInput {...args} suffix='day(s)' />}
        />
      </GridItem>
    </GridContainer>
  )
}

export default withStyles(styles, { name: 'RecurrenceDaily' })(RecurrenceDaily)
