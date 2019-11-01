import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import {
  Button,
  Checkbox,
  DatePicker,
  GridContainer,
  GridItem,
  SizeContainer,
  CodeSelect,
} from '@/components'

import {
  DoctorLabel,
} from '@/components/_medisys'

const FilterBar = ({ handleSubmit }) => {
  const renderDropdown = (option) => <DoctorLabel doctor={option} />
  const maxDoctorTagCount = 1
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
          <GridItem md={3} />
          <GridItem md={4}>
            <FastField
              name='doctorIDs'
              render={(args) => (
                <CodeSelect
                  {...args}
                  // allLabel='All Doctors'
                  allValue={-99}
                  allValueOption={{
                    clinicianProfile: {
                      name: 'All',
                    },
                    id: -99,
                  }}
                  allowClear={false}
                  label='Doctor'
                  mode='multiple'
                  filter={{
                    'clinicianProfile.isActive': true,
                  }}
                  code='doctorprofile'
                  labelField='clinicianProfile.name'
                  valueField='id'
                  maxTagCount={maxDoctorTagCount}
                  maxTagPlaceholder='doctors'
                  renderDropdown={renderDropdown}
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
