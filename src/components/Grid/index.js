import moment from 'moment'
import React from 'react'
import nzh from 'nzh/cn'
import { parse, stringify } from 'qs'
import numeral from 'numeral'
import {
  Column,
  FilteringState,
  GroupingState,
  IntegratedFiltering,
  IntegratedGrouping,
  IntegratedPaging,
  IntegratedSelection,
  IntegratedSorting,
  PagingState,
  SelectionState,
  SortingState,
  DataTypeProvider,
  DataTypeProviderProps,
} from '@devexpress/dx-react-grid'

const currencyFormat = '$0,0.00'
const qtyFormat = '0.0'
function NumberFormatter ({ column, ...prop }) {
  // console.log(prop, this)
  let config
  if (this) {
    config = this.config[column.name] || {}
  }
  let propConvert = prop
  if (typeof prop === 'number') {
    propConvert = { value: prop }
  }
  let { value, color = 'darkblue', text } = propConvert

  if (color === 'darkblue' && value && `${value}`.indexOf('-') === 0)
    color = 'red'
  if (config && config.currency) {
    if (text) return numeral(value).format(currencyFormat)
    return <b style={{ color }}>{numeral(value).format(currencyFormat)}</b>
  }
  if (text) return numeral(value).format(qtyFormat)
  return <b style={{ color }}>{numeral(value).format(qtyFormat)}</b>
}
export function TextfieldEditor (props) {
  // console.log('textfieldeditor', props)
  const { paras, value, classes, column, ...resetProps } = props
  const { inputProps } = column
  const { name, value: v, ...otherInputProps } = inputProps
  if (name) {
    return (
      <FastField
        name={name}
        render={(args) => {
          // console.log(args)
          return (
            <CustomInput
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
    <CustomInput
      value={v || value}
      noWrapper
      {...resetProps}
      {...otherInputProps}
    />
  )
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
let _dateFormat = 'DD-MMM-YYYY'
const DateFormatter = (columnExtensions) => ({ value }) => {
  // console.log(value)
  if (!value) return null
  return moment.isMoment(value)
    ? v.format(_dateFormat)
    : moment(value).isValid() ? moment(value).format(_dateFormat) : value
}

const DateTypeProvider = (props) => {
  return (
    <DataTypeProvider
      formatterComponent={DateFormatter(props.columnExtensions)}
      {...props}
    />
  )
}

const NumberTypeProvider = (props) => {
  console.warn(
    'Depecrated warning. This components will be removed in the future. Please avoid using this component',
  )
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

const TextTypeProvider = ({ config, ...restProps }) => {
  return (
    <DataTypeProvider
      editorComponent={TextfieldEditor.bind({ config })}
      {...restProps}
    />
  )
}

module.exports = {
  TextTypeProvider,
  DateTypeProvider,
  NumberTypeProvider,
  QtyTypeProvider,
  NumberFormatter,
  currencyFormat,
  qtyFormat,
  ...module.exports,
}
