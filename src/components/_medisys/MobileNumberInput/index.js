import React from 'react'
// common components
import { NumberInput } from '@/components'

const MobileNumberInput = ({ label = 'Contact No.', ...props }) => (
  <NumberInput
    {...props}
    label={label}
    max={999999999999999}
    min={0}
    maxLength={15}
    precision={0}
  />
)

export default MobileNumberInput
