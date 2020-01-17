import React from 'react'
// formik
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const styles = (theme) => ({
  generateBtn: {
    marginBottom: theme.spacing(1),
  },
})

const FilterBar = ({ classes, handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker />

          <GridItem>
            <FastField
              name='asAt'
              render={(args) => <Checkbox {...args} label='As At' />}
            />
          </GridItem>
          <GridItem md={2} className={classes.generateBtn}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles(styles, { name: 'SalesSummaryFilterBar' })(FilterBar)
