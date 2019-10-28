/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { updateCellValue } from 'utils'
import {
  TimePicker,
  TimeTypeProvider as TimeTypeProviderOrg,
  timeFormat24Hour,
} from '@/components'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
} from './utils'

const dateFormat = 'DD-MMM-YYYY'
const timeFormat = 'hh:mm a'

class TimeEditorBase extends PureComponent {
  state = {
    open: false,
  }

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  _onChange = (date, value) => {
    this.setState({
      value,
    })
  }

  onOpenChange = (open) => {
    if (!open) onComponentChange.call(this, { value: this.state.value })
  }

  render () {
    const { allowClear = false, ...commonCfg } = getCommonConfig.call(this)
    commonCfg.onChange = this._onChange
    commonCfg.onOpenChange = this.onOpenChange

    return (
      <div ref={this.myRef}>
        <TimePicker allowClear={allowClear} {...commonCfg} />
      </div>
    )
  }
}

class TimeTypeProvider extends PureComponent {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)

    this.TimeEditorBase = (ces) => (editorProps) => {
      return <TimeEditorBase columnExtensions={ces} {...editorProps} />
    }
  }

  render () {
    const { columnExtensions } = this.props

    return (
      <TimeTypeProviderOrg
        for={columnExtensions
          .filter(
            (o) =>
              [
                'time',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        editorComponent={this.TimeEditorBase(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default TimeTypeProvider
