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
              name='filterType'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Payer Type'
                  code='ltinvoicepayertype'
                  valueField='code'
                />
              )}
            />
          </GridItem>
          <GridItem md={2}>
            <FastField
              name='isGroupByDoctor'
              render={(args) => (
                <Checkbox {...args} label='Group By Doctor' />
              )}
            />
          </GridItem>
          <GridItem md={3}>
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={12}>
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
        </GridContainer>
      </React.Fragment>
    </SizeContainer>
  )
}

export default FilterBar
