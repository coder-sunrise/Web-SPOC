import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import moment from 'moment'
// material ui
import { withStyles } from '@material-ui/core'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import Cached from '@material-ui/icons/Cached'
// big calendar
import BigCalendar from 'react-big-calendar'
// common components
import { Popper,Tooltip } from '@/components'
// assets
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

import customDropdownStyle from '@/assets/jss/material-dashboard-pro-react/components/customDropdownStyle'
import ApptPopover from './ApptPopover'
import DoctorBlockPopover from './DoctorBlockPopover'

const style = (theme) => ({
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

@connect(({ calendar }) => ({ calendarView: calendar.calendarView }))
class Event extends React.PureComponent {
  _handleMouseEnter = (syntheticEvent) => {
    const { event, handleMouseOver } = this.props
    handleMouseOver(event, syntheticEvent)
  }

  _handleMouseLeave = () => {
    const { handleMouseOver } = this.props
    handleMouseOver(null, null)
  }

  constructAccountNo = (patientAccountNo) =>
    !patientAccountNo ? '' : `(${patientAccountNo})`

  render () {
    const { event, classes, calendarView } = this.props
    const {
      doctor,
      hasConflict,
      isEnableRecurrence,
      patientProfile,
      start,
      end,
    } = event
    let { patientName, patientAccountNo, patientContactNo } = event
    if (patientProfile) {
      const { name, patientAccountNo: accNo, contactNumbers } = patientProfile
      const _mobileContact = contactNumbers.find(
        (item) => item.numberTypeFK === 1,
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

    const {stage,stageColorHex} = event

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
        {calendarView === BigCalendar.Views.MONTH ? (
          <div style={{ padding: '0px 4px' }}>
            <div className={monthViewClass}>
              <span className={classes.title}>
                {`${moment(start).format('h:mm A')} - ${moment(end).format(
                  'h:mm A',
                )}`}
              </span>
            </div>
            <div className={monthViewClass}>
              <span className={classes.title}>
                {`${title || ''} ${subtitle ? `(${subtitle})` : ''}`}
              </span>
              {hasConflict && <ErrorOutline className={classes.icon} />}
              {isEnableRecurrence && <Cached />}
              {stage && stage.trim()!='' &&
              <Tooltip title={stage} style={{float:'right'}}>
                <LocalOfferIcon
                  style={{ color: stageColorHex, float: 'right'}}
                />
              </Tooltip>}
            </div>
          </div>
        ) : (
          <div>
            <div className={otherViewClass} style={{float:'left'}}>
              <div className={classes.title}>
                <span>{title ? title.toUpperCase() : ''}</span>
              </div>
              <span className={classes.blockDiv}>
                {subtitle ? subtitle.toUpperCase() : ''}
              </span>
            </div>
            {stage && stage.trim()!='' &&
              <Tooltip title={stage} style={{float:'right'}}>
                <LocalOfferIcon
                  style={{ color: stageColorHex, float: 'right'}}
                />
              </Tooltip>}
          </div>
        )}
      </Popper>
    )
  }
}

export default withStyles(style, { name: 'ApptEvent' })(Event)
