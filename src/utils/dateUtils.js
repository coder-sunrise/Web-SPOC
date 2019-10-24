import moment from 'moment'
import { serverDateFormat } from '@/components'

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

export const calculateAgeFromDOB = (dob) =>
  Math.floor(moment.duration(moment().diff(dob)).asYears())
