import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  CodeSelect,
} from '@/components'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker />

          <GridItem md={2}>
            <FastField
              name='supplierIDs'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Supplier'
                  mode='multiple'
                  code='ctSupplier'
                  labelField='displayValue'
                  temp
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
