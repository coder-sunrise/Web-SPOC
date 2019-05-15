import React from 'react'
import classnames from 'classnames'
// dx-react-scheduler
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui'
// material ui
import { withStyles } from '@material-ui/core'

const styles = () => ({
  container: {
    borderRadius: '5px',
  },
})

const AppointmentComponent = ({
  classes,
  children,
  style,
  data,
  ...restProps
}) => {
  return (
    <Appointments.Appointment
      className={classnames([
        classes.container,
      ])}
      data={data}
      {...restProps}
    >
      {children}
    </Appointments.Appointment>
  )
}

export default withStyles(styles, { name: 'AppointmentComponent' })(
  AppointmentComponent,
)
