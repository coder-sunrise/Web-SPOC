import React from 'react'
// custom components
import { Button } from '@/components'

export const OpenButtonComponent = ({ text, onVisibilityToggle }) => (
  <Button simple color='primary' onClick={onVisibilityToggle}>
    {text}
  </Button>
)
