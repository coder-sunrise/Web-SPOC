import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import Cached from '@material-ui/icons/Cached'
// big calendar
import BigCalendar from 'react-big-calendar'
// common components
import { Popper } from '@/components'
import ApptPopover from './ApptPopover'
// assets
import customDropdownStyle from '@/assets/jss/material-dashboard-pro-react/components/customDropdownStyle'

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
    fontSize: '.85rem',
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
    const { event, classes, calendarView, handleMouseOver } = this.props
    const { doctor, hasConflict, isEnableRecurrence, patientProfile } = event
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

    return (
      <Popper
        className={classnames({
          [classes.pooperResponsive]: true,
          [classes.pooperNav]: true,
        })}
        overlay={<ApptPopover popoverEvent={event} />}
      >
        {calendarView === BigCalendar.Views.MONTH ? (
          <div className={monthViewClass}>
            <span>
              {title} {accountNo}
            </span>
            {hasConflict && <ErrorOutline className={classes.icon} />}
            {isEnableRecurrence && <Cached />}
          </div>
        ) : (
          <div className={otherViewClass}>
            <div className={classes.title}>
              <span>{title ? title.toUpperCase() : ''}</span>
            </div>
            <span className={classes.blockDiv}>
              {subtitle ? subtitle.toUpperCase() : ''}
            </span>
          </div>
        )}
      </Popper>
    )
    // {
    //   /* <Popover
    //       id='event-popup'
    //       className={classes.popover}
    //       open={showPopup}
    //       anchorEl={popupAnchor}
    //       onClose={this.handleClosePopover}
    //       placement='top-start'
    //       anchorOrigin={{
    //         vertical: 'center',
    //         horizontal: 'right',
    //       }}
    //       transformOrigin={{
    //         vertical: 'center',
    //         horizontal: 'left',
    //       }}
    //       // disableRestoreFocus
    //     >
    //       {popoverEvent.doctor ? (
    //         <DoctorBlockPopover
    //           popoverEvent={popoverEvent}
    //           calendarView={calendarView}
    //         />
    //       ) : (
    //         <ApptPopover popoverEvent={popoverEvent} />
    //       )}
    //     </Popover> */
    // }
    // return calendarView === BigCalendar.Views.MONTH ? (
    //   <div
    //     className={monthViewClass}
    //     onMouseEnter={this._handleMouseEnter}
    //     onMouseLeave={this._handleMouseLeave}
    //   >
    //     <span>
    //       {title} {accountNo}
    //     </span>
    //     {hasConflict && <ErrorOutline className={classes.icon} />}
    //     {isEnableRecurrence && <Cached />}
    //   </div>
    // ) : (
    //   <div
    //     className={otherViewClass}
    //     onMouseEnter={this._handleMouseEnter}
    //     onMouseLeave={this._handleMouseLeave}
    //   >
    //     <div className={classes.title}>
    //       <span>{title ? title.toUpperCase() : ''}</span>
    //     </div>
    //     <span className={classes.blockDiv}>
    //       {subtitle ? subtitle.toUpperCase() : ''}
    //     </span>
    //   </div>
    // )
  }
}

export default withStyles(style, { name: 'ApptEvent' })(Event)
