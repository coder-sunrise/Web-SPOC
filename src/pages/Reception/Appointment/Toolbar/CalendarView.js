import React from 'react'
import { connect } from 'dva'
// material ui
import { CustomDropdown } from '@/components'

const Views = [
  'Day View',
  'Week View',
  'Month View',
]

const onChange = (dispatch, value) => {
  dispatch({
    type: 'appointment/viewChange',
    view: value,
  })
}

const CalendarView = ({ appointment, dispatch }) => {
  return (
    <div>
      <CustomDropdown
        buttonText={appointment.currentView}
        buttonProps={{
          color: 'primary',
          simple: true,
        }}
        onClick={onChange.bind(null, dispatch)}
        dropdownList={Views}
      />
    </div>
  )
}

export default connect(({ appointment }) => ({ appointment }))(CalendarView)
