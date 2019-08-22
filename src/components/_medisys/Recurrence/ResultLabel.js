import React, { memo } from 'react'
import { computeLabel, computeRRule } from './helper'

const RecurrenceList = ({ recurrenceDto, date }) => {
  const rule = computeRRule({ date, recurrenceDto })
  const label = computeLabel({ rule, date, recurrenceDto })

  return (
    <div>
      <span>{label}</span>
    </div>
  )
}

export default memo(RecurrenceList)
