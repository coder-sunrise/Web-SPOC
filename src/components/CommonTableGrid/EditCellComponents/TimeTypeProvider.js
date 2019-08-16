/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { updateCellValue } from 'utils'
import {
  TimePicker,
  TimeTypeProvider as TimeTypeProviderOrg,
} from '@/components'

const dateFormat = 'DD-MMM-YYYY'
const timeFormat = 'hh:mm a'

class TimeEditorBase extends PureComponent {
  state = {
    error: false,
    tempValue: '',
  }

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    this.setState({
      error: updateCellValue(this.props, this.myRef.current, this.props.value),
    })
  }

  onChange = (date) => {
    this.setState({
      tempValue: date,
    })
  }

  onOpenChange = (open) => {
    // update value when closing timepicker
    if (!open) {
      const { tempValue } = this.state
      const { columnExtensions, column: { name: columnName } } = this.props
      const cfg = columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      )
      if (tempValue === null || tempValue === '') {
        this.setState({
          error: updateCellValue(this.props, this.myRef.current, null),
        })
        return
      }

      const timeString = tempValue.format(cfg.format ? cfg.format : timeFormat)
      const currentDateString = cfg.currentDate.format(dateFormat)

      const fullDateTime = moment(
        `${currentDateString} ${timeString}`,
        `${dateFormat} ${timeFormat}`,
      )

      this.setState({
        error: updateCellValue(
          this.props,
          this.myRef.current,
          fullDateTime.toDate(),
        ),
      })
    }
  }

  render () {
    const { props } = this
    const {
      column = {},
      value,
      onValueChange,
      columnExtensions,
      row,
      gridId,
    } = props
    const { name: columnName } = column
    const cfg = columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    )
    const { type, isDisabled = () => false, ...restConfig } = cfg

    const commonCfg = {
      onChange: this.onChange,
      onOpenChange: this.onOpenChange,
      disabled: isDisabled(
        window.$tempGridRow[gridId]
          ? window.$tempGridRow[gridId][row.id] || {}
          : row,
      ),
      value,
    }

    return (
      <div ref={this.myRef}>
        <TimePicker
          format='hh:mm a'
          showErrorIcon
          allowClear={false}
          error={this.state.error}
          {...commonCfg}
          {...restConfig}
        />
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
