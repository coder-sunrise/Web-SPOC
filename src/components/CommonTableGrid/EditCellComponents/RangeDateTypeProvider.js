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
    const { columnExtensions, row, column: { name: columnName } } = this.props
    const cfg =
      columnExtensions.find(
        ({ columnName: currentColumnName }) => currentColumnName === columnName,
      ) || {}
    const { gridId, getRowId } = cfg
    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row

    this.setState({
      error: updateCellValue(
        this.props,
        this.myRef.current,
        latestRow[columnName],
      ),
    })
  }

  render () {
    const { props } = this
    const {
      column = {},
      value,
      onValueChange,
      columnExtensions,
      row,
      text,
    } = props
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
      getRowId,
      ...restProps
    } = cfg

    const latestRow = window.$tempGridRow[gridId]
      ? window.$tempGridRow[gridId][getRowId(row)] || row
      : row

    const _onChange = (date, moments, org) => {
      const error = updateCellValue(this.props, this.myRef.current, date)

      this.setState({
        error,
      })
      if (!error) {
        if (onChange) onChange(date, moments, org, latestRow)
      }
    }
    const commonCfg = {
      onChange: _onChange,
      disabled: isDisabled(latestRow),
      defaultValue: getInitialValue ? getInitialValue(row) : value,
      value: latestRow[columnName],
      text,
    }
    // console.log('RangeDateTypeProvider', cfg, value, commonCfg)
    return (
      <div ref={this.myRef}>
        <DateRangePicker
          simple
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
  // console.log(row)
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
      <DataTypeProvider
        for={columnExtensions
          .filter(
            (o) =>
              [
                'daterange',
              ].indexOf(o.type) >= 0,
          )
          .map((o) => o.columnName)}
        formatterComponent={this.DateEditorBase(columnExtensions, true)}
        editorComponent={this.DateEditorBase(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default RangeDateTypeProvider
