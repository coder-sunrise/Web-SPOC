import React, { useCallback } from 'react'
import classnames from 'classnames'
import color from 'color'
import { withStyles } from '@material-ui/core'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'

const styles = () => ({
  container: {
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
    '&:hover': {
      cursor: 'pointer',
    },
  },
  red: {
    backgroundColor: '#CF1322',
    '&:hover': {
      backgroundColor: color('#CF1322').darken(0.2).hex(),
    },
  },
  green: {
    backgroundColor: '#098257',
    '&:hover': {
      backgroundColor: color('#098257').darken(0.2).hex(),
    },
  },
  blue: {
    backgroundColor: '#4255BD',
    '&:hover': {
      backgroundColor: color('#4255BD').darken(0.2).hex(),
    },
  },
  darkGrey: {
    backgroundColor: '#777',
    '&:hover': {
      backgroundColor: color('#777').darken(0.2).hex(),
    },
  },
  lightGrey: {
    backgroundColor: '#999',
    '&:hover': {
      cursor: 'default',
    },
  },
})

const VisitStatusTag = ({ classes, row, onClick }) => {
  const { visitStatus: value } = row

  let colorTag = 'lightGrey'

  const handleClick = useCallback(
    () => {
      if (value.toUpperCase() === VISIT_STATUS.UPCOMING_APPT) return

      onClick(row)
    },
    [
      row,
    ],
  )

  switch (value.toUpperCase()) {
    case VISIT_STATUS.WAITING:
      colorTag = 'blue'
      break
    case VISIT_STATUS.DISPENSE:
    case VISIT_STATUS.BILLING:
    case VISIT_STATUS.ORDER_UPDATED:
      colorTag = 'green'
      break
    case VISIT_STATUS.IN_CONS:
    case VISIT_STATUS.PAUSED:
      colorTag = 'red'
      break
    case VISIT_STATUS.UPCOMING_APPT:
      colorTag = 'lightGrey'
      break
    case VISIT_STATUS.COMPLETED:
      colorTag = 'darkGrey'
      break
    default:
      colorTag = 'lightGrey'
      break
  }
  const cssClass = {
    [classes.container]: true,
    [classes[colorTag]]: true,
  }

  return (
    <div className={classnames(cssClass)} onClick={handleClick}>
      <span>{value}</span>
    </div>
  )
}

export default withStyles(styles, { name: 'VisitStatusTag' })(VisitStatusTag)
