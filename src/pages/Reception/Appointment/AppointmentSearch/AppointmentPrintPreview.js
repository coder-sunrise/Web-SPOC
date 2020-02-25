import React, { Component } from 'react'
import PrintPreviewRow from './PrintPreviewRow'

class AppointmentPrintPreview extends Component {
  render () {
    const { appointment: { printList = [] } } = this.props
    return (
      <table style={{ margin: 10 }}>
        {printList.map((appt, idx) => {
          return <PrintPreviewRow key={idx} row={appt} />
        })}
      </table>
    )
  }
}

export default AppointmentPrintPreview
