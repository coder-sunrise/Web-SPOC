import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'
// common components
import { Tooltip } from '@/components'

const styles = () => ({
  root: { display: 'flex', alignItems: 'center' },
  colorDot: {
    height: '0.8rem',
    minWidth: '1.5rem',
    borderRadius: '20%',
    display: 'inline-block',
    marginRight: 10,
  },
  label: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    wordWrap: 'break-word',
  },
})

const AppointmentTypeLabel = ({ classes, color, label }) => (
  <Tooltip title={label}>
    <div className={classes.root}>
      <span
        className={classnames([
          classes.colorDot,
        ])}
        style={{
          backgroundColor: color,
        }}
      />
      <span className={classes.label}>{label}</span>
    </div>
  </Tooltip>
)

export default withStyles(styles, { name: 'AppointmentType' })(
  AppointmentTypeLabel,
)
