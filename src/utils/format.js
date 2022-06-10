import moment from 'moment'
import React from 'react'
import numeral from 'numeral'

import { currencyFormat, qtyFormat, currencySymbol } from './config'

function NumberFormatter(p) {
  const { column } = p
  let cfg
  if (this) {
    cfg = this.config[column.name] || {}
  }
  let propConvert = p
  if (typeof p === 'number') {
    propConvert = { value: p }
  }
  let { value, color = 'darkblue', text } = propConvert

  if (color === 'darkblue' && value && `${value}`.indexOf('-') === 0)
    color = 'red'
  if (cfg && cfg.currency) {
    if (text) return numeral(value).format(currencyFormat)
    return (
      <b style={{ color }}>
        {currencySymbol}
        {numeral(value).format(currencyFormat)}
      </b>
    )
  }
  if (text) return numeral(value).format(qtyFormat)
  return <b style={{ color }}>{numeral(value).format(qtyFormat)}</b>
}
const dateFormatLong = 'DD MMM YYYY'
const dateFormat = 'DD-MM-YYYY'
const reversedDateFormat = 'YYYY-MM-DD'
const dateFormatWithTime = 'DD-MM-YYYY HH:mm:ss'
const dateFormatLongWithTime = 'DD MMM YYYY HH:mm:ss'
const dateFormatLongWithTime12h = 'DD MMM YYYY hh:mm:ss A'
const dateFormatLongWithTimeNoSec = 'DD MMM YYYY HH:mm'
const dateFormatLongWithTimeNoSec12h = 'DD MMM YYYY hh:mm A'
const timeFormatWithSecond = 'hh:mm:ss'
const timeFormatWithoutSecond = 'HH:mm'
const fullDateTime = 'DD-MM-YYYY hh:mm A'
const serverDateFormat = 'YYYY-MM-DD'
const serverDateTimeFormatFull = 'YYYY-MM-DDTHH:mm:ss'
const labSpecimenLabelDateFormat = 'DD/MM/YYYY HH:mm:ss'
const timeFormat = 'hh:mm A'
const timeFormatSmallCase = 'hh:mm a'
const timeFormat24Hour = 'HH:mm'
const timeFormat24HourWithSecond = 'hh:mm:ss A'
const additionalShortcutFormats = [
  'DD/MM/YY',
  'DD-MM-YY',
  'DD MM YY',
  'D/MM/YY',
  'D-MM-YY',
  'D -MM YY',
  'DD/M/YY',
  'DD-M-YY',
  'DD M YY',
  'D/M/YY',
  'D-M-YY',
  'D M YY',
  'DD/MM/YYYY',
  'DD-MM-YYYY',
  'DD MM YYYY',
  'D/MM/YYYY',
  'DD/M/YYYY',
  'DD-M-YYYY',
  'DD M YYYY',
  'D/M/YYYY',
  'D-M-YYYY',
  'D M YYYY',
  'YYYY/MM/DD',
  'YYYY-MM-DD',
  'YYYY MM DD',
  'YYYYMMDD',
]

const DateFormatter = ({ value, full = false, format }) => {
  const _format = format || (full ? fullDateTime : dateFormatLong)
  if (!value) return null
  if (moment.isMoment(value)) return value.format(_format)

  return moment(value).isValid() ? moment(value).format(_format) : value

  // return moment.isMoment(value)
  //   ? value.format(format)
  //   : moment(value).isValid() ? moment(value).format(format) : value
}

export {
  NumberFormatter,
  DateFormatter,
  currencyFormat,
  qtyFormat,
  dateFormat,
  reversedDateFormat,
  dateFormatWithTime,
  dateFormatLongWithTime,
  dateFormatLongWithTimeNoSec,
  dateFormatLongWithTimeNoSec12h,
  dateFormatLongWithTime12h,
  dateFormatLong,
  fullDateTime,
  timeFormatSmallCase,
  serverDateFormat,
  serverDateTimeFormatFull,
  labSpecimenLabelDateFormat,
  timeFormat,
  timeFormatWithSecond,
  timeFormatWithoutSecond,
  timeFormat24HourWithSecond,
  timeFormat24Hour,
  additionalShortcutFormats,
}
