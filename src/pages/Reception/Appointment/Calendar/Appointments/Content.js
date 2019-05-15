import React from 'react'
import classnames from 'classnames'
import { connect } from 'dva'
// dx-react-scheduler
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui'
// material ui
import { withStyles } from '@material-ui/core'
import { Assignment } from '@material-ui/icons'
// color mapping
import {
  reduceColorToClass,
  getColorClassByColorName,
  getColorMapping,
  defaultColorOpts,
} from '../ColorMapping'

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
  ...getColorMapping().reduce(reduceColorToClass, {}),
})

const RecurringIconComponent = () => <Assignment />

const AppointmentContentComponent = withStyles(styles, {
  name: 'AppointmentComponentContent',
})(({ classes, data, children }) => {
  const hasColorTag =
    data.colorTag && data.colorTag !== undefined && data.colorTag !== ''
  const colorClass = getColorClassByColorName(data.colorTag, classes)

  return (
    <Appointments.AppointmentContent
      data={data}
      className={classnames([
        classes.content,
        hasColorTag ? colorClass : classes.defaultColor,
      ])}
      recurringIconComponent={RecurringIconComponent}
    >
      {children}
    </Appointments.AppointmentContent>
  )
})

export default AppointmentContentComponent
