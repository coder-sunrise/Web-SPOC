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
  CodeSelect,
} from '@/components'
import { ITEM_TYPE } from '@/utils/constants'
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
              name='groupByDoctor'
              render={args => (
                <Checkbox {...args} label='Group By Optometrist' />
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='asAt'
              render={args => <Checkbox {...args} label='As At' />}
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
          <GridItem md={4}>
            <FastField
              name='categoryIDs'
              render={args => (
                <CodeSelect
                  {...args}
                  options={[
                    {
                      id: ITEM_TYPE.CONSUMABLE,
                      name: 'Product',
                    },
                    {
                      id: ITEM_TYPE.SERVICE,
                      name: 'Service',
                    },
                  ]}
                  mode='multiple'
                  label='Category'
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
