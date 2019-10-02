import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// big calendar
import BigCalendar from 'react-big-calendar'
// components
import {
  serverDateFormat,
  timeFormat24HourWithSecond,
  Tooltip,
} from '@/components'

const WEEKDAYS = {
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thurs',
  5: 'fri',
  6: 'sat',
  7: 'sun',
}

const TimeSlotComponent = ({
  displayDate,
  calendarView,
  clinicBreakHours,
  children,
  value,
}) => {
  if (calendarView === BigCalendar.Views.MONTH) return children

  if (children.props.children) return children

  const currentViewDate = moment(displayDate).formatUTC()
  const currentDayOfWeek = WEEKDAYS[moment(displayDate).weekday()]

  const _currentDate = moment(value).format(serverDateFormat)
  const _currentTime = moment(value).format(timeFormat24HourWithSecond)
  const breakHour = clinicBreakHours.filter(
    (item) =>
      moment(value).isSameOrAfter(moment(item.effectiveStartDate)) &&
      item[`${currentDayOfWeek}FromBreak`] &&
      item[`${currentDayOfWeek}ToBreak`],
  )
  if (breakHour.length > 0) {
    const day = WEEKDAYS[moment(value).weekday()]
    const sameDateTimeBreakHour = breakHour.filter(
      (item) => item[`${day}FromBreak`] === _currentTime,
    )
    const label = sameDateTimeBreakHour.reduce(
      (labels, bh) => [
        ...labels,
        bh.displayValue,
      ],
      [],
    )
    const withinEndTime = breakHour.filter((item) =>
      moment(_currentTime, timeFormat24HourWithSecond).isBetween(
        moment(item[`${day}FromBreak`], timeFormat24HourWithSecond),
        moment(item[`${day}ToBreak`], timeFormat24HourWithSecond),
      ),
    )

    if (label.length > 0)
      return (
        <div
          style={{
            backgroundColor: '#dbdbdb',
            color: '#6f6f6f',
            height: 40,
          }}
        >
          <span>{label.join(',')}</span>
        </div>
      )
    if (withinEndTime.length > 0)
      return (
        <div
          style={{ backgroundColor: '#dbdbdb', color: '#6f6f6f', height: 40 }}
        />
      )
  }
  return children
}

export default connect(({ calendar }) => ({
  displayDate: calendar.currentViewDate,
  calendarView: calendar.calendarView,
  clinicBreakHours: calendar.clinicBreakHourList || [],
}))(TimeSlotComponent)
