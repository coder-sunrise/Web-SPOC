import React from 'react'
// common components
import { NumberInput } from '@/components'

const CreditCardNumberInput = ({ label = 'Card Number', ...props }) => (
  <NumberInput
    {...props}
    label={label}
    max={9999999999999999}
    min={0}
    maxLength={16}
    precision={0}
  />
)

export default CreditCardNumberInput
