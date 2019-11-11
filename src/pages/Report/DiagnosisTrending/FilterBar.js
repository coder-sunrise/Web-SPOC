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
  CodeSelect,
} from '@/components'

const styles = (theme) => ({
  generateBtn: {
    marginBottom: theme.spacing(1),
  },
})

const FilterBar = ({ classes, handleSubmit }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={2}>
            <FastField
              name='listingFrom'
              render={(args) => <DatePicker {...args} label='From' />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='listingTO'
              render={(args) => <DatePicker {...args} label='To' />}
            />
          </GridItem>
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
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={8}>
            <FastField
              name='diagnosisIds'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Diagnosis'
                  mode='multiple'
                  temp
                  code='codetable/ctsnomeddiagnosis'
                  labelField='displayValue'
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default withStyles(styles, { name: 'SalesSummaryFilterBar' })(FilterBar)
