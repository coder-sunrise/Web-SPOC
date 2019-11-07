import moment from 'moment'
import React from 'react'
import nzh from 'nzh/cn'
import { parse, stringify } from 'qs'
import numeral from 'numeral'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

import config from '@/utils/config'

const { currencyFormat, qtyFormat, currencySymbol } = config

function NumberFormatter (p) {
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
export function NumberInputEditor (props) {
  const { paras, value, classes, column, ...resetProps } = props
  const { inputProps = {} } = column
  const { name, value: v, ...otherInputProps } = inputProps
  // console.log(inputProps)
  if (name) {
    return (
      <FastField
        name={name}
        render={(args) => {
          return (
            <NumberInput
              showErrorIcon
              simple
              {...resetProps}
              {...otherInputProps}
              {...args}
              onChange={(e) => {
                args.field.onChange({
                  target: {
                    value: e.target.value,
                    name: args.field.name,
                  },
                })
                if (otherInputProps.onChange) otherInputProps.onChange(e)
              }}
            />
          )
        }}
      />
    )
  }
  return (
    <NumberInput
      value={v || value}
      simple
      {...resetProps}
      {...otherInputProps}
    />
  )
}
export function NumberEditor (props) {
  return NumberInputEditor({
    currency: true,
    ...props,
  })
}

export function QtyEditor (props) {
  return NumberInputEditor({
    qty: true,
    ...props,
  })
}

export function QtyFormatter ({ value }) {
  return numeral(value).format(qtyFormat)
}

// const DateFormatter = ({ value }) => {
//   console.log(value)
//   return '123213' // moment.isMoment(value) ? value.format('LLL') : value
// }
const dateFormatLong = 'DD MMM YYYY'
const dateFormat = 'DD-MM-YYYY'
const dateFormatWithTime = 'DD-MM-YYYY HH:mm:ss'
const dateFormatLongWithTime = 'DD MMM YYYY HH:mm:ss'
const dateFormatLongWithTimeNoSec = 'DD MMM YYYY, HH:mm A'
// const timeFormat = 'HH:mm:ss'
const timeFormatWithoutSecond = 'HH:mm'
const fullDateTime = 'DD-MM-YYYY hh:mm A'
const serverDateFormat = 'YYYY-MM-DD'
const serverDateTimeFormatFull = 'YYYY-MM-DDTHH:mm:ss'
const timeFormat = 'hh:mm A'
const timeFormatSmallCase = 'hh:mm a'
const timeFormat24Hour = 'HH:mm'
const timeFormat24HourWithSecond = 'HH:mm:ss'
const additionalShortcutFormats = [
  'DD/MM/YY',
  'D/MM/YY',
  'DD/M/YY',
  'D/M/YY',
  'DD/MM/YYYY',
  'D/MM/YYYY',
  'DD/M/YYYY',
  'D/M/YYYY',
  'YYYY/MM/DD',
  'YYYY-MM-DD',
  'YYYYMMDD',
]

const TimeFormatter = ({ value, ...rest }) => {
  if (!value) return value

  if (moment.isMoment(value)) {
    return value.format(timeFormat)
  }

  if (moment(value, timeFormat).isValid()) {
    return moment(value, timeFormat).format(timeFormat)
  }

  return value
}

const DateFormatter = ({ value, full = false }) => {
  const format = full ? fullDateTime : dateFormatLong
  if (!value) return null
  if (moment.isMoment(value)) return value.format(format)

  return moment(value).isValid() ? moment(value).format(format) : value

  // return moment.isMoment(value)
  //   ? value.format(format)
  //   : moment(value).isValid() ? moment(value).format(format) : value
}

const TimeTypeProvider = (props) => {
  return <DataTypeProvider formatterComponent={TimeFormatter} {...props} />
}

const DateTypeProvider = (props) => {
  return <DataTypeProvider formatterComponent={DateFormatter} {...props} />
}

const NumberTypeProvider = (props) => {
  return (
    <DataTypeProvider
      formatterComponent={NumberFormatter}
      editorComponent={NumberEditor}
      {...props}
    />
  )
}

const QtyTypeProvider = (props) => {
  return (
    <DataTypeProvider
      formatterComponent={QtyFormatter}
      editorComponent={QtyEditor}
      {...props}
    />
  )
}

module.exports = {
  DateTypeProvider,
  TimeTypeProvider,
  NumberTypeProvider,
  QtyTypeProvider,
  NumberFormatter,
  DateFormatter,
  currencyFormat,
  qtyFormat,
  dateFormat,
  dateFormatWithTime,
  dateFormatLongWithTime,
  dateFormatLongWithTimeNoSec,
  dateFormatLong,
  fullDateTime,
  timeFormatSmallCase,
  serverDateFormat,
  serverDateTimeFormatFull,
  timeFormat,
  timeFormatWithoutSecond,
  timeFormat24HourWithSecond,
  timeFormat24Hour,
  additionalShortcutFormats,
  ...module.exports,
}
