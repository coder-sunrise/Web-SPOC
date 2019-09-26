import React, { PureComponent } from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import Cached from '@material-ui/icons/Cached'
// big calendar
import BigCalendar from 'react-big-calendar'

const style = (theme) => ({
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
    const { event, classes, calendarView } = this.props
    const { doctor, hasConflict, isEnableRecurrence } = event

    let title = event.patientName
    let accountNo = this.constructAccountNo(event.patientAccountNo)
    let subtitle = event.patientContactNo || ''
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

    // console.log({ calendarView })

    return calendarView === BigCalendar.Views.MONTH ? (
      <div
        className={monthViewClass}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        <span>
          {title} {accountNo}
        </span>
        {hasConflict && <ErrorOutline className={classes.icon} />}
        {isEnableRecurrence && <Cached />}
      </div>
    ) : (
      <div
        className={otherViewClass}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        <div className={classes.title}>
          <span>{title ? title.toUpperCase() : ''}</span>
          {/* <div className={classes.icons}>
            {hasConflict && <ErrorOutline />}
            {isEnableRecurrence && <Cached />}
            {appointmentStatusFk === '2' && <Draft />}
          </div> */}
        </div>
        <span className={classes.blockDiv}>
          {subtitle ? subtitle.toUpperCase() : ''}
        </span>
      </div>
    )
    // return (
    //   <div
    //     className={classes.monthViewEvent}
    //     onMouseEnter={this._handleMouseEnter}
    //     onMouseLeave={this._handleMouseLeave}
    //   >
    //     {title} (S1234567D)
    //   </div>
    // )
  }
}

export default withStyles(style, { name: 'ApptEvent' })(Event)
