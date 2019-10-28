/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

import {
  DatePicker,
  DateTypeProvider as DateTypeProviderOrg,
  dateFormatLong,
} from '@/components'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
} from './utils'

class DateEditorBase extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  _onChange = (date, val) => {
    onComponentChange.call(this, {
      value: date || '',
    })
  }

  render () {
    const { currency, text, format, ...commonCfg } = getCommonConfig.call(this)
    commonCfg.onChange = this._onChange

    if (text && !format) {
      commonCfg.format = dateFormatLong
    }
    return (
      <div ref={this.myRef}>
        <DatePicker timeFormat={false} text={text} {...commonCfg} />
      </div>
    )
  }
}

class DateTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)

    this.DateEditorBase = (ces, text) => (editorProps) => {
      return (
        <DateEditorBase columnExtensions={ces} {...editorProps} text={text} />
      )
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    this.props.editingRowIds !== nextProps.editingRowIds ||
    this.props.commitCount !== nextProps.commitCount

  render () {
    const { columnExtensions } = this.props

    return (
      <DateTypeProviderOrg
        for={columnExtensions
          .filter(
            (o) =>
              [
                'date',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        editorComponent={this.DateEditorBase(columnExtensions)}
        formatterComponent={this.DateEditorBase(columnExtensions, true)}

        // {...this.props}
      />
    )
  }
}

export default DateTypeProvider
