import React, { PureComponent } from 'react'
// material ui
import { withStyles } from '@material-ui/core'
import ErrorOutline from '@material-ui/icons/ErrorOutline'
import Cached from '@material-ui/icons/Cached'
import Draft from '@material-ui/icons/Edit'

const style = (theme) => ({
  blockDiv: {
    display: 'block',
  },
  container: {
    height: '100%',
    cursor: 'pointer',
    paddingLeft: theme.spacing(0.5),
  },
  title: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icons: {
    float: 'right',
  },
})

class Event extends PureComponent {
  _handleMouseEnter = (syntheticEvent) => {
    const { event, handleMouseOver } = this.props
    handleMouseOver(event, syntheticEvent)
  }

  _handleMouseLeave = () => {
    const { handleMouseOver } = this.props
    handleMouseOver(null, null)
  }

  render () {
    const { event, classes } = this.props
    const {
      appointmentStatusFk,
      isDoctorEvent,
      hasConflict,
      isEnableRecurrence,
    } = event

    const title = isDoctorEvent ? event.doctor : event.patientName
    const subtitle = isDoctorEvent ? event.eventType : event.patientContactNo

    return (
      <div
        className={classes.container}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        <div className={classes.title}>
          <span>
            <strong>{title ? title.toUpperCase() : ''}</strong>
          </span>
          <div className={classes.icons}>
            {hasConflict && <ErrorOutline />}
            {isEnableRecurrence && <Cached />}
            {appointmentStatusFk === '2' && <Draft />}
          </div>
        </div>
        <span className={classes.blockDiv}>
          {subtitle ? subtitle.toUpperCase() : ''}
        </span>
      </div>
    )
  }
}

export default withStyles(style, { name: 'ApptEvent' })(Event)
