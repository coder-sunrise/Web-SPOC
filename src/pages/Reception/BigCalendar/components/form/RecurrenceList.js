import React from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
// common components
import { serverDateFormat } from '@/components'
// constant variables
import { RECURRENCE_RANGE, RECURRENCE_PATTERN, DAYS_OF_WEEK } from './variables'
// utils
import { formatDateToText } from '@/utils/dateUtils'

const mapRecurrencePatternToRRuleFeq = {
  [RECURRENCE_PATTERN.DAILY]: RRule.DAILY,
  [RECURRENCE_PATTERN.WEEKLY]: RRule.WEEKLY,
  [RECURRENCE_PATTERN.MONTHLY]: RRule.MONTHLY,
}

const getRRule = (
  {
    eventDate: doctorBlockStartDate,
    appointmentDate: eventStartDate,
    recurrenceRange,
  },
  {
    recurrencePatternFK: freq,
    recurrenceFrequency: every,
    recurrenceDayOfTheMonth: day,
    recurrenceDaysOfTheWeek: days,
    recurrenceCount: occurence,
    recurrenceEndDate: stopDate,
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
    // recurrencePattern,
    // recurrenceFrequency: every,
    // day: dayOfMonth,
    // days: weekdays = [],
    appointmentDate,
    eventDate: doctorBlockStartDate,
  },
  {
    recurrencePatternFK: recurrencePattern,
    recurrenceFrequency: every,
    recurrenceDayOfTheMonth: dayOfMonth,
    recurrenceDaysOfTheWeek: weekdays,
  },
  rule,
) => {
  let result = ''

  const startDate =
    appointmentDate === undefined
      ? moment(doctorBlockStartDate).format(serverDateFormat)
      : formatDateToText(appointmentDate)

  let until = ''

  if (rule.options.until === null) {
    const lastDate = rule.all()[rule.all().length - 1]
    const parsedLastDate = moment(lastDate).format(serverDateFormat)
    until = parsedLastDate
  } else {
    const parsedDate = moment(rule.options.until)
    until = parsedDate.format(serverDateFormat)
  }

  if (recurrencePattern === RECURRENCE_PATTERN.DAILY && !every) return ''

  if (
    recurrencePattern === RECURRENCE_PATTERN.WEEKLY &&
    (!every || weekdays.length === 0)
  )
    return ''
  if (
    recurrencePattern === RECURRENCE_PATTERN.MONTHLY &&
    (!every || !dayOfMonth)
  )
    return ''

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

const RecurrenceList = ({
  values,
  recurrenceDto,
  isDoctorBlock,
  ...restProps
}) => {
  const rule = getRRule(values, recurrenceDto, isDoctorBlock)
  const label =
    rule !== undefined ? formatRecurrenceLabel(values, recurrenceDto, rule) : ''

  return (
    <div {...restProps}>
      <span>{label}</span>
    </div>
  )
}

export default RecurrenceList
