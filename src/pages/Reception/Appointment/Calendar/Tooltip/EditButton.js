import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// dx-react-scheduler-material-ui
import { AppointmentTooltip } from '@devexpress/dx-react-scheduler-material-ui'
// color mapping
import { reduceColorToClass, getColorMapping } from '../ColorMapping'

const styles = () => ({
  ...getColorMapping().reduce(reduceColorToClass, {}),
})

const EditButton = ({ classes, id, ...restProps }) => (
  <AppointmentTooltip.CommandButton
    {...restProps}
    {...(id === 'open' ? { className: 'edit-button' } : null)}
    id={id}
  />
)

export default withStyles(styles, { name: 'TooltipEditButton' })(EditButton)
