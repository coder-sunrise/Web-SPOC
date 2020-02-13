import React, { useState, useCallback } from 'react'
import classnames from 'classnames'
import color from 'color'
import { withStyles } from '@material-ui/core'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'

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
      backgroundColor: color('#999').darken(0.2).hex(),
    },
  },
})

const VisitStatusTag = ({ classes, row, onClick }) => {
  const [
    hasClicked,
    setHasClicked,
  ] = useState(false)
  const { visitStatus: value, visitPurposeFK } = row

  let colorTag = 'lightGrey'

  const handleClick = useCallback(
    (event) => {
      event.preventDefault()
      event.stopPropagation()

      setHasClicked(true)
      onClick(row)

      setTimeout(() => {
        setHasClicked(false)
      }, 3000)
    },
    [
      row,
    ],
  )

  const handleDoubleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

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

  const visitType = VISIT_TYPE_NAME.find(
    (o) => o.visitPurposeFK === visitPurposeFK,
  )

  return (
    <div
      className={classnames(cssClass)}
      onClick={hasClicked ? undefined : handleClick}
      onDoubleClick={handleDoubleClick}
    >
      <span>
        {visitType && visitPurposeFK !== VISIT_TYPE.CONS ? (
          `${value} (${visitType.displayName})`
        ) : (
          value
        )}
      </span>
    </div>
  )
}

export default withStyles(styles, { name: 'VisitStatusTag' })(VisitStatusTag)
