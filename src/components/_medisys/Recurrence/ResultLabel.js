import React from 'react'
import { RRule } from 'rrule'
import moment from 'moment'
// constants
import { RECURRENCE_PATTERN, RECURRENCE_RANGE, DAYS_OF_WEEK } from './const.js'
// utils
import { formatDateToText } from '@/utils/dateUtils'

const defaultRule = {
  freq: 1,
  count: 1,
  dtstart: new Date(),
}

const getEndType = (range, count, endDate) => {
  if (range === RECURRENCE_RANGE.AFTER) return { count }

  const until = moment(endDate).toDate()
  return {
    until: new Date(
      Date.UTC(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate()),
    ),
  }
}

const getWeekConfig = (weekdays) => ({
  byweekday: [
    ...weekdays,
  ],
})

const getMonthConfig = (dayOfMonth) => ({ bymonthday: dayOfMonth })

const joinWeekDays = (selectedDays) => {
  const days = [
    ...selectedDays,
  ]
    .sort()
    .map((d) => DAYS_OF_WEEK[d])
    .join(', ')
  const pos = days.lastIndexOf(',')

  const result = `${days.substring(0, pos)} and${days.substring(pos + 1)}`
  return result
}

const RRuleFreq = {
  [RECURRENCE_PATTERN.DAILY]: RRule.DAILY,
  [RECURRENCE_PATTERN.WEEKLY]: RRule.WEEKLY,
  [RECURRENCE_PATTERN.MONTHLY]: RRule.MONTHLY,
}

const computeRRule = ({ startDate, recurrenceDto }) => {
  let rule = new RRule(defaultRule)
  const {
    recurrencePatternFK,
    recurrenceFrequency = 1,
    recurrenceEndDate,
    recurrenceCount,
    recurrenceRange,
    recurrenceDayOfTheMonth,
    recurrenceDaysOfTheWeek,
  } = recurrenceDto
  try {
    const start = moment(startDate).toDate()

    const interval = recurrenceFrequency
    const endType = getEndType(
      recurrenceRange,
      recurrenceCount,
      recurrenceEndDate,
    )
    let otherConfig = {}
    if (recurrencePatternFK === RECURRENCE_PATTERN.WEEKLY)
      otherConfig = getWeekConfig(recurrenceDaysOfTheWeek)

    if (recurrencePatternFK === RECURRENCE_PATTERN.MONTHLY)
      otherConfig = getMonthConfig(recurrenceDayOfTheMonth)

    const ruleConfig = {
      freq: RRuleFreq[recurrencePatternFK],
      dtstart: new Date(
        start.getUTCFullYear(),
        start.getUTCMonth(),
        start.getUTCDate(),
        start.getUTCHours(),
        start.getUTCMinutes(),
      ),
      interval,
      ...otherConfig,
      ...endType,
    }

    rule = new RRule(ruleConfig)
  } catch (error) {
    rule = undefined
  }

  return rule
}

const computeLabel = ({ rule, date, recurrenceDto }) => {
  let label = ''
  try {
    const startDate = formatDateToText(date)
    const stopDate =
      rule.options.until === null
        ? formatDateToText(rule.all()[rule.all().length - 1])
        : formatDateToText(rule.options.until)

    const {
      recurrencePatternFK,
      recurrenceFrequency,
      recurrenceDayOfTheMonth,
      recurrenceDaysOfTheWeek,
    } = recurrenceDto
    if (
      (recurrencePatternFK === RECURRENCE_PATTERN.DAILY &&
        !recurrenceFrequency) ||
      (recurrencePatternFK === RECURRENCE_PATTERN.WEEKLY &&
        (!recurrenceFrequency || recurrenceDaysOfTheWeek.length === 0)) ||
      (recurrencePatternFK === RECURRENCE_PATTERN.MONTHLY &&
        (!recurrenceFrequency || !recurrenceDayOfTheMonth))
    )
      throw Error('Not enough info to compute label')

    const plural = recurrenceFrequency > 1 ? 's' : ''
    switch (recurrencePatternFK) {
      case RECURRENCE_PATTERN.DAILY: {
        label = `Occur every ${recurrenceFrequency} day${plural} effective ${startDate}`
        break
      }
      case RECURRENCE_PATTERN.WEEKLY: {
        const days = joinWeekDays(recurrenceDaysOfTheWeek)
        label = `Occur every ${recurrenceFrequency} week${plural} on ${days} effective ${startDate} until ${stopDate} `
        break
      }
      case RECURRENCE_PATTERN.MONTHLY: {
        label = `Occurs day ${recurrenceDayOfTheMonth} of every ${recurrenceFrequency} month${plural} effective ${startDate} until ${stopDate}`
        break
      }
      default:
        break
    }
  } catch (error) {
    label = ''
  }
  return label
}

const RecurrenceList = ({ recurrenceDto, date }) => {
  const rule = computeRRule({ date, recurrenceDto })
  const label = computeLabel({ rule, date, recurrenceDto })

  return (
    <div>
      <span>{label}</span>
    </div>
  )
}

export default RecurrenceList
