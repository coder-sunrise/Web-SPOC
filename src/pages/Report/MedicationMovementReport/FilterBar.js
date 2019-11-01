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
  CodeSelect,
} from '@/components'

import {
  DoctorLabel,
} from '@/components/_medisys'

const FilterBar = ({ handleSubmit }) => {
  const renderDropdown = (option) => <DoctorLabel doctor={option} />
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
          <GridItem md={3}>
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={12}>
            <FastField
              name='medicationIDs'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Medication'
                  mode='multiple'
                  code='inventorymedication'
                  labelField='displayValue'
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
