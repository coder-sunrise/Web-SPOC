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
          <GridItem md={3}>
            <Button color='primary' onClick={handleSubmit}>
              Generate Report
            </Button>
          </GridItem>
          <GridItem md={5} />
          <GridItem md={4}>
            <FastField
              name='consumableIDs'
              render={(args) => (
                <CodeSelect
                  {...args}
                  label='Consumable'
                  mode='multiple'
                  temp
                  code='inventoryConsumable'
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
