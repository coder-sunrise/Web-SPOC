import React, { useCallback, memo } from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
import color from 'color'
import { withStyles } from '@material-ui/core'
// variables
import { VISIT_STATUS } from '@/pages/Reception/Queue/variables'
import { VISIT_TYPE, VISIT_TYPE_NAME } from '@/utils/constants'
import Authorized from '@/utils/Authorized'

const styles = () => ({
  container: {
    width: '100%',
    color: 'white',
    borderRadius: '3px',
    lineHeight: 1,
    display: 'inline-block',
    // textTransform: 'uppercase',
    fontSize: '.75rem',
    height: '25px',
    position: 'relative',
    top: '3px',
    fontWeight: 700,
    verticalAlign: 'baseline',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  readonly: {
    '&:hover': {
      cursor: 'default',
    },
  },
  red: {
    backgroundColor: '#CF1322',
    '&:hover': {
      backgroundColor: color('#CF1322')
        .darken(0.2)
        .hex(),
    },
  },
  green: {
    borderLeft: '5px',
    backgroundColor: '#389e0d',
    '&:hover': {
      backgroundColor: color('#389e0d')
        .darken(0.2)
        .hex(),
    },
  },
  blue: {
    backgroundColor: '#4255BD',
    '&:hover': {
      backgroundColor: color('#4255BD')
        .darken(0.2)
        .hex(),
    },
  },
  darkGrey: {
    backgroundColor: '#777',
    '&:hover': {
      backgroundColor: color('#777')
        .darken(0.2)
        .hex(),
    },
  },
  lightGrey: {
    backgroundColor: '#999',
    '&:hover': {
      backgroundColor: color('#999')
        .darken(0.2)
        .hex(),
    },
  },
  orange: {
    backgroundColor: '#996600',
    '&:hover': {
      backgroundColor: color('#996600')
        .darken(0.2)
        .hex(),
    },
  },
})

const VisitStatusTag = props => {
  const { classes, row, onClick, statusTagClicked, clinicSettings } = props
  const { visitStatus: value, visitPurposeFK } = row
  const { settings } = clinicSettings
  let colorTag = 'lightGrey'

  const handleClick = useCallback(
    event => {
      event.preventDefault()
      event.stopPropagation()
      onClick(row)
    },
    [row],
  )

  const handleDoubleClick = event => {
    event.preventDefault()
    event.stopPropagation()
  }

  switch (value) {
    case VISIT_STATUS.WAITING:
      colorTag = 'blue'
      break
    case VISIT_STATUS.DISPENSE:
    case VISIT_STATUS.ORDER_UPDATED:
      colorTag = 'orange'
      break
    case VISIT_STATUS.BILLING:
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

  let visitTypeSettingsObj = []
  try {
    visitTypeSettingsObj = JSON.parse(settings.visitTypeSetting)
  } catch {}

  const visitType = VISIT_TYPE_NAME.find(
    o => o.visitPurposeFK === visitPurposeFK,
  )

  const mappedVisitType = visitTypeSettingsObj.find(
    x => x.id === visitPurposeFK,
  )

  return (
    <div
      className={classnames({
        ...cssClass,
      })}
      onClick={
        statusTagClicked || (row.patientProfileFk && !row.patientIsActive)
          ? undefined
          : handleClick
      }
      onDoubleClick={handleDoubleClick}
    >
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: 400,
          letterSpacing: 'inherit',
          display: 'inline-block',
          textAlign: 'center',
          width: 42,
          position: 'relative',
          top: '-7px',
        }}
      >
        {mappedVisitType?.code || visitType?.displayCode || 'APT'}
      </div>
      <span
        style={{
          height: '100%',
          borderLeft: '1px solid #bbbbbb',
          position: 'relative',
          display: 'inline-block',
          top: 0,
        }}
      ></span>
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: 400,
          position: 'relative',
          display: 'inline-block',
          top: '-8px',
          marginLeft: '6px',
          letterSpacing: 'inherit',
        }}
      >
        {value}
      </div>
    </div>
  )
}

const Connect = connect(({ queueLog, clinicSettings }) => ({
  statusTagClicked: queueLog.statusTagClicked,
  clinicSettings: clinicSettings,
}))(VisitStatusTag)

export default memo(withStyles(styles, { name: 'VisitStatusTag' })(Connect))
