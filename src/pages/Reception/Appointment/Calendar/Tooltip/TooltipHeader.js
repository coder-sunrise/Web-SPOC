import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// dx-react-scheduler-material-ui
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui'
// color mapping
import {
  getColorMapping,
  getColorClassByColorName,
  reduceColorToClass,
} from '../ColorMapping'

const styles = () => ({
  ...getColorMapping().reduce(reduceColorToClass, {}),
})

const TooltipHeader = ({ classes, appointmentData, children }) => {
  const colorClass = getColorClassByColorName(
    appointmentData.colorTag,
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
