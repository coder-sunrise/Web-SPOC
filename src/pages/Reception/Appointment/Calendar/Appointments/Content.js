import React from 'react'
import classnames from 'classnames'
import moment from 'moment'
// dx-react-scheduler
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui'
// material ui
import { withStyles } from '@material-ui/core'
import { Assignment } from '@material-ui/icons'
// settings
import {
  defaultColorOpts,
  getColorClassByAppointmentType,
  AppointmentTypeAsStyles,
} from '../setting'
import { getDateValue } from '../../utils'

const styles = () => ({
  content: {
    height: '100%',
  },
  defaultColor: {
    background: defaultColorOpts.value,
    '&:hover': {
      backgroundColor: defaultColorOpts.activeColor,
    },
  },
  ...AppointmentTypeAsStyles,
})

const RecurringIconComponent = () => <Assignment />

const _formatDate = (date) => {
  if (moment(date).isValid()) {
    const time = moment(date).format('hh:mm A').toString()
    return time
  }

  return ''
}

const AppointmentContentComponent = withStyles(styles, {
  name: 'AppointmentComponentContent',
})(({ classes, data, children }) => {
  const colorClass = getColorClassByAppointmentType(
    data.appointmentType,
    classes,
  )

  return (
    <Appointments.AppointmentContent
      data={data}
      className={classnames([
        classes.content,
        data.appointmentType ? colorClass : classes.defaultColor,
      ])}
      formatDate={_formatDate}
      recurringIconComponent={RecurringIconComponent}
    >
      {children}
    </Appointments.AppointmentContent>
  )
})

export default AppointmentContentComponent
