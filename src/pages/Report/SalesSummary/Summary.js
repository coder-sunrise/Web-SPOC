import React from 'react'
import {
  NumberInput,
  GridContainer,
  GridItem,
} from '@/components'

const Summary = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  const { SalesGSTDetails } = reportDatas
  return (
    <GridContainer md={6}>
      {SalesGSTDetails && SalesGSTDetails.length > 0 &&
        SalesGSTDetails.map((value) =>
          <GridItem md={12}>
            {value.categoryCode === 'VISITS' ?
              <NumberInput
                prefix={value.categoryDisplayValue}
                disabled
                value={value.totalAmount}
                rightAlign
              /> : <NumberInput
                currency
                prefix={value.categoryDisplayValue}
                disabled
                value={value.totalAmount}
                rightAlign
              />}
          </GridItem>
        )
      }
    </GridContainer>
  )
}

export default Summary
