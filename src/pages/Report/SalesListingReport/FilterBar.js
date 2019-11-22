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
import {
  DoctorProfileSelect,
} from '@/components/_medisys'

const FilterBar = ({ handleSubmit }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridContainer alignItems='flex-end'>
          <GridItem md={2}>
            <FastField
              name='dateFrom'
              render={(args) => <DatePicker {...args} label='From' />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='dateTo'
              render={(args) => <DatePicker {...args} label='To' />}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='groupByDoctor'
              render={(args) => (
                <Checkbox {...args} label='Group By Doctor' />
              )}
            />
          </GridItem>
          <GridItem md={1}>
            <FastField
              name='asAt'
              render={(args) => (
                <Checkbox {...args} label='As At' />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <Button color='primary' onClick={handleSubmit}>
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
              name='categoryIDs'
              render={(args) => (
                <CodeSelect
                  {...args}
                  code='ltinvoiceitemtype'
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
