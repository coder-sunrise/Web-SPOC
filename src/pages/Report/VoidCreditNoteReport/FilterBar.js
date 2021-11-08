import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  RadioGroup,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker
            fromDateLabel='Void Date From'
            toDateLabel='Void Date To'
          />

          <GridItem md={3}>
            <FastField
              name='filterType'
              render={args => (
                <RadioGroup
                  {...args}
                  label='Type'
                  options={[
                    {
                      value: 'Credit Note',
                      label: 'Credit Note',
                    },
                    {
                      value: 'Payment',
                      label: 'Payment',
                    },
                    {
                      value: 'Write Off',
                      label: 'Write Off',
                    },
                  ]}
                />
              )}
            />
          </GridItem>
          <GridItem md={3}>
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

export default FilterBar
