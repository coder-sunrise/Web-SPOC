import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  GridContainer,
  GridItem,
  SizeContainer,
  Checkbox,
  CodeSelect,
  Select,
} from '@/components'
import { osBalanceStatus } from '@/utils/codes'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker />
          <GridItem md={1}>
            <FastField
              name='asAt'
              render={(args) => <Checkbox {...args} label='As At' />}
            />
          </GridItem>
          <GridItem md={6} />

          <GridItem md={2}>
            <FastField
              name='companyIDS'
              render={(args) => (
                <CodeSelect
                  {...args}
                  code='ctcopayer'
                  labelField='displayValue'
                  mode='multiple'
                  label='Company'
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='outstandingBalanceStatus'
              render={(args) => {
                return (
                  <Select
                    label='O/S Balance'
                    options={osBalanceStatus}
                    {...args}
                  />
                )
              }}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='groupByCompany'
              render={(args) => <Checkbox {...args} label='Group By Company' />}
            />
          </GridItem>
          
          <GridItem md={2}>
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
