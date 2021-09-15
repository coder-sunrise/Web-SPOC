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
    padding: 6,
    color: 'white',
    borderRadius: '5px',
    lineHeight: 1,
    display: 'inline-block',
    // textTransform: 'uppercase',
    fontSize: '.75rem',
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
    backgroundColor: '#098257',
    '&:hover': {
      backgroundColor: color('#098257')
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
              fontSize: '0.87rem',
              fontWeight: 400,
              letterSpacing: 'inherit',
              display : 'inline-block',
              textAlign : 'center',
              width : 40,
            }}
          >
            {mappedVisitType.code || visitType.displayCode}
          </div>
          <span
            style={{
              height: '100%',
              borderLeft: '2px solid white',
            }}
          ></span>
          <div
            style={{
              fontSize: '0.87rem',
              fontWeight: 400,
              position: 'absolute',
              top: '35%',
              left: '50%',
              right: '50%',
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
