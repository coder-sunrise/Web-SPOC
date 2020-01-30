import React, { PureComponent } from 'react'

import { CommonTableGrid } from '@/components'

class Grid extends PureComponent {
  render () {
    const { handleSelectEvent } = this.props
    return (
      <CommonTableGrid
        style={{ marginTop: 10 }}
        type='appointmentListing'
        onRowDoubleClick={handleSelectEvent}
        columns={[
          { name: 'patient', title: 'Patient' },
          { name: 'patientAccNo', title: 'Account No.' },
          { name: 'contactNo', title: 'Contact No.' },
          { name: 'apptDate', title: 'Appt Date' },
          { name: 'apptTime', title: 'Appt Time' },
          { name: 'duration', title: 'Duration' },
          { name: 'doctor', title: 'Doctor' },
          { name: 'room', title: 'Room' },
          { name: 'remarks', title: 'Remarks' },
          { name: 'apptStatus', title: 'Appt Status' },
          { name: 'bookBy', title: 'Book By' },
          { name: 'bookOn', title: 'Book On' },
        ]}
        columnExtensions={[
          {
            columnName: 'apptDate',
            type: 'date',
          },
          {
            columnName: 'bookOn',
            type: 'date',
          },
        ]}
      />
    )
  }
}

export default Grid
