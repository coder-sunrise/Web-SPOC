import React from 'react'
// common components
import { GridItem, NumberInput, SizeContainer } from '@/components'
// sub component

const amountProps = {
  style: { margin: 0 },
  noUnderline: true,
  currency: true,
  disabled: true,
  rightAlign: true,
  normalText: true,
}

const PaymentSummary = ({ totalPaid = 0.0, outstanding = 0.0 }) => {
  return (
    <SizeContainer size='sm'>
      <React.Fragment>
        <GridItem xs={6} md={12}>
          <NumberInput
            prefix='Total Paid:'
            defaultValue={totalPaid}
            size='sm'
            {...amountProps}
          />
        </GridItem>
        <GridItem xs={6} md={12}>
          <NumberInput
            prefix='Outstanding:'
            defaultValue={outstanding}
            size='sm'
            {...amountProps}
          />
        </GridItem>
      </React.Fragment>
    </SizeContainer>
  )
}

export default PaymentSummary
