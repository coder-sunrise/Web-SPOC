import React from 'react'
// formik
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
// common components
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  RadioGroup,
} from '@/components'
import { DiagnosisSelect } from '@/components/_medisys'
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
          <ReportDateRangePicker
            fromDateFieldName='listingFrom'
            toDateFieldName='listingTo'
          />

          <GridItem md={2}>
            <FastField
              name='viewBy'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='View By'
                  options={[
                    {
                      value: 'Monthly',
                      label: 'Monthly',
                    },
                    {
                      value: 'Weekly',
                      label: 'Weekly',
                    },
                  ]}
                />
              )}
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
          <GridItem md={4} />
          <GridItem md={4}>
            <FastField
              name='diagnosisIds'
              render={(args) => <DiagnosisSelect {...args} mode='multiple' />}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles(styles, { name: 'SalesSummaryFilterBar' })(FilterBar)
