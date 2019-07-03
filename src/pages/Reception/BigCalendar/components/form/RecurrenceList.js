import React from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
// constant variables
import { RECURRENCE_RANGE, RECURRENCE_PATTERN, _dateFormat } from './variables'

const mapRecurrencePatternToRRuleFeq = {
  [RECURRENCE_PATTERN.DAILY]: RRule.DAILY,
  [RECURRENCE_PATTERN.WEEKLY]: RRule.WEEKLY,
  [RECURRENCE_PATTERN.MONTHLY]: RRule.MONTHLY,
}

const getRRule = ({
  start,
  stopDate,
  recurrencePattern: freq,
  every: interval = 1,
  recurrenceRange,
  occurence = 1,
  day,
  days = [],
}) => {
  const until = moment(stopDate).toDate()

  const endType =
    recurrenceRange === RECURRENCE_RANGE.AFTER
      ? { count: occurence === null || occurence === '' ? 1 : occurence }
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
    extra.byweekday = [
      ...days,
    ]
  }

  if (mapRecurrencePatternToRRuleFeq[freq] === RRule.MONTHLY) {
    extra.bymonthday = day
  }

  const rule = new RRule({
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
    interval,
    ...extra,
    ...endType,
  })
  return rule
}

const recurrencesToString = (list, occ, index) =>
  index < 5
    ? [
        ...list,
        moment(occ).format(_dateFormat),
      ]
    : [
        ...list,
      ]

const RecurrenceList = ({ values }) => {
  console.log({ values })
  const rule = getRRule(values)
  console.log({ string: rule.toString(), all: rule.all() })
  return (
    <h4 style={{ textOverflow: 'ellipsis', display: 'inline-block' }}>
      {rule.all().reduce(recurrencesToString, []).join(', ')}
      {rule.all().length > 5 ? '...' : ''}
    </h4>
  )
}

export default RecurrenceList
