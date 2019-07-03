import React, { PureComponent } from 'react'
// material ui
import { CalendarToday } from '@material-ui/icons'
// custom component
import { CommonHeader } from '@/components'
// sub component
import Toolbar from './Toolbar'
import Calendar from './Calendar'

class Appointment extends PureComponent {
  render () {
    return (
      <CommonHeader Icon={<CalendarToday />} titleId='reception.appt.title'>
        <div style={{ minHeight: '50vh' }}>
          <Toolbar />
          <Calendar />
        </div>
      </CommonHeader>
    )
  }
}

export default Appointment
