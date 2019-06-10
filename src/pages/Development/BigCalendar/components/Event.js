import React, { PureComponent } from 'react'

const styles = (theme) => ({
  typography: {
    padding: theme.spacing.unit,
  },
})

class Event extends PureComponent {
  render () {
    const { event, classes } = this.props
    // const { open, anchorEl } = this.state
    return (
      <div onClick={this.handleOpen}>
        <span>
          <strong>{event.patientName}</strong>
          {event.title}
        </span>
        <span style={{ display: 'block' }}>{event.contactNo}</span>
        {event.appointmentType && (
          <span style={{ display: 'block' }}>{event.appointmentType}</span>
        )}
      </div>
    )
  }
}

export default Event
