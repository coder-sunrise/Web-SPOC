import React from 'react'
import { connect } from 'dva'
// dx-react-scheduler
import { Appointments } from '@devexpress/dx-react-scheduler-material-ui'
import { CALENDAR_VIEWS } from '../../utils'

const AppointmentContainerComponent = ({
  appointment,
  style,
  children,
  ...restProps
}) => {
  const { currentView } = appointment

  const newWidth = parseFloat(style.width) * 0.9
  const newLeft = parseFloat(style.left) * 0.91

  const newStyle =
    currentView !== CALENDAR_VIEWS.DAY
      ? { ...style }
      : {
          ...style,
          width: `${newWidth}%`,
          left: `${newLeft}%`,
        }
  return (
    <Appointments.Container
      style={{
        ...newStyle,
      }}
      {...restProps}
    >
      {children}
    </Appointments.Container>
  )
}

export default connect(({ appointment }) => ({ appointment }))(
  AppointmentContainerComponent,
)
