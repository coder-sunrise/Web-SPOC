import React from 'react'
import moment from 'moment'
import { connect } from 'dva'
// material ui
import { IconButton, withStyles } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'
// custom components
import { Button } from '@/components'
import { DATE_NAVIGATOR_ACTION, CALENDAR_VIEWS } from '../utils'

const type = {
  [CALENDAR_VIEWS.DAY]: 'days',
  [CALENDAR_VIEWS.WEEK]: 'weeks',
  [CALENDAR_VIEWS.MONTH]: 'months',
}

const DateNavigator = ({ appointment, dispatch }) => {
  const changeDate = (action) => {
    const { currentDate, currentView } = appointment

    let newDate = moment(new Date())

    if (action === DATE_NAVIGATOR_ACTION.add) {
      newDate = moment(currentDate).add(1, type[currentView])
    } else if (action === DATE_NAVIGATOR_ACTION.SUBTRACT) {
      newDate = moment(currentDate).subtract(1, type[currentView])
    }

    dispatch({
      type: 'appointment/dateChange',
      date: newDate,
    })
  }

  const addDate = () => changeDate(DATE_NAVIGATOR_ACTION.add)
  const subtractDate = () => changeDate(DATE_NAVIGATOR_ACTION.SUBTRACT)
  const returnToday = () => changeDate(DATE_NAVIGATOR_ACTION.BACK_TO_TODAY)

  return (
    <div>
      <IconButton color='primary' onClick={subtractDate}>
        <ChevronLeft />
      </IconButton>
      <Button simple color='primary' onClick={returnToday}>
        Today
      </Button>
      <IconButton color='primary' onClick={addDate}>
        <ChevronRight />
      </IconButton>
    </div>
  )
}

export default connect(({ appointment }) => ({ appointment }))(DateNavigator)
