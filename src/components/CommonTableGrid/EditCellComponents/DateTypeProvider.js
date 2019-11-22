/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

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
    const {
      currency,
      format,
      editMode,
      render,
      ...commonCfg
    } = getCommonConfig.call(this)
    if (!editMode && render) {
      return render(row)
    }
    if (editMode) {
      commonCfg.onChange = this._onChange
      commonCfg.onBlur = (e) => {
        this.isFocused = false

        setTimeout(() => {
          if (!this.isFocused) this.props.onBlur(e)
        }, 1)
      }
      commonCfg.onFocus = () => {
        this.isFocused = true
      }
      commonCfg.autoFocus = true
    }
    if (!editMode && !format) {
      commonCfg.format = dateFormatLong
    }
    return (
      <div ref={this.myRef}>
        <DatePicker timeFormat={false} {...commonCfg} />
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
        <DateEditorBase
          editMode={!text}
          columnExtensions={ces}
          {...editorProps}
        />
      )
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    this.props.editingRowIds !== nextProps.editingRowIds ||
    this.props.commitCount !== nextProps.commitCount

  render () {
    const { columnExtensions } = this.props

    return (
      <DataTypeProvider
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
