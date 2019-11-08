import React from 'react'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

const baseStyles = {
  width: '100%',
  padding: 6,
  color: 'white',
  borderRadius: '16px',
  lineHeight: 1,
  display: 'inline-block',
  textTransform: 'uppercase',
  fontSize: '.75rem',
  fontWeight: 700,
  textAlign: 'center',
  verticalAlign: 'baseline',
}

const VisitStatusTag = ({ row }) => {
  const { visitStatus: value } = row
  let color = '#999'
  let hasBadge = true

  switch (value.toUpperCase()) {
    case VISIT_STATUS.WAITING:
      color = '#4255BD'
      break
    case VISIT_STATUS.DISPENSE:
    case VISIT_STATUS.BILLING:
    case VISIT_STATUS.ORDER_UPDATED:
      color = '#098257'
      break
    case VISIT_STATUS.IN_CONS:
    case VISIT_STATUS.PAUSED:
      color = '#CF1322'
      break
    case VISIT_STATUS.UPCOMING_APPT:
      color = '#999'
      break
    case VISIT_STATUS.COMPLETED:
      color = '#777'
      break
    default:
      color = '#999'
      hasBadge = false
      break
  }
  return (
    <div
      style={{
        ...baseStyles,
        backgroundColor: color,
      }}
    >
      <span>{value}</span>
    </div>
  )
}

export default VisitStatusTag
