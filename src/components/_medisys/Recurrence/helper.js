import { RRule } from 'rrule'
import moment from 'moment'
// common components
import { dateFormatLong } from '@/components'
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

  // add one day to end date
  // RRule does not generate recurrence for end date
  const until = moment(endDate).add(1, 'days').toDate()
  return {
    until: new Date(
      Date.UTC(until.getUTCFullYear(), until.getUTCMonth(), until.getUTCDate()),
    ),
  }
}

const getWeekConfig = (weekdays) => ({
  byweekday:
    weekdays.length === 1
      ? weekdays[0]
      : [
          ...weekdays,
        ],
})

const getMonthConfig = (dayOfMonth) => {
  const endOfMonth = moment().endOf('month').date()
  let day =
    typeof dayOfMonth === 'number' ? dayOfMonth : parseInt(dayOfMonth, 10)
  if (Number.isNaN(day)) throw Error('invalid day of month')

  if (day > endOfMonth || day < 0) throw Error('invalid day of month')
  return { bymonthday: day }
}

const joinWeekDays = (selectedDays) => {
  const _days = selectedDays.filter((item) => item !== -99)
  const days = [
    ..._days,
  ]
    .sort()
    .map((d) => DAYS_OF_WEEK[d])
    .join(', ')
  const pos = days.lastIndexOf(',')

  const result = `${days.substring(0, pos)} ${selectedDays.length > 1
    ? 'and '
    : ''}${days.substring(pos + 1)}`
  return result
}

const RRuleFreq = {
  [RECURRENCE_PATTERN.DAILY]: RRule.DAILY,
  [RECURRENCE_PATTERN.WEEKLY]: RRule.WEEKLY,
  [RECURRENCE_PATTERN.MONTHLY]: RRule.MONTHLY,
}

export const computeRRule = ({ date, recurrenceDto }) => {
  let rule = new RRule(defaultRule)
  const {
    recurrencePatternFK,
    recurrenceFrequency = 1,
    recurrenceEndDate,
    recurrenceCount = 1,
    recurrenceRange,
    recurrenceDayOfTheMonth,
    recurrenceDaysOfTheWeek,
  } = recurrenceDto
  try {
    if (recurrenceCount < 0 || recurrenceFrequency < 0) {
      return undefined
    }
    const _tempDate = moment(date).toDate()

    const start = new Date(
      Date.UTC(
        _tempDate.getFullYear(),
        _tempDate.getMonth(),
        _tempDate.getDate(),
        _tempDate.getHours(),
        _tempDate.getMinutes(),
      ),
    )

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
      // tzid: 'Asia/Hong_Kong',
      wkst: RRule.SU,
      freq: RRuleFreq[recurrencePatternFK],
      dtstart: start,
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

export const computeLabel = ({ rule, date, recurrenceDto }) => {
  let label = ''
  try {
    const startDate = moment(date).format(dateFormatLong)
    let stopDate = formatDateToText(moment())

    if (rule.options.until === null) {
      const allDates = rule.all()
      stopDate = moment(allDates[allDates.length - 1]).format(dateFormatLong)
    } else {
      stopDate = moment(rule.options.until).format(dateFormatLong)
    }

    const {
      recurrencePatternFK,
      recurrenceFrequency,
      recurrenceDayOfTheMonth,
      recurrenceDaysOfTheWeek,
      recurrenceStartDate,
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
    const effectiveStartDate = recurrenceStartDate
      ? moment(recurrenceStartDate).format(dateFormatLong)
      : startDate
    switch (recurrencePatternFK) {
      case RECURRENCE_PATTERN.DAILY: {
        label = `Occurs every ${recurrenceFrequency} day${plural} effective ${effectiveStartDate}`
        break
      }
      case RECURRENCE_PATTERN.WEEKLY: {
        const days = joinWeekDays(recurrenceDaysOfTheWeek)
        label = `Occurs every ${recurrenceFrequency} week${plural} on ${days} effective ${effectiveStartDate} until ${stopDate} `
        break
      }
      case RECURRENCE_PATTERN.MONTHLY: {
        label = `Occurs day ${recurrenceDayOfTheMonth} of every ${recurrenceFrequency} month${plural} effective ${effectiveStartDate} until ${stopDate}`
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
