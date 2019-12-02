import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// big calendar
import BigCalendar from 'react-big-calendar'

const checkIsTodayPublicHoliday = (publicHolidays = [], currentTime) => {
  const currentDate = moment(currentTime)

  const holidays = publicHolidays.filter((item) => {
    const startDate = moment(item.startDate)
    const endDate = moment(item.endDate)
    if (currentDate.isBetween(startDate, endDate, 'days', '[]')) {
      return true
    }
    return false
  })
  const holidayLabel = holidays.length > 0 ? holidays[0].displayValue : ''

  return { isPublicHoliday: holidays.length > 0, holidayLabel }
}

const getHourAndMinute = (value) =>
  value.split(':').map((item) => parseInt(item, 10))

const compareOperationHour = (value, operationHour = []) => {
  const [
    valueHour,
    valueMinute,
  ] = getHourAndMinute(value)

  if (operationHour.length === 0) return false

  const isBeforeOperationHour = operationHour.reduce((_matched, item) => {
    const { start, end } = item
    if (!start || !end) return false
    const [
      startHour,
      startMinute,
    ] = getHourAndMinute(start)

    const [
      endHour,
      endMinute,
    ] = getHourAndMinute(end)
    const beforeStart =
      valueHour < startHour ||
      (valueHour === startHour && valueMinute <= startMinute)

    const afterEnd =
      valueHour > endHour || (valueHour === endHour && valueMinute >= endMinute)
    if (beforeStart || afterEnd) return true

    return _matched
  }, false)
  return isBeforeOperationHour
}

const compareBreakHour = (value, breakHour) => {
  const [
    valueHour,
    valueMinute,
  ] = getHourAndMinute(value)

  if (breakHour.length === 0) return false

  const isBreakHour = breakHour.reduce(
    (_matched, item) => {
      const { start, end } = item
      if (!start || !end) return false
      const [
        startHour,
        startMinute,
      ] = getHourAndMinute(start)

      const [
        endHour,
        endMinute,
      ] = getHourAndMinute(end)
      // 15:45 start
      // 16:15 value
      const afterStart =
        valueHour > startHour ||
        (valueHour === startHour && valueMinute >= startMinute)
      const beforeEnd =
        valueHour < endHour ||
        (valueHour === endHour && valueMinute <= endMinute)
      if (afterStart && beforeEnd)
        return {
          isBreakHour: true,
          same: valueHour === startHour && valueMinute === startMinute,
        }

      return _matched
    },
    { isBreakHour: false, same: false },
  )
  return isBreakHour
}

const Block = ({ label }) => (
  <div
    style={{
      backgroundColor: '#7d7d7d',
      color: '#fff',
      minHeight: '39px',
      maxHeight: '39px',
    }}
  >
    <span>{label}</span>
  </div>
)

const TimeSlotComponent = (props) => {
  const {
    calendarView,
    publicHolidays,
    clinicBreakHours,
    clinicOperationHours,
    children,
    value,
  } = props
  if (calendarView === BigCalendar.Views.MONTH) return children
  if (children.props.children) return children
  try {
    const timeSlot = moment(value).format('HH:mm:ss')
    const currentDayOfWeek = moment(value).weekday()

    const { isPublicHoliday, holidayLabel } =
      publicHolidays.length > 0
        ? checkIsTodayPublicHoliday(publicHolidays, value)
        : { isPublicHoliday: false, holidayLabel: '' }

    if (isPublicHoliday)
      return <Block label={timeSlot === '07:00:00' ? holidayLabel : ''} />

    const operationHour = clinicOperationHours[currentDayOfWeek]
    const breakHour = clinicBreakHours[currentDayOfWeek]

    const isBeforeOperationHour = operationHour
      ? compareOperationHour(timeSlot, operationHour)
      : false
    const { isBreakHour, same } = breakHour
      ? compareBreakHour(timeSlot, breakHour)
      : false

    if (isBeforeOperationHour) {
      return <Block label='Non-Operation Hour' />
    }

    if (isBreakHour) return <Block label={same ? 'Break Hour' : ''} />
  } catch (error) {
    console.log({ error })
  }
  return children
}

export default React.memo(
  connect(({ calendar }) => ({
    calendarView: calendar.calendarView,
    clinicBreakHours: calendar.clinicBreakHourList,
    clinicOperationHours: calendar.clinicOperationHourList,
    publicHolidays: calendar.publicHolidayList || [],
  }))(TimeSlotComponent),
)
