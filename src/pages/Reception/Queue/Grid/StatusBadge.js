import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Badge } from '@/components'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

const styles = (theme) => ({
  text: {
    padding: theme.spacing(1),
    fontSize: '.875rem',
  },
})

const StatusBadge = ({ row, classes }) => {
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
  if (hasBadge)
    return (
      <Badge
        style={{
          padding: 6,
          fontSize: '.75rem',
          backgroundColor: color,
        }}
      >
        {value}
      </Badge>
    )

  return <span className={classes.text}>{value}</span>
}

export default withStyles(styles, { name: 'VisitStatusBadge' })(StatusBadge)
