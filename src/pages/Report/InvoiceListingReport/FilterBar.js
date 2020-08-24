import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  RadioGroup,
  GridContainer,
  GridItem,
  SizeContainer,
  CodeSelect,
  Checkbox,
} from '@/components'
import { DoctorProfileSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
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
              name='groupBy'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='Group By'
                  options={[
                    {
                      value: 'Company',
                      label: 'Company',
                    },
                    {
                      value: 'Doctor',
                      label: 'Doctor',
                    },
                    {
                      value: 'None',
                      label: 'None',
                    },
                  ]}
                />
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='asAt'
              render={(args) => <Checkbox {...args} label='As At' />}
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
          <GridItem md={4}>
            <FastField
              name='doctorIDs'
              render={(args) => (
                <DoctorProfileSelect
                  mode='multiple'
                  {...args}
                  allValue={-99}
                  allValueOption={{
                    id: -99,
                    clinicianProfile: {
                      name: 'All',
                    },
                  }}
                  labelField='clinicianProfile.name'
                />
              )}
            />
          </GridItem>
          <GridItem md={4}>
            <FastField
              name='companyIDS'
              render={(args) => (
                <CodeSelect
                  {...args}
                  // code='ctcopayer,ctsupplier'
                  code='ctcopayer'
                  labelField='displayValue'
                  mode='multiple'
                  label='Company'
                />
              )}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
