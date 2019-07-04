import moment from 'moment'

export const DATE_NAVIGATOR_ACTION = {
  ADD: 'add',
  SUBTRACT: 'subtract',
  BACK_TO_TODAY: 'today',
}

export const CALENDAR_VIEWS = {
  DAY: 'Day View',
  WEEK: 'Week View',
  MONTH: 'Month View',
}

export const _dateFormat = 'DD MMM YYYY'

export const getDateValue = (v) => {
  if (!v) return v
  if (moment.isMoment(v)) {
    return v.format(_dateFormat)
  }
  return moment(v).isValid() ? moment(v).format(_dateFormat) : v
}

export const getWeek = (date) => {
  if (!moment(date).isValid()) {
    return date
  }
  const currentDay = moment(date)
  const startOfWeek = getDateValue(currentDay.startOf('week'))
  const endOfWeek = getDateValue(currentDay.endOf('week'))

  return `${startOfWeek} - ${endOfWeek}`
}

export const getMonth = (date) => {
  if (!moment(date).isValid()) {
    return date
  }
  return moment(date).format('MMM YYYY')
}
