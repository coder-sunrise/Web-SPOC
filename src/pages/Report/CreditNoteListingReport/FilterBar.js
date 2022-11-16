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
  Checkbox,
  Select,
} from '@/components'
import { DoctorProfileSelect } from '@/components/_medisys'
import ReportDateRangePicker from '../ReportDateRangePicker'

const FilterBar = ({ handleSubmit, isSubmitting }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <ReportDateRangePicker />
          <GridItem md={2}>
            <FastField
              name='filterType'
              render={args => (
                <Select
                  {...args}
                  label='Payer Type'
                  options={[
                    { name: 'Patient', value: 'Patient' },
                    { name: 'Co-payer', value: 'Co-payer' },
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
          <GridItem md={4}>
            <FastField
              name='doctorIDs'
              render={args => (
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
          <GridItem md={2}>
            <FastField
              name='isGroupByDoctor'
              render={args => (
                <Checkbox {...args} label='Group By Optometrist' />
              )}
            />
          </GridItem>
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
