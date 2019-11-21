/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

import { DateRangePicker, DateFormatter, dateFormatLong } from '@/components'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
} from './utils'

class DateEditorBase extends React.Component {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  _onChange = (date, moments, org) => {
    // console.log(date, moments, org)
    onComponentChange.call(this, { date, moments, org })
  }

  // componentDidMount () {
  //   const { columnExtensions, row, column: { name: columnName } } = this.props
  //   const cfg =
  //     columnExtensions.find(
  //       ({ columnName: currentColumnName }) => currentColumnName === columnName,
  //     ) || {}
  //   const { gridId, getRowId } = cfg
  //   const latestRow = window.$tempGridRow[gridId]
  //     ? window.$tempGridRow[gridId][getRowId(row)] || row
  //     : row
  //   updateCellValue(this.props, this.myRef.current, latestRow[columnName])
  //   this.setState({
  //     cfg,
  //     row: latestRow,
  //   })
  // }

  // _onChange = (date, moments, org) => {
  //   const {
  //     columnExtensions,
  //     column: { name: columnName },
  //     value,
  //     onValueChange,
  //     row,
  //   } = this.props

  //   const {
  //     type,
  //     code,
  //     validationSchema,
  //     isDisabled = () => false,
  //     onChange,
  //     gridId,
  //     getRowId,
  //     ...restProps
  //   } = this.state.cfg

  //   const errors = updateCellValue(this.props, this.myRef.current, date)

  //   const latestRow = window.$tempGridRow[gridId]
  //     ? window.$tempGridRow[gridId][getRowId(row)] || row
  //     : row
  //   latestRow._errors = errors
  //   const error = errors.find((o) => o.path === this.state.cfg.columnName)
  //   console.log(error, errors)
  //   if (!error) {
  //     if (onChange) {
  //       onChange(date, moments, org, latestRow)
  //     }
  //   }
  // }

  render () {
    const {
      type,
      code,
      columnName,
      options,
      row,
      format,
      editMode,
      ...commonCfg
    } = getCommonConfig.call(this)

    if (!commonCfg.timeFormat) {
      commonCfg.timeFormat = false
    }
    if (!editMode && !format) {
      commonCfg.format = dateFormatLong
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
      commonCfg.open = true
      commonCfg.autoFocus = true
    }
    // console.log(commonCfg)
    return (
      <div ref={this.myRef}>
        <DateRangePicker {...commonCfg} />
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
        <DateEditorBase
          editMode={!text}
          columnExtensions={ces}
          {...editorProps}
        />
      )
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    // this.props.editingRowIds !== nextProps.editingRowIds ||
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
