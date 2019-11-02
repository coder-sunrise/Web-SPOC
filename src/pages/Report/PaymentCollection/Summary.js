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

  const { PaymentCollectionInfo: [sumDetail]} = reportDatas
  return (
    <GridContainer md={6}>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Payments: '
          disabled
          value={sumDetail.totalPaymentCount}
          rightAlign
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Amount Collected before GST: '
          disabled
          currency
          rightAlign
          value={sumDetail.totalCollectedAmountBeforeGst}
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Amount Collected: '
          disabled
          currency
          rightAlign
          value={sumDetail.totalCollectedAmount}
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total GST Collected: '
          disabled
          currency
          rightAlign
          value={sumDetail.totalCollectedGst}
        />
      </GridItem>
      <GridItem md={12}>
        <NumberInput
          prefix='Total Cash Rounding: '
          disabled
          currency
          rightAlign
          value={sumDetail.totalCashRounding}
        />
      </GridItem>
    </GridContainer>
  )
}

export default Summary
