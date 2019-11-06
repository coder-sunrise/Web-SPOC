import React from 'react'
// common components
import {
  Button,
  GridContainer,
  GridItem,
} from '@/components'

const FilterBar = ({ handleSubmit }) => {
  return (
    <GridContainer size='sm'>
      <GridItem md={3}>
        <Button color='primary' onClick={handleSubmit}>
          Generate Report
        </Button>
      </GridItem>
    </GridContainer>
  )
}

export default FilterBar
