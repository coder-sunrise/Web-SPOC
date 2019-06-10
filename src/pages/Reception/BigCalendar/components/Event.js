import React, { PureComponent } from 'react'

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
    const { event } = this.props

    return (
      <div
        style={{ height: '100%' }}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        <span>
          <strong>{event.patientName}</strong>
        </span>
        <span style={{ display: 'block' }}>{event.contactNo}</span>
      </div>
    )
  }
}

export default Event
