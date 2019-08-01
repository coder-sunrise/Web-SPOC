/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

import {
  DatePicker,
  DateTypeProvider as DateTypeProviderOrg,
} from '@/components'

class DateEditorBase extends PureComponent {
  state = {
    error: false,
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

  render () {
    const { props } = this
    const { column = {}, value, onValueChange, columnExtensions, row } = props
    const { name: columnName } = column
    const cfg = columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    )
    const onChange = (date, val) => {
      // console.log(date, val)
      this.setState({
        error: updateCellValue(this.props, this.myRef.current, date || ''),
      })
    }
    const { type, isDisabled = () => false, ...restProps } = cfg

    const commonCfg = {
      onChange,
      disabled: isDisabled(row),
      defaultValue: value,
    }
    // console.log(cfg, value, props)
    return (
      <div ref={this.myRef}>
        <DatePicker
          noWrapper
          timeFormat={false}
          showErrorIcon
          error={this.state.error}
          {...commonCfg}
          {...restProps}
        />
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

    this.DateEditorBase = (ces) => (editorProps) => {
      return <DateEditorBase columnExtensions={ces} {...editorProps} />
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
        {...this.props}
      />
    )
  }
}

export default DateTypeProvider
