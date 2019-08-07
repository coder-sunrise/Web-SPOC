/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

import { DateRangePicker, DateFormatter } from '@/components'

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

    const {
      type,
      isDisabled = () => false,
      getInitialValue,
      onChange,
      gridId,
      ...restProps
    } = cfg
    const _onChange = (date, moments, org) => {
      const error = updateCellValue(this.props, this.myRef.current, date)

      this.setState({
        error,
      })
      if (!error) {
        if (onChange)
          onChange(
            date,
            moments,
            org,
            window.$tempGridRow[gridId]
              ? window.$tempGridRow[gridId][row.id] || {}
              : row,
          )
      }
    }
    const commonCfg = {
      onChange: _onChange,
      disabled: isDisabled(
        window.$tempGridRow[gridId]
          ? window.$tempGridRow[gridId][row.id] || {}
          : row,
      ),
      defaultValue: getInitialValue ? getInitialValue(row) : value,
      value,
    }
    // console.log(cfg, value, commonCfg)
    return (
      <div ref={this.myRef}>
        <DateRangePicker
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

const DateRangeFormatter = (columnExtensions) => (props) => {
  const { column: { name: columnName }, value, row } = props
  const cfg =
    columnExtensions.find(
      ({ columnName: currentColumnName }) => currentColumnName === columnName,
    ) || {}
  const { type, render, getInitialValue, ...restProps } = cfg
  if (render) {
    return render(row)
  }
  const v = getInitialValue ? getInitialValue(row) : value
  // console.log(cfg, value)
  if (!v || v.length === 0 || !v[0] || !v[1]) return ''
  return `${DateFormatter({ value: v[0] })} to ${DateFormatter({
    value: v[1],
  })}`
}

class RangeDateTypeProvider extends React.Component {
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
    this.props.commitCount !== nextProps.commitCount ||
    true

  render () {
    const { columnExtensions } = this.props
    return (
      <DataTypeProvider
        for={columnExtensions
          .filter(
            (o) =>
              [
                'daterange',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        formatterComponent={DateRangeFormatter(columnExtensions)}
        editorComponent={this.DateEditorBase(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default RangeDateTypeProvider
