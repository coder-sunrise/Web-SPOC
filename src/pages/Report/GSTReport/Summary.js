import React from 'react'
// common components
import {
  NumberInput,
  GridContainer,
  GridItem,
} from '@/components'

const Summary = ({ reportDatas }) => {
  if (!reportDatas)
    return null

  const { SumExpenditureGstDetails: [SumExpenditureGstDetail], SumIncomeGstDetails: [SumIncomeGstDetail], GstDetails: [GstDetail] } = reportDatas
  return (
    <GridContainer md={6}>
      <GridItem md={12}>
        <NumberInput
          currency
          prefix='Total Income: '
          disabled
          value={SumIncomeGstDetail.sumIncomeAmount}
          rightAlign
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Output Tax: '
          disabled
          currency
          rightAlign
          value={SumIncomeGstDetail.sumIncomeGst}
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Expenditure: '
          disabled
          currency
          rightAlign
          value={SumExpenditureGstDetail.sumExpenditureAmount}
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Input Tax: '
          disabled
          currency
          rightAlign
          value={SumExpenditureGstDetail.sumExpenditureGst}
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Output Tax - Total Input Tax: '
          disabled
          currency
          rightAlign
          value={GstDetail.totalTax}
        />
      </GridItem>
    </GridContainer>
  )
}

export default Summary
