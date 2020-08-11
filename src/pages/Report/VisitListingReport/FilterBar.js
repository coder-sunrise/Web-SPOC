import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  CodeSelect,
  GridContainer,
  GridItem,
  RadioGroup,
  SizeContainer,
} from '@/components'
// medisys components
import { DoctorProfileSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({
  handleSubmit,
  isSubmitting,
  visitOrderTemplateOptions = [],
}) => {
  return (
    <SizeContainer size='sm'>
      <GridContainer>
        <GridContainer alignItems='center'>
          {/* 1st row  */}
          <ReportDateRangePicker />
          <GridItem md={2}>
            <Button
              color='primary'
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={12} />
          <GridItem md={2}>
            <FastField
              name='visitPurposeIDS'
              render={(args) => (
                <CodeSelect
                  {...args}
                  options={visitOrderTemplateOptions}
                  labelField='displayValue'
                  mode='multiple'
                  label='Visit Purpose'
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
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
          <GridItem>
            <FastField
              name='groupBy'
              render={(args) => (
                <RadioGroup
                  {...args}
                  label='Group By'
                  defaultValue='3'
                  options={[
                    {
                      value: 'VisitPurpose',
                      label: 'Visit Purpose',
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
        </GridContainer>
      </GridContainer>
    </SizeContainer>
  )
}

export default FilterBar
