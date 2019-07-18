import React from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
// constant variables
import {
  RECURRENCE_RANGE,
  RECURRENCE_PATTERN,
  DAYS_OF_WEEK,
  _dateFormat,
} from './variables'

const mapRecurrencePatternToRRuleFeq = {
  [RECURRENCE_PATTERN.DAILY]: RRule.DAILY,
  [RECURRENCE_PATTERN.WEEKLY]: RRule.WEEKLY,
  [RECURRENCE_PATTERN.MONTHLY]: RRule.MONTHLY,
}

const getRRule = (
  {
    eventDate: doctorBlockStartDate,
    appointmentDate: eventStartDate,
    stopDate,
    recurrencePattern: freq,
    every,
    recurrenceRange,
    occurence = 1,
    day,
    days = [],
  },
  isDoctorBlock,
) => {
  let rule = new RRule({ freq: 1, count: 1, dtstart: new Date() })
  try {
    const start = isDoctorBlock
      ? moment(doctorBlockStartDate).toDate()
      : moment(eventStartDate).toDate()
    const until = moment(stopDate).toDate()

    const endType =
      recurrenceRange === RECURRENCE_RANGE.AFTER
        ? {
            count:
              occurence === null || occurence === '' || occurence < 0
                ? 1
                : occurence,
          }
        : {
            until: new Date(
              Date.UTC(
                until.getUTCFullYear(),
                until.getUTCMonth(),
                until.getUTCDate(),
              ),
            ),
          }

    let extra = {}
    if (mapRecurrencePatternToRRuleFeq[freq] === RRule.WEEKLY) {
      if (days.length !== 0) {
        extra.byweekday = [
          ...days,
        ]
      }
      extra.wkst = RRule.MO
    }

    if (mapRecurrencePatternToRRuleFeq[freq] === RRule.MONTHLY) {
      extra.bymonthday = day
    }

    rule = new RRule({
      freq: mapRecurrencePatternToRRuleFeq[freq],
      dtstart: new Date(
        Date.UTC(
          start.getUTCFullYear(),
          start.getUTCMonth(),
          start.getUTCDate(),
          start.getUTCHours(),
          start.getUTCMinutes(),
        ),
      ),
      interval: every === null || every === '' || every < 0 ? 1 : every,
      ...extra,
      ...endType,
    })
  } catch (error) {
    console.error({ error })
    rule = undefined
  }
  return rule
}

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

const formatRecurrenceLabel = (
  {
    recurrencePattern,
    every,
    day: dayOfMonth,
    days: weekdays = [],
    appointmentDate: startDate,
  },
  rule,
) => {
  let result = ''

  let until = ''
  if (rule.options.until == null) {
    const lastDate = rule.all()[rule.all().length - 1]
    const parsedLastDate = moment(lastDate).format(_dateFormat)
    until = parsedLastDate
  } else {
    const parsedDate = moment(rule.options.until)
    until = parsedDate.format(_dateFormat)
  }

  const plural = every > 1 ? 's' : ''
  switch (recurrencePattern) {
    case RECURRENCE_PATTERN.DAILY: {
      result = `Occur every ${every} day${plural} effective ${startDate}`
      break
    }
    case RECURRENCE_PATTERN.WEEKLY: {
      const days = joinWeekDays(weekdays)
      result = `Occur every ${every} week${plural} on ${days} effective ${startDate} until ${until} `
      break
    }
    case RECURRENCE_PATTERN.MONTHLY: {
      result = `Occurs day ${dayOfMonth} of every ${every} month${plural} effective ${startDate} until ${until}`
      break
    }
    default:
      break
  }
  return result
}

const RecurrenceList = ({ values, isDoctorBlock }) => {
  const rule = getRRule(values, isDoctorBlock)
  const label = rule !== undefined ? formatRecurrenceLabel(values, rule) : ''

  return (
    <div>
      <h5>{label}</h5>
    </div>
  )
}

export default RecurrenceList
