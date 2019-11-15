import React from 'react'
// common components
import { NumberInput } from '@/components'

const Mobile = ({ ...props }) => (
  <NumberInput {...props} label='Contact No.' max={999999999999999} />
)

export default Mobile
