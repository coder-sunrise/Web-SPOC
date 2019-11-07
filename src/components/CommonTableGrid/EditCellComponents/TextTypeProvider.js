/* eslint-disable react/no-multi-comp */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { FastField } from 'formik'
import { withStyles } from '@material-ui/core'
import { DataTypeProvider } from '@devexpress/dx-react-grid'
import debounce from 'lodash/debounce'
import { TextField, Tooltip } from '@/components'
import { updateGlobalVariable, updateCellValue } from '@/utils/utils'

import {
  onComponentDidMount,
  onComponentChange,
  getCommonConfig,
} from './utils'

const styles = (theme) => ({})

class TextEditorBase extends PureComponent {
  state = {}

  constructor (props) {
    super(props)
    this.myRef = React.createRef()
  }

  componentDidMount () {
    onComponentDidMount.call(this)
  }

  _onChange = (e) => {
    onComponentChange.call(this, { value: e.target.value })
  }

  // _onChange = (e) => {
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

  //   const errors = updateCellValue(
  //     this.props,
  //     this.myRef.current,
  //     e.target.value,
  //   )

  //   const latestRow = window.$tempGridRow[gridId]
  //     ? window.$tempGridRow[gridId][getRowId(row)] || row
  //     : row
  //   latestRow._errors = errors
  //   const error = errors.find((o) => o.path === this.state.cfg.columnName)
  //   console.log(error, errors)
  //   if (!error) {
  //     if (onChange) {
  //       onChange(e.target.value, latestRow)
  //     }
  //   }
  // }

  render () {
    const { ...commonCfg } = getCommonConfig.call(this)
    commonCfg.onChange = this._onChange

    return (
      <div ref={this.myRef}>
        <TextField {...commonCfg} />
      </div>
    )
  }
}

const TextFormatter = (columnExtensions) =>
  React.memo(
    (props) => {
      const { column: { name: columnName }, value, row } = props
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      const { type, render, onClick, ...restProps } = cfg
      if (render) {
        return render(row)
      }
      // console.log(props, cfg)
      if (type === 'link') {
        return (
          <Tooltip title={value} enterDelay={750}>
            <a
              onClick={(e) => {
                e.preventDefault()
                if (onClick) onClick(row)
              }}
              href={cfg.link || '#'}
            >
              {value}
            </a>
          </Tooltip>
        )
      }
      return (
        (
          <Tooltip title={value} enterDelay={750}>
            <span>{value}</span>
          </Tooltip>
        ) || ''
      )
    },
    (prevProps, nextProps) => {
      const { column: { name: columnName }, value, row } = nextProps
      const cfg =
        columnExtensions.find(
          ({ columnName: currentColumnName }) =>
            currentColumnName === columnName,
        ) || {}
      return (
        (prevProps === nextProps || prevProps.value === nextProps.value) &&
        typeof cfg.render !== 'function'
      )
    },
  )

export const TextEditor = withStyles(styles)(TextEditorBase)

class TextTypeProvider extends React.Component {
  static propTypes = {
    for: PropTypes.array, // .isRequired,
    columnExtensions: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.TextEditor = (columns) => (editorProps) => {
      return <TextEditor columnExtensions={columns} {...editorProps} />
    }
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    this.props.editingRowIds !== nextProps.editingRowIds ||
    this.props.commitCount !== nextProps.commitCount

  render () {
    const { columnExtensions } = this.props
    // console.log(this.props)
    const columns = columnExtensions
      .filter(
        (o) =>
          [
            'number',
            'select',
            'date',
          ].indexOf(o.type) < 0,
      )
      // .filter(
      //   (o) =>
      //     [
      //       'rowSort',
      //     ].indexOf(o.columnName) < 0,
      // )
      .map((o) => o.columnName)
    return (
      <DataTypeProvider
        for={columns}
        formatterComponent={TextFormatter(columnExtensions)}
        editorComponent={this.TextEditor(columnExtensions)}
        {...this.props}
      />
    )
  }
}

export default TextTypeProvider
