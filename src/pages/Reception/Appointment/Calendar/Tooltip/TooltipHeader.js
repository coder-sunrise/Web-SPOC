import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// dx-react-scheduler-material-ui
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui'
// settings
import {
  getColorClassByAppointmentType,
  AppointmentTypeAsStyles,
} from '../setting'

const styles = () => ({
  ...AppointmentTypeAsStyles,
})

const TooltipHeader = ({ classes, appointmentData, children }) => {
  const colorClass = getColorClassByAppointmentType(
    appointmentData.appointmentType,
    classes,
    { hover: false },
  )

  return (
    <AppointmentTooltip.Header
      className={classnames(colorClass)}
      appointmentData={appointmentData}
    >
      {children}
    </AppointmentTooltip.Header>
  )
}

export default withStyles(styles, { name: 'TooltipHeader' })(TooltipHeader)
