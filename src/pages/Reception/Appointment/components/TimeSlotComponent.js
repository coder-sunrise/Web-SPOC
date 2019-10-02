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

const TimeSlotComponent = ({
  calendarView,
  clinicBreakHours,
  clinicOperationHours,
  children,
  value,
}) => {
  if (calendarView === BigCalendar.Views.MONTH) return children
  if (children.props.children) return children

  const currentDayOfWeek = WEEKDAYS[moment(value).weekday()]
  const _currentTime = moment(value).format(timeFormat)

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

  const sourceList = [
    ...breakHour,
    ...operationHour,
  ]
  const _breakHourFromSuffix = 'FromBreak'
  const _breakHourToSuffix = 'ToBreak'

  const _operationHourFromSuffix = 'FromOpHour'
  const _operationHourToSuffix = 'ToOpHour'

  const day = WEEKDAYS[moment(value).weekday()]
  const sameDateTimeSource = sourceList.filter((item) => {
    const _fromSuffix =
      item[`${day}${_breakHourFromSuffix}`] === undefined
        ? _operationHourFromSuffix
        : _breakHourFromSuffix

    return moment(item[`${day}${_fromSuffix}`], timeFormat).isBetween(
      moment(_currentTime, timeFormat),
      moment(_currentTime, timeFormat).add(15, 'minute'),
      'minute',
      '[)',
    )
  })
  const label = sameDateTimeSource.reduce(
    (labels, source) => [
      ...labels,
      source.displayValue,
    ],
    [],
  )
  const withinEndTime = sourceList.filter((item) => {
    const _fromSuffix =
      item[`${day}${_breakHourFromSuffix}`] === undefined
        ? _operationHourFromSuffix
        : _breakHourFromSuffix
    const _toSuffix =
      item[`${day}${_breakHourToSuffix}`] === undefined
        ? _operationHourToSuffix
        : _breakHourToSuffix

    return moment(_currentTime, timeFormat).isBetween(
      moment(item[`${day}${_fromSuffix}`], timeFormat, 'minute', '[]'),
      moment(item[`${day}${_toSuffix}`], timeFormat, 'minute', '[]'),
    )
  })

  if (label.length > 0)
    return (
      <div
        style={{
          backgroundColor: '#7d7d7d',
          color: '#fff',
          minHeight: '39px',
          maxHeight: '39px',
        }}
      >
        <span>{label.join(',')}</span>
      </div>
    )

  if (withinEndTime.length > 0)
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

  return children
}

export default connect(({ calendar }) => ({
  calendarView: calendar.calendarView,
  clinicBreakHours: calendar.clinicBreakHourList || [],
  clinicOperationHours: calendar.clinicOperationHourList || [],
}))(TimeSlotComponent)
