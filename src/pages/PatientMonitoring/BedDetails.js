import React from 'react'
// common components
import { GridContainer, GridItem } from '@/components'

const BedDetails = () => {
  return (
    <div>
      <GridContainer>
        <GridItem md={4}>
          <div>patient info</div>
        </GridItem>

        <GridItem md={8}>
          <div>bed graph </div>
        </GridItem>
      </GridContainer>
    </div>
  )
}

export default BedDetails
