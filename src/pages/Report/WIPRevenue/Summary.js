import React from 'react'
import {
  NumberInput,
  GridContainer,
  GridItem,
} from '@/components'

const Summary = ({ reportDatas }) => {
  if (!reportDatas)
    return null
  
  const { RevenueSummary } = reportDatas  
  let summaryData
  RevenueSummary.forEach(element => {
    summaryData = element
  })

  return (
    <GridContainer md={6}>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Revenue Amount'
          currency
          disabled
          value={summaryData.totalRevenueAmount}
          rightAlign
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Balance Amount'
          currency
          disabled
          value={summaryData.totalBalanceAmount}
          rightAlign
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Credit Note Amount'
          currency
          disabled
          value={summaryData.totalCreditNoteAmount}
          rightAlign
        />
      </GridItem>
    </GridContainer>
  )
}

export default Summary
