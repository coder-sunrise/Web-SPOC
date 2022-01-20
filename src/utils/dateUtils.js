import moment from 'moment'
import { serverDateFormat } from '@/utils/format'
import { AGETYPE } from '@/utils/constants'

export const formatDateToText = (value = undefined, parseFormat) => {
  if (moment.isMoment(value)) return value.format(serverDateFormat)

  if (value instanceof Date) return moment(value).format(serverDateFormat)

  if (parseFormat) {
    if (moment(value, parseFormat).isValid())
      return moment(value, parseFormat).format(serverDateFormat)
  }

  if (moment(value).isValid()) return moment(value).format(serverDateFormat)
  return value
}

export const calculateAgeFromDOB = dob =>
  Math.floor(moment.duration(moment().diff(dob)).asYears())

export const formatDatesToUTC = dates => {
  if (Array.isArray(dates) && dates.length > 0) {
    return [moment(dates[0]).formatUTC(), moment(dates[1]).formatUTC(false)]
  }

  return []
}

export const calculateAgeType = (dob, date) => {
  const year = Math.floor(moment.duration(moment(date).diff(dob)).asYears())
  if (year >= 16) return AGETYPE.ADULT
  if (year >= 6) return AGETYPE.YOUTH
  const month = Math.floor(moment.duration(moment(date).diff(dob)).asMonths())
  if (month >= 3) return AGETYPE.CHILD
}
