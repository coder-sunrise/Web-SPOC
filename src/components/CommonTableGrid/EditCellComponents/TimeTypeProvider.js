/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DataTypeProvider } from '@devexpress/dx-react-grid'

import { updateCellValue } from 'utils'
import {
  TimePicker,
  TimeTypeProvider as TimeTypeProviderOrg,
  timeFormat24Hour,
} from '@/components'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonRender,
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
    if (!open && this.state.value !== undefined)
      onComponentChange.call(this, { value: this.state.value })
  }

  renderComponent = ({ editMode, ...commonCfg }) => {
    if (editMode) {
      commonCfg.onChange = this._onChange
      commonCfg.onOpenChange = this.onOpenChange
      commonCfg.onKeyDown = this.props.onKeyDown
      commonCfg.onBlur = (e) => {
        setTimeout(() => {
          this.props.onBlur(e)
        }, 1)
      }
      // commonCfg.open = true
      commonCfg.autoFocus = true
    }
    return <TimePicker {...commonCfg} />
  }

  render () {
    return getCommonRender.bind(this)(this.renderComponent)
  }
}

class TimeTypeProvider extends React.Component {
  static propTypes = {
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)

    this.TimeEditorBase = (ces, text) => (editorProps) => {
      return (
        <TimeEditorBase
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
                'time',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        editorComponent={this.TimeEditorBase(columnExtensions)}
        formatterComponent={this.TimeEditorBase(columnExtensions, true)}
        {...this.props}
      />
    )
  }
}

export default TimeTypeProvider
