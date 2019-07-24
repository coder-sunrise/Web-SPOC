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
              noWrapper
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
      noWrapper
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
let dateFormatLong = 'DD-MMM-YYYY'
let dateFormat = 'DD-MM-YYYY'
const timeFormat = 'hh:mm a'
const fullDateTime = 'DD-MM-YYYY hh:mm a'

const TimeFormatter = ({ value }) => {
  if (!value) return null

  if (moment.isMoment(value)) {
    return value.format(fullDateTime)
  }

  if (moment(value).isValid()) {
    return moment(value).format(fullDateTime)
  }

  return value
}

const DateFormatter = ({ value }) => {
  // console.log(value)
  if (!value) return null
  return moment.isMoment(value)
    ? value.format(dateFormatLong)
    : moment(value).isValid() ? moment(value).format(dateFormatLong) : value
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
  dateFormatLong,
  ...module.exports,
}
