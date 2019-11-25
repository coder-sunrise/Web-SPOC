import React from 'react'
// common components
import { NumberInput } from '@/components'

const MobileNumberInput = ({ ...props }) => (
  <NumberInput
    {...props}
    label='Contact No.'
    max={999999999999999}
    inputProps={{ maxLength: 15 }}
    maxLength={15}
    precision={0}
  />
)

export default MobileNumberInput
