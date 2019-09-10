import React from 'react'
import classnames from 'classnames'
// material ui
import { withStyles } from '@material-ui/core'

const styles = () => ({
  colorDot: {
    height: '0.8rem',
    width: '1.5rem',
    borderRadius: '20%',
    display: 'inline-block',
    marginRight: 10,
  },
})

const AppointmentTypeLabel = ({ classes, color, label }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <span
      className={classnames([
        classes.colorDot,
      ])}
      style={{
        backgroundColor: color,
      }}
    />
    <span>{label}</span>
  </div>
)

export default withStyles(styles, { name: 'AppointmentType' })(
  AppointmentTypeLabel,
)
