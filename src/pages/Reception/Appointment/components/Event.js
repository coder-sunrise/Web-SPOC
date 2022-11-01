import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import Cached from '@material-ui/icons/Cached'
// common components
import { Popper, Tooltip, timeFormat24Hour } from '@/components'
// assets
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import { CALENDAR_VIEWS } from '@/utils/constants'
import customDropdownStyle from '@/assets/jss/material-dashboard-pro-react/components/customDropdownStyle'
import ApptPopover from './ApptPopover'
import DoctorBlockPopover from './DoctorBlockPopover'
import RoomBlockPopover from './RoomBlockPopover'

const style = theme => ({
  ...customDropdownStyle(theme),
  blockDiv: {
    display: 'block',
  },
  baseContainer: {
    height: '100%',
    minHeight: '1em',
    cursor: 'pointer',
  },
  otherViewEvent: {
    width: 'auto',
    '& span': {
      width: 'auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  monthViewEvent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: theme.spacing(0.5),
    '& svg': {
      width: '.85rem',
      height: '.85rem',
    },
    '& span': {
      width: 'auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icons: {
    float: 'right',
    height: '.8rem',
  },
})

class Event extends React.PureComponent {
  _handleMouseEnter = syntheticEvent => {
    const { event, handleMouseOver } = this.props
    handleMouseOver(event, syntheticEvent)
  }

  _handleMouseLeave = () => {
    const { handleMouseOver } = this.props
    handleMouseOver(null, null)
  }

  constructAccountNo = patientAccountNo =>
    !patientAccountNo ? '' : `(${patientAccountNo})`

  render() {
    const { event, classes, calendarView } = this.props
    const {
      doctor,
      hasConflict,
      isEnableRecurrence,
      patientProfile,
      start,
      end,
      room,
    } = event
    let { patientName, patientAccountNo, patientContactNo } = event
    if (patientProfile) {
      const { name, patientAccountNo: accNo, contactNumbers } = patientProfile
      const _mobileContact = contactNumbers.find(
        item => item.numberTypeFK === 1,
      )
      if (_mobileContact) patientContactNo = _mobileContact.number

      patientName = name
      patientAccountNo = accNo
    }

    let title = patientName
    let accountNo = this.constructAccountNo(patientAccountNo)
    let subtitle = patientContactNo || ''
    if (doctor) {
      const { clinicianProfile = {} } = doctor
      const { doctorProfile } = clinicianProfile
      title = clinicianProfile.name
      accountNo = doctorProfile
        ? this.constructAccountNo(doctorProfile.doctorMCRNo)
        : ''
      subtitle = ''
    }
    if (room) {
      title = room.resourceName
    }

    const monthViewClass = classnames({
      [classes.baseContainer]: true,
      [classes.monthViewEvent]: true,
    })

    const otherViewClass = classnames({
      [classes.baseContainer]: true,
      [classes.otherViewEvent]: true,
    })

    let OverlayComponent = <ApptPopover popoverEvent={event} />

    if (event.isDoctorBlock)
      OverlayComponent = <DoctorBlockPopover popoverEvent={event} />
    if (event.isRoomBlock)
      OverlayComponent = <RoomBlockPopover popoverEvent={event} />

    const { stage, stageColorHex } = event
    const showStage = stage && stage.trim() !== ''
    const stageDivStyle = {
      float: 'left',
      ...(showStage
        ? { width: '100%', marginLeft: '-20px', paddingLeft: '20px' }
        : {}),
    }
    return (
      <Popper
        stopOnClickPropagation
        className={classnames({
          [classes.pooperResponsive]: true,
          [classes.pooperNav]: true,
        })}
        useTimer
        overlay={OverlayComponent}
      >
        {calendarView === CALENDAR_VIEWS.MONTH ? (
          <div
            style={{
              position: 'relative',
              paddingRight: showStage ? 20 : 0,
              paddingLeft: 4,
            }}
          >
            <div>
              <div className={monthViewClass}>
                <span className={classes.title}>
                  {`${moment(start).format(timeFormat24Hour)} - ${moment(
                    end,
                  ).format(timeFormat24Hour)}`}
                </span>
              </div>
              <div className={monthViewClass}>
                <span className={classes.title}>
                  {`${title || ''} ${subtitle ? `(${subtitle})` : ''}`}
                </span>
                {hasConflict && <ErrorOutline className={classes.icon} />}
                {isEnableRecurrence && <Cached />}
              </div>
            </div>
            {showStage && (
              <div style={{ position: 'absolute', right: 0, top: 2 }}>
                <Tooltip title={stage}>
                  <LocalOfferIcon style={{ color: stageColorHex }} />
                </Tooltip>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{ position: 'relative', paddingRight: showStage ? 20 : 0 }}
          >
            <div>
              <div className={otherViewClass}>
                <span className={classes.title}>
                  {`${moment(start).format(timeFormat24Hour)} - ${moment(
                    end,
                  ).format(timeFormat24Hour)}`}
                </span>
              </div>
              <div className={otherViewClass}>
                <div className={classes.title}>
                  <span>{title ? title.toUpperCase() : ''}</span>
                </div>
                <span className={classes.blockDiv}>
                  {subtitle ? subtitle.toUpperCase() : ''}
                </span>
              </div>
            </div>
            {showStage && (
              <div style={{ position: 'absolute', right: '-3px', top: 2 }}>
                <Tooltip title={stage}>
                  <LocalOfferIcon style={{ color: stageColorHex }} />
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </Popper>
    )
  }
}

export default withStyles(style, { name: 'ApptEvent' })(Event)
