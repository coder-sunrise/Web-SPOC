import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FastField } from 'formik'

import {
  DatePicker,
  DateTypeProvider as DateTypeProviderOrg,
} from '@/components'
import { DatePicker as ANTDatePicker } from 'antd'
// import DateTimePicker from './DateTimePicker'
// console.log(DateTypeProviderOrg)
const DateEditorBase = ({
  column: { name: columnName },
  value,
  onValueChange,
  columnExtensions,
}) => {
  const disabled = columnExtensions.some(
    ({ editingEnabled, columnName: currentColumnName }) =>
      currentColumnName === columnName && editingEnabled === false,
  )
  // DatePicker doesnt receive value props,
  // and only works with formik Field/FastField
  // TODO: enhance DatePicker
  // return <DatePicker disabled={disabled} timeFormat={false} />

  // temporary for testing only
  // if (columnName === 'invoiceDate')
  //   return (
  //     <FastField
  //       name={columnName}
  //       render={(args) => <DatePicker {...args} label='DateTimePicker' />}
  //     />
  //   )
  // // console.log(value)
  return (
    <DatePicker
      noWrapper
      timeFormat={false}
      defaultValue={value}
      onChange={onValueChange}
    />
  )
}

class DateTypeProvider extends PureComponent {
  static propTypes = {
    for: PropTypes.array.isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    const { columnExtensions = [] } = this.props
    this.DateEditor = (editorProps) => (
      <DateEditorBase columnExtensions={columnExtensions} {...editorProps} />
    )
  }

  render () {
    // console.log(this)
    const { for: dtpFor } = this.props
    return (
      <DateTypeProviderOrg for={dtpFor} editorComponent={this.DateEditor} />
    )
  }
}

export default DateTypeProvider
