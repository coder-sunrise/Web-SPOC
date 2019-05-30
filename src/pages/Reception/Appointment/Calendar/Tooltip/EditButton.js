import React from 'react'
// material ui
import { withStyles } from '@material-ui/core'
// dx-react-scheduler-material-ui
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui'
// settings
import { AppointmentTypeAsStyles } from '../setting'

const styles = () => ({
  ...AppointmentTypeAsStyles,
})

const EditButton = ({ classes, id, ...restProps }) => (
  <AppointmentTooltip.CommandButton
    {...restProps}
    {...(id === 'open' ? { className: 'edit-button' } : null)}
    id={id}
  />
)

export default withStyles(styles, { name: 'TooltipEditButton' })(EditButton)
