import React from 'react'
import { connect } from 'dva'
import moment from 'moment'
// big calendar
import BigCalendar from 'react-big-calendar'
// components
import { timeFormat24HourWithSecond as timeFormat } from '@/components'

const WEEKDAYS = {
  0: 'sun',
  1: 'mon',
  2: 'tue',
  3: 'wed',
  4: 'thurs',
  5: 'fri',
  6: 'sat',
}

let calculatedOperationHour = []
let calculatedBreakHour = []

const checkIsBeforeOrAfterOperationHour = (operationHour, currentTime) => {
  console.log('checkIsBeforeOrAfterOperationHour')
  const _currentTime = moment(currentTime).format(timeFormat)
  const _operationHourFromSuffix = 'FromOpHour'
  const _operationHourToSuffix = 'ToOpHour'
  const day = WEEKDAYS[moment(currentTime).weekday()]

  const isBeforeOrAfter = operationHour.filter((item) => {
    const startOperation = moment(
      item[`${day}${_operationHourFromSuffix}`],
      timeFormat,
    )
    const endOperation = moment(
      item[`${day}${_operationHourToSuffix}`],
      timeFormat,
    )
    return (
      moment(_currentTime, timeFormat).isBefore(startOperation) ||
      moment(_currentTime, timeFormat).isAfter(endOperation)
    )
  })
  return isBeforeOrAfter.length > 0
}

const checkIsWithinBreakHour = (breakHour, currentTime) => {
  const _currentTime = moment(currentTime).format(timeFormat)
  const _breakHourFromSuffix = 'FromBreak'
  const _breakHourToSuffix = 'ToBreak'
  const day = WEEKDAYS[moment(currentTime).weekday()]

  const isWithin = breakHour.filter((item) => {
    const startBreakHour = moment(
      item[`${day}${_breakHourFromSuffix}`],
      timeFormat,
    )
    const endBreakHour = moment(item[`${day}${_breakHourToSuffix}`], timeFormat)
    return (
      moment(_currentTime, timeFormat).isSameOrAfter(startBreakHour) &&
      moment(_currentTime, timeFormat).isSameOrBefore(endBreakHour)
    )
  })
  const isSameAsStartBreakHour = isWithin.find((item) => {
    const startBreakHour = moment(
      item[`${day}${_breakHourFromSuffix}`],
      timeFormat,
    )
    return moment(_currentTime, timeFormat).isSame(startBreakHour)
  })
  return {
    isWithin: isWithin.length > 0,
    isSameAsStartBreakHour: isSameAsStartBreakHour !== undefined,
  }
}

const checkIsTodayPublicHoliday = (publicHolidays, currentTime) => {
  const currentDate = moment(currentTime)

  const isPublicHoliday = publicHolidays.find((item) => {
    const startDate = moment(item.startDate)
    const endDate = moment(item.endDate)
    if (currentDate.isBetween(startDate, endDate, 'days', '[]')) {
      return true
    }
    return false
  })
  const holidayLabel = isPublicHoliday ? isPublicHoliday.displayValue : ''

  return { isPublicHoliday, holidayLabel }
}

const TimeSlotComponent = ({
  calendarView,
  publicHolidays,
  clinicBreakHours,
  clinicOperationHours,
  children,
  value,
}) => {
  if (calendarView === BigCalendar.Views.MONTH) return children
  if (children.props.children) return children
  const timeSlot = moment(value).format(timeFormat)
  const currentDayOfWeek = WEEKDAYS[moment(value).weekday()]

  const { isPublicHoliday, holidayLabel } = checkIsTodayPublicHoliday(
    publicHolidays,
    value,
  )

  if (isPublicHoliday) {
    if (timeSlot === '07:00:00')
      return (
        <div
          style={{
            backgroundColor: '#7d7d7d',
            color: '#fff',
            minHeight: '39px',
            maxHeight: '39px',
            paddingLeft: 8,
          }}
        >
          <span>{holidayLabel}</span>
        </div>
      )

    return (
      <div
        style={{
          backgroundColor: '#7d7d7d',
          color: '#fff',
          minHeight: '39px',
          maxHeight: '39px',
        }}
      />
    )
  }

  const breakHour = clinicBreakHours.filter(
    (item) =>
      moment(value).isSameOrAfter(moment(item.effectiveStartDate)) &&
      item[`${currentDayOfWeek}FromBreak`] &&
      item[`${currentDayOfWeek}ToBreak`],
  )
  const operationHour = clinicOperationHours.filter(
    (item) =>
      moment(value).isSameOrAfter(moment(item.effectiveStartDate)) &&
      item[`${currentDayOfWeek}FromOpHour`] &&
      item[`${currentDayOfWeek}ToOpHour`],
  )

  // const existedOperationHour = calculatedOperationHour.includes(value)
  // console.log({ existedOperationHour })
  const isBeforeOrAfterOperationHour = checkIsBeforeOrAfterOperationHour(
    operationHour,
    value,
  )

  const { isWithin, isSameAsStartBreakHour } = checkIsWithinBreakHour(
    breakHour,
    value,
  )

  if (isBeforeOrAfterOperationHour) {
    // if (!existedOperationHour) calculatedOperationHour.push(value)
    return (
      <div
        style={{
          backgroundColor: '#7d7d7d',
          color: '#fff',
          minHeight: '39px',
          maxHeight: '39px',
        }}
      >
        <span>Non-Operation Hour</span>
      </div>
    )
  }

  if (isWithin) {
    if (isSameAsStartBreakHour)
      return (
        <div
          style={{
            backgroundColor: '#7d7d7d',
            color: '#fff',
            minHeight: '39px',
            maxHeight: '39px',
          }}
        >
          <span>Break Hour</span>
        </div>
      )
    return (
      <div
        style={{
          backgroundColor: '#7d7d7d',
          color: '#fff',
          minHeight: '39px',
          maxHeight: '39px',
        }}
      />
    )
  }

  return children
}

export default connect(({ calendar }) => ({
  calendarView: calendar.calendarView,
  clinicBreakHours: calendar.clinicBreakHourList || [],
  clinicOperationHours: calendar.clinicOperationHourList || [],
  publicHolidays: calendar.publicHolidayList || [],
}))(TimeSlotComponent)
