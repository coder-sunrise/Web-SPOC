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

  return (
    <div>Summary content</div>
  )
}

export default Summary
