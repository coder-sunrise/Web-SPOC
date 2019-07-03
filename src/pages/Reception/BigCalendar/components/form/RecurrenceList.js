import React, { useState } from 'react'
import moment from 'moment'
import { RRule } from 'rrule'
// material ui
import { Popper, Fade, withStyles } from '@material-ui/core'
// common component
import { CardContainer } from '@/components'
// constant variables
import { RECURRENCE_RANGE, RECURRENCE_PATTERN, _dateFormat } from './variables'

const styles = (theme) => ({
  recurrenceList: { textOverflow: 'ellipsis', display: 'inline-block' },
  popoverContent: { display: 'block' },
  popoverContainer: { zIndex: 2060 },
})

const mapRecurrencePatternToRRuleFeq = {
  [RECURRENCE_PATTERN.DAILY]: RRule.DAILY,
  [RECURRENCE_PATTERN.WEEKLY]: RRule.WEEKLY,
  [RECURRENCE_PATTERN.MONTHLY]: RRule.MONTHLY,
}

const getRRule = ({
  start,
  stopDate,
  recurrencePattern: freq,
  every,
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
    interval: every === null || every === '' ? 1 : every,
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

const RecurrenceList = ({ classes, values }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = useState(null)

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMouseLeave = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const popoverID = open ? 'recurrencelist-popper' : undefined

  const rule = getRRule(values)
  console.log({ open, anchorEl })
  return (
    <div>
      <Popper
        id={popoverID}
        open={open}
        anchorEl={anchorEl}
        transition
        placement='top-end'
        className={classes.popoverContainer}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={500}>
            <CardContainer hideHeader>
              {rule
                .all()
                .map((reccurence) => (
                  <span className={classes.popoverContent}>
                    {moment(reccurence).format(_dateFormat)}
                  </span>
                ))}
            </CardContainer>
          </Fade>
        )}
      </Popper>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <h5 className={classes.recurrenceList}>
          {rule.all().reduce(recurrencesToString, []).join(', ')}
          {rule.all().length > 5 ? '...' : ''}
        </h5>
      </div>
    </div>
  )
}

export default withStyles(styles, { name: 'RecurrenceList' })(RecurrenceList)
