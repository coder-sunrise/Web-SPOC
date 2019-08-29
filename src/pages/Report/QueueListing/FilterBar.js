import React from 'react'
// formik
import { FastField } from 'formik'
// common components
import { Button, DatePicker, GridContainer, GridItem } from '@/components'

const FilterBar = ({ handleSubmit }) => {
  return (
    <GridContainer>
      <GridItem md={2}>
        <FastField
          name='listingFrom'
          render={(args) => <DatePicker {...args} prefix='From' />}
        />
      </GridItem>
      <GridItem md={2}>
        <FastField
          name='listingTo'
          render={(args) => <DatePicker {...args} prefix='To' />}
        />
      </GridItem>
      <GridItem md={3}>
        <Button color='primary' onClick={handleSubmit}>
          Generate Report
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default FilterBar
